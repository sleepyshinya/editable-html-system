# Config Schema — Full Reference

Complete schema for `DOC_CONFIG`. Every property, type, default, and rule.

## Table of Contents
- [Top-level Structure](#top-level-structure)
- [meta](#meta)
- [meta.style](#metastyle)
- [modules\[\]](#modules)
- [module](#module)
- [field](#field)
- [Field Type Variants](#field-type-variants)
- [settings](#settings)
- [Validation Rules](#validation-rules)

---

## Top-level Structure

```javascript
const DOC_CONFIG = {
  meta: { /* document metadata + design tokens */ },
  modules: [ /* ordered list of content modules */ ],
  settings: { /* edit panel behavior */ }
};
```

`meta`, `modules`, and `settings` are all required. `modules` may be empty but must exist.

---

## meta

| property | type | required | default | description |
|---|---|---|---|---|
| `docId` | string | yes | — | unique id; used as localStorage key `doc_versions_<docId>` |
| `version` | string | yes | `"v1"` | current version label; format `v<number>` |
| `title` | string | yes | — | document title (shown in header + browser tab) |
| `description` | string | no | `""` | one-line document description |
| `createdAt` | string | no | today | ISO date `YYYY-MM-DD` |
| `updatedAt` | string | no | today | ISO date; update on every meaningful change |
| `style` | object | yes | see below | design tokens applied as CSS variables |

---

## meta.style

Design tokens. Applied to `:root` (or `[data-theme]`) as CSS custom properties.

| property | type | default | CSS var |
|---|---|---|---|
| `theme` | `"light"` \| `"dark"` | `"light"` | sets `data-theme` attr |
| `primaryColor` | hex string | `"#1890ff"` | `--color-primary` |
| `accentColor` | hex string | `"#722ed1"` | `--color-accent` |
| `successColor` | hex string | `"#52c41a"` | `--color-success` |
| `warningColor` | hex string | `"#faad14"` | `--color-warning` |
| `dangerColor` | hex string | `"#ff4d4f"` | `--color-danger` |
| `fontFamily` | string | `"system-ui, -apple-system, sans-serif"` | `--font-family` |
| `maxWidth` | number | `960` | `--max-width` (px) |
| `radius` | number | `12` | `--radius` (px) |

Light/dark surface/text colors are derived from `theme` (see design-style.md for full palette).
They are NOT in config — the page shell hardcodes the theme palettes and swaps via `data-theme`.

---

## modules

An array of module objects, sorted ascending by `order` at render time.

---

## module

| property | type | required | default | description |
|---|---|---|---|---|
| `id` | string | yes | — | unique kebab-case id (e.g. `"hero"`, `"q2-metrics"`) |
| `name` | string | yes | — | human-readable module name; shown in edit panel |
| `comment` | string | yes | — | one-line annotation of the module's purpose |
| `type` | string | yes | — | render type; see module-conventions.md |
| `visible` | boolean | no | `true` | show/hide this module |
| `order` | number | no | `0` | sort weight; lower renders first |
| `fields` | object | yes | `{}` | keyed map of field objects |
| `protected` | boolean | no | `false` | module-level protection (e.g. complex tables) |
| `protectedReason` | string | no | — | why this module is protected (shown in panel) |

---

## field

Fields are the atomic editable units. Keyed by field name inside `module.fields`.

| property | type | required | default | description |
|---|---|---|---|---|
| `value` | any | yes | — | the actual content; string/number/bool/array/object |
| `editable` | boolean | no | `true` | can the user edit this via the panel? |
| `label` | string | no | field key | display label in the edit panel |
| `unit` | string | no | — | unit suffix for numbers (e.g. `"人"`, `"万元"`) |
| `multiline` | boolean | no | `false` | render textarea instead of input |
| `options` | array | no | — | for select fields; `value` must be in `options` |
| `protected` | boolean | no | `false` | this field is shielded from direct editing |
| `protectedReason` | string | no | — | why it's protected (shown with lock icon) |
| `compute` | function | no | — | `(fields) => value`; runs on render, overrides `value` |
| `linkTo` | string | no | — | `"moduleId.fieldName"`; value mirrors another field |
| `style` | object | no | — | `{ fontSize, fontWeight, color, textAlign, ... }` applied inline |

### compute vs linkTo

- `compute`: a function that derives the value from sibling fields **in the same module**.
  Receives `module.fields` as argument. Runs on every render.
- `linkTo`: a string reference to a field in **another module**. The value mirrors that field.
  Format: `"moduleId.fieldName"`. The source field is editable; this one is read-only.

Both set `protected: true` and `editable: false` automatically.

---

## Field Type Variants

### Text field
```javascript
title: { value: "主标题", editable: true, style: { fontSize: 28, fontWeight: 700 } }
```

### Long text field
```javascript
body: { value: "很长的说明文字...", editable: true, multiline: true }
```

### Number field
```javascript
revenue: { value: 1280, editable: true, unit: "万元", style: { fontSize: 32, fontWeight: 700 } }
```

### Boolean field
```javascript
showBadge: { value: true, editable: true }
```

### Select field
```javascript
status: { value: "active", editable: true, options: ["active", "paused", "archived"] }
```

### Color field
```javascript
accent: { value: "#722ed1", editable: true }
```

### Computed field (protected)
```javascript
total: {
  value: 0, editable: false, protected: true,
  protectedReason: "由 a + b 计算",
  compute: (f) => f.a.value + f.b.value
}
```

### Linked field (protected)
```javascript
mirroredRevenue: {
  value: 0, editable: false, protected: true,
  protectedReason: "镜像自 metrics 模块的 revenue",
  linkTo: "metrics.revenue"
}
```

### Array field (for lists/tables)
```javascript
items: {
  value: [
    { label: "项目A", count: 12 },
    { label: "项目B", count: 8 }
  ],
  editable: true
}
```

---

## settings

| property | type | default | description |
|---|---|---|---|
| `showEditPanel` | boolean | `true` | show edit panel on page load |
| `panelWidth` | number | `340` | panel width in px |
| `panelPosition` | `"right"` \| `"left"` | `"right"` | which side the panel docks |

---

## Validation Rules

The page shell validates config on load. If invalid, it renders an error banner (not a crash):

1. `meta.docId` must be non-empty and contain only `[a-z0-9-]`.
2. `meta.version` must match `/^v\d+$/`.
3. Every module must have `id` (unique), `name`, `comment`, `type`.
4. Module `id` must be kebab-case: `/^[a-z][a-z0-9-]*$/`.
5. `order` values need not be sequential; sorting is stable.
6. If a field has `compute`, it overrides `value` at render time — `value` is just a fallback.
7. If a field has `linkTo`, the target `moduleId.fieldName` must exist; otherwise render `—`.
8. `protected: true` implies `editable: false` (enforced even if `editable: true` is set).
9. If `options` is set, `value` must be one of the options (else panel shows a warning).
