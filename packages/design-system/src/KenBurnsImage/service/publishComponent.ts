/**
 * Component publishing service
 * Publishes UI components to the client via gravity:output channel
 */

import { v4 as uuid } from "uuid";

export const OUTPUT_CHANNEL = "gravity:output";

export function buildComponentEvent(config: {
  chatId: string;
  conversationId: string;
  userId: string;
  providerId?: string;
  component: Record<string, any>;
  metadata?: Record<string, any>;
}): Record<string, any> {
  if (!config.chatId || !config.conversationId || !config.userId) {
    throw new Error("chatId, conversationId, and userId are required");
  }

  return {
    id: uuid(),
    timestamp: new Date().toISOString(),
    providerId: config.providerId || "design-system",
    chatId: config.chatId,
    conversationId: config.conversationId,
    userId: config.userId,
    __typename: "GravityEvent",
    type: "GRAVITY_EVENT",
    eventType: "component",
    data: {
      component: config.component,
      metadata: config.metadata || {},
    },
  };
}

export interface ComponentPublishConfig {
  component: any;
  chatId: string;
  conversationId: string;
  userId: string;
  providerId: string;
  workflowId: string;
  workflowRunId: string;
  nodeId: string;
  metadata?: Record<string, any>;
  isUpdate?: boolean; // True for delta updates, false/undefined for initial render
  changedProps?: Record<string, any>; // Only the props that changed
}

export async function publishComponent(
  config: ComponentPublishConfig,
  api: any,
  context?: any
): Promise<{ channel: string; success: boolean; }> {
  const logger = api?.createLogger?.("ComponentPublisher") || console;

  try {
    // Get WebSocket manager to check if component is already mounted on client
    const wsManager = api?.getWebSocketManager?.();
    const websocket = wsManager?.get(config.userId, config.conversationId);
    
    // Check if component is already mounted on the client
    // Use chatId in key so each request/response pair gets its own component instance
    const mountedComponents = websocket?.mountedComponents || new Set();
    const componentKey = `${config.chatId}_${config.nodeId}`;
    const isAlreadyMounted = mountedComponents.has(componentKey);
    
    // Build message based on whether component is already mounted
    let message: any;
    
    if (!isAlreadyMounted) {
      // COMPONENT_INIT - Send component definition with props
      // Props are already filtered by executor to exclude defaults
      const initialProps = config.component.props || {};
      
      logger.info("🚀 Component INIT", {
        nodeId: config.nodeId,
        componentType: config.component.type,
        componentKey,
        props: Object.keys(initialProps),
      });
      
      message = {
        id: uuid(),
        timestamp: new Date().toISOString(),
        type: "COMPONENT_INIT",
        nodeId: config.nodeId,
        chatId: config.chatId,
        conversationId: config.conversationId,
        userId: config.userId,
        providerId: config.providerId,
        component: {
          type: config.component.type,
          componentUrl: config.component.componentUrl,
          version: config.component.version,
          props: initialProps,
        },
        metadata: {
          ...config.metadata,
          workflowId: config.workflowId,
          workflowRunId: config.workflowRunId,
          componentKey, // Send key so client can track it
        },
      };
      
      // Mark as mounted on the WebSocket connection
      if (websocket) {
        if (!websocket.mountedComponents) {
          websocket.mountedComponents = new Set();
        }
        websocket.mountedComponents.add(componentKey);
      }
    } else {
      // COMPONENT_DATA - Send only props with actual values (filter out null/"")
      const currentProps = config.component.props || {};
      
      // Filter out null and empty string values to avoid overwriting existing data
      const filteredProps = Object.entries(currentProps).reduce((acc, [key, value]) => {
        if (value !== null && value !== "") {
          acc[key] = value;
        }
        return acc;
      }, {} as Record<string, any>);
      
      logger.info("🔄 Component DATA", {
        nodeId: config.nodeId,
        componentType: config.component.type,
        props: Object.keys(filteredProps),
      });
      
      message = {
        id: uuid(),
        timestamp: new Date().toISOString(),
        type: "COMPONENT_DATA",
        nodeId: config.nodeId,
        chatId: config.chatId,
        conversationId: config.conversationId,
        userId: config.userId,
        providerId: config.providerId,
        data: filteredProps, // Send only props with values
        metadata: {
          ...config.metadata,
          workflowId: config.workflowId,
          workflowRunId: config.workflowRunId,
        },
      };
    }
    
    const event = message;

    // Check if we have a valid WebSocket connection
    if (!wsManager) {
      logger.warn("WebSocket manager not available", {
        componentType: config.component.type,
      });
      return { channel: "websocket", success: false };
    }
    
    if (!websocket) {
      logger.warn("WebSocket connection not found - component not sent", {
        userId: config.userId,
        conversationId: config.conversationId,
        componentType: config.component.type,
      });
      return { channel: "websocket", success: false };
    }
    
    // Send to WebSocket
    websocket.send(JSON.stringify(event));
    
    logger.info("✅ Message sent", {
      type: event.type,
      nodeId: config.nodeId,
    });
    
    return { channel: "websocket", success: true };
  } catch (error: any) {
    logger.error("Failed to publish UI component", {
      error: error.message,
      workflowId: config.workflowId,
      nodeId: config.nodeId,
    });
    throw error;
  }
}
