# Notes

Everything needed to ship this, plus what's deliberately not in it.

## Install

Commit to `github.com/ganapativs/ganapativs` on `master`:

```
README.md                       the short one — ship this
README-long.md                  the full version, if you ever want it
NOTES.md
package.json
.gitignore
scripts/core.mjs                shared tokens + SVG helpers
scripts/generate-assets.mjs     masthead, ladder, inks      (hand-set)
scripts/generate-charts.mjs     the four word-sized charts  (real library)
scripts/generate-wall.mjs       the 40-type wall            (real library)
scripts/kannada_path.py         one-off: Kannada -> outlines
assets/*.svg                    16 files, generated
assets/_kannada-path.svgfrag
assets/summaries.json           the library's generated alt text
assets/wall-manifest.json       the 40 types on the wall
```

Your existing `assets/footer-bg.png` is no longer referenced — keep or delete it.

```bash
npm install     # @microcharts/react + @microcharts/mcp, both pinned, dev only
npm run build   # writes all 16 SVGs, light + dark
```

`react` and `react-dom` aren't needed — the scripts only import `defineTheme` and
the stylesheet, and the MCP server does the rendering out of process. Verified by
deleting both from `node_modules` and rebuilding clean.

## Two lengths

`README.md` is the short one: masthead, two paragraphs with the word-sized charts
in them, the note, the wall, and a contact line. About 260 words of visible prose.

`README-long.md` is the earlier full version — career ladder figure, role-by-role
history, stack table, writing list, off-screen section, ink strip. About 1,030
words. It duplicates meetguns.com, which is the better home for all of it, and it
pushes your pinned repositories below a long scroll. Rename it over `README.md` if
you disagree; both reference only committed assets, so either works as-is.

The three stages are independent and safe to run on their own. Stages 2 and 3 spawn
your MCP server via `npx -y @microcharts/mcp`, so they want network on first run and
nothing after.

The Kannada outlines are already committed. `scripts/kannada_path.py` only needs
re-running if you change that string, and it wants `uharfbuzz`, `fonttools`, and
Noto Sans Kannada.

## Kept short on purpose

The README is about 150 words and three figures. It was four times that until it
became clear how much of it the profile page already shows: your sidebar bio states
the role and stack, your pinned repos list the projects with live star counts, and
meetguns.com carries the career arc, the writing and the CV. Anything repeating those
went to `EXTRAS.md`, paste-ready, with a note on what each one duplicates.

**Figures are 880px wide, not 1200.** The profile README card measures about 968 CSS
px, so a 1200px graphic is scaled to ~78% and 9.5px labels land near 7px. At 880 they
render 1:1. If you ever move a block into a repo README, that container is wider and
the figure can grow.

## Nothing here needs maintaining

The page carries no figure that moves on its own, so it can't quietly go stale.

**Cut for that reason:** all star counts, the star-ledger figure they supported, the
per-repo star column in the table, and the measured kB numbers (`5.24` median
against a `7` kB budget). Star counts were the worst offenders — `microcharts` read
38 in GitHub's cached profile page and 75 live on the same day, so a hand-written
number is wrong within a week.

**Kept, because it's structural rather than drifting:** zero runtime dependencies (a
CI gate, not a measurement), the per-chart gzip budget as a *concept* with no number
attached, repository names and the year each began, and the design rules.

**Two conventions do the work:**

1. *Volatile-ish numbers live in markdown, never inside a generated SVG.* Editing a
   sentence is a one-line commit; re-running a build to fix a baked-in label is
   friction you'd skip. This is why the wall's eyebrow reads "40 CHART TYPES" rather
   than "40 of 106" — if the catalogue grows, the image is still right.
2. *Elapsed time is never printed.* Nothing says "eleven years"; the masthead says
   "At Tracxn since 2015" and the ladder's axis ends at **now** instead of a year.
   Start years are historical facts. Durations expire every January.

**The one count left** is *fifteen npm packages*, which the TallyMarks chart exists
to show. It's low-churn — fifteen over a decade — but it is still a count. To bump
it, change `value: 15` in `scripts/generate-charts.mjs` and rebuild; to drop the
claim, delete that entry from `INLINE` and the phrase from the README. Your call,
not mine.

Your next promotion touches three things: `LADDER` in `generate-assets.mjs`,
`ROLE_STEPS` in `generate-charts.mjs`, and the pictogram's `value: 4`.

## Provenance

Public sources only, checked 30 July 2026. No private repository, internal metric,
or unpublished work is referenced — the repo data came from GitHub's public search
API unauthenticated, so nothing private was ever visible.

| Claim | Source |
| :-- | :-- |
| Seven roles, four promotions, start years | meetguns.com career arc |
| 15 npm packages | meetguns.com/llms.txt |
| Zero runtime dependencies, per-chart gzip budget | microcharts.dev/llms.txt, docs/design-notes |
| Repository names, years, one-line descriptions | your own repo READMEs, via meetguns.com/work |
| Chart shapes and data on the wall | each type's own `sample` from `get_microchart` |
| Palette, type stacks, ink names | meetguns.com stylesheet, bundle `0756510ea7a1c7d5.css` |

## What's library-rendered and what's hand-set

Worth being precise about, given the lie-factor rule.

**Rendered by `@microcharts/react`** — the four word-sized charts in the opening
sentences and all forty on the wall, through your own MCP server
(`render_microchart`), so the geometry is whatever the library actually ships. The
wall's data is each type's documented `sample`, so nothing on it is invented. Their
alt text is the string your summary generator wrote, captured to
`assets/summaries.json` and injected into the README — not a description I typed.
Theming is `defineTheme({ extends: 'editorial', … })` seeded with the tokens lifted
from your stylesheet; `positive` and `negative` are left alone, because the library
keeps them on a colour-blind-safe pair and that isn't my call to override.

