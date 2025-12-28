import React from "react";
import { Calendar, Clock, User, Mail, Phone } from "lucide-react";
import styles from "../BookingWidget.module.css";
import { BookingData } from "../BookingWidget";

interface BookingDetailsProps {
  booking: BookingData;
}

export default function BookingDetails({ booking }: BookingDetailsProps) {
  return (
    <div className={styles.details}>
      <div className={styles.detailRow}>
        <Calendar className={styles.detailIcon} />
        <div className={styles.detailContent}>
          <p className={styles.detailLabel}>Date & Time</p>
          <p className={styles.detailValue}>
            {booking.date} at {booking.time}
          </p>
        </div>
      </div>

      {booking.duration && (
        <div className={styles.detailRow}>
          <Clock className={styles.detailIcon} />
          <div className={styles.detailContent}>
            <p className={styles.detailLabel}>Duration</p>
            <p className={styles.detailValue}>{booking.duration}</p>
          </div>
        </div>
      )}

      <div className={styles.detailRow}>
        <User className={styles.detailIcon} />
        <div className={styles.detailContent}>
          <p className={styles.detailLabel}>Patient</p>
          <p className={styles.detailValue}>{booking.patientName}</p>
        </div>
      </div>

      <div className={styles.detailRow}>
        <Mail className={styles.detailIcon} />
        <div className={styles.detailContent}>
          <p className={styles.detailLabel}>Email</p>
          <p className={styles.detailValue}>{booking.email}</p>
        </div>
      </div>

      <div className={styles.detailRow}>
        <Phone className={styles.detailIcon} />
        <div className={styles.detailContent}>
          <p className={styles.detailLabel}>Phone</p>
          <p className={styles.detailValue}>{booking.phone}</p>
        </div>
      </div>

      {booking.notes && (
        <div className={styles.notes}>
          <p className={styles.notesLabel}>Notes</p>
          <p className={styles.notesText}>{booking.notes}</p>
        </div>
      )}
    </div>
  );
}
