import React from "react";
import styles from "./CallAvatar.module.css";

export interface CallAvatarProps {
  avatarUrl?: string;
  name?: string;
  isSpeaking?: boolean;
  isConnecting?: boolean;
  isActive?: boolean;
  size?: "small" | "medium" | "large";
}

export function CallAvatar({
  avatarUrl,
  name = "Assistant",
  isSpeaking = false,
  isConnecting = false,
  isActive = false,
  size = "large",
}: CallAvatarProps) {
  const initials = name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);

  return (
    <div
      className={[
        styles.container,
        styles[size],
        isSpeaking ? styles.speaking : "",
        isConnecting ? styles.connecting : "",
      ].join(" ")}
    >
      <div className={styles.avatar}>
        {avatarUrl ? (
          <img src={avatarUrl} alt={name} className={styles.avatarImage} />
        ) : (
          <span className={styles.initials}>{initials}</span>
        )}
      </div>
    </div>
  );
}
