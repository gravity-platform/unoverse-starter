import React from "react";
import styles from "../AccountTransferWidget.module.css";

interface AmountStepProps {
  amount?: number;
  currency: string;
  reference?: string;
  scheduledDate?: string;
  fee?: number;
  sourceBalance?: number;
  onAmountChange: (amount: number) => void;
  onCurrencyChange: (currency: string) => void;
  onReferenceChange: (reference: string) => void;
  onScheduledDateChange: (date: string) => void;
}

const CURRENCIES = [
  { code: "USD", symbol: "$", name: "US Dollar" },
  { code: "EUR", symbol: "€", name: "Euro" },
  { code: "GBP", symbol: "£", name: "British Pound" },
  { code: "AED", symbol: "د.إ", name: "UAE Dirham" },
];

export default function AmountStep({
  amount,
  currency,
  reference,
  scheduledDate,
  onAmountChange,
  onReferenceChange,
  onScheduledDateChange,
}: AmountStepProps) {
  const currencyInfo = CURRENCIES.find((c) => c.code === currency) || CURRENCIES[0];

  const handleAmountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = parseFloat(e.target.value) || 0;
    onAmountChange(value);
  };

  return (
    <div className={styles.amountForm}>
      <div className={styles.amountFormField}>
        <label className={styles.amountFormLabel}>Amount</label>
        <div className={styles.amountInputBox}>
          <span className={styles.amountInputCurrency}>{currencyInfo.symbol}</span>
          <input
            type="number"
            className={styles.amountInputField}
            placeholder="0.00"
            value={amount || ""}
            onChange={handleAmountChange}
            min="0"
            step="0.01"
          />
        </div>
      </div>

      <div className={styles.amountFormField}>
        <label className={styles.amountFormLabel}>When</label>
        <input
          type="date"
          className={styles.amountFormInput}
          value={scheduledDate || new Date().toISOString().split("T")[0]}
          onChange={(e) => onScheduledDateChange(e.target.value)}
          min={new Date().toISOString().split("T")[0]}
        />
      </div>
      <div className={styles.amountFormField}>
        <label className={styles.amountFormLabel}>Memo (optional)</label>
        <input
          type="text"
          className={styles.amountFormInput}
          placeholder="What's this for?"
          value={reference || ""}
          onChange={(e) => onReferenceChange(e.target.value)}
          maxLength={140}
        />
      </div>
    </div>
  );
}
