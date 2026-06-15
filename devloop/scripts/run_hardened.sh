#!/usr/bin/env bash
# DevLoop hardened runner — convenience wrapper around run_baseline.sh.
#
# The harness is phase-agnostic; "hardened" runs use the same scenarios as the
# baseline but on the hardened setup (app fixes + routine hardening + readiness
# poll, single-sim sequential). This wrapper just defaults the phase/tag to
# "hardened" so artifacts are named distinctly from the baseline.
#
# Examples:
#   ./devloop/scripts/run_hardened.sh plan --iterations 30 --device <UDID>
#   ./devloop/scripts/run_hardened.sh summarize latest
#
# All other subcommands (list, next, status, summarize) pass straight through.

set -euo pipefail

ROOT="$(cd "$(dirname "$0")/../.." && pwd)"
BASE="$ROOT/devloop/scripts/run_baseline.sh"

cmd="${1:-}"
shift || true

case "$cmd" in
  plan)
    # Inject hardened defaults unless the caller already set them.
    args=("$@")
    [[ " ${args[*]} " == *" --phase "* ]] || args+=(--phase hardened)
    [[ " ${args[*]} " == *" --tag "*   ]] || args+=(--tag hardened)
    exec "$BASE" plan "${args[@]}"
    ;;
  list|next|status|summarize)
    exec "$BASE" "$cmd" "$@"
    ;;
  ""|help|-h|--help)
    cat <<'EOF'
Usage:
  run_hardened.sh plan [--iterations N] [--scenario ID] [--device UDID]
  run_hardened.sh list
  run_hardened.sh next  BATCH_JSON|latest
  run_hardened.sh status BATCH_JSON|latest
  run_hardened.sh summarize BATCH_JSON|latest

Defaults: --phase hardened --tag hardened (override by passing your own).
EOF
    ;;
  *)
    echo "Unknown command: $cmd" >&2
    exit 1
    ;;
esac
