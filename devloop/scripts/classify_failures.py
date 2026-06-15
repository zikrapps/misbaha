#!/usr/bin/env python3
"""Auto-classify DevLoop run failures into the project failure taxonomy.

Reads the per-run result files of a batch and maps each failed routine to a
failure class using the routine's failure_type + failure_detail text. Prints a
class distribution, per-failure rows, and the classification coverage.

Classes mirror devloop/FAILURE_TAXONOMY.md:
  app_bug, test_design, agent_timing, state_drift, environment, oracle_weakness, unknown

Usage:
  python3 devloop/scripts/classify_failures.py --batch latest
  python3 devloop/scripts/classify_failures.py --batch baseline-20260615-032556 --json
"""

from __future__ import annotations

import argparse
import json
import re
import sys
from collections import Counter
from pathlib import Path

sys.path.insert(0, str(Path(__file__).resolve().parent))

from harness_lib import ROOT, load_batch, resolve_batch_path

# Ordered rules: first match wins. Each rule is (class, predicate).
# Predicates run against a lowercased "failure_type :: failure_detail" string.
RULES: list[tuple[str, re.Pattern]] = [
    # Acted before the app/screen had painted — the dominant timing flake.
    # Includes the "only the iOS status bar was visible" case (time / cellular /
    # battery chrome but no app content yet).
    ("agent_timing", re.compile(
        r"visible: 'misbaha'|splash|not.*render|screen_changed|before the screen"
        r"|cellular|battery|\b\d{1,2}:\d{2}\b"
    )),
    # Bridge / device / WDA / connection / build / tooling problems.
    ("environment", re.compile(r"connection|wda|webdriver|disconnect|execution_error|device-busy|timeout|downloading|metro|bundle id|port")),
    # Real app crash signatures.
    ("app_bug", re.compile(r"something went wrong|errorboundary|navigate before|root layout|crash")),
    # Stale selector / wrong target / out-of-date routine = test design.
    ("test_design", re.compile(r"out of date|update_routine|none of \[|element_not_found")),
]

LABELS = {
    "app_bug": "App bug",
    "test_design": "Test design bug",
    "agent_timing": "Agent / timing error",
    "environment": "Environment / infrastructure",
    "state_drift": "State drift",
    "oracle_weakness": "Weak check (oracle)",
    "unknown": "Unknown",
}


def classify(failure_type: str, failure_detail: str) -> str:
    blob = f"{failure_type or ''} :: {failure_detail or ''}".lower()
    for cls, pat in RULES:
        if pat.search(blob):
            return cls
    return "unknown"


def collect_failures(batch: dict) -> list[dict]:
    rows: list[dict] = []
    for run in batch["runs"]:
        path = Path(run["resultPath"])
        if not path.is_absolute():
            path = ROOT / path
        if not path.exists():
            continue
        result = json.loads(path.read_text())
        if result.get("status") != "failed":
            continue
        for routine in result.get("routines", []):
            if routine.get("status") != "failed":
                continue
            ftype = routine.get("failure_type", "")
            detail = routine.get("failure_detail", "")
            rows.append(
                {
                    "run_id": result.get("run_id"),
                    "scenario": result.get("scenario_id"),
                    "routine": routine.get("routine_id"),
                    "failure_type": ftype,
                    "failed_step": routine.get("failed_step"),
                    "klass": classify(ftype, detail),
                    "detail": (detail or "")[:120],
                }
            )
            break  # first failed routine defines the run's failure
    return rows


def main() -> int:
    ap = argparse.ArgumentParser(description=__doc__)
    ap.add_argument("--batch", required=True, help="batch id, path, or 'latest'")
    ap.add_argument("--json", action="store_true", help="emit JSON instead of a table")
    args = ap.parse_args()

    batch = load_batch(resolve_batch_path(args.batch))
    rows = collect_failures(batch)
    dist = Counter(r["klass"] for r in rows)
    classified = sum(v for k, v in dist.items() if k != "unknown")
    coverage = round(classified / len(rows), 4) if rows else 1.0

    if args.json:
        print(json.dumps({
            "batchId": batch["batchId"],
            "failures": len(rows),
            "distribution": {LABELS[k]: dist.get(k, 0) for k in LABELS},
            "classificationCoverage": coverage,
            "rows": rows,
        }, indent=2))
        return 0

    print(f"Batch: {batch['batchId']}")
    print(f"Failures: {len(rows)}    Classification coverage: {coverage*100:.1f}%\n")
    print("Class distribution:")
    for k in LABELS:
        if dist.get(k):
            print(f"  {LABELS[k]:<28} {dist[k]}")
    if rows:
        print("\nPer-failure:")
        print(f"  {'run':<22}{'class':<22}{'step':<6}detail")
        for r in rows:
            print(f"  {r['run_id']:<22}{LABELS[r['klass']]:<22}{str(r['failed_step'] or '-'):<6}{r['detail']}")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
