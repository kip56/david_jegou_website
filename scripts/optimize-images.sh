#!/usr/bin/env bash
set -euo pipefail

# Generate smaller variants from the largest WebP references tracked in Git.
# References are never overwritten. Existing variants are kept unless --force
# is supplied after replacing a reference image.
FORCE=false
if [[ "${1:-}" == "--force" && $# -eq 1 ]]; then
  FORCE=true
elif [[ $# -ne 0 ]]; then
  echo "Usage: bash scripts/optimize-images.sh [--force]" >&2
  exit 1
fi

CWEBP_BIN="${CWEBP_BIN:-cwebp}"
if ! command -v "$CWEBP_BIN" >/dev/null 2>&1; then
  echo 'Install cwebp or set CWEBP_BIN to its executable path.' >&2
  exit 1
fi

PROJECT_DIR="$(cd -- "$(dirname -- "${BASH_SOURCE[0]}")/.." && pwd)"
IMAGE_DIR="$PROJECT_DIR/assets/images/optimized"
REFERENCES=(pouls-2200 david-1122 sarah-756 nantes-1448 crach-1448 ploemel-1870 moebius-288)

# Check all references before generating any files.
for reference in "${REFERENCES[@]}"; do
  if [[ ! -f "$IMAGE_DIR/$reference.webp" ]]; then
    echo "Missing reference image: $IMAGE_DIR/$reference.webp" >&2
    exit 1
  fi
done

variants() {
  local name="$1" source_width="$2" mode="$3" width output
  local options=(-preset photo -q 82 -m 6 -sharp_yuv)
  shift 3
  if [[ "$mode" == "lossless" ]]; then
    options=(-lossless -m 6)
  fi
  for width in "$@"; do
    if (( width >= source_width )); then
      echo "Variant must be smaller than reference: $name-$width" >&2
      exit 1
    fi
    output="$IMAGE_DIR/$name-$width.webp"
    if [[ -f "$output" && "$FORCE" == false ]]; then
      continue
    fi
    "$CWEBP_BIN" -quiet "${options[@]}" -metadata icc -resize "$width" 0 \
      "$IMAGE_DIR/$name-$source_width.webp" -o "$output"
    echo "Generated $name-$width.webp"
  done
}

variants pouls 2200 photo 720 1120 1600
variants david 1122 photo 400 800
variants sarah 756 photo 400
variants nantes 1448 photo 480 960
variants crach 1448 photo 480 960
variants ploemel 1870 photo 640 1280
variants moebius 288 lossless 96 192

echo 'WebP variants ready. Reference images unchanged.'
