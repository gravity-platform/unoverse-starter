import React from "react";
import { CheckCircle, Download, Share2 } from "lucide-react";
import styles from "../AccountTransferWidget.module.css";
import Button from "../../../atoms/Button/Button";
import { TransferData } from "../AccountTransferWidget";

interface ConfirmationStepProps {
  transfer: TransferData;
  onNewTransfer: () => void;
}

export default function ConfirmationStep({ transfer, onNewTransfer }: ConfirmationStepProps) {
  const formatCurrency = (value: number | undefined, currency: string = "USD") => {
    if (value === undefined) return "—";
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency,
    }).format(value);
  };

  const formatDate = (dateStr: string | undefined) => {
    if (!dateStr) return "—";
    return new Date(dateStr).toLocaleDateString("en-US", {
      weekday: "short",
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  return (
    <div className={styles.confirmationContent}>
      <div className={styles.confirmationIcon}>
        <CheckCircle />
      </div>

      <h3 className={styles.confirmationTitle}>Transfer Successful!</h3>
      <p className={styles.confirmationSubtitle}>
        Your transfer of {formatCurrency(transfer.amount, transfer.currency)} to{" "}
        {transfer.recipientAccount?.accountName} has been initiated.
      </p>

      {transfer.confirmationNumber && <div className={styles.confirmationNumber}>{transfer.confirmationNumber}</div>}

      <div className={styles.reviewSection} style={{ textAlign: "left", marginTop: "var(--spacing-4)" }}>
        <div className={styles.reviewRow}>
          <span className={styles.reviewLabel}>Amount Sent</span>
          <span className={styles.reviewValue}>{formatCurrency(transfer.amount, transfer.currency)}</span>
        </div>
        <div className={styles.reviewRow}>
          <span className={styles.reviewLabel}>To</span>
          <span className={styles.reviewValue}>{transfer.recipientAccount?.accountName}</span>
        </div>
        <div className={styles.reviewRow}>
          <span className={styles.reviewLabel}>Estimated Arrival</span>
          <span className={styles.reviewValue}>{formatDate(transfer.estimatedArrival)}</span>
        </div>
      </div>

      <div
        style={{
          display: "flex",
          gap: "var(--spacing-3)",
          justifyContent: "center",
          marginTop: "var(--spacing-6)",
        }}
      >
        <Button variant="outline" onClick={() => {}}>
          <Download style={{ width: 16, height: 16 }} />
          Download Receipt
        </Button>
        <Button variant="outline" onClick={() => {}}>
          <Share2 style={{ width: 16, height: 16 }} />
          Share
        </Button>
      </div>

      <div style={{ marginTop: "var(--spacing-4)" }}>
        <Button variant="primary" onClick={onNewTransfer}>
          Make Another Transfer
        </Button>
      </div>
    </div>
  );
}
