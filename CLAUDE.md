@AGENTS.md

<!-- BEGIN DEVLOOP v4 - managed by DevLoop installer, safe to remove but do not edit inside -->
# DevLoop QA

DevLoop is a mobile QA tool. When the user asks to test the app or finds bugs in it, follow this guidance verbatim.

## devloop-subagent-router

_Use when a DevLoop or QualGent mobile QA request needs to be routed to the right specialized subagent: verifying a changed feature for PR Loop evidence, running or rerunning tests, creating tests, or fixing flaky or failing tests. If setup, tooling, or runtime failures block delegation, use the troubleshooting fallback guidance._

# DevLoop: Subagent Router

This skill is for the host or main agent. Its job is to choose the right
QualGent subagent and pass along the task context, not to run the mobile
device flow itself.

When the matching subagent is installed and available, delegate immediately.
Once delegated, the subagent prompt is the authoritative execution contract.
The subagent should use `qg_docs` for targeted MCP reference and should use
`find_routine` / `apply_routine` only for recorded app routines, not for these
installed DevLoop SKILL.md prompt bundles.

## Routing

Choose one subagent destination:

- `qualgent-feature-verifier`: verify a newly built feature, bug fix, or pull
  request on a device; test a change before opening or updating a PR; or attach
  DevLoop/QualGent evidence to a GitHub PR. This workflow owns focused
  feature verification, `upload_loop`, and PR Loop evidence.
- `qualgent-test-runner`: run, rerun, execute, or locally validate an existing
  QualGent test case or test run. This workflow owns full QualGent test-case
  execution and local test-run reporting; do not use it as the general PR
  feature verifier.
- `qualgent-test-creator`: create, write, or add a new mobile QA test case from
  a feature, flow, bug, or coverage request.
- `qualgent-test-improver`: diagnose a flaky or failing test, update stale
  selectors, improve waits, fix missing setup, or decide whether a failure is
  a real app bug.

Do not ask the user for a raw QualGent test case UUID. Users can provide a
human-readable test case name or description. Pass that human input to the
subagent and have it resolve the matching test case through QualGent MCP tools
before any device acquisition, local run, or upload internals need the id. If
the name is ambiguous, ask a human-readable clarification such as which test
case title they mean.

## Delegation Payload

When delegating, include the context the subagent needs to start without
re-asking:

- the user's exact goal and whether this is verify, run, create, or improve work;
- the PR URL, branch, changed-feature description, human test case name,
  description, or test run id the user provided;
- platform/device preferences, if any;
- app path, package/bundle id, or build artifact details, if known;
- relevant repo paths, recent code changes, and any already-observed failure;
- whether parallel/background execution is acceptable for this task.

Keep orchestration in the main agent. The subagent owns the device session,
test-case resolution, tool calls, and result reporting for its delegated task.

## PR Loop Evidence

When DevLoop feature verification happened and the host agent opens or updates a
GitHub PR, the PR body or a PR comment must include the QualGent Loop link
returned by `upload_loop`.

Do not attach or cite raw `recordingPath` values, local video file paths,
Desktop-only test-run videos, signed local test-run artifact URLs, or the
feature-flagged Desktop Loops tab as PR evidence. The shareable QualGent Loop
URL is the PR evidence artifact.

## Missing Installs, Subagents, Or Tools

If you cannot choose one of the subagent destinations because a required
subagent, MCP server, or DevLoop tool is missing, do not fall through into a
long hand-rolled flow by default.

1. Activate `devloop-troubleshooting` if that skill is installed.
2. Tell the user to install or update missing pieces from the QualGent Desktop
   MCP page. Use "Configure subagents for {agent}" for subagents and
   "Configure Skills + Memory" for global skills/project rules.
3. If MCP tools are available but subagents are not, use `qg_docs("setup")`,
   `qg_docs("device")`, and `qg_docs("tool-reference")` to verify the local
   environment before deciding whether direct device execution is appropriate.

The QualGent Desktop Loops tab is feature-flagged and not user-facing. Do not
depend on it for visible workflows or settings.

## Runtime Or Acquisition Failures

When a run fails because device acquisition, auth/session, test-data setup, or
mobile runtime behavior is broken, activate `devloop-troubleshooting` before
reading app source. Missing tooling and stale installs are setup problems, not
app bugs.

## Direct MCP Fallback

Direct MCP device control is a fallback, not the primary path. Use it only
when subagents are not installed/available or when the user explicitly asks
the main agent to drive the device itself.

When using the fallback:

