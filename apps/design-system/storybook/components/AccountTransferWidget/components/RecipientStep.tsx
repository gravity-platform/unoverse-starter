import React from "react";
import { Check, Globe, Home } from "lucide-react";
import styles from "../AccountTransferWidget.module.css";
import { BankAccount, Beneficiary } from "../AccountTransferWidget";

interface RecipientStepProps {
  selectedBeneficiary?: BankAccount;
  beneficiaries: Beneficiary[];
  transferType: "domestic" | "international";
  onSelect: (account: BankAccount) => void;
  onTransferTypeChange: (type: "domestic" | "international") => void;
}

export default function RecipientStep({
  selectedBeneficiary,
  beneficiaries,
  transferType,
  onSelect,
  onTransferTypeChange,
}: RecipientStepProps) {
  const filteredBeneficiaries = beneficiaries.filter((b) => b.type === transferType);

  const handleSelectBeneficiary = (beneficiary: Beneficiary) => {
    const account: BankAccount = {
      accountName: beneficiary.name,
      accountNumber: beneficiary.accountNumber,
      iban: beneficiary.iban,
      bankName: beneficiary.bankName,
      bankCode: beneficiary.bankCode,
      swiftCode: beneficiary.swiftCode,
      currency: beneficiary.currency,
    };
    onSelect(account);
  };

  const maskAccountNumber = (accountNumber: string | undefined) => {
    if (!accountNumber) return "";
    const last4 = accountNumber.slice(-4);
    return `••••${last4}`;
  };

  const isSelected = (beneficiary: Beneficiary) => {
    if (!selectedBeneficiary) return false;
    return (
      selectedBeneficiary.accountName === beneficiary.name &&
      (selectedBeneficiary.accountNumber === beneficiary.accountNumber || selectedBeneficiary.iban === beneficiary.iban)
    );
  };

  return (
    <div>
      <div className={styles.formSectionTitle}>Transfer Type</div>
      <div className={styles.transferTypeToggle}>
        <button
          type="button"
          className={`${styles.transferTypeButton} ${
            transferType === "domestic" ? styles.transferTypeButtonActive : ""
          }`}
          onClick={() => onTransferTypeChange("domestic")}
        >
          <Home style={{ width: 16, height: 16, marginRight: 8 }} />
          Domestic
        </button>
        <button
          type="button"
          className={`${styles.transferTypeButton} ${
            transferType === "international" ? styles.transferTypeButtonActive : ""
          }`}
          onClick={() => onTransferTypeChange("international")}
        >
          <Globe style={{ width: 16, height: 16, marginRight: 8 }} />
          International
        </button>
      </div>

      <div className={styles.formSectionTitle}>Select Beneficiary</div>

      {filteredBeneficiaries.length === 0 ? (
        <div
          style={{
            textAlign: "center",
            padding: "var(--spacing-8)",
            color: "var(--color-text-secondary)",
          }}
        >
          <p>No {transferType} beneficiaries saved.</p>
          <p style={{ fontSize: "var(--text-body-sm)", marginTop: "var(--spacing-2)" }}>
            Add a beneficiary in your banking app to see them here.
          </p>
        </div>
      ) : (
        filteredBeneficiaries.map((beneficiary) => {
          const selected = isSelected(beneficiary);
          return (
            <div
              key={beneficiary.id}
              className={`${styles.accountCard} ${selected ? styles.accountCardSelected : ""}`}
              onClick={() => handleSelectBeneficiary(beneficiary)}
            >
              <div className={styles.accountCardHeader}>
                <div>
                  <div className={styles.accountName}>{beneficiary.nickname || beneficiary.name}</div>
                  {beneficiary.nickname && (
                    <div
                      style={{
                        fontSize: "var(--text-body-sm)",
                        color: "var(--color-text-secondary)",
                      }}
                    >
                      {beneficiary.name}
                    </div>
                  )}
                  <div className={styles.accountNumber}>
                    {beneficiary.type === "international"
                      ? beneficiary.iban
                      : maskAccountNumber(beneficiary.accountNumber)}
                  </div>
                </div>
                <div style={{ display: "flex", alignItems: "center", gap: "var(--spacing-2)" }}>
                  {selected && (
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
              <div className={styles.bankName}>{beneficiary.bankName}</div>
            </div>
          );
        })
      )}
    </div>
  );
}
