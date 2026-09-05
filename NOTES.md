# Notes

One generated image, no runtime dependencies.

```
README.md
NOTES.md
package.json
scripts/generate-assets.mjs    builds the two header SVGs (node, zero deps)
scripts/prepare.py             font subsets + repo list -> assets/src/*.json
assets/masthead-light.svg      what the README shows on a light GitHub theme
assets/masthead-dark.svg       same, dark
assets/src/anek-kannada-name.woff2   the site's eleven-character Kannada cut (+ OFL.txt)
assets/src/_fonts.json         base64 woff2 subsets, written by prepare.py
assets/src/_repos.json         every original public repo with stars, year, language
```

```bash
pnpm build          # writes both SVGs
pnpm prepare:src    # refresh star counts, or after a font / character-set change
                    # (wants python3 with fonttools and brotli)
```

## What it is

One sheet of meetguns.com's drawing at 800 x 360: the frame and its
registration ticks, the measuring edge, the G with its bar in dust blue, the
name and the Kannada name, the six-ink tray, the drawing title on its rule with
the compass, the claim and two paragraphs, and on the right a specimen tray of
six open-source projects, each drawn as the part it is, with its stars and year.

800 wide because the profile README card is about 798 CSS px, so it renders 1:1.

## Sync with the site

Tokens, copy and constants are mirrored by hand from `ganapativs/portfolio-v2`.
When the site changes one of these, change it here and rebuild:

| Here (`generate-assets.mjs`) | There                                            |
| ---------------------------- | ------------------------------------------------ |
| `THEMES`, `INKS`             | `lib/ink.ts` (`SURFACE_HEX`, `INKS`)             |
| `MARK`                       | `lib/mark.ts`                                    |
| `CAREER_YEARS`               | `lib/resume.ts` (bumped each July)               |
| `NPM_PACKAGES`               | `lib/resume.ts` `PUBLIC_WORK.npm`                |
| `H1`, `LEDE`, `NOW`, `ASK`   | `app/(press)/page.tsx`, `BIO` in `lib/resume.ts` |
| `assets/src/anek-kannada-name.woff2` | `fonts/anek-kannada-name-subset.woff2`   |

Star counts and the repo total come from the GitHub API at `prepare.py` time
and are baked in. They drift. Re-run `pnpm prepare:src && pnpm build` now and
then, or the header prints last season's numbers.

## Decisions

**A tray of projects, not a portrait.** The first cut of this design printed
the site's 56 x 56 halftone portrait. GitHub shows the photograph in the
profile sidebar 300px to the left of it, so the same face appeared twice. A
career timeline was drawn next and rejected: the README is for the work, not
the tenure. The tray is fig. 2's shape from the site with fig. 1's rule for
glyphs: line, not shading, four strokes or so, one solid mark in the ink.

**Every glyph is the thing.** microcharts is a greeked sentence with a
sparkline and a bar chart set in it at word size. bttn.css is a button on its
press depth under a pointer. react-spectrum is justified placeholder text with
every word in a different ink. react-dynamic-import is the app, the arrow, the
dashed chunk and the component that arrived in it. pure-cache is a store with
one fresh entry and the clock that expires them. sgb is an ingot and the yield
line it ranks by.

**Fonts are embedded as data URIs.** A webfont cannot be fetched from inside an
`<img>`-loaded SVG, so the site's faces (Hanken Grotesk 400/700, IBM Plex Mono
400) are cut to ASCII plus `· × é` with fontTools, about 7 kB each, and inlined.
The Kannada name is the site's own Anek Kannada cut, embedded as-is; it carries
a synthesised GDEF that the shaping needs, so do not re-subset it.

**No animation.** The site's rule is that nothing moves unless the reader
caused it, and nothing in a README image can be caused. A still render is the
finished state.

**No dashes in copy.** Not em, not en. Full stops and the middot, as on the site.

**Light and dark are separate files** behind `<picture>`, so they follow the
GitHub theme rather than the OS theme. Each paints its own paper full-bleed, so
the sheet stays legible if the two disagree.

Verified in Chromium, WebKit and Firefox (Playwright builds) on 2026-09-05.
