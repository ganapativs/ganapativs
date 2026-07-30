<!--
  github.com/ganapativs — profile README

  Rebuild the graphics with `npm run build`. Nothing on this page is a figure that
  moves on its own — no star counts, no measured kilobytes — so it stays true
  without maintenance. See NOTES.md.
-->

<a href="https://meetguns.com">
<picture>
  <source media="(prefers-color-scheme: dark)" srcset="https://github.com/ganapativs/ganapativs/raw/master/assets/masthead-dark.svg">
  <img alt="Ganapati V S — VP, Technology at Tracxn, Bengaluru. The name is printed twice, the second plate slightly out of register, the way a press looks when the plates don't line up." src="https://github.com/ganapativs/ganapativs/raw/master/assets/masthead-light.svg">
</picture>
</a>

**[meetguns.com](https://meetguns.com)** · [microcharts.dev](https://microcharts.dev) · [writing](https://meetguns.com/blog) · [résumé](https://meetguns.com/resume) · [@ganapativs](https://x.com/ganapativs) · [linkedin](https://linkedin.com/in/ganapativs) · [npm](https://www.npmjs.com/~ganapativs)

---

I'm an engineer in Bengaluru. I joined [Tracxn](https://tracxn.com) in 2015 as a software engineer and I'm **VP, Technology** there now — one company the whole way <picture><source media="(prefers-color-scheme: dark)" srcset="https://github.com/ganapativs/ganapativs/raw/master/assets/inline-ladder-dark.svg"><img alt="Role level by year, since 2013. Trending up by 6. Range 0 to 6. Last value 6." src="https://github.com/ganapativs/ganapativs/raw/master/assets/inline-ladder-light.svg" width="92" height="20"></picture>, four of the steps promotions <picture><source media="(prefers-color-scheme: dark)" srcset="https://github.com/ganapativs/ganapativs/raw/master/assets/inline-promos-dark.svg"><img alt="Promotions at one company. 4 of 4." src="https://github.com/ganapativs/ganapativs/raw/master/assets/inline-promos-light.svg" width="58" height="20"></picture>. The role is mostly the team these days. Most weeks I'm still writing code with them.

Outside that, and uninterrupted since 2013, there's a catalogue of public work — fifteen npm packages <picture><source media="(prefers-color-scheme: dark)" srcset="https://github.com/ganapativs/ganapativs/raw/master/assets/inline-npm-dark.svg"><img alt="Published npm packages. 15 counted." src="https://github.com/ganapativs/ganapativs/raw/master/assets/inline-npm-light.svg" width="80" height="20"></picture> and a CSS button library from 2016 that strangers still write to me about.

<picture><source media="(prefers-color-scheme: dark)" srcset="https://github.com/ganapativs/ganapativs/raw/master/assets/inline-status-dark.svg"><img alt="Shipping. Status: ok." src="https://github.com/ganapativs/ganapativs/raw/master/assets/inline-status-light.svg" width="16" height="20"></picture> Right now that's **[microcharts](https://microcharts.dev)** — word-sized chart types for React, small enough to sit in a sentence or a table cell, exactly like the ones above. Zero runtime dependencies, accessible by default, safe in a Server Component, and a gzip budget per chart that fails the build when a chart outgrows it.

> [!NOTE]
> Those aren't pictures of charts. They're rendered by `@microcharts/react` itself
> at build time, through the library's own MCP server — and the alt text on each
> one is the sentence its summary generator wrote from the data, not a caption I
> typed. *"Trending up by 6. Range 0 to 6. Last value 6."* Charts belonging inside
> a sentence is the whole argument for microcharts, so this page runs on the
> library rather than illustrating it.

<picture>
  <source media="(prefers-color-scheme: dark)" srcset="https://github.com/ganapativs/ganapativs/raw/master/assets/wall-dark.svg">
  <img alt="Forty chart types from the microcharts catalogue, each rendered by the library itself at word size from the sample data in its own documentation: Sparkline, SparkBar, ForecastCone, Bullet, ActivityGrid, TrendArrow, StatusDot, Progress, RugStrip, MiniBar, PictogramRow, Seismogram, HeatStrip, DotPlot, Dumbbell, Slope, MicroScatter, SegmentedBar, HistogramStrip, MicroBox, ProgressRing, MicroDonut, Funnel, Waterfall, Horizon, TallyMarks, DicePips, MoonPhase, Hourglass, Honeycomb, Constellation, TreeRings, CitySkyline, MusicStaff, Thermometer, BalanceBeam, WindBarb, WinProbWorm, Waveform, QuadrantDot." src="https://github.com/ganapativs/ganapativs/raw/master/assets/wall-light.svg">
</picture>

The catalogue prefers uncommon **questions** over uncommon shapes. `ErrorBudget` asks whether you can afford another deploy; `ForecastCone` asks whether you'll land the quarter; `CalibrationStrip` asks whether a model that says 70% is right 70% of the time. There's no pie, no needle gauge, no waffle — at word size they mislead more than they inform, so they're designed out rather than switched off.

`npx -y @microcharts/mcp` puts the same three moves in front of an assistant: find a chart type, read its real props, render it to SVG with the generated alt text attached.

---

## A decade, one place

<picture>
  <source media="(prefers-color-scheme: dark)" srcset="https://github.com/ganapativs/ganapativs/raw/master/assets/ladder-dark.svg">
  <img alt="Timeline of seven roles since 2013: Intern at Thinkappz in 2013, UI/UX Engineer at InvenZone in 2014, then at Tracxn — Software Engineer from 2015, Technology Lead from 2016, Associate VP from 2020, Senior Associate VP from 2022, and VP Technology from 2023 to now. The Tracxn span begins in 2015 and covers four promotions." src="https://github.com/ganapativs/ganapativs/raw/master/assets/ladder-light.svg">
</picture>

<details>
<summary><b>The long one</b> — seven roles, four promotions, no departures</summary>

<br>

**2023 → now · VP, Technology.** The frontend hiring loop and the rubric we interview against. Architecture reviews, RFCs, framework upgrades. 1:1s, direction, and getting things out of people's way. The current cross-team thread is a customer-facing [AI assistant](https://w.tracxn.com/tracxn-ai-assistant) and the API documentation portal it lives in — a Fumadocs portal over an OpenAPI-driven pipeline, an intent router that picks the model per question, versioned prompts behind an eval harness, and an MCP server for coding clients.

**Senior Associate VP.** A browser-extension build pipeline across Chrome and Firefox. A hand-rolled AST codemod that migrated a button component across a frontend that had been alive for eight years.

**Associate VP.** Multi-team architecture. Translating product asks into engineering work, reviewing the queue, escalating what needed escalating. Most of this doesn't show up in commits.

**Technology Lead.** I wrote the internal React component library. The team has built on it for the decade since, which makes it the most useful thing I've made and the least visible. Also the first Node service, and the Webpack / Babel / ESLint / Storybook stack everyone inherited.

**Software Engineer.** First commit on day one. The landing page, the dashboard, feeds, the signup flow. Then the mobile app on React Native and Redux, when both were new.

**Before Tracxn.** The frontend for eezyconnect.com at Thinkappz. Then UI for invenzone.com, a social network for researchers, and for early arya.ai. My first public repos date from here — they're still up.

BE, Computer Science · [RNSIT, Bengaluru](https://www.rnsit.ac.in) · 2011–2014. College football team.

</details>

---

## Where to start

| | |
| :-- | :-- |
| **[microcharts](https://github.com/ganapativs/microcharts)** · `2026` | Word-sized chart types for React. Zero runtime deps, accessible by default, RSC-safe. [microcharts.dev](https://microcharts.dev) |
| **[bttn.css](https://github.com/ganapativs/bttn.css)** · `2016` | A CSS button library. Product Hunt picked it up, and it's still in people's projects. Ten years on, it's the thing strangers write to me about. |
| **[react-spectrum](https://github.com/ganapativs/react-spectrum)** · `2019` | Colourful text placeholders, generated from any string. |
| **[react-delightful-scroller](https://github.com/ganapativs/react-delightful-scroller)** · `2019` | Virtualised infinite scroller. Batches and recycles DOM nodes, aims at 60fps. |
| **[react-dynamic-import](https://github.com/ganapativs/react-dynamic-import)** · `2018` | Loads and renders a React module on demand. Its README opens by telling you to check whether `React.lazy` already covers your case. |
| **[pure-cache](https://github.com/ganapativs/pure-cache)** · `2019` | Tiny in-memory cache with near-realtime expiry. |
| **[priority](https://github.com/ganapativs/priority-browser-extension)** · `2024` | A new-tab extension that shows you one task. Live in the Chrome Web Store and Firefox add-ons. |
| **[puppeteer-warc](https://github.com/ganapativs/puppeteer-warc)** · `2025` | Web ARChive capture on top of Puppeteer. |

Also, not a repository: [**sgb**](https://sgb.vercel.app) — a tracker for India's Sovereign Gold Bonds, ranked by what a buyer actually earns at today's price rather than the coupon printed on the face value. A scraper on a cron, one JSON file on S3, four years of iteration, still up.

---

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

<details>
<summary><b>Writing</b> — new posts arrive when there's something worth saying</summary>

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

Travel and photography, mostly together. Soccer, badminton, the occasional video game. English, Hindi, Kannada.

I still write code most weeks. The AI tooling made it fast enough to get from an idea to something real that I came back to the keyboard.

</details>

---

## Say hello

Hiring, mentoring, architecture, open source, photography — or anything in between.
Replies in IST: slowest in March, fastest on Sundays.

**[vsg.inbox@gmail.com](mailto:vsg.inbox+github@gmail.com)**

<picture>
  <source media="(prefers-color-scheme: dark)" srcset="https://github.com/ganapativs/ganapativs/raw/master/assets/inks-dark.svg">
  <img alt="Six colour swatches used across meetguns.com: bottle green, brass, oxblood, dust blue, aubergine, umber. This page is set in the first of them, bottle green." src="https://github.com/ganapativs/ganapativs/raw/master/assets/inks-light.svg" width="760" height="64">
</picture>

<sub>Six inks, named after one city. This page is set in the first of them, bottle green. Every chart rendered by [`@microcharts/react`](https://microcharts.dev) via [`@microcharts/mcp`](https://microcharts.dev/docs/mcp), themed with `defineTheme` · [`scripts/`](scripts/) rebuilds them all · motion respects `prefers-reduced-motion`.</sub>
