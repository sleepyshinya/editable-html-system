---
name: editable-html-system
description: >
  Generate HTML documents as "editable systems" (可编辑系统), not static pages. All editable
  content (titles, numbers, visibility, order, styles) lives in a centralized config.js, with
  a right-side edit panel for live editing, module reordering, and version management
  (v1/v2/v3). Protected content (computed numbers, linkage logic, complex tables) is
  explicitly marked and shielded. Output: index.html (page shell), config.js (config layer),
  data-source.md (data provenance), README.md (usage guide). Use when: (1) create an HTML
  document/page/report needing frequent content updates, (2) build a "可编辑"/"配置驱动"
  HTML document, (3) generate a page where text/numbers/visibility are config-controlled,
  (4) create a document system with edit panel and versioning.
  Triggers: "可编辑系统", "配置驱动", "生成html文档", "编辑面板", "版本管理",
  "config-driven html", "editable html document", "不要静态页面".
---

# Editable HTML Document System

## Core Philosophy

Generate HTML as an **editable system**, NOT a static page. Every piece of content that
might change — titles, descriptions, numbers, visibility, order, style weights — must live
in a single config object. The page reads from config and re-renders on change. A right-side
edit panel lets the user modify everything without touching code.

## File Structure to Generate

Always produce these files together. Never output a single index.html:

```
<doc-name>/
├── index.html        # Page shell: renders modules from config, hosts edit panel
├── config.js         # Config layer: ALL editable content, the single source of truth
├── data-source.md    # Data provenance: where each number comes from, what is protected
└── README.md         # Usage guide: how to edit via config, use panel, manage versions
```

The design style (color palette, typography, spacing) is defined inline in `config.js` under
`meta.style` and applied by `index.html`. See references/design-style.md for defaults.

## Config Layer (config.js) — The Single Source of Truth

The config is one global object `DOC_CONFIG`. Structure:

```javascript
const DOC_CONFIG = {
  meta: {
    docId: "doc-001",              // unique id, used for version storage key
    version: "v1",                  // current version label
    title: "文档标题",
    description: "文档说明",
    createdAt: "2026-06-30",
    updatedAt: "2026-06-30",
    style: {                        // design tokens — see references/design-style.md
      theme: "light",               // "light" | "dark"
      primaryColor: "#1890ff",
      fontFamily: "system-ui, -apple-system, sans-serif",
      maxWidth: 960,
      radius: 12
    }
  },
  modules: [
    {
      // --- 模块标识 ---
      id: "hero",                   // unique, kebab-case
      name: "顶部横幅",              // 模块名 (shown in edit panel)
      comment: "首屏主视觉区域",      // 注释标签 (what this module is for)
      type: "hero",                  // render type: hero|metrics|text|table|chart|list|callout|timeline
      visible: true,                 // 显隐状态
      order: 1,                      // 排序权重 (ascending; edit panel can reorder)
      // --- 可编辑字段 ---
      fields: {
        title: {
          value: "欢迎使用",
          editable: true,            // can user edit via panel?
          style: { fontSize: 36, fontWeight: 700, color: "var(--text)" }
        },
        subtitle: {
          value: "可编辑系统演示",
          editable: true,
          style: { fontSize: 18, color: "var(--text-sub)" }
        }
      }
    },
    {
      id: "metrics",
      name: "核心指标",
      comment: "关键数据展示（含受保护字段）",
      type: "metrics",
      visible: true,
      order: 2,
      fields: {
        dailyUsers: {
          value: 1280,
          editable: true,
          unit: "人",
          style: { fontSize: 32, fontWeight: 700 }
        },
        // --- 受保护字段：有计算关联，不可直接编辑 ---
        totalUsers: {
          value: 0,                   // computed at runtime
          editable: false,
          protected: true,
          protectedReason: "由 dailyUsers × 30 天累计计算",
          compute: (f) => f.dailyUsers.value * 30,   // receives module.fields
          unit: "人"
        }
      }
    }
  ],
  settings: {
    showEditPanel: true,             // show right-side panel on load
    panelWidth: 340,
    panelPosition: "right"           // "right" | "left"
  }
};
```

### Field Types

| Field shape | `type` | edit panel control |
|---|---|---|
| Text / title | default | text input or textarea |
| Number | `unit` set | number input + unit |
| Long text | `multiline: true` | textarea |
| Boolean toggle | `value: bool` | checkbox |
| Color | `value` is hex | color picker |
| Select | `options: [...]` | dropdown |
| Protected/computed | `protected: true` | read-only badge + reason |

See references/config-schema.md for the full schema with every field option.

## Page Shell (index.html) — Rendering + Edit Panel

index.html does three things:

1. **Load config.js**, then render every visible module in `order`.
2. **Host the edit panel** (right sidebar) that reads/writes `DOC_CONFIG` and re-renders.
3. **Manage versions** — save/load/export config snapshots.

### Rendering Rules

- Read `DOC_CONFIG.modules`, filter `visible === true`, sort by `order`.
- Each module renders inside `<section data-module-id="..." data-module-name="...">`.
- Field values render inside `<span data-field="fieldName">` so the panel can target them.
- Re-render on any config change (panel edit, version load, visibility toggle).

### Edit Panel (right sidebar, togglable)

The panel MUST support these operations:

| Operation | How |
|---|---|
| Edit title / description / text | input/textarea bound to `field.value` |
| Edit numbers | number input; if `protected`, show lock + `protectedReason` |
| Toggle module visibility | checkbox → sets `module.visible`, re-renders |
| Reorder modules | up/down buttons (or drag) → swap `order`, re-render |
| Adjust style weights | inputs for fontSize, fontWeight, color → update `field.style` |
| Save as new version | button → snapshot current config, label as v1/v2/v3, store in localStorage |
| Load a version | dropdown of saved versions → replace config, re-render |
| Export config | button → download current config as `config.<version>.js` |

