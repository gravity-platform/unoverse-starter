import React, { useState, useEffect } from "react";
import styles from "./BookingWidget.module.css";
import KenBurnsImage from "../../atoms/Image/KenBurnsImage";
import BookingHeader from "./components/BookingHeader";
import ServiceInfo from "./components/ServiceInfo";
import BookingDetails from "./components/BookingDetails";
import BookingForm from "./components/BookingForm";
import BookingActions from "./components/BookingActions";

export interface BookingData {
  service?: string;
  serviceDescription?: string;
  serviceImage?: string;
  therapist?: string;
  date?: string;
  time?: string;
  duration?: string;
  patientName?: string;
  email?: string;
  phone?: string;
  notes?: string;
  price?: string;
  status?: "pending" | "confirmed" | "cancelled";
}

interface BookingWidgetProps {
  /** Booking data object */
  bookingData?: BookingData;
  /** Callback when booking is modified */
  onBookingChange?: (updatedBooking: BookingData) => void;
  /** Callback when booking is confirmed */
  onConfirm?: (booking: BookingData) => void;
  /** Callback when booking is cancelled */
  onCancel?: () => void;
  /** Whether the widget is in edit mode */
  editable?: boolean;
  /** Is editing state (from Zustand) */
  isEditing?: boolean;
  /** Local booking data (from Zustand) */
  localBooking?: BookingData;
  /** Function to update Zustand state (injected by withZustandData HOC) */
  updateData?: (updates: Record<string, any>) => void;
}

// Default healthcare image
const DEFAULT_SERVICE_IMAGE = "https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?w=1200&q=80";

// Helper to normalize date/time formats
function normalizeBookingData(data: BookingData): BookingData {
  const normalized = { ...data };

  // Convert human-readable date to YYYY-MM-DD format
  if (normalized.date && !normalized.date.match(/^\d{4}-\d{2}-\d{2}$/)) {
    try {
      const parsed = new Date(normalized.date);
      if (!isNaN(parsed.getTime())) {
        normalized.date = parsed.toISOString().split("T")[0];
      }
    } catch (e) {
      // Keep original if parsing fails
    }
  }

  // Convert 12-hour time to 24-hour HH:MM format
  if (normalized.time && normalized.time.includes("M")) {
    try {
      const match = normalized.time.match(/(\d{1,2}):(\d{2})\s*(AM|PM)/i);
      if (match) {
        let hours = parseInt(match[1]);
        const minutes = match[2];
        const period = match[3].toUpperCase();

        if (period === "PM" && hours !== 12) hours += 12;
        if (period === "AM" && hours === 12) hours = 0;

        normalized.time = `${hours.toString().padStart(2, "0")}:${minutes}`;
      }
    } catch (e) {
      // Keep original if parsing fails
    }
  }

  return normalized;
}

export default function BookingWidget(props: BookingWidgetProps) {
  const {
    bookingData = {},
    onBookingChange,
    onConfirm,
    onCancel,
    editable = true,
    isEditing: zustandIsEditing,
    localBooking: zustandLocalBooking,
    updateData,
  } = props;

  // Fallback state for Storybook (no Zustand available)
  const [fallbackIsEditing, setFallbackIsEditing] = useState(true);
  const [fallbackLocalBooking, setFallbackLocalBooking] = useState<BookingData>(() =>
    normalizeBookingData(bookingData)
  );

  // Use Zustand if available, otherwise fallback
  const isEditing = zustandIsEditing ?? fallbackIsEditing;
  const localBooking = zustandLocalBooking ?? fallbackLocalBooking;

  // Wrapper functions that write to Zustand or fallback
  const setIsEditing = (editing: boolean) => {
    if (updateData) {
      updateData({ isEditing: editing });
    } else {
      setFallbackIsEditing(editing);
    }
  };

  const setLocalBooking = (booking: BookingData) => {
    if (updateData) {
      updateData({ localBooking: booking });
    } else {
      setFallbackLocalBooking(booking);
    }
  };

  // Initialize Zustand state on first render if not already set
  useEffect(() => {
    if (updateData && zustandIsEditing === undefined) {
      const normalized = normalizeBookingData(bookingData);
      updateData({ isEditing: true, localBooking: normalized });
    }
  }, [updateData, zustandIsEditing, bookingData]);

  // Update fallback state when props change (for Storybook)
  useEffect(() => {
    if (!updateData) {
      setFallbackLocalBooking(normalizeBookingData(bookingData));
    }
  }, [bookingData, updateData]);

  // Check if booking is confirmed
  const isConfirmed = localBooking.status === "confirmed";

  const handleFieldChange = (field: keyof BookingData, value: string) => {
    const updated = { ...localBooking, [field]: value };
    setLocalBooking(updated);
    onBookingChange?.(updated);
  };

  const handleConfirm = () => {
    // Validate required fields
    const requiredFields = ["date", "time", "patientName", "email", "phone"];
    const hasAllRequiredFields = requiredFields.every((field) => {
      const value = localBooking[field as keyof BookingData];
      return value && value.trim() !== "";
    });

    if (!hasAllRequiredFields) {
      alert("Please fill in all required fields: Date, Time, Name, Email, and Phone");
      return;
    }

    // Mark as confirmed and exit edit mode
    const confirmedBooking = { ...localBooking, status: "confirmed" as const };
    setLocalBooking(confirmedBooking);
    onConfirm?.(confirmedBooking);
    setIsEditing(false);
  };

  const handleEdit = () => {
    setIsEditing(true);
  };

  const handleCancelEdit = () => {
    setLocalBooking(bookingData);
    setIsEditing(false);
  };

  // Confirmed booking view
  if (isConfirmed) {
    return (
      <div className={styles.widget}>
        <div className={styles.content}>
          <BookingHeader isConfirmed={true} title="Booking Confirmed" subtitle="Your appointment is scheduled" />
          <ServiceInfo
            service={localBooking.service}
            serviceDescription={localBooking.serviceDescription}
            price={localBooking.price}
          />
          <BookingDetails booking={localBooking} />
          <BookingActions
            isConfirmed={true}
            isEditing={false}
            editable={editable}
            onEdit={handleEdit}
            onCancel={onCancel}
          />
        </div>

        <div className={styles.imageContainer}>
          <KenBurnsImage
            src={localBooking.serviceImage || DEFAULT_SERVICE_IMAGE}
            alt={localBooking.service || "Healthcare Service"}
            overlay={true}
          />
        </div>
      </div>
    );
  }

  // Default booking view - editable
  return (
    <div className={styles.widget}>
      <div className={styles.content}>
        <BookingHeader
          isConfirmed={false}
          title={localBooking.service || "Appointment"}
          subtitle={localBooking.therapist || localBooking.serviceDescription}
        />
        <ServiceInfo
          service={localBooking.service}
          serviceDescription={localBooking.serviceDescription}
          price={localBooking.price}
        />
        <div style={{ flex: 1, padding: "var(--spacing-4) var(--spacing-6)", overflowY: "auto" }}>
          <BookingForm booking={localBooking} onFieldChange={handleFieldChange} />
        </div>
        <BookingActions
          isConfirmed={false}
          isEditing={isEditing}
          editable={editable}
          onCancelEdit={handleCancelEdit}
          onConfirm={handleConfirm}
          onCancel={onCancel}
        />
      </div>

      <div className={styles.imageContainer}>
        <KenBurnsImage
          src={localBooking.serviceImage || DEFAULT_SERVICE_IMAGE}
          alt={localBooking.service || "Healthcare Service"}
          overlay={true}
        />
      </div>
    </div>
  );
}
