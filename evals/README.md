# Evals — Editable HTML System Skill

## Framework

This directory contains structured evaluation cases for measuring the trigger precision, recall, and behavioral correctness of the `editable-html-system` skill. Each test case is a self-contained user input with expected behavior, outcome assertions, and failure analysis.

## Test Case Categories

| Case ID | Category | Purpose |
|---|---|---|
| positive-001 | Should trigger | User asks to create editable document system |
| positive-002 | Should trigger | User asks for config-driven page with frequent updates |
| negative-001 | Should NOT trigger | User explicitly wants a static HTML page |
| boundary-001 | Near-negative | User asks to modify an existing page (not create system) |

## Held-Out Set

- **Training / development cases**: positive-001, negative-001
- **Held-out cases**: boundary-001, positive-002 — these are reserved for final evaluation, not used for skill tuning.

## Cross-Model Testing

The skill has been validated on the following models:

| Model | Date | Trigger Precision | Trigger Recall | Notes |
|---|---|---|---|---|
| (pending) | — | — | — | Results will be filled after evaluation runs |

To run cross-model evaluation:
1. For each test case, open a fresh conversation on the target model.
2. Paste the test case's `user_input` as the first message.
3. Record whether the skill was triggered (yes/no) and whether the output matches `expected_behavior`.
4. Log results in `results.md`.

## Methodology

Trigger evaluation follows standard binary classification:
- **Precision** = TP / (TP + FP) — of all skill triggers, how many were correct?
- **Recall** = TP / (TP + FN) — of all user intents that should trigger, how many did?
- **F1** = harmonic mean of Precision and Recall.

Each test case specifies `expected_trigger: true/false`. A false positive means the skill triggered when it shouldn't. A false negative means it failed to trigger when it should.

## Results Summary

See `results.md` for detailed per-model, per-case evaluation logs.
