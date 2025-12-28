import React from "react";
import { CheckCircle } from "lucide-react";
import styles from "../BookingWidget.module.css";

interface BookingHeaderProps {
  isConfirmed: boolean;
  title: string;
  subtitle?: string;
}

export default function BookingHeader({ isConfirmed, title, subtitle }: BookingHeaderProps) {
  if (isConfirmed) {
    return (
      <div className={styles.headerConfirmed}>
        <div className={styles.headerContent}>
          <div className={styles.successIcon}>
            <CheckCircle strokeWidth={2.5} />
          </div>
          <div>
            <h2 className={styles.headerTitle}>{title}</h2>
            {subtitle && <p className={styles.headerSubtitle}>{subtitle}</p>}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.headerEdit}>
      <h2 className={styles.headerTitle}>{title}</h2>
      {subtitle && <p className={styles.headerSubtitle}>{subtitle}</p>}
    </div>
  );
}
