import React from "react";
import { renderComponent, filterComponents, StreamingState } from "../core";
import type { KeyServiceProps } from "./types";
import styles from "./KeyService.module.css";

// Loading skeleton for content
const ContentSkeleton = () => (
  <div className={styles.skeleton}>
    <div className={styles.skeletonTitle} />
    <div className={styles.skeletonLines}>
      <div className={styles.skeletonLine} />
      <div className={styles.skeletonLine} />
      <div className={styles.skeletonLine} />
    </div>
  </div>
);

// Loading skeleton for cards
const CardSkeleton = () => (
  <div className={styles.cardSkeleton}>
    <div className={styles.cardSkeletonImage} />
    <div className={styles.cardSkeletonTitle} />
    <div className={styles.cardSkeletonText} />
  </div>
);

/**
 * KeyService Template - Simple 2-Column Split
 *
 * Layout: Text + Card on left, Full image on right
 *
 * Components (streamed from workflow):
 * - KenBurnsImage → Full height image (right)
 * - AIResponse → Main text content (left)
 * - Card → Below text (left)
 */
export default function KeyService(props: KeyServiceProps) {
  const { client } = props;
  const history = client.history.entries;

  const latest = history.filter((e) => e.type === "assistant_response").pop();
  const components = latest?.components || [];
  const streamingState = latest?.streamingState;
  const isStreaming = streamingState === StreamingState.STREAMING;

  // Filter components by type
  const images = filterComponents(components, { include: ["kenburnsimage"] });
  const mainContent = filterComponents(components, { include: ["airesponse"] });
  const cards = filterComponents(components, { include: ["card"] });

  const hasContent = mainContent.length > 0;
  const hasCards = cards.length > 0;
  const hasImages = images.length > 0;

  return (
    <div className={styles.container}>
      {/* Left Column - Content */}
      <div className={styles.leftColumn}>
        {/* Streaming indicator */}
        {isStreaming && (
          <div className={styles.streamingIndicator}>
            <div className={styles.streamingDots}>
              <span className={styles.streamingDot} />
              <span className={styles.streamingDot} />
              <span className={styles.streamingDot} />
            </div>
            <span>Loading...</span>
          </div>
        )}

        {/* Main Content */}
        <div className={styles.content}>
          {hasContent ? mainContent.map((c) => renderComponent(c)) : <ContentSkeleton />}

          {/* Cards below content */}
          <div className={styles.cards}>{hasCards ? cards.map((c) => renderComponent(c)) : <CardSkeleton />}</div>
        </div>
      </div>

      {/* Right Column - Full Image */}
      <div className={styles.rightColumn}>
        {hasImages ? images.slice(0, 1).map((c) => renderComponent(c)) : <div className={styles.imagePlaceholder} />}
      </div>
    </div>
  );
}
