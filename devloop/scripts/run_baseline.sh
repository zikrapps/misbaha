#!/usr/bin/env bash
# DevLoop baseline runner — plan batches, inspect progress, summarize results.
#
# Examples:
#   ./devloop/scripts/run_baseline.sh plan --iterations 30 --tag baseline
#   ./devloop/scripts/run_baseline.sh next  devloop/runs/baseline-20260614-120000.json
#   ./devloop/scripts/run_baseline.sh status devloop/runs/baseline-20260614-120000.json
#   ./devloop/scripts/run_baseline.sh summarize devloop/runs/baseline-20260614-120000.json
#
# Execute runs via DevLoop MCP (Cursor agent):
#   1. qg_acquire_device(udid)
#   2. For each routine in `next` output: apply_routine(...)
#   3. qg_release_device()
#   4. run_harness.py record --batch ... --run-id ... --trace-file traces.json

set -euo pipefail

ROOT="$(cd "$(dirname "$0")/../.." && pwd)"
cd "$ROOT"
SCRIPTS="$ROOT/devloop/scripts"

usage() {
  cat <<'EOF'
Usage:
  run_baseline.sh plan [--iterations N] [--tag TAG] [--scenario ID] [--device UDID] [--phase baseline|hardened|smoke]
  run_baseline.sh list
  run_baseline.sh next  BATCH_JSON|latest
  run_baseline.sh status BATCH_JSON|latest
  run_baseline.sh summarize BATCH_JSON|latest
  run_baseline.sh smoke [--device UDID]
EOF
}

cmd="${1:-}"
shift || true

case "$cmd" in
  plan)
    python3 "$SCRIPTS/run_harness.py" plan "$@"
    ;;
  list)
    python3 "$SCRIPTS/run_harness.py" list
    ;;
  next)
    [[ $# -eq 1 ]] || { echo "Expected: run_baseline.sh next BATCH_JSON|latest" >&2; exit 1; }
    python3 "$SCRIPTS/run_harness.py" next --batch "$1"
    ;;
  status)
    [[ $# -eq 1 ]] || { echo "Expected: run_baseline.sh status BATCH_JSON|latest" >&2; exit 1; }
    python3 "$SCRIPTS/run_harness.py" status --batch "$1"
    ;;
  summarize)
    [[ $# -eq 1 ]] || { echo "Expected: run_baseline.sh summarize BATCH_JSON|latest" >&2; exit 1; }
    python3 "$SCRIPTS/summarize_runs.py" --batch "$1"
    ;;
  smoke)
    device=""
    while [[ $# -gt 0 ]]; do
      case "$1" in
        --device) device="$2"; shift 2 ;;
        *) echo "Unknown smoke arg: $1" >&2; exit 1 ;;
      esac
    done
    args=(plan --phase smoke --iterations 1 --tag smoke)
    [[ -n "$device" ]] && args+=(--device "$device")
    python3 "$SCRIPTS/run_harness.py" "${args[@]}"
    ;;
  ""|help|-h|--help)
    usage
    ;;
  *)
    echo "Unknown command: $cmd" >&2
    usage
    exit 1
    ;;
esac
