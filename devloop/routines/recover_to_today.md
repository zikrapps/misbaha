# Routine: recover_to_today

| Field | Value |
|-------|--------|
| **App** | Misbaha 1.2.0 |
| **Platform** | iOS (iPhone 17 Pro Simulator) |
| **User flow** | Return to known good state (Today tab) after drift or failure |

## Preconditions

- App still running (not crashed)

## Parameters

| Name | Required | Default | Description |
|------|----------|---------|-------------|
| `useReset` | No | `false` | If true, invoke `misbaha://test/reset` instead of tab navigation |

## Steps

| # | Type | Detail |
|---|------|--------|
| 1 | Observe | Current screen state |
| 2 | If modal visible | Dismiss (tutorial Skip, badge Continue, alert Cancel) |
| 3 | If `useReset=true` | Open `misbaha://test/reset` |
| 4 | Else | Tap `tab-today` up to 3 times |
| 5 | If on nested screen | Swipe back or tap Done until tab bar visible |
| 6 | Assert | Today screen visible |
| 7 | Capture | Screenshot if recovery required more than 2 actions |

## Expected result

Today tab active; no modals; safe to retry or abort scenario.

## Failure artifacts

Screenshot at point of drift, recovery action log

## Known risks

- Deep link reset unavailable pre-patch — fall back to tab taps only
- Settings stack open — tap Done in header first

## Used by flows

All (error recovery)
