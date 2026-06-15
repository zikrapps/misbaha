#!/usr/bin/env python3
"""Record a harness run from a single MCP apply_routine JSON response on stdin."""

from __future__ import annotations

import argparse
import json
import sys
import tempfile
from pathlib import Path

sys.path.insert(0, str(Path(__file__).resolve().parent))

from finish_run import main as finish_main


def main() -> int:
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("--batch", required=True)
    parser.add_argument("--run-id", required=True)
    args = parser.parse_args()

    trace = json.load(sys.stdin)
    with tempfile.NamedTemporaryFile("w", suffix=".json", delete=False) as tmp:
        json.dump({"routines": [trace]}, tmp)
        tmp_path = tmp.name

    argv = ["finish_run.py", "--batch", args.batch, "--run-id", args.run_id, "--traces", tmp_path]
    old_argv = sys.argv
    try:
        sys.argv = argv
        return finish_main()
    finally:
        sys.argv = old_argv
        Path(tmp_path).unlink(missing_ok=True)


if __name__ == "__main__":
    raise SystemExit(main())
