/**
 * Message Transformer - Converts Amazon Connect messages to Gravity AssistantResponse format
 *
 * This ensures agent messages are stored in the same format as AI responses,
 * enabling seamless template hot-swap and unified conversation history.
 */

import { StreamingState } from "../../core";
import type { AssistantResponse, ResponseComponent } from "../../core";

/**
 * Amazon Connect message structure (from ChatJS SDK)
 */
export interface AmazonConnectMessage {
  Id: string;
  Content: string;
  ContentType: string;
  ParticipantRole: "AGENT" | "CUSTOMER" | "SYSTEM";
  DisplayName?: string;
  AbsoluteTime: string;
  Type?: string;
}

/**
 * Check if string is valid JSON
 */
function isValidJSON(str: string): boolean {
  if (typeof str !== "string") return false;
  try {
    const result = JSON.parse(str);
    return typeof result === "object" && result !== null;
  } catch {
    return false;
  }
}

/**
 * Parse interactive message content (ListPicker, TimePicker, etc.)
 *
 * Amazon Connect sends interactive content in two ways:
 * 1. ContentType: "application/vnd.amazonaws.connect.message.interactive"
 * 2. ContentType: "text/plain" with JSON body (legacy/bot messages)
 */
function parseInteractiveContent(
  content: string,
  contentType: string,
  participantRole: string
): { displayContent: string; interactiveData?: any } {
  // Try to parse JSON content (handles both interactive contentType and text/plain with JSON)
  if (isValidJSON(content)) {
    try {
      const parsed = JSON.parse(content);

      if (parsed.templateType === "ListPicker") {
        const title = parsed.data?.content?.title || "";
        const subtitle = parsed.data?.content?.subtitle || "";
        const elements = parsed.data?.content?.elements || [];

        // Return structured data for ListPicker component
        return {
          displayContent: subtitle ? `${title}\n${subtitle}` : title || "Please select an option:",
          interactiveData: {
            type: "ListPicker",
            title,
            subtitle,
            elements,
          },
        };
      }

      if (parsed.templateType === "TimePicker") {
        return {
          displayContent: parsed.data?.content?.title || "Please select a time",
          interactiveData: {
            type: "TimePicker",
            ...parsed.data?.content,
          },
        };
      }

      // Unknown interactive type - show title or raw content
      return {
        displayContent: parsed.data?.content?.title || content,
        interactiveData: parsed,
      };
    } catch (e) {
      console.warn("[messageTransformer] Failed to parse interactive content:", e);
    }
  }

  // Handle rich text/markdown
  if (contentType === "text/markdown") {
    return { displayContent: content };
  }

  // Plain text
  return { displayContent: content };
}

/**
 * Transform Amazon Connect message to Gravity AssistantResponse format
 *
 * This is the key function that enables unified history - agent messages
 * look exactly like AI responses to the template.
 *
 * Creates separate components for each element type (AIResponse for text,
 * ListPicker for interactive lists, etc.) so the server can stream them
 * as independent COMPONENT_INIT events.
 */
export function transformToAssistantResponse(acMessage: AmazonConnectMessage): AssistantResponse {
  const { displayContent, interactiveData } = parseInteractiveContent(
    acMessage.Content,
    acMessage.ContentType,
    acMessage.ParticipantRole
  );

  const components: ResponseComponent[] = [];
  const baseMetadata = {
    source: "amazon_connect",
    participantRole: acMessage.ParticipantRole,
    agentName: acMessage.DisplayName || "BOT",
    originalContentType: acMessage.ContentType,
  };

  // Always create AIResponse for text content
  if (displayContent) {
    components.push({
      id: `ac-comp-${acMessage.Id}`,
      componentType: "AIResponse",
      props: {
        content: displayContent,
      },
      metadata: baseMetadata,
    });
  }

  // Create separate component for interactive elements
  if (interactiveData?.type === "ListPicker") {
    components.push({
      id: `ac-listpicker-${acMessage.Id}`,
      componentType: "ListPicker",
      props: {
        title: interactiveData.title || "",
        subtitle: interactiveData.subtitle || "",
        elements: interactiveData.elements || [],
      },
      metadata: baseMetadata,
    });
  } else if (interactiveData?.type === "TimePicker") {
    components.push({
      id: `ac-timepicker-${acMessage.Id}`,
      componentType: "TimePicker",
      props: interactiveData,
      metadata: baseMetadata,
    });
  }

  // Create AssistantResponse in exact same format as AI responses
  const response: AssistantResponse = {
    id: `ac-${acMessage.Id}`,
    type: "assistant_response",
    role: "assistant",
    streamingState: StreamingState.COMPLETE, // Agent messages are always complete
    timestamp: new Date(acMessage.AbsoluteTime).toISOString(),
    components,
  };

  return response;
}

/**
 * Check if a history entry is from Amazon Connect
 */
export function isAmazonConnectResponse(response: AssistantResponse): boolean {
  return response.components.some((comp) => comp.metadata?.source === "amazon_connect");
}

/**
 * Get agent name from response metadata
 */
export function getAgentNameFromResponse(response: AssistantResponse): string | null {
  const agentComponent = response.components.find((comp) => comp.metadata?.agentName);
  return agentComponent?.metadata?.agentName || null;
}
