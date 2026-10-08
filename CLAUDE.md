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
- **Latest feeds** share one fetch/normalise partial, `layouts/_partials/latest/items.html`
  (called via `partialCached`). The RSS outputs (`/index.xml`, `/latest/index.xml`) both
  render `layouts/_partials/latest/rss.xml`, which is the source for Brevo RSS campaigns:
  every item has an absolute image in `<enclosure>` (Brevo's `{{ item.ENCLOSURE }}`),
  `<media:content>`, and `<content:encoded>`, falling back to the feed's `fallback_image`
  or the site OG image. `caches.getresource.maxAge: 0` keeps rebuilds from using stale feeds.
  The home page's `params.now` status is also emitted as a feed item dated
  `params.now_updated` — bump that date whenever `now` changes, or Brevo won't treat
  it as new.
- **Auto-rebuild on new posts:** the Dew of Your Youth (`dew-blog`) and Daily Derja repos'
  GitHub Actions detect new permalinks in their `index.json` and POST to this site's
  Cloudflare Pages deploy hook (secret `JACOB_SHORE_DEPLOY_HOOK` in those repos).
- **Mailing-list signup** (`layouts/_partials/subscribe-form.html`, `{{< subscribe >}}`
  shortcode, `static/js/subscribe.js` → `functions/api/subscribe.js`): Turnstile, then
  adds the contact to Brevo. Env vars: `BREVO_API_KEY`, `BREVO_LIST_IDS` (comma-separated
  allowlist; first is the default), optional `BREVO_DOI_TEMPLATE_ID` /
  `BREVO_DOI_REDIRECT_URL` for double opt-in. Copy and optional per-topic lists live
  under `params.newsletter` in `hugo.yaml`. Pages: `/subscribe/`, `/subscribed/`.
- **GA4 events** (`static/js/track.js`, loaded site-wide from `include/head_end.html`):
  use `window.siteTrack(name, params)` or add `data-track="event"` plus
  `data-track-<param>` attributes to any clickable element; front matter
  `track_event: name` fires an event on page load. Events in use: `cta_click`,
  `select_content` (projects, Latest posts), `subscribe_view/start/error`, `sign_up`,
  `subscribe_confirmed`, `contact_start/error`, `generate_lead`. Plain `hugo server`
  doesn't load GA, so the helper does nothing locally.
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
