# Jacob Shore — Media / Press Kit

Brand and press assets for **jacob-shore.com** — the personal hub and front door (Bio · Index · Hire Me) that
funnels to Dew of Your Youth, Daily Derja, and HAKI.

**Matched to the redesigned homepage:** a warm editorial *almanac* — heavy high-contrast serif (**Fraunces**)
for the name and section heads, **JetBrains Mono** for all the small metadata (eyebrows, status, categories,
entry numbers), warm paper, near-black ink, and a single bright **green** accent for "available" status. The
mark is a **pixel-art portrait** of Jacob, shown in a rounded square.

---

## What's inside

```
jacob_shore_media_package/
├── README.md
├── brand/
│   ├── BRAND_GUIDE.md      type system, palette, register, voice
│   ├── LOGO_USAGE.md       mark variants, clear space, sizing, status badge, do/don't, AI prompts
│   └── IMAGE_PROMPTS.md    pixel-portrait + editorial-card recipes
├── bio/
│   ├── bios.md             one-liner / short / medium / long (ready to paste)
│   └── fast_facts.md       press table: stack, languages, projects, links
├── logo/
│   ├── png/                primary pixel mark (soft, the site version), transparent, 64–1024 + full-res
│   ├── rounded/            rounded-square avatars (stone / ink)  ← primary, matches site
│   ├── circle/             circular avatars (alternate)
│   ├── pixel-crisp/         true 52×49 pixel reconstruction (hard-edged)
│   ├── svg/                vector of the crisp pixel mark (infinite scale, crispEdges)
│   └── lockups/            avatar + name + tagline (horizontal & stacked, light & dark)
├── headshots/              3 professional photos — full-res, web widths, square crops
├── app-icons/              favicon.ico, favicon-16/32/48/64, apple-touch-icon-180
├── social/                 avatars, Open Graph 1200×630, LinkedIn 1584×396, X header 1500×500
├── status/                 LIVE status badge — examples + how it's used (text is transient)
├── tools/                  make_status_badge.py — render the current status badge on demand
├── colors/                 palette swatch sheet
└── fonts/                  Fraunces (display + text + italic) + JetBrains Mono, with OFL licenses
```

## Live status (not baked in)

The site's status line ("Considering my options.", "Open to contract work", …) is **transient — it changes all
the time**, so it is deliberately kept out of the static banners and avatars (otherwise they'd go stale). To
render a current badge, run:

```
python tools/make_status_badge.py "Open to contract work"           # light pill
python tools/make_status_badge.py "Heads-down, building." --avatar  # pixel avatar + badge
```

See `status/examples/` for samples. The green dot is the brand accent; the words are yours to set.

## The mark, three forms

| Form | Files | Use it for |
|------|-------|-----------|
| **Soft pixel** (primary) | `logo/png/jacob_pixel_*.png`, `logo/rounded/*` | The site mark; avatars, headers, anywhere medium/large |
| **Crisp pixel** (true 52×49) | `logo/pixel-crisp/*`, `logo/svg/jacob_pixel_crisp.svg` | Tiny favicons, "8-bit" treatments, infinite scale |
| **In a rounded square** | `logo/rounded/jacob_rounded_<stone\|ink>_*` | The on-site avatar treatment (add a live status badge via `tools/`) |

## Quick start

- **Avatar?** `logo/rounded/jacob_rounded_stone_512.png` (matches the site). Need the status badge? `tools/make_status_badge.py`.
- **Favicon?** `app-icons/favicon.ico`.
- **Bio?** `bio/bios.md` — four lengths, ready to paste.
- **Fonts?** `fonts/` — Fraunces + JetBrains Mono (set the name in Fraunces Black, labels in JetBrains Mono).

## License & attribution

Pixel mark, headshots, and brand assets are © Jacob Shore — all rights reserved.
Bundled fonts (Fraunces, JetBrains Mono) ship under the SIL Open Font License; see `fonts/OFL-*.txt`.
