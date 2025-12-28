/**
 * SABVoiceLayout - Voice call interface template
 *
 * A premium voice call interface for AI assistants.
 * Uses the gravity-client realtime utilities for audio streaming.
 *
 * Features:
 * - Animated avatar with speaking indicators
 * - Start/end call controls
 * - Mute/unmute toggle
 * - Connection status display
 * - Call duration timer
 */

import React from "react";
import { useVoiceCall } from "./hooks/useVoiceCall";
import { CallAvatar, CallControls, ConnectionStatus } from "./components";
import type { SABVoiceLayoutProps } from "./types";
import styles from "./SABVoiceLayout.module.css";

// Default avatar
const DEFAULT_AVATAR_URL =
  "https://res.cloudinary.com/sonik/image/upload/w_1000,ar_1:1,c_fill,g_auto,e_art:hokusai/v1765613643/gravity/face.webp";

export default function SABVoiceLayout(props: SABVoiceLayoutProps) {
  const {
    client,
    assistantName = "AI Assistant",
    assistantSubtitle = "Voice Assistant",
    logoUrl = DEFAULT_AVATAR_URL,
    brandName = "SAB Voice Assistant",
    _storybook_connected = false,
    _storybook_speaking = false,
    _storybook_listening = false,
  } = props;

  // Voice call hook - uses client.audio for all audio operations
  const {
    connectionStatus,
    isCallActive,
    isAssistantSpeaking,
    isUserSpeaking,
    isMuted,
    callDuration,
    startCall,
    endCall,
    toggleMute,
    error,
  } = useVoiceCall({
    client: client || {
      session: {
        conversationId: "demo-session",
        userId: "demo-user",
        workflowId: "demo-workflow",
        targetTriggerNode: "demo-trigger",
        chatId: "demo-chat",
      },
      sendMessage: () => {},
      sendAgentMessage: () => {},
      emitAction: () => {},
      history: { entries: [], getResponses: () => [] },
    },
  });

  // Use storybook demo state if provided
  const displayStatus = _storybook_connected ? "connected" : connectionStatus;
  const displayActive = _storybook_connected || isCallActive;
  const displaySpeaking = _storybook_speaking || isAssistantSpeaking;
  // CRITICAL: User cannot be listening while assistant is speaking (mutual exclusion)
  const displayListening = (_storybook_listening || isUserSpeaking) && !displaySpeaking;

  // Handle back button click - end call first, then dispatch event to switch template
  const handleBackClick = () => {
    // End the voice call to properly terminate the Nova stream
    if (isCallActive) {
      endCall();
    }
    // Dispatch event to switch back to chat template
    window.dispatchEvent(
      new CustomEvent("gravity:action", {
        detail: {
          type: "back_to_chat",
          data: {},
          componentId: "SABVoiceLayout",
        },
      })
    );
  };

  return (
    <div className={styles.container}>
      {/* Back button */}
      <button type="button" onClick={handleBackClick} className={styles.backButton} aria-label="Back to chat">
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className={styles.backIcon}>
          <path
            fillRule="evenodd"
            d="M7.72 12.53a.75.75 0 010-1.06l7.5-7.5a.75.75 0 111.06 1.06L9.31 12l6.97 6.97a.75.75 0 11-1.06 1.06l-7.5-7.5z"
            clipRule="evenodd"
          />
        </svg>
      </button>

      {/* Background effects */}
      <div className={styles.backgroundGradient} />
      <div className={styles.backgroundOrb1} />
      <div className={styles.backgroundOrb2} />

      {/* Main content */}
      <div className={styles.content}>
        {/* Header */}
        <div className={styles.header}>
          <h1 className={styles.brandName}>{brandName}</h1>
          <ConnectionStatus status={displayStatus} duration={callDuration} error={error} />
        </div>

        {/* Avatar section */}
        <div className={styles.avatarSection}>
          <CallAvatar
            avatarUrl={logoUrl}
            name={assistantName}
            isSpeaking={displaySpeaking}
            isConnecting={displayStatus === "connecting"}
            size="large"
          />
          <div className={styles.assistantInfo}>
            <h2 className={styles.assistantName}>{assistantName}</h2>
            <p className={styles.assistantSubtitle}>{assistantSubtitle}</p>
          </div>
        </div>

        {/* User speaking indicator - wrapper reserves space to prevent layout shift */}
        <div className={styles.userSpeakingWrapper}>
          {displayListening && (
            <div className={styles.userSpeaking}>
              <span className={styles.userSpeakingDot} />
              <span>You are speaking...</span>
            </div>
          )}
        </div>

        {/* Controls */}
        <div className={styles.controls}>
          <CallControls
            isCallActive={displayActive}
            isMuted={isMuted}
            isConnecting={displayStatus === "connecting"}
            onStartCall={startCall}
            onEndCall={endCall}
            onToggleMute={toggleMute}
          />
        </div>

        {/* Instructions */}
        {!displayActive && (
          <p className={styles.instructions}>Tap the button above to start a voice conversation with {assistantName}</p>
        )}
      </div>
    </div>
  );
}
