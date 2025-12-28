import React from "react";
import { Check } from "lucide-react";
import styles from "../AccountTransferWidget.module.css";
import { TransferStep } from "../AccountTransferWidget";

interface StepIndicatorProps {
  steps: TransferStep[];
  currentStep: TransferStep;
  labels: Record<TransferStep, string>;
}

export default function StepIndicator({ steps, currentStep, labels }: StepIndicatorProps) {
  const currentIndex = steps.indexOf(currentStep);

  return (
    <div className={styles.stepIndicator}>
      {steps.map((step, index) => {
        const isCompleted = index < currentIndex;
        const isActive = step === currentStep;

        return (
          <React.Fragment key={step}>
            <div className={styles.step}>
              <div
                className={`${styles.stepCircle} ${
                  isCompleted
                    ? styles.stepCircleCompleted
                    : isActive
                    ? styles.stepCircleActive
                    : styles.stepCirclePending
                }`}
              >
                {isCompleted ? <Check style={{ width: 14, height: 14 }} /> : index + 1}
              </div>
              <span className={`${styles.stepLabel} ${isActive ? styles.stepLabelActive : ""}`}>{labels[step]}</span>
            </div>
            {index < steps.length - 1 && (
              <div className={`${styles.stepConnector} ${isCompleted ? styles.stepConnectorCompleted : ""}`} />
            )}
          </React.Fragment>
        );
      })}
    </div>
  );
}
