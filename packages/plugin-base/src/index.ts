/**
 * Unified Plugin Base and Platform Dependencies
 *
 * This file combines plugin interfaces with platform dependencies,
 * eliminating redundancy across plugin packages.
 */

import type { MCPTraceInput } from "./types";

/**
 * Plugin interface that packages must implement
 */
export interface GravityPlugin {
  name: string;
  version?: string;
  description?: string;
  setup(api: GravityPluginAPI): void | Promise<void>;
}

/**
 * API provided by Gravity to plugins
 */
export interface GravityPluginAPI {
  // Registration methods
  registerNode(node: PluginNodeDefinition): void;
  registerService(name: string, service: any): void;
  registerCredential(credential: any): void;
  registerComponentPath?(packagePath: string): void;

  // Platform utilities
  createLogger(name: string): any;
  getConfig(): any;
  saveTokenUsage(usage: any): Promise<void>;
  saveMCPTrace(trace: MCPTraceInput): Promise<string>;
  getNodeCredentials(context: any, credentialName: string): Promise<any>;
  callService(method: string, params: any, context: any): Promise<any>;
  getRedisClient(): any; // For reading from Redis
  gravityPublish(channel: string, message: any): Promise<void>;

  // Audio WebSocket support (optional)
  getAudioWebSocketManager?: () => any;

  // WebSocket manager for AI components
  getWebSocketManager?: () => any;

  /**
   * Publish streaming update directly to client (bypasses workflow for real-time streaming)
   * Used by CallbackNodes like OpenAIStream to send text chunks directly to client
   */
  publishStreamingUpdate?: (config: { componentType: string; props: Record<string, any> }) => void;

  // Workflow execution utilities
  executeNodeWithRouting?: (
    executeNode: (inputs: any, config: any, context: any) => Promise<any>,
    params: any,
    config: any,
    context: any
  ) => Promise<any>;

  // Base classes for extending
  classes: {
    PromiseNode: any;
    CallbackNode: any;
  };

  // Type definitions and enums
  types: {
    NodeInputType: any;
    NodeConcurrency: any;
  };
}

/**
 * Node definition from a plugin
 */
export interface PluginNodeDefinition {
  definition: any; // EnhancedNodeDefinition
  executor: any; // Node executor class or instance
}

/**
 * Platform dependencies for internal use
 * These are injected by the plugin setup
 */
export interface PlatformDependencies {
  // Base classes
  PromiseNode: any;
  CallbackNode: any;

  // Type enums
  NodeInputType: any;
  NodeConcurrency: any;

  // Platform functions
  getNodeCredentials: (context: any, credentialName: string) => Promise<any>;
  getConfig: () => any;
  createLogger: (name: string) => any;
  saveTokenUsage: (usage: any) => Promise<void>;
  callService: (method: string, params: any, context: any) => Promise<any>;
  getRedisClient: () => any; // For reading from Redis
  gravityPublish: (channel: string, message: any) => Promise<void>;

  // Workflow execution
  executeNodeWithRouting?: (
    executeNode: (inputs: any, config: any, context: any) => Promise<any>,
    params: any,
    config: any,
    context: any
  ) => Promise<any>;

  // Audio WebSocket support (optional)
  getAudioWebSocketManager?: () => any;

  // Allow additional properties for compatibility
  [key: string]: any;
}

// Type exports for compile-time usage
export type NodeInputType = any;
export type NodeInput = any;
export type NodeOutput = any;
export type NodeDefinition = any;
export type NodeExecutor = any;
export type NodeExecutionContext = any;
export type NodeLifecycle = any;
export type WorkflowNode = any;
export type EnhancedNodeDefinition = any;
export type NodeCredential = any;
export type ValidationResult = any;

// ============================================================================
// DIRECT EXPORTS - Use these instead of getPlatformDependencies()
// ============================================================================

/**
 * Base class for Promise-based nodes
 * Import directly: import { PromiseNode } from "@gravity-platform/plugin-base"
 */
export class PromiseNode {
  nodeType: string;
  logger: any = { info: () => {}, error: () => {}, debug: () => {} };

  constructor(name: string) {
    this.nodeType = name || "stub";
  }

  protected async validateConfig(config: any): Promise<any> {
    return { success: true };
  }

  protected async executeNode(inputs: any, config: any, context: any): Promise<any> {
    return {};
  }

  protected validateAndGetContext(context: any) {
    return {
      workflowId: context?.workflowId || context?.workflow?.id || "",
      executionId: context?.executionId || context?.workflow?.runId || "",
      nodeId: context?.nodeId || "",
    };
  }

  protected getExecutionContext(context: any) {
    return {
      workflowId: context?.workflowId || context?.workflow?.id || "",
      executionId: context?.executionId || context?.workflow?.runId || "",
      nodeId: context?.nodeId || "",
      nodeType: context?.nodeType || this.nodeType || "",
      config: context?.config || {},
      credentials: context?.credentials || {},
    };
  }

