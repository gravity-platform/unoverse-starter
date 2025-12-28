/**
 * FocusableWrapper - Wraps focusable components with expand button
 *
 * Used by renderComponent() in helpers.tsx to add expand icon to components
 * that have focusable: true in their props.
 */

import React from "react";
import type { ResponseComponent } from "../types";

interface FocusableWrapperProps {
  /** The component data */
  component: ResponseComponent;
  /** The rendered component element */
  children: React.ReactNode;
  /** Callback to open focus mode (from client.openFocus) */
  onOpenFocus?: (
    componentId: string,
    targetTriggerNode: string | null,
    chatId: string | null,
    agentName?: string | null
  ) => void;
}

/**
 * FocusableWrapper - Wraps a component to make it focusable
 *
 * Automatically adds expand icon if component has focusable: true in props.
 * Uses client.openFocus callback for universal focus mode across all templates.
 */
export function FocusableWrapper({ component, children, onOpenFocus }: FocusableWrapperProps) {
  const isFocusable = component.props?.focusable === true;

  if (!isFocusable || !onOpenFocus) {
    return <>{children}</>;
  }

  const handleOpenFocus = () => {
    const targetTriggerNode = component.metadata?.targetTriggerNode || null;
    const chatId = component.chatId || null;
    const agentName = component.props?.focusLabel || component.componentType || null;
    onOpenFocus(component.id, targetTriggerNode, chatId, agentName);
  };

  return (
    <div style={{ position: "relative", display: "inline-block" }}>
      {children}
      <button
        onClick={handleOpenFocus}
        aria-label="Expand component"
        style={{
          position: "absolute",
          top: "12px",
          right: "12px",
          width: "32px",
          height: "32px",
          borderRadius: "8px",
          border: "none",
          background: "rgba(255, 255, 255, 0.9)",
          boxShadow: "0 2px 8px rgba(0, 0, 0, 0.15)",
          cursor: "pointer",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          color: "#374151",
          transition: "all 0.2s ease",
          zIndex: 10,
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.background = "#ffffff";
          e.currentTarget.style.boxShadow = "0 4px 12px rgba(0, 0, 0, 0.2)";
          e.currentTarget.style.transform = "scale(1.05)";
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.background = "rgba(255, 255, 255, 0.9)";
          e.currentTarget.style.boxShadow = "0 2px 8px rgba(0, 0, 0, 0.15)";
          e.currentTarget.style.transform = "scale(1)";
        }}
      >
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M15 3h6v6M9 21H3v-6M21 3l-7 7M3 21l7-7" />
        </svg>
      </button>
    </div>
  );
}

export default FocusableWrapper;
