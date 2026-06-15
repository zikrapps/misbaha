#!/usr/bin/env python3
"""DevLoop execution harness — plan batches, record results, inspect progress."""

from __future__ import annotations

import argparse
import json
import sys
from pathlib import Path

sys.path.insert(0, str(Path(__file__).resolve().parent))

from harness_lib import (
    ROOT,
    RUNS_DIR,
    RunResult,
    aggregate_run_status,
    build_batch,
    default_trace_path,
    find_next_pending_run,
    list_batch_files,
    load_batch,
    load_trace_payload,
    mark_run_status,
    parse_apply_routine_trace,
    resolve_batch_path,
    save_batch,
    save_trace_payload,
    update_batch,
    utc_now,
    write_run_result,
)


def cmd_plan(args: argparse.Namespace) -> int:
    batch = build_batch(
        phase=args.phase,
        iterations=args.iterations,
        tag=args.tag,
        scenario_id=args.scenario,
        device_udid=args.device,
    )
    out = RUNS_DIR / f"{batch['batchId']}.json"
    save_batch(out, batch)
    pending = sum(1 for run in batch["runs"] if run["status"] == "pending")
    print(f"Created batch: {out.relative_to(out.parents[2])}")
    print(f"  phase={batch['phase']} runs={pending} device={batch['deviceUdid'] or 'unset'}")
    print(f"  commit={batch['gitCommit'][:8]}")
    return 0


def cmd_next(args: argparse.Namespace) -> int:
    batch = load_batch(args.batch)
    run = find_next_pending_run(batch)
    if not run:
        print(json.dumps({"status": "complete", "batchId": batch["batchId"]}))
        return 0
    default_trace = default_trace_path(batch["batchId"], run["runId"])
    payload = {
        "status": "ready",
        "batchId": batch["batchId"],
        "runId": run["runId"],
        "scenarioId": run["scenarioId"],
        "scenarioName": run["scenarioName"],
        "flowId": run["flowId"],
        "iteration": run["iteration"],
        "deviceUdid": batch.get("deviceUdid"),
        "appBundleId": batch["appBundleId"],
        "routines": run["routines"],
        "optionalRoutines": run.get("optionalRoutines", []),
        "postRoutineActions": run.get("postRoutineActions", []),
        "traceFile": str(default_trace.relative_to(ROOT)),
        "workflow": [
            "qg_acquire_device(udid)",
            *[f'apply_routine(device, "{routine_id}", app_bundle_id, "{{}}")' for routine_id in run["routines"]],
            "execute postRoutineActions if any (see batch run entry)",
            "qg_release_device()",
            (
                f'run_harness.py save-trace --batch {args.batch} --run-id {run["runId"]} < traces.json '
                f"# or save to {default_trace.relative_to(ROOT)}"
            ),
            (
                f'run_harness.py record --batch {args.batch} --run-id {run["runId"]} '
                f'--trace-file {default_trace.relative_to(ROOT)}'
            ),
        ],
    }
    print(json.dumps(payload, indent=2))
    return 0


def cmd_record(args: argparse.Namespace) -> int:
    batch = load_batch(args.batch)
    batch_path = resolve_batch_path(args.batch)
    run_meta = next((run for run in batch["runs"] if run["runId"] == args.run_id), None)
    if not run_meta:
        raise SystemExit(f"Unknown run id: {args.run_id}")

    trace_arg = args.trace_file or "default"
    trace_payload = load_trace_payload(trace_arg, batch_id=batch["batchId"], run_id=run_meta["runId"])
    traces = trace_payload if isinstance(trace_payload, list) else trace_payload.get("routines", [trace_payload])
    optional = set(run_meta.get("optionalRoutines", []))

    routine_results = []
    for index, trace in enumerate(traces):
        routine_id = trace.get("routine_id") or run_meta["routines"][index]
        routine_results.append(parse_apply_routine_trace(trace, optional=routine_id in optional))

    started_at = args.started_at or utc_now()
    ended_at = args.ended_at or utc_now()
    status = args.status or aggregate_run_status(routine_results)

    result = RunResult(
        run_id=run_meta["runId"],
        batch_id=batch["batchId"],
        scenario_id=run_meta["scenarioId"],
        scenario_name=run_meta["scenarioName"],
        flow_id=run_meta["flowId"],
        iteration=run_meta["iteration"],
        phase=batch["phase"],
        status=status,  # type: ignore[arg-type]
        started_at=started_at,
        ended_at=ended_at,
        device_udid=args.device or batch.get("deviceUdid"),
        git_commit=batch.get("gitCommit", "unknown"),
        app_bundle_id=batch["appBundleId"],
        routines=routine_results,
        post_actions=run_meta.get("postRoutineActions", []),
        recording_path=args.recording,
        notes=args.notes or "",
    )

    result_path = Path(run_meta["resultPath"])
    if not result_path.is_absolute():
        result_path = ROOT / result_path
    write_run_result(result_path, result.to_dict())

    def _mark(batch: dict) -> None:
        mark_run_status(batch, run_meta["runId"], status)  # type: ignore[arg-type]

    update_batch(batch_path, _mark)

    print(f"Recorded {status.upper()} → {result_path}")
    return 0 if status == "passed" else 1


