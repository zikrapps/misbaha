# Reliability Report — Misbaha DevLoop Suite

QualGent AI Reliability QA Engineer coding challenge. This report contrasts an
un-hardened **baseline** against the **hardened** suite, with root causes and evidence.

Companion docs: [FLOWS.md](./FLOWS.md) · [RESET_STRATEGY.md](./RESET_STRATEGY.md) ·
[FAILURE_TAXONOMY.md](./FAILURE_TAXONOMY.md) · [README.md](./README.md).
Public write-up: `tech.zikrapps.com`.

## Executive summary

We run 5 core user journeys, 30 times each (150 runs), and require every run to pass.
The un-hardened suite sat at **84.6%** with failures that were almost entirely the test
harness lying — timing false positives, not app defects. After isolating the root cause
(duplicate WebDriverAgent launchers colliding on the WDA port) and hardening the routines
and reset, the suite reaches **100% (150/150)** with zero connection errors and a
reproducible verdict for all five journeys.

## Test environment (pinned)

| Field | Value |
|-------|-------|
| App | Misbaha 1.2.0 (build 3) |
| Bundle id | `com.zikrapps.misbaha` |
| Git commit | `fcbd0042ffffbc244d2746d00101bf5278694fc6` |
| Platform | iOS Simulator — iPhone 17 Pro |
| iOS | 26.3 |
| DevLoop | 0.0.96 (production) |
| Reset | Strategy C — `misbaha://test/reset` + `EXPO_PUBLIC_E2E=1` |
| Execution | Single simulator, sequential |

## Flows under test

5 journeys (≥3 required). Full steps, preconditions, assertions, and risks in `FLOWS.md`.

| Scenario | Flow | What it verifies |
|----------|------|------------------|
| `scenario-home` | A | Cold launch reaches a stable, interactive Today screen |
| `scenario-count` | A→B | Counting a dhikr increments the counter by N |
| `scenario-search` | A→C | Searching duas returns and opens a match |
| `scenario-goal` | A→D | Starting a surprise goal creates an active goal (count 0→1) |
| `scenario-lifecycle` | A→E | Count survives a background/resume cycle |

## Method

- **30 iterations per scenario**, 150 runs per batch. Repetition is the point: a 1-in-20
  flake is invisible in a single run.
- **Clean slate per run** via Strategy C reset, then a readiness poll (`wait_until_ready`)
  so routines never start on the splash screen.
- **Guardrail pattern** on every important action: Observe → Validate → Act → Wait for
  stable state → Assert → Capture artifacts on fail → Recover.
- **Strong oracles**: assert the counter increments by N and the active-goal count goes
  0→1 — not "some text exists."
- **Artifacts per run**: structured JSON result (`runs/<batch>/scenario-*.json`) with
  status, failed routine, `failed_step`, `failure_type`, `failure_detail`; traces under
  `artifacts/traces/<batch>/`; screen recordings when produced by the bridge.

## Benchmark: baseline vs hardened

Baseline = `baseline-20260615-032556`. Hardened = `baseline-20260615-090927`.
Metrics computed from per-run result files.

| Metric | Baseline | Hardened | Notes |
|--------|---------:|---------:|-------|
| Success rate | 84.6% (126/149) | **100% (150/150)** | pass / completed |
| Flake rate | 15.4% | **0%** | runs bucking the scenario's majority verdict |
| Reproducibility | 0 / 5 scenarios | **5 / 5** | scenarios with a unanimous verdict |
| False-positive rate | 23 / 23 failures (≈15.4% of runs) | **0** | failures where the app was actually fine |
| Mean steps-to-failure | 2.0 | — | baseline failed at the first navigation |
| Recovery | none (not built) | retry + `recover_to_today` | transient bridge blips auto-absorbed |
| Classification coverage | 100% | 100% | every failure assigned a class |

### Per-scenario

| Scenario | Baseline | Hardened |
|----------|---------:|---------:|
| home | 27/30 (90%) | 30/30 (100%) |
| count | 21/30 (70%) | 30/30 (100%) |
| search | 25/30 (83%) | 30/30 (100%) |
| goal | 24/30 (80%) | 30/30 (100%) |
| lifecycle | 29/30 (97%) | 30/30 (100%) |
| **All** | **126/150 (84%)** | **150/150 (100%)** |

## Top failures and root causes

All 23 baseline failures were `element_not_found` and **all were false positives**:

1. **Cold-launch splash race (21/23)** — routines acted while only the `Misbaha` splash
   was visible. Fix: `wait_until_ready` readiness poll in `hard_reset`.
2. **Navigation race (2/23)** — tapped a target before the screen rendered. Fix:
   `wait_for: screen_changed` on navigation steps (`start_surprise_goal` v4).

The **highest-value root cause** was infrastructure, not the app: the DevLoop bridge
spawned **duplicate WebDriverAgent launchers** on one simulator, which collided on the WDA
HTTP port and aborted in `-[FBWebServer startHTTPServer]`, producing unrecoverable
`execution_error` storms. Resolved by single-simulator sequential execution plus a clean
QualGent Desktop restart to clear duplicate runners and stale leases.

Full 13-issue catalogue and class distribution: `FAILURE_TAXONOMY.md`.

## Hardening applied

**DevLoop-side**
- Readiness poll (`wait_until_ready`) before any routine acts.
- `wait_for: screen_changed` waits replacing fixed sleeps in navigation routines.
- `hard_reset` (terminate + launch + `confirm_scheme_dialog`) for a deterministic start.
- `apply_with_retry` (exponential backoff) + `recover_to_today` for transient bridge errors.
- Rebuilt stale routines (`expand_dua_and_count` v8 with hold-to-complete; `search_dua`
  via `tab-tasbeeh`).
- Single-simulator sequential execution to remove WDA port contention.

**App-side (Strategy C testability patch)**
- `EXPO_PUBLIC_E2E=1` skips the onboarding tutorial.
- Debug deep links: `misbaha://test/reset`, `misbaha://test/seed`, `misbaha://test/go/{tab}`.
- `testID`s on tabs, dua rows, counter, search input, goal controls.
- Fixed an expo-router navigate-before-mount crash (defer `router.replace` via
  `requestAnimationFrame`) and added `ErrorBoundary` logging — two real app bugs the suite
  surfaced.

## Remaining risks / limitations

- **Single-sim sequential** trades throughput for stability; safe parallelism needs the
  bridge to stop launching duplicate WDA instances (upstream/infra fix).
- Surprise-goal content is random by design — we assert *presence* (count 0→1), not exact
  title, to avoid an oracle that's brittle by construction.
- Release-build testing means JS changes require a rebuild before they're exercised.
- Metrics are from one baseline batch vs one hardened batch; more batches would tighten
  the flake-rate confidence interval.

## Next steps

- Re-introduce bounded parallelism once the duplicate-WDA infra issue is fixed.
- Wire a lightweight CI job to run a deterministic subset on each PR (full 150 nightly).
- Auto-classify failures from `failure_detail` patterns to keep classification coverage
  at 100% as new flows are added.

## How to reproduce

```bash
# Plan a 30× baseline batch
./devloop/scripts/run_baseline.sh plan --iterations 30 --tag baseline --device <UDID>

# Execute via DevLoop MCP (see README.md), then summarize
./devloop/scripts/run_baseline.sh summarize latest   # writes reports/<batch>.{json,md}
```
