# Components Guide

<!-- LLM: This is the complete guide for creating workflow components in the Gravity Design System. -->

> Components are AI-streamable React components that become workflow nodes

---

## 📋 Table of Contents

- [What Are Components?](#what-are-components)
- [Quick Start](#quick-start)
- [Required Files](#required-files)
- [Creating a Component](#creating-a-component)
- [ArgTypes Reference](#argtypes-reference)
- [Styling Guide](#styling-guide)
- [Best Practices](#best-practices)
- [Common Patterns](#common-patterns)
- [Troubleshooting](#troubleshooting)

---

## What Are Components?

<!-- LLM: Components are React components that become drag-and-drop workflow nodes. -->

**Components** are React components that:
- ✅ Become workflow nodes via `npm run generate-nodes`
- ✅ Are dynamically streamed from AI workflows to clients
- ✅ Accept props from AI workflow configuration
- ✅ Are self-contained (CSS, logic, dependencies included)
- ✅ Work in Shadow DOM with full CSS isolation

**Examples:** Card, BookingWidget, AIResponse, KenBurnsImage

**Key Difference from Templates:**
- **Components** → Sent by AI, become workflow nodes
- **Templates** → Loaded by client, layout containers only

---

## Quick Start

### Create Your First Component (5 Minutes)

**Step 1: Create directory**
```bash
mkdir -p storybook/components/MyCard
cd storybook/components/MyCard
```

**Step 2: Create `MyCard.tsx`**
```tsx
import React from 'react';
import styles from './MyCard.module.css';

export interface MyCardProps {
  title: string;
  description?: string;
}

export default function MyCard({ title, description }: MyCardProps) {
  return (
    <div className={styles.card}>
      <h3 className={styles.title}>{title}</h3>
      {description && <p className={styles.description}>{description}</p>}
    </div>
  );
}
```

**Step 2b: Create `MyCard.module.css`**
```css
@import '../../ingestion/styles/index.css';

.card {
  width: 100%;
  background-color: #ffffff;
  border-radius: var(--radius-xl);
  box-shadow: var(--shadow-lg);
  padding: var(--spacing-6);
}

.title {
  font-size: var(--text-headline-sm);
  font-weight: var(--font-weight-semibold);
  color: var(--color-text-primary);
}

.description {
  font-size: var(--text-body-md);
  color: var(--color-text-secondary);
  margin-top: var(--spacing-2);
}
```

**Step 3: Create `MyCard.stories.tsx`**
```tsx
import type { Meta, StoryObj } from '@storybook/react';
import MyCard from './MyCard';

const meta: Meta<typeof MyCard> = {
  title: 'Components/MyCard',
  component: MyCard,
  argTypes: {
    title: {
      control: 'text',
      description: 'Card title',
    },
    description: {
      control: 'text',
      description: 'Card description',
    },
  },
};

export default meta;
type Story = StoryObj<typeof MyCard>;

export const Default: Story = {
  args: {
    title: 'Hello World',
    description: 'This is my first component!',
  },
};
```

**Step 4: Create `defaults.ts`**
```tsx
export const MyCardDefaults = {
  title: 'Hello World',
  description: 'This is my first component!',
};
```

**Step 5: Generate node**
```bash
npm run generate-nodes
```

✅ **Done!** Component is now a workflow node.

---

## Required Files

<!-- LLM: Every component MUST have these three files. -->

Every component requires:

### 1. `ComponentName.tsx` - React Component
- Default export of React component
- TypeScript interface for props
- Use `w-full` for width (fills container)
- All React features supported (hooks, context, etc.)

### 2. `ComponentName.stories.tsx` - Storybook Stories
- **MUST use**: `const meta: Meta<typeof Component> = { ... }`
- **NOT**: `const meta = { ... } satisfies Meta<typeof Component>`
- Define `argTypes` with `control` properties
- Export `Default` story with args

### 3. `defaults.ts` - Default Values
- Export named constant: `ComponentNameDefaults`
- Used for Storybook preview
- Used for workflow editor preview
- NOT sent to production

---

## Creating a Component

<!-- LLM: Complete step-by-step guide with all requirements. -->

### Step 1: Component File Structure

```
storybook/components/MyComponent/
├── MyComponent.tsx          # React component
├── MyComponent.stories.tsx  # Storybook stories
├── defaults.ts              # Default values
└── README.md                # Documentation (optional)
```

### Step 2: Write React Component

**Key Requirements:**
- ✅ Use `w-full` for width (template controls layout)
- ✅ Export default function
- ✅ TypeScript interface for props
- ✅ All props optional OR provide defaults
- ✅ Show meaningful content with no props

**Example:**
```tsx
import React from 'react';

export interface CardProps {
  title: string;
  description?: string;
  imageUrl?: string;
}

export default function Card({ title, description, imageUrl }: CardProps) {
  return (
    <div className="w-full bg-white dark:bg-zinc-900 rounded-xl shadow-lg overflow-hidden">
      {imageUrl && (
        <img src={imageUrl} alt={title} className="w-full h-48 object-cover" />
      )}
      <div className="p-6">
        <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
          {title}
        </h3>
        {description && (
          <p className="text-gray-600 dark:text-gray-400 mt-2">
            {description}
          </p>
        )}
      </div>
    </div>
  );
}
```

### Step 3: Create Stories File

**CRITICAL: Use correct meta pattern**

```tsx
import type { Meta, StoryObj } from '@storybook/react';
import Card from './Card';
import { CardDefaults } from './defaults';

// ✅ CORRECT: Explicit type annotation
const meta: Meta<typeof Card> = {
  title: 'Components/Card',
  component: Card,
  parameters: {
    layout: 'centered',
  },
  argTypes: {
    title: {
      control: 'text',
      description: 'Card title',
    },
    description: {
      control: 'text',
      description: 'Card description',
    },
    imageUrl: {
      control: 'text',
      description: 'Image URL',
    },
  },
};

export default meta;
type Story = StoryObj<typeof Card>;

export const Default: Story = {
  args: CardDefaults,
};
```

**❌ WRONG: Using satisfies**
```tsx
// This will NOT be detected by the scanner
const meta = {
  // ...
} satisfies Meta<typeof Card>;
```

### Step 4: Create Defaults File

```tsx
// defaults.ts
export const CardDefaults = {
  title: 'Sample Card Title',
  description: 'This is a sample description showing what the card looks like.',
  imageUrl: 'https://images.unsplash.com/photo-1234567890',
};
```

### Step 5: Generate Workflow Node

```bash
npm run generate-nodes
```

This will:
1. Scan `storybook/components/` for components
2. Extract argTypes from stories
3. Generate workflow node in `src/ComponentName/`
4. Bundle component to `dist/components/ComponentName.js`

---

## ArgTypes Reference

<!-- LLM: Complete reference for all supported control types and how they map to workflow inputs. -->

### Supported Control Types

| Control Type | Workflow Input | Example |
|--------------|----------------|---------|
| `'text'` | Text input with template support | `{ control: 'text' }` |
| `'boolean'` | Toggle switch | `{ control: 'boolean' }` |
| `'number'` | Number input | `{ control: 'number' }` |
| `'range'` | Number with min/max/step | `{ control: { type: 'range', min: 1, max: 10 } }` |
| `'select'` | Dropdown with options | `{ control: 'select', options: ['a', 'b'] }` |
| `'object'` | JSON editor | `{ control: 'object' }` |

### ArgTypes Pattern

```tsx
argTypes: {
  // Text input (Handlebars template)
  title: {
    control: 'text',
    description: 'Card title',
  },
  
  // Boolean toggle
  enabled: {
    control: 'boolean',
    description: 'Enable feature',
  },
  
  // Number input
  count: {
    control: 'number',
    description: 'Item count',
  },
  
  // Range slider
  opacity: {
    control: {
      type: 'range',
      min: 0,
      max: 1,
      step: 0.1,
    },
    description: 'Opacity level',
  },
  
  // Select dropdown
  size: {
    control: 'select',
    options: ['small', 'medium', 'large'],
    description: 'Component size',
  },
  
  // Object/Array (JavaScript template)
  data: {
    control: 'object',
    description: 'Complex data object',
  },
  
  // Action handlers (not workflow inputs)
  onClick: { action: 'clicked' },
  onChange: { action: 'changed' },
}
```

### Template Systems

**Text fields** (`control: 'text'`) use **Handlebars**:
```handlebars
{{signal.openai26.text}}
{{input.userName}}
```

**Object fields** (`control: 'object'`) use **JavaScript**:
```javascript
return signal.openai26.chunk
return signal.bedrock.output.questions
```

---

## Styling Guide

<!-- LLM: Complete guide for styling components with CSS Modules and Shadow DOM. -->

### Use CSS Modules

All components use **CSS Modules** with pure CSS for Shadow DOM compatibility:

**Component.tsx:**
```tsx
import React from 'react';
import styles from './Component.module.css';

export default function Component({ title, description }) {
  return (
    <div className={styles.container}>
      <h3 className={styles.title}>{title}</h3>
      <p className={styles.description}>{description}</p>
    </div>
  );
}
```

**Component.module.css:**
```css
@import '../../ingestion/styles/index.css';

.container {
  width: 100%;
  background-color: #ffffff;
  border-radius: var(--radius-xl);
  box-shadow: var(--shadow-lg);
  padding: var(--spacing-6);
}

.title {
  font-family: var(--font-heading);
  font-size: var(--text-headline-sm);
  font-weight: var(--font-weight-semibold);
  color: var(--color-text-primary);
}

.description {
  font-size: var(--text-body-md);
  color: var(--color-text-secondary);
  margin-top: var(--spacing-2);
}
```

### Width Best Practices

**✅ DO: Use `width: 100%` in CSS**
```css
.container {
  width: 100%;
  /* Component fills container */
}
```

**❌ DON'T: Use fixed widths**
```css
.container {
  width: 800px; /* Breaks in templates */
}
```

**Why:** Templates control layout. Components should fill available space.

### Design Tokens

Use design system tokens for consistency:

```css
/* Spacing */
padding: var(--spacing-6);
gap: var(--spacing-4);

/* Colors */
color: var(--color-text-primary);
background-color: var(--color-primary-500);
border-color: var(--color-border-subtle);

/* Typography */
font-size: var(--text-headline-sm);
font-weight: var(--font-weight-semibold);
line-height: var(--line-height-body);
letter-spacing: var(--letter-spacing-headline);

/* Shadows */
box-shadow: var(--shadow-lg);

/* Border Radius */
border-radius: var(--radius-xl);

/* Transitions */
transition: all var(--transition-slow);
```

### Custom Animations

Define in CSS Module file:

```css
@keyframes fadeIn {
  from { opacity: 0; }
  to { opacity: 1; }
}

.animated {
  animation: fadeIn 1s ease-out;
}
```

---

## Best Practices

<!-- LLM: Essential patterns and anti-patterns for component development. -->

### 1. Keep Props Simple

**✅ DO: 3-5 props maximum**
```tsx
interface CardProps {
  title: string;
  description?: string;
  imageUrl?: string;
}
```

**❌ DON'T: Complex nested objects**
```tsx
interface ComplexProps {
  config: {
    layout: 'grid' | 'list';
    responsive: { mobile: number; tablet: number };
  };
  theme: ThemeConfig;
  // Too complex!
}
```

### 2. Show Meaningful Content

**✅ DO: Render sample data when empty**
```tsx
export default function AIResponse(props) {
  const { text, questions } = props;
  
  if (!text && !questions) {
    return (
      <div>
        <p>Sample AI response text...</p>
        <button>Sample question?</button>
      </div>
    );
  }
  
  return <div>{/* Actual content */}</div>;
}
```

**❌ DON'T: Show empty/loading states**
```tsx
if (!text) {
  return <div>Waiting for data...</div>;
}
```

### 3. Use Semantic HTML

```tsx
// ✅ Good
<article className="w-full">
  <h3>Title</h3>
  <p>Description</p>
  <button>Action</button>
</article>

// ❌ Bad
<div className="w-full">
  <div>Title</div>
  <div>Description</div>
  <div onClick={...}>Action</div>
</div>
```

### 4. Support Dark Mode

Always provide dark mode variants:

```tsx
<div className="bg-white dark:bg-zinc-900">
  <h3 className="text-gray-900 dark:text-white">Title</h3>
  <p className="text-gray-600 dark:text-gray-400">Text</p>
</div>
```

---

## Common Patterns

<!-- LLM: Reusable patterns for common component types. -->

### Pattern 1: Simple Card

```tsx
export interface CardProps {
  title: string;
  description?: string;
  imageUrl?: string;
}

export default function Card({ title, description, imageUrl }: CardProps) {
  return (
    <div className="w-full bg-white dark:bg-zinc-900 rounded-xl shadow-lg overflow-hidden">
      {imageUrl && <img src={imageUrl} className="w-full h-48 object-cover" />}
      <div className="p-6">
        <h3 className="text-xl font-semibold">{title}</h3>
        {description && <p className="mt-2">{description}</p>}
      </div>
    </div>
  );
}
```

### Pattern 2: Interactive Widget

```tsx
export interface WidgetProps {
  title: string;
  items?: string[];
}

export default function Widget({ title, items = [] }: WidgetProps) {
  const [selected, setSelected] = useState<string | null>(null);
  
  return (
    <div className="w-full bg-white dark:bg-zinc-900 rounded-xl p-6">
      <h3 className="text-xl font-semibold mb-4">{title}</h3>
      <div className="space-y-2">
        {items.map((item, i) => (
          <button
            key={i}
            onClick={() => setSelected(item)}
            className={`w-full p-3 rounded-lg text-left ${
              selected === item
                ? 'bg-blue-500 text-white'
                : 'bg-gray-100 dark:bg-zinc-800'
            }`}
          >
            {item}
          </button>
        ))}
      </div>
    </div>
  );
}
```

### Pattern 3: Streaming Component

```tsx
export interface StreamingProps {
  text?: string;
  progressText?: string;
}

export default function StreamingText({ text, progressText }: StreamingProps) {
  // Show default when no data
  if (!text && !progressText) {
    return (
      <div className="w-full p-6">
        <p className="text-gray-500 italic">Thinking...</p>
        <p className="mt-2">Sample streaming text appears here...</p>
      </div>
    );
  }
  
  return (
    <div className="w-full p-6">
      {progressText && (
        <p className="text-blue-600 italic mb-2">{progressText}</p>
      )}
      {text && <p className="text-gray-900 dark:text-white">{text}</p>}
    </div>
  );
}
```

---

## Troubleshooting

<!-- LLM: Solutions to common issues developers encounter. -->

### Component not generating?

**Problem:** Component doesn't appear after `npm run generate-nodes`

**Solutions:**
1. Check stories file uses `const meta: Meta<typeof Component> = { ... }`
2. Ensure argTypes have `control` properties
3. Verify `defaults.ts` file exists
4. Run `npm run build` before `npm run generate-nodes`

### Component too wide in workflow?

**Problem:** Component overflows workflow editor

**Solution:** Use `w-full` instead of fixed widths:
```tsx
// ✅ Good
<div className="w-full">

// ❌ Bad
<div className="w-[800px]">
```

### Dark mode not working?

**Problem:** Component looks wrong in dark mode

**Solution:** Add dark mode variants to all colors:
```tsx
className="bg-white dark:bg-zinc-900 text-gray-900 dark:text-white"
```

### Props not updating in workflow?

**Problem:** Changes in workflow don't reflect in component

**Solution 1: Use props directly (preferred)**
```tsx
// ✅ Good - props update reactively
export default function Card({ title }: CardProps) {
  return <h3>{title}</h3>;
}

// ❌ Bad - title frozen on mount
export default function Card({ title }: CardProps) {
  const [localTitle] = useState(title);
  return <h3>{localTitle}</h3>;
}
```

**Solution 2: Sync local state with useEffect (when local state is needed)**

If you need local state (e.g., for editing, temporary UI state), sync it with props:

```tsx
// ✅ Good - local state syncs with props
import { useState, useEffect } from 'react';

export default function BookingWidget({ bookingData }: Props) {
  const [localBooking, setLocalBooking] = useState(bookingData);
  const [isEditing, setIsEditing] = useState(false);
  
  // Sync with incoming props (but preserve user edits)
  useEffect(() => {
    if (!isEditing) {
      setLocalBooking(bookingData);
    }
  }, [bookingData, isEditing]);
  
  return (
    <div>
      {/* Component can now edit localBooking without losing prop updates */}
    </div>
  );
}
```

**When to use each approach:**
- **Direct props**: Simple display components (Card, Image, Text)
- **Local state + useEffect**: Interactive components with temporary state (forms, editors, widgets)

---

## Summary Checklist

### Before Running `npm run generate-nodes`

- [ ] Component file (`ComponentName.tsx`) created
- [ ] Stories file (`ComponentName.stories.tsx`) with correct meta pattern
- [ ] Defaults file (`defaults.ts`) with named export
- [ ] ArgTypes defined with `control` properties
- [ ] Component uses `w-full` for width
- [ ] Dark mode variants added
- [ ] Component shows meaningful content with no props
- [ ] All React features work (hooks, etc.)

### After Generation

- [ ] Component appears in workflow editor
- [ ] Props can be configured
- [ ] Component renders correctly
- [ ] Dark mode works
- [ ] Component is responsive

---

> 📖 **For template documentation**, see [/storybook/templates/README.md](../templates/README.md)
> 📖 **For main documentation**, see [/README.md](../../README.md)
