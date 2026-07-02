# Test Case: positive-002 — 产品介绍页面（可编辑系统）

## Metadata

- **Category**: Should trigger (positive)
- **Expected trigger**: Yes
- **Difficulty**: Standard
- **Created**: 2026-07-02

## User Input

```
做一个可编辑的产品介绍页面，后面产品价格、功能列表、客户案例会频繁变动，我需要一个能直接在面板上改内容不用碰代码的方案。
```

## Expected Behavior

1. Skill `editable-html-system` MUST be triggered.
2. Agent MUST produce `index.html`, `config.js`, `data-source.md`, `README.md`.
3. Product prices and feature lists MUST be in `config.js → modules`, NOT hardcoded.
4. Any "customer count" or "total revenue" that derives from other fields MUST be protected.
5. Edit panel MUST allow toggling visibility of feature/case modules.
6. User MUST be able to change product name, description, prices via panel fields.

## Failure Criteria

- Prices or feature names hardcoded in `index.html`.
- No version management capability.
- Derived numbers not marked protected.
- Panel only edits text but doesn't support visibility toggle or reorder.

## Actual Results

| Model | Date | Triggered? | Files OK? | Protected OK? | Panel OK? | Notes |
|---|---|---|---|---|---|---|
| (pending) | — | — | — | — | — | — |
