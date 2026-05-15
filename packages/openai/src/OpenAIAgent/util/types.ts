export interface OpenAIAgentConfig {
  model: string;
  agentName?: string;
  systemPrompt?: string;
  prompt: string;
  maxTurns?: number;
  enablePreambles?: boolean;
  enableMarkdown?: boolean;
}

export interface OpenAIAgentState {
  chunk: string;
  text: string;
  reasoning?: string;
  hasStartedStreaming?: boolean;
  responseId?: string;
  continueCount?: number;
  firstExecuteTime?: number;
}

export interface OpenAIAgentOutput {
  __outputs: {
    chunk: string;
    text: string;
    progress?: string;
    reasoning?: string;
    responseId?: string;
    mcpResult?: any;
    focusInputRequired?: boolean;
  };
}
