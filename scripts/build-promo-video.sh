#!/usr/bin/env bash
# Builds the 75-second Misbaha promo video. Set NARRATOR=A|B|C (default A).
set -euo pipefail
exec python3 "$(dirname "$0")/build-promo-video.py"
