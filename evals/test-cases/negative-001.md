# Test Case: negative-001 — 明确要求静态页面

## Metadata

- **Category**: Should NOT trigger (negative)
- **Expected trigger**: No
- **Difficulty**: Standard
- **Created**: 2026-07-02

## User Input

```
写一个简单的HTML静态页面，展示我的个人简介和技能列表，要求简洁干净，不需要什么编辑功能。
```

## Expected Behavior

1. Skill `editable-html-system` MUST NOT be triggered.
2. Agent should produce a plain, self-contained HTML file (or minimal structure).
3. No `config.js`, no edit panel, no version management.
4. Content can be directly written in HTML — the user explicitly asked for a static page.

## Failure Criteria

- Skill incorrectly triggers and produces the full 4-file editable system.
- Agent adds edit panel despite user saying "不需要什么编辑功能".
- Agent creates a `config.js` when user only asked for a static page.

## Actual Results

| Model | Date | Triggered? | Correct? | Notes |
|---|---|---|---|---|
| (pending) | — | — | — | — |
