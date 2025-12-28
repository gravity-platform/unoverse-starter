import React from "react";
import { Send, Shield, Clock } from "lucide-react";
import styles from "../AccountTransferWidget.module.css";
import { TransferData } from "../AccountTransferWidget";

interface ReviewStepProps {
  transfer: TransferData;
}

export default function ReviewStep({ transfer }: ReviewStepProps) {
  const formatCurrency = (value: number | undefined, currency: string = "USD") => {
    if (value === undefined) return "$0.00";
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency,
    }).format(value);
  };

  const formatDate = (dateStr: string | undefined) => {
    if (!dateStr) return "Today";
    const date = new Date(dateStr);
    const today = new Date();
    if (date.toDateString() === today.toDateString()) return "Today";
    return date.toLocaleDateString("en-US", { weekday: "short", month: "short", day: "numeric" });
  };

  const maskAccountNumber = (accountNumber: string | undefined) => {
    if (!accountNumber) return "";
    const last4 = accountNumber.slice(-4);
    return `••••${last4}`;
  };

  return (
    <div className={styles.reviewPremium}>
      {/* Hero Card */}
      <div className={styles.reviewHeroCard}>
        <div className={styles.reviewHeroIcon}>
          <Send style={{ width: 28, height: 28 }} />
        </div>
        <div className={styles.reviewHeroAmount}>{formatCurrency(transfer.amount, transfer.currency)}</div>
        <div className={styles.reviewHeroLabel}>
          to <strong>{transfer.recipientAccount?.accountName}</strong>
        </div>
      </div>

      {/* Details List */}
      <div className={styles.reviewDetailsList}>
        <div className={styles.reviewDetailItem}>
          <span className={styles.reviewDetailLabel}>From</span>
          <div className={styles.reviewDetailValue}>
            <span>{transfer.sourceAccount?.accountName}</span>
            <span className={styles.reviewDetailSub}>{maskAccountNumber(transfer.sourceAccount?.accountNumber)}</span>
          </div>
        </div>

        <div className={styles.reviewDetailItem}>
          <span className={styles.reviewDetailLabel}>To</span>
          <div className={styles.reviewDetailValue}>
            <span>{transfer.recipientAccount?.accountName}</span>
            <span className={styles.reviewDetailSub}>{transfer.recipientAccount?.bankName}</span>
          </div>
        </div>

        <div className={styles.reviewDetailItem}>
          <span className={styles.reviewDetailLabel}>When</span>
          <span className={styles.reviewDetailValue}>{formatDate(transfer.scheduledDate)}</span>
        </div>

        {transfer.reference && (
          <div className={styles.reviewDetailItem}>
            <span className={styles.reviewDetailLabel}>Memo</span>
            <span className={styles.reviewDetailValue}>{transfer.reference}</span>
          </div>
        )}
      </div>

      {/* Security Badge */}
      <div className={styles.reviewSecurityBadge}>
        <Shield style={{ width: 14, height: 14 }} />
        <span>Secure transfer • Bank-level encryption</span>
      </div>
    </div>
  );
}