### Versioning

- Versions stored in `localStorage` under key `doc_versions_<docId>`.
- Each version: `{ label: "v1", savedAt: "ISO timestamp", config: <deep copy> }`.
- "Save as new version" auto-increments the label (v1 → v2 → v3).
- Loading a version replaces `DOC_CONFIG` in memory and re-renders; it does NOT overwrite
  config.js on disk (that requires explicit "Export" to download a new file).
- Always keep at least the initial version saved so users can roll back.

Use the template in `assets/template/index.html` as the starting point — it has the panel,
rendering loop, and version management already wired. Adapt the module renderers to the
specific document being built.

## Module Conventions

Every module MUST have:
- `id` — unique kebab-case identifier
- `name` — human-readable module name (Chinese is fine)
- `comment` — one-line annotation of what the module is for
- `type` — determines which render function handles it
- `visible` — boolean
- `order` — integer
- `fields` — object of editable fields

Common module types and their typical fields:

| type | typical fields | notes |
|---|---|---|
| `hero` | title, subtitle, ctaText | first screen |
| `metrics` | metric cards (value, unit, label) | may contain protected/computed |
| `text` | heading, body | body supports multiline |
| `table` | rows, columns | see protected marking below |
| `chart` | chartType, data | data often protected |
| `list` | items[] | each item editable |
| `callout` | title, body, severity | highlight box |
| `timeline` | events[] | each event: date, title, desc |

See references/module-conventions.md for per-type field schemas and render patterns.

## Protected Content — Must Be Explicitly Marked

Protected content cannot be freely edited because it has dependencies. Three categories:

1. **Computed numbers** — value derived from other fields via `compute` function.
   ```javascript
   totalUsers: {
     value: 0, editable: false, protected: true,
     protectedReason: "由 dailyUsers × 30 累计",
     compute: (fields) => fields.dailyUsers.value * 30
   }
   ```
   The panel shows the value read-only with a lock icon and the reason.

2. **Linkage logic** — one field's value depends on another module's field.
   Reference cross-module via `linkTo: "moduleId.fieldName"`. The panel shows the link
   source read-only.

3. **Complex tables** — tables with formulas, merged cells, or cross-row calculations.
   Mark the whole module `protected: true` at module level. The panel shows the table
   read-only with a note: "此表格含计算关联，请在 config.js 中修改".

Record EVERY protected field's provenance in `data-source.md`. See
references/module-conventions.md for protected-content patterns.

## data-source.md — Data Provenance

For every number in the document, record:

```markdown
## 模块: 核心指标 (metrics)

| 字段 | 值 | 来源 | 是否受保护 | 说明 |
|---|---|---|---|---|
| dailyUsers | 1280 | 运营后台导出 2026-06 | 否 | 可直接编辑 |
| totalUsers | 38400 | 计算得出 | 是 | dailyUsers × 30 |
```

This file is the bridge between the document and its data sources. Update it whenever
config values change meaningfully.

## README.md — Usage Guide

The generated README.md should cover:
1. What this document system is (editable, config-driven)
2. File structure and what each file does
3. How to edit content: via config.js (for developers) or via edit panel (for anyone)
4. How the edit panel works (each operation)
5. How versioning works (save / load / export)
6. Which content is protected and why
7. How to add a new module (with example)

Use the template in `assets/template/README.md`.

## Design Style

Define design tokens in `config.js → meta.style`. The page applies them as CSS variables.
Defaults (light theme):

```javascript
style: {
  theme: "light",
  primaryColor: "#1890ff",
  fontFamily: "system-ui, -apple-system, sans-serif",
  maxWidth: 960,
  radius: 12
}
```

Dark theme uses `theme: "dark"`. The page shell swaps a `data-theme` attribute on `<html>`.
See references/design-style.md for the full token set, light/dark palettes, typography scale,
spacing system, and component styles (cards, metrics, tables, callouts).

## Workflow When This Skill Triggers

1. **Understand the document** — ask or infer what the document is about, what modules it needs.
2. **Design the module list** — decide module types, which fields are editable vs protected.
3. **Write config.js first** — this is the source of truth; everything else reads from it.
4. **Adapt index.html** — start from `assets/template/index.html`, add module renderers for
   the specific types needed, keep the edit panel and versioning intact.
5. **Write data-source.md** — document where every number comes from.
6. **Write README.md** — start from `assets/template/README.md`, fill in specifics.
7. **Verify** — open index.html in a browser (or tell the user to), confirm rendering + panel.
8. **Present all files together** via present_files.

### High-Frequency Edit Items Checklist

Before finishing, confirm these are all config-driven (not hardcoded in HTML):
- [ ] All titles and subtitles
- [ ] All descriptions / body text
- [ ] All key numbers (with units)
- [ ] Module visibility (show/hide)
- [ ] Module order
- [ ] Font sizes and weights for titles/numbers
- [ ] Primary color / theme

If any of the above is hardcoded, move it into config.js before delivering.

## References (load as needed)

- `references/config-schema.md` — full field schema, all types, edge cases, validation rules
- `references/module-conventions.md` — per-type field schemas, protected-content patterns, render snippets
- `references/design-style.md` — complete design token set, light/dark palettes, component styles

## Assets (copy and adapt)

- `assets/template/index.html` — page shell with edit panel + versioning (vanilla JS, no build)
- `assets/template/config.js` — config template with example modules covering all field types
- `assets/template/README.md` — README template
- `assets/template/data-source.md` — data-source template
