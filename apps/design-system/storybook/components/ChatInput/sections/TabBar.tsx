/**
 * Tab Bar - Navigation tabs for Actions, Recommendations, FAQ
 */
import React from "react";
import { ActionsIcon, RecommendationsIcon, FaqIcon } from "../icons";
import type { TabType } from "../types";
import styles from "../ChatInput.module.css";

interface TabBarProps {
  activeTab: TabType;
  hasActions: boolean;
  hasRecommendations: boolean;
  hasFaqs: boolean;
  onTabClick: (tab: "actions" | "recommendations" | "faq") => void;
}

export function TabBar({ activeTab, hasActions, hasRecommendations, hasFaqs, onTabClick }: TabBarProps) {
  return (
    <div className={styles.tabBar}>
      {hasActions && (
        <button
          type="button"
          className={`${styles.tab} ${activeTab === "actions" ? styles.tabActive : ""}`}
          onClick={() => onTabClick("actions")}
        >
          <ActionsIcon className={styles.tabIcon} />
          <span className={styles.tabChevron}>{activeTab === "actions" ? "▾" : "▴"}</span>
          <span>Actions</span>
        </button>
      )}
      {hasActions && (hasRecommendations || hasFaqs) && <span className={styles.tabDivider}>|</span>}
      {hasRecommendations && (
        <button
          type="button"
          className={`${styles.tab} ${activeTab === "recommendations" ? styles.tabActive : ""}`}
          onClick={() => onTabClick("recommendations")}
        >
          <RecommendationsIcon className={styles.tabIcon} />
          <span className={styles.tabChevron}>{activeTab === "recommendations" ? "▾" : "▴"}</span>
          <span>AI Recommendations</span>
        </button>
      )}
      {hasRecommendations && hasFaqs && <span className={styles.tabDivider}>|</span>}
      {hasFaqs && (
        <button
          type="button"
          className={`${styles.tab} ${activeTab === "faq" ? styles.tabActive : ""}`}
          onClick={() => onTabClick("faq")}
        >
          <FaqIcon className={styles.tabIcon} />
          <span className={styles.tabChevron}>{activeTab === "faq" ? "▾" : "▴"}</span>
          <span>FAQ</span>
        </button>
      )}
    </div>
  );
}
