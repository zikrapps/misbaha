# Routine: navigate_to_tab

| Field | Value |
|-------|--------|
| **App** | Misbaha 1.2.0 |
| **Platform** | iOS (iPhone 17 Pro Simulator) |
| **User flow** | From any tab, tap target tab and validate screen loaded |

## Preconditions

- App on a stable screen (typically Today after `launch_and_dismiss_tutorial`)
- Tab bar visible and not obscured

## Parameters

| Name | Required | Values |
|------|----------|--------|
| `tab` | Yes | `today`, `tasbeeh`, `goals`, `visualize` |

## Steps

| # | Type | Detail |
|---|------|--------|
| 1 | Observe | Tab bar visible at bottom |
| 2 | Validate | Target tab label present |
| 3 | Act | Tap tab (`tab-{name}` testID) |
| 4 | Wait | Screen transition complete |
| 5 | Assert | Tab-specific header/content visible |

## Expected result by tab

| `tab` | Assert |
|-------|--------|
| `today` | Title **Today**; hero stats visible |
| `tasbeeh` | Title **Tasbeeh**; category grid visible |
| `goals` | Title **Goals**; suggested plans or empty state |
| `visualize` | Title **Visualize**; visualization toggle visible |

## Failure artifacts

Screenshot, trace, recording

## Known risks

- Absolute tab bar overlaps bottom content — tap tab bar directly
- Lazy tab mount delay on first visit
- Urdu tab bar uses reversed layout (keep English for E2E)

## Used by flows

B, C, D
