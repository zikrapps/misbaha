#!/usr/bin/env python3
"""Aggregate DevLoop run results into a benchmark report."""

from __future__ import annotations

import argparse
import json
import sys
from collections import Counter, defaultdict
from pathlib import Path

sys.path.insert(0, str(Path(__file__).resolve().parent))

from harness_lib import REPORTS_DIR, ROOT, load_batch, resolve_batch_path, utc_now


def load_run_results(batch: dict) -> list[dict]:
    results: list[dict] = []
    for run in batch["runs"]:
        path = Path(run["resultPath"])
        if not path.is_absolute():
            path = ROOT / path
        if not path.exists():
            continue
        results.append(json.loads(path.read_text()))
    return results


def summarize(batch_path: Path) -> dict:
    batch = load_batch(batch_path)
    results = load_run_results(batch)

    by_scenario: dict[str, Counter] = defaultdict(Counter)
    by_failure_type: Counter = Counter()
    by_routine: dict[str, Counter] = defaultdict(Counter)

    for result in results:
        scenario = result["scenario_id"]
        by_scenario[scenario][result["status"]] += 1
        for routine in result.get("routines", []):
            by_routine[routine["routine_id"]][routine["status"]] += 1
            if routine["status"] == "failed" and routine.get("failure_type"):
                by_failure_type[routine["failure_type"]] += 1

    total = len(batch["runs"])
    completed = len(results)
    passed = sum(1 for result in results if result["status"] == "passed")
    failed = sum(1 for result in results if result["status"] == "failed")

    return {
        "batchId": batch["batchId"],
        "phase": batch["phase"],
        "generatedAt": utc_now(),
        "gitCommit": batch.get("gitCommit"),
        "deviceUdid": batch.get("deviceUdid"),
        "totals": {
            "planned": total,
            "completed": completed,
            "pending": total - completed,
            "passed": passed,
            "failed": failed,
            "passRate": round(passed / completed, 4) if completed else 0.0,
        },
        "byScenario": {scenario: dict(counts) for scenario, counts in sorted(by_scenario.items())},
        "byRoutine": {routine: dict(counts) for routine, counts in sorted(by_routine.items())},
        "failureTypes": dict(by_failure_type),
    }


def render_markdown(report: dict) -> str:
    totals = report["totals"]
    lines = [
        f"# DevLoop benchmark — {report['batchId']}",
        "",
        f"- Phase: **{report['phase']}**",
        f"- Generated: {report['generatedAt']}",
        f"- Commit: `{report.get('gitCommit', 'unknown')[:12]}`",
        f"- Device: `{report.get('deviceUdid') or 'unset'}`",
        "",
        "## Totals",
        "",
        f"| Metric | Count |",
        f"|--------|------:|",
        f"| Planned | {totals['planned']} |",
        f"| Completed | {totals['completed']} |",
        f"| Passed | {totals['passed']} |",
        f"| Failed | {totals['failed']} |",
        f"| Pass rate | {totals['passRate']:.1%} |",
        "",
        "## By scenario",
        "",
        "| Scenario | passed | failed | skipped | blocked |",
        "|----------|-------:|-------:|--------:|--------:|",
    ]

    for scenario, counts in report["byScenario"].items():
        lines.append(
            f"| {scenario} | {counts.get('passed', 0)} | {counts.get('failed', 0)} | "
            f"{counts.get('skipped', 0)} | {counts.get('blocked', 0)} |"
        )

    if report["failureTypes"]:
        lines.extend(["", "## Failure types", ""])
        for failure_type, count in sorted(report["failureTypes"].items(), key=lambda item: -item[1]):
            lines.append(f"- `{failure_type}`: {count}")

    lines.append("")
    return "\n".join(lines)


def main() -> int:
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("--batch", required=True, help="Batch JSON path under devloop/runs/")
    parser.add_argument("--out", help="Optional report basename (default: batch id)")
    args = parser.parse_args()

    batch_path = resolve_batch_path(args.batch)
    report = summarize(batch_path)
    REPORTS_DIR.mkdir(parents=True, exist_ok=True)

    base = args.out or report["batchId"]
    json_path = REPORTS_DIR / f"{base}.json"
    md_path = REPORTS_DIR / f"{base}.md"
    json_path.write_text(json.dumps(report, indent=2) + "\n")
    md_path.write_text(render_markdown(report))

    print(f"Wrote {json_path.relative_to(batch_path.parents[2])}")
    print(f"Wrote {md_path.relative_to(batch_path.parents[2])}")
    print(f"Pass rate: {report['totals']['passRate']:.1%} ({report['totals']['passed']}/{report['totals']['completed']})")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
