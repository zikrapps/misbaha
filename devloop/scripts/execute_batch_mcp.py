#!/usr/bin/env python3
"""Execute pending harness runs via DevLoop MCP bridge (sequential apply_routine)."""

from __future__ import annotations

import argparse
import json
import subprocess
import sys
import time
import urllib.error
import urllib.request
from pathlib import Path

ROOT = Path(__file__).resolve().parents[2]
sys.path.insert(0, str(Path(__file__).resolve().parent))

from harness_lib import ROOT as HROOT, default_trace_path, load_batch, save_trace_payload

MCP_URL = "http://127.0.0.1:51821/mcp"
DEVICE = "FC897F5C-9579-49BC-AB4C-8288851663BF"
APP_BUNDLE = "com.zikrapps.misbaha"
BATCH_ID = "baseline-20260614-124230"
RECOVER_ROUTINE = "recover_to_today"
WDA_RECOVER_TYPES = {"execution_error"}
RESET_URL = "misbaha://test/reset"
TODAY_URL = "misbaha://test/go/today"
RESET_WAIT_S = 2.5
SETTLE_WAIT_S = 1.5
FAST_RESET_WAIT_S = 1.0
FAST_SETTLE_WAIT_S = 0.5
LAUNCH_ROUTINE = "launch_and_dismiss_tutorial_new"


def parse_args() -> argparse.Namespace:
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("--batch", default=BATCH_ID)
    parser.add_argument("--device", default=DEVICE)
    parser.add_argument(
        "--app-path",
        help="Install app on device before running (iOS .app path)",
    )
    parser.add_argument(
        "--strong-reset",
        action="store_true",
        help="Terminate app and invoke reset deep links before each run (and after)",
    )
    parser.add_argument(
        "--fast-reset",
        action="store_true",
        help="Light reset deep link before each run (~2s); skips redundant launch routine",
    )
    parser.add_argument(
        "--scenario",
        help="Only run entries whose scenarioId matches (e.g. scenario-home)",
    )
    parser.add_argument(
        "--app-bundle",
        default=APP_BUNDLE,
        help="iOS bundle id (registered routine key; default com.zikrapps.misbaha)",
    )
    parser.add_argument(
        "--all-runs",
        action="store_true",
        help="Execute every run in the batch, not only pending ones",
    )
    return parser.parse_args()


class McpClient:
    def __init__(self) -> None:
        self.session_id: str | None = None
        self.req_id = 0

    def _headers(self) -> dict[str, str]:
        h = {
            "Content-Type": "application/json",
            "Accept": "application/json, text/event-stream",
        }
        if self.session_id:
            h["Mcp-Session-Id"] = self.session_id
        return h

    def _post(self, body: dict, *, expect_response: bool = True) -> dict | None:
        req = urllib.request.Request(
            MCP_URL,
            data=json.dumps(body).encode(),
            headers=self._headers(),
            method="POST",
        )
        with urllib.request.urlopen(req, timeout=600) as resp:
            sid = resp.headers.get("Mcp-Session-Id")
            if sid:
                self.session_id = sid
            text = resp.read().decode()
        if not text.strip():
            return None
        for line in text.splitlines():
            if line.startswith("data: "):
                return json.loads(line[6:])
        if expect_response:
            raise RuntimeError(f"No MCP data payload: {text[:500]}")
        return None

    def call_tool(self, name: str, arguments: dict) -> dict:
        self.req_id += 1
        resp = self._post(
            {
                "jsonrpc": "2.0",
                "id": self.req_id,
                "method": "tools/call",
                "params": {"name": name, "arguments": arguments},
            }
        )
        if "error" in resp:
            raise RuntimeError(f"MCP error calling {name}: {resp['error']}")
        result = resp.get("result", {})
        if result.get("isError"):
            texts = [c.get("text", "") for c in result.get("content", []) if c.get("type") == "text"]
            raise RuntimeError(f"Tool {name} failed: {' '.join(texts)}")
        content = result.get("content", [])
        for item in content:
            if item.get("type") == "text":
                text = item.get("text", "")
                try:
                    return json.loads(text)
                except json.JSONDecodeError:
                    return {"result": text}
        return result

    def initialize(self) -> None:
        self._post(
            {
                "jsonrpc": "2.0",
                "id": 1,
                "method": "initialize",
                "params": {
                    "protocolVersion": "2024-11-05",
                    "capabilities": {},
                    "clientInfo": {"name": "execute_batch_mcp", "version": "1.0"},
                },
            }
        )
        self._post({"jsonrpc": "2.0", "method": "notifications/initialized", "params": {}}, expect_response=False)


