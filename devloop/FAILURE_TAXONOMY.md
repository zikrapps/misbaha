# Failure Taxonomy — Misbaha DevLoop Reliability Suite

Every meaningful failure observed across the baseline and hardening runs, classified
into reusable failure classes with evidence. This is the companion to
[RELIABILITY_REPORT.md](./RELIABILITY_REPORT.md).

## Method

- **Baseline batch:** `baseline-20260615-032556` (149 completed runs, 23 failures).
- **Hardened batch:** `baseline-20260615-090927` (150 completed runs, 0 failures).
- Per-run results: `runs/<batch>/scenario-*.json` (status, failed routine, `failed_step`,
  `failure_type`, `failure_detail`).
- Every failure was assigned exactly one class. **Classification coverage: 100%**
  (0 `Unknown`).

## Failure classes

| Class | Definition |
|-------|------------|
| **App bug** | A genuine defect in Misbaha, fixed in app source. |
| **Test design bug** | The test/routine/harness was wrong (stale selector, wrong assumption, wrong target). |
| **Agent/tool error** | The automation acted before the app was ready, or mis-timed an action. |
| **State drift** | Leftover state from a previous run leaked into the next. |
| **Environment failure** | Device, build, tooling, or infrastructure broke — not the app. |
| **Oracle weakness** | The assertion was too weak to catch a real regression. |
| **Unknown** | Failure with insufficient evidence to classify. |

## What the baseline failures actually were

All 23 baseline failures were `element_not_found`, and **every one was a false
positive** — the app behaved correctly; the test gave up before the UI had painted.

| Sub-cause | Count | Evidence |
|-----------|------:|----------|
| Cold-launch splash race (only `Misbaha` splash visible at step 2) | 21 | `failure_detail: "... Visible: 'Misbaha' ..."` |
| Navigation race (target screen not rendered yet) | 2 | `failure_detail` references `tab-*` / goal screen |
| **Total** | **23** | mean `failed_step` = **2.0** (failed at the first navigation) |

Headline: the baseline's failures were **timing false positives**, not app defects.
This is exactly the trap the challenge targets — tests that lie.

## Full issue catalogue (13 issues)

| # | Issue | Class | Evidence / where | Fix |
|---|-------|-------|------------------|-----|
| 1 | Harness targeted the wrong bundle id (`com.misbaha.app`) | Test design bug | early smoke `execution_error` | Set `APP_BUNDLE=com.zikrapps.misbaha` |
| 2 | App was *built* with `com.misbaha.app` | Environment failure (tooling) | installed bundle id | Fix `PRODUCT_BUNDLE_IDENTIFIER`, rebuild + reinstall |
| 3 | 5-simulator parallel timeouts | Environment failure (hardware) | smoke 1/5, `postcondition_timeout` | Reduce parallelism → single-sim sequential |
| 4 | iOS "Open in 'Misbaha'?" confirm dialog blocked test deep links | Test design bug | "Something went wrong" on deep-link nav | `hard_reset` (terminate+launch) + `confirm_scheme_dialog`; navigate via `tab-*` testIDs instead of `open_url` |
| 5 | expo-router "navigate before mounting the Root Layout" crash | App bug | ErrorBoundary log | Defer `router.replace` via `requestAnimationFrame` in `app/test/reset.tsx` and `app/test/go/[tab].tsx` |
| 6 | ErrorBoundary swallowed errors silently | App bug | no diagnostics on crash | Add `componentDidCatch` logging |
| 7 | Stale device leases (`device-busy`) | Environment failure (infra) | acquire blocked | Clear processes, wait for lease expiry / bridge restart |
| 8 | "Downloading 100%…" Metro overlay flakiness | Environment failure (tooling) | overlay covered UI | Release build with embedded JS bundle (no Metro at runtime) |
| 9 | Stale `count` routine: removed category + timing-fragile double-tap | Test design bug | `element_not_found` "Expand dua" | Rebuild `expand_dua_and_count` v8 (Quranic Duas + 3 s hold-to-complete) |
| 10 | `goal` tapped `surprise-goal-button` before the screen rendered | Agent/tool error (timing) | 7/30 `element_not_found` (first full run) | Harden `start_surprise_goal` v4 — `wait_for: screen_changed` on every nav step |
| 11 | Cold-launch splash race (dominant baseline failure) | Agent/tool error (timing) | 21/23 `Visible: 'Misbaha'` | Add `wait_until_ready` readiness poll to `hard_reset` |
| 12 | Transient bridge disconnects (`All connection attempts failed`) | Environment failure (infra) | `execution_error` under load | `apply_with_retry` (backoff) + `recover_to_today` |
| 13 | Duplicate WebDriverAgent launchers → WDA HTTP-port collision/crash | Environment failure (infra, **root cause**) | crash in `-[FBWebServer startHTTPServer]` | Single-sim sequential + restart QualGent Desktop bridge to clear duplicate runners + stale leases |

## Class distribution

| Class | Issues | Notes |
|-------|-------:|-------|
| App bug | 2 | #5, #6 — real defects found and fixed in app source |
| Test design bug | 3 | #1, #4, #9 |
| Agent/tool error (timing) | 2 | #10, #11 — *accounted for all 23 baseline run failures* |
| Environment failure | 6 | #2, #3, #7, #8, #12, #13 — build/tooling + infra (root cause = #13) |
| State drift | 0 | Prevented by design — Strategy C reset (`misbaha://test/reset`) gives a clean slate per run |
| Oracle weakness | 0 | Prevented by design — strong assertions (counter increments by N; active-goal count 0→1) instead of "any text exists" (see `FLOWS.md`) |
| Unknown | 0 | 100% classification coverage |

## Highest-value problem

**Issue #13 — duplicate WebDriverAgent launchers** was the single highest-value fix.
It was the root cause of the unrecoverable `execution_error` storms (the bridge silently
started two WDA instances on one simulator; they collided on the WDA HTTP port and one
aborted in `-[FBWebServer startHTTPServer]`). Until it was isolated via single-sim
sequential execution and a clean bridge restart, no amount of routine hardening could
reach 100%. Second highest-value: **Issue #11** (the splash readiness poll), which alone
removed 21 of 23 run failures.

## Real app bugs filed/fixed

- **#5 navigate-before-mount** and **#6 silent ErrorBoundary** are genuine app defects
  surfaced by the reliability suite and fixed in app source — exactly the kind of signal
  a trustworthy test harness should produce (as opposed to the 23 false positives the
  un-hardened harness produced).
