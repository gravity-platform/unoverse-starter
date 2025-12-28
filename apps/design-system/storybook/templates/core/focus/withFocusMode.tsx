/**
 * withFocusMode - HOC that wraps any history renderer with focus mode
 *
 * Alternative to FocusLayout for templates that prefer HOC pattern.
 */

import React from "react";
import type { GravityClient, HistoryEntry } from "../types";

interface WithFocusModeProps {
  history: HistoryEntry[];
  client?: GravityClient;
  [key: string]: any;
}

/**
 * HOC that wraps any history renderer with focus mode layout support
 *
 * @example
 * const FocusableHistory = withFocusMode(MyHistoryRenderer);
 * return <FocusableHistory history={history} client={client} />;
 */
export function withFocusMode<P extends WithFocusModeProps>(WrappedComponent: React.ComponentType<P>): React.FC<P> {
  return function FocusModeWrapper(props: P) {
    const { client } = props;
    const isFocusOpen = !!client?.focusState?.focusedComponentId;

    if (isFocusOpen) {
      return (
        <div
          style={{
            position: "relative",
            display: "flex",
            flexDirection: "column",
            height: "100%",
            background: "white",
          }}
        >
          <button
            onClick={() => client?.closeFocus?.()}
            aria-label="Close focus mode"
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
          <div style={{ flex: 1, display: "flex", flexDirection: "column", height: "100%" }}>
            <WrappedComponent {...(props as P)} />
          </div>
        </div>
      );
    }

    return <WrappedComponent {...(props as P)} />;
  };
}

export default withFocusMode;
