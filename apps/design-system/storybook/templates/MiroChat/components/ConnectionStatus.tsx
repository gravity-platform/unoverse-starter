import React from "react";
import type { ConnectionStatus as ConnectionStatusType } from "../types";
import styles from "./ConnectionStatus.module.css";

export interface ConnectionStatusProps {
  status: ConnectionStatusType;
  duration?: number;
  error?: string | null;
}

function formatDuration(seconds: number): string {
  const mins = Math.floor(seconds / 60);
  const secs = seconds % 60;
  return `${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
}

export function ConnectionStatus({ status, duration = 0, error }: ConnectionStatusProps) {
  const text = {
    idle: "Ready to call",
    connecting: "Connecting…",
    connected: formatDuration(duration),
    error: error || "Connection error",
    ended: "Call ended",
  }[status] ?? "";

  return (
    <div className={[styles.container, styles[status]].join(" ")}>
      <div className={styles.indicator} />
      <span className={styles.text}>{text}</span>
    </div>
  );
}