def is_wda_recoverable(trace: dict) -> bool:
    failure_type = trace.get("failure_type", "")
    detail = str(trace.get("failure_detail", "")).lower()
    message = str(trace.get("message", "")).lower()
    if failure_type in WDA_RECOVER_TYPES:
        return True
    if "404" in detail or "404" in message:
        return True
    if "wda" in detail or "webdriver" in detail:
        return True
    return False


def _safe_recover(mcp: McpClient, device: str, app_bundle: str) -> None:
    """Best-effort recover_to_today between retries; swallow infra errors."""
    try:
        recover = mcp.call_tool(
            "apply_routine",
            {
                "device": device,
                "routine_id": RECOVER_ROUTINE,
                "app_bundle_id": app_bundle,
                "params": "{}",
            },
        )
        if recover.get("status") != "passed":
            print(f"  recover_to_today failed: {recover.get('failure_type')}")
    except RuntimeError as exc:
        print(f"  recover_to_today error: {exc}")


def apply_with_retry(
    mcp: McpClient,
    device: str,
    routine_id: str,
    app_bundle: str,
    *,
    max_attempts: int = 4,
) -> dict:
    """Run a routine, retrying only transient infrastructure failures.

    The DevLoop bridge intermittently drops connections under sustained parallel
    load ("All connection attempts failed" / "Server disconnected"), surfacing as
    an apply_routine execution_error — or, when the call itself can't reach the
    bridge, as a raised RuntimeError. Both are infra, not app/test failures, so we
    back off, run recover_to_today, and retry. Real failures (element_not_found,
    postcondition_timeout) are NOT wda-recoverable and return immediately so they
    still count against the baseline.
    """
    last_trace: dict = {
        "status": "failed",
        "failure_type": "execution_error",
        "routine_id": routine_id,
    }
    for attempt in range(1, max_attempts + 1):
        try:
            trace = mcp.call_tool(
                "apply_routine",
                {
                    "device": device,
                    "routine_id": routine_id,
                    "app_bundle_id": app_bundle,
                    "params": "{}",
                },
            )
        except RuntimeError as exc:
            # Connection-level drop: the bridge couldn't service the call at all.
            print(f"  {routine_id} attempt {attempt}/{max_attempts} infra error: {exc}")
            last_trace = {
                "status": "failed",
                "failure_type": "execution_error",
                "failure_detail": str(exc),
                "routine_id": routine_id,
            }
            if attempt < max_attempts:
                time.sleep(min(4 * attempt, 15))
                _safe_recover(mcp, device, app_bundle)
            continue

        if trace.get("status") == "passed" or not is_wda_recoverable(trace):
            return trace

        last_trace = trace
        print(
            f"  recover_to_today after {routine_id} failure "
            f"({trace.get('failure_type')}) attempt {attempt}/{max_attempts}"
        )
        if attempt < max_attempts:
            time.sleep(min(4 * attempt, 15))
            _safe_recover(mcp, device, app_bundle)

    return last_trace


def confirm_scheme_dialog(mcp: McpClient, device: str, *, attempts: int = 3) -> None:
    """Confirm the iOS 'Open in "Misbaha"?' custom-scheme dialog if it appears.

    Opening a misbaha:// link against a foregrounded app makes iOS prompt
    'Open in "Misbaha"?' with Cancel/Open. mobile_dismiss_dialogs does NOT clear
    it, so the alert lingers and blocks the next routine tap (and stacks across
    runs). Tapping "Open" confirms the deep link so navigation proceeds. Loops a
    few times in case more than one prompt is queued.
    """
    for _ in range(attempts):
        try:
            obs = mcp.call_tool("mobile_observe_screen", {"device": device})
        except RuntimeError:
            return
        elements = obs.get("elements") if isinstance(obs, dict) else None
        if not elements or not any("Open in" in str(e) for e in elements):
            return
        try:
            mcp.call_tool("mobile_tap_and_observe", {"device": device, "element_text": "Open"})
        except RuntimeError:
            return
        time.sleep(0.6)


# Markers that only appear once the app has rendered past the launch splash.
# The splash shows just the app name ("Misbaha") and possibly the status-bar
# clock; a rendered app exposes the tab bar (", tab,") and Today content.
READY_MARKERS = ("TODAY'S TAPS", "GOAL FOCUS", ", TAB,", "TAB-TODAY", "TOTAL TAPS")


def wait_until_ready(
    mcp: McpClient,
    device: str,
    *,
    timeout_s: float = 16.0,
    poll_s: float = 0.75,
) -> bool:
    """Poll mobile_observe_screen until the app renders past the launch splash.

    The cold-launch splash shows only 'Misbaha' (and sometimes the clock). If a
    routine taps before the tab bar mounts it fails with element_not_found and
    'Visible: Misbaha'. Polling here makes every routine start from a ready app,
    which removes the dominant cold-launch race across all scenarios.
    """
    deadline = time.time() + timeout_s
    while time.time() < deadline:
        try:
            obs = mcp.call_tool("mobile_observe_screen", {"device": device})
        except RuntimeError:
            time.sleep(poll_s)
            continue
        elements = obs.get("elements") if isinstance(obs, dict) else None
        if elements:
            joined = " | ".join(str(e) for e in elements).upper()
            if any(marker in joined for marker in READY_MARKERS):
                return True
        time.sleep(poll_s)
    print("    app readiness poll timed out — proceeding anyway")
    return False


