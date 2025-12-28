import * as fs from "fs";
import * as path from "path";
import * as ts from "typescript";

export interface ComponentMetadata {
  name: string;
  storiesPath: string;
  componentPath: string;
  argTypes: Record<string, any>;
  storyDefaults?: Record<string, any>;
  workflowSize?: { width: number; height: number };
}

export class ComponentScanner {
  private componentsDir: string;

  constructor(componentsDir: string) {
    this.componentsDir = componentsDir;
  }

  /**
   * Scan components folder and extract metadata from stories
   *
   * NOTE: This only scans /storybook/components/ directory.
   * Templates in /storybook/templates/ are NOT scanned because they are
   * layout containers (like ChatLayout) that should NOT be generated as
   * workflow nodes or AI-streamable components. Templates are used by
   * the client app directly, not sent from the AI.
   */
  async scan(): Promise<ComponentMetadata[]> {
    const components: ComponentMetadata[] = [];

    try {
      const items = fs.readdirSync(this.componentsDir, { withFileTypes: true });

      for (const item of items) {
        if (item.isDirectory()) {
          const componentDir = path.join(this.componentsDir, item.name);

          // Look for all .stories.tsx files in the directory
          const dirContents = fs.readdirSync(componentDir);
          const storyFiles = dirContents.filter((file) => file.endsWith(".stories.tsx"));

          for (const storyFile of storyFiles) {
            const componentName = storyFile.replace(".stories.tsx", "");
            const storiesPath = path.join(componentDir, storyFile);

            // Extract metadata from stories file
            const metadata = await this.extractMetadata(componentName, storiesPath, componentDir);
            if (metadata) {
              components.push(metadata);
            }
          }
        }
      }
    } catch (error) {
      console.error("Error scanning components:", error);
    }

    return components;
  }

  /**
   * Extract component metadata from stories file using Storybook's official CSF parser
   */
  private async extractMetadata(
    name: string,
    storiesPath: string,
    componentDir: string
  ): Promise<ComponentMetadata | null> {
    try {
      // Read the stories file
      const code = fs.readFileSync(storiesPath, "utf-8");

      // Extract argTypes and story defaults from source code
      const argTypes = this.extractArgTypesFromSource(code);
      const storyDefaults = this.extractStoryDefaultsFromSource(code, componentDir);
      const workflowSize = this.extractWorkflowSizeFromSource(code);

      if (!argTypes || Object.keys(argTypes).length === 0) {
        console.warn(
          `⚠️  [ComponentScanner] SKIPPING "${name}" - no argTypes found in stories file. Add argTypes to include this template in the build.`
        );
        return null;
      }

      return {
        name,
        storiesPath,
        componentPath: path.join(componentDir, `${name}.tsx`),
        argTypes,
        storyDefaults,
        workflowSize,
      };
    } catch (error) {
      console.error(`❌ [DesignSystem] Error extracting metadata for ${name}:`, error);
      return null;
    }
  }

  /**
   * Extract argTypes from TypeScript source using TS Compiler API
   */
  private extractArgTypesFromSource(code: string): Record<string, any> {
    const argTypes: Record<string, any> = {};

    // Create a source file
    const sourceFile = ts.createSourceFile("temp.tsx", code, ts.ScriptTarget.Latest, true);

    // Find the meta object
    const visit = (node: ts.Node) => {
      // Look for: const meta: Meta<typeof Card> = { ... }
      if (ts.isVariableStatement(node)) {
        node.declarationList.declarations.forEach((declaration) => {
          if (
            ts.isVariableDeclaration(declaration) &&
            declaration.name.getText() === "meta" &&
            declaration.initializer &&
            ts.isObjectLiteralExpression(declaration.initializer)
          ) {
            // Find argTypes property
            declaration.initializer.properties.forEach((prop) => {
              if (
                ts.isPropertyAssignment(prop) &&
                prop.name.getText() === "argTypes" &&
                ts.isObjectLiteralExpression(prop.initializer)
              ) {
                // Extract each argType property
                prop.initializer.properties.forEach((argProp) => {
                  if (ts.isPropertyAssignment(argProp)) {
                    const propName = argProp.name.getText();
                    const propValue = this.parseArgTypeProperty(argProp.initializer);
                    argTypes[propName] = propValue;
                  }
                });
              }
            });
          }
        });
      }

      ts.forEachChild(node, visit);
    };

    visit(sourceFile);
    return argTypes;
  }

