/**
 * ChatHistory - Renders the conversation timeline
 * Chat-specific rendering: user messages on right, assistant responses on left
 *
 * NOTE: Focus Mode rendering is handled at the TEMPLATE level (e.g., SABChatLayout)
 * so the focused component renders outside the scrollable area.
 * This component just renders history - it does NOT handle focus mode rendering.
 */

import React from "react";
import type { HistoryEntry } from "./types";
import type { GravityClient } from "../../core/types";
import { ChatHistoryItem } from "./ChatHistoryItem";
import styles from "./ChatHistory.module.css";

interface ChatHistoryProps {
  history: HistoryEntry[];
  onQuestionClick?: (question: string) => void;
  onComponentAction?: (actionType: string, actionData: any) => void;
  /** Client context for focus mode (passed to ChatHistoryItem for expand button) */
  client?: GravityClient;
}

export function ChatHistory({ history, onQuestionClick, onComponentAction, client }: ChatHistoryProps) {
  // Empty state
  if (history.length === 0) {
    return (
      <div className={styles.emptyState}>
        <h1 className={styles.emptyTitle}>Gravity AI</h1>
        <p className={styles.emptySubtitle}>How can I help you today?</p>
      </div>
    );
  }

  // Render history timeline (focus mode is handled at template level)
  return (
    <div className={styles.historyContainer}>
      {history.map((entry) => {
        // User message - chat bubble on right
        if (entry.type === "user_message") {
          return (
            <div key={entry.id} className={styles.userMessageContainer}>
              <div className={styles.userMessageBubble}>
                <div className={styles.userMessageText}>{entry.content}</div>
              </div>
            </div>
          );
        }

        // Assistant response - can contain multiple components
        if (entry.type === "assistant_response") {
          return (
            <ChatHistoryItem
              key={entry.id}
              response={entry}
              onQuestionClick={onQuestionClick}
              onComponentAction={onComponentAction}
              client={client}
            />
          );
        }

        return null;
      })}
    </div>
  );
}