- read `qg_docs("setup")` and `qg_docs("test-flow")` instead of relying on
  this router for full execution details;
- resolve human test case names through QualGent MCP tools before acquiring a
  device;
- for feature-verification fallback flows, call `upload_loop` after
  `qg_release_device` returns a recording and use the returned QualGent Loop
  URL as the only PR evidence artifact;
- acquire exactly one device with `qg_acquire_device` and always release it
  with `qg_release_device`;
- prefer `mobile_tap_and_observe` for action taps and re-observe when the
  screen state is unexpected;
- use `find_routine` / `apply_routine` only for recorded app routines returned by
  QualGent MCP, not for installed prompt skills;
- finish a real QA flow with `mobile_report_result` when that tool is
  available.

## devloop-troubleshooting

_Use when DevLoop setup, MCP visibility, subagent install, global skills or project rules, auth/session, device acquisition, or mobile runtime steps fail. Classify whether the problem is setup/tooling, device/session, test-data/auth, or a real app-runtime failure before reading app source._

# DevLoop: Troubleshooting

Use this skill when a DevLoop or QualGent mobile QA workflow is blocked,
misconfigured, or failing. Start by deciding whether the failure is in the
local DevLoop setup, the device/session, the test data/auth state, or the app
flow itself.

Do not send users to the QualGent Desktop Loops tab for setup or settings.
The Loops tab is feature-flagged and not a visible setup surface. If a required
component is missing or stale, ask the user to open the QualGent Desktop MCP tab
instead:

- For missing or stale subagents, use **Configure subagents for {agent}**.
- For missing or stale global skills or project rules, use
  **Configure Skills + Memory**.

Do not ask a user for a raw QualGent test case UUID. For user-facing local test
runs, ask for a human-readable test case name or description, resolve the
matching test case through QualGent MCP tools, then pass the resolved id to
device acquisition or upload internals.

If a subagent already owns an active device session, do not probe the same
bridge or device from the main agent unless the owning subagent asks for help.
Let the subagent finish, or ask the user whether to stop that session first.

## Classify First

Pick one bucket before acting:

1. **Setup/install** - MCP tools are missing, the DevLoop bridge is disabled or
   unreachable, subagents are absent/stale, or global skills/project rules are
   missing.
2. **Device/session** - no device is available, the wrong device is selected,
   WebDriverAgent/ADB is not ready, acquisition fails, or a session was not
   released.
3. **Test-data/auth** - the test case name is ambiguous, credentials are
   missing, the app is logged out, or the requested account/data fixture is not
   available.
4. **App-runtime** - the setup is healthy, the device session is valid, and a
   real app step fails during execution.

Only app-runtime failures should trigger source-code investigation. Missing
tools, missing subagents, stale skills, and device acquisition errors are setup
or session problems, not app bugs.

## Setup And Install Checks

When DevLoop tools are unavailable or a workflow cannot start:

- Verify the QualGent Desktop app is running and the DevLoop bridge is enabled.
- Verify the host MCP config points at the local DevLoop bridge and the coding
  agent has been restarted or refreshed after install.
- Check whether the expected tool surface is visible for the host. A healthy
  bridge exposes `qg_*`, `mobile_*`, and QualGent test-management tools as
  appropriate for that agent.
- If the MCP server is present but the tools are missing, ask the user to open
  the QualGent Desktop MCP tab and reinstall/update the integration.
- If subagents are required for the request, check that
  `qualgent-feature-verifier`, `qualgent-test-runner`, `qualgent-test-creator`,
  and `qualgent-test-improver` are installed and not stale before trying to
  verify features, run tests, create tests, or improve tests.
- If subagents are missing or stale, ask the user to use
  **Configure subagents for {agent}** on the MCP tab.
- If global skills or project rules are missing or stale, ask the user to use
  **Configure Skills + Memory** on the MCP tab.

If MCP docs are available, use `qg_docs("setup")`, `qg_docs("device")`, and
`qg_docs("tool-reference")` to verify host-specific details. If the MCP tools
are not available at all, do not invent a direct device flow; fix the install
first.

## Device And Session Checks

For device/session failures:

- Start with `qg_list_devices` when available. Confirm the expected platform,
  UDID, state, and whether another session already owns the device.
- Boot an Android emulator or iOS simulator if no suitable device is running.
  For iOS, confirm WebDriverAgent is reachable before blaming the app.
- Use `qg_acquire_device` for exactly one device, and always pair it with
  `qg_release_device`.
