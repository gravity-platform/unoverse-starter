import React from "react";
import styles from "./ListPicker.module.css";

export interface ListPickerElement {
  title: string;
  subtitle?: string;
  imageUrl?: string;
}

export interface ListPickerProps {
  /** Title displayed above the list */
  title?: string;
  /** Subtitle displayed below the title */
  subtitle?: string;
  /** List of selectable elements */
  elements: ListPickerElement[];
  /** Callback when an element is selected */
  onSelect?: (element: ListPickerElement, index: number) => void;
  /** Whether selection is disabled */
  disabled?: boolean;
}

/**
 * ListPicker - Interactive list selector for Amazon Connect
 *
 * Renders a list of clickable options, commonly used for:
 * - Language selection
 * - Menu options
 * - Quick actions
 */
export default function ListPicker({ title, subtitle, elements = [], onSelect, disabled = false }: ListPickerProps) {
  const handleSelect = (element: ListPickerElement, index: number) => {
    if (!disabled && onSelect) {
      onSelect(element, index);
    }
  };

  return (
    <div className={styles.container}>
      {(title || subtitle) && (
        <div className={styles.header}>
          {title && <div className={styles.title}>{title}</div>}
          {subtitle && <div className={styles.subtitle}>{subtitle}</div>}
        </div>
      )}

      <div className={styles.list}>
        {elements.map((element, index) => (
          <button
            key={index}
            className={styles.item}
            onClick={() => handleSelect(element, index)}
            disabled={disabled}
            type="button"
          >
            {element.imageUrl && <img src={element.imageUrl} alt={element.title} className={styles.itemImage} />}
            <div className={styles.itemContent}>
              <span className={styles.itemTitle}>{element.title}</span>
              {element.subtitle && <span className={styles.itemSubtitle}>{element.subtitle}</span>}
            </div>
          </button>
        ))}
      </div>
    </div>
  );
}
