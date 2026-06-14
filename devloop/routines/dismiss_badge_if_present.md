# Routine: dismiss_badge_if_present

| Field | Value |
|-------|--------|
| **App** | Misbaha 1.2.0 |
| **Platform** | iOS (iPhone 17 Pro Simulator) |
| **User flow** | Detect badge unlock modal → dismiss → continue |

## Preconditions

- Any screen (modal overlays entire app)

## Parameters

None

## Steps

| # | Type | Detail |
|---|------|--------|
| 1 | Observe | Is badge modal visible? ("New badge earned!") |
| 2 | If no | Exit routine (success) |
| 3 | Validate | **Continue** button visible (`badge-continue`) |
| 4 | Act | Tap **Continue** |
| 5 | Wait | Modal dismissed |
| 6 | If another badge queued | Repeat from step 1 (max 3 iterations) |
| 7 | Assert | No badge modal visible |

## Expected result

Screen clear of badge unlock modals.

## Failure artifacts

Screenshot of badge modal, trace

## Known risks

- Multiple badges queue after heavy counting
- Strategy C E2E mode disables badges entirely (preferred)

## Used by flows

B, E (and any flow that counts)

## Note

In Strategy C E2E builds, this routine becomes a no-op when badge modals are disabled. Keep it for non-E2E exploratory runs and as defense in depth.
