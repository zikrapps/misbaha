# Routine: launch_and_dismiss_tutorial

| Field | Value |
|-------|--------|
| **App** | Misbaha 1.2.0 |
| **Platform** | iOS (iPhone 17 Pro Simulator) |
| **User flow** | Cold launch → wait for ready → dismiss tutorial if shown → verify Today home |

## Preconditions

- App installed (`com.zikrapps.misbaha`)
- DevLoop Bridge connected to simulator
- Strategy C: `misbaha://test/reset` invoked before launch (tutorial auto-open disabled)

## Parameters

None

## Steps

| # | Type | Detail |
|---|------|--------|
| 1 | Observe | App not in foreground or freshly launched |
| 2 | Act | Launch Misbaha from simulator |
| 3 | Wait | Until `app-ready` **or** "Today" title **or** tutorial step 1 visible |
| 4 | Validate | If tutorial visible ("Welcome to Misbaha", "Step 1 of 11") → continue; else skip to step 6 |
| 5 | Act | Tap **Skip** (`tutorial-skip`) |
| 6 | Wait | Tutorial backdrop gone |
| 7 | Assert | Header **Today** visible |
| 8 | Assert | Tab bar visible; Today tab active |
| 9 | Assert | No modal overlay |

## Expected result

Interactive Today screen with no blocking overlays.

## Failure artifacts

Screenshot, DevLoop trace, recording, `xcrun simctl spawn booted log stream` excerpt

## Known risks

- Hydration delay before UI appears
- Tutorial shown when E2E flag not set (test design)
- RTL restart alert on first launch after language migration

## Used by flows

A, B, C, D, E
