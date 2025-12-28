/**
 * FocusLayout - Universal layout component for focus mode
 *
 * CRITICAL: This component keeps the history renderer MOUNTED at all times
 * to preserve scroll position when focus mode opens/closes.
 *
 * DO NOT use conditional rendering like: {isFocusOpen ? <Focus /> : <History />}
 * That causes History to unmount/remount, losing scroll position.
 *
 * Instead, render BOTH and hide one with CSS display:none.
 */

import React from "react";
import type { GravityClient, HistoryEntry } from "../types";
import { useFocusedComponent } from "./useFocusedComponent";

interface FocusLayoutProps {
  /** History entries */
  history: HistoryEntry[];
  /** Client context with focus state */
  client?: GravityClient;
  /** History renderer component - STAYS MOUNTED */
  children: React.ReactNode;
  /** Optional custom focus container styles */
  focusContainerClassName?: string;
  /** Optional custom close button styles */
  closeButtonClassName?: string;
}

/**
 * Universal focus mode layout
 *
 * Renders both focus mode and normal mode simultaneously,
 * hiding one with display:none to preserve component state.
 *
 * @example
 * <FocusLayout history={history} client={client}>
 *   <ChatHistory history={history} client={client} />
 * </FocusLayout>
 */
export function FocusLayout({
  history,
  client,
  children,
  focusContainerClassName,
  closeButtonClassName,
}: FocusLayoutProps) {
  const { isFocusOpen, focusedComponent, closeFocus } = useFocusedComponent(history, client);

  return (
    <>
      {/* Focus Mode Container - absolute positioned to fill parent and ignore padding */}
      {isFocusOpen && focusedComponent && (
        <div
          className={focusContainerClassName}
          style={{
            position: "absolute",
            inset: 0,
            display: "flex",
            flexDirection: "column",
            background: "white",
            zIndex: 10,
          }}
        >
          <button
            onClick={() => closeFocus?.()}
            aria-label="Close focus mode"
            className={closeButtonClassName}
            style={{
              position: "absolute",
              top: "8px",
              right: "8px",
              width: "32px",
              height: "32px",
              borderRadius: "6px",
              border: "none",
              background: "rgba(0, 0, 0, 0.05)",
              cursor: "pointer",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              color: "#6b7280",
              transition: "background 0.2s, color 0.2s",
              zIndex: 10,
            }}
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M18 6L6 18M6 6l12 12" />
            </svg>
          </button>

          <div style={{ flex: 1, display: "flex", flexDirection: "column" }}>
            {focusedComponent.Component && (
              <focusedComponent.Component
                {...focusedComponent.props}
                nodeId={focusedComponent.nodeId}
                chatId={focusedComponent.chatId}
                displayState="focused"
              />
            )}
          </div>
        </div>
      )}

      {/* Normal Mode - ALWAYS MOUNTED, hidden when focus is open */}
      <div style={{ display: isFocusOpen ? "none" : "block", height: "100%", width: "100%" }}>{children}</div>
    </>
  );
}

export default FocusLayout;
