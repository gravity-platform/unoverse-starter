import React from "react";
import { ArrowLeft, ArrowRight, Send } from "lucide-react";
import Button from "../../../atoms/Button/Button";
import styles from "../AccountTransferWidget.module.css";
import { TransferStep } from "../AccountTransferWidget";

interface TransferActionsProps {
  currentStep: TransferStep;
  canProceed: boolean;
  onBack: () => void;
  onNext: () => void;
  onCancel?: () => void;
  isFirstStep: boolean;
  isLastStep: boolean;
}

export default function TransferActions({
  currentStep,
  canProceed,
  onBack,
  onNext,
  onCancel,
  isFirstStep,
  isLastStep,
}: TransferActionsProps) {
  return (
    <div className={styles.actions}>
      <div className={styles.actionButtons}>
        <div>
          {!isFirstStep && (
            <Button variant="outline" onClick={onBack}>
              <ArrowLeft style={{ width: 16, height: 16 }} />
              Back
            </Button>
          )}
          {isFirstStep && onCancel && (
            <Button variant="outline" onClick={onCancel}>
              Cancel
            </Button>
          )}
        </div>
        <div className={styles.actionButtonsRight}>
          <Button variant="primary" onClick={onNext} disabled={!canProceed}>
            {isLastStep ? (
              <>
                <Send style={{ width: 16, height: 16 }} />
                Confirm Transfer
              </>
            ) : (
              <>
                Continue
                <ArrowRight style={{ width: 16, height: 16 }} />
              </>
            )}
          </Button>
        </div>
      </div>
    </div>
  );
}
