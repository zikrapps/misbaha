# App patches — Strategy C testability

App-side changes that make Misbaha reliably automatable. This is the "Option B"
hardening from the challenge (app-side testability patch), applied directly in app source
and captured here as a diff for review.

## Files

| File | What it is |
|------|------------|
| `strategy-c-testability.diff` | Full diff of the testability patch, base `1e06007` (Release 1.2.0) → working tree |

## What the patch does

| Area | Change | Why |
|------|--------|-----|
| **E2E flag** | `EXPO_PUBLIC_E2E=1` skips the onboarding tutorial (`src/features/tutorial/`, `src/e2e/config.ts`) | The first-run tutorial overlay blocked every automated flow |
| **Reset deep link** | `misbaha://test/reset` clears persisted state (`app/test/reset.tsx`, `src/e2e/actions.ts`) | A clean slate before each run; no state drift between runs |
| **Seed deep link** | `misbaha://test/seed` loads deterministic fixtures (`app/test/seed.tsx`, `src/e2e/testSeed.ts`) | Stable, repeatable starting data |
| **Tab deep link** | `misbaha://test/go/{tab}` jumps straight to a tab (`app/test/go/[tab].tsx`, `src/e2e/navigation.ts`) | Deterministic navigation without fragile tab-bar taps |
| **Stable testIDs** | Added on tabs, dua rows, counter, search input, goal controls (`src/components/TabBarButton.tsx`, `IconButton.tsx`, `Screen.tsx`, `DuaSearchBar.tsx`, `app/(tabs)/*`) | Robust element targeting instead of brittle text matching |
| **Router race fix (app bug)** | Defer `router.replace` via `requestAnimationFrame` in the test routes | Fixed an expo-router "navigate before mounting the Root Layout" crash on cold launch |
| **ErrorBoundary logging (app bug)** | `componentDidCatch` now logs (`src/components/ErrorBoundary.tsx`, `app/_layout.tsx`) | Surfaced silent crashes so failures were diagnosable |

The last two rows are genuine app defects the reliability suite uncovered; the rest are
testability affordances guarded behind the E2E flag / debug routes and have no effect on
production builds.

## How to apply (from a clean 1.2.0 checkout)

```bash
git checkout 1e06007
git apply devloop/app-patches/strategy-c-testability.diff
EXPO_PUBLIC_E2E=1 npm run ios   # or build a Release with the flag set
```

> The patch is already present in the current app source — this file documents it for
> reviewers and lets it be re-applied to the pinned baseline. See
> [../RESET_STRATEGY.md](../RESET_STRATEGY.md) for the design rationale.
