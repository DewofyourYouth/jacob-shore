# Brand Kit Corrections

The media kit was generated *from* the redesigned site, so the **live site is the
source of truth**. These are the places where `BRAND_GUIDE.md` (and some assets)
describe things that don't match what's actually shipped on jacob-shore.com.
Hand this to hyperagent to reconcile the kit.

---

## 1. The mark's shape — circle, not rounded square

The guide says the on-site treatment is a **rounded square**, and the OG card +
`logo/rounded/` assets render a rounded square. But the **actual site shows the
avatar in a circle** — `rounded-full` with a thin ring + ring-offset.

**Fix:** either change the guide to "circle," or (for consistency) regenerate the
shareable assets (OG card, social avatars) as circles. As-is, clicking from the OG
card to the site changes the avatar shape.

## 2. Typography — body & mono differ

| Role | Guide says | Site actually uses |
|------|-----------|--------------------|
| Display / name / section heads | Fraunces | **Fraunces** ✅ |
| Body / taglines | Fraunces (text optical size) | **Newsreader** |
| Metadata / eyebrows / status / numbers | JetBrains Mono | **Spline Sans Mono** |

## 3. Accent color — not green

The guide makes green (`#37D592`) the functional accent for status *and links*. On
the site:

- Links / interactive accent = **petrol blue `#1f3a44`** (light) / **`#7d8fc0`** (dark);
  secondary indigo **`#2a3a5e`**.
- Green appears **only** as the small "available" status dot, and it's Tailwind
  **emerald-400 (~`#34d399`)**, not `#37D592`.

## 4. Dark mode is indigo, not ink

The guide says dark mode is an ink ground (`#141210`). The site's dark mode is a
**deep indigo / navy ground `#1a2238`** with softened-indigo accents.

## 5. Exact light-mode palette hexes

The guide's values are close but slightly off:

| Role | Guide | Actual (palette.css) |
|------|-------|----------------------|
| Paper (bg) | `#EFEBE2` | `#f7f4ee` |
| Ink (text) | `#141210` | `#111111` |
| Muted (metadata) | `#6F695C` | `#5f5a52` |

Full light scale: bg `#f7f4ee` / `#f1ece4` / `#e9e2d9` / `#ded6cc`,
text `#111111` / `#1a1a1a` / `#5f5a52` / `#7a7268`.

---

## What's already accurate ✅

The almanac register, numbered `01 / 02` sections, the *Index* of projects with
entry counts and category tags, mono metadata lines, the Fraunces nameplate,
sparing-green status, the pixel-art portrait, and the voice/positioning all match
the site well.
