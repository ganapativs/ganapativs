# Notes

One generated image, no runtime dependencies.

```
README.md
NOTES.md
package.json
scripts/generate-assets.mjs    builds the two header SVGs (node, zero deps)
scripts/prepare.py             one-off: font subsets + portrait grid -> assets/src/*.json
assets/masthead-light.svg      what the README shows on a light GitHub theme
assets/masthead-dark.svg       same, dark
assets/src/portrait.webp       the photograph, as meetguns.com ships it
assets/src/anek-kannada-name.woff2   the site's eleven-character Kannada cut (+ OFL.txt)
assets/src/_fonts.json         base64 woff2 subsets, written by prepare.py
assets/src/_portrait.json      56x56 luminance grid, written by prepare.py
```

```bash
pnpm build          # writes both SVGs
pnpm prepare:src    # only when a font, the photo or the character set changes
                    # (wants python3 with fonttools, brotli, Pillow)
```

## What it is

One sheet of meetguns.com's drawing at 800 x 360: the frame and its
registration ticks, the measuring edge, the G with its bar in dust blue, the
name and the Kannada name, the six-ink tray, the drawing title on its rule with
the compass, the claim, two paragraphs, and the portrait printed as a 56 x 56
halftone and dimensioned like a part (height: 13 yrs experience, width: VP of
Technology, Tracxn).

800 wide because the profile README card is about 798 CSS px, so it renders 1:1.

## Sync with the site

Tokens, copy and constants are mirrored by hand from `ganapativs/portfolio-v2`.
When the site changes one of these, change it here and rebuild:

| Here (`generate-assets.mjs`) | There                                          |
| ---------------------------- | ---------------------------------------------- |
| `THEMES`, `INKS`             | `lib/ink.ts` (`SURFACE_HEX`, `INKS`)           |
| `MARK`                       | `lib/mark.ts`                                  |
| `CAREER_YEARS`               | `lib/resume.ts` (bumped each July)             |
| `H1`, `LEDE`, `NOW`, `ASK`   | `app/(press)/page.tsx`, `BIO` in `lib/resume.ts` |
| halftone thresholds          | `components/schematic/Portrait.tsx`            |
| `assets/src/portrait.webp`   | `public/portrait/ganapativs.webp`              |
| `assets/src/anek-kannada-name.woff2` | `fonts/anek-kannada-name-subset.woff2` |

## Decisions

**Fonts are embedded as data URIs.** A webfont cannot be fetched from inside an
`<img>`-loaded SVG, so the site's faces (Hanken Grotesk 400/700, IBM Plex Mono
400) are cut to ASCII plus `· × é` with fontTools, about 7 kB each, and inlined.
The Kannada name is the site's own Anek Kannada cut, embedded as-is; it carries
a synthesised GDEF that the shaping needs, so do not re-subset it. This
replaces the HarfBuzz-outlined Noto Sans Kannada paths the old header used.

**The halftone is the site's print, not a picture of it.** `prepare.py` takes
the same sample `Portrait.tsx` does (square cover-crop biased 20% up, 56x56,
luminance auto-levelled over the opaque cells) and `generate-assets.mjs` applies
the same curves: ink = 1 - lum on paper, lum^1.2 on graphite, nothing under
0.14, midtones 0.32..0.52 in the live ink. Dots are zero-length subpaths under a
round cap grouped by colour and radius, ~15 kB for 1,400 dots. The shoulders
falling away on dark is the site's behaviour too.

**No animation.** The old header drew its rules in and pulsed a status dot.
The site's rule is that nothing moves unless the reader caused it, and nothing
in a README image can be caused. A still render is the finished state.

**No dashes in copy.** Not em, not en. Full stops and the middot, as on the site.

**Light and dark are separate files** behind `<picture>`, so they follow the
GitHub theme rather than the OS theme. Each paints its own paper full-bleed, so
the sheet stays legible if the two disagree.