**Hand-set** — the masthead, the career ladder, and the ink strip. These are
typographic compositions that happen to contain data, not chart types, so there's
nothing in the catalogue to render them with.

## How it's built

**Palette and type are yours, not approximations.** From
`meetguns.com/_next/static/css/0756510ea7a1c7d5.css`, OKLCH converted to hex:
`#e7eee4` paper, `#03180c` dark paper, `#1b6c46` bottle green, `#7dbf92` its dark
twin, `#001a0d` ink. The six categorical slots map to your six inks in order —
bottle green, brass, oxblood, dust blue, aubergine, umber. Type names Anek Latin,
Piazzolla and Fragment Mono first and falls back exactly as your CSS does.

Rebuilt against the bottle-green palette, replacing the earlier warm one. If you
change inks again, the only edits are `THEMES` in `scripts/core.mjs`, `INKS` in
`generate-assets.mjs`, and `SITE` in both library generators — then `npm run build`.

**One collision worth your eye.** Your accent is now a green (`#1b6c46`), and
microcharts' `--mc-positive` is also a green (`#0e7a5f`) — about 31 units apart in
RGB, close enough to read as the same colour in a word-sized mark. So an
accent-coloured mark and a good-direction mark can look alike, which strains the
"colour encodes, never decorates" rule. I have *not* changed it, because your
library keeps that pair colour-blind-safe on purpose and overriding your valence
colours isn't my call. It's also largely self-mitigating: your own rule doubles
valence with glyph or position, never colour alone, so StatusDot, TrendArrow and
Waterfall stay readable. If you'd rather separate them, either set
`positive: '#0e6a7a'`-ish (bluer) in the `defineTheme` call in both generators, or
theme the charts with a non-green ink such as `dust blue`. Worth checking on
meetguns.com too, since the same pairing applies there.

**Motion is progressive enhancement.** Base styles are the finished, legible state;
animation is layered on only inside
`@media (prefers-reduced-motion: no-preference)`. Reduced motion, GitHub's mobile
app, and any still rasteriser therefore get a correct render rather than a blank
panel. The masthead's second ink plate settles into register once and stops. The
only loop on the page is the status dot — the same exemption your own design notes
carve out, because a monitoring dot holding still reads as a stopped feed.

**Kannada is outlines, not text.** Webfonts can't load inside an `<img>`-embedded
SVG, so ಗಣಪತಿ ವಿ ಎಸ್ would have been tofu for anyone without a Kannada font. It's
shaped with HarfBuzz against Noto Sans Kannada and converted to paths — seven glyph
clusters, matras and virama correct.

**Themes follow GitHub, not the OS.** Each graphic is a light/dark pair behind
`<picture>` + `prefers-color-scheme`. The same query *inside* a single SVG follows
the operating system instead, which desyncs the moment someone pins GitHub to dark
on a light machine. The per-file token overrides are unlayered `:root` rules, so they
beat the library's layered `:where(:root)` and its own dark block — each file is
deterministically one theme.

## One bug found in @microcharts/mcp

`render_microchart` with `format: "svg"` inlines the stylesheet, which contains:

```css
@property --mc-seat{syntax: "<number>"; inherits: false; initial-value: 0;}
```

Inside a `<style>` element in a standalone `.svg`, that `<number>` parses as an
element start tag. Browsers parse `image/svg+xml` as XML, so the file fails to parse
and **the image renders as nothing** — which defeats the purpose of the `svg`
format, whose whole job is a self-contained file. It's invisible if you only drop
the markup inline into HTML, where `<style>` is a raw-text element.

One-line fix at the emit site — wrap the inlined CSS in CDATA:

```
<style><![CDATA[ …stylesheet… ]]></style>
```

Both generator scripts patch this locally in `cdataWrapStyles()`, so this README is
unaffected either way. Worth fixing upstream, and worth a docs test that parses one
`format:"svg"` result as XML.

Two smaller notes from the same session. `get_microchart` takes `slug` while
`render_microchart` takes `type`, which is an easy trip-up for an agent doing both in
one flow. And `delta` renders as an HTML `<span>` wrapping a glyph `<svg>`, so it
can't nest inside a composed SVG the way the other 39 can — I put `ForecastCone` on
the wall instead. The validation errors are genuinely good, though: the MiniBar one
named the exact shape and pointed at `get_microchart` for a sample.

## Two things to check on first push

1. **Animation.** GitHub proxies images through camo. CSS animation inside an
   `<img>`-loaded SVG normally survives, but if the masthead arrives static, swap the
   absolute `https://github.com/ganapativs/ganapativs/raw/master/assets/…` URLs for
   relative `assets/…` ones. Everything stays legible either way — that's what the
   progressive-enhancement structure buys.
2. **Baseline alignment.** The inline charts sit on the text baseline, which is what
   you want. If one looks a pixel off against your rendered body text, nudge the
   `height` attribute on that single `<img>`.

Verified before shipping: all 16 SVGs parse as XML and load as images in headless
Chromium under both `prefers-reduced-motion` settings; all 40 wall cells were
pixel-checked for drawn ink; the accent resolves to `rgb(27,108,70)` in light and
`rgb(125,191,146)` in dark.

## If you want to go further

- **Pin the versions.** `npx -y @microcharts/mcp` currently resolves to 0.1.7
  against `@microcharts/react` 0.11.0. Pin both so a future release can't silently
  redraw the page.
- **Let the wall grow itself.** It hard-codes 40 slugs. Reading
  `microcharts://catalog` and taking the first N of each collection would keep it
  representative as the catalogue changes, with no number to update.
- **Drop `talks` in.** It's public and thin; if you ever write up TinyConf 2, that's
  a natural row in the writing section.
