# DevLoop Reliability Suite — Misbaha

Test hardening project for the QualGent AI Reliability QA Engineer coding challenge.

## Documents

| File | Purpose |
|------|---------|
| [RELIABILITY_REPORT.md](./RELIABILITY_REPORT.md) | Executive summary, baseline vs hardened metrics, root causes, next steps |
| [FAILURE_TAXONOMY.md](./FAILURE_TAXONOMY.md) | Every failure classified with evidence + class distribution |
| [FLOWS.md](./FLOWS.md) | All 5 user flows (A–E) with steps, assertions, risks |
| [RESET_STRATEGY.md](./RESET_STRATEGY.md) | Strategy C — app-side reset and E2E testability |
| [routines/](./routines/) | Per-routine specs |
| [configs/routines/](./configs/routines/) | JSON routine definitions (import via MCP) |
| [configs/scenarios.json](./configs/scenarios.json) | Scenario matrix for baseline/hardened runs |
| [app-patches/](./app-patches/) | Strategy C app-side testability patch (diff + notes) |
| [scripts/import_routines.py](./scripts/import_routines.py) | Emit MCP payloads from JSON |
| [scripts/run_baseline.sh](./scripts/run_baseline.sh) | Baseline execution harness entry point |
| [scripts/run_hardened.sh](./scripts/run_hardened.sh) | Hardened-phase wrapper (same scenarios, hardened setup) |
| [scripts/summarize_runs.py](./scripts/summarize_runs.py) | Aggregate runs → `reports/<batch>.{json,md}` |
| [scripts/classify_failures.py](./scripts/classify_failures.py) | Auto-classify failures into the taxonomy classes |
| [runs/](./runs/) | Raw per-run results; the two benchmark batches are kept as evidence |

## Status

| Phase | Status |
|-------|--------|
| 0 — Setup & pinning | Complete |
| 1 — Flow selection | Complete |
| 2 — DevLoop routines | Complete (smoke validated) |
| 3 — Execution harness | **Complete** |
| 4 — Baseline 30× | **Complete** — 100% (150/150), `baseline-20260615-090927` |
| 6 — App patch (Strategy C) | Complete |
| 7 — Hardened 30× | **Complete** — the 150/150 run is on the fully hardened setup (app fixes + routine hardening + readiness poll, single-sim sequential) |

> Earlier in-progress runs capture the pre-hardening flakiness used as the baseline
> comparison: smoke 1/5, first full run 94.7% (142/150), regression rerun 84.6%
> (126/149). Root cause of the infra failures was duplicate WebDriverAgent launchers
> colliding on the WDA port; resolved by single-sim sequential execution + a clean
> bridge restart. Full narrative + per-issue before/after diagrams are published as a
> hidden engineering write-up at `tech.zikrapps.com`.

## Quick reference

```
App:      Misbaha 1.2.0
Platform: iOS — iPhone 17 Pro Simulator (26.3)
DevLoop:  0.0.96 (production)
Reset:    misbaha://test/reset | misbaha://test/go/{tab} + EXPO_PUBLIC_E2E=1
```

## Phase 3 — Execution harness

### Plan a baseline batch (30× each scenario)

```bash
chmod +x devloop/scripts/run_baseline.sh

# All baseline-tagged scenarios × 30 iterations
./devloop/scripts/run_baseline.sh plan \
  --iterations 30 \
  --tag baseline \
  --device FC897F5C-9579-49BC-AB4C-8288851663BF

# Single-scenario smoke batch
./devloop/scripts/run_baseline.sh smoke --device FC897F5C-...
```

Creates `devloop/runs/baseline-YYYYMMDD-HHMMSS.json` with a pending run queue.

### Execute runs (DevLoop MCP via Cursor agent)

```bash
# Print next pending run + MCP workflow
./devloop/scripts/run_baseline.sh next devloop/runs/baseline-....json
```

For each run:

1. `qg_acquire_device(udid)`
2. `apply_routine` for each routine in order
3. Handle `postRoutineActions` if present (lifecycle scenario)
4. `qg_release_device()`
5. Save traces, then record:

```bash
# After apply_routine — save MCP JSON (stdin or file)
python3 devloop/scripts/run_harness.py save-trace \
  --batch latest \
  --run-id scenario-home-001 < trace.json

# Record using default trace path (devloop/artifacts/traces/<batch>/<run>.json)
python3 devloop/scripts/run_harness.py record \
  --batch latest \
  --run-id scenario-home-001
```

### Summarize results

```bash
./devloop/scripts/run_baseline.sh list
./devloop/scripts/run_baseline.sh summarize latest
./devloop/scripts/run_baseline.sh status latest
```

Use `latest` or a path from `list` — not the `baseline-....json` placeholder.

Writes `devloop/reports/<batch-id>.json` and `.md` with pass rates by scenario and failure types.

## Directory layout

```
devloop/
├── configs/          Scenario + routine definitions
├── routines/         Routine specifications
├── runs/             Batch plans + per-run JSON results
│                     (gitignored, EXCEPT the two benchmark batches kept as evidence)
├── artifacts/        Traces, screenshots, recordings
│                     (gitignored, EXCEPT traces for the two benchmark batches)
├── reports/          Benchmark summaries
├── scripts/          Harness, import, summarizer, failure classifier
└── app-patches/      Strategy C app-side testability patch (diff + README)
```

## Submission & reproduction

This repo is the deliverable. A reviewer can reproduce in ~30 minutes.

**Read first:** [RELIABILITY_REPORT.md](./RELIABILITY_REPORT.md) →
[FAILURE_TAXONOMY.md](./FAILURE_TAXONOMY.md) → [FLOWS.md](./FLOWS.md).

**Evidence (committed raw data):**
- Baseline (84.6%): `runs/baseline-20260615-032556/` + `reports/baseline-20260615-032556.{json,md}`
- Hardened (100%): `runs/baseline-20260615-090927/` + `reports/baseline-20260615-090927.{json,md}`
- Auto-classify either batch: `python3 devloop/scripts/classify_failures.py --batch baseline-20260615-032556`

**Reproduce a run:**
```bash
# 1. Build the app with the testability patch + E2E flag
EXPO_PUBLIC_E2E=1 npm run ios          # or a Release build with the flag

# 2. Plan + execute via DevLoop MCP (see "Phase 3" above)
./devloop/scripts/run_baseline.sh plan --iterations 30 --device <UDID>
./devloop/scripts/run_hardened.sh plan --iterations 30 --device <UDID>

# 3. Summarize
./devloop/scripts/run_baseline.sh summarize latest
```

**App-side patch:** [app-patches/](./app-patches/) — testIDs, E2E tutorial skip, reset/seed/go
deep links, plus two real app-bug fixes (expo-router navigate-before-mount, ErrorBoundary
logging).

**Plain-language write-up (bonus):** a public engineering narrative with before/after
diagrams is published at `tech.zikrapps.com`.
