# DevLoop routine JSON import

Routines are stored as JSON under this directory and uploaded to QualGent via MCP — there is no file-import button in the DevLoop desktop UI.

## Files

| File | routine_id | Params |
|------|------------|--------|
| `launch_and_dismiss_tutorial.json` | `launch_and_dismiss_tutorial` | — |
| `navigate_to_today.json` | `navigate_to_today` | — |
| `navigate_to_tasbeeh.json` | `navigate_to_tasbeeh` | — |
| `navigate_to_goals.json` | `navigate_to_goals` | — |
| `navigate_to_visualize.json` | `navigate_to_visualize` | — |
| `navigate_to_tab.json` | `navigate_to_tab` | deprecated |
| `expand_dua_and_count.json` | `expand_dua_and_count` | — |
| `search_dua.json` | `search_dua` | — (fixed query: subhan) |
| `start_surprise_goal.json` | `start_surprise_goal` | — |
| `apply_test_seed.json` | `apply_test_seed` | — |
| `dismiss_badge_if_present.json` | `dismiss_badge_if_present` | — |
| `recover_to_today.json` | `recover_to_today` | — |

**Note:** The launch routine was first created manually as `launch_and_dismiss_tutorial_new` in QualGent. That ID remains the active alias (see `manifest.json`).

## Blocker fixes (DevLoop 0.0.96)

1. **`{{param}}` substitution** — `apply_routine` does not substitute `{{tab}}` / `{{query}}`. Use tab-specific routines with `misbaha://test/go/{tab}` deep links instead of `navigate_to_tab`.
2. **Tab label ambiguity** — Short labels like `Tasbeeh` match goal cards. Routines use E2E deep links; the app exposes `tab-today`, `tab-tasbeeh`, etc. testIDs as fallback.
3. **Through the Day tile** — Below the fold on Tasbeeh; `expand_dua_and_count` includes a swipe-up before tapping the category.

Requires `EXPO_PUBLIC_E2E=1` build for deep links and testIDs.

## Re-import after editing JSON

From Cursor, ask the agent:

> Import all routines from devloop/configs/routines

Or preview payloads:

```bash
python3 devloop/scripts/import_routines.py
python3 devloop/scripts/import_routines.py navigate_to_tasbeeh
```

MCP tools used:

- `record_routine` — new routine
- `update_routine` — new version when routine already exists (409)

## Example apply_routine calls

```text
apply_routine(device, "launch_and_dismiss_tutorial_new", "com.zikrapps.misbaha", "{}")
apply_routine(device, "navigate_to_tasbeeh", "com.zikrapps.misbaha", "{}")
apply_routine(device, "search_dua", "com.zikrapps.misbaha", "{}")
apply_routine(device, "apply_test_seed", "com.zikrapps.misbaha", "{}")
```

Deep links (iOS Simulator):

```bash
xcrun simctl openurl booted "misbaha://test/go/tasbeeh"
```
