# Jacob Shore — Image Generation Prompts

Practical recipes for **pixel portraits**, **editorial cards**, and **avatars** that match the redesigned site.
Works with GPT Image 2 / Nano Banana.

> **Likeness rules (always):** late-30s/early-40s, brown hair (grey at temples), trimmed dark beard with grey,
> light-Mediterranean skin, **black kippah always** (never colored). For photoreal output, pass a real headshot
> from `headshots/` as `inputImages`; for pixel output, pass the pixel mark. Never let a model invent the face.

> **System cheat-sheet:** Paper `#EFEBE2` · Stone `#E4DED1` · Ink `#141210` · Accent Green `#37D592` ·
> Display = **Fraunces** Black · Labels = **JetBrains Mono** (tracked caps). Set real type yourself with the
> bundled fonts — don't ask the model to render legible copy.

---

## 1. Pixel-portrait style (the mark)

**New pixel avatar from a photo** (pass the photo as `inputImages`):
```
Convert this photo into a clean pixel-art avatar like a retro game sprite: ~50×50 pixel grid, about 24 flat
colors, bold dark outline, head-and-shoulders, friendly neutral expression. Black kippah, navy shirt (#082868),
transparent background. Hard pixels, no anti-aliasing, no gradients.
Negative: photorealism, smooth shading, colored kippah, watermark, text.
```
For production-clean output, snap to a true grid + quantize (how `logo/pixel-crisp/` was made): downsample to
the grid, median-cut to ~24 colors, re-upscale nearest-neighbor.

## 2. Editorial / almanac cards

The look is warm paper, heavy serif, monospace labels, one green dot. Generate the *field*, set the *text* yourself.

**Quote / announcement (1:1 or 4:5):**
```
A warm cream (#EFEBE2) editorial card with generous margins and an "almanac" feel — a faint section number and
a thin hairline rule, small monospace labels in warm grey. Leave a large clear area for a heavy serif headline
and a single mint-green (#37D592) status dot. Calm, bookish, precise.
Negative: busy backgrounds, neon fills, 3D, stock-photo gloss, watermark.
```

**Availability / hire banner (16:9):**
```
A confident, quiet banner. Option A: warm paper (#EFEBE2). Option B: ink ground (#141210) with paper text.
A rounded-square pixel avatar (black kippah, navy shirt) to one side, a thin border. Space for a heavy serif
name and a monospace eyebrow + a green status dot. No icons, no glow.
```
> Then overlay text with the bundled fonts: name in **Fraunces** (Optical Size ~144, Weight 900), the eyebrow
> in **JetBrains Mono** (tracked uppercase). Italic Fraunces for an emphasized word. Keep the **live status** off
> static banners — it changes; render it separately with `tools/make_status_badge.py` when you need it.

## 3. Photoreal scenes (Mode B — pass a headshot)

For "working" imagery (desk, teaching, speaking), pass `headshots/jacob_studio_formal_full.jpg` and describe the
scene. Keep it documentary, not corporate-stock. Arabic-language settings belong in Ramle / Jerusalem / transit
— never Beit Shemesh.

## 4. Aspect-ratio map

| Use | Ratio |
|-----|-------|
| Avatar | 1:1 |
| LinkedIn single image | 4:5 |
| Open Graph / link preview | 1200×630 |
| LinkedIn banner | 1584×396 |
| X / Twitter header | 1500×500 |
| Stories / Reels | 9:16 |

## 5. Keep it quiet

The brand wins by restraint and that one pairing — bookish Fraunces over engineer's JetBrains Mono, on warm
paper, with a single green dot. When a card feels "designed," strip something out. The person is the brand.
