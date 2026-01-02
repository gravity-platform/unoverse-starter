/**
 * Process WORKFLOW_STATE events
 */

import type { HistoryManager } from "../../../core/HistoryManager";
import type { TemplateInfo, WorkflowStateEvent } from "./types";

interface ProcessWorkflowStateOptions {
  event: WorkflowStateEvent;
  manager: HistoryManager;
  activeResponsesRef: React.MutableRefObject<Record<string, string>>;
  loadComponent?: (url: string, name: string) => Promise<any>;
  setActiveTemplate: React.Dispatch<React.SetStateAction<TemplateInfo | null>>;
  setTemplateStack: React.Dispatch<React.SetStateAction<TemplateInfo[]>>;
}

export async function processWorkflowState({
  event,
  manager,
  activeResponsesRef,
  loadComponent,
  setActiveTemplate,
  setTemplateStack,
}: ProcessWorkflowStateOptions): Promise<void> {
  const { state, chatId, workflowId, workflowRunId, metadata } = event;

  if (state === "WORKFLOW_STARTED") {
    console.log("[History] WORKFLOW_STARTED", { chatId, workflowId });

    // Extract template from metadata if provided
    const template = metadata?.template;
    const templateMode = metadata?.templateMode || "switch";

    // Load template if provided
    if (template && loadComponent) {
      try {
        const templateUrl = `/components/${template}.js`;
        const TemplateComponent = await loadComponent(templateUrl, template);
        const newTemplate: TemplateInfo = {
          Component: TemplateComponent,
          name: template,
          props: {},
        };

        if (templateMode === "stack") {
          setTemplateStack((prev) => [...prev, newTemplate]);
          console.log(`[History] ✅ Template stacked via WORKFLOW_STATE: ${template}`);
        } else if (templateMode === "replace") {
          setTemplateStack((prev) => {
            const newStack = [...prev];
            newStack[newStack.length - 1] = newTemplate;
            return newStack;
          });
          console.log(`[History] ✅ Template replaced via WORKFLOW_STATE: ${template}`);
        } else {
          // Default: switch mode - replace everything
          setActiveTemplate(newTemplate);
          setTemplateStack([newTemplate]);
          console.log(`[History] ✅ Template switched via WORKFLOW_STATE: ${template}`);
        }
      } catch (error) {
        console.error("[History] Failed to load template:", template, error);
      }
    }

    // Check if response already exists for this chatId
    const existingResponseId = activeResponsesRef.current[chatId];
    if (existingResponseId) {
      console.log("[History] ♻️ Reusing existing response for chatId:", chatId);
      manager.updateResponse(existingResponseId, { streamingState: "streaming" });
      return;
    }

    // Create response with streaming state
    const response = manager.addResponse({
      chatId,
      streamingState: "streaming",
      components: [],
    });

    activeResponsesRef.current[chatId] = response.id;
    console.log("[History] ✅ Response created:", response.id);
  } else if (state === "WORKFLOW_COMPLETED") {
    console.log("[History] ✅ WORKFLOW_COMPLETED - Updating response", {
      chatId,
      workflowId,
    });

    const responseId = activeResponsesRef.current[chatId];
    if (responseId) {
      manager.updateResponse(responseId, { streamingState: "complete" });
      console.log("[History] ✅ Response completed:", responseId);
    } else {
      console.warn("[History] ⚠️ No active response found for chatId:", chatId);
    }
  }
}
