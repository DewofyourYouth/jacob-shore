#!/usr/bin/env bash
set -euo pipefail

HUGO_BUILD_TAILWIND=1 hugo --minify >/dev/null

latest_css=$(ls -t public/assets/css/style.*.css | head -n 1)
mkdir -p static/css
cp "$latest_css" static/css/style.css

echo "Updated static/css/style.css from $latest_css"
