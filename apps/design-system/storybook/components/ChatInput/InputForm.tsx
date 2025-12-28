/**
 * InputForm - The main text input with send/mic buttons
 */
import React from "react";
import { ChatBubbleIcon, MicrophoneIcon, StopIcon, SendIcon, SpinnerIcon } from "./icons";
import styles from "./ChatInput.module.css";
import type { FocusContext } from "./types";

interface InputFormProps {
  value: string;
  onChange: (value: string) => void;
  onSubmit: (e: React.FormEvent) => void;
  placeholder: string;
  disabled: boolean;
  enableAudio: boolean;
  isRecording: boolean;
  onMicrophoneClick?: () => void;
  focusContext?: FocusContext;
}

export function InputForm({
  value,
  onChange,
  onSubmit,
  placeholder,
  disabled,
  enableAudio,
  isRecording,
  onMicrophoneClick,
  focusContext,
}: InputFormProps) {
  return (
    <form onSubmit={onSubmit} className={styles.form}>
      <div className={styles.inputWrapper}>
        {/* Focus Mode Pill OR Chat Icon */}
        {focusContext?.isOpen ? (
          <div className={styles.focusPillInline}>
            <span className={styles.focusPillName}>{focusContext.agentName || "Assistant"}</span>
          </div>
        ) : (
          <div className={styles.icon}>
            <ChatBubbleIcon className={styles.iconSvg} />
          </div>
        )}

        <input
          type="text"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          disabled={disabled}
          className={`${styles.input} ${disabled ? styles.inputStreaming : ""} ${
            isRecording ? styles.inputRecording : ""
          } ${focusContext?.isOpen ? styles.inputFocused : ""}`}
        />

        {enableAudio && (
          <button
            type="button"
            onClick={() => {
              window.dispatchEvent(
                new CustomEvent("gravity:action", {
                  detail: {
                    type: "live_agent_template",
                    data: {},
                    componentId: "ChatInput",
                  },
                })
              );
              onMicrophoneClick?.();
            }}
            className={`${styles.micButton} ${isRecording ? styles.micButtonRecording : ""}`}
            aria-label={isRecording ? "Stop recording" : "Start voice input"}
          >
            {isRecording ? <StopIcon className={styles.micIcon} /> : <MicrophoneIcon className={styles.micIcon} />}
          </button>
        )}

        <button type="submit" disabled={disabled || !value.trim() || isRecording} className={styles.submitButton}>
          <span className={styles.srOnly}>Send message</span>
          {disabled ? (
            <SpinnerIcon
              className={styles.spinner}
              circleClassName={styles.spinnerCircle}
              pathClassName={styles.spinnerPath}
            />
          ) : (
            <SendIcon
              className={`${styles.sendIcon} ${!value.trim() ? styles.sendIconDisabled : styles.sendIconEnabled}`}
            />
          )}
        </button>
      </div>
    </form>
  );
}
