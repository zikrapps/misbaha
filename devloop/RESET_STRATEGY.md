# Reset Strategy — Strategy C (App-Side Testability)

**Status:** Planned for Phase 6 (app patch). Documented now so flows and routines assume deterministic resets from the start.

## Why Strategy C

Baseline exploration showed two major nondeterminism sources:

- **11-step tutorial** auto-opens on first launch and blocks all interaction until dismissed.
- **Badge unlock modals** interrupt counting flows when thresholds are crossed.
- **Settings “Reset all counters”** does not reset `tutorialCompleted`, so runs drift after the first pass.

Strategy C fixes this at the source with a small, debug-only testability layer in Misbaha.

## Target app

| Field | Value |
|-------|--------|
| App | Misbaha |
| Version | 1.2.0 (build 3) |
| Commit (baseline) | `1e060079dfe5bd194ec8e0556d6a7a518ded0495` |
| Platform | iOS Simulator — iPhone 17 Pro |
| DevLoop | 0.0.96 (production) |

## Reset contract (after patch)

Each test run follows this sequence:

```
1. Launch app (or invoke reset deep link)
2. App enters known baseline state
3. Run scenario routines
4. Capture pass/fail + artifacts
5. Invoke reset before next run
```

### Baseline state definition

After reset, the app must be in:

| State | Expected value |
|-------|----------------|
| Screen | Today tab |
| Tutorial | Not visible; will not auto-open during E2E run |
| Counters | All zero |
| Goals | None active (or fixed seed — document if seeded) |
| Language | English |
| Theme | Default (`garden` or app default) |
| Badges | None pending in unlock queue |
| Modals | None |

## Planned patch (Phase 6)

Patch files will live under `devloop/app-patches/`.

### 1. E2E build flag

Set at build/run time:

```bash
EXPO_PUBLIC_E2E=1 npm run ios
```

When `EXPO_PUBLIC_E2E === '1'`:

- Skip auto-opening the tutorial (`TutorialHost` does not call `openTutorial`).
- Optionally disable badge unlock modals (`BadgeUnlockHost` returns null).
- Optionally disable Reanimated/layout animations in dev E2E builds.

### 2. Test reset and seed deep links

URL scheme (already registered): `misbaha`

| Route | Behavior |
|-------|----------|
| `misbaha://test/reset` | Clear store → clean E2E baseline (no goals/counts) |
| `misbaha://test/seed` | Deterministic seed (see below) → navigate to Today |

Both routes only apply when `EXPO_PUBLIC_E2E=1`. Otherwise they no-op and return home.

```bash
# Clean baseline
xcrun simctl openurl booted "misbaha://test/reset"

# Deterministic seed for scenarios that need existing progress
xcrun simctl openurl booted "misbaha://test/seed"
```

#### Seed contract (`misbaha://test/seed`)

| State | Value |
|-------|--------|
| Badges earned | **≥2 dhikr badges** (`bead-1`, `bead-2`); goal progress also earns fruit/plant badges |
| Goals completed | **1** (`e2e-seed-goal-complete` — 7-day Tasbih Fatimah, all days done) |
| Goals in progress | **1** (`e2e-seed-goal-in-progress` — 10-day plan, 3 days done, day 4 partial) |
| Lifetime counts | 99 on `fajr-subhanallah` (enough for 2 tasbeeh badges) |
| Tutorial | Dismissed / skipped in E2E mode |
| Badge modals | Disabled in E2E mode |

Implementation: `src/e2e/testSeed.ts`, routes `app/test/seed.tsx` and `app/test/reset.tsx`.

### 3. Stable accessibility identifiers

Add `testID` props (mapped to iOS accessibility identifiers) on:

| Element | testID |
|---------|--------|
| Today tab | `tab-today` |
| Tasbeeh tab | `tab-tasbeeh` |
| Goals tab | `tab-goals` |
| Visualize tab | `tab-visualize` |
| Settings gear | `settings-button` |
| Tutorial Skip | `tutorial-skip` |
| Tutorial Next | `tutorial-next` |
| Badge Continue | `badge-continue` |
| Dua search field | `dua-search-input` |
| First expanded counter | `dua-counter-value` |
| Surprise goal button | `surprise-goal-button` |
| Today tap total | `today-tap-total` |

### 4. Hydration signal

Expose a visible or queryable “ready” state after Zustand persist rehydrates (e.g. `testID="app-ready"` on root once `useStoreHydrated()` is true) so DevLoop waits for readiness instead of a fixed delay.

## Runner integration

The execution harness (Phase 3) will call reset or seed before each run:

```bash
# iOS Simulator — clean baseline
xcrun simctl openurl booted "misbaha://test/reset"

# iOS Simulator — deterministic progress (2 badges, 1 complete + 1 active goal)
xcrun simctl openurl booted "misbaha://test/seed"
```

Build with E2E mode enabled:

```bash
EXPO_PUBLIC_E2E=1 npm run ios
```

Fallback if deep link is unavailable (pre-patch exploration only):

```bash
# Erase app data — slower, use only during Phase 2 recording
xcrun simctl uninstall booted com.zikrapps.misbaha
npm run ios
```

## Phase usage

| Phase | Reset approach |
|-------|----------------|
| Phase 2 (routine recording) | `EXPO_PUBLIC_E2E=1` + `misbaha://test/reset` or `seed` |
| Phase 3–4 (baseline 30×) | **Requires E2E build** — reset or seed deep link per scenario |
| Phase 6 (hardening) | testIDs + remaining patch items |
| Phase 7 (hardened 30×) | Deep link reset/seed + E2E flag for every run |

## Success criteria

Strategy C is complete when:

- [ ] Two consecutive runs of the same scenario produce the same starting screen without manual steps.
- [ ] Tutorial never blocks E2E runs.
- [ ] Badge modals do not interrupt counting scenarios in E2E mode.
- [ ] Reset deep link completes in under 3 seconds on iPhone 17 Pro Simulator.
