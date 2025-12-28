# Design System Styles

This directory contains the centralized theme configuration for the Design System, organized into modular CSS files.

**Pure CSS - NO Tailwind** - Works perfectly in Shadow DOM.

## File Structure

```
styles/
├── index.css          # Main entry point - imports all modules
├── colors.css         # Color palette (primary, secondary, grays)
├── typography.css     # Typography tokens (fonts, sizes, weights)
├── tokens.css         # Design tokens (spacing, radius, shadows)
├── base.css           # Base styles (reset, typography)
└── utilities.css      # Utility classes (layout, spacing, colors)
```

## Architecture

### Pure CSS with Modular Imports

The design system uses pure CSS with CSS Modules for component-specific styles:

```css
/* index.css - Main entry point */
@import './colors.css';      /* Color tokens */
@import './typography.css';  /* Typography tokens */
@import './tokens.css';      /* Spacing, shadows, etc. */
@import './base.css';        /* Reset & base typography */
@import './utilities.css';   /* Utility classes */
```

**Key Benefits:**
- **Shadow DOM Compatible**: No `@property` issues, works everywhere
- **Minimal Bundle Size**: 2-5KB per component (vs 60KB with Tailwind)
- **Modular**: Each file has a single responsibility
- **Maintainable**: Standard CSS, no framework lock-in
- **Design Tokens**: All tokens as CSS custom properties

## Module Descriptions

### index.css
**Main entry point** - Imports all modules in correct order.

### colors.css
Defines the color palette using CSS custom properties on `:root, :host`:

```css
:root, :host {
  --color-primary-500: #10b981;    /* Green */
  --color-secondary-500: #14b8a6;  /* Teal */
  --color-gray-900: #111827;       /* Dark gray */
  /* ... full color scales */
}
```

### typography.css
Complete Material Design 3 typography system:
- **Font Families**: Inter, system fonts
- **Font Weights**: 300 (light) to 700 (bold)
- **Font Sizes**: Fluid with `clamp()` for responsive scaling
- **Line Heights**: Optimized for readability
- **Letter Spacing**: Per type scale

### tokens.css
Design tokens for spacing, borders, shadows:
- **Spacing**: `--spacing-1` through `--spacing-24`
- **Border Radius**: `--radius-sm` through `--radius-full`
- **Shadows**: `--shadow-sm` through `--shadow-xl`
- **Transitions**: `--transition-fast`, `--transition-base`, `--transition-slow`

### base.css
Base styles and typography:
- CSS reset (`* { box-sizing: border-box; }`)
- Base typography (body, headings, paragraphs)
- Prose/markdown styles

### utilities.css
Utility classes for common patterns:
- **Layout**: `.w-full`, `.h-full`, `.flex`, `.grid`
- **Spacing**: `.p-4`, `.px-4`, `.space-y-4`
- **Colors**: `.bg-primary-500`, `.text-gray-600`
- **Borders**: `.border`, `.rounded-lg`
- **Shadows**: `.shadow-lg`, `.shadow-xl`
- **Hover states**: `.hover:bg-gray-50`

## How It Works

### Build Process

1. **Component Bundling** (`ReactSSRConverter.ts`):
   ```typescript
   // Import modular design system
   @import "path/to/styles/index.css";
   ```

2. **CSS Modules Processing** (Vite):
   - Scopes component-specific styles
   - Generates unique class names
   - Bundles with design system CSS

3. **Result**:
   - Component bundle: 2-5KB (design system + scoped styles)
   - Shadow DOM injection: Complete isolation
   - No CSS pollution in client application
   - Gradients and shadows work perfectly

## Adding New Design Tokens

### Adding Colors

Edit `colors.css`:
```css
:root, :host {
  /* Add new color scale */
  --color-accent-500: #ff6b6b;
  --color-accent-600: #ee5a52;
  /* ... */
}
```

### Adding Typography

Edit `typography.css`:
```css
:root, :host {
  /* Add new font size */
  --text-caption: 0.625rem;
  
  /* Add new font family */
  --font-code: "Fira Code", monospace;
}
```

### Adding Spacing/Shadows

Edit `tokens.css`:
```css
:root, :host {
  /* Add spacing */
  --spacing-32: 8rem;
  
  /* Add shadow */
  --shadow-2xl: 0 25px 50px -12px rgba(0, 0, 0, 0.25);
}
```

### Adding Utility Classes

Edit `utilities.css`:
```css
.my-utility { /* your styles */ }
```

## Component Usage

### Using Design System in Components

**CSS Modules** (recommended):
```css
/* Component.module.css */
@import '../../ingestion/styles/index.css';

.container {
  padding: var(--spacing-4);
  background-color: var(--color-gray-50);
  border-radius: var(--radius-lg);
}
```

```tsx
// Component.tsx
import styles from './Component.module.css';

export default function Component() {
  return <div className={styles.container}>Content</div>;
}
```

**Utility Classes** (for quick layouts):
```tsx
export default function Component() {
  return (
    <div className="w-full p-4 bg-white rounded-lg shadow-lg">
      Content
    </div>
  );
}
```

## Shadow DOM Compatibility

All CSS custom properties are defined on **both `:root` and `:host`**:

```css
:root, :host {
  --color-primary-500: #10b981;
}
```

This ensures:
- ✅ Variables work in regular DOM (`:root`)
- ✅ Variables work in Shadow DOM (`:host`)
- ✅ No `@property` issues
- ✅ Gradients and shadows render correctly

## References

- [Material Design 3 Typography](https://m3.material.io/styles/typography/type-scale-tokens)
- [CSS Custom Properties](https://developer.mozilla.org/en-US/docs/Web/CSS/Using_CSS_custom_properties)
- [CSS Modules](https://github.com/css-modules/css-modules)
- [Shadow DOM CSS Isolation](https://developer.mozilla.org/en-US/docs/Web/Web_Components/Using_shadow_DOM)
