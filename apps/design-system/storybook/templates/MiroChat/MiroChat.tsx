/**
 * MiroChat — Voice call interface styled with Mirotone
 * Cloned from SABVoiceLayout with Mirotone CSS applied.
 */

import React, { useEffect, useState } from "react";
import { useVoiceCall } from "./hooks/index";
import { CallAvatar, CallControls, ConnectionStatus } from "./components";
import type { ResponseComponent, AssistantResponse } from "../core/types";
import type { MiroChatProps } from "./types";
import styles from "./MiroChat.module.css";

const DEFAULT_AVATAR_URL =
  "https://res.cloudinary.com/sonik/image/upload/w_1000,ar_1:1,c_fill,g_auto,e_art:hokusai/v1742546227/BookSwipe/girl.jpg";

export default function MiroChat(props: MiroChatProps) {
  const {
    client,
    assistantName = "Aiya",
    assistantSubtitle = "MIRO Assistant",
    logoUrl = DEFAULT_AVATAR_URL,
    brandName = "Aiya",
    _storybook_connected = false,
    _storybook_speaking = false,
    _storybook_listening = false,
  } = props;

  const [focusedComponent, setFocusedComponent] = useState<ResponseComponent | null>(null);
  const isFocusOpen = focusedComponent !== null;

  const history = client?.history?.entries ?? [];
  const focusedComponentId = client?.focusState?.focusedComponentId ?? null;

  useEffect(() => {
    if (!focusedComponentId) return;
    for (const entry of history) {
      if (entry.type !== "assistant_response") continue;
      for (const component of (entry as AssistantResponse).components) {
        if (component.id === focusedComponentId) {
          setFocusedComponent(component);
          return;
        }
      }
    }
  }, [focusedComponentId, history]);

  const closeFocus = () => {
    setFocusedComponent(null);
    client?.closeFocus?.();
  };

  useEffect(() => {
    window.dispatchEvent(
      new CustomEvent("gravity:layout", {
        detail: isFocusOpen ? { type: "expand", width: "85vw" } : { type: "collapse" },
      }),
    );
  }, [isFocusOpen]);

  const {
    connectionStatus,
    isCallActive,
    isAssistantSpeaking,
    isUserSpeaking,
    isMuted,
    isLookingUp,
    lookupToolName,
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

  const displayStatus = _storybook_connected ? "connected" : connectionStatus;
  const displayActive = _storybook_connected || isCallActive;
  const displaySpeaking = _storybook_speaking || isAssistantSpeaking;
  const displayListening = (_storybook_listening || isUserSpeaking) && !displaySpeaking;

  const handleBackClick = () => {
    if (isCallActive) endCall();
    window.dispatchEvent(
      new CustomEvent("gravity:action", {
        detail: { type: "back_to_chat", data: {}, componentId: "MiroChat" },
      }),
    );
  };

  return (
    <div className={isFocusOpen ? styles.splitContainer : styles.container}>

      {/* Voice panel */}
      <div className={isFocusOpen ? styles.voicePanel : styles.voicePanelFull}>
        <div className={styles.backgroundGradient} />
        <div className={styles.backgroundOrb1} />
        <div className={styles.backgroundOrb2} />

        <div className={styles.content}>
          {/* Name on top */}
          <h1 className={styles.brandName}>{brandName}</h1>

          {/* Avatar */}
          <div className={styles.avatarSection}>
            <CallAvatar
              avatarUrl={logoUrl}
              name={assistantName}
              isSpeaking={displaySpeaking}
              isConnecting={displayStatus === "connecting"}
              isActive={displayActive || displayStatus === "connecting"}
              size="large"
            />
            <div className={styles.subtitleSlot}>
              {displayActive && displaySpeaking ? (
                <div className={styles.audioWave}>
                  <div className={styles.bar} />
                  <div className={styles.bar} />
                  <div className={styles.bar} />
                  <div className={styles.bar} />
                  <div className={styles.bar} />
                </div>
              ) : (
                <p className={styles.assistantSubtitle}>{assistantSubtitle}</p>
              )}
            </div>
          </div>

          {/* Status indicator */}
          <div className={styles.userSpeakingWrapper}>
            {isLookingUp ? (
              <div className={styles.lookingUp}>
                <span className={styles.lookingUpDot} />
                <span className={styles.lookingUpDot} />
                <span className={styles.lookingUpDot} />
                <span>
                  {lookupToolName === "findIntent"
                    ? "Searching the knowledge base…"
                    : `Looking up ${lookupToolName ?? "information"}…`}
                </span>
              </div>
            ) : displayListening ? (
              <div className={styles.userSpeaking}>
                <span className={styles.userSpeakingDot} />
                <span>You are speaking…</span>
              </div>
            ) : null}
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

          {!displayActive && (
            <p className={styles.instructions}>
              Tap the button above to start a voice conversation with {assistantName}
            </p>
          )}
        </div>
      </div>

      {/* Focus panel */}
      {isFocusOpen && focusedComponent && (
        <div className={styles.focusPanel}>
          <button type="button" onClick={closeFocus} className={styles.focusCloseButton} aria-label="Close panel">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M18 6L6 18M6 6l12 12" />
            </svg>
          </button>
          <div className={styles.focusPanelContent}>
            {focusedComponent.Component && (
              <focusedComponent.Component
                key={focusedComponent.id}
                {...focusedComponent.props}
                nodeId={focusedComponent.nodeId}
                chatId={focusedComponent.chatId}
                displayState="focused"
              />
            )}
          </div>
        </div>
      )}
    </div>
  );
}
