# Gravity Design System

<!-- LLM: This is the complete guide for the Gravity Design System. Read sections in order for full understanding. -->

> Build React components in Storybook → Auto-generate workflow nodes + layout templates

**Two Types of Components:**

1. **Components** (`/storybook/components/`) - AI-streamable components → workflow nodes
2. **Templates** (`/storybook/templates/`) - Layout containers → render conversation history

---

## 📋 Table of Contents

### Getting Started

- [Quick Start](#quick-start) - 5-minute setup
- [Your First Component](#your-first-component) - Step-by-step tutorial
- [Key Features](#key-features)
- [How It Works](#how-it-works)

### Components (Workflow Nodes)

- [Component Structure](#component-structure)
- [Creating Components](#creating-components)
- [ArgTypes Reference](#argtypes-reference)
- [Styling with Tailwind](#styling-with-tailwind)
- [Component Best Practices](#component-best-practices)

### Templates (Layout Containers)

- [What Are Templates](#what-are-templates)
- [Creating Templates](#creating-templates)
- [Template Patterns](#template-patterns)

### Reference

- [Supported Control Types](#supported-control-types)
- [Template Systems](#template-systems-handlebars-vs-javascript)
- [API Reference](#api-reference)
- [Troubleshooting](#troubleshooting)

### Examples

- [Complete Examples](#complete-examples)

---

## Quick Start

<!-- LLM: This section provides a 5-minute getting started guide with copy-paste code. -->

### Prerequisites

- Node.js 18+
- React knowledge
- TypeScript (optional but recommended)

### Install & Setup

```bash
cd /path/to/design-system
npm install
npm run storybook  # Preview components
```

### Your First Component (5 Minutes)

**Step 1: Create component files**

```bash
mkdir -p storybook/components/MyCard
cd storybook/components/MyCard
```

**Step 2: Create `MyCard.tsx`**

```tsx
import React from "react";

export interface MyCardProps {
  title: string;
  description?: string;
}

export default function MyCard({ title, description }: MyCardProps) {
  return (
    <div className="w-full bg-white dark:bg-zinc-900 rounded-xl shadow-lg p-6">
      <h3 className="text-xl font-semibold text-gray-900 dark:text-white">{title}</h3>
      {description && <p className="text-gray-600 dark:text-gray-400 mt-2">{description}</p>}
    </div>
  );
}
```

**Step 3: Create `MyCard.stories.tsx`**

```tsx
import type { Meta, StoryObj } from "@storybook/react";
import MyCard from "./MyCard";

const meta: Meta<typeof MyCard> = {
  title: "Components/MyCard",
  component: MyCard,
  argTypes: {
    title: {
      control: "text",
      description: "Card title",
    },
    description: {
      control: "text",
      description: "Card description",
    },
  },
};

export default meta;
type Story = StoryObj<typeof MyCard>;

export const Default: Story = {
  args: {
    title: "Hello World",
    description: "This is my first component!",
  },
};
```

**Step 4: Create `defaults.ts`**

```tsx
export const MyCardDefaults = {
  title: "Hello World",
  description: "This is my first component!",
};
```

**Step 5: Generate workflow node**

```bash
npm run generate-nodes
```

✅ **Done!** Your component is now:

- Available in Storybook at `http://localhost:6006`
- Generated as a workflow node in `/src/MyCard/`
- Bundled to `/dist/components/MyCard.js`
- Ready to use in workflows

## Key Features

- **React + Tailwind v4** - Full React features, utility-first CSS with Shadow DOM isolation
- **Auto-generated nodes** - Storybook `argTypes` → workflow node inputs
- **Dynamic loading** - Components served via URL (8KB average bundle size)
- **Design tokens** - Modular CSS in `/storybook/ingestion/styles/` (colors, typography)
- **Shadow DOM** - Complete CSS isolation, no conflicts with client apps

## How It Works

### Templates (Layout Containers)

Templates are **loaded by URL** - the client fetches the JS bundle and renders it directly.

```
Client → HTTP GET /components/ChatLayout.js → Render template
```

### Components (AI-Streamable)

Components are **streamed via WebSocket** to the shared client history, then rendered by the active template.

```
1. Server sends COMPONENT_INIT via WebSocket: { componentUrl, props }
2. Client loads component JS from componentUrl
3. Client stores component in shared history (with loaded Component reference)
4. Template renders from history
```

**Key Architecture:**

- **History is the universal truth** - all components live in shared history
- **History persists across template switches** - components don't disappear
- **Templates read from history** - they render what's there, they don't own components
- **Any template can render any component** - because history is universal

**Benefits:** 10x smaller payload, browser caching, full React features, auto-styled, universal history

## Component Structure

<!-- LLM: This section explains the directory structure and difference between components and templates. -->

```
storybook/
├── components/          # AI-streamable components (GENERATED as workflow nodes)
│   ├── Card/
│   │   ├── Card.tsx
│   │   ├── Card.stories.tsx
│   │   └── defaults.ts
│   ├── BookingWidget/
│   ├── AIResponse/
│   └── KenBurnsImage/
│
├── templates/           # Layout templates (NOT generated, used by client app)
│   ├── ChatLayout/
│   │   ├── ChatLayout.tsx
│   │   └── ChatLayout.stories.tsx
│   ├── BookingWidgetLayout/
│   └── KeyService/
│
├── ingestion/           # Component generation system
└── dist/                # Generated bundles
    └── components/      # Bundled JS files served to clients
```

### Components vs Templates

<!-- LLM: Key distinction - Components become workflow nodes, Templates do not. -->

| Aspect                  | Components                      | Templates               |
| ----------------------- | ------------------------------- | ----------------------- |
| **Location**            | `/storybook/components/`        | `/storybook/templates/` |
| **Purpose**             | AI-streamable UI elements       | Layout containers       |
| **Generated as nodes?** | ✅ Yes                          | ❌ No                   |
| **Sent by AI?**         | ✅ Yes                          | ❌ No                   |
| **Loaded by client?**   | ✅ Yes (dynamically)            | ✅ Yes (on init)        |
| **Examples**            | Card, BookingWidget, AIResponse | ChatLayout, Dashboard   |

### `/components/` - AI-Streamable Components

**Purpose:** Components that can be dynamically streamed from AI workflows to clients.

**Required Files:**

- `ComponentName.tsx` - React component
- `ComponentName.stories.tsx` - Storybook stories with argTypes
- `defaults.ts` - Default values for preview

**Characteristics:**

- ✅ Generated as workflow nodes (via `npm run generate-nodes`)
- ✅ Bundled to `/dist/components/` for WebSocket delivery
- ✅ Self-contained (includes all dependencies, CSS, logic)
- ✅ Can be mounted/unmounted by AI
- ✅ Accept props from AI workflow

**Examples:** Card, BookingWidget, StreamingText, KenBurnsImage

### `/templates/` - Layout Templates

**Purpose:** Layout containers that render conversation history and manage template-specific UI state.

**Required Files:**

- `TemplateName.tsx` - React component
- `TemplateName.stories.tsx` - Storybook stories
- `README.md` - Template documentation (optional)

**Characteristics:**

- ❌ NOT generated as workflow nodes (AI doesn't send these)
- ✅ Bundled to `/dist/components/` (loaded by client like components)
- ✅ Used by client app to render conversation history
- ✅ Manage template-specific state (scroll position, filters, UI state)
- ✅ Receive universal history from HistoryManager
- ✅ Render components from history
- ✅ **Loaded automatically from InputTrigger config** (no workflow execution needed)

**Examples:** ChatLayout, BookingWidgetLayout, DashboardLayout, KeyService

**Styling:** Use Tailwind v4 classes directly - Shadow DOM provides CSS isolation

### How Templates Load

Templates are specified in the InputTrigger node configuration and load **before** workflow execution:

**1. Configure in InputTrigger:**

```typescript
{
  template: "BookingWidgetLayout"; // Specify template in node config
}
```

**2. Client connects:**

```javascript
// Client sends workflowId + targetTriggerNode
const sessionParams = {
  workflowId: "wf-htmn4a",
  targetTriggerNode: "inputtrigger9",
};
```

**3. Server loads template:**

- Reads InputTrigger config from WorkflowCache (fast!)
- Sends `COMPONENT_INIT` with template
- Template loads instantly (no workflow execution)

**4. User interacts:**

- Template is already loaded
- User sends message → workflow executes
- Results stream to already-loaded template

**Performance:** Templates load in <10ms using WorkflowCache (memory/Redis).

> 📖 **For detailed template documentation**, see [/storybook/templates/README.md](storybook/templates/README.md)

## Example Component

```tsx
// Card.tsx
import React, { useState } from "react";

export default function Card({ title, description, cta }) {
  const [isExpanded, setIsExpanded] = useState(false);

  return (
    <div className="bg-white rounded-lg shadow-lg p-6">
      <h3 className="text-2xl font-bold">{title}</h3>
      <p className="text-gray-700 mt-2">{description}</p>
      <button
        className="bg-primary-500 text-white px-6 py-3 rounded-lg mt-4"
        onClick={() => setIsExpanded(!isExpanded)}
      >
        {cta}
      </button>
    </div>
  );
}
```

```tsx
// Card.stories.tsx
export default {
  title: "Components/Card",
  component: Card,
  argTypes: {
    title: { control: "text", description: "Card title" },
    description: { control: "text", description: "Card description" },
    cta: { control: "text", description: "Button text" },
  },
};

export const Default = {
  args: { title: "Hello", description: "World", cta: "Click me" },
};
```

### **✅ ALL React Features Supported**

#### 1. **All Hooks**

```tsx
// ✅ ALL WORK!
const [count, setCount] = useState(0);
const memoized = useMemo(() => expensive(), [deps]);
const callback = useCallback(() => handler(), []);
const [state, dispatch] = useReducer(reducer, init);
const ref = useRef(null);
```

#### 2. **Custom Hooks**

```tsx
// ✅ WORKS!
const { data, loading } = useCustomHook();
const user = useAuth();
const theme = useTheme();
```

#### 3. **Third-Party Libraries**

```tsx
// ✅ WORKS! (as long as they're installed in design-system package)
import { DatePicker } from "react-datepicker";
import { Button } from "@mui/material";
```

#### 4. **React Context**

```tsx
// ✅ WORKS!
const ThemeContext = createContext();
const theme = useContext(ThemeContext);
```

#### 5. **All React Patterns**

```tsx
// ✅ Everything works - it's just React!
{
  isVisible && <div>Content</div>;
}
{
  items.map((item) => <Item key={item.id} {...item} />);
}
<Suspense fallback={<Loading />}>
  <LazyComponent />
</Suspense>;
```

### 2. Styling with Tailwind v4 CSS

All components use **Tailwind v4** with **Shadow DOM isolation** (no prefix needed):

```tsx
// Use standard Tailwind classes - Shadow DOM prevents conflicts
<div className="w-full h-full min-w-[320px]">
  <h1 className="text-4xl font-bold text-primary-500">Title</h1>
  <p className="text-gray-700 mt-4">Description text</p>
</div>
```

**Design Tokens Available:**

- Colors: `text-primary-500`, `bg-secondary-600` (defined in `/storybook/ingestion/styles/colors.css`)
- Typography: `font-sans`, `font-display`, `text-2xl` (defined in `/storybook/ingestion/styles/typography.css`)
- Spacing: `p-6`, `m-4`, `space-y-4`
- Filters: `blur-[6px]`, `brightness-110`
- Animations: Define inline with `@keyframes` in your component

**Shadow DOM Isolation:**

- CSS is injected into Shadow DOM, not main document
- No CSS conflicts with client applications
- Components are completely self-contained

**Custom Animations:**
Define animations inline in your component using `<style>` tags:

```tsx
export default function AnimatedComponent() {
  return (
    <div className="relative w-full h-full">
      <style>{`
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
      `}</style>

      <div style={{ animation: "fadeIn 1s ease-out" }}>Content</div>
    </div>
  );
}
```

This ensures animations are bundled with the component and work in Shadow DOM.

### 3. Define ArgTypes in Stories (Required)

**IMPORTANT: Separate Workflow Inputs from Template Props**

Components have two types of props:

- **Workflow Inputs** (`workflowInput: true`) - Data from AI/workflow (e.g., `title`, `description`)
- **Template Props** (`workflowInput: false`) - Callbacks/config wired by template (e.g., `onClick`, `editable`)

**Only props marked with `workflowInput: true` become workflow node inputs.**

```tsx
// YourComponent.stories.tsx
import type { Meta, StoryObj } from "@storybook/react";
import { YourComponent } from "./YourComponent";

const meta: Meta<typeof YourComponent> = {
  title: "Components/YourComponent",
  component: YourComponent,
  parameters: {
    layout: "centered",
  },
  argTypes: {
    // ✅ Workflow inputs - data from AI
    title: {
      control: "text",
      description: "Component title",
      workflowInput: true, // ← Becomes workflow node input
    },
    description: {
      control: "text",
      description: "Component description",
      workflowInput: true, // ← Becomes workflow node input
    },
    size: {
      control: "select",
      options: ["small", "medium", "large"],
      description: "Component size",
      workflowInput: true, // ← Becomes workflow node input
    },

    // ❌ Template props - NOT workflow inputs
    editable: {
      control: "boolean",
      description: "Whether component is editable",
      workflowInput: false, // ← Template wires this
    },
    onClick: {
      action: "clicked",
      workflowInput: false, // ← Template wires this callback
    },
  },
};

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: YourComponentDefaults,
};
```

**Rule:** If `workflowInput` is not specified or set to `false`, the prop will NOT become a workflow input.

### 4. Create defaults.ts File (Required)

**All components must have a `defaults.ts` file** that exports default values for Storybook demos and workflow editor preview.

**IMPORTANT: The export must be imported from `'./defaults'` in your stories file for the generator to find it.**

#### Pattern 1: Flat Props (Simple Components)

```tsx
// YourComponent/defaults.ts
export const YourComponentDefaults = {
  title: "Default Title",
  description: "Default description text",
  size: "medium",
  enabled: true,
};
```

```tsx
// YourComponent.stories.tsx
import { YourComponentDefaults } from "./defaults"; // ← Must import from './defaults'

export const Default: Story = {
  args: YourComponentDefaults, // ← Direct reference
};
```

#### Pattern 2: Nested Object Props (Complex Components)

```tsx
// BookingWidget/defaults.ts
export const defaultBookingData: BookingData = {
  service: "Sports Injury Assessment",
  therapist: "Dr. Sarah Mitchell",
  date: "2025-10-28",
  // ... all booking fields
};
```

```tsx
// BookingWidget.stories.tsx
import { defaultBookingData } from "./defaults"; // ← Must import from './defaults'

export const Default: Story = {
  args: {
    bookingData: defaultBookingData, // ← Nested under prop name
    editable: true,
  },
};
```

**The generator will extract defaults for all props marked with `workflowInput: true`.**

**How Defaults Work:**

1. **Storybook** - Uses defaults for demo/preview
2. **Workflow Editor** - Shows defaults in component preview when node config is empty
3. **Published to Client** - Defaults are NOT sent, only explicitly set config values

**Example Flow:**

```
1. User drags AIResponse node onto workflow
   → Component preview shows Star Wars defaults from defaults.ts

2. User configures node with actual values
   → Preview updates to show user's values

3. Workflow executes and publishes component
   → Only user's values sent to client (no defaults)
```

**Why This Pattern?**

- ✅ Components look good in Storybook demos
- ✅ Components look good in workflow editor preview
- ✅ No unwanted defaults published to production
- ✅ Standardized across all components

### 5. Supported Control Types (Auto-Generated Schema)

The generator automatically converts Storybook controls to workflow node inputs:

| Storybook Control    | Workflow Input                   | Generated Schema                               | Example                                                      |
| -------------------- | -------------------------------- | ---------------------------------------------- | ------------------------------------------------------------ |
| `control: 'text'`    | Text input with template support | `type: "string"`, `ui:field: "template"`       | `{ control: 'text' }`                                        |
| `control: 'boolean'` | Toggle switch                    | `type: "boolean"`, `ui:widget: "toggle"`       | `{ control: 'boolean' }`                                     |
| `control: 'number'`  | Number input                     | `type: "number"`                               | `{ control: 'number' }`                                      |
| `control: 'range'`   | Number input with min/max/step   | `type: "number"`, `minimum`, `maximum`, `step` | `{ control: { type: 'range', min: 1, max: 10, step: 0.1 } }` |
| `control: 'select'`  | Dropdown with enum values        | `type: "string"`, `enum`, `enumNames`          | `{ control: 'select', options: ['a', 'b'] }`                 |
| `control: 'object'`  | JSON editor                      | `type: "object"`, `ui:field: "JSON"`           | `{ control: 'object' }`                                      |

**Select Control Example:**

```tsx
argTypes: {
  direction: {
    control: 'select',
    options: ['left', 'right', 'center'],
    description: 'Alignment direction',
  },
}
```

This generates a dropdown in the workflow with options: "Left", "Right", "Center"

### 6. Template Systems - Handlebars vs JavaScript

**Two template systems are available based on the control type:**

#### Handlebars Templates (`control: 'text'`)

For **string fields**, use Handlebars syntax to reference workflow data:

```tsx
argTypes: {
  progressText: {
    control: 'text',  // ← Handlebars template
    description: 'Progress/thinking message',
  },
}
```

**Syntax:**

```handlebars
{{signal.openai26.text}}
{{input.userName}}
{{workflow.variables.userId}}
```

**Generated Schema:**

```typescript
{
  type: "string",
  "ui:field": "template"
}
```

**Use Cases:**

- Simple text interpolation
- Accessing single values from upstream nodes
- String concatenation

#### JavaScript Templates (`control: 'object'`)

For **object/array fields**, use JavaScript `return` statements:

```tsx
argTypes: {
  text: {
    control: 'object',  // ← JavaScript template
    description: 'Main response text',
  },
  questions: {
    control: 'object',  // ← JavaScript template
    description: 'Follow-up questions (array of strings)',
  },
}
```

**Syntax:**

```javascript
return signal.openaistream25.chunk;
return signal.bedrockclaude25.output.questions;
return [signal.question1.text, signal.question2.text, signal.question3.text];
```

**Generated Schema:**

```typescript
{
  type: "object",
  "ui:field": "template"
}
```

**Use Cases:**

- Accessing nested object properties
- Returning arrays
- Complex data transformations
- Conditional logic

#### Choosing the Right Template System

| Field Type      | Control Type        | Template System | Example                                     |
| --------------- | ------------------- | --------------- | ------------------------------------------- |
| Simple text     | `control: 'text'`   | Handlebars      | `{{signal.node.text}}`                      |
| Object/Array    | `control: 'object'` | JavaScript      | `return signal.node.chunk`                  |
| Nested data     | `control: 'object'` | JavaScript      | `return signal.node.output.questions`       |
| Computed values | `control: 'object'` | JavaScript      | `return signal.items.filter(x => x.active)` |

#### Real Example: AIResponse Component

```tsx
// AIResponse.stories.tsx
argTypes: {
  progressText: {
    control: 'text',  // Handlebars
    description: 'Progress/thinking message',
  },
  text: {
    control: 'object',  // JavaScript
    description: 'Main response text',
  },
  questions: {
    control: 'object',  // JavaScript
    description: 'Follow-up questions (array of strings)',
  },
}
```

**In Workflow Configuration:**

```javascript
// progressText (Handlebars)
{
  {
    signal.openai26.text;
  }
}

// text (JavaScript)
return signal.openaistream25.chunk;

// questions (JavaScript)
return signal.bedrockclaude25.output.questions;
```

**Key Difference:**

- **`control: 'text'`** → Handlebars `{{...}}` → Returns string
- **`control: 'object'`** → JavaScript `return ...` → Returns object/array

## Best Practices

### Component Patterns & Default Data

**All components must show meaningful content in the workflow editor preview.** When a component is added to a workflow, it renders with empty/default config before the user fills in values.

#### Pattern 1: **Static Components** (Card, Image, Button)

Components with required props that always have data to show.

**Example:**

```tsx
interface CardProps {
  title: string; // Required - always has data
  description?: string; // Optional enhancement
  imageUrl?: string; // Optional enhancement
  cta?: string; // Optional enhancement
}

export default function Card({ title, description, imageUrl, cta }: CardProps) {
  return (
    <div className="card">
      <h3>{title}</h3> {/* Always renders */}
      {description && <p>{description}</p>}
      {imageUrl && <img src={imageUrl} />}
      {cta && <button>{cta}</button>}
    </div>
  );
}
```

**How defaults work:**

- Required props get default values from `DEFAULT_DATA` in stories
- Node generator extracts these and puts them in `configSchema.properties.*.default`
- Component always receives at least the required props with defaults

#### Pattern 2: **Optional Props Components** (AIResponse, StreamingText)

Components where ALL props are optional (for streaming/reactive updates).

**Example:**

```tsx
interface AIResponseProps {
  progressText?: string; // All optional
  text?: string;
  questions?: string[];
}

export default function AIResponse(props: AIResponseProps) {
  const { progressText, text, questions } = props;

  // Check if ANY data has been received
  const hasData = progressText || text || (questions && questions.length > 0);

  // IMPORTANT: Show default sample data when no props provided
  // This makes the component look good in workflow preview
  if (!hasData) {
    return (
      <div className="ai-response">
        <div className="progress">Searching the Jedi Archives...</div>
        <div className="text">
          The <strong>Star Wars</strong> saga spans nine main films...
        </div>
        <button>What is the correct chronological order?</button>
      </div>
    );
  }

  // Render actual content when data arrives
  return (
    <div className="ai-response">
      {progressText && <div className="progress">{progressText}</div>}
      {text && <div className="text">{text}</div>}
      {questions && questions.map((q) => <button key={q}>{q}</button>)}
    </div>
  );
}
```

**How defaults work:**

- All props are optional, so component may receive NO props
- Component must render default sample data internally
- Default sample data should match `DEFAULT_DATA` from stories
- When real data arrives, it replaces the defaults

#### Key Rule for ALL Components

**Every component must look good with no user input:**

```tsx
// ✅ GOOD - Shows sample data
if (!hasData) {
  return <div>Sample content from DEFAULT_DATA...</div>;
}

// ❌ BAD - Shows blank/placeholder
if (!hasData) {
  return <div>Waiting for data...</div>;
}

// ❌ BAD - Shows error/empty state
if (!hasData) {
  return <div>No data provided</div>;
}
```

**Why?** The workflow editor preview renders components with default/empty config. Users need to see what the component looks like before configuring it.

### Keep Props Simple

- **3-5 props maximum** - Too many inputs make the workflow node complex
- Use sensible defaults
- Avoid complex objects as props

### Bad Example ❌

```tsx
interface ComplexProps {
  config: {
    layout: "grid" | "list" | "masonry";
    columns: number;
    gap: number;
    responsive: {
      mobile: number;
      tablet: number;
      desktop: number;
    };
  };
  theme: ThemeConfig;
  handlers: EventHandlers;
  // Too complex!
}
```

### Sizing Guidelines

**In Workflow Editor:**

- Set `min-width` in CSS (e.g., 320px for cards, 400px for images)
- Component auto-sizes based on content
- Users can resize the workflow node if needed

**In Client:**

- Component is fully fluid
- Fills its container
- No max-width constraints

```css
/* Perfect for both workflow and client */
.container {
  width: 100%;
  height: 100%;
  min-width: 320px; /* Workflow visibility */
  /* No max-width - stays fluid in client */
}
```

---

## Templates - Layout Containers

### What Are Templates?

Templates are **layout components** that receive conversation history and decide how to render it. Unlike workflow components (which AI sends), templates are loaded by the client app and interpret the history stream.

### Key Concept: State Separation

**Two-Layer State Architecture:**

```
┌─────────────────────────────────────────┐
│  CLIENT STATE (Universal)               │
│  - HistoryManager                       │
│  - User messages                        │
│  - AI components (with loaded Component)│
│  - Conversation metadata                │
└─────────────────────────────────────────┘
                 ↓ history prop
┌─────────────────────────────────────────┐
│  TEMPLATE STATE (Local)                 │
│  - Scroll position                      │
│  - UI filters                           │
│  - Layout-specific state                │
│  - How to render history                │
└─────────────────────────────────────────┘
```

**Client State (HistoryManager):**

- Universal across ALL templates
- Manages conversation timeline
- Collects user messages and AI components
- Framework-agnostic (can extract to npm)

**Template State (Local):**

- Specific to each template
- Manages UI/UX behavior
- Interprets history differently per template
- React useState/useReducer

### Template Contract

All templates MUST extend `GravityTemplateProps`:

```typescript
// From core/types.ts
interface GravityTemplateProps {
  /** Client context with all utilities */
  client: {
    /** Send a message to the workflow */
    sendMessage: (message: string, options?: { targetTriggerNode?: string }) => void;

    /** Send agent message through server pipeline (Amazon Connect, etc.) */
    sendAgentMessage: (data: {
      content: string;
      chatId: string;
      agentName?: string;
      source?: string;
      props?: Record<string, any>;
      metadata?: Record<string, any>;
    }) => void;

    /** Emit custom action for cross-boundary communication */
    emitAction: (type: string, data: any) => void;

    /** History for rendering (read-only) */
    history: {
      entries: HistoryEntry[];
      getResponses: () => AssistantResponse[];
    };

    /** Session context */
    session: SessionParams;
  };

  /** Callback: Template shares state back to client */
  onStateChange?: (state: { streamingState?: StreamingState; [key: string]: any }) => void;

  /** Template-specific props */
  [key: string]: any;
}
```

### History Entry Structure

```typescript
interface HistoryEntry {
  id: string;
  type: "user_message" | "component";
  role: "user" | "assistant";
  timestamp: string;

  // For user messages
  content?: string;

  // For components
  componentType?: string;
  componentUrl?: string;
  props?: Record<string, any>;
  metadata?: Record<string, any>;
  Component?: any; // Loaded component function
}
```

### Creating a Template

**1. Create Template File:**

```tsx
// /storybook/templates/ChatLayout/ChatLayout.tsx
import React, { useEffect, useRef, useCallback } from "react";
import type { GravityTemplateProps } from "../core";
import { renderComponent } from "../core";

export interface ChatLayoutProps extends GravityTemplateProps {
  placeholder?: string;
  autoScroll?: boolean;
}

export default function ChatLayout(props: ChatLayoutProps) {
  const { client, onStateChange, placeholder, autoScroll } = props;

  // Access history from client
  const history = client.history.entries;

  // Template-specific state
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Wrap sendMessage to notify parent of streaming state
  const handleSend = useCallback(
    (message: string) => {
      onStateChange?.({ isStreaming: true });
      client.sendMessage(message);
    },
    [client, onStateChange]
  );

  // Template-specific logic (auto-scroll)
  useEffect(() => {
    if (autoScroll && messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [history.length, autoScroll]);

  return (
    <div className="flex flex-col h-screen w-full bg-gray-50">
      {/* Scrollable messages */}
      <div className="flex-1 overflow-y-auto px-4 py-6 space-y-4">
        {history.map((entry) => {
          // User message - chat bubble on right
          if (entry.type === "user_message") {
            return (
              <div key={entry.id} className="flex justify-end">
                <div className="bg-blue-500 text-white rounded-2xl px-4 py-2">
                  <p className="text-sm">{entry.content}</p>
                </div>
              </div>
            );
          }

          // Assistant response - render components
          if (entry.type === "assistant_response") {
            return entry.components.map((component) => (
              <div key={component.id} className="flex justify-start">
                {renderComponent(component)}
              </div>
            ));
          }
        })}
        <div ref={messagesEndRef} />
      </div>

      {/* Fixed input at bottom */}
      <div className="border-t border-gray-200 bg-white px-4 py-4">
        <input
          type="text"
          placeholder={placeholder}
          onKeyDown={(e) => {
            if (e.key === "Enter" && e.currentTarget.value.trim()) {
              handleSend(e.currentTarget.value.trim());
              e.currentTarget.value = "";
            }
          }}
        />
      </div>
    </div>
  );
}
```

**2. Create Storybook Story:**

```tsx
// ChatLayout.stories.tsx
import type { Meta, StoryObj } from "@storybook/react";
import ChatLayout from "./ChatLayout";

const meta: Meta<typeof ChatLayout> = {
  title: "Templates/ChatLayout",
  component: ChatLayout,
  parameters: {
    layout: "fullscreen",
  },
};

export default meta;

export const WithHistory: Story = {
  args: {
    history: [
      {
        id: "msg-1",
        type: "user_message",
        role: "user",
        content: "Hello!",
        timestamp: new Date().toISOString(),
      },
      {
        id: "comp-1",
        type: "component",
        role: "assistant",
        componentType: "Card",
        timestamp: new Date().toISOString(),
      },
    ],
    placeholder: "Ask me anything...",
    autoScroll: true,
  },
};
```

**3. Generate Bundle:**

```bash
npm run generate-nodes
```

This bundles the template to `dist/components/ChatLayout.js` (with CSS injected).

### Template Examples

**ChatLayout - Sequential Timeline:**

- User messages on right
- AI components on left
- Auto-scroll to bottom
- Fixed input at bottom

**BookingLayout - Master Widget:**

- User messages in sidebar
- First component = Master booking widget
- Subsequent components update the widget
- Search input in sidebar

**DashboardLayout - Widget Grid:**

- Components grouped by `widgetId`
- Rendered in grid layout
- Latest component per widget wins
- No user message display

### Helper Utilities

**useGravityTemplate Hook:**

```typescript
const {
  getUserMessages, // Filter to user messages only
  getComponents, // Filter to components only
  getByRole, // Filter by role (user/assistant)
  getLatest, // Get latest entry
  getFirst, // Get first entry
  renderComponent, // Safely render component
} = useGravityTemplate(history);
```

**Example Usage:**

```tsx
// Get only user messages for sidebar
const userMessages = getUserMessages();

// Get first component as master widget
const masterWidget = getComponents()[0];

// Render component safely (handles loading state)
{
  renderComponent(entry);
}
```

### Client Integration

**In Client App (e.g., GravityAIClient):**

```javascript
// 1. Initialize HistoryManager
const { history, addUserMessage, addComponent } = useHistoryManager(sessionParams);

// 2. Load template
const chatLayout = await loadComponent("/components/ChatLayout.js", "ChatLayout");

// 3. Render template with history
return h(ComponentRenderer, {
  component: {
    Component: chatLayout,
    name: "ChatLayout",
    props: {
      history: history, // Full history from HistoryManager
      onSend: handleSendMessage,
      isStreaming: isStreaming,
    },
  },
});
```

### Key Principles

1. **Templates are layout only** - They provide structure, not content
2. **History is universal** - Same history works for any template
3. **Templates are stateful** - Can maintain local UI state
4. **Templates interpret history** - Each template renders history differently
5. **No workflow nodes** - Templates are never sent from AI

### Benefits

✅ **Template Switching** - Change layout without losing history  
✅ **Flexible Rendering** - Each template interprets history differently  
✅ **Type Safety** - TypeScript ensures compliance with GravityTemplateProps  
✅ **Reusable** - Templates work across all AI workflows  
✅ **Testable** - Easy to test with mock history

---

## Generating Workflow Nodes

1. **Build and Generate:**

   ```bash
   npm run generate-nodes
   ```

2. **What Gets Generated:**

   - `/src/[ComponentName]/node/` - Node definition and executor
   - `/src/[ComponentName]/service/` - Minimal template service (only componentUrl)
   - `/src/[ComponentName]/util/` - TypeScript types
   - `/dist/components/[ComponentName].js` - Bundled component with CSS

3. **What Gets Sent to Client:**

   ```json
   {
     "type": "Card",
     "componentUrl": "/components/Card.js?v=1760073564823",
     "props": {
       "title": "Golf Swing Assessment",
       "description": "...",
       "imageUrl": "...",
       "cta": "..."
     },
     "metadata": { "nodeId": "card2" }
   }
   ```

   **That's it!** No HTML, no CSS, no tokens. Just the URL and props.

4. **Restart Server:**

   ```bash
   cd /path/to/server
   npm run dev design-system
   ```

5. **Your component is now available** in the workflow editor under "Design System" category

## Common Patterns

### Text-Heavy Components

```tsx
// 2-3 text props maximum
interface TextComponentProps {
  heading: string;
  body?: string;
  cta?: string;
}
```

### Image Components

```tsx
// Keep it simple
interface ImageComponentProps {
  src: string;
  alt?: string;
  caption?: string;
}
```

### Interactive Components

```tsx
// Avoid event handlers in workflow nodes
// Use simple data props instead
interface ButtonProps {
  label: string;
  variant?: "primary" | "secondary";
  size?: "sm" | "md" | "lg";
}
```

## Troubleshooting

### Component not showing in workflow?

- Check that `argTypes` is defined in stories
- Ensure `DEFAULT_DATA` constant exists
- Run `npm run generate-nodes` again
- Restart the server

### Component too wide in workflow?

- Add `min-width` to your CSS
- Remove any `max-width` constraints
- Use `width: 100%` for fluid behavior

### Component not fluid in client?

- Remove fixed `width` values from CSS
- Use `width: 100%` instead
- Avoid `max-width` constraints

## Examples

See existing components for reference:

- `/src/components/Card/` - Simple card with image and text
- `/src/components/Image/KenBurnsImage.tsx` - Image with animation

## Summary Checklist

### ✅ **DO:**

- ✅ Write **any React code** - all features supported!
- ✅ Use all hooks (useState, useEffect, useMemo, custom hooks, etc.)
- ✅ Use third-party React libraries (if installed in package.json)
- ✅ Use React Context, Suspense, etc.
- ✅ Use CSS modules
- ✅ Define argTypes in stories
- ✅ Keep props simple (3-5 max recommended)
- ✅ Use DEFAULT_DATA constant for defaults
- ✅ Set min-width for workflow visibility
- ✅ Use `control: 'text'` for string fields (Handlebars templates)
- ✅ Use `control: 'object'` for object/array fields (JavaScript templates)

### ⚠️ **REMEMBER:**

- Components are bundled and sent to React client dynamically
- No npm install needed on client side
- Full React features work because client IS React
- Components update without redeploying client

### 🔧 **Build Command:**

```bash
npm run generate-nodes
```

This will:

1. **Bundle components** with Vite (React as external, CSS injected into JS)
2. **Extract metadata** from Storybook (argTypes, defaults)
3. **Generate workflow nodes** with minimal template (only componentUrl)
4. **Save to** `dist/components/ComponentName.js`

**At Runtime:**

1. Server serves components from `/components/:name` endpoint
2. Executor sends minimal payload: `{ type, componentUrl, props }`
3. Client loads component via `<script>` tag
4. CSS auto-injected when JS loads
5. Component renders with full React features

---

## 📝 Complete Working Example

### BookingWidget.tsx (Full React - All Features Supported)

```tsx
import React, { useState } from "react";
import styles from "./BookingWidget.module.css";

export interface BookingWidgetProps {
  hotelId: string;
  rooms: Array<{ id: number; name: string; price: number; available: boolean }>;
  loading?: boolean;
  onBook?: (roomId: number, guests: number) => void;
}

export default function BookingWidget(props: BookingWidgetProps) {
  const { rooms, loading, onBook } = props;
  const [selectedRoom, setSelectedRoom] = useState<number | null>(null);
  const [guests, setGuests] = useState(1);

  // Inline logic (no custom hooks)
  const availableRooms = rooms.filter((r) => r.available);

  if (loading) {
    return <div className={styles.loading}>Loading rooms...</div>;
  }

  return (
    <div className={styles.container}>
      <h2 className={styles.title}>Select Your Room</h2>

      <div className={styles.roomList}>
        {availableRooms.map((room) => (
          <div
            key={room.id}
            className={selectedRoom === room.id ? styles.roomSelected : styles.room}
            onClick={() => setSelectedRoom(room.id)}
          >
            <h3>{room.name}</h3>
            <p>${room.price}/night</p>
          </div>
        ))}
      </div>

      <div className={styles.guestSelector}>
        <label>Number of Guests:</label>
        <input type="number" min="1" max="10" value={guests} onChange={(e) => setGuests(Number(e.target.value))} />
      </div>

      <button
        className={styles.bookButton}
        disabled={!selectedRoom}
        onClick={() => selectedRoom && onBook?.(selectedRoom, guests)}
      >
        Book Now
      </button>
    </div>
  );
}
```

### BookingWidget.stories.tsx

```tsx
import type { Meta, StoryObj } from "@storybook/react";
import { BookingWidget } from "./BookingWidget";

const meta: Meta<typeof BookingWidget> = {
  title: "Components/BookingWidget",
  component: BookingWidget,
  argTypes: {
    hotelId: {
      control: "text",
      description: "Hotel identifier",
    },
    rooms: {
      control: "object",
      description: "Available rooms",
    },
    loading: {
      control: "boolean",
      description: "Loading state",
    },
  },
};

export default meta;
type Story = StoryObj<typeof BookingWidget>;

const DEFAULT_DATA = {
  hotelId: "hotel_123",
  rooms: [
    { id: 1, name: "Deluxe Room", price: 200, available: true },
    { id: 2, name: "Suite", price: 350, available: true },
    { id: 3, name: "Presidential", price: 500, available: false },
  ],
  loading: false,
  onBook: (roomId: number, guests: number) => {
    console.log(`Booked room ${roomId} for ${guests} guests`);
  },
};

export const Default: Story = {
  args: DEFAULT_DATA,
};

export const Loading: Story = {
  args: {
    ...DEFAULT_DATA,
    loading: true,
  },
};
```

### Result

After running `npm run generate-nodes`, this component will:

1. ✅ Be bundled to `dist/components/BookingWidget.js` (React as external)
2. ✅ Served from server at `/components/BookingWidget.js`
3. ✅ Client imports dynamically via URL (no npm install needed)
4. ✅ Maintain full state management (selectedRoom, guests)
5. ✅ Support all React features and interactions
6. ✅ Receive data via props from workflow
7. ✅ Be available as a workflow node in "Design System" category

### How It Works at Runtime

```javascript
// 1. Client receives minimal payload from server
const component = {
  type: 'BookingWidget',
  componentUrl: '/components/BookingWidget.js?v=123',
  props: { hotelId: 'hotel_123', rooms: [...] }
};

// 2. Client constructs full URL from GraphQL endpoint
const baseUrl = config.endpoint.replace('/graphql', '');
const fullUrl = `${baseUrl}${component.componentUrl}`;
// Result: http://localhost:4100/components/BookingWidget.js?v=123

// 3. Load component via script tag
const script = document.createElement('script');
script.src = fullUrl;
document.body.appendChild(script);

// 4. Component registers globally and CSS auto-injects
script.onload = () => {
  const BookingWidget = window.BookingWidget;  // Component available
  // CSS already injected into <head> by the bundle

  // 5. Render with props
  <BookingWidget {...component.props} />  // Full React features work!
};
```

### Key Points

- ✅ **10x smaller payload** - No HTML/CSS sent over network
- ✅ **Browser caching** - Component JS cached by URL
- ✅ **Auto-styled** - CSS injected when JS loads
- ✅ **Environment-agnostic** - Client constructs URL from its config
- ✅ **Full React** - All hooks, state, effects work perfectly

---

## Quick Reference: Components vs Templates

| Feature                 | Workflow Components         | Layout Templates                |
| ----------------------- | --------------------------- | ------------------------------- |
| **Location**            | `/storybook/components/`    | `/storybook/templates/`         |
| **Purpose**             | AI-streamable UI elements   | Layout containers for history   |
| **Generated as Nodes?** | ✅ Yes                      | ❌ No                           |
| **Bundled?**            | ✅ Yes (`dist/components/`) | ✅ Yes (`dist/components/`)     |
| **Sent by AI?**         | ✅ Yes (via workflow)       | ❌ No (loaded by client)        |
| **Receives Props?**     | ✅ From AI workflow         | ✅ From client app              |
| **Manages State?**      | ✅ Local component state    | ✅ Template UI state            |
| **Accesses History?**   | ❌ No                       | ✅ Yes (via props)              |
| **Examples**            | Card, ChatInput, Image      | ChatLayout, BookingLayout       |
| **State Layer**         | Component-local             | Template-local + HistoryManager |
| **Extends**             | React.Component             | GravityTemplateProps            |
| **Helper Hook**         | N/A                         | useGravityTemplate()            |

**Key Insight:** Components are **content**, templates are **containers**. Same history, different rendering.

---

## Reactive Component Updates (Streaming)

Design system components support **reactive updates** - they can receive incremental prop changes from streaming workflow nodes (like OpenAIStream) without re-rendering the entire component.

### How It Works

**Architecture:**

```
OpenAIStream chunk 1 → AIResponse executes → INIT (full component)
OpenAIStream chunk 2 → AIResponse executes → UPDATE (only changed props)
OpenAIStream chunk 3 → AIResponse executes → UPDATE (only changed props)
```

**Backend (Workflow Engine):**

1. Design system nodes (template: "uiComponent") **preserve their inputs** after execution
2. Track last sent props in `WorkflowContext.lastSentComponentProps`
3. On re-execution, diff current props vs last sent
4. Send only changed props to client

**Frontend (React Component):**

1. Receives INIT event → Renders full component
2. Receives UPDATE events → Merges changed props into existing component
3. Component accumulates state internally (e.g., streaming text)

### Example: Streaming Text to AIResponse

**Workflow:**

```
InputTrigger → OpenAIStream (callback) → AIResponse (promise)
                     ↓
                 emits chunks every 100ms
```

**Backend Behavior:**

```typescript
// First execution (all dependencies met)
lastSentComponentProps[airesponse1] = undefined
currentProps = { text: "...", questions: [...] }
→ Send INIT: { type: "AIResponse", props: { text: "...", questions: [...] } }
→ Store: lastSentComponentProps[airesponse1] = { text: "...", questions: [...] }

// Second execution (chunk arrives)
lastSentComponentProps[airesponse1] = { text: "...", questions: [...] }
currentProps = { text: "...", questions: [...], chunk: "Hello" }
→ Diff: { chunk: "Hello" } changed
→ Send UPDATE: { type: "AIResponse", props: { chunk: "Hello" }, metadata: { isUpdate: true } }
→ Store: lastSentComponentProps[airesponse1] = { text: "...", questions: [...], chunk: "Hello" }

// Third execution (chunk arrives)
→ Diff: { chunk: " world" } changed
→ Send UPDATE: { type: "AIResponse", props: { chunk: " world" }, metadata: { isUpdate: true } }
```

**Frontend Behavior:**

```typescript
// AIResponse component
const [accumulatedText, setAccumulatedText] = useState("");

useEffect(() => {
  if (chunk) {
    setAccumulatedText((prev) => prev + chunk); // Accumulate chunks
  }
}, [chunk]);

// Renders: "Hello" → "Hello world" → "Hello world how are you"
```

### Benefits

✅ **Efficient** - Only sends changed data (not full component spec)  
✅ **Smooth streaming** - Components update incrementally  
✅ **Bandwidth optimized** - 1KB response sends ~1KB total (not 75KB cumulative)  
✅ **State preserved** - Client manages accumulation, server stays lightweight  
✅ **Automatic** - No special code needed, works for any design system component

### Implementation Details

**Workflow Context Tracking:**

```typescript
interface WorkflowContext {
  // ... other fields
  lastSentComponentProps?: Record<string, Record<string, any>>;
  // Structure: { nodeId: { prop1: value1, prop2: value2 } }
}
```

**Input Preservation:**

```typescript
// In executingState.ts
const isDesignSystemNode = node?.data?.nodeDefinition?.template === "uiComponent";

if (!isDesignSystemNode) {
  updatedInputs = consumeNodeInputs(updatedInputs, event.nodeId, routeTable);
} else {
  // Keep inputs for reactive updates
  logger.debug(`🎨 Preserved inputs for design system node: ${event.nodeId}`);
}
```

**Delta Publishing:**

```typescript
// In publishComponent
const componentData =
  config.isUpdate && config.changedProps
    ? { ...config.component, props: config.changedProps } // Delta
    : config.component; // Full
```

### Client Integration

**Handling Updates:**

```typescript
// Client receives event
if (event.metadata.isUpdate) {
  // Merge changed props into existing component
  updateComponentProps(nodeId, event.data.component.props);
} else {
  // Initial render - full component
  renderComponent(nodeId, event.data.component);
}
```

### Use Cases

**Streaming Text:**

- OpenAIStream → AIResponse
- Each chunk updates `chunk` prop
- Component accumulates internally

**Loading States:**

- Node updates `loading: true` → `loading: false`
- Only `loading` prop sent on update

**Progressive Data:**

- Search results arrive incrementally
- Each batch updates `results` array
- Component shows growing list

### Notes

- Only works for design system nodes (template: "uiComponent")
- Regular workflow nodes still consume inputs normally
- Client decides whether to INIT or UPDATE based on component registry
- Server doesn't track client state - just diffs props
