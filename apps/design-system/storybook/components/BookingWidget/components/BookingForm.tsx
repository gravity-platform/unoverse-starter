import React from "react";
import { Calendar, Clock, User, Mail, Phone } from "lucide-react";
import { BookingData } from "../BookingWidget";

interface BookingFormProps {
  booking: BookingData;
  onFieldChange: (field: keyof BookingData, value: string) => void;
}

export default function BookingForm({ booking, onFieldChange }: BookingFormProps) {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "var(--spacing-2)" }}>
      <div className="field">
        <Calendar className="fieldIcon" style={{ width: "16px", height: "16px" }} />
        <label className="fieldLabel">Date</label>
        <input
          type="date"
          value={booking.date || ""}
          onChange={(e) => onFieldChange("date", e.target.value)}
          className="input"
        />
      </div>

      <div className="field">
        <Clock className="fieldIcon" style={{ width: "16px", height: "16px" }} />
        <label className="fieldLabel">Time</label>
        <input
          type="time"
          value={booking.time || ""}
          onChange={(e) => onFieldChange("time", e.target.value)}
          className="input"
        />
      </div>

      {booking.duration && (
        <div className="field">
          <Clock className="fieldIcon" style={{ width: "16px", height: "16px" }} />
          <label className="fieldLabel">Duration</label>
          <input
            type="text"
            value={booking.duration || ""}
            onChange={(e) => onFieldChange("duration", e.target.value)}
            className="input"
          />
        </div>
      )}

      <div className="field">
        <User className="fieldIcon" style={{ width: "16px", height: "16px" }} />
        <label className="fieldLabel">Name</label>
        <input
          type="text"
          value={booking.patientName || ""}
          onChange={(e) => onFieldChange("patientName", e.target.value)}
          className="input"
        />
      </div>

      <div className="field">
        <Mail className="fieldIcon" style={{ width: "16px", height: "16px" }} />
        <label className="fieldLabel">Email</label>
        <input
          type="email"
          value={booking.email || ""}
          onChange={(e) => onFieldChange("email", e.target.value)}
          className="input"
        />
      </div>

      <div className="field">
        <Phone className="fieldIcon" style={{ width: "16px", height: "16px" }} />
        <label className="fieldLabel">Phone</label>
        <input
          type="tel"
          value={booking.phone || ""}
          onChange={(e) => onFieldChange("phone", e.target.value)}
          className="input"
        />
      </div>

      {(booking.notes || true) && (
        <div
          style={{
            marginTop: "var(--spacing-2)",
            paddingTop: "var(--spacing-2)",
            borderTop: "1px solid var(--color-border-subtle)",
          }}
        >
          <div style={{ display: "flex", alignItems: "flex-start", gap: "var(--spacing-3)" }}>
            <label className="fieldLabel" style={{ width: "auto" }}>
              Notes
            </label>
            <textarea
              value={booking.notes || ""}
              onChange={(e) => onFieldChange("notes", e.target.value)}
              rows={2}
              className="textarea"
              placeholder="Add notes..."
              style={{ flex: 1, padding: 0, border: "none", background: "transparent", resize: "none" }}
            />
          </div>
        </div>
      )}
    </div>
  );
}
