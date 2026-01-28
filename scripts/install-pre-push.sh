#!/usr/bin/env bash
set -euo pipefail

hook_path=".git/hooks/pre-push"
cat <<'HOOK' > "$hook_path"
#!/usr/bin/env bash
set -euo pipefail

repo_root=$(git rev-parse --show-toplevel)
"$repo_root/scripts/build_css.sh"

git add "$repo_root/static/css/style.css"
HOOK

chmod +x "$hook_path"

echo "Installed pre-push hook at $hook_path"
