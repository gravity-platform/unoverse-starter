import type { ComponentMetadata } from "../ComponentScanner";
import { mapControlToTsType } from "./controlTypeUtils";

/**
 * Generate util/types.ts file
 */
export function generateTypes(metadata: ComponentMetadata): string {
  const propsInterface = Object.entries(metadata.argTypes)
    .map(([key, value]: [string, any]) => {
      const tsType = mapControlToTsType(value.control);
      return `  ${key}?: ${tsType};`;
    })
    .join("\n");

  return `/**
 * ${metadata.name} Types
 * Auto-generated from Storybook component
 */

export interface ${metadata.name}Config {
  /** Enable Focus Mode - allow component to expand as primary interaction surface */
  focusable?: boolean;
  /** Focus Mode Label - name shown in chat input when this component is focused */
  focusLabel?: string;
${propsInterface}
}

export interface ${metadata.name}Output {
  __outputs: {
    componentSpec: any;
  };
}

export interface ${metadata.name}Template {
  componentUrl: string;
}
`;
}
