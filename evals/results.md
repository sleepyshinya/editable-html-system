# Evaluation Results — Editable HTML System

## Summary

| Metric | Target | Current | Status |
|---|---|---|---|
| Trigger Precision | ≥ 90% | TBD | Pending evaluation |
| Trigger Recall | ≥ 85% | TBD | Pending evaluation |
| F1 Score | ≥ 87% | TBD | Pending evaluation |

## Per-Case Results

### Trigger Accuracy

| Case ID | Expected | FP Risk | Notes |
|---|---|---|---|
| positive-001 | Trigger | Low | Clear intent, explicit trigger keywords |
| positive-002 | Trigger | Low | "可编辑" + "频繁变动" strong signal |
| negative-001 | No trigger | Low | "静态页面" + "不需要编辑" explicit negation |
| boundary-001 | No trigger | **Medium** | "修改现有" vs "创建系统" — highest false-positive risk |

### Behavioral Correctness (Positive Cases Only)

| Case ID | File Count | Config Completeness | Protected Marking | Panel Functionality | Notes |
|---|---|---|---|---|---|
| positive-001 | TBD | TBD | TBD | TBD | — |
| positive-002 | TBD | TBD | TBD | TBD | — |

## Model Comparison

| Model | Precision | Recall | F1 | Positive Avg Score | Date |
|---|---|---|---|---|---|
| (pending) | — | — | — | — | — |

## Known Failure Modes

1. **False positive on "修改" requests**: Boundary-001 is the most common mis-trigger scenario. The skill may activate when user says "修改 HTML" because it contains the word "可编辑" in its description matching.
2. **Over-eager on vague "生成页面" requests**: "帮我生成一个页面" without explicit static/editable qualifier — needs clear disambiguation in skill trigger logic.

## Next Evaluation Runs

- [ ] Run all 4 cases on current default model
- [ ] Run on 1 alternative model for cross-validation
- [ ] Log results in per-case `## Actual Results` tables
- [ ] Update summary metrics above
