# Routine: start_surprise_goal

| Field | Value |
|-------|--------|
| **App** | Misbaha 1.2.0 |
| **Platform** | iOS (iPhone 17 Pro Simulator) |
| **User flow** | Goals tab → tap Surprise new goal → verify goal created |

## Preconditions

- Stable home after launch routine
- No active goals (Strategy C reset clears goals)

## Parameters

None

## Steps

| # | Type | Detail |
|---|------|--------|
| 1 | Act | `navigate_to_tab` → `goals` |
| 2 | Validate | Goals screen loaded |
| 3 | Observe | Count active goals (expect 0) |
| 4 | Act | Tap **Surprise new goal** (`surprise-goal-button`) |
| 5 | Wait | Goal detail screen loads |
| 6 | Assert | Goal title and day plan visible |
| 7 | Act | Navigate back to Goals (swipe back or tab) |
| 8 | Assert | Active goals count = 1 |

## Expected result

One new active goal in the Goals list after starting surprise goal.

## Failure artifacts

Goals screen before/after, goal detail screenshot, trace

## Known risks

- Random goal content — assert count not exact title (oracle weakness)
- Goal detail uses stack navigation — back gesture may confuse agent

## Used by flows

D
