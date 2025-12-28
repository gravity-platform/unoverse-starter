/**
 * Type definitions for BedrockClaude node
 */

export interface BedrockClaudeInput {
  // No direct inputs - all data comes from config
}

export type BedrockClaudeModel =
  | "us.anthropic.claude-3-5-sonnet-20241022-v2:0"
  | "us.anthropic.claude-3-5-haiku-20241022-v1:0";

export type ToolChoice = "required" | "auto";

export interface ClaudeMessage {
  role: string;
  content: Array<{ text?: string; image?: { format: string; source: { bytes?: string | Buffer } } }>;
}

// Tool schema interface matching AWS Bedrock Converse API format
export interface ClaudeToolSchema {
  name: string;
  description: string;
  inputSchema: {
    json: {
      type: string;
      properties: Record<string, any>;
      required?: string[];
    };
  };
}

export interface BedrockClaudeConfig {
  model: BedrockClaudeModel;
  temperature: number;
  maxTokens: number;
  systemPrompt?: string;
  prompt: string;
  includeImageUrl?: boolean;
  imageUrl?: string;
  enableTools: boolean;
  toolChoice?: ToolChoice;
  toolSchema?: string | object; // JSON string from template field or parsed object
}

export interface BedrockClaudeServiceResponse {
  text: string;
  usage?: {
    inputTokens: number;
    outputTokens: number;
    totalTokens: number;
  };
  toolUse?: {
    toolName: string;
    toolInput: any;
  };
}

// Executor output type (with __outputs)
export interface BedrockClaudeOutput {
  __outputs: {
    output: string;
    usage?: {
      inputTokens: number;
      outputTokens: number;
      totalTokens: number;
    };
    toolUse?: {
      toolName: string;
      toolInput: any;
    };
  };
}
