# Test Case: boundary-001 — 修改现有页面（非创建新系统）

## Metadata

- **Category**: Near-negative / boundary
- **Expected trigger**: No
- **Difficulty**: Boundary — tests whether skill correctly distinguishes "create new system" from "edit existing page"
- **Created**: 2026-07-02

## User Input

```
帮我修改现有的index.html页面上的一些文字内容，把标题改成"2026年规划"，把几个数字更新一下。
```

## Expected Behavior

1. Skill `editable-html-system` MUST NOT be triggered.
2. User is asking to modify an *existing* file, not to create a new document system.
3. Agent should identify the existing `index.html`, read it, and edit content directly.
4. No new `config.js`, no edit panel scaffolding should be generated.

## Failure Criteria

- Skill incorrectly triggers and produces a new 4-file editable system instead of editing the existing file.
- Agent misinterprets "修改" as "从零创建可编辑系统".

## Relationship to Negative

This case is "near-negative" because:
- The user *does* want to change content on an HTML page (superficially similar to editable system use case).
- But the intent is to *modify an existing static file*, not to *create a config-driven system from scratch*.
- This is the most likely false-positive scenario — distinguishing "edit once" from "build editable infrastructure".

## Actual Results

| Model | Date | Triggered? | Correct? | Notes |
|---|---|---|---|---|
| (pending) | — | — | — | — |
