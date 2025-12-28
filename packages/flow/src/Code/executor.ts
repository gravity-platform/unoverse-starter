/**
 * Code Node Executor
 * Executes custom JavaScript code with access to inputs and context
 *
 * Security considerations:
 * - Runs in isolated VM context
 * - Limited access to Node.js APIs
 * - Timeout protection
 * - Memory limits
 */

import { NodeExecutionContext, ValidationResult } from "@gravity-platform/plugin-base";
import { PromiseNode } from "../shared/platform";
import { createContentHash, createUniversalId } from "./utils/hashUtils";

interface CodeConfig {
  code: any; // Can be a string or already-resolved object from template
  generateIds?: boolean; // Toggle for generating universalId and contentId
}

export default class CodeExecutor extends PromiseNode<CodeConfig> {
  constructor() {
    super("Code");
  }

  protected async validateConfig(config: CodeConfig): Promise<ValidationResult> {
    // Config validation happens in the template resolver
    return { success: true };
  }

  protected async executeNode(
    inputs: Record<string, any>,
    config: CodeConfig,
    context: NodeExecutionContext
  ): Promise<any> {
    try {
      // The template resolver has already executed the code if it was a JS template
      // If config.code is already resolved, just use it
      const result = config.code;

      // If generateIds is enabled, also generate IDs
      if (config.generateIds) {
        const workflowId = context.workflow?.id || "unknown";
        const nodeId = context.nodeId || "code";

        // Include the result content in the universalId hash
        const universalId = createUniversalId(workflowId, nodeId, result);
        const contentId = createContentHash(result);

        this.logger.info("Generated IDs for output", {
          workflowId,
          nodeId,
          universalId,
          contentId,
        });

        // Return both output and ids
        return {
          __outputs: {
            output: result,
            ids: {
              universalId,
              contentId,
            },
          },
        };
      }

      // Just return the result to output connector
      return {
        __outputs: {
          output: result,
          // Don't include ids when not generated - selective routing
        },
      };
    } catch (error: any) {
      this.logger.error(`Code execution failed:`, error);
      throw new Error(`Code execution failed: ${error.message}`);
    }
  }
}
