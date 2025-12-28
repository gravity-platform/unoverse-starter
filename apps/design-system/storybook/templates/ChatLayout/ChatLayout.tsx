import React, { useEffect, useRef, useMemo, useCallback } from "react";
import { StreamingState } from "../core";
import ChatInput from "../../components/ChatInput";
import { ChatHistory } from "./components/ChatHistory";
import type { ChatLayoutProps } from "./types";
import styles from "./ChatLayout.module.css";

export default function ChatLayout(props: ChatLayoutProps) {
  const { client, onStateChange, placeholder = "Ask me anything...", autoScroll = true } = props;

  // Access history directly from client
  const history = client.history.entries;

  // Wrap sendMessage to also trigger streaming state
  const sendMessage = useCallback(
    (message: string) => {
      onStateChange?.({ isStreaming: true });
      client.sendMessage(message);
    },
    [client, onStateChange]
  );

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  // Check if any response is currently streaming
  const isStreaming = useMemo(() => {
    return history.some(
      (entry) => entry.type === "assistant_response" && entry.streamingState === StreamingState.STREAMING
    );
  }, [history]);

  // Get suggestions from client state (populated via SUGGESTIONS_UPDATE WebSocket event)
  const { faqs, actions, recommendations } = useMemo(() => {
    const suggestions = client.suggestions || {};
    return {
      faqs: suggestions.faqs || [],
      actions: suggestions.actions || [],
      recommendations: suggestions.recommendations || [],
    };
  }, [client.suggestions]);

  // Auto-scroll to bottom when history changes (new messages)
  useEffect(() => {
    if (autoScroll && messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [history, autoScroll]);

  // Auto-scroll when content updates (streaming text via Zustand)
  useEffect(() => {
    if (!autoScroll || !containerRef.current) return;

    const observer = new MutationObserver(() => {
      if (messagesEndRef.current) {
        messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
      }
    });

    observer.observe(containerRef.current, {
      childList: true,
      subtree: true,
      characterData: true,
    });

    return () => observer.disconnect();
  }, [autoScroll]);

  return (
    <div className={styles.container}>
      {/* Messages Container - Scrollable with padding for fixed input */}
      <div ref={containerRef} className={styles.messagesContainer}>
        <div className={styles.messagesInner}>
          <ChatHistory history={history} onQuestionClick={sendMessage} />
          <div ref={messagesEndRef} />
        </div>
      </div>

      {/* Input Area - Fixed at bottom */}
      <div className={styles.inputArea}>
        <div className={styles.inputInner}>
          <ChatInput
            placeholder={placeholder}
            onSend={sendMessage}
            disabled={isStreaming}
            faqs={faqs}
            actions={actions}
            recommendations={recommendations}
          />
        </div>
      </div>
    </div>
  );
}
