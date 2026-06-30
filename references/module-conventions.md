# Module Conventions — Types & Protected Content

Per-type field schemas, render patterns, and protected-content handling.

## Table of Contents
- [Module Types](#module-types)
  - [hero](#hero)
  - [metrics](#metrics)
  - [text](#text)
  - [table](#table)
  - [chart](#chart)
  - [list](#list)
  - [callout](#callout)
  - [timeline](#timeline)
- [Protected Content Patterns](#protected-content-patterns)
  - [1. Computed Numbers](#1-computed-numbers)
  - [2. Linkage Logic (cross-module)](#2-linkage-logic-cross-module)
  - [3. Complex Tables](#3-complex-tables)
- [Render Snippets](#render-snippets)

---

## Module Types

### hero

First-screen banner. Large title + subtitle + optional CTA.

```javascript
{
  id: "hero", name: "顶部横幅", comment: "首屏主视觉",
  type: "hero", visible: true, order: 1,
  fields: {
    title:    { value: "欢迎使用", editable: true, style: { fontSize: 36, fontWeight: 700 } },
    subtitle: { value: "可编辑系统演示", editable: true, style: { fontSize: 18, color: "var(--text-sub)" } },
    ctaText:  { value: "立即开始", editable: true },
    ctaLink:  { value: "#start", editable: true }
  }
}
```

Render: centered block, title on top, subtitle below, CTA button below that.

---

### metrics

Grid of key-number cards. Most common home for protected/computed fields.

Two shapes — choose one:

**Shape A — each metric is a field:**
```javascript
{
  id: "metrics", name: "核心指标", comment: "关键数据展示",
  type: "metrics", visible: true, order: 2,
  fields: {
    users:    { value: 1280, editable: true, unit: "人", label: "日活用户" },
    revenue:  { value: 38.5, editable: true, unit: "万元", label: "日收入" },
    // protected: total = users * 30
    total: {
      value: 0, editable: false, protected: true, unit: "人", label: "月活预估",
      protectedReason: "由 users × 30 天累计",
      compute: (f) => f.users.value * 30
    }
  }
}
```

**Shape B — array of metric objects:**
```javascript
fields: {
  cards: {
    value: [
      { label: "日活用户", value: 1280, unit: "人" },
      { label: "日收入", value: 38.5, unit: "万元" }
    ],
    editable: true
  }
}
```

Use Shape A when individual metrics need per-field protection or compute. Use Shape B
when the grid is uniform and fully editable.

Render: CSS grid (auto-fit, minmax 200px), each card shows label + value + unit.

---

### text

Article-style section. Heading + body.

```javascript
{
  id: "intro", name: "简介", comment: "项目背景说明",
  type: "text", visible: true, order: 3,
  fields: {
    heading: { value: "项目背景", editable: true, style: { fontSize: 22, fontWeight: 600 } },
    body: { value: "本项目旨在...", editable: true, multiline: true,
            style: { fontSize: 15, lineHeight: 1.8 } }
  }
}
```

Render: heading as `<h2>`, body as `<p>` (preserve newlines).

---

### table

Data table. If it has formulas or cross-row calculations, mark `protected: true` at module level.

```javascript
{
  id: "q2-table", name: "Q2 业绩表", comment: "含合计行，受保护",
  type: "table", visible: true, order: 4,
  protected: true,
  protectedReason: "合计行由各月份自动求和，请在 config.js 中修改数据源",
  fields: {
    columns: {
      value: ["月份", "收入(万)", "成本(万)", "利润(万)"],
      editable: false, protected: true
    },
    rows: {
      value: [
        ["4月", 120, 80, 40],
        ["5月", 135, 85, 50],
        ["6月", 150, 90, 60]
      ],
      editable: false, protected: true
    },
    // computed total row
    totalRow: {
      value: [], editable: false, protected: true,
      protectedReason: "由 rows 各列求和",
      compute: (f) => {
        const sums = ["合计", 0, 0, 0];
        f.rows.value.forEach(r => { sums[1] += r[1]; sums[2] += r[2]; sums[3] += r[3]; });
        return sums;
      }
    }
  }
}
```

Render: `<table>` with header row from `columns`, body from `rows`, footer from `totalRow`
(if present). Protected tables are read-only in the panel.

---

### chart

Chart visualization. Data is usually protected (comes from a source).

```javascript
{
  id: "trend", name: "趋势图", comment: "近6月收入趋势",
  type: "chart", visible: true, order: 5,
  fields: {
    chartType: { value: "line", editable: true, options: ["line", "bar", "pie"] },
    title: { value: "月度收入趋势", editable: true },
    labels: {
      value: ["1月","2月","3月","4月","5月","6月"],
      editable: false, protected: true,
      protectedReason: "数据来自运营后台"
    },
    data: {
      value: [95, 110, 105, 120, 135, 150],
      editable: false, protected: true,
      protectedReason: "数据来自运营后台"
    }
  }
}
```

Render: use a lightweight chart (inline SVG or canvas). If no chart lib is desired, render
a simple bar chart with divs. Keep it dependency-free.

---

### list

Item list. Each item can be a string or object.

```javascript
{
  id: "features", name: "功能列表", comment: "核心功能一览",
  type: "list", visible: true, order: 6,
  fields: {
    items: {
      value: [
        { title: "配置驱动", desc: "所有内容集中在 config.js" },
        { title: "实时编辑", desc: "右侧面板即时修改" },
        { title: "版本管理", desc: "v1/v2/v3 随时回滚" }
      ],
      editable: true
    }
  }
}
```

Render: `<ul>` of cards or simple list items.

---

### callout

Highlighted box for important notes.

```javascript
{
  id: "warning", name: "重要提示", comment: "风险提示框",
  type: "callout", visible: true, order: 7,
  fields: {
    title: { value: "注意事项", editable: true },
    body: { value: "以下数据仅供参考...", editable: true, multiline: true },
    severity: { value: "warning", editable: true, options: ["info", "warning", "danger", "success"] }
  }
}
```

Render: colored box; color from severity token (info→primary, warning→warning, etc.).

---

### timeline

Vertical timeline of events.

```javascript
{
  id: "roadmap", name: "路线图", comment: "季度里程碑",
  type: "timeline", visible: true, order: 8,
  fields: {
    events: {
      value: [
        { date: "2026 Q1", title: "立项", desc: "完成需求评审" },
        { date: "2026 Q2", title: "开发", desc: "核心功能上线" },
        { date: "2026 Q3", title: "推广", desc: "全量发布" }
      ],
      editable: true
    }
  }
}
```

Render: vertical line with event nodes; date on left, title + desc on right.

---

## Protected Content Patterns

### 1. Computed Numbers

Value derived from sibling fields in the same module.

```javascript
total: {
  value: 0,                          // fallback, overwritten by compute
  editable: false,
  protected: true,
  protectedReason: "由 a + b 计算",
  compute: (f) => f.a.value + f.b.value,
  unit: "万元"
}
```

Panel behavior: shows value read-only, lock icon, and `protectedReason` tooltip.
Update any source field → `compute` re-runs → total updates live.

**Chain rule:** a computed field can read another computed field's `.value` (resolved
in dependency order). Avoid circular references — the shell detects them and renders `—`.

---

### 2. Linkage Logic (cross-module)

One field mirrors another field in a different module.

```javascript
// in module "summary"
highlightRevenue: {
  value: 0,
  editable: false,
  protected: true,
  protectedReason: "镜像自 metrics.revenue，请到「核心指标」模块修改",
  linkTo: "metrics.revenue"
}
```

Format: `"moduleId.fieldName"`. The source field is editable normally; the linked field
is read-only and updates when the source changes.

Use this when the same number appears in multiple places (e.g. a hero banner showing
the headline metric from the metrics module). Single source of truth, no copy-paste drift.

---

### 3. Complex Tables

Tables with formulas, merged cells, or cross-row calculations. Mark the **whole module**
protected so users don't accidentally break the structure.

```javascript
{
  id: "financial-table", name: "财务表", comment: "含公式联动",
  type: "table", visible: true, order: 4,
  protected: true,
  protectedReason: "此表格含合计行与利润公式（利润=收入-成本），结构不可在面板修改",
  fields: {
    columns: { value: [...], editable: false, protected: true },
    rows: { value: [...], editable: false, protected: true },
    totalRow: {
      value: [], protected: true,
      protectedReason: "由 rows 各列求和",
      compute: (f) => { /* sum each column */ }
    },
    profitColumn: {
      value: [], protected: true,
      protectedReason: "利润 = 收入 - 成本（逐行计算）",
      compute: (f) => f.rows.value.map(r => r[1] - r[2])
    }
  }
}
```

Panel behavior: the entire module is shown read-only with a note:
`此模块含计算关联，请在 config.js 中修改`.

---

## Render Snippets

Each render function receives `(module, config)` and returns an HTML string.
The shell wraps output in `<section data-module-id="..." data-module-name="...">`.

```javascript
function renderHero(module, config) {
  const { title, subtitle, ctaText, ctaLink } = module.fields;
  return `
    <div class="hero">
      <h1 data-field="title" style="${styleStr(title.style)}">${title.value}</h1>
      <p data-field="subtitle" style="${styleStr(subtitle.style)}">${subtitle.value}</p>
      ${ctaText.value ? `<a class="cta" href="${ctaLink.value}" data-field="ctaText">${ctaText.value}</a>` : ''}
    </div>`;
}

function renderMetrics(module, config) {
  const cards = Object.entries(module.fields)
    .filter(([k, f]) => !f.protected || f.compute || f.linkTo)
    .map(([key, f]) => {
      const val = resolveValue(f, module.fields); // runs compute/linkTo
      const lock = f.protected ? '<span class="lock" title="' + (f.protectedReason||'') + '">🔒</span>' : '';
      return `<div class="metric-card" data-field="${key}">
        <span class="metric-label">${f.label || key}</span>
        <span class="metric-value" style="${styleStr(f.style)}">${formatNum(val)}${f.unit ? '<small>'+f.unit+'</small>' : ''}</span>
        ${lock}
      </div>`;
    }).join('');
  return `<div class="metrics-grid">${cards}</div>`;
}
```

`resolveValue(field, allFields)`:
- if `field.compute` → return `field.compute(allFields)`
- if `field.linkTo` → look up target field, return its resolved value
- else → return `field.value`

`styleStr(styleObj)` converts `{ fontSize: 28, fontWeight: 700 }` → `"font-size:28px;font-weight:700;"`.
