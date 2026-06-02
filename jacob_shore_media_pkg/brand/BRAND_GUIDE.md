# Jacob Shore — Brand Guide

A personal hub built like a **warm editorial almanac** — a ledger someone actually keeps. The job of the brand
is to read like *him*: a writer's heavy bookish serif over an engineer's monospace metadata, on warm paper.
This guide matches the redesigned jacob-shore.com homepage.

## 1. The mark

A **pixel-art portrait of Jacob** — black kippah, beard, navy shirt. Shown in a **rounded square** (the on-site
treatment). The site also shows a small monospace **status badge** (e.g. "● Considering my options.") — but that
is a **live, transient status**, rendered on demand (`tools/make_status_badge.py`), never baked into shared assets.

The **black kippah is canonical** — never render it any other color (see `LOGO_USAGE.md`).

## 2. Type system

The pairing *is* the identity — a high-contrast display serif against a monospace. Both are bundled (OFL).

| Role | Typeface | Setting |
|------|----------|---------|
| Name / section heads | **Fraunces** — Black, high optical size | Large, tight, characterful; stacked or single-line |
| Body / taglines | **Fraunces** — Regular + *Italic*, text optical size | Readable; italic for emphasis ("*small but stubborn*") |
| Metadata / eyebrows / status / categories / numbers | **JetBrains Mono** — Medium | UPPERCASE, letter-tracked ~0.14em for eyebrows; sentence case for status |

Fraunces is variable (Optical Size 9–144 · Weight 100–900 · Softness · Wonky) — use high opsz + weight 900 for
display, ~12–24 opsz + weight ~400 for text. JetBrains Mono carries all the "dev-journal" labels.

## 3. Color palette

| Role | Name | HEX | Notes |
|------|------|-----|-------|
| Background | Paper | `#EFEBE2` | Warm cream; the canvas |
| Surface | Stone | `#E4DED1` | Cards, the avatar's rounded square |
| Text | Ink | `#141210` | Near-black, warm |
| Secondary | Muted | `#6F695C` | Metadata, taglines, rules |
| Accent | Green | `#37D592` | The "available" status — bright mint; use *small* (dots, status, links) |
| In the mark | Avatar Navy | `#082868` | The portrait's shirt; not a UI color |

Mostly monochrome (paper + ink) with green as the single functional pop. **Dark mode:** flip to an ink ground
(`#141210`) with paper text and the same green accent (see the X-header banner).

## 4. Visual register

Editorial **almanac**: numbered sections (01 / 02), an *Index* of projects with entry counts and category tags,
mono metadata lines (`⌖ Bet Shemesh, Israel`, `6 ENTRIES`), generous warm space, and the heavy serif carrying
the headings. It should feel hand-kept and precise — bookish and engineered at once.

## 5. Voice

Thoughtful, self-deprecating, intellectually serious; allergic to hype and corporate-speak. Concrete over
clever. Comfortable dropping Hebrew/Yiddish/Arabic in-line. The throughline is the **rare triangle** — Rabbi ×
backend/AI Engineer × working Polyglot — and the type system is that triangle made visible. Status copy is plain
and a little wry ("Considering my options.").

## 6. Positioning

The **hub** in a hub-and-spoke portfolio: introduces the person and funnels to the spokes — **Dew of Your Youth**
(long-form blog), **Daily Derja** (Levantine Arabic), **HAKI** (the game), plus side projects (Job Tracker AI,
Türk Defter). Tagline: *"Software engineer, language learner, and builder of small but stubborn projects."*

## 7. Do / Don't

**Do** keep the mark in a rounded square, set the name in Fraunces Black, run metadata in JetBrains Mono, lean on
paper + ink with green used sparingly.
**Don't** recolor the kippah, swap the serif for something generic, use green as a large fill, add gradients/3D
to the pixel art, or crowd the layout — the almanac breathes.
