import React from "react";
import { Check } from "lucide-react";
import styles from "../AccountTransferWidget.module.css";
import { BankAccount } from "../AccountTransferWidget";

interface SourceAccountStepProps {
  selectedAccount?: BankAccount;
  availableAccounts: BankAccount[];
  onSelect: (account: BankAccount) => void;
}

export default function SourceAccountStep({ selectedAccount, availableAccounts, onSelect }: SourceAccountStepProps) {
  const formatCurrency = (amount: number | undefined, currency: string = "USD") => {
    if (amount === undefined) return "";
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency,
    }).format(amount);
  };

  const maskAccountNumber = (accountNumber: string | undefined) => {
    if (!accountNumber) return "";
    const last4 = accountNumber.slice(-4);
    return `••••${last4}`;
  };

  if (availableAccounts.length === 0) {
    return (
      <div>
        <div className={styles.formSectionTitle}>Select Source Account</div>
        <p style={{ color: "var(--color-text-secondary)", textAlign: "center", padding: "var(--spacing-6)" }}>
          No accounts available. Please add a bank account first.
        </p>
      </div>
    );
  }

  return (
    <div>
      <div className={styles.formSectionTitle}>Select Source Account</div>
      {availableAccounts.map((account, index) => {
        const isSelected = selectedAccount?.accountNumber === account.accountNumber;
        return (
          <div
            key={account.accountNumber || index}
            className={`${styles.accountCard} ${isSelected ? styles.accountCardSelected : ""}`}
            onClick={() => onSelect(account)}
          >
            <div className={styles.accountCardHeader}>
              <div>
                <div className={styles.accountName}>{account.accountName || "Account"}</div>
                <div className={styles.accountNumber}>{maskAccountNumber(account.accountNumber)}</div>
              </div>
              <div style={{ display: "flex", alignItems: "center", gap: "var(--spacing-2)" }}>
                <div className={styles.accountBalance}>{formatCurrency(account.balance, account.currency)}</div>
                {isSelected && (
                  <div
                    style={{
                      width: 24,
                      height: 24,
                      borderRadius: "50%",
                      background: "var(--color-primary-500)",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                    }}
                  >
                    <Check style={{ width: 14, height: 14, color: "white" }} />
                  </div>
                )}
              </div>
            </div>
            <div className={styles.bankName}>{account.bankName}</div>
          </div>
        );
      })}
    </div>
  );
}
