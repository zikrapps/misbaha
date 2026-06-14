# DevLoop Reliability Suite — Misbaha

Test hardening project for the QualGent AI Reliability QA Engineer coding challenge.

## Documents

| File | Purpose |
|------|---------|
| [FLOWS.md](./FLOWS.md) | All 5 user flows (A–E) with steps, assertions, risks |
| [RESET_STRATEGY.md](./RESET_STRATEGY.md) | Strategy C — app-side reset and E2E testability |
| [routines/](./routines/) | Per-routine specs (7 routines) |
| [configs/scenarios.json](./configs/scenarios.json) | Scenario definitions composing routines |

## Status

| Phase | Status |
|-------|--------|
| 0 — Setup & pinning | Complete |
| 1 — Flow selection | Complete |
| 2 — DevLoop routines | In progress |
| 3 — Execution harness | Pending |
| 4 — Baseline 30× | Pending |
| 6 — App patch (Strategy C) | Pending |
| 7 — Hardened 30× | Pending |

## Quick reference

```
App:      Misbaha 1.2.0 @ 1e06007
Platform: iOS — iPhone 17 Pro Simulator (26.3)
DevLoop:  0.0.96 (production)
Reset:    Strategy C — misbaha://test/reset | misbaha://test/seed + EXPO_PUBLIC_E2E=1
```

## Directory layout

```
devloop/
├── configs/          Scenario definitions
├── routines/         Routine specifications
├── runs/             Per-run JSON results (gitignored)
├── artifacts/        Screenshots, traces, recordings (gitignored)
├── reports/          Benchmark and reliability reports
├── scripts/          Runner and summarizer (Phase 3)
└── app-patches/      Source diffs for testability (Phase 6)
```
