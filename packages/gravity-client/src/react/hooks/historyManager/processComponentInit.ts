/**
 * Process COMPONENT_INIT events
 */

import type { HistoryManager } from "../../../core/HistoryManager";
import type { TemplateInfo, ComponentInitEvent } from "./types";

interface ProcessComponentInitOptions {
  event: ComponentInitEvent;
  manager: HistoryManager;
  activeResponsesRef: React.MutableRefObject<Record<string, string>>;
  loadComponent?: (url: string, name: string) => Promise<any>;
  sendComponentReady?: (componentName: string, messageId: string) => void;
  withZustandData?: (Component: any) => any;
  setActiveTemplate: React.Dispatch<React.SetStateAction<TemplateInfo | null>>;
  setTemplateStack: React.Dispatch<React.SetStateAction<TemplateInfo[]>>;
  openFocus?: (
    componentId: string,
    targetTriggerNode: string | null,
    chatId: string | null,
    agentName?: string | null
  ) => void;
  setComponentData?: (key: string, data: Record<string, any>) => void;
}

export async function processComponentInit({
  event,
  manager,
  activeResponsesRef,
  loadComponent,
  sendComponentReady,
  withZustandData,
  setActiveTemplate,
  setTemplateStack,
  openFocus,
  setComponentData,
}: ProcessComponentInitOptions): Promise<void> {
  const { component, nodeId, chatId, metadata } = event;

  console.log(`[History] 🔍 COMPONENT_INIT received:`, { nodeId, componentType: component?.type, chatId });

  // Handle template components
  if (nodeId && nodeId.includes("_template")) {
    console.log(`[History] 🎯 Template COMPONENT_INIT detected:`, { nodeId, template: component?.type });
    if (loadComponent) {
      try {
        const Component = await loadComponent(component.componentUrl, component.type);
        const newTemplate: TemplateInfo = {
          Component,
          name: component.type,
          nodeId,
          props: component.props || {},
        };

        // Update both activeTemplate and templateStack for consistency
        // This ensures TemplateRenderer renders the new template regardless of which it checks first
        setActiveTemplate(newTemplate);
        setTemplateStack([newTemplate]);

        console.log(`[History] ✅ Template switched via COMPONENT_INIT: ${component.type}`);
        sendComponentReady?.(component.type, event.id || "");
      } catch (error) {
        console.error("[History] Failed to load template:", component.type, error);
      }
    }
    return;
  }

  if (!chatId) {
    console.error("[useHistoryManager] COMPONENT_INIT missing chatId:", event.id);
    return;
  }

  // Load component and wrap with Zustand data HOC
  if (loadComponent) {
    const LoadedComponent = await loadComponent(component.componentUrl, component.type);

    if (!LoadedComponent) {
      console.error("[History] ❌ Failed to load component:", component.type);
      return;
    }

    // Wrap component with Zustand data HOC if provided
    const WrappedComponent = withZustandData ? withZustandData(LoadedComponent) : LoadedComponent;

    // Find the active response for this chatId
    const responseId = activeResponsesRef.current[chatId];
    if (responseId) {
      const stateKey = `${chatId}_${nodeId}`;

      // Always update Zustand first (accumulative merge)
      // Use setComponentData which now merges props to support streaming updates
      if (setComponentData && component.props) {
        setComponentData(stateKey, component.props);
      }

      // Check if component already exists in history
      const response = manager.getHistory().find((e: any) => e.id === responseId) as any;
      const existingComponents = response?.components || [];
      const alreadyExists = existingComponents.some((c: any) => c.chatId === chatId && c.nodeId === nodeId);

      if (alreadyExists) {
        // Component exists - Zustand already updated, done
        sendComponentReady?.(component.type, event.id || "");
        return;
      }

      // First time - add component to response
      const updatedResponse = manager.addComponentToResponse(
        responseId,
        {
          type: component.type,
          componentUrl: component.componentUrl,
          nodeId,
          chatId,
          props: component.props || {},
          metadata: metadata || {}, // Use top-level metadata from event
        },
        WrappedComponent
      );

      // Auto-focus focusable components on load
      if (component.props?.focusable === true && openFocus && updatedResponse) {
        // Get the component ID from the last added component in the response
        const addedComponent = updatedResponse.components[updatedResponse.components.length - 1];
        const targetTriggerNode = metadata?.targetTriggerNode || null; // Use top-level metadata
        const agentName = component.props?.focusLabel || component.type || null;

        if (addedComponent?.id) {
          openFocus(addedComponent.id, targetTriggerNode, chatId, agentName);
        }
      }
    } else {
      console.warn("[History] ⚠️ No active response for chatId:", chatId);
    }

    sendComponentReady?.(component.type, event.id || "");
  } else {
    console.error("[History] ❌ loadComponent function not available");
  }
}
