"""Shared helpers for the DevLoop execution harness."""

from __future__ import annotations

import fcntl
import json
import subprocess
from contextlib import contextmanager
from dataclasses import asdict, dataclass, field
from datetime import datetime, timezone
from pathlib import Path
from typing import Any, Callable, Literal

ROOT = Path(__file__).resolve().parents[2]
DEVLOOP_DIR = ROOT / "devloop"
CONFIGS_DIR = DEVLOOP_DIR / "configs"
RUNS_DIR = DEVLOOP_DIR / "runs"
REPORTS_DIR = DEVLOOP_DIR / "reports"
ARTIFACTS_DIR = DEVLOOP_DIR / "artifacts"
TRACES_DIR = ARTIFACTS_DIR / "traces"
SCENARIOS_PATH = CONFIGS_DIR / "scenarios.json"

RunStatus = Literal["pending", "passed", "failed", "blocked", "skipped"]
Phase = Literal["baseline", "hardened", "smoke"]


def utc_now() -> str:
    return datetime.now(timezone.utc).replace(microsecond=0).isoformat().replace("+00:00", "Z")


def git_commit() -> str:
    try:
        return (
            subprocess.check_output(["git", "rev-parse", "HEAD"], cwd=ROOT, text=True, stderr=subprocess.DEVNULL)
            .strip()
        )
    except (subprocess.CalledProcessError, FileNotFoundError):
        return "unknown"


def load_scenarios() -> dict[str, Any]:
    return json.loads(SCENARIOS_PATH.read_text())


def list_batch_files() -> list[Path]:
    if not RUNS_DIR.exists():
        return []
    return sorted(RUNS_DIR.glob("*.json"), key=lambda path: path.stat().st_mtime, reverse=True)


def resolve_batch_path(raw: str) -> Path:
    """Resolve a batch JSON path from repo root, or special aliases latest/newest."""
    token = raw.strip()
    if token in {"latest", "newest", "last"}:
        batches = list_batch_files()
        if not batches:
            raise SystemExit(f"No batch files found in {RUNS_DIR.relative_to(ROOT)}/")
        return batches[0]

    path = Path(token)
    if not path.is_absolute():
        path = ROOT / path

    if path.exists():
        return path

    # Allow passing just the batch id (e.g. baseline-20260614-122715)
    if not token.endswith(".json"):
        candidate = RUNS_DIR / f"{token}.json"
        if candidate.exists():
            return candidate

    matches = [batch for batch in list_batch_files() if token in batch.name]
    if len(matches) == 1:
        return matches[0]

    lines = [f"Batch file not found: {raw}"]
    if "..." in token or token.endswith("....json"):
        lines.append("Replace the placeholder with a real batch file from devloop/runs/.")
    available = list_batch_files()
    if available:
        lines.append("Available batches:")
        for batch in available[:8]:
            lines.append(f"  - {batch.relative_to(ROOT)}")
        lines.append("Tip: use --batch latest")
    else:
        lines.append(f"No batches yet. Create one with: ./devloop/scripts/run_baseline.sh plan")
    raise SystemExit("\n".join(lines))


@contextmanager
def batch_lock(path: Path | str):
    resolved = resolve_batch_path(str(path))
    lock_path = resolved.with_suffix(resolved.suffix + ".lock")
    lock_path.parent.mkdir(parents=True, exist_ok=True)
    with open(lock_path, "w") as lock_file:
        fcntl.flock(lock_file.fileno(), fcntl.LOCK_EX)
        try:
            yield resolved
        finally:
            fcntl.flock(lock_file.fileno(), fcntl.LOCK_UN)


def load_batch(path: Path | str) -> dict[str, Any]:
    resolved = resolve_batch_path(str(path))
    return json.loads(resolved.read_text())


def update_batch(path: Path | str, mutator: Callable[[dict[str, Any]], None]) -> None:
    with batch_lock(path) as resolved:
        batch = json.loads(resolved.read_text())
        mutator(batch)
        resolved.write_text(json.dumps(batch, indent=2) + "\n")


def default_trace_path(batch_id: str, run_id: str) -> Path:
    return TRACES_DIR / batch_id / f"{run_id}.json"


def list_trace_files(limit: int = 12) -> list[Path]:
    if not TRACES_DIR.exists():
        return []
    return sorted(TRACES_DIR.rglob("*.json"), key=lambda path: path.stat().st_mtime, reverse=True)[:limit]


def resolve_trace_path(raw: str, *, batch_id: str | None = None, run_id: str | None = None) -> Path:
    token = raw.strip()
    if token in {"default", "auto"} and batch_id and run_id:
        path = default_trace_path(batch_id, run_id)
        if not path.exists():
            _raise_trace_not_found(str(path.relative_to(ROOT)), batch_id=batch_id, run_id=run_id)
        return path

    path = Path(token)
    if not path.is_absolute():
        path = ROOT / path

    if path.exists():
        return path

    _raise_trace_not_found(raw, batch_id=batch_id, run_id=run_id)
    raise AssertionError("unreachable")


def _raise_trace_not_found(raw: str, *, batch_id: str | None, run_id: str | None) -> None:
    lines = [f"Trace file not found: {raw}"]
    if batch_id and run_id:
        suggested = default_trace_path(batch_id, run_id)
        lines.append(f"Expected path for this run: {suggested.relative_to(ROOT)}")
        lines.append("Save apply_routine JSON first, then record:")
        lines.append(
            f"  python3 devloop/scripts/run_harness.py save-trace "
            f"--batch latest --run-id {run_id} < trace.json"
        )
        lines.append("Or write the MCP apply_routine response directly:")
        lines.append(f"  mkdir -p {suggested.parent.relative_to(ROOT)}")
        lines.append(f"  # paste JSON into {suggested.relative_to(ROOT)}")
    traces = list_trace_files()
    if traces:
        lines.append("Existing trace files:")
        for trace in traces:
            lines.append(f"  - {trace.relative_to(ROOT)}")
    raise SystemExit("\n".join(lines))


