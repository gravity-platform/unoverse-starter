/**
 * ChatHistoryItem - Renders an assistant response with multiple components
 * Each response has its own streaming state that is passed to all child components
 *
 * Follows the ChatLayout pattern with Amazon Connect extensions:
 * - Components must have Component property (pre-loaded React component)
 * - Interactive elements (ListPicker) render below the main component
 */

import React from "react";
import type { AssistantResponse, ResponseComponent } from "./types";
import { AssistantAvatar } from "./AssistantAvatar";
import { renderComponent } from "../../core";
import styles from "./ChatHistoryItem.module.css";

// Live agent avatar - SABLiveChatLayout is always for live agent
const LIVE_AGENT_AVATAR =
  "https://res.cloudinary.com/sonik/image/upload/w_1000,ar_1:1,c_fill,g_auto,e_art:hokusai/v1765444311/sixflags/face_man.jpg";

interface ChatHistoryItemProps {
  response: AssistantResponse;
  onQuestionClick?: (question: string) => void;
}

/**
 * ChatHistoryItem - Container for assistant responses
 *
 * Features:
 * - Manages streaming state for the entire response
 * - Can contain multiple components
 * - Passes streaming state to all child components
 * - Shows avatar with animation based on streaming state
 */
export function ChatHistoryItem({ response, onQuestionClick }: ChatHistoryItemProps) {
  const { streamingState, components, timestamp } = response;

  // Show animation whenever workflow is streaming/running
  const showAnimation = streamingState === "streaming";

  // Don't render anything if complete with no components (shouldn't happen, but handle gracefully)
  if (streamingState === "complete" && components.length === 0) {
    return null;
  }

  return (
    <div className={styles.container}>
      {/* Avatar - always live agent in SABLiveChatLayout */}
      <AssistantAvatar showAnimation={showAnimation} avatarUrl={LIVE_AGENT_AVATAR} />

      {/* Components container - always present to maintain layout */}
      <div className={styles.componentsContainer}>
        {components.length > 0 ? (
          <>
            {components.map((component: ResponseComponent) => {
              const { Component, id, metadata } = component;

              // Component must be loaded in history - no fallback
              if (!Component) {
                console.warn(`[ChatHistoryItem] Component not loaded for:`, id, component.componentType);
                return null;
              }

              // For ListPicker, wire onSelect to send the selection as a message
              const componentCallbacks: Record<string, any> = {
                streamingState,
                onQuestionClick,
              };

              // ListPicker needs onSelect callback
              if (component.componentType === "ListPicker") {
                componentCallbacks.onSelect = (element: { title: string }) => {
                  // Send the selected option's title as a message
                  onQuestionClick?.(element.title);
                };
              }

              return (
                <div key={id}>
                  {/* Render component from history using core helper */}
                  {renderComponent(component, componentCallbacks)}

                  {/* Agent badge for Amazon Connect */}
                  {metadata?.source === "amazon_connect" &&
                    metadata.participantRole === "AGENT" &&
                    metadata.agentName && <span className={styles.agentBadge}>{metadata.agentName}</span>}
                </div>
              );
            })}

            {/* Timestamp */}
            {timestamp && <span className={styles.timestamp}>{formatRelativeTime(timestamp)}</span>}
          </>
        ) : (
          // Show loading state when streaming but no components yet
          streamingState === "streaming" && <div className={styles.loadingState}>Thinking...</div>
        )}
      </div>
    </div>
  );
}

// Format relative time
function formatRelativeTime(date: string): string {
  const now = new Date();
  const messageDate = new Date(date);
  const diffMs = now.getTime() - messageDate.getTime();
  const diffSec = Math.floor(diffMs / 1000);

  if (diffSec < 60) return "just now";
  if (diffSec < 3600) return `${Math.floor(diffSec / 60)} min ago`;
  if (diffSec < 86400) return `${Math.floor(diffSec / 3600)} hr ago`;
  if (messageDate.toDateString() === now.toDateString()) {
    return messageDate.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
  }
  return messageDate.toLocaleDateString();
}
