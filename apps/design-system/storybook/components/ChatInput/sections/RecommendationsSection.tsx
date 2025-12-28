/**
 * Recommendations Section - Expandable panel showing AI recommendations
 */
import React from "react";
import { CloseIcon } from "../icons";
import type { Recommendation } from "../types";
import styles from "../ChatInput.module.css";

interface RecommendationsSectionProps {
  recommendations: Recommendation[];
  onClose: () => void;
  onRecommendationClick: (recommendation: Recommendation) => void;
}

export function RecommendationsSection({
  recommendations,
  onClose,
  onRecommendationClick,
}: RecommendationsSectionProps) {
  return (
    <div className={styles.expandedSection}>
      <button type="button" className={styles.closeButton} onClick={onClose} aria-label="Close">
        <CloseIcon />
      </button>
      <div className={styles.recommendationsContainer}>
        {recommendations.map((rec) => (
          <div key={rec.id} className={styles.recommendationCard}>
            <div className={styles.recommendationText}>{rec.text}</div>
            {rec.confidence && <span className={styles.recommendationConfidence}>{rec.confidence}% confidence</span>}
            {rec.actionLabel && (
              <button type="button" className={styles.recommendationAction} onClick={() => onRecommendationClick(rec)}>
                {rec.actionLabel}
              </button>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
