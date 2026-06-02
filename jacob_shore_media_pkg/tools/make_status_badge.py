#!/usr/bin/env python3
"""
make_status_badge.py — render Jacob Shore's LIVE status badge on demand.

The status line ("Considering my options.", "Open to contract work", "Heads-down, building.", …)
is a transient thing that changes all the time, so it is deliberately NOT baked into the kit's
static banners or avatars. Run this whenever you want a fresh badge with the current text.

Usage:
    python tools/make_status_badge.py "Open to contract work"
    python tools/make_status_badge.py "Heads-down, building." --dark
    python tools/make_status_badge.py "Considering my options." --avatar --out badge.png

Options:
    --dark          dark (ink) badge instead of light
    --avatar        composite the badge onto the rounded-square pixel avatar
    --out PATH      output file (default: status_badge.png)
    --size N        badge height in px (default 120); avatar size when --avatar (default 760)
    --color HEX     status dot color (default #37D592, the brand green)

Requires: Pillow  (pip install Pillow). Uses fonts/ and logo/ from this kit.
"""
from __future__ import annotations
import argparse, os
from PIL import Image, ImageDraw, ImageFont

KIT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
GREEN = "#37D592"; INK = (20, 18, 16); STONE = (228, 222, 209)

def _hex(h): h = h.lstrip("#"); return tuple(int(h[i:i+2], 16) for i in (0, 2, 4))

def _mono(sz, wght=500):
    f = ImageFont.truetype(os.path.join(KIT, "fonts", "JetBrainsMono.ttf"), int(sz))
    try: f.set_variation_by_axes([wght])
    except Exception: pass
    return f

def make_badge(text, dark=False, h=120, dot_hex=GREEN):
    f = _mono(int(h * 0.46), 500)
    d0 = ImageDraw.Draw(Image.new("RGB", (10, 10)))
    tw = d0.textlength(text, font=f)
    dot = int(h * 0.26); padx = int(h * 0.42); gap = int(h * 0.22)
    w = int(padx + dot + gap + tw + padx)
    img = Image.new("RGBA", (w, h), (0, 0, 0, 0)); d = ImageDraw.Draw(img)
    bg = (20, 18, 16, 255) if dark else (255, 255, 255, 235)
    bd = (90, 90, 86, 255) if dark else (120, 116, 108, 255)
    fg = (239, 239, 233) if dark else INK
    d.rounded_rectangle([0, 0, w - 1, h - 1], radius=h // 2, fill=bg, outline=bd, width=2)
    cy = h // 2
    d.ellipse([padx, cy - dot // 2, padx + dot, cy + dot // 2], fill=_hex(dot_hex) + (255,))
    d.text((padx + dot + gap, cy), text, font=f, fill=fg, anchor="lm")
    return img

def make_avatar(text, dark=False, size=760, dot_hex=GREEN):
    mark = Image.open(os.path.join(KIT, "logo", "png", "jacob_pixel_full.png")).convert("RGBA")
    bg = INK if dark else STONE; bd = (42, 38, 32) if dark else (207, 200, 184)
    r = int(size * 0.18); pad = int(size * 0.06)
    sq = Image.new("RGBA", (size, size), (0, 0, 0, 0)); d = ImageDraw.Draw(sq)
    d.rounded_rectangle([0, 0, size - 1, size - 1], radius=r, fill=bg + (255,))
    avail = int(size * (1 - 2 * 0.06)); sc = min(avail / mark.width, avail / mark.height)
    m = mark.resize((int(mark.width * sc), int(mark.height * sc)), Image.LANCZOS)
    mask = Image.new("L", (size, size), 0); ImageDraw.Draw(mask).rounded_rectangle([0, 0, size - 1, size - 1], radius=r, fill=255)
    layer = Image.new("RGBA", (size, size), (0, 0, 0, 0)); layer.alpha_composite(m, ((size - m.width) // 2, pad))
    layer.putalpha(Image.composite(layer.split()[3], Image.new("L", (size, size), 0), mask))
    sq.alpha_composite(layer)
    d.rounded_rectangle([1, 1, size - 2, size - 2], radius=r, outline=bd + (255,), width=max(2, size // 180))
    badge = make_badge(text, dark=dark, h=int(size * 0.135), dot_hex=dot_hex)
    canvas = Image.new("RGBA", (int(size * 1.18), int(size * 1.06)), (0, 0, 0, 0))
    canvas.alpha_composite(sq, (int(size * 0.16), int(size * 0.06)))
    canvas.alpha_composite(badge, (0, int(size * 0.02)))
    return canvas

def main():
    ap = argparse.ArgumentParser(description="Render Jacob Shore's live status badge.")
    ap.add_argument("text"); ap.add_argument("--dark", action="store_true")
    ap.add_argument("--avatar", action="store_true"); ap.add_argument("--out", default="status_badge.png")
    ap.add_argument("--size", type=int, default=None); ap.add_argument("--color", default=GREEN)
    a = ap.parse_args()
    if a.avatar:
        img = make_avatar(a.text, dark=a.dark, size=a.size or 760, dot_hex=a.color)
    else:
        img = make_badge(a.text, dark=a.dark, h=a.size or 120, dot_hex=a.color)
    img.save(a.out); print("wrote", a.out, img.size)

if __name__ == "__main__":
    main()
