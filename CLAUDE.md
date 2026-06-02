# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## What this is

The personal site at https://jacob-shore.com — a Hugo static site themed with the
**neso** theme (vendored as a git submodule at `themes/neso`). It is deployed on
Cloudflare Pages, which also runs the contact-form serverless function in `functions/`.

## Commands

```bash
# Local dev server (uses the prebuilt static/css/style.css, no Tailwind rebuild)
hugo server

# Build the site (default; consumes prebuilt CSS)
hugo --minify

# Rebuild Tailwind CSS and refresh static/css/style.css — run after changing
# any markup classes or assets/css/. Requires Hugo extended.
./scripts/build_css.sh

# Regenerate data/projects_enriched.json from data/projects.yaml (fetches OG/Twitter
# meta for each project URL). Standalone Python 3, no dependencies.
python3 scripts/prebuild_fetch_project_meta.py

# Install the pre-push git hook (rebuilds CSS and stages static/css/style.css on push)
./scripts/install-pre-push.sh
```

Requires **Hugo extended** (currently v0.161.1+extended) — the Tailwind build uses
the embedded `css.TailwindCSS` pipe. There is no test suite.

## CSS build model (important)

CSS is built in two modes, gated by the `HUGO_BUILD_TAILWIND` env var in
`layouts/_partials/head/css.html`:

- **Default (unset):** the page links a static, committed `/css/style.css`. This is
  what `hugo server` and normal builds use, so Tailwind does **not** rebuild on every
  edit.
- **`HUGO_BUILD_TAILWIND=1`:** Hugo runs the full Tailwind pipeline on `assets/css/`,
  emitting fingerprinted `style.css` (and a `style-nojs.css` `<noscript>` variant).

Because of this split, **changing Tailwind classes in templates has no visible effect
until you run `./scripts/build_css.sh`**, which builds with the flag set, copies the
fingerprinted output back to `static/css/style.css`, and commits it. The pre-push hook
automates this so the deployed CSS stays in sync. Tailwind/PostCSS config and the CSS
entrypoints live inside the theme submodule, not the repo root.

## Architecture

- **Content** (`content/`): a single-page-style home (`_index.md` + `layouts/home.html`)
  plus standalone pages — `bio/`, `hire.md`, `job-tracker/`, and `latest/`.
- **Projects** are data-driven from `data/projects.yaml` and rendered by `home.html`
  via `site.Data.projects`. To add a project, edit the YAML — do not hardcode it in
  templates.
- **Latest feed aggregator** (`layouts/latest/list.html`): at build time, fetches
  JSON feeds from Jacob's other sites (Dew of Your Youth, Daily Derja, Türk Defter)
  listed under `params.feeds.latest` in `hugo.yaml`, using `resources.GetRemote`.
  Those remote URLs are also allowlisted under `security.http.urls` in `hugo.yaml` —
  **adding a new feed requires adding its URL there too**, or the fetch is blocked.
- **Contact form** (`layouts/_shortcodes/contact-form.html` →
  `functions/api/contact.js`): a Cloudflare Pages Function. It verifies a Cloudflare
  Turnstile CAPTCHA, then sends mail via the Resend API. It depends on the env vars
  `TURNSTILE_SECRET_KEY`, `RESEND_API_KEY`, and `CONTACT_EMAIL` (set in the Cloudflare
  dashboard, not in the repo). The public Turnstile site key lives in
  `params.turnstile.site_key` in `hugo.yaml`.

## Conventions

- `layouts/**/*.html` and `themes/**/*.html` are excluded from Prettier
  (`.prettierignore`) — don't reformat Hugo templates with it.
- The neso theme is a submodule; treat theme files as upstream/vendored. Override by
  shadowing files in the repo's own `layouts/` rather than editing `themes/neso/`.