def load_trace_payload(raw: str, *, batch_id: str | None = None, run_id: str | None = None) -> Any:
    path = resolve_trace_path(raw, batch_id=batch_id, run_id=run_id)
    return json.loads(path.read_text())


def save_trace_payload(path: Path, payload: Any) -> Path:
    if not path.is_absolute():
        path = ROOT / path
    path.parent.mkdir(parents=True, exist_ok=True)
    path.write_text(json.dumps(payload, indent=2) + "\n")
    return path


def save_batch(path: Path, batch: dict[str, Any]) -> None:
    path.parent.mkdir(parents=True, exist_ok=True)
    path.write_text(json.dumps(batch, indent=2) + "\n")


def write_run_result(path: Path, result: dict[str, Any]) -> None:
    path.parent.mkdir(parents=True, exist_ok=True)
    path.write_text(json.dumps(result, indent=2) + "\n")


@dataclass
class RoutineResult:
    routine_id: str
    status: RunStatus
    routine_version: int | None = None
    failed_step: int | None = None
    failure_type: str | None = None
    failure_detail: str | None = None
    duration_ms: int | None = None
    optional: bool = False


@dataclass
class RunResult:
    run_id: str
    batch_id: str
    scenario_id: str
    scenario_name: str
    flow_id: str
    iteration: int
    phase: Phase
    status: RunStatus
    started_at: str
    ended_at: str
    device_udid: str | None = None
    git_commit: str = "unknown"
    app_bundle_id: str = "com.zikrapps.misbaha"
    routines: list[RoutineResult] = field(default_factory=list)
    post_actions: list[dict[str, Any]] = field(default_factory=list)
    recording_path: str | None = None
    notes: str = ""

    def to_dict(self) -> dict[str, Any]:
        data = asdict(self)
        data["routines"] = [asdict(r) for r in self.routines]
        return data


def parse_apply_routine_trace(trace: dict[str, Any], *, optional: bool = False) -> RoutineResult:
    status: RunStatus = "passed" if trace.get("status") == "passed" else "failed"
    if optional and status == "failed":
        failure_type = trace.get("failure_type")
        if failure_type == "element_not_found":
            status = "skipped"
    return RoutineResult(
        routine_id=str(trace.get("routine_id", "unknown")),
        status=status,
        routine_version=trace.get("routine_version"),
        failed_step=trace.get("failed_step"),
        failure_type=trace.get("failure_type"),
        failure_detail=trace.get("failure_detail"),
        optional=optional,
    )


def aggregate_run_status(routines: list[RoutineResult]) -> RunStatus:
    for routine in routines:
        if routine.status == "failed":
            return "failed"
        if routine.status == "blocked":
            return "blocked"
    return "passed"


def filter_scenarios(config: dict[str, Any], *, tag: str | None, scenario_id: str | None) -> list[dict[str, Any]]:
    scenarios = config["scenarios"]
    if scenario_id:
        scenarios = [s for s in scenarios if s["id"] == scenario_id]
    if tag:
        scenarios = [s for s in scenarios if tag in s.get("tags", [])]
    return scenarios


def build_batch(
    *,
    phase: Phase,
    iterations: int,
    tag: str | None,
    scenario_id: str | None,
    device_udid: str | None,
) -> dict[str, Any]:
    config = load_scenarios()
    scenarios = filter_scenarios(config, tag=tag, scenario_id=scenario_id)
    if not scenarios:
        raise SystemExit("No scenarios matched the requested filters.")

    timestamp = datetime.now().strftime("%Y%m%d-%H%M%S")
    batch_id = f"{phase}-{timestamp}"
    runs: list[dict[str, Any]] = []

    for scenario in scenarios:
        for iteration in range(1, iterations + 1):
            run_id = f"{scenario['id']}-{iteration:03d}"
            runs.append(
                {
                    "runId": run_id,
                    "scenarioId": scenario["id"],
                    "scenarioName": scenario["name"],
                    "flowId": scenario["flowId"],
                    "iteration": iteration,
                    "routines": list(scenario["routines"]),
                    "optionalRoutines": list(scenario.get("optionalRoutines", [])),
                    "postRoutineActions": list(scenario.get("postRoutineActions", [])),
                    "status": "pending",
                    "resultPath": f"devloop/runs/{batch_id}/{run_id}.json",
                }
            )

    return {
        "batchId": batch_id,
        "phase": phase,
        "tag": tag,
        "iterations": iterations,
        "deviceUdid": device_udid,
        "appBundleId": config["app"]["bundleId"],
        "gitCommit": git_commit(),
        "createdAt": utc_now(),
        "configPath": str(SCENARIOS_PATH.relative_to(ROOT)),
        "runs": runs,
    }


def find_next_pending_run(batch: dict[str, Any]) -> dict[str, Any] | None:
    for run in batch["runs"]:
        if run["status"] == "pending":
            return run
    return None


def mark_run_status(batch: dict[str, Any], run_id: str, status: RunStatus) -> None:
    for run in batch["runs"]:
        if run["runId"] == run_id:
            run["status"] = status
            return
    raise KeyError(f"Run not found in batch: {run_id}")
