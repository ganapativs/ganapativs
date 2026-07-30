# Extras

Blocks cut from the profile README to keep it short. Each one is paste-ready — drop
it back in above the links line if you want it.

The reason they came out: your profile page already carries most of this. The
sidebar bio states the role and stack, the pinned repos list the projects with their
star counts, and meetguns.com holds the career arc, the writing and the CV. A
profile README that repeats all three is asking someone to read the same thing three
times.

---

## The chart wall

The heaviest block and the most impressive one. It's forty real renders from
`@microcharts/mcp`, one per type, drawn at word size — 880px wide and six columns so
it sits 1:1 in the profile card.

Worth weighing against the fact that **microcharts is already your top pinned repo**,
directly below the README, with its own site and README. This mostly duplicates that.
Better suited to the microcharts repo itself than to your profile.

<picture>
  <source media="(prefers-color-scheme: dark)" srcset="https://github.com/ganapativs/ganapativs/raw/master/assets/wall-dark.svg">
  <img alt="Forty chart types from the microcharts catalogue, each rendered by the library itself at word size from the sample data in its own documentation: Sparkline, SparkBar, ForecastCone, Bullet, ActivityGrid, TrendArrow, StatusDot, Progress, RugStrip, MiniBar, PictogramRow, Seismogram, HeatStrip, DotPlot, Dumbbell, Slope, MicroScatter, SegmentedBar, HistogramStrip, MicroBox, ProgressRing, MicroDonut, Funnel, Waterfall, Horizon, TallyMarks, DicePips, MoonPhase, Hourglass, Honeycomb, Constellation, TreeRings, CitySkyline, MusicStaff, Thermometer, BalanceBeam, WindBarb, WinProbWorm, Waveform, QuadrantDot." src="https://github.com/ganapativs/ganapativs/raw/master/assets/wall-light.svg">
</picture>

The catalogue prefers uncommon **questions** over uncommon shapes. `ErrorBudget` asks
whether you can afford another deploy; `ForecastCone` asks whether you'll land the
quarter; `CalibrationStrip` asks whether a model that says 70% is right 70% of the
time. There's no pie, no needle gauge, no waffle — at word size they mislead more
than they inform, so they're designed out rather than switched off.

`npx -y @microcharts/mcp` puts the same three moves in front of an assistant: find a
chart type, read its real props, render it to SVG with the generated alt text attached.

---

## The career ladder

Duplicates meetguns.com/resume, which does it better and stays current.

<picture>
  <source media="(prefers-color-scheme: dark)" srcset="https://github.com/ganapativs/ganapativs/raw/master/assets/ladder-dark.svg">
  <img alt="Timeline of seven roles since 2013: Intern at Thinkappz in 2013, UI/UX Engineer at InvenZone in 2014, then at Tracxn — Software Engineer from 2015, Technology Lead from 2016, Associate VP from 2020, Senior Associate VP from 2022, and VP Technology from 2023 to now." src="https://github.com/ganapativs/ganapativs/raw/master/assets/ladder-light.svg">
</picture>

<details>
<summary><b>The long one</b> — seven roles, four promotions, no departures</summary>

<br>

