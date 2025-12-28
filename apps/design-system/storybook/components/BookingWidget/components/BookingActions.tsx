import React from "react";
import { Pencil } from "lucide-react";
import Button from "../../../atoms/Button/Button";
import styles from "../BookingWidget.module.css";

interface BookingActionsProps {
  isConfirmed: boolean;
  isEditing: boolean;
  editable: boolean;
  onEdit?: () => void;
  onCancel?: () => void;
  onCancelEdit?: () => void;
  onConfirm?: () => void;
}

export default function BookingActions({
  isConfirmed,
  isEditing,
  editable,
  onEdit,
  onCancel,
  onCancelEdit,
  onConfirm,
}: BookingActionsProps) {
  return (
    <div className={styles.actions}>
      <div className={styles.actionButtons}>
        {isConfirmed ? (
          // Confirmed state buttons
          <>
            {editable && onEdit && (
              <Button variant="secondary" onClick={onEdit}>
                <Pencil style={{ width: "14px", height: "14px" }} />
                Modify
              </Button>
            )}
            {onCancel && (
              <Button variant="outline" onClick={onCancel}>
                Cancel
              </Button>
            )}
          </>
        ) : isEditing ? (
          // Editing state buttons
          <>
            {onCancelEdit && (
              <Button variant="outline" onClick={onCancelEdit}>
                Cancel
              </Button>
            )}
            {onConfirm && (
              <Button variant="primary" onClick={onConfirm}>
                Save Changes
              </Button>
            )}
          </>
        ) : (
          // View state buttons
          <>
            {onCancel && (
              <Button variant="outline" onClick={onCancel}>
                Cancel
              </Button>
            )}
            {onConfirm && (
              <Button variant="primary" onClick={onConfirm}>
                Confirm Booking
              </Button>
            )}
          </>
        )}
      </div>
    </div>
  );
}
