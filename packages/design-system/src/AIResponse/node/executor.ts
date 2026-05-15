/**
 * AIResponse Node Executor
 * Auto-generated from Storybook component
 */

import { PromiseNode, type ValidationResult, type NodeExecutionContext } from "@gravity-platform/plugin-base";
import { AIResponseConfig, AIResponseOutput } from "../util/types";
import { loadDefaultTemplate } from "../service/templates";
import { publishComponent } from "../service/publishComponent";

export default class AIResponseExecutor extends PromiseNode {
  constructor() {
    super("AIResponse");
  }

  protected async validateConfig(config: AIResponseConfig): Promise<ValidationResult> {
    return { success: true };
  }

  protected async executeNode(
    inputs: Record<string, any>,
    config: AIResponseConfig,
    context: NodeExecutionContext
  ): Promise<AIResponseOutput> {
    // Pass config values to component
    // Include all defined props, even empty strings (for streaming text)
    const props: Record<string, any> = {};
    
    // Always pass focusable and focusLabel (universal Focus Mode config)
    if (config.focusable !== undefined) {
      props.focusable = config.focusable;
    }
    if (config.focusLabel !== undefined) {
      props.focusLabel = config.focusLabel;
    }
    if (config.progressText !== undefined) {
      props.progressText = config.progressText;
    }
    if (config.text !== undefined) {
      props.text = config.text;
    }
    if (config.questions !== undefined) {
      props.questions = config.questions;
    }

    // Load template (just need componentUrl)
    const template = loadDefaultTemplate();

    // Generate ComponentSpec - minimal payload
    const componentSpec = {
      type: "AIResponse",
      version: "1.0.0",
      nodeId: context.nodeId, // Include nodeId at top level for client
      props,
      componentUrl: template.componentUrl,
      nodeSize: { width: 750, height: 400 },
      metadata: {
        dataSource: "direct",
        nodeId: context.nodeId,
        executionId: context.executionId,
      },
    };

    this.logger.info(`✅ [AIResponse] ComponentSpec generated for node: ${context.nodeId}`);

    // Publish component to client
    // Get publishing context from workflow execution (chatId, userId, etc.)
    if (!context.publishingContext) {
      throw new Error("Publishing context not available - cannot publish component");
    }
    
    await publishComponent(
      {
        component: componentSpec,
        chatId: context.publishingContext.chatId,
        conversationId: context.publishingContext.conversationId,
        userId: context.publishingContext.userId,
        providerId: context.publishingContext.providerId,
        workflowId: context.workflowId,
        workflowRunId: context.executionId,
        nodeId: context.nodeId,
        targetTriggerNode: context.publishingContext.targetTriggerNode, // For Focus Mode routing
      },
      context.api,
      context // Pass full context for workflow state access
    );

    return {
      __outputs: {
        componentSpec,
      },
    };
  }
}