- For ad hoc environment checks, preserve local-only acquisition mode when the
  bridge supports it.
- For telemetry-uploading local test runs, resolve the human-readable test case
  name or description through QualGent MCP tools first, then pass the resolved
  `test_case_id` into `qg_acquire_device`.
- If acquisition fails because another subagent owns the device, do not keep
  poking that session. Pick another available device or wait for release.

## Test Data And Auth Checks

For test-data/auth failures:

- Resolve human test case names with QualGent MCP tools. If more than one test
  case matches, ask a human-readable clarification such as which title or flow
  the user means.
- Confirm required credentials are available before starting the device flow.
- If the app opens logged out when the test expects an authenticated state,
  either log in through the test's setup steps or report the missing setup
  precondition.
- Distinguish missing data fixtures from app bugs. A missing account, org, or
  backend seed should be reported as a setup blocker, not hidden by editing the
  app source.

## Runtime Flow Failures

Use this section only after setup, device/session, and test-data/auth checks are
healthy.

### When the element isn't found

`mobile_tap_and_observe` with `element_text` raises "Element X not found" when
no matching element is in the live UI hierarchy.

The error message includes the visible labels currently on screen. Read them.
Common causes:

1. You are on a different screen than expected - re-observe with
   `mobile_observe_screen`.
2. The label text differs slightly from what you passed - case, punctuation,
   hidden whitespace, or a recent copy change.
3. The element is rendered but not in the hierarchy, such as a custom canvas,
   native overlay, or iOS WDA filtering case. Switch to the `x+y` coordinate
   fallback. Read the target's center from the `mobile_observe_screen`
   screenshot in logical pixel space. See `qg_docs("element-targeting")` for
   the full decision tree.

Do not retry the same `element_text` repeatedly. It will keep failing for the
same reason.

### When `screen_changed` is false

`screen_changed: false` after `mobile_tap_and_observe` means the tap landed but
the UI did not update.

Do not advance the flow as if the tap worked. The matched element may be
disabled, obscured, duplicated, or the action may have failed silently.
Re-observe, then decide:

- Retry with `wait_ms=3000` if the action triggers a slow network call.
- Switch to coordinate mode if the matched label was on a hidden duplicate.
- Escalate to source-code triage only if the button looks responsive but does
  nothing.

### When dialogs hijack the flow

A permission prompt or system dialog can cover the app between steps and
silently swallow a tap.

If a tap returns `screen_changed: false` and the previous step opened a feature
that requires a permission, call `mobile_dismiss_dialogs` before retrying.
`dismissed: null` is a fast no-op when there is no dialog to clear.

## Source Investigation For App Bugs

Read app source only when the failure is truly in the app.

For FAIL results, `mobile_report_result` requires a populated
`code_investigation`. Translate the observed failure into a code search target:
"Save closed but the note never appeared" means inspect the save handler,
list-refresh path, and API error handling for that feature. Find the specific
function responsible. If the cause is not clear, keep reading before reporting.

For BLOCKED results, do not force an app-code investigation. Use
`blocker_investigation` to describe the setup, auth, device, build, upload,
stale-test, or test-data condition that prevented a reliable customer result,
what you checked, and the remediation or handoff needed before rerunning.

If you can fix the app bug in the current task, make the change, rebuild,
reinstall, and rerun the same flow from the beginning. If the fix belongs to a
different owner or repo, report the blocker precisely.

## Reporting And Reruns

For a direct MCP fallback flow, finish with `mobile_report_result` when that
tool is available.

If `mobile_report_result` returns FAIL, it is not terminal. Follow the returned
next-step instructions:

1. Apply the fix from `code_investigation`.
2. Rebuild the app.
3. Call `mobile_install_app` with the new build.
4. Re-run the same test flow from the beginning.
5. Call `mobile_report_result` again with the new result.

Repeat until the status is PASS, or report a specific blocker that prevents a
valid rerun.

Use the `suggestions` field for quality issues that do not block the test:
missing loading states, silent errors, inconsistent button placement, or long
operations with no spinner.

## Deeper Guidance

- `qg_docs("setup")` - host MCP setup and install verification.
- `qg_docs("device")` - device discovery, acquisition, and release.
- `qg_docs("tool-reference")` - available tool names and expected arguments.
- `qg_docs("element-targeting")` - element-not-found and coordinate fallback.
- `qg_docs("test-flow")` - wait tuning and re-observe semantics.
- `qg_docs("failure-triage")` - runtime failure triage via MCP docs.
<!-- END DEVLOOP -->
