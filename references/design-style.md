# Design Style — Tokens, Palettes, Components

The design system for editable HTML documents. Tokens are defined in `config.js → meta.style`
and applied as CSS custom properties. The page shell hardcodes light/dark surface palettes
and swaps via `data-theme` attribute on `<html>`.

## Table of Contents
- [Token → CSS Variable Map](#token--css-variable-map)
- [Light Palette](#light-palette)
- [Dark Palette](#dark-palette)
- [Typography Scale](#typography-scale)
- [Spacing System](#spacing-system)
- [Component Styles](#component-styles)
- [Applying Tokens](#applying-tokens)

---

## Token → CSS Variable Map

`config.js → meta.style` maps to CSS variables set on `:root`:

```css
:root {
  --color-primary:  #1890ff;  /* from meta.style.primaryColor */
  --color-accent:   #722ed1;
  --color-success:  #52c41a;
  --color-warning: #faad14;
  --color-danger:  #ff4d4f;
  --font-family:   system-ui, -apple-system, sans-serif;
  --max-width:      960px;
  --radius:         12px;
}
```

Theme-dependent variables (surface/text) are set by `data-theme`:

```css
:root[data-theme="light"] { --color-bg: #fff; --color-text: #1a1a1a; ... }
:root[data-theme="dark"]  { --color-bg: #141414; --color-text: #e8e8e8; ... }
```

---

## Light Palette

| token | value | usage |
|---|---|---|
| `--color-bg` | `#ffffff` | page background |
| `--color-surface` | `#f7f8fa` | cards, panels |
| `--color-surface-2` | `#eef0f3` | nested surfaces, hover |
| `--color-text` | `#1a1a1a` | primary text |
| `--color-text-sub` | `#666666` | secondary text |
| `--color-text-muted` | `#999999` | captions, labels |
| `--color-border` | `#e8e8e8` | dividers, borders |
| `--color-primary` | `#1890ff` | links, primary buttons |
| `--color-accent` | `#722ed1` | accents |
| `--color-success` | `#52c41a` | success states |
| `--color-warning` | `#faad14` | warning states |
| `--color-danger` | `#ff4d4f` | danger states |
| `--shadow-sm` | `0 1px 2px rgba(0,0,0,0.06)` | cards |
| `--shadow-md` | `0 4px 12px rgba(0,0,0,0.08)` | panels, modals |

---

## Dark Palette

| token | value | usage |
|---|---|---|
| `--color-bg` | `#141414` | page background |
| `--color-surface` | `#1f1f1f` | cards, panels |
| `--color-surface-2` | `#2a2a2a` | nested surfaces, hover |
| `--color-text` | `#e8e8e8` | primary text |
| `--color-text-sub` | `#a0a0a0` | secondary text |
| `--color-text-muted` | `#707070` | captions, labels |
| `--color-border` | `#2e2e2e` | dividers, borders |
| `--color-primary` | `#1890ff` | links, primary buttons |
| `--color-accent` | `#9254de` | accents (brighter for dark) |
| `--color-success` | `#73d13d` | success states (brighter) |
| `--color-warning` | `#ffc53d` | warning states (brighter) |
| `--color-danger` | `#ff7875` | danger states (brighter) |
| `--shadow-sm` | `0 1px 2px rgba(0,0,0,0.3)` | cards |
| `--shadow-md` | `0 4px 12px rgba(0,0,0,0.4)` | panels, modals |

Dark palette brightens semantic colors and uses darker surfaces with light text for contrast.

---

## Typography Scale

| name | size | weight | line-height | usage |
|---|---|---|---|---|
| hero | 36px | 700 | 1.2 | hero title |
| h1 | 28px | 700 | 1.3 | page title |
| h2 | 22px | 600 | 1.4 | section heading |
| h3 | 18px | 600 | 1.4 | subsection |
| body | 15px | 400 | 1.8 | body text |
| sm | 13px | 400 | 1.6 | secondary text |
| caption | 12px | 400 | 1.5 | labels, captions |
| metric | 32px | 700 | 1.2 | metric numbers |
| metric-sm | 24px | 700 | 1.2 | secondary metrics |

Field-level `style.fontSize` overrides these defaults per field.

---

## Spacing System

Base unit: 4px. Use these tokens:

| token | value |
|---|---|
| `--space-xs` | 4px |
| `--space-sm` | 8px |
| `--space-md` | 16px |
| `--space-lg` | 24px |
| `--space-xl` | 32px |
| `--space-2xl` | 48px |

Section vertical padding: `var(--space-xl)` (32px).
Card padding: `var(--space-lg)` (24px).
Inline gaps in grids: `var(--space-md)` (16px).

---

## Component Styles

### Page container
```css
.doc-container { max-width: var(--max-width); margin: 0 auto; padding: var(--space-xl) var(--space-lg); }
```

### Section wrapper
```css
.doc-section { padding: var(--space-xl) 0; border-bottom: 1px solid var(--color-border); }
.doc-section:last-child { border-bottom: none; }
```

### Metric card
```css
.metric-card {
  background: var(--color-surface);
  border-radius: var(--radius);
  padding: var(--space-lg);
  box-shadow: var(--shadow-sm);
}
.metric-value { font-size: 32px; font-weight: 700; color: var(--color-text); }
.metric-label { font-size: 13px; color: var(--color-text-muted); display: block; margin-bottom: 8px; }
```

### Metrics grid
```css
.metrics-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: var(--space-md);
}
```

### Table
```css
.doc-table { width: 100%; border-collapse: collapse; }
.doc-table th, .doc-table td {
  padding: var(--space-sm) var(--space-md);
  text-align: left;
  border-bottom: 1px solid var(--color-border);
}
.doc-table th { background: var(--color-surface); font-weight: 600; font-size: 13px; color: var(--color-text-sub); }
.doc-table tfoot td { font-weight: 700; background: var(--color-surface); }
```

### Callout
```css
.callout {
  border-radius: var(--radius);
  padding: var(--space-lg);
  border-left: 4px solid var(--color-primary);
  background: var(--color-surface);
}
.callout[data-severity="warning"] { border-left-color: var(--color-warning); }
.callout[data-severity="danger"]  { border-left-color: var(--color-danger); }
.callout[data-severity="success"] { border-left-color: var(--color-success); }
```

### Hero
```css
.hero { text-align: center; padding: var(--space-2xl) var(--space-lg); }
.hero h1 { font-size: 36px; font-weight: 700; margin-bottom: var(--space-sm); }
.hero p { font-size: 18px; color: var(--color-text-sub); }
.cta {
  display: inline-block; margin-top: var(--space-lg);
  padding: 12px 32px; border-radius: var(--radius);
  background: var(--color-primary); color: #fff; text-decoration: none; font-weight: 600;
}
```

### Edit panel (redesigned)
```css
/* Panel container — visible by default on the right, dismissible */
.edit-panel {
  position: fixed; top: 0; right: 0; height: 100vh; width: 380px;
  background: var(--color-surface); border-left: 1px solid var(--color-border);
  box-shadow: var(--shadow-lg); z-index: 100;
  display: flex; flex-direction: column;
  transform: translateX(0); transition: transform .3s cubic-bezier(.4,0,.2,1);
}
body:not(.panel-open) .edit-panel { transform: translateX(100%); }

/* Header — fixed, with version bar + action buttons */
.panel-header { flex-shrink: 0; background: var(--color-bg); border-bottom: 1px solid var(--color-border); padding: 16px 24px; }

/* Scrollable body */
.panel-body { flex: 1; overflow-y: auto; padding: 16px 0; }

/* Module cards — rounded, hover border highlight, expanded glow */
.panel-module {
  margin: 0 8px 4px; background: var(--color-bg); border: 1px solid var(--color-border);
  border-radius: 10px; overflow: hidden; transition: border-color .15s;
}
.panel-module.expanded { border-color: var(--color-primary); box-shadow: 0 0 0 3px rgba(24,144,255,.08); }

/* Fields — focus ring, unit suffix, protected dashed border */
.panel-field input:focus, .panel-field textarea:focus { outline: none; border-color: var(--color-primary); box-shadow: 0 0 0 3px rgba(24,144,255,.1); }
.panel-field input[readonly] { background: var(--color-surface-2); border-style: dashed; }

/* Floating toggle button — shows when panel dismissed */
.panel-toggle { position: fixed; top: 20px; right: 20px; z-index: 200; width: 44px; height: 44px; border-radius: 12px; }
```

Key design changes from v1:
- Panel width increased to 380px (was 340px)
- Panel is flex-column: fixed header, scrollable body, fixed footer
- Module list uses card style (margin gap, border, rounded) instead of flat divider list
- Inputs have focus ring (`box-shadow` glow) instead of plain border
- Style editor is a compact inline toolbar with dividers
- All icons are inline SVG (no emoji) — eye/eyeOff for visibility, lock for protected, drag handle, chevrons
- Toast notification replaces `alert()` for save/export/import feedback
- Floating toggle button (top-right) only appears when panel is dismissed

---

## Applying Tokens

The page shell reads `DOC_CONFIG.meta.style` and sets CSS variables on load:

```javascript
function applyDesignTokens(style) {
  const root = document.documentElement;
  root.setAttribute('data-theme', style.theme || 'light');
  root.style.setProperty('--color-primary', style.primaryColor || '#1890ff');
  root.style.setProperty('--color-accent', style.accentColor || '#722ed1');
  root.style.setProperty('--color-success', style.successColor || '#52c41a');
  root.style.setProperty('--color-warning', style.warningColor || '#faad14');
  root.style.setProperty('--color-danger', style.dangerColor || '#ff4d4f');
  root.style.setProperty('--font-family', style.fontFamily || 'system-ui, sans-serif');
  root.style.setProperty('--max-width', (style.maxWidth || 960) + 'px');
  root.style.setProperty('--radius', (style.radius || 12) + 'px');
}
```

Field-level `style` is applied inline on the rendered element:
```javascript
function styleStr(s) {
  if (!s) return '';
  return Object.entries(s).map(([k, v]) =>
    k.replace(/([A-Z])/g, '-$1').toLowerCase() + ':' +
    (typeof v === 'number' && /font|size|width|height|gap|padding|margin|radius/.test(k) ? v + 'px' : v)
  ).join(';');
}
```
