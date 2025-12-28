# BookingWidget Component

A premium booking widget component for displaying and managing appointment bookings with Apple-inspired design aesthetics.

## Features

- **Two Display States**:
  - Default (pending) - Full booking form with hero image
  - Confirmed - Elegant confirmation receipt with success indicator
- **Hero Image**: Optional service image with gradient overlay
- **Editable Mode**: Inline editing of booking details
- **Status-Based UI**: Different layouts for pending vs confirmed bookings
- **Responsive Layout**: Adapts to different screen sizes with `w-full`
- **Dark Mode Support**: Premium zinc/slate color palette
- **Action Callbacks**: Handlers for booking changes, confirmations, and cancellations

## Usage

```tsx
import BookingWidget from "./BookingWidget";

<BookingWidget
  bookingData={{
    service: "Sports Injury Assessment",
    serviceDescription: "Comprehensive evaluation and treatment plan for sports-related injuries.",
    serviceImage: "https://images.unsplash.com/photo-1571019614242-c5c5dee9f50b?w=800&q=80",
    therapist: "Dr. Sarah Mitchell",
    date: "2025-10-28",
    time: "10:30",
    duration: "60 minutes",
    patientName: "John Doe",
    email: "john.doe@example.com",
    phone: "+1 (555) 123-4567",
    notes: "First time visit. Knee pain after running.",
    price: "$85",
    status: "pending",
  }}
  editable={true}
  onBookingChange={(updatedData) => console.log("Booking updated:", updatedData)}
  onConfirm={(bookingData) => console.log("Booking confirmed:", bookingData)}
  onCancel={() => console.log("Booking cancelled")}
/>;
```

## Props

### `bookingData` (object)

The booking information to display. All fields are optional.

**Why nested?** In server-driven workflows, data objects are passed as single props to enable:

- Dynamic data binding from workflow outputs
- Template expressions like `return signal.bedrock.output`
- Type safety for complex data structures
- Clear separation between data and component behavior

**Fields:**

- `service` (string): Name of the service/appointment type
- `serviceDescription` (string): Detailed description of the service
- `serviceImage` (string): URL to service hero image
- `therapist` (string): Name of the therapist/provider
- `date` (string): Appointment date (YYYY-MM-DD format)
- `time` (string): Appointment time (HH:MM format)
- `duration` (string): Length of appointment (e.g., "60 minutes")
- `patientName` (string): Name of the patient
- `email` (string): Patient's email address
- `phone` (string): Patient's phone number
- `notes` (string): Additional notes or comments
- `price` (string): Cost of the service (e.g., "$85")
- `status` ("pending" | "confirmed" | "cancelled"): Current booking status

### `editable` (boolean)

Whether the booking details can be edited. Default: `true`

### `onBookingChange` (function)

Callback fired when booking data is modified in edit mode.

- **Signature**: `(updatedData: BookingData) => void`

### `onConfirm` (function)

Callback fired when the user confirms the booking.

- **Signature**: `(bookingData: BookingData) => void`

### `onCancel` (function)

Callback fired when the user cancels the booking.

- **Signature**: `() => void`

## Display States

### Default (Pending) State

- Full-width hero image with service photo
- Service title with price badge
- Service description
- Two-column grid layout for booking details
- "Edit Booking" button (if editable)
- "Confirm Booking" action button

### Confirmed State

- Centered success indicator with checkmark icon
- "Confirmed" heading
- Clean vertical layout with icons
- Booking details in simplified format
- "Modify" and "Cancel" action buttons

## Examples

## Example: Minimal Booking

```typescript
<BookingWidget
  bookingData={{
    service: "Physiotherapy Session",
    date: "2025-10-28",
    time: "14:00",
    patientName: "Jane Smith",
    price: "$65",
  }}
/>
```

## Example: Read-Only

```typescript
<BookingWidget
  bookingData={{
    service: "Confirmed Appointment",
    date: "2025-10-28",
    time: "14:00",
    patientName: "Jane Smith",
    status: "confirmed",
  }}
  editable={false}
/>
```

## Accessibility

- ✅ Semantic HTML structure
- ✅ Proper form labels
- ✅ Keyboard navigation support
- ✅ Focus indicators
- ✅ ARIA attributes where needed

## Browser Support

- Chrome/Edge (latest)
- Firefox (latest)
- Safari (latest)
- Mobile browsers
