import React from "react";
import { CheckCircle, ArrowRightLeft } from "lucide-react";
import styles from "../AccountTransferWidget.module.css";

interface TransferHeaderProps {
  isCompleted: boolean;
  title: string;
  subtitle?: string;
}

export default function TransferHeader({ isCompleted, title, subtitle }: TransferHeaderProps) {
  return (
    <div className={isCompleted ? styles.headerCompleted : styles.header}>
      <div className={styles.headerContent}>
        {isCompleted ? (
          <div className={styles.successIcon}>
            <CheckCircle />
          </div>
        ) : (
          <div className={styles.headerIcon}>
            <ArrowRightLeft />
          </div>
        )}
        <div className={styles.headerText}>
          <h2 className={styles.headerTitle}>{title}</h2>
          {subtitle && <p className={styles.headerSubtitle}>{subtitle}</p>}
        </div>
      </div>
    </div>
  );
}