**2023 → now · VP, Technology.** The frontend hiring loop and the rubric we interview
against. Architecture reviews, RFCs, framework upgrades. 1:1s, direction, and getting
things out of people's way. The current cross-team thread is a customer-facing
[AI assistant](https://w.tracxn.com/tracxn-ai-assistant) and the API documentation
portal it lives in.

**Senior Associate VP.** A browser-extension build pipeline across Chrome and Firefox.
A hand-rolled AST codemod that migrated a button component across a frontend that had
been alive for eight years.

**Associate VP.** Multi-team architecture. Translating product asks into engineering
work, reviewing the queue, escalating what needed escalating. Most of this doesn't
show up in commits.

**Technology Lead.** I wrote the internal React component library. The team has built
on it for the decade since, which makes it the most useful thing I've made and the
least visible. Also the first Node service, and the Webpack / Babel / ESLint /
Storybook stack everyone inherited.

**Software Engineer.** First commit on day one. The landing page, the dashboard, feeds,
the signup flow. Then the mobile app on React Native and Redux, when both were new.

**Before Tracxn.** The frontend for eezyconnect.com at Thinkappz. Then UI for
invenzone.com, a social network for researchers, and for early arya.ai.

BE, Computer Science · [RNSIT, Bengaluru](https://www.rnsit.ac.in) · 2011–2014.

</details>

---

## Selected repositories

Duplicates your pinned repos, which GitHub already renders below the README with live
star counts. The one line worth keeping is the sgb paragraph, since sgb isn't a repo
and appears nowhere else on the profile.

| | |
| :-- | :-- |
| **[microcharts](https://github.com/ganapativs/microcharts)** · `2026` | Word-sized chart types for React. Zero runtime deps, accessible by default, RSC-safe. |
| **[bttn.css](https://github.com/ganapativs/bttn.css)** · `2016` | A CSS button library. Product Hunt picked it up; ten years on, it's still the thing strangers write to me about. |
| **[react-spectrum](https://github.com/ganapativs/react-spectrum)** · `2019` | Colourful text placeholders, generated from any string. |
| **[react-delightful-scroller](https://github.com/ganapativs/react-delightful-scroller)** · `2019` | Virtualised infinite scroller. Batches and recycles DOM nodes, aims at 60fps. |
| **[react-dynamic-import](https://github.com/ganapativs/react-dynamic-import)** · `2018` | Loads and renders a React module on demand. Its README opens by telling you to check whether `React.lazy` already covers your case. |
| **[pure-cache](https://github.com/ganapativs/pure-cache)** · `2019` | Tiny in-memory cache with near-realtime expiry. |
| **[priority](https://github.com/ganapativs/priority-browser-extension)** · `2024` | A new-tab extension that shows you one task. Live in the Chrome Web Store and Firefox add-ons. |
| **[puppeteer-warc](https://github.com/ganapativs/puppeteer-warc)** · `2025` | Web ARChive capture on top of Puppeteer. |

Also, not a repository: [**sgb**](https://sgb.vercel.app) — a tracker for India's
Sovereign Gold Bonds, ranked by what a buyer actually earns at today's price rather
than the coupon printed on the face value. A scraper on a cron, one JSON file on S3,
four years of iteration, still up.

---

## Stack

Duplicates your sidebar bio, which already says *"Working on Agentic AI, MCP,
React/Next.js/Node.js, build tools."*

<details>
<summary><b>Stack</b> — what I actually reach for</summary>

<br>

| | |
| :-- | :-- |
| **Core** | TypeScript · JavaScript · CSS · HTML · Python |
| **Frameworks & UI** | React · React Native · Next.js · React Server Components · Redux · Tailwind · MDX · Fumadocs |
| **AI / LLM** | Vercel AI SDK · Anthropic SDK · OpenAI SDK · MCP · agent harness · model routing · prompt caching and versioning · tool use · evals · prompt-injection defence · SSE streaming |
| **Dataviz & a11y** | SVG · WAI-ARIA · design tokens · gzip size budgets · colour-blind-safe palettes · visual regression |
| **Backend & data** | Node.js · Kafka · AWS (S3, Lambda) · Puppeteer · WARC |
| **Build & DX** | Webpack · esbuild · Vite · ESLint · Storybook · AST codemods · Cursor · Claude Code |
| **Document & perf** | PDF rendering · `@react-pdf/renderer` · exceljs · react-scan · Brotli · DPR-aware images · virtualised rendering |

</details>

---

## Writing and off-screen

Duplicates meetguns.com/blog and the about page.

<details>
<summary><b>Writing</b></summary>

<br>

- [**Introducing microcharts — word-sized charts for React**](https://meetguns.com/blog/microcharts-word-sized-charts) — why I built it, and why the constraints turned out to be the product.
- [**Aborting a fetch request**](https://meetguns.com/blog/aborting-a-fetch-request) — `AbortController`, the gotchas, and why your dropdowns flicker without it.
- [**Introducing 'react-spectrum'**](https://meetguns.com/blog/introducing-react-spectrum)
- [**Babel plugins: 'loose' mode caveats**](https://meetguns.com/blog/babel-plugins-loose-mode-caveats) — what `loose` actually trades away for smaller output.

Spoke once, at [TinyConf 2](https://blog.geekyants.com/tinyconf-2-2019-a-tiny-conference-about-react-59496b8d9aa) in Bangalore, 2019 — on virtualised infinite scroll. [RSS](https://meetguns.com/rss.xml) · [llms.txt](https://meetguns.com/llms.txt)

</details>

<details>
<summary><b>Off-screen</b></summary>

<br>

Travel and photography, mostly together. Soccer, badminton, the occasional video game.
English, Hindi, Kannada.

I still write code most weeks. The AI tooling made it fast enough to get from an idea
to something real that I came back to the keyboard.

</details>
