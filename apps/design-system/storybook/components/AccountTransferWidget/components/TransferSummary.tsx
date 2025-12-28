import React from "react";
import { ArrowDown, Building2, User } from "lucide-react";
import styles from "../AccountTransferWidget.module.css";
import { BankAccount, TransferStep } from "../AccountTransferWidget";

interface TransferSummaryProps {
  sourceAccount?: BankAccount;
  recipientAccount?: BankAccount;
  amount?: number;
  currency?: string;
  currentStep: TransferStep;
  onEditSource?: () => void;
  onEditRecipient?: () => void;
  onEditAmount?: () => void;
}

export default function TransferSummary({
  sourceAccount,
  recipientAccount,
  amount,
  currency = "USD",
  currentStep,
  onEditSource,
  onEditRecipient,
  onEditAmount,
}: TransferSummaryProps) {
  const formatCurrency = (value: number | undefined, curr: string = "USD") => {
    if (value === undefined) return "";
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: curr,
    }).format(value);
  };

  const maskAccountNumber = (accountNumber: string | undefined) => {
    if (!accountNumber) return "";
    const last4 = accountNumber.slice(-4);
    return `••••${last4}`;
  };

  // Don't show summary on first step, review, or confirmation
  // Review step has its own display
  if (currentStep === "source" || currentStep === "review" || currentStep === "confirmation") {
    return null;
  }

  const showSource = !!sourceAccount;
  const showRecipient = !["recipient", "source", "confirmation"].includes(currentStep) && !!recipientAccount;

  if (!showSource && !showRecipient) {
    return null;
  }

  return (
    <div className={styles.transferFlow}>
      {/* Source Account Card */}
      {showSource && (
        <div className={styles.flowCard} onClick={onEditSource} role="button" tabIndex={0}>
          <div className={styles.flowCardIcon}>
            <Building2 style={{ width: 20, height: 20 }} />
          </div>
          <div className={styles.flowCardContent}>
            <div className={styles.flowCardLabel}>From</div>
            <div className={styles.flowCardTitle}>{sourceAccount.accountName}</div>
            <div className={styles.flowCardSubtitle}>
              {sourceAccount.bankName} • {maskAccountNumber(sourceAccount.accountNumber)}
            </div>
          </div>
        </div>
      )}

      {/* Arrow connector */}
      {showSource && showRecipient && (
        <div className={styles.flowConnector}>
          <div className={styles.flowConnectorLine} />
          <div className={styles.flowConnectorIcon}>
            <ArrowDown style={{ width: 14, height: 14 }} />
          </div>
          <div className={styles.flowConnectorLine} />
        </div>
      )}

      {/* Recipient Card */}
      {showRecipient && (
        <div className={styles.flowCard} onClick={onEditRecipient} role="button" tabIndex={0}>
          <div className={`${styles.flowCardIcon} ${styles.flowCardIconRecipient}`}>
            <User style={{ width: 20, height: 20 }} />
          </div>
          <div className={styles.flowCardContent}>
            <div className={styles.flowCardLabel}>To</div>
            <div className={styles.flowCardTitle}>{recipientAccount.accountName}</div>
            <div className={styles.flowCardSubtitle}>
              {recipientAccount.bankName} • {recipientAccount.iban || maskAccountNumber(recipientAccount.accountNumber)}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