def hard_reset(mcp: McpClient, device: str, app_bundle: str, *, label: str = "pre-run") -> None:
    """Strong reset: home → terminate → launch → reset deep link → confirm dialog.

    The explicit launch reliably foregrounds the app on Today. The
    misbaha://test/reset deep link then clears persisted state via the in-app
    E2E reset and navigates to Today on mount. Because that link is opened
    against a foregrounded app, iOS shows an 'Open in "Misbaha"?' confirmation
    that must be tapped through (confirm_scheme_dialog) — otherwise it lingers
    and blocks the next routine tap.
    """
    print(f"  strong reset ({label})")

    def safe_call(tool: str, args: dict) -> None:
        try:
            mcp.call_tool(tool, args)
        except RuntimeError as exc:
            print(f"    {tool} skipped: {exc}")

    safe_call("mobile_press_button", {"device": device, "button": "home"})
    time.sleep(0.5)
    safe_call("mobile_terminate_app", {"device": device, "package_id": app_bundle})
    time.sleep(0.75)

    launched = False
    for attempt in range(2):
        try:
            mcp.call_tool("mobile_launch_app", {"device": device, "package_id": app_bundle})
            launched = True
            break
        except RuntimeError as exc:
            print(f"    launch attempt {attempt + 1} failed: {exc}")
            time.sleep(1)
    if not launched:
        safe_call("mobile_open_url", {"device": device, "url": RESET_URL})
        confirm_scheme_dialog(mcp, device)
    time.sleep(1.5)

    safe_call("mobile_open_url", {"device": device, "url": RESET_URL})
    time.sleep(RESET_WAIT_S)
    confirm_scheme_dialog(mcp, device)
    safe_call("mobile_dismiss_dialogs", {"device": device})
    time.sleep(SETTLE_WAIT_S)
    # Block until the app has rendered (tab bar/Today present) so the first
    # routine tap never lands on the bare 'Misbaha' splash.
    wait_until_ready(mcp, device)


def fast_reset(mcp: McpClient, device: str) -> None:
    """Quick reset via deep links only (~2s)."""

    def safe_call(tool: str, args: dict) -> None:
        try:
            mcp.call_tool(tool, args)
        except RuntimeError as exc:
            print(f"    {tool} skipped: {exc}")

    safe_call("mobile_open_url", {"device": device, "url": RESET_URL})
    time.sleep(FAST_RESET_WAIT_S)
    safe_call("mobile_open_url", {"device": device, "url": TODAY_URL})
    time.sleep(FAST_SETTLE_WAIT_S)


def routines_for_run(run: dict, *, fast_reset: bool) -> list[str]:
    return list(run["routines"])


def run_post_actions(
    mcp: McpClient,
    device: str,
    actions: list[dict],
    app_bundle: str,
    *,
    strong_reset: bool,
    fast_reset: bool,
) -> None:
    if not actions:
        return
    for action in actions:
        atype = action.get("type")
        if atype == "background":
            mcp.call_tool("mobile_press_button", {"device": device, "button": "home"})
            wait = action.get("waitSeconds", 2)
            time.sleep(wait)
        elif atype == "foreground":
            # Resume the SAME (backgrounded) app — never reset here. This action
            # exists to verify state survives backgrounding (assertCounterUnchanged),
            # so a reset deep link would defeat the test. mobile_launch_app brings
            # the running app forward without a custom-scheme confirm dialog.
            launched = False
            for attempt in range(2):
                try:
                    mcp.call_tool(
                        "mobile_launch_app",
                        {"device": device, "package_id": app_bundle},
                    )
                    launched = True
                    break
                except RuntimeError as exc:
                    print(f"  mobile_launch_app attempt {attempt + 1} failed: {exc}")
                    try:
                        mcp.call_tool("mobile_dismiss_dialogs", {"device": device})
                    except RuntimeError:
                        pass
                    time.sleep(1)
            if not launched:
                print("  foreground resume failed after retries")
            time.sleep(2)


def record_run(batch_id: str, run_id: str, trace_path: Path) -> int:
    cmd = [
        sys.executable,
        str(ROOT / "devloop/scripts/finish_run.py"),
        "--batch",
        batch_id,
        "--run-id",
        run_id,
        "--traces",
        str(trace_path),
    ]
    return subprocess.run(cmd, cwd=ROOT).returncode


