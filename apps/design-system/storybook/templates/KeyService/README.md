# KeyService Template

2-column layout template inspired by UpRunning NowContent design.

## Overview

KeyService provides a modern, content-focused layout with:

- **Hero Banner**: Full-width image at top (KenBurnsImage)
- **Main Content (2/3)**: AIResponse text with prose styling
- **Sidebar (1/3)**: Card components for related resources
- **Header**: Logo overlay on hero image

## Layout

```
┌─────────────────────────────────────────┐
│ [Logo]                    (overlay)     │
├─────────────────────────────────────────┤
│           Hero Image (h-96)             │
├─────────────────────────────────────────┤
│ ┌──────────────────────┬──────────────┐ │
│ │                      │              │ │
│ │   Main Content       │   Sidebar    │ │
│ │   (AIResponse)       │   (Cards)    │ │
│ │   2/3 width          │   1/3 width  │ │
│ │                      │              │ │
│ └──────────────────────┴──────────────┘ │
└─────────────────────────────────────────┘
```

## Features

### Response-Based Architecture

- Renders the **latest assistant response** only
- Each response can contain multiple components
- Supports streaming state with loading animation
- Auto-scrolls to top when new response arrives

### 2-Column Grid Design

- **Main content (2/3)**: Scrollable prose content with AIResponse
- **Sidebar (1/3)**: Card components for related resources
- Responsive: Single column on mobile, 2-column on desktop (lg breakpoint)
- Max width: 7xl (1280px) centered

### Component Handling

- **KenBurnsImage**: Renders in hero banner (first image only)
- **AIResponse**: Renders in main content area with prose styling
- **Card**: Renders in sidebar with vertical stack
- Loading skeletons shown while components stream in

## Usage

```tsx
import KeyService from "./KeyService";

<KeyService
  client={gravityClient}
  logoUrl="https://example.com/logo.png"
  logoLink="/"
  onStateChange={(state) => console.log(state)}
/>;
```

## Props

| Prop            | Type                   | Default  | Description                               |
| --------------- | ---------------------- | -------- | ----------------------------------------- |
| `client`        | `GravityClient`        | Required | Gravity client with history and websocket |
| `onStateChange` | `(state: any) => void` | -        | Callback when template state changes      |
| `logoUrl`       | `string`               | -        | URL for logo image                        |
| `logoLink`      | `string`               | -        | Link when logo is clicked                 |
| `workflowState` | `string`               | -        | Injected by ComponentRenderer             |
| `isStreaming`   | `boolean`              | -        | Auto-derived from workflowState           |

## Component Rendering

### Hero Banner

Renders the first KenBurnsImage component:

- Full-width, fixed height (h-96)
- Fallback: Animated pulse placeholder

### Main Content (Left 2/3)

Renders AIResponse components with prose styling:

- Rich typography for headings, paragraphs, links
- White background card with shadow
- Fallback: ContentSkeleton animation

### Sidebar (Right 1/3)

Renders Card components in vertical stack:

- "Related Resources" heading
- Cards with image, title, description, CTA
- Fallback: CardsSkeleton animation

## States

### Empty State

Shows welcome message when no responses exist.

### Streaming State

Shows bouncing dots animation while workflow is running.

### Complete State

Displays all components from the latest response.

## Storybook Stories

1. **Initial** - Empty state with loading skeletons
2. **Streaming** - Bouncing dots + skeletons (workflow running)
3. **Complete** - Full content (Hero + AIResponse + Cards)

## Design System Integration

Uses Tailwind CSS classes compatible with the design system:

- Dark mode support (`dark:` variants)
- Responsive breakpoints (`lg:` for desktop)
- Smooth animations and transitions
- Consistent spacing and typography

## Workflow Integration

The template automatically:

1. Receives `WORKFLOW_STARTED` → Creates response with `streamingState: 'streaming'`
2. Receives `COMPONENT_INIT` → Adds components to current response
3. Receives `COMPONENT_DATA` → Components auto-update via Zustand
4. Receives `WORKFLOW_COMPLETED` → Updates response to `streamingState: 'complete'`

## Example Workflow

```typescript
// Workflow sends components
{
  type: "COMPONENT_INIT",
  chatId: "chat_123",
  nodeId: "card1",
  component: {
    type: "Card",
    props: { title: "Welcome", description: "..." }
  }
}

{
  type: "COMPONENT_INIT",
  chatId: "chat_123",
  nodeId: "image1",
  component: {
    type: "KenBurnsImage",
    props: { src: "https://...", alt: "Hero" }
  }
}
```

Result:

- Card renders on left side (scrollable)
- KenBurnsImage renders on right side (fixed)
- Both components in same response
- Streaming animation shows until workflow completes

## Styling

### Left Panel

- Max width: 2xl (672px)
- Padding: 8 (mobile) / 16 (desktop)
- Vertical padding: 20 (mobile) / 24 (desktop)
- Smooth scrolling with webkit optimization

### Right Panel

- Fixed position (right: 0, top: 0, bottom: 0)
- Hidden on mobile, visible on desktop (lg+)
- Background: gray-900 fallback
- Full-height image container

### Logo

- Absolute position (top-left)
- z-index: 50 (above content)
- Padding: 6 (1.5rem)
- Height: 12 (3rem)
- Hover scale animation

## Accessibility

- Semantic HTML structure
- Alt text for images
- Keyboard navigation support
- Screen reader friendly
- Smooth scroll behavior

## Browser Support

- Modern browsers (Chrome, Firefox, Safari, Edge)
- CSS Grid and Flexbox
- Tailwind CSS v3+
- React 18+
