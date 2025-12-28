# BookingWidgetLayout Template

A template that renders components streamed from the server for AI-driven appointment booking flows.

## Overview

This template follows the **ChatLayout pattern** - it iterates through conversation history and renders all components as they stream from the server. Perfect for sports physiotherapy appointment booking workflows where the AI generates booking details and the user can review, edit, and confirm appointments.

## Features

- ✅ **Single Widget Focus** - Centers attention on the booking widget
- ✅ **AI Context Support** - Can show AI messages above the widget
- ✅ **Interactive Editing** - Users can modify booking details
- ✅ **WebSocket Integration** - Sends updates back to AI workflow
- ✅ **Responsive Design** - Adapts to different screen sizes
- ✅ **Dark Mode Support** - Full dark mode styling

## Usage

### Basic Integration

```typescript
import BookingWidgetLayout from "./templates/BookingWidgetLayout";

<BookingWidgetLayout client={gravityClient} />
```

### Props

```typescript
interface BookingWidgetLayoutProps {
  client: GravityClient;
  onStateChange?: (state: any) => void;
}
```

### AI Context

The template automatically renders the **AIResponse component** from the workflow history above the booking widget. The AI workflow should send an AIResponse component with the context message:

```json
{
  "type": "COMPONENT_INIT",
  "nodeId": "airesponse",
  "component": {
    "type": "AIResponse",
    "props": {
      "text": "I've prepared your appointment booking based on your preferences. Please review the details below and confirm when ready."
    }
  }
}
```

The AIResponse component will be automatically extracted and rendered above the BookingWidget.

## How It Works

The template follows the **KeyService pattern**:

```typescript
const latest = history.filter((e) => e.type === "assistant_response").pop();
const components = latest?.components || [];

// Render in order: AIResponse first, then BookingWidget, then rest
{filterComponents(components, {
  include: ["airesponse", "bookingwidget", "*"],
  order: true,
}).map((c) => renderComponent(c))}
```

### Component Flow

1. **Get latest response** - Only shows most recent assistant response
2. **Filter components** - Orders them: AIResponse → BookingWidget → Others
3. **Render components** - Uses helper to render each component

All components are:
- Loaded dynamically from the server
- Wrapped with Zustand for state management
- Rendered in the specified order

## Booking Data Structure

```typescript
interface BookingData {
  service?: string;
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
```

## User Interactions

The template handles three main user actions:

1. **Booking Change** - Sends `update_booking` action
2. **Booking Confirmation** - Sends `confirm_booking` action
3. **Booking Cancellation** - Sends `cancel_booking` action

## Layout

- Centered booking widget with max-width of 4xl
- Optional AI context messages above the widget
- Gradient background for visual appeal
- Smooth animations on widget appearance

## States

- **Empty** - Waiting for booking details
- **Streaming** - AI is preparing booking
- **With Booking** - Shows booking widget
- **With Context** - Shows AI message + booking widget
