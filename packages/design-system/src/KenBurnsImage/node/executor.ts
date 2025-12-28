/**
 * KenBurnsImage Node Executor
 * Auto-generated from Storybook component
 */

import { PromiseNode, type ValidationResult, type NodeExecutionContext } from "@gravity-platform/plugin-base";
import { KenBurnsImageConfig, KenBurnsImageOutput } from "../util/types";
import { loadDefaultTemplate } from "../service/templates";
import { publishComponent } from "../service/publishComponent";

export default class KenBurnsImageExecutor extends PromiseNode {
  constructor() {
    super("KenBurnsImage");
  }

  protected async validateConfig(config: KenBurnsImageConfig): Promise<ValidationResult> {
    return { success: true };
  }

  protected async executeNode(
    inputs: Record<string, any>,
    config: KenBurnsImageConfig,
    context: NodeExecutionContext
  ): Promise<KenBurnsImageOutput> {
    // Pass config values to component
    // Include all defined props, even empty strings (for streaming text)
    const props: Record<string, any> = {};
    if (config.src !== undefined) {
      props.src = config.src;
    }
    if (config.alt !== undefined) {
      props.alt = config.alt;
    }
    if (config.direction !== undefined) {
      props.direction = config.direction;
    }
    if (config.scale !== undefined) {
      props.scale = config.scale;
    }
    if (config.overlay !== undefined) {
      props.overlay = config.overlay;
    }
    if (config.grain !== undefined) {
      props.grain = config.grain;
    }
    if (config.particles !== undefined) {
      props.particles = config.particles;
    }

    // Load template (just need componentUrl)
    const template = loadDefaultTemplate();

    // Generate ComponentSpec - minimal payload
    const componentSpec = {
      type: "KenBurnsImage",
      version: "1.0.0",
      nodeId: context.nodeId, // Include nodeId at top level for client
      props,
      componentUrl: template.componentUrl,
      metadata: {
        dataSource: "direct",
        nodeId: context.nodeId,
        executionId: context.executionId,
      },
    };

    this.logger.info(`✅ [KenBurnsImage] ComponentSpec generated for node: ${context.nodeId}`);

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
