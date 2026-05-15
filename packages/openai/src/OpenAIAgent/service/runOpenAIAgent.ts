import { Agent, run, tool, setDefaultOpenAIClient } from "@openai/agents";
import type { OpenAIAgentConfig, OpenAIAgentOutput } from "../util/types";
import { discoverMCPTools } from "../../shared/openaiStream/mcp/toolDiscovery";
import { initializeOpenAIClient } from "../../shared/openaiStream/client/openaiClient";
import { TextEmitter } from "../../shared/openaiStream/streaming/textEmitter";
import { formatToolFeedback } from "../../shared/toolFeedback";

type CredentialContext = any;
type NodeExecutionContext = any;
type EmitFn = (output: any) => void;

export async function runOpenAIAgent(
  config: OpenAIAgentConfig,
  context: CredentialContext,
  logger: any,
  executionContext: NodeExecutionContext,
  emit: EmitFn,
  _previousResponseId?: string,
): Promise<OpenAIAgentOutput> {
  // Get conversation state from Redis (multi-turn with 30-min TTL)
  let previousResponseId: string | undefined;
  const redis = executionContext?.api?.getRedisClient?.();
  const pubCtx = executionContext?.publishingContext;
  const convKey =
    pubCtx?.conversationId && pubCtx?.userId && executionContext?.workflow?.id
      ? { workflowId: executionContext.workflow.id, conversationId: pubCtx.conversationId, userId: pubCtx.userId }
      : null;

  const redisKey = convKey ? `openai:conv:${convKey.workflowId}:${convKey.conversationId}:${convKey.userId}` : null;
  logger.info(`[OpenAIAgent] Redis key=${redisKey}, hasRedis=${!!redis}`);

  // Check for reset trigger
  const promptLower = (config.prompt || "").toLowerCase().trim();
  if (promptLower === "reset conversation" || promptLower === "reset_conversation") {
    if (redis && redisKey) {
      try {
        await redis.del(redisKey);
        logger.info(`[OpenAIAgent] Conversation reset by user`);
      } catch (e) {
        logger.warn(`[OpenAIAgent] Reset failed: ${(e as Error).message}`);
      }
    }
    return {
      __outputs: {
        chunk: "Conversation reset. How can I help you?",
        text: "Conversation reset. How can I help you?",
      },
    };
  }

  // Load previous response ID from Redis
  if (redis && redisKey) {
    try {
      const cached = await redis.get(redisKey);
      if (cached) {
        const convState = JSON.parse(cached);
        previousResponseId = convState.lastResponseId;
        logger.info(`[OpenAIAgent] Resuming from ${previousResponseId}`);
      } else {
        logger.info(`[OpenAIAgent] New conversation`);
      }
    } catch (e) {
      logger.warn(`[OpenAIAgent] Redis error: ${(e as Error).message}`);
    }
  }

  // Initialize OpenAI client with platform credentials and set as SDK default
  const openai = await initializeOpenAIClient(context, logger, executionContext?.api);
  setDefaultOpenAIClient(openai);

  // Discover MCP tools from connected nodes
  const mcpConfig = await discoverMCPTools(executionContext, logger, undefined, executionContext?.api);

  // Bridge MCP tools to SDK tool() format
  const sdkTools = mcpConfig ? bridgeMCPToSDKTools(mcpConfig.tools, mcpConfig.mcpService, logger) : [];

  // Build instructions
  let instructions = config.systemPrompt || "";
  if (sdkTools.length > 0 && config.enablePreambles !== false) {
    instructions += "\n\nBefore you call a tool, explain why you are calling it.";
  }
  if (!sdkTools.length) {
    instructions +=
      "\n\nTools are unavailable in this environment. Do not call tools. Provide the best possible direct answer to the user.";
  }
  if (config.enableMarkdown) {
    instructions +=
      "\n\nUse Markdown formatting where semantically correct (e.g., `inline code`, ```code fences```, lists, tables).";
  }

  // Create SDK Agent
  const agent = new Agent({
    name: config.agentName || "GravityAgent",
    model: config.model,
    instructions: instructions || undefined,
    tools: sdkTools,
  });

  // Run with streaming
  const textEmitter = new TextEmitter(emit, logger);
  let progressLog = "";
  let finalText = "";
  let accumulatedText = "";

  const emitProgress = (text: string) => {
    progressLog += text;
    emit({ __outputs: { progress: progressLog } });
  };

  try {
    const stream = await run(agent, config.prompt, {
      stream: true,
      maxTurns: config.maxTurns || 15,
      previousResponseId,
    });

    for await (const event of stream) {
      if (event.type === "raw_model_stream_event") {
        const data = event.data as any;

        if (data.type === "response.output_text.delta") {
          accumulatedText += data.delta;
          textEmitter.emitIfNeeded(accumulatedText, data.delta.length);
        }
      }

      if (event.type === "run_item_stream_event") {
        if (event.name === "tool_called") {
          const item = event.item as any;
          emitProgress(`Calling: ${item.rawItem?.name || "tool"}...\n`);
        }
        if (event.name === "tool_output") {
          const item = event.item as any;
          const toolName = item.rawItem?.call_id || "tool";
          emitProgress(`Done.\n`);
          emit({ __outputs: { mcpResult: { name: toolName, result: item.output } } });
        }
      }
    }

    await stream.completed;
    finalText = typeof stream.finalOutput === "string" ? stream.finalOutput : "";
    const responseId = stream.lastResponseId;

    // Emit final text
    if (finalText) {
      textEmitter.emitFinal(finalText);
    }

    // Save conversation state to Redis
    if (redis && redisKey && responseId) {
      try {
        await redis.setex(redisKey, 30 * 60, JSON.stringify({ lastResponseId: responseId }));
        logger.info(`[OpenAIAgent] Saved responseId ${responseId}`);
      } catch (e) {
        logger.warn(`[OpenAIAgent] Redis save failed: ${(e as Error).message}`);
      }
    }

    // Save token usage if available
    const usage = (stream as any).usage;
    if (usage && usage.total_tokens > 0 && executionContext?.api?.saveTokenUsage) {
      try {
        await executionContext.api.saveTokenUsage({
          workflowId: executionContext.workflow?.id,
          executionId: executionContext.executionId,
          nodeId: executionContext.nodeId,
          nodeType: "OpenAIAgent",
          model: config.model,
          usage,
          timestamp: new Date(),
        });
      } catch (e) {
        logger.warn(`[OpenAIAgent] Token usage save failed: ${(e as Error).message}`);
      }
    }

    return {
      __outputs: {
        chunk: finalText,
        text: finalText,
        progress: progressLog || undefined,
        responseId: responseId || undefined,
        focusInputRequired: undefined,
      },
    };
  } catch (error) {
    const errMsg = (error as Error).message || "Agent execution failed";
    logger.error(`[OpenAIAgent] Error: ${errMsg}`, { error });

    return {
      __outputs: {
        chunk: `Error: ${errMsg}`,
        text: `Error: ${errMsg}`,
        progress: progressLog || undefined,
      },
    };
  }
}

function bridgeMCPToSDKTools(mcpTools: any[], mcpService: Record<string, (input: any) => Promise<any>>, logger: any) {
  return mcpTools.map((mcpTool: any) =>
    tool({
      name: mcpTool.name,
      description: mcpTool.description || `Execute ${mcpTool.name}`,
      parameters: mcpTool.parameters || { type: "object", properties: {} },
      execute: async (args: any) => {
        logger.info(`[OpenAIAgent] Tool call: ${mcpTool.name}`, { args });
        const result = await mcpService[mcpTool.name](args);
        return typeof result === "string" ? result : JSON.stringify(result);
      },
    }),
  );
}
