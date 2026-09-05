#!/usr/bin/env python3
"""One-off inputs for the header: font subsets and the open-source repo list.

Run when a font changes, the character set changes, or the star counts should
be refreshed:

    python3 scripts/prepare.py      # wants: fonttools, brotli

Writes assets/src/_fonts.json and assets/src/_repos.json, both committed,
which scripts/generate-assets.mjs reads with zero dependencies.

Fonts are the site's own: Hanken Grotesk (language) and IBM Plex Mono
(measurement) from @fontsource via jsdelivr, cut to ASCII; Anek Kannada is the
site's committed name cut, copied verbatim from meetguns.com's repo (fonts/).
Webfonts cannot be fetched from inside an <img>-loaded SVG, so they are
embedded as data URIs instead.

The repo list is every original (non-fork) public repository on the account
from the GitHub API, with stars, year created and language, sorted by stars.
The header prints the count, the star total and six of the names, so a
rebuild after this is what keeps those numbers true.
"""
import base64, io, json, sys, urllib.request
from pathlib import Path

try:
    from fontTools import subset
    from fontTools.ttLib import TTFont
except ImportError:
    sys.exit("needs: pip install 'fonttools[woff]' brotli")

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


def repos(user="ganapativs"):
    out = []
    for page in (1, 2, 3):
        url = f"https://api.github.com/users/{user}/repos?per_page=100&type=owner&page={page}"
        req = urllib.request.Request(url, headers={"Accept": "application/vnd.github+json", "User-Agent": "ganapativs-profile"})
        with urllib.request.urlopen(req, timeout=30) as r:
            rows = json.load(r)
        if not rows:
            break
        out += [
            {"name": r["name"], "stars": r["stargazers_count"], "year": int(r["created_at"][:4]),
             "lang": r["language"], "desc": r["description"], "archived": r["archived"]}
            for r in rows if not r["fork"]
        ]
    out.sort(key=lambda r: -r["stars"])
    (SRC / "_repos.json").write_text(json.dumps(out, indent=0))
    print(f"repos: {len(out)} originals, {sum(r['stars'] for r in out)} stars")


if __name__ == "__main__":
    fonts()
    repos()
