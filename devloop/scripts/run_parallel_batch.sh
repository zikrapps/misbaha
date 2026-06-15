#!/usr/bin/env bash
# Run all 5 scenarios in parallel (~12–15 min wall clock vs ~60+ min sequential).
#
# Usage:
#   ./devloop/scripts/run_parallel_batch.sh plan
#   ./devloop/scripts/run_parallel_batch.sh run  BATCH_ID|latest
#   ./devloop/scripts/run_parallel_batch.sh status BATCH_ID|latest

set -euo pipefail

ROOT="$(cd "$(dirname "$0")/../.." && pwd)"
cd "$ROOT"

APP_PATH="${APP_PATH:-$(find ~/Library/Developer/Xcode/DerivedData/Misbaha-*/Build/Products/Debug-iphonesimulator/Misbaha.app -maxdepth 0 2>/dev/null | head -1)}"

# Restrict to 2 parallel simulators to avoid CPU contention (which inflates
# animation time past routine wait_for windows). Each device processes its
# scenario list sequentially, so at most 2 simulators are ever active.
declare -a DEVICES=(
  "FC897F5C-9579-49BC-AB4C-8288851663BF"
  "BE385E27-C49B-4F38-8BE0-8B89388019BC"
)
# Scenarios distributed across the 2 devices (one list per device).
declare -a GROUP_0=(scenario-home scenario-search scenario-lifecycle)
declare -a GROUP_1=(scenario-count scenario-goal)

# Routines are registered under the production bundle id; deep links resolve via
# the misbaha:// scheme regardless of the installed build's bundle id.
APP_BUNDLE="${APP_BUNDLE:-com.zikrapps.misbaha}"

cmd="${1:-}"
shift || true

install_app() {
  [[ -n "$APP_PATH" && -d "$APP_PATH" ]] || { echo "Set APP_PATH to Misbaha.app" >&2; exit 1; }
  echo "Installing $APP_PATH on ${#DEVICES[@]} simulators..."
  for udid in "${DEVICES[@]}"; do
    xcrun simctl boot "$udid" 2>/dev/null || true
    xcrun simctl install "$udid" "$APP_PATH" &
  done
  wait
  echo "Install complete."

  # Warm up the JS bundle: a fresh install downloads the Metro bundle on first
  # launch ("Downloading 100%…"), which can outlast a routine's settle window
  # and make the first run per device flake. Pre-launch once, let the bundle
  # download/compile, then terminate so every real run starts from a warm cache.
  echo "Warming up JS bundle on ${#DEVICES[@]} simulators..."
  for udid in "${DEVICES[@]}"; do
    xcrun simctl launch "$udid" "$APP_BUNDLE" >/dev/null 2>&1 || true
  done
  sleep "${WARMUP_SEC:-20}"
  for udid in "${DEVICES[@]}"; do
    xcrun simctl terminate "$udid" "$APP_BUNDLE" >/dev/null 2>&1 || true
  done
  echo "Warm-up complete."
}

# Run a device's scenario list sequentially on a single simulator.
device_worker() {
  local udid="$1" log_dir="$2" batch="$3"; shift 3
  local scenario log
  for scenario in "$@"; do
    log="$log_dir/${scenario}.log"
    echo "[$udid] $scenario → $log"
    PYTHONUNBUFFERED=1 python3 devloop/scripts/execute_batch_mcp.py \
      --batch "$batch" \
      --device "$udid" \
      --scenario "$scenario" \
      --app-bundle "$APP_BUNDLE" \
      "${RESET_FLAG:---strong-reset}" \
      >"$log" 2>&1 || echo "[$udid] $scenario worker exited non-zero" >&2
  done
}

case "$cmd" in
  plan)
    python3 devloop/scripts/run_harness.py plan --phase baseline --iterations 30 --tag baseline
    ;;
  run)
    BATCH="${1:-latest}"
    install_app
    LOG_DIR="$ROOT/devloop/artifacts/parallel-$(date +%Y%m%d-%H%M%S)"
    mkdir -p "$LOG_DIR"
    echo "Batch: $BATCH — logs in $LOG_DIR (2 parallel simulators)"
    stagger="${STAGGER_SEC:-45}"

    echo "Device 0 (${DEVICES[0]}): ${GROUP_0[*]}"
    device_worker "${DEVICES[0]}" "$LOG_DIR" "$BATCH" "${GROUP_0[@]}" &
    pid0=$!
    sleep "$stagger"
    echo "Device 1 (${DEVICES[1]}): ${GROUP_1[*]}"
    device_worker "${DEVICES[1]}" "$LOG_DIR" "$BATCH" "${GROUP_1[@]}" &
    pid1=$!

    echo "Waiting for 2 device workers..."
    failed=0
    wait "$pid0" || failed=$((failed + 1))
    wait "$pid1" || failed=$((failed + 1))

    python3 devloop/scripts/run_harness.py status --batch "$BATCH"
    python3 devloop/scripts/summarize_runs.py --batch "$BATCH"
    exit "$failed"
    ;;
  status)
    python3 devloop/scripts/run_harness.py status --batch "${1:-latest}"
    ;;
  *)
    echo "Usage: $0 plan | run BATCH | status BATCH" >&2
    exit 1
    ;;
esac
