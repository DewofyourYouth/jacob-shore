#!/usr/bin/env bash
set -euo pipefail

# Tailwind scans hugo_stats.json (@source), but Hugo writes that file *during*
# the build — so a single pass after a template change builds CSS from the
# previous class scan. Run twice: the first pass refreshes hugo_stats.json,
# the second builds the stylesheet from the up-to-date scan.
HUGO_BUILD_TAILWIND=1 hugo --minify >/dev/null
HUGO_BUILD_TAILWIND=1 hugo --minify >/dev/null

latest_css=$(ls -t public/assets/css/style.*.css | head -n 1)
mkdir -p static/css
cp "$latest_css" static/css/style.css

echo "Updated static/css/style.css from $latest_css"
