/**
 * Actions Section - Expandable panel showing action cards
 */
import React from "react";
import { CloseIcon } from "../icons";
import type { Action } from "../types";
import styles from "../ChatInput.module.css";

interface ActionsSectionProps {
  actions: Action[];
  onClose: () => void;
  onActionClick: (action: Action) => void;
}

export function ActionsSection({ actions, onClose, onActionClick }: ActionsSectionProps) {
  return (
    <div className={styles.expandedSection}>
      <button type="button" className={styles.closeButton} onClick={onClose} aria-label="Close">
        <CloseIcon />
      </button>
      <div className={styles.actionsGrid}>
        {actions.map((action, index) => {
          const obj: any = action.object ?? action;
          const title = action.title || obj.title;
          const image = action.image || obj.image || obj.metadata?.images?.[0];
          // Use callToAction as the description text
          const displayText =
            obj.metadata?.callToAction ||
            action.callToAction ||
            obj.callToAction ||
            action.description ||
            obj.description ||
            title;
          // Use metadata.action as the button text (short label like "Apply Now")
          const buttonText = obj.metadata?.action || action.label || title;

          return (
            <div key={obj.universal_id || obj.id || `action-${index}`} className={styles.actionCard}>
              {image && (
                <div className={styles.actionImageContainer}>
                  <img src={image} alt="" className={styles.actionImage} />
                </div>
              )}
              <div className={styles.actionContent}>
                <p className={styles.actionText}>{displayText}</p>
                <button type="button" className={styles.actionCta} onClick={() => onActionClick(action)}>
                  {buttonText}
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