  async execute(inputs: any, config: any, context: any): Promise<any> {
    return this.executeNode(inputs, config, context);
  }
}

/**
 * Base class for Callback-based nodes
 * Import directly: import { CallbackNode } from "@gravity-platform/plugin-base"
 */
export class CallbackNode {
  constructor(name: string) {}
}

/**
 * Node input type enum
 * Import directly: import { NodeInputType } from "@gravity-platform/plugin-base"
 */
export const NodeInputType = {
  STRING: "string",
  OBJECT: "object",
  ARRAY: "array",
  NUMBER: "number",
  BOOLEAN: "boolean",
};

// NodeConcurrency is exported from ./types with proper enum values:
// SEQUENTIAL, LOW, MEDIUM, HIGH, UNLIMITED

// Global platform instance
let platformDeps: PlatformDependencies | null = null;

/**
 * Set platform dependencies (called by plugin setup)
 * ONLY THE FIRST CALL IS ACCEPTED - prevents overwriting
 */
export function setPlatformDependencies(deps: PlatformDependencies) {
  // Only set once - first plugin wins
  if (platformDeps !== null) {
    return; // Already set, ignore
  }
  platformDeps = deps;
}

/**
 * DEPRECATED - Use direct imports for base classes and context.api for runtime functions
 * @deprecated Will be removed in next major version
 */
export function getPlatformDependencies(): PlatformDependencies {
  // This function is only kept for backward compatibility
  // New code should:
  // 1. Import base classes directly: import { PromiseNode } from "@gravity-platform/plugin-base"
  // 2. Use context.api for runtime functions: context.api.createLogger(), context.api.gravityPublish()

  if (!platformDeps) {
    // Return stub implementations that won't crash at module load
    return {
      packageVersion: "1.1.1",
      PromiseNode,
      CallbackNode,
      NodeInputType,
      NodeConcurrency: {}, // Legacy stub
      getConfig: () => ({}),
      createLogger: () => ({ info: () => {}, error: () => {}, debug: () => {}, warn: () => {} }),
      saveTokenUsage: () => Promise.resolve(),
      saveMCPTrace: () => Promise.resolve(),
      callService: () => Promise.resolve(null),
      getRedisClient: () => null,
      gravityPublish: async () => {},
      executeNodeWithRouting: async () => ({}),
      getAudioWebSocketManager: () => null,
      // getNodeCredentials stub - will be replaced when platform is initialized
      getNodeCredentials: async (context: any, credentialName: string) => {
        if (platformDeps?.getNodeCredentials) {
          return platformDeps.getNodeCredentials(context, credentialName);
        }
        // Fallback: try to get from context directly
        return context?.credentials?.[credentialName] || {};
      },
    } as any;
  }
  return platformDeps;
}

/**
 * Helper to create a plugin
 */
export function createPlugin(config: {
  name: string;
  version?: string;
  description?: string;
  setup: (api: GravityPluginAPI) => void | Promise<void>;
}): GravityPlugin {
  return config;
}

/**
 * Initialize platform dependencies from plugin API
 */
export function initializePlatformFromAPI(api: GravityPluginAPI) {
  setPlatformDependencies({
    // Core dependencies from API
    PromiseNode: api.classes.PromiseNode,
    CallbackNode: api.classes.CallbackNode,
    NodeInputType: api.types.NodeInputType,
    NodeConcurrency: api.types.NodeConcurrency,
    getNodeCredentials: api.getNodeCredentials,
    getConfig: api.getConfig,
    createLogger: api.createLogger,
    saveTokenUsage: api.saveTokenUsage,
    saveMCPTrace: api.saveMCPTrace,
    callService: api.callService,
    getRedisClient: api.getRedisClient,
    gravityPublish: api.gravityPublish,
    executeNodeWithRouting: api.executeNodeWithRouting,
    getAudioWebSocketManager: api.getAudioWebSocketManager,
    // Type placeholders (not used at runtime)
    NodeInput: null,
    NodeOutput: null,
    NodeDefinition: null,
    NodeExecutor: null,
    NodeExecutionContext: null,
    NodeLifecycle: null,
    WorkflowNode: null,
    EnhancedNodeDefinition: null,
    NodeCredential: null,
    ValidationResult: null,
  } as any);
}

// Export types
export * from "./types";

// Export shared credentials
export * from "./credentials";

// Channel constants (previously from @gravity-platform/gravity-server)
export const SYSTEM_CHANNEL = "gravity:system";
export const AI_RESULT_CHANNEL = "gravity:output";
export const QUERY_MESSAGE_CHANNEL = "gravity:query";
export const INTERNAL_REQUEST_CHANNEL = "gravity:internal";
export const WORKFLOW_EXECUTION_CHANNEL = "workflow:execution";
export const WORKFLOW_STATE_CHANNEL = "gravity:workflow:state";
