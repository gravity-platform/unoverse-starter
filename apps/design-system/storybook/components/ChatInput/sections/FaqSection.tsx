/**
 * FAQ Section - Expandable panel showing FAQ chips
 */
import React from "react";
import { CloseIcon } from "../icons";
import type { FAQ } from "../types";
import styles from "../ChatInput.module.css";

interface FaqSectionProps {
  faqs: FAQ[];
  onClose: () => void;
  onFaqClick: (faq: FAQ) => void;
}

export function FaqSection({ faqs, onClose, onFaqClick }: FaqSectionProps) {
  return (
    <div className={styles.expandedSection}>
      <button type="button" className={styles.closeButton} onClick={onClose} aria-label="Close">
        <CloseIcon />
      </button>
      <div className={styles.chipsContainer}>
        {faqs.map((faq, index) => {
          const question = typeof faq === "string" ? faq : faq.question;
          const key = typeof faq === "string" ? `faq-${index}` : faq.id || `faq-${index}`;
          return (
            <button key={key} type="button" className={styles.chip} onClick={() => onFaqClick(faq)}>
              {question}
            </button>
          );
        })}
      </div>
    </div>
  );
}
