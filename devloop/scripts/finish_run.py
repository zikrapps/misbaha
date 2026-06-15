#!/usr/bin/env python3
"""Save multi-routine trace and record a harness run in one step."""

from __future__ import annotations

import argparse
import json
import sys
from pathlib import Path

sys.path.insert(0, str(Path(__file__).resolve().parent))

from harness_lib import ROOT, load_batch, resolve_batch_path, save_trace_payload


def main() -> int:
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("--batch", required=True)
    parser.add_argument("--run-id", required=True)
    parser.add_argument("--traces", required=True, help="JSON file with { routines: [...] }")
    parser.add_argument("--recording")
    args = parser.parse_args()

    batch = load_batch(args.batch)
    batch_path = resolve_batch_path(args.batch)
    run_meta = next((run for run in batch["runs"] if run["runId"] == args.run_id), None)
    if not run_meta:
        raise SystemExit(f"Unknown run id: {args.run_id}")

    traces = json.loads(Path(args.traces).read_text())
    if isinstance(traces, list):
        payload = {"routines": traces}
    elif "routines" in traces:
        payload = traces
    else:
        payload = {"routines": [traces]}

    trace_path = ROOT / "devloop" / "artifacts" / "traces" / batch["batchId"] / f"{args.run_id}.json"
    save_trace_payload(trace_path, payload)

    record_cmd = [
        sys.executable,
        str(Path(__file__).resolve().parent / "run_harness.py"),
        "record",
        "--batch",
        str(batch_path.relative_to(ROOT)),
        "--run-id",
        args.run_id,
        "--trace-file",
        str(trace_path.relative_to(ROOT)),
    ]
    if args.recording:
        record_cmd.extend(["--recording", args.recording])

    import subprocess

    result = subprocess.run(record_cmd, cwd=ROOT)
    return result.returncode


if __name__ == "__main__":
    raise SystemExit(main())
