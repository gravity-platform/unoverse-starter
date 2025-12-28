/**
 * AssistantAvatar - AI avatar with optional streaming animation
 * Flexible component that can wrap content or be used standalone
 */

import React from "react";
import styles from "./AssistantAvatar.module.css";

interface AssistantAvatarProps {
  /** Custom loading message */
  componentName?: string | null;
  /** Avatar image URL */
  avatarUrl?: string;
  /** Content to render next to avatar (optional) */
  children?: React.ReactNode;
  /** Show animation */
  showAnimation?: boolean;
}

const DEFAULT_AVATAR_URL =
  "https://res.cloudinary.com/sonik/image/upload/v1734332867/sixflags/uxgtoiaxezsfzueh5xkn.jpg";

/**
 * AssistantAvatar - Renders AI avatar with optional content and streaming state
 *
 * Usage:
 * 1. With content: <AssistantAvatar isStreaming>{content}</AssistantAvatar>
 * 2. Standalone: <AssistantAvatar isStreaming />
 */
export function AssistantAvatar({
  componentName,
  avatarUrl = DEFAULT_AVATAR_URL,
  children,
  showAnimation = false,
}: AssistantAvatarProps) {
  // Show animation when explicitly told to AND no children
  const shouldAnimate = showAnimation && !children;

  return (
    <div className={styles.container}>
      {/* AI Avatar - always visible */}
      <div className={styles.avatarContainer}>
        <img src={avatarUrl} alt="AI Assistant" className={styles.avatar} />
      </div>

      {/* Show bouncing dots animation */}
      {shouldAnimate && (
        <div className={styles.animationContainer}>
          <div className={styles.dotsContainer}>
            <div className={`${styles.dot} ${styles.dotAnimated} ${styles.dot1}`} />
            <div className={`${styles.dot} ${styles.dotAnimated} ${styles.dot2}`} />
            <div className={`${styles.dot} ${styles.dotAnimated} ${styles.dot3}`} />
          </div>
        </div>
      )}

      {/* STATE 2 & 3: STREAMING or COMPLETE - Show content */}
      {children && <div className={styles.contentContainer}>{children}</div>}
    </div>
  );
}