def cmd_save_trace(args: argparse.Namespace) -> int:
    batch = load_batch(args.batch)
    run_meta = next((run for run in batch["runs"] if run["runId"] == args.run_id), None)
    if not run_meta:
        raise SystemExit(f"Unknown run id: {args.run_id}")

    if args.input_file:
        payload = json.loads(Path(args.input_file).read_text())
    else:
        payload = json.load(sys.stdin)

    out = Path(args.out) if args.out else default_trace_path(batch["batchId"], run_meta["runId"])
    saved = save_trace_payload(out, payload)
    print(f"Saved trace → {saved.relative_to(ROOT)}")
    print(
        f"Next: python3 devloop/scripts/run_harness.py record "
        f'--batch {args.batch} --run-id {run_meta["runId"]} --trace-file {saved.relative_to(ROOT)}'
    )
    return 0


def cmd_list(_: argparse.Namespace) -> int:
    batches = list_batch_files()
    if not batches:
        print(f"No batches in {RUNS_DIR.relative_to(ROOT)}/")
        return 0
    print("Recent batches:")
    for batch in batches[:10]:
        print(f"  {batch.relative_to(ROOT)}")
    print("\nUse: --batch latest")
    return 0


def cmd_status(args: argparse.Namespace) -> int:
    batch = load_batch(args.batch)
    counts: dict[str, int] = {}
    for run in batch["runs"]:
        counts[run["status"]] = counts.get(run["status"], 0) + 1
    print(f"Batch {batch['batchId']}")
    for status in ("pending", "passed", "failed", "blocked", "skipped"):
        if status in counts:
            print(f"  {status}: {counts[status]}")
    return 0


def build_parser() -> argparse.ArgumentParser:
    parser = argparse.ArgumentParser(description=__doc__)
    sub = parser.add_subparsers(dest="command", required=True)

    plan = sub.add_parser("plan", help="Create a run batch from scenarios.json")
    plan.add_argument("--phase", choices=["baseline", "hardened", "smoke"], default="baseline")
    plan.add_argument("--iterations", type=int, default=30)
    plan.add_argument("--tag", default="baseline", help="Filter scenarios by tag")
    plan.add_argument("--scenario", help="Run a single scenario id")
    plan.add_argument("--device", help="Target simulator UDID")
    plan.set_defaults(func=cmd_plan)

    nxt = sub.add_parser("next", help="Print the next pending run as JSON for MCP execution")
    nxt.add_argument("--batch", required=True, help="Batch JSON path, id, or 'latest'")
    nxt.set_defaults(func=cmd_next)

    record = sub.add_parser("record", help="Record apply_routine trace results for a run")
    record.add_argument("--batch", required=True, help="Batch JSON path, id, or 'latest'")
    record.add_argument("--run-id", required=True)
    record.add_argument("--trace-file", help="Trace JSON path, or omit to use default for run-id")
    record.add_argument("--device")
    record.add_argument("--recording")
    record.add_argument("--started-at")
    record.add_argument("--ended-at")
    record.add_argument("--status", choices=["passed", "failed", "blocked", "skipped"])
    record.add_argument("--notes", default="")
    record.set_defaults(func=cmd_record)

    status = sub.add_parser("status", help="Summarize batch progress")
    status.add_argument("--batch", required=True, help="Batch JSON path, id, or 'latest'")
    status.set_defaults(func=cmd_status)

    save_trace = sub.add_parser("save-trace", help="Save apply_routine JSON from stdin or --input-file")
    save_trace.add_argument("--batch", required=True, help="Batch JSON path, id, or 'latest'")
    save_trace.add_argument("--run-id", required=True)
    save_trace.add_argument("--input-file", help="Read trace JSON from file instead of stdin")
    save_trace.add_argument("--out", help="Override output path (default: devloop/artifacts/traces/<batch>/<run>.json)")
    save_trace.set_defaults(func=cmd_save_trace)

    listing = sub.add_parser("list", help="List recent batch files")
    listing.set_defaults(func=cmd_list)

    return parser


def main() -> int:
    parser = build_parser()
    args = parser.parse_args()
    return args.func(args)


if __name__ == "__main__":
    sys.exit(main())
