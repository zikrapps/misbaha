# Routine: expand_dua_and_count

| Field | Value |
|-------|--------|
| **App** | Misbaha 1.2.0 |
| **Platform** | iOS (iPhone 17 Pro Simulator) |
| **User flow** | Open category → expand dua → double-tap count → verify increment |

## Preconditions

- On Tasbeeh tab
- Strategy C reset applied (counters at zero)
- Default tap weight = 1

## Parameters

| Name | Required | Default | Description |
|------|----------|---------|-------------|
| `category` | No | `daily` | Category tile: `daily`, `morning`, `night`, etc. |
| `duaIndex` | No | `0` | Index in list after category open |
| `tapCount` | No | `3` | Number of double-taps |

## Steps

| # | Type | Detail |
|---|------|--------|
| 1 | Validate | Tasbeeh screen with category grid |
| 2 | Act | Tap category tile (e.g. **Daily**) |
| 3 | Wait | Dua list rendered |
| 4 | Act | Tap expand chevron on dua at `duaIndex` |
| 5 | Validate | Row expanded; counter visible |
| 6 | Observe | Record baseline counter value |
| 7 | Act | Double-tap counting area `tapCount` times (≥120ms apart, ≤380ms per pair) |
| 8 | If badge modal | Run `dismiss_badge_if_present` |
| 9 | Wait | Counter text stable |
| 10 | Assert | Counter = baseline + (`tapCount` × tapWeight) |

## Expected result

Counter incremented correctly; still on Tasbeeh.

## Failure artifacts

Before/after counter screenshots, trace, recording

## Known risks

| Risk | Notes |
|------|-------|
| Double-tap timing | JS detects pairs within 380ms; agent may tap too slowly |
| Counting only when expanded | Collapsed row ignores taps |
| Badge modal after threshold | Use `dismiss_badge_if_present` |
| iOS ghost tap re-fires | App has 80ms guard — may cause off-by-one |

## Used by flows

B, E
