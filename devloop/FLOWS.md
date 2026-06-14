# Misbaha — Test Flows

DevLoop reliability suite flow definitions for the QualGent coding challenge.

## Environment

| Field | Value |
|-------|--------|
| App | Misbaha 1.2.0 (build 3) |
| Bundle ID | `com.zikrapps.misbaha` |
| Git commit | `1e060079dfe5bd194ec8e0556d6a7a518ded0495` |
| Platform | iOS Simulator — iPhone 17 Pro |
| iOS | 26.3 |
| DevLoop | 0.0.96 (production) |
| Reset strategy | **Strategy C** — see [RESET_STRATEGY.md](./RESET_STRATEGY.md) |

## Global preconditions (all flows)

After Strategy C patch is applied:

- App built with `EXPO_PUBLIC_E2E=1`
- Reset deep link invoked: `misbaha://test/reset`
- `app-ready` signal visible (store hydrated)
- English language, default theme
- No modals or overlays visible
- DevLoop Bridge connected to iPhone 17 Pro Simulator

Before patch (Phase 2 recording only):

- Fresh install or tutorial manually skipped once
- Document any state drift in run notes

## Global guardrail pattern

Every important action in every flow:

1. **Observe** current screen state
2. **Validate** expected condition is met
3. **Act** (tap, type, launch, background)
4. **Wait** for stable state (not fixed sleep)
5. **Assert** expected outcome
6. **Capture artifacts** if assertion fails
7. **Recover** via `recover_to_today` or stop safely

---

## Flow A — Launch and reach stable home

**ID:** `flow-a-launch-home`  
**Priority:** P0 (foundation — all scenarios depend on this)

### User story

Cold start the app and land on a known, interactive Today screen with no blocking overlays.

### Preconditions

- Misbaha installed on connected simulator
- Strategy C: reset deep link invoked before launch

### Steps

| # | Guardrail | Action | Expected |
|---|-----------|--------|----------|
| 1 | Device home or app switcher | Launch Misbaha | App process starts |
| 2 | Wait for `app-ready` OR Today title | Wait for hydration | Splash gone |
| 3 | If tutorial visible | Tap `tutorial-skip` ("Skip") | Tutorial dismissed |
| 4 | Validate | Assert header "Today" visible | Today screen |
| 5 | Validate | Assert `tab-today` selected in tab bar | Correct tab active |
| 6 | Validate | No modal backdrop | Screen interactive |

### Expected result

- Today dashboard visible with date subtitle
- Gear icon (`settings-button`) in header
- Tab bar shows Today, Tasbeeh, Goals, Visualize
- No tutorial or badge modal

### Routines composed

- `launch_and_dismiss_tutorial`

### Failure artifacts

Screenshot, DevLoop trace/recording, simulator syslog

### Known risks

| Risk | Classification |
|------|----------------|
| Splash/hydration delay | Environment / timing |
| Tutorial appears when E2E flag missing | Test design bug |
| RTL restart alert on stale build | State drift |

### Parameters

None

---

## Flow B — Tasbeeh count

**ID:** `flow-b-tasbeeh-count`  
**Priority:** P0 (core product behavior)

### User story

Navigate to Tasbeeh, expand a dua, double-tap to count three times, and verify the counter increased.

### Preconditions

- Flow A complete (stable Today home)
- Strategy C reset applied
- Default tap weight = 1

### Steps

| # | Guardrail | Action | Expected |
|---|-----------|--------|----------|
| 1 | Today visible | Tap `tab-tasbeeh` | Tasbeeh screen loads |
| 2 | Category grid visible | Tap category **Daily** | Dua list for Daily |
| 3 | List loaded | Tap expand chevron on first dua | Row expanded |
| 4 | Expanded row visible | Read initial counter value | Baseline count recorded |
| 5 | Expanded row visible | Double-tap counting area 3× | Counter animates |
| 6 | If badge modal | Tap `badge-continue` ("Continue") | Modal dismissed |
| 7 | Stable counter text | Assert counter = baseline + 3 | Count persisted |

### Expected result

- Dua counter increased by 3 (or by `tapWeight × 3` if weight ≠ 1)
- User remains on Tasbeeh tab
- No blocking modals

### Routines composed

- `launch_and_dismiss_tutorial`
- `navigate_to_tab` (param: `tasbeeh`)
- `expand_dua_and_count` (params: `category=daily`, `index=0`, `taps=3`)
- `dismiss_badge_if_present`

### Failure artifacts

Screenshot before/after count, trace, recording

### Known risks

| Risk | Classification |
|------|----------------|
| Double-tap too slow for 380ms window | Agent/tool error |
| Badge modal blocks taps | State drift |
| Collapsed row — counting disabled | Test design bug |
| Ghost tap re-fires on iOS New Arch | App quirk / flake |

### Parameters

| Name | Default | Description |
|------|---------|-------------|
| `category` | `daily` | Category tile to open |
| `duaIndex` | `0` | Zero-based index in list |
| `tapCount` | `3` | Number of double-taps |

---

## Flow C — Dua search

**ID:** `flow-c-dua-search`  
**Priority:** P1

### User story

Search for a dua by transliteration and open a matching result.

### Preconditions

- Flow A complete
- Strategy C reset applied
- Keyboard may appear — account for layout shift

