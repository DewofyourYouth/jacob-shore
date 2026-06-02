# Jacob Shore — Logo & Headshot Usage

## 1. Which file do I use?

| Situation | File |
|-----------|------|
| Avatar (the on-site look) | `logo/rounded/jacob_rounded_stone_<size>.png` |
| Avatar with status badge | generate it live → `tools/make_status_badge.py "…" --avatar` (see `status/examples/`) |
| Avatar on a dark surface | `logo/rounded/jacob_rounded_ink_<size>.png` |
| Circular avatar (alternate) | `logo/circle/jacob_circle_cream_<size>.png` |
| Mark on its own, transparent | `logo/png/jacob_pixel_<size>.png` (or `_full.png` for max res) |
| Tiny / favicon / "8-bit" | `logo/pixel-crisp/*` or `logo/svg/jacob_pixel_crisp.svg` |
| Infinite scale / print | `logo/svg/jacob_pixel_crisp.svg` (true vector, `crispEdges`) |
| Favicon / app icon | `app-icons/favicon.ico` · `app-icons/apple-touch-icon-180.png` |
| Name + tagline lockup | `logo/lockups/jacob_lockup_<horizontal\|stacked>_<light\|dark>.png` |
| Press / About photo | `headshots/jacob_<studio_formal\|navy_studio\|casual>_*` |

## 2. Soft vs. crisp pixel

- **Soft** (`logo/png/`, `logo/rounded/`, `logo/circle/`) is the site version — antialiased, more facial detail.
  Use at medium/large sizes; scale with smooth (Lanczos/bicubic) resampling.
- **Crisp** (`logo/pixel-crisp/`, `logo/svg/`) is a true 52×49, 23-color reconstruction. Stays sharp at any size;
  ideal for favicons and blocky/retro contexts. Scale with **nearest-neighbor** (the SVG uses `crispEdges`).

## 3. The status badge — it's *live*, don't bake it in

The mark can carry a monospace pill — a green dot (`#37D592`) + JetBrains Mono text like "Considering my
options." But that status is **transient — it changes all the time** — so it must **never** be baked into static,
shareable assets (the OG image, profile banners, an avatar file you upload once). Those would go stale the moment
your status changes. That's why the banners and avatars in this kit are status-free, and green appears only as a
stable accent (e.g. the URL).

When you actually want a badge, render it fresh:

```
python tools/make_status_badge.py "Open to contract work"            # standalone light pill
python tools/make_status_badge.py "Heads-down, building." --dark     # dark pill
python tools/make_status_badge.py "Considering my options." --avatar # pixel avatar + badge
```

Keep the dot green and the text in JetBrains Mono; the wording is yours. Samples live in `status/examples/`.

## 4. Clear space, size, background

- **Clear space:** ≥ 10% of the mark's width on all sides; in the rounded square, the figure fills with a small inset.
- **Minimum size:** rounded avatar ≥ 40 px; below that use `favicon-16/32` or the crisp pixel files.
- **Background:** Paper/Stone or white at home; on dark use the `ink` rounded avatar. Keep the field calm — no
  busy photos behind the mark.

## 5. The kippah rule (non-negotiable)

Jacob **always** wears a **black kippah** — never recolor it. If you generate or edit any version of the mark,
specify "black kippah" and exclude colored kippot; trust this over any photo where lighting distorts the color.

## 6. Misuse — don't

- Don't recolor the kippah, skin, or shirt off-brand; don't tint the whole mark green.
- Don't re-illustrate the face in another style and call it the same mark.
- Don't add shadows/gradients/glows/3D to the pixel art.
- Don't stretch or squash; keep the aspect ratio.
- Don't upscale the **soft** mark with nearest-neighbor, or the **crisp** mark with blur.

## 7. Headshots

`studio_formal` (warm studio — default for press), `navy_studio` (deep navy, editorial), `casual` (relaxed,
friendly). Each ships full-res, 1024/512 web widths, and 800/400 square crops. Crop square for photo avatars.

## 8. Prompts for handling the logo (AI)

Edit from the real assets (`inputImages`); always keep the **black kippah**. Never let a model invent the face.

**New pixel avatar from a photo** (pass a headshot):
> "Convert this photo into a clean pixel-art avatar in the reference style: ~50×50 pixel grid, ~24 flat colors,
> bold dark outline, **black kippah**, navy shirt, transparent background, head-and-shoulders, friendly neutral
> expression. Hard pixels, no anti-aliasing."

**Rounded-square avatar** (pass `logo/png/jacob_pixel_full.png`):
> "Place this exact pixel portrait in a rounded-square card on warm Stone `#E4DED1` with a thin border. Don't
> redraw the face." — for the live status pill on top, don't prompt it; run `tools/make_status_badge.py --avatar`.

**Editorial card / quote** (set real type yourself):
> "A warm cream `#EFEBE2` card, lots of space. A heavy high-contrast serif headline area in near-black, a single
> mint-green accent dot, small monospace labels. Almanac feel — numbered, precise, bookish. Leave room for text."

> **Rule of thumb:** the *face and the black kippah* are fixed; only *size, crop, background, finish, and status
> wording* vary. For anything tiny or scalable, use the crisp PNG or the SVG.
