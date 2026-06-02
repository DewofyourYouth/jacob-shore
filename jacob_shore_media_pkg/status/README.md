# Live status badge

The status line on jacob-shore.com ("Considering my options.", "Open to contract work", "Heads-down,
building.", …) is **transient — it changes all the time.** So it is *not* baked into the kit's banners or
avatars; those would go stale. Generate a fresh badge whenever you need one:

```
# from the kit root:
python tools/make_status_badge.py "Open to contract work"             # light pill (PNG)
python tools/make_status_badge.py "Heads-down, building." --dark      # dark pill
python tools/make_status_badge.py "Considering my options." --avatar  # pixel avatar + badge
```

Options: `--dark`, `--avatar`, `--out PATH`, `--size N`, `--color #RRGGBB`. Requires Pillow; uses the kit's
`fonts/JetBrainsMono.ttf` and `logo/png/jacob_pixel_full.png`.

`examples/` holds a few rendered samples. Keep the dot the brand green (`#37D592`) and the text in JetBrains
Mono; the wording is yours.
