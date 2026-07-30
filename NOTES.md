# Notes

One generated image, no dependencies.

## Install

```
README.md
NOTES.md
package.json
.gitignore
scripts/core.mjs               design tokens + SVG helper
scripts/generate-assets.mjs    builds the header
scripts/kannada_path.py        one-off: Kannada -> outlines
assets/masthead-light.svg
assets/masthead-dark.svg
assets/_kannada-path.svgfrag
```

```bash
npm run build     # writes both header SVGs. No npm install needed — zero deps.
```

`scripts/kannada_path.py` only needs re-running if the Kannada string changes; it
wants `uharfbuzz`, `fonttools`, and Noto Sans Kannada.

## What changed, and why

**No rendered charts.** They were embedded as `<img>`, and microcharts aligns inline
charts with its `.mc-inline` class and `--mc-inline-nudge` custom property. GitHub
strips all CSS from markdown, so neither reaches the page — the charts could never
sit on the text baseline, which is exactly how they looked. Not a fixable bug: an
`<img>` in GitHub markdown can't be baseline-tuned. They're gone, along with the
`@microcharts/*` dependencies, both chart generators, and `EXTRAS.md`.

**No ink swatch strip.** It was decoration with no job.

**No email or résumé link.** Both are in the profile sidebar already.

**Header is 800px wide.** Measured off the live screenshot: the profile README card
is about 798 CSS px, so the earlier 1200px and 880px versions were being scaled to
66% and 91%, which is why the small type looked soft. At 800 it renders 1:1.

**The name is printed once.** The second offset plate was meant to read as letterpress
misregistration, the way it does on meetguns.com. On a dark card at this size it just
read as a drop shadow on doubled text. If you want it back, add a second `<text>` in
`masthead()` behind the first with `fill="${t.accent}"`, `opacity:.34` and a
`translate(2px,1.5px)`.

**Kannada now shares a baseline with the small caps.** ಗಣಪತಿ ವಿ ಎಸ್ sat 3px low
before. Both now sit on `BASE = 138`, verified at 1px in a browser render. The
Kannada is scaled to ~15px optical against the 8.5px caps, so it still reads as the
name rather than as a tag.

**Standfirst.** Was *"Engineering leader. At Tracxn since 2015, engineer to VP. Still
shipping."* — LinkedIn phrasing, and set too small. Now *"Engineer, then lead, then VP
— one company since 2015."* at 15.5px in Piazzolla, up from 13.5.

## The header

Palette and type come from meetguns.com's stylesheet (bundle
`0756510ea7a1c7d5.css`), OKLCH converted to hex: `#e7eee4` paper, `#03180c` dark
paper, `#001a0d` ink, `#1b6c46` bottle green, `#7dbf92` its dark twin. Type names
Anek Latin, Piazzolla and Fragment Mono first and falls back exactly as your CSS
does. If you change inks again, edit `THEMES` in `scripts/core.mjs` and rebuild.

ಗಣಪತಿ ವಿ ಎಸ್ is outlines, not text: webfonts can't load inside an `<img>`-embedded
SVG, so it would be tofu for anyone without a Kannada font. Shaped with HarfBuzz
against Noto Sans Kannada — seven glyph clusters, matras and virama correct.

Light and dark are separate files behind `<picture>`, so they follow your GitHub
theme rather than the visitor's OS theme. Motion is progressive enhancement: the
base styles are the finished state and the rules only draw in under
`prefers-reduced-motion: no-preference`, so a still render is always correct. The
one loop is the status dot.

## If the header arrives static

GitHub proxies images through camo. CSS animation inside an `<img>`-loaded SVG
normally survives, but if the rules don't draw in, swap the absolute
`https://github.com/ganapativs/ganapativs/raw/master/assets/…` URLs for relative
`assets/…` ones. It stays legible either way.
