import React from "react";
import { ChevronLeft } from "lucide-react";
import { renderComponent, filterComponents } from "../core";
import type { AccountTransferLayoutProps } from "./types";
import styles from "./AccountTransferLayout.module.css";

/**
 * AccountTransferLayout Template - Account Transfer Widget Display
 *
 * Displays the AccountTransferWidget component.
 * Components are streamed from the server and rendered in order.
 */
export default function AccountTransferLayout(props: AccountTransferLayoutProps) {
  const { client } = props;
  const history = client.history.entries;

  // Get all components from all assistant responses
  const allComponents = history
    .filter((e) => e.type === "assistant_response")
    .flatMap((response) => response.components || []);

  // Filter for transfer widgets
  const transferWidgets = filterComponents(allComponents, {
    include: ["accounttransferwidget"],
  });

  const handleBack = () => {
    window.dispatchEvent(
      new CustomEvent("gravity:action", {
        detail: { type: "navigate_back" },
      })
    );
  };

  return (
    <div className={styles.layout}>
      {/* Back Button */}
      <button className={styles.backButton} onClick={handleBack} aria-label="Go back">
        <ChevronLeft style={{ width: 24, height: 24 }} />
      </button>
      {/* Main Content */}
      <div className={styles.contentColumn}>
        <div className={styles.contentContainer}>
          {transferWidgets.length > 0 ? (
            <div className={styles.widgetContent}>{transferWidgets.map((c) => renderComponent(c))}</div>
          ) : (
            <div className={styles.loadingContainer}>
              <div className={styles.loadingContent}>
                <div className={styles.skeletonContent}>
                  {/* Skeleton Header */}
                  <div className={styles.skeletonHeader}>
                    <div className={styles.skeletonIcon}></div>
                    <div className={styles.skeletonHeaderText}>
                      <div className={styles.skeletonTitle}></div>
                      <div className={styles.skeletonSubtitle}></div>
                    </div>
                  </div>

                  {/* Skeleton Step Indicator */}
                  <div className={styles.skeletonSteps}>
                    <div className={styles.skeletonStep}></div>
                    <div className={styles.skeletonStepLine}></div>
                    <div className={styles.skeletonStep}></div>
                    <div className={styles.skeletonStepLine}></div>
                    <div className={styles.skeletonStep}></div>
                    <div className={styles.skeletonStepLine}></div>
                    <div className={styles.skeletonStep}></div>
                  </div>

                  {/* Skeleton Body */}
                  <div className={styles.skeletonBody}>
                    <div className={styles.skeletonCard}></div>
                    <div className={styles.skeletonCard}></div>
                    <div className={styles.skeletonCard}></div>
                  </div>

                  {/* Skeleton Footer */}
                  <div className={styles.skeletonFooter}>
                    <div className={styles.skeletonButton}></div>
                    <div className={styles.skeletonButtonPrimary}></div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
