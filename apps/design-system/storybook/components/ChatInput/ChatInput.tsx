/**
 * ChatInput Component
 * Modular chat input with expandable FAQs, Actions, and Recommendations
 */
import React, { useState } from "react";
import styles from "./ChatInput.module.css";
import type { ChatInputProps, FAQ, Action, Recommendation, TabType } from "./types";
import { ActionsSection, RecommendationsSection, FaqSection, TabBar } from "./sections";
import { InputForm } from "./InputForm";

export default function ChatInput({
  placeholder = "Ask a question...",
  onSend,
  disabled = false,
  enableAudio = false,
  isRecording = false,
  onMicrophoneClick,
  faqs = [],
  actions = [],
  recommendations = [],
  onFaqClick,
  onActionClick,
  onRecommendationClick,
  focusContext,
}: ChatInputProps) {
  const [value, setValue] = useState("");
  const [activeTab, setActiveTab] = useState<TabType>(null);

  const handleFaqClick = (faq: FAQ) => {
    const question = typeof faq === "string" ? faq : faq.question;
    setActiveTab(null);
    if (onFaqClick) {
      onFaqClick(question);
    } else if (onSend) {
      onSend(question);
    }
  };

  const handleActionClick = (action: Action) => {
    const obj: any = action.object ?? action;
    setActiveTab(null);
    window.dispatchEvent(
      new CustomEvent("gravity:action", {
        detail: { type: "click", data: { object: obj }, componentId: "ChatInput" },
      })
    );
    if (onActionClick) {
      onActionClick(obj);
    }
  };

  const handleRecommendationClick = (recommendation: Recommendation) => {
    if (onRecommendationClick) {
      onRecommendationClick(recommendation);
    } else if (onSend) {
      onSend(recommendation.text);
    }
  };

  const toggleTab = (tab: "actions" | "recommendations" | "faq") => {
    setActiveTab(activeTab === tab ? null : tab);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!value.trim() || disabled) return;
    onSend?.(value.trim());
    setValue("");
  };

  const hasActions = actions.length > 0;
  const hasRecommendations = recommendations.length > 0;
  const hasFaqs = faqs.length > 0;
  const showTabs = hasActions || hasRecommendations || hasFaqs;

  return (
    <div className={styles.container}>
      {activeTab === "actions" && hasActions && (
        <ActionsSection actions={actions} onClose={() => setActiveTab(null)} onActionClick={handleActionClick} />
      )}

      {activeTab === "recommendations" && hasRecommendations && (
        <RecommendationsSection
          recommendations={recommendations}
          onClose={() => setActiveTab(null)}
          onRecommendationClick={handleRecommendationClick}
        />
      )}

      {activeTab === "faq" && hasFaqs && (
        <FaqSection faqs={faqs} onClose={() => setActiveTab(null)} onFaqClick={handleFaqClick} />
      )}

      {showTabs && !focusContext?.isOpen && (
        <TabBar
          activeTab={activeTab}
          hasActions={hasActions}
          hasRecommendations={hasRecommendations}
          hasFaqs={hasFaqs}
          onTabClick={toggleTab}
        />
      )}

      <InputForm
        value={value}
        onChange={setValue}
        onSubmit={handleSubmit}
        placeholder={placeholder}
        disabled={disabled}
        enableAudio={enableAudio}
        isRecording={isRecording}
        onMicrophoneClick={onMicrophoneClick}
        focusContext={focusContext}
      />
    </div>
  );
}

export type { ChatInputProps, FAQ, Action, Recommendation, TabType, FocusContext } from "./types";
