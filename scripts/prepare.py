#!/usr/bin/env python3
"""One-off inputs for the header: font subsets and the portrait's luminance grid.

Run only when a font, the portrait or the character set changes:

    python3 scripts/prepare.py      # wants: fonttools, brotli, Pillow

Writes assets/src/_fonts.json and assets/src/_portrait.json, both committed,
which scripts/generate-assets.mjs reads with zero dependencies.

Fonts are the site's own: Hanken Grotesk (language) and IBM Plex Mono
(measurement) from @fontsource via jsdelivr, cut to ASCII; Anek Kannada is the
site's committed name cut, copied verbatim from meetguns.com's repo (fonts/).
Webfonts cannot be fetched from inside an <img>-loaded SVG, so they are
embedded as data URIs instead.

The portrait grid is the same sample the site takes in Portrait.tsx: a square
cover-crop biased 20% up, 56x56, luminance auto-levelled across the opaque
cells only. Transparent cells are -1.
"""
import base64, io, json, sys, urllib.request
from pathlib import Path

try:
    from fontTools import subset
    from fontTools.ttLib import TTFont
    from PIL import Image
except ImportError:
    sys.exit("needs: pip install 'fonttools[woff]' brotli Pillow")

SRC = Path(__file__).resolve().parent.parent / "assets" / "src"
CDN = "https://cdn.jsdelivr.net/npm/@fontsource/{pkg}@5/files/{pkg}-latin-{w}-normal.woff2"
LATIN = [("hanken-grotesk", 400), ("hanken-grotesk", 700), ("ibm-plex-mono", 400)]
ASCII = "".join(chr(c) for c in range(0x20, 0x7F)) + "·×é"  # · × é


def fetch(url):
    with urllib.request.urlopen(url, timeout=30) as r:
        return r.read()


def cut(woff2: bytes, text: str) -> bytes:
    font = TTFont(io.BytesIO(woff2))
    opts = subset.Options(flavor="woff2", layout_features=["kern", "liga", "calt", "tnum"])
    sub = subset.Subsetter(opts)
    sub.populate(text=text)
    sub.subset(font)
    out = io.BytesIO()
    font.save(out)
    return out.getvalue()


def fonts():
    out = {}
    for pkg, w in LATIN:
        raw = fetch(CDN.format(pkg=pkg, w=w))
        small = cut(raw, ASCII)
        out[f"{pkg}-{w}"] = base64.b64encode(small).decode()
        print(f"{pkg} {w}: {len(raw)} -> {len(small)} bytes")
    kn = (SRC / "anek-kannada-name.woff2").read_bytes()
    out["anek-kannada-600"] = base64.b64encode(kn).decode()
    print(f"anek kannada: {len(kn)} bytes (as shipped)")
    (SRC / "_fonts.json").write_text(json.dumps(out))


def portrait(n=56):
    im = Image.open(SRC / "portrait.webp").convert("RGBA")
    w, h = im.size
    if w > h:
        box = ((w - h) // 2, 0, (w - h) // 2 + h, h)
    else:
        top = int((h - w) * 0.2)
        box = (0, top, w, top + w)
    im = im.crop(box).resize((n, n), Image.LANCZOS)
    px = im.load()
    lum, lo, hi = [], 1.0, 0.0
    for y in range(n):
        for x in range(n):
            r, g, b, a = px[x, y]
            if a <= 100:
                lum.append(-1.0)
                continue
            l = (0.2126 * r + 0.7152 * g + 0.0722 * b) / 255
            lum.append(l)
            lo, hi = min(lo, l), max(hi, l)
    span = hi - lo
    grid = [round((l - lo) / span, 3) if l >= 0 and span > 0.05 else l for l in lum]
    (SRC / "_portrait.json").write_text(json.dumps({"n": n, "lum": grid}))
    print(f"portrait: {n}x{n}, {sum(1 for l in grid if l >= 0)} opaque cells, levels {lo:.2f}..{hi:.2f}")


if __name__ == "__main__":
    fonts()
    portrait()
