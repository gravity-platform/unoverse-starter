import React, { useState, useEffect, useRef } from "react";
import Markdown from "markdown-to-jsx";
import { ChunkAnimator } from "./chunkAnimator";
import styles from "./AIResponse.module.css";

// Custom link component that opens in new tab
const ExternalLink = ({ children, ...props }: React.AnchorHTMLAttributes<HTMLAnchorElement>) => (
  <a {...props} target="_blank" rel="noopener noreferrer">
    {children}
  </a>
);

const markdownOptions = {
  overrides: {
    a: { component: ExternalLink },
  },
};

interface AIResponseProps {
  progressText?: string;
  text?: string;
  questions?: string[]; // Always an array of strings
  onQuestionClick?: (question: string) => void;
  className?: string;
  nodeId?: string; // For Zustand store subscription
  isStreaming?: boolean; // Show typing cursor when streaming
}

export default function AIResponse(props: AIResponseProps) {
  const { progressText, text, questions, onQuestionClick, className, nodeId, isStreaming } = props;

  // Initialize displayedText: empty for streaming, full text for completed responses
  const [displayedText, setDisplayedText] = useState(() => {
    // If not streaming and text exists, show immediately (completed response from history)
    if (!props.isStreaming && props.text) {
      return props.text;
    }
    return "";
  });
  const animatorRef = useRef<ChunkAnimator | null>(null);
  const lastTextRef = useRef<string>("");
  const hasInitializedRef = useRef(false);

  // Initialize animator once
  if (!animatorRef.current) {
    animatorRef.current = new ChunkAnimator({
      charsPerSecond: 300,
      onUpdate: setDisplayedText,
      onTypingChange: () => {}, // Not used - we use isStreaming prop instead
    });
  }

  // Handle text updates - use useLayoutEffect to prevent flash
  // useLayoutEffect runs synchronously after DOM mutations but before paint
  React.useLayoutEffect(() => {
    if (!text) return;

    // If this is the first render and we're NOT streaming, show text immediately
    // This handles both: text at mount AND text arriving via COMPONENT_DATA after mount
    if (!hasInitializedRef.current && !isStreaming) {
      setDisplayedText(text);
      lastTextRef.current = text;
      hasInitializedRef.current = true;
      return;
    }

    hasInitializedRef.current = true;

    // Only animate if text has changed
    if (text !== lastTextRef.current) {
      // For first text during streaming, show first char immediately to prevent flash
      if (lastTextRef.current === "" && text.length > 0) {
        setDisplayedText(text.slice(0, 1));
        animatorRef.current?.setDisplayedText(text.slice(0, 1));
      }
      animatorRef.current?.addChunk(text);
      lastTextRef.current = text;
    }
  }, [text, isStreaming]);

  // Questions are always an array of strings
  const questionList = questions || [];

  return (
    <div className={`${styles.container} ${className || ""}`}>
      {/* Reasoning/Thinking - rendered as markdown in italic gray */}
      {progressText && (
        <div className={styles.progress}>
          <Markdown options={markdownOptions}>{progressText}</Markdown>
        </div>
      )}

      {/* Text - server sends accumulated chunks */}
      {displayedText && (
        <div className={`${styles.textContent} prose`}>
          <Markdown options={markdownOptions}>{displayedText}</Markdown>
          {/* Animated blinking cursor inline with text */}
          {isStreaming && <span className={styles.cursor} />}
        </div>
      )}

      {/* Questions - only show if questions are provided */}
      {questionList.length > 0 && (
        <div className={styles.questionsContainer}>
          {questionList.map((question, i) => (
            <button key={`q-${i}`} className={styles.questionButton} onClick={() => onQuestionClick?.(question)}>
              <svg className={styles.questionIcon} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M7 8h10M7 12h4m1 8l-4-4H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-3l-4 4z"
                />
              </svg>
              <span className={styles.questionText}>{question}</span>
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