  /**
   * Parse an individual argType property
   */
  private parseArgTypeProperty(node: ts.Expression): any {
    const result: any = {
      control: "text",
      name: "",
    };

    if (ts.isObjectLiteralExpression(node)) {
      node.properties.forEach((prop) => {
        if (ts.isPropertyAssignment(prop)) {
          const key = prop.name.getText();
          const value = prop.initializer;

          if (key === "control") {
            // Handle string control
            if (ts.isStringLiteral(value)) {
              result.control = { type: value.text };
            }
            // Handle object control (e.g., { type: "range", min: 1, max: 10, step: 0.1 })
            else if (ts.isObjectLiteralExpression(value)) {
              result.control = this.parseObjectLiteral(value);
            }
          } else if (key === "options" && ts.isArrayLiteralExpression(value)) {
            // Extract options array
            if (!result.control || typeof result.control === "string") {
              result.control = { type: "select" };
            }
            result.control.options = value.elements.map((el) => {
              if (ts.isStringLiteral(el)) {
                return el.text;
              }
              return el.getText().replace(/['"]/g, "");
            });
          } else if (key === "description" && ts.isStringLiteral(value)) {
            result.description = value.text;
          } else if (key === "workflowInput") {
            // Extract workflowInput boolean flag
            if (value.kind === ts.SyntaxKind.TrueKeyword) {
              result.workflowInput = true;
            } else if (value.kind === ts.SyntaxKind.FalseKeyword) {
              result.workflowInput = false;
            }
          }
        }
      });
    }

    return result;
  }

  /**
   * Extract DEFAULT_DATA from stories file using TypeScript AST
   * Supports both inline DEFAULT_DATA and imported defaults (e.g., AIResponseDefaults)
   */
  private extractStoryDefaultsFromSource(code: string, componentDir: string): Record<string, any> | undefined {
    const sourceFile = ts.createSourceFile("temp.ts", code, ts.ScriptTarget.Latest, true);

    let defaultData: Record<string, any> | undefined;
    let importedDefaultsName: string | undefined;

    // First pass: Find imported defaults from "./defaults" file
    const findImports = (node: ts.Node) => {
      if (ts.isImportDeclaration(node)) {
        const importClause = node.importClause;
        const moduleSpecifier = node.moduleSpecifier;

        // Check if importing from "./defaults"
        if (
          ts.isStringLiteral(moduleSpecifier) &&
          (moduleSpecifier.text === "./defaults" || moduleSpecifier.text === "./defaults.ts")
        ) {
          if (importClause?.namedBindings && ts.isNamedImports(importClause.namedBindings)) {
            importClause.namedBindings.elements.forEach((element) => {
              const name = element.name.text;
              // Store the first import from defaults file (could be "Defaults" suffix or "default" prefix)
              if (!importedDefaultsName) {
                importedDefaultsName = name;
              }
            });
          }
        }
      }
      ts.forEachChild(node, findImports);
    };

    findImports(sourceFile);

    // Second pass: Find DEFAULT_DATA constant or Default story args
    const visit = (node: ts.Node) => {
      // Look for inline DEFAULT_DATA constant
      if (ts.isVariableStatement(node)) {
        node.declarationList.declarations.forEach((declaration) => {
          if (ts.isIdentifier(declaration.name) && declaration.name.text === "DEFAULT_DATA") {
            if (declaration.initializer && ts.isObjectLiteralExpression(declaration.initializer)) {
              defaultData = this.parseObjectLiteral(declaration.initializer);
            }
          }
        });
      }

      // Look for Default story using imported defaults (e.g., args: AIResponseDefaults or args: { bookingData: defaultBookingData })
      if (!defaultData && importedDefaultsName && ts.isVariableStatement(node)) {
        node.declarationList.declarations.forEach((declaration) => {
          if (ts.isIdentifier(declaration.name) && declaration.name.text === "Default") {
            if (declaration.initializer && ts.isObjectLiteralExpression(declaration.initializer)) {
              // Look for args property
              declaration.initializer.properties.forEach((prop) => {
                if (ts.isPropertyAssignment(prop) && ts.isIdentifier(prop.name) && prop.name.text === "args") {
                  // Case 1: args: ImportedDefaultsName (direct reference)
                  if (ts.isIdentifier(prop.initializer) && prop.initializer.text === importedDefaultsName) {
                    const defaultsPath = path.join(componentDir, "defaults.ts");
                    if (fs.existsSync(defaultsPath)) {
                      const defaultsCode = fs.readFileSync(defaultsPath, "utf-8");
                      defaultData = this.extractDefaultsFromFile(defaultsCode, importedDefaultsName);
                    }
                  }

                  // Case 2: args: { propName: importedDefault, ... } (object literal with imported values)
                  else if (ts.isObjectLiteralExpression(prop.initializer)) {
                    const argsObject: Record<string, any> = {};
                    prop.initializer.properties.forEach((argProp) => {
                      if (ts.isPropertyAssignment(argProp) && ts.isIdentifier(argProp.name)) {
                        const propName = argProp.name.text;

                        // Check if value is an imported default
                        if (ts.isIdentifier(argProp.initializer)) {
                          const valueName = argProp.initializer.text;
                          // Load the imported default from defaults.ts
                          const defaultsPath = path.join(componentDir, "defaults.ts");
                          if (fs.existsSync(defaultsPath)) {
                            const defaultsCode = fs.readFileSync(defaultsPath, "utf-8");
                            const importedValue = this.extractDefaultsFromFile(defaultsCode, valueName);
                            if (importedValue) {
                              argsObject[propName] = importedValue;
                            }
                          }
                        } else {
                          // Parse inline value
                          const value = this.parseExpression(argProp.initializer);
                          if (value !== undefined) {
                            argsObject[propName] = value;
                          }
                        }
                      }
                    });
                    if (Object.keys(argsObject).length > 0) {
                      defaultData = argsObject;
                    }
                  }
                }
              });
            }
          }
        });
      }

      ts.forEachChild(node, visit);
    };

    visit(sourceFile);
    return defaultData;
  }

  /**
   * Extract defaults from a defaults.ts file
   */
  private extractDefaultsFromFile(code: string, exportName: string): Record<string, any> | undefined {
    const sourceFile = ts.createSourceFile("defaults.ts", code, ts.ScriptTarget.Latest, true);

    let defaults: Record<string, any> | undefined;

    const visit = (node: ts.Node) => {
      if (ts.isVariableStatement(node)) {
        node.declarationList.declarations.forEach((declaration) => {
          if (ts.isIdentifier(declaration.name) && declaration.name.text === exportName) {
            if (declaration.initializer && ts.isObjectLiteralExpression(declaration.initializer)) {
              defaults = this.parseObjectLiteral(declaration.initializer);
            }
          }
        });
      }
      ts.forEachChild(node, visit);
    };

    visit(sourceFile);
    return defaults;
  }

  /**
   * Parse TypeScript ObjectLiteralExpression to plain object
   */
  private parseObjectLiteral(node: ts.ObjectLiteralExpression): Record<string, any> {
    const result: Record<string, any> = {};

    node.properties.forEach((prop) => {
      if (ts.isPropertyAssignment(prop) && ts.isIdentifier(prop.name)) {
        const name = prop.name.text;
        const value = this.parseExpression(prop.initializer);
        if (value !== undefined) {
          result[name] = value;
        }
      }
    });

    return result;
  }

  /**
   * Parse TypeScript expression to JavaScript value
   */
  private parseExpression(node: ts.Expression): any {
    if (ts.isStringLiteral(node)) {
      return node.text;
    }
    if (ts.isNumericLiteral(node)) {
      return Number(node.text);
    }
    if (node.kind === ts.SyntaxKind.TrueKeyword) {
      return true;
    }
    if (node.kind === ts.SyntaxKind.FalseKeyword) {
      return false;
    }
    if (node.kind === ts.SyntaxKind.UndefinedKeyword) {
      return undefined;
    }
    if (ts.isArrayLiteralExpression(node)) {
      return node.elements.map((el) => this.parseExpression(el));
    }
    if (ts.isObjectLiteralExpression(node)) {
      return this.parseObjectLiteral(node);
    }
    return undefined;
  }

  /**
   * Extract workflowSize from parameters.workflowSize in the meta object
   */
  private extractWorkflowSizeFromSource(code: string): { width: number; height: number } | undefined {
    const sourceFile = ts.createSourceFile("temp.tsx", code, ts.ScriptTarget.Latest, true);
    let workflowSize: { width: number; height: number } | undefined;

    const visit = (node: ts.Node) => {
      // Look for: const meta: Meta<typeof Component> = { ... }
      if (ts.isVariableStatement(node)) {
        node.declarationList.declarations.forEach((declaration) => {
          if (
            ts.isVariableDeclaration(declaration) &&
            declaration.name.getText() === "meta" &&
            declaration.initializer &&
            ts.isObjectLiteralExpression(declaration.initializer)
          ) {
            // Find parameters property
            declaration.initializer.properties.forEach((prop) => {
              if (
                ts.isPropertyAssignment(prop) &&
                prop.name.getText() === "parameters" &&
                ts.isObjectLiteralExpression(prop.initializer)
              ) {
                // Find workflowSize property inside parameters
                prop.initializer.properties.forEach((paramProp) => {
                  if (
                    ts.isPropertyAssignment(paramProp) &&
                    paramProp.name.getText() === "workflowSize" &&
                    ts.isObjectLiteralExpression(paramProp.initializer)
                  ) {
                    const sizeObj = this.parseObjectLiteral(paramProp.initializer);
                    if (sizeObj && typeof sizeObj.width === "number" && typeof sizeObj.height === "number") {
                      workflowSize = { width: sizeObj.width, height: sizeObj.height };
                    }
                  }
                });
              }
            });
          }
        });
      }

      ts.forEachChild(node, visit);
    };

    visit(sourceFile);
    return workflowSize;
  }
}
