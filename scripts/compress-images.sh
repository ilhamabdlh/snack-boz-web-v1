#!/usr/bin/env bash
# Compress product/hero/poster images to WebP for faster web loading.
set -euo pipefail

ROOT="$(cd "$(dirname "$0")/.." && pwd)"
cd "$ROOT"

compress_dir() {
  local dir="$1"
  local max_w="$2"
  local q="$3"
  local count=0

  mkdir -p "$dir"

  while IFS= read -r -d '' file; do
    local base ext out
    base="${file%.*}"
    ext="${file##*.}"
    # Skip already-optimized tiny webp
    if [[ "$ext" == "webp" ]]; then
      continue
    fi
    out="${base}.webp"
    # Rebuild if missing or source newer
    if [[ -f "$out" && "$out" -nt "$file" ]]; then
      continue
    fi
    magick "$file" -auto-orient -resize "${max_w}x${max_w}>" -strip -quality "$q" "$out"
    count=$((count + 1))
    printf '  %s -> %s (%s)\n' "$(basename "$file")" "$(basename "$out")" "$(du -h "$out" | cut -f1)"
  done < <(find "$dir" -type f \( -iname '*.png' -o -iname '*.jpg' -o -iname '*.jpeg' \) -print0)

  echo "Compressed $count files in $dir (max ${max_w}px, q=${q})"
}

echo "== makanan =="
compress_dir "public/makanan" 900 78

echo "== hero =="
compress_dir "public/hero" 800 80

echo "== poster =="
compress_dir "public/poster" 1600 80

echo
echo "Before/after sizes:"
du -sh public/makanan public/hero public/poster
