/**
 * Essential types for plugin base classes
 * These are the core types needed by PromiseNode and CallbackNode
 */

// Node input types
export enum NodeInputType {
  STRING = "string",
  NUMBER = "number",
  BOOLEAN = "boolean",
  OBJECT = "object",
  ARRAY = "array",
  ANY = "any",
  SIGNAL = "signal", // Pure control signal with no data
  // Special callback node control signals
  RESET = "reset", // Reset callback node state
  PAUSE = "pause", // Pause callback node execution
  RESUME = "resume", // Resume callback node execution
  SPAWN = "spawn", // Always spawn new callback actor
}

export interface NodeInput {
  name: string;
  type: NodeInputType;
  description?: string;
  default?: any;
}

export interface NodeOutput {
  name: string;
  type: NodeInputType;
  description?: string;
}

// Node execution context - essential for base classes
export interface NodeExecutionContext {
  nodeId: string;
  executionId: string;
  workflowId?: string;
  config?: any;
  inputs?: Record<string, any>;
  credentials?: Record<string, any>;
  shouldPublishStatus?: boolean; // Whether to publish node status updates
  workflow?: {
    id: string;
    runId: string;
    variables?: Record<string, any>;
  };
  logger?: {
    info: (message: string) => void;
    error: (message: string) => void;
    debug: (message: string) => void;
    warn: (message: string) => void;
  };
  services?: Record<string, Record<string, (...args: any[]) => Promise<any>>>;
  serviceCall?: {
    method: string;
    args: any[];
    caller: {
      nodeId: string;
      executionId: string;
    };
  };
}

// Node definition without executor
export interface NodeDefinition {
  name: string;
  description: string;
  category: string;
  color: string;
  icon?: string;
  inputs: NodeInput[];
  outputs: NodeOutput[];
}

export type NodeExecutor = (inputs: any, context: NodeExecutionContext) => Promise<any>;

// Node credential requirement definition
export interface NodeCredential {
  name: string;
  required: boolean;
  displayName?: string;
  description?: string;
}

// Node concurrency levels
export enum NodeConcurrency {
  SEQUENTIAL = 1, // One at a time (for strict ordering or shared resources)
  LOW = 50, // External APIs with user credentials
  MEDIUM = 100, // Database operations, file processing with user credentials
  HIGH = 200, // CPU-only operations, transformations
  UNLIMITED = -1, // No limit (memory permitting)
}

// Node execution mode
export enum NodeExecutionMode {
  PROMISE = "promise",
  CALLBACK = "callback",
}

// Enhanced node definition that includes full configuration schema
export interface EnhancedNodeDefinition extends NodeDefinition {
  type: string;
  logoUrl?: string;
  template?: "standard" | "service" | "mini" | "uiComponent" | "printComponent";
  nodeSize?: { width: number; height: number };
  componentTemplate?: {
    html?: string;
    css?: string;
    tokens?: Record<string, string>;
    componentUrl?: string;
  };
  configSchema?: any;
  credentials?: NodeCredential[];
  capabilities?: {
    isTrigger?: boolean;
    requiresConnection?: boolean;
    parallelizable?: boolean;
    concurrency?: NodeConcurrency; // Max concurrent executions for this node type
    executionMode?: NodeExecutionMode; // How the node should be executed - 'promise' for single output (default), 'callback' for iterative/generator nodes
  };
  services?: {
    provides?: Array<{
      name: string;
      description: string;
      implementation?: string;
      inputSchema?: any;
      outputSchema?: any;
    }>;
    requires?: Record<
      string,
      {
        description: string;
        methods: string[];
      }
    >;
  };
  serviceConnectors?: Array<{
    name: string;
    description: string;
    serviceType: string;
    methods: string[];
  }>;
  interactions?: Record<
    string,
    {
      label: string;
      description: string;
      icon?: string;
      color?: string;
    }
  >;
  testData?: any; // Only used by trigger nodes (InputTrigger, WebhookTrigger, etc.)
  isService?: boolean; // Flag to indicate this is a service node for UI purposes
}

// Node lifecycle hooks
export interface NodeLifecycle {
  onAdd?: (context: { nodeId: string; workflowId: string; config?: Record<string, any> }) => Promise<void>;
  onRemove?: (context: { nodeId: string; workflowId: string; config?: Record<string, any> }) => Promise<void>;
  onBeforeExecute?: (context: { nodeId: string; workflowId: string; config?: Record<string, any> }) => Promise<void>;
  onAfterExecute?: (context: { nodeId: string; workflowId: string; config?: Record<string, any> }) => Promise<void>;
}

// Enhanced node with lifecycle support
export interface WorkflowNode {
  definition: NodeDefinition;
  executor: NodeExecutor;
  lifecycle?: NodeLifecycle;
}

// MCP trace input interface
export interface MCPTraceInput {
  executionId: string;
  parentNodeId: string;
  toolName: string;
  arguments: any;
  result: any;
  startTime: number;
  endTime: number;
  duration: number;
  success: boolean;
  error?: string;
}

// Token usage tracking interface
export interface TokenUsage {
  workflowId: string;
  executionId: string;
  nodeId: string;
  nodeType?: string;
  model: string;
  promptTokens?: number;
  completionTokens?: number;
  totalTokens: number;
  inputTokens?: number;
  outputTokens?: number;
  timestamp?: Date;
}

// Platform configuration interface
export interface PlatformConfig {
  openai?: {
    maxTokens?: number;
  };
  REDIS_HOST?: string;
  REDIS_PORT?: number;
}

// Logger interface for consistent logging across plugins
export interface Logger {
  info: (...args: any[]) => void;
  error: (...args: any[]) => void;
  debug: (...args: any[]) => void;
  warn?: (...args: any[]) => void;
}
