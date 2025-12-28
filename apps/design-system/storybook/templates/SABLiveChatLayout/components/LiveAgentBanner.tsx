/**
 * LiveAgentBanner - Visual indicator for live agent chat
 *
 * Shows a prominent banner when connected to a real person with:
 * - Agent avatar with online indicator
 * - Agent name and status
 * - Typing indicator
 * - End chat button
 */

import React from "react";
import type { ConnectionStatus } from "../types";
import styles from "./LiveAgentBanner.module.css";

export interface LiveAgentBannerProps {
  /** Current connection status */
  connectionStatus: ConnectionStatus;
  /** Agent name if connected */
  agentName?: string | null;
  /** Agent avatar URL */
  agentAvatar?: string | null;
  /** Whether agent is typing */
  isAgentTyping?: boolean;
  /** Error message if any */
  error?: string | null;
  /** Callback to disconnect */
  onDisconnect?: () => void;
}

// Default agent avatar - live agent photo
const DEFAULT_AVATAR =
  "https://res.cloudinary.com/sonik/image/upload/w_1000,ar_1:1,c_fill,g_auto,e_art:hokusai/v1765444311/sixflags/face_man.jpg";

// User icon SVG for fallback
const UserIcon = () => (
  <svg viewBox="0 0 24 24" fill="currentColor" className={styles.avatarIcon}>
    <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 3c1.66 0 3 1.34 3 3s-1.34 3-3 3-3-1.34-3-3 1.34-3 3-3zm0 14.2c-2.5 0-4.71-1.28-6-3.22.03-1.99 4-3.08 6-3.08 1.99 0 5.97 1.09 6 3.08-1.29 1.94-3.5 3.22-6 3.22z" />
  </svg>
);

export function LiveAgentBanner({
  connectionStatus,
  agentName,
  agentAvatar,
  isAgentTyping,
  error,
  onDisconnect,
}: LiveAgentBannerProps) {
  // Don't show banner in idle state
  if (connectionStatus === "idle") {
    return null;
  }

  // Connecting state - show spinner and message
  if (connectionStatus === "connecting") {
    return (
      <div className={styles.connectingBanner}>
        <div className={styles.connectingContent}>
          <div className={styles.spinner} />
          <div className={styles.connectingText}>
            <span className={styles.connectingTitle}>Connecting to an agent</span>
            <span className={styles.connectingSubtitle}>Please wait a moment...</span>
          </div>
        </div>
      </div>
    );
  }

  // Error state
  if (connectionStatus === "error") {
    return (
      <div className={styles.errorBanner}>
        <div className={styles.errorIcon}>
          <svg viewBox="0 0 24 24" fill="currentColor">
            <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-2h2v2zm0-4h-2V7h2v6z" />
          </svg>
        </div>
        <div className={styles.errorText}>
          <span className={styles.errorTitle}>Connection Error</span>
          <span className={styles.errorMessage}>{error || "Unable to connect. Please try again."}</span>
        </div>
      </div>
    );
  }

  // Ended state
  if (connectionStatus === "ended") {
    return (
      <div className={styles.endedBanner}>
        <span>Live agent chat has ended</span>
      </div>
    );
  }

  // Disconnected state - reconnecting
  if (connectionStatus === "disconnected") {
    return (
      <div className={styles.disconnectedBanner}>
        <div className={styles.spinner} />
        <span>Connection lost. Reconnecting...</span>
      </div>
    );
  }

  // Connected state - compact single-row banner
  return (
    <div className={styles.connectedBanner}>
      <div className={styles.avatarContainer}>
        <img src={agentAvatar || DEFAULT_AVATAR} alt={agentName || "Agent"} className={styles.avatar} />
        <span className={styles.onlineIndicator} />
      </div>

      <div className={styles.agentDetails}>
        <span className={styles.agentName}>{agentName || "Support Agent"}</span>
        {isAgentTyping ? (
          <span className={styles.typingIndicator}>
            typing
            <span className={styles.typingDots}>
              <span />
              <span />
              <span />
            </span>
          </span>
        ) : (
          <span className={styles.agentStatus}>Online • Ready to help</span>
        )}
      </div>

      {onDisconnect && (
        <button className={styles.endChatButton} onClick={onDisconnect}>
          End Chat
        </button>
      )}
    </div>
  );
}

export default LiveAgentBanner;