def main() -> int:
    args = parse_args()
    batch_id = args.batch
    device = args.device
    batch = load_batch(batch_id)
    if args.all_runs:
        pending = list(batch["runs"])
    else:
        pending = [r for r in batch["runs"] if r["status"] == "pending"]
    if args.scenario:
        pending = [r for r in pending if r["scenarioId"] == args.scenario]
    app_bundle = args.app_bundle
    mode = "strong reset" if args.strong_reset else ("fast reset" if args.fast_reset else "default")
    print(f"Runs: {len(pending)} on {device} ({mode}) bundle={app_bundle}")

    mcp = McpClient()
    mcp.initialize()
    try:
        mcp.call_tool("mobile_boot_simulator", {"udid": device, "open_gui": False})
    except RuntimeError as exc:
        print(f"boot simulator skipped: {exc}")

    acquire = None
    for attempt in range(12):
        try:
            acquire = mcp.call_tool("qg_acquire_device", {"udid": device})
            break
        except RuntimeError as exc:
            if "device-busy" not in str(exc) or attempt == 11:
                raise
            wait_s = min(5 * (attempt + 1), 30)
            print(f"device busy, retry acquire in {wait_s}s ({attempt + 1}/12)")
            time.sleep(wait_s)
    print(f"Acquired: {acquire}")
    if args.app_path:
        print(f"Setting up app from {args.app_path}")
        try:
            mcp.call_tool("mobile_setup_app", {"device": device, "app_path": args.app_path})
        except RuntimeError as exc:
            print(f"app setup skipped (may already be installed): {exc}")
    if args.strong_reset:
        hard_reset(mcp, device, app_bundle, label="session-start")

    failed_runs: list[dict] = []
    passed_count = 0

    try:
        for idx, run in enumerate(pending, 1):
            run_id = run["runId"]
            print(f"[{idx}/{len(pending)}] {run_id}")
            try:
                if args.strong_reset:
                    hard_reset(mcp, device, app_bundle, label="pre-run")
                elif args.fast_reset:
                    fast_reset(mcp, device)

                traces: list[dict] = []
                routine_ids = routines_for_run(run, fast_reset=args.fast_reset)

                for routine_id in routine_ids:
                    trace = apply_with_retry(mcp, device, routine_id, app_bundle)
                    traces.append(trace)
                    status = trace.get("status", "unknown")
                    print(f"  {routine_id}: {status}")
                    if status != "passed" and routine_id not in run.get("optionalRoutines", []):
                        break

                run_post_actions(
                    mcp,
                    device,
                    run.get("postRoutineActions", []),
                    app_bundle,
                    strong_reset=args.strong_reset,
                    fast_reset=args.fast_reset,
                )

                trace_path = default_trace_path(batch_id, run_id)
                save_trace_payload(trace_path, {"routines": traces})
                rc = record_run(batch_id, run_id, trace_path)

                if rc == 0:
                    passed_count += 1
                else:
                    failure_type = next(
                        (
                            t.get("failure_type")
                            for t in traces
                            if t.get("status") != "passed"
                        ),
                        "unknown",
                    )
                    failed_runs.append({"runId": run_id, "failure_type": failure_type})
                    print(f"  RECORD FAILED ({failure_type})")

                if args.strong_reset:
                    hard_reset(mcp, device, app_bundle, label="post-run")
            except Exception as exc:
                print(f"  RUN ERROR: {exc}")
                failed_runs.append({"runId": run_id, "failure_type": "execution_error"})
                try:
                    recover = mcp.call_tool(
                        "apply_routine",
                        {
                            "device": device,
                            "routine_id": RECOVER_ROUTINE,
                            "app_bundle_id": app_bundle,
                            "params": "{}",
                        },
                    )
                    print(f"  recover_to_today: {recover.get('status')}")
                except Exception as rec_exc:
                    print(f"  recover failed: {rec_exc}")

            if idx % 10 == 0:
                print(
                    f"PROGRESS {idx}/{len(pending)} passed={passed_count} failed={len(failed_runs)} last={run_id}"
                )
    finally:
        release = mcp.call_tool("qg_release_device", {"device": device})
        print(f"Released: {release}")

    status_cmd = subprocess.run(
        [sys.executable, str(ROOT / "devloop/scripts/run_harness.py"), "status", "--batch", batch_id],
        cwd=ROOT,
        capture_output=True,
        text=True,
    )
    print(status_cmd.stdout)

    summary = {
        "executed": len(pending),
        "passed_this_session": passed_count,
        "failed_runs": failed_runs,
    }
    print(json.dumps(summary, indent=2))
    return 0 if not failed_runs else 1


if __name__ == "__main__":
    raise SystemExit(main())
