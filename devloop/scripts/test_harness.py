import json
import tempfile
import unittest
from pathlib import Path

from harness_lib import aggregate_run_status, parse_apply_routine_trace, resolve_trace_path, save_batch
from summarize_runs import summarize


class HarnessTests(unittest.TestCase):
    def test_parse_optional_routine_failure_becomes_skipped(self) -> None:
        trace = {
            "routine_id": "dismiss_badge_if_present",
            "status": "failed",
            "failure_type": "element_not_found",
        }
        result = parse_apply_routine_trace(trace, optional=True)
        self.assertEqual(result.status, "skipped")

    def test_aggregate_run_status(self) -> None:
        passed = parse_apply_routine_trace({"routine_id": "a", "status": "passed"})
        failed = parse_apply_routine_trace({"routine_id": "b", "status": "failed"})
        self.assertEqual(aggregate_run_status([passed]), "passed")
        self.assertEqual(aggregate_run_status([passed, failed]), "failed")

    def test_summarize_batch(self) -> None:
        with tempfile.TemporaryDirectory() as tmp:
            root = Path(tmp)
            batch = {
                "batchId": "baseline-test",
                "phase": "baseline",
                "gitCommit": "abc123",
                "appBundleId": "com.zikrapps.misbaha",
                "runs": [
                    {
                        "runId": "scenario-home-001",
                        "scenarioId": "scenario-home",
                        "status": "pending",
                        "resultPath": "run.json",
                    }
                ],
            }
            batch_path = root / "batch.json"
            save_batch(batch_path, batch)
            (root / "run.json").write_text(
                json.dumps(
                    {
                        "scenario_id": "scenario-home",
                        "status": "passed",
                        "routines": [{"routine_id": "launch_and_dismiss_tutorial_new", "status": "passed"}],
                    }
                )
            )
            batch["runs"][0]["resultPath"] = str(root / "run.json")
            save_batch(batch_path, batch)

            report = summarize(batch_path)
            self.assertEqual(report["totals"]["passed"], 1)
            self.assertEqual(report["totals"]["passRate"], 1.0)

    def test_missing_trace_shows_helpful_error(self) -> None:
        with self.assertRaises(SystemExit) as ctx:
            resolve_trace_path("missing.json", batch_id="baseline-test", run_id="scenario-home-001")
        self.assertIn("Trace file not found", str(ctx.exception))


if __name__ == "__main__":
    unittest.main()