### Steps

| # | Guardrail | Action | Expected |
|---|-----------|--------|----------|
| 1 | Today visible | Tap `tab-tasbeeh` | Tasbeeh screen |
| 2 | Search bar visible | Tap `dua-search-input` | Keyboard opens |
| 3 | Input focused | Type `subhan` | Results filter |
| 4 | Results list non-empty | Validate ≥1 result | No "No matching dua" |
| 5 | Results visible | Tap first result | Dua row selected/expanded |
| 6 | Stable state | Assert matching text visible | Search succeeded |

### Expected result

- At least one dua matching "subhan" is shown and opened
- Search field contains query text

### Routines composed

- `launch_and_dismiss_tutorial`
- `navigate_to_tab` (param: `tasbeeh`)
- `search_dua` (param: `query=subhan`)

### Failure artifacts

Screenshot of results (or empty state), trace, recording

### Known risks

| Risk | Classification |
|------|----------------|
| Empty results for query | Oracle / test data |
| Keyboard covers result list | Agent/tool error |
| Urdu RTL layout differs | State drift |

### Parameters

| Name | Default | Description |
|------|---------|-------------|
| `query` | `subhan` | Search string (transliteration) |

---

## Flow D — Start surprise goal

**ID:** `flow-d-surprise-goal`  
**Priority:** P1

### User story

Start a random surprise goal from the Goals tab and verify it appears in the active goals list.

### Preconditions

- Flow A complete
- Strategy C reset applied
- No active goals (reset clears goals)

### Steps

| # | Guardrail | Action | Expected |
|---|-----------|--------|----------|
| 1 | Today visible | Tap `tab-goals` | Goals screen |
| 2 | Goals screen loaded | Tap `surprise-goal-button` | Navigate to goal detail |
| 3 | Goal detail visible | Validate goal title/days visible | Detail screen |
| 4 | Back or tab | Return to Goals list | Goals screen |
| 5 | Goals list | Assert new active goal card present | Goal persisted |

### Expected result

- A new goal appears in the active goals section
- Goal detail was reachable and shows multi-day plan

### Routines composed

- `launch_and_dismiss_tutorial`
- `navigate_to_tab` (param: `goals`)
- `start_surprise_goal`

### Failure artifacts

Screenshot of Goals before/after, trace, recording

### Known risks

| Risk | Classification |
|------|----------------|
| Random goal content — hard to assert exact title | Oracle weakness |
| Navigation stack differs after detail | Agent/tool error |
| Prior goals persisted without reset | State drift |

### Parameters

None (surprise goal is intentionally random — assert presence, not exact content)

### Assertion strategy

- **Strong:** Active goals count increased from 0 to 1
- **Weak (avoid alone):** Any text on screen exists

---

## Flow E — Background and resume

**ID:** `flow-e-background-resume`  
**Priority:** P1

### User story

Count on Tasbeeh, background the app, resume, and verify the counter value persisted.

### Preconditions

- Flow A complete
- Strategy C reset applied

### Steps

| # | Guardrail | Action | Expected |
|---|-----------|--------|----------|
| 1 | Complete Flow B steps 1–6 | Count 3 on Daily dua | Counter = 3 |
| 2 | Record counter value | Note value `N` | Baseline saved |
| 3 | Tasbeeh visible | Background app (Home gesture) | App suspended |
| 4 | Wait 2s | — | Simulator stable |
| 5 | App switcher | Re-open Misbaha | App foreground |
| 6 | Tasbeeh or same screen | Assert counter still equals `N` | State persisted |

### Expected result

- Counter value unchanged after background/resume cycle
- App returns to same screen (Tasbeeh) or restores session

### Routines composed

- `launch_and_dismiss_tutorial`
- `expand_dua_and_count` (params: `category=daily`, `taps=3`)
- Background/resume actions (scenario-level — not a separate routine)

### Failure artifacts

Screenshot before background and after resume, trace, recording

### Known risks

| Risk | Classification |
|------|----------------|
| iOS kills app under memory pressure | Environment failure |
| DevLoop cannot trigger background | Agent/tool error |
| App returns to Today instead of Tasbeeh | Acceptable if count persists |

### Parameters

| Name | Default | Description |
|------|---------|-------------|
| `tapCount` | `3` | Counts before background |
| `backgroundSeconds` | `2` | Wait while backgrounded |

---

## Scenario matrix

Scenarios compose flows for baseline (30×) and hardened (30×) benchmarks.

| Scenario ID | Flows | Description |
|-------------|-------|-------------|
| `scenario-home` | A | Launch + stable home only |
| `scenario-count` | A → B | Full counting flow |
| `scenario-search` | A → C | Search flow |
| `scenario-goal` | A → D | Surprise goal flow |
| `scenario-lifecycle` | A → E | Count + background/resume |

Minimum challenge coverage: **3 flows** — we use all 5.

## Routine index

See `routines/` for per-routine specifications:

| Routine | Flows |
|---------|-------|
| `launch_and_dismiss_tutorial` | A, B, C, D, E |
| `navigate_to_tab` | B, C, D |
| `expand_dua_and_count` | B, E |
| `search_dua` | C |
| `start_surprise_goal` | D |
| `dismiss_badge_if_present` | B, E |
| `recover_to_today` | All (recovery) |
