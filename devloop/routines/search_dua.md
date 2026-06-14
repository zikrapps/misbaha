# Routine: search_dua

| Field | Value |
|-------|--------|
| **App** | Misbaha 1.2.0 |
| **Platform** | iOS (iPhone 17 Pro Simulator) |
| **User flow** | Focus search → type query → select first result |

## Preconditions

- On Tasbeeh tab
- English UI

## Parameters

| Name | Required | Default | Description |
|------|----------|---------|-------------|
| `query` | No | `subhan` | Transliteration or Arabic search text |

## Steps

| # | Type | Detail |
|---|------|--------|
| 1 | Validate | Tasbeeh screen; search bar visible |
| 2 | Act | Tap `dua-search-input` |
| 3 | Wait | Keyboard visible |
| 4 | Act | Type `{query}` |
| 5 | Wait | Results list updates |
| 6 | Validate | Results not empty (no "No matching dua found.") |
| 7 | Act | Tap first result row |
| 8 | Assert | Matching dua content visible on screen |

## Expected result

Search returns at least one match; selected dua is visible/expanded.

## Failure artifacts

Screenshot of results or empty state, trace, recording

## Known risks

- Keyboard covers lower results
- Query returns zero matches if data changes
- Search debounce delay

## Used by flows

C
