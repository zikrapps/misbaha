#!/usr/bin/env python3
"""Print record_routine / update_routine payloads from devloop/configs/routines/*.json.

DevLoop routines are uploaded via QualGent MCP (record_routine, update_routine),
not a file-import button in the desktop UI. From Cursor, ask the agent to import
routines, or call MCP tools manually with the JSON emitted here.

Usage:
  python3 devloop/scripts/import_routines.py
  python3 devloop/scripts/import_routines.py launch_and_dismiss_tutorial
"""

from __future__ import annotations

import json
import sys
from pathlib import Path

ROOT = Path(__file__).resolve().parents[2]
ROUTINES_DIR = ROOT / "devloop" / "configs" / "routines"
MANIFEST = ROUTINES_DIR / "manifest.json"
APP_BUNDLE_ID = "com.zikrapps.misbaha"
OS = "ios"


def load_routine(path: Path) -> dict:
    data = json.loads(path.read_text())
    steps = json.dumps(data["steps"], separators=(",", ":"))
    return {
        "routine_id": data["routine_id"],
        "app_bundle_id": APP_BUNDLE_ID,
        "os": OS,
        "name": data["name"],
        "steps": steps,
        "description": data.get("description", ""),
        "trigger_hints": data.get("trigger_hints", ""),
        "params": data.get("params", ""),
        "reason": data.get("reason", "Imported from devloop/configs/routines"),
    }


def main() -> None:
    manifest = json.loads(MANIFEST.read_text())
    names = manifest["routines"]
    if len(sys.argv) > 1:
        wanted = sys.argv[1]
        if not wanted.endswith(".json"):
            wanted = f"{wanted}.json"
        names = [n for n in names if n == wanted]
        if not names:
            raise SystemExit(f"Routine not in manifest: {sys.argv[1]}")

    for filename in names:
        payload = load_routine(ROUTINES_DIR / filename)
        print(f"\n=== {payload['routine_id']} ===")
        print(json.dumps(payload, indent=2))


if __name__ == "__main__":
    main()
