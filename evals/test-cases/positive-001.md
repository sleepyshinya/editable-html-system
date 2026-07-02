# Test Case: positive-001 — 季度业务汇报可编辑系统

## Metadata

- **Category**: Should trigger (positive)
- **Expected trigger**: Yes
- **Difficulty**: Standard
- **Created**: 2026-07-02

## User Input

```
帮我生成一个Q3季度业务汇报的可编辑HTML页面，包含核心收入指标、各业务线对比表格、关键里程碑时间线，后续需要频繁修改数据和调整文案。
```

## Expected Behavior

1. Skill `editable-html-system` MUST be triggered.
2. Agent MUST produce exactly 4 files: `index.html`, `config.js`, `data-source.md`, `README.md`.
3. `config.js` MUST contain modules of types: `hero`, `metrics`, `table`, `timeline` (at minimum).
4. `index.html` MUST include an edit panel with visibility toggle, reorder, version save/load.
5. Computed fields (e.g., totals from individual line items) MUST be marked `protected: true`.
6. `data-source.md` MUST document provenance of every number.

## Failure Criteria

- Agent produces a single static `index.html` without `config.js`.
- Agent hardcodes any title, number, or module order into `index.html`.
- Agent fails to mark derived/aggregate numbers as protected.
- Edit panel is missing or non-functional.

## Actual Results

| Model | Date | Triggered? | Files OK? | Protected OK? | Panel OK? | Notes |
|---|---|---|---|---|---|---|
| (pending) | — | — | — | — | — | — |
