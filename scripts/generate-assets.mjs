import { writeFileSync, mkdirSync, readFileSync } from 'node:fs';
import { THEMES, svg, esc } from './core.mjs';

/** His name in Kannada, shaped with HarfBuzz and converted to outlines by
 *  scripts/kannada_path.py. Webfonts can't load inside an <img> SVG, so
 *  outlines are the only way this renders for every reader. */
const KANNADA_PATHS = readFileSync(new URL('../assets/_kannada-path.svgfrag', import.meta.url), 'utf8').trim();
const KANNADA_WIDTH = 131.94; // advance width at font-size 21

const OUT = new URL('../assets/', import.meta.url);
mkdirSync(OUT, { recursive: true });
const n = (v) => (Math.round(v * 100) / 100).toString();
const write = (name, s) => writeFileSync(new URL(name, OUT), s);

/* ===========================================================================
 * VERIFIED PUBLIC DATA
 * Every figure below came from a public source, checked on 2026-07-30:
 *  - github.com/ganapativs (public, non-fork repos via the search API)
 *  - meetguns.com  (career arc, counts)
 *  - meetguns.com/blog/microcharts-word-sized-charts (measured kB figures)
 * No private repositories or internal work are referenced anywhere.
 * ========================================================================= */

// role level 0..6 across 2013 -> 2026, one point per year

/* =============================== 1. MASTHEAD ============================== */

function masthead(t) {
  // 800 wide: the profile README card measures ~798 CSS px, so this renders 1:1.
  const W = 800, H = 220, M = 30;
  const NAME = 'Ganapati V S';
  const KS = 0.714;                       // Kannada outlines were built at 21px; 21 * 0.714 ≈ 15px
  const KW = KANNADA_WIDTH * KS;
  const BASE = 138;                       // one shared baseline for Kannada and the small caps

  const css = `
.nm{font-size:56px;font-weight:700;letter-spacing:-.02em}
.sf{font-size:15.5px;letter-spacing:.004em}
.pulse{opacity:0}
@media (prefers-reduced-motion:no-preference){
  .plate{animation:up .7s cubic-bezier(0,0,.2,1) both}
  @keyframes up{from{opacity:0;transform:translateY(8px)}to{opacity:1;transform:translateY(0)}}
  .r1{animation:draw .95s cubic-bezier(0,0,.2,1) .1s both}
  .r2{animation:draw .95s cubic-bezier(0,0,.2,1) .28s both}
  @keyframes draw{from{stroke-dasharray:${W};stroke-dashoffset:${W}}to{stroke-dasharray:${W};stroke-dashoffset:0}}
  .fade{animation:fi .6s ease-out .34s both}
  .fade2{animation:fi .6s ease-out .48s both}
  @keyframes fi{from{opacity:0}to{opacity:1}}
  .pulse{transform-box:fill-box;transform-origin:center;animation:pl 2.8s cubic-bezier(0,0,.2,1) infinite}
  @keyframes pl{0%{transform:scale(.7);opacity:.7}100%{transform:scale(2.9);opacity:0}}
}`;

  const body = `
<g class="fade">
  <text class="m tk dim" x="${M}" y="24" font-size="9.5">MEETGUNS PRESS · BENGALURU · EST. 2013</text>
  <text class="m tk dim" x="${W - M}" y="24" font-size="9.5" text-anchor="end">MEETGUNS.COM</text>
</g>
<line class="r1" x1="${M}" y1="38" x2="${W - M}" y2="38" stroke="${t.rule}" stroke-width="1"/>

<g class="plate">
  <text class="d nm" x="${M}" y="106">${NAME}</text>
</g>

<g class="fade" transform="translate(${M + 1} ${BASE}) scale(${KS})" fill="${t.ink2}" aria-hidden="true">
${KANNADA_PATHS}
</g>
<text class="m tk fade" x="${n(M + 1 + KW + 15)}" y="${BASE}" font-size="8.5" fill="${t.accent}">KARNATAKA · MADE IN INDIA</text>

<text class="s sf fade2" x="${M}" y="172" fill="${t.ink2}">Engineer, then lead, then VP — one company since 2015.</text>

<line class="r2" x1="${M}" y1="188" x2="${W - M}" y2="188" stroke="${t.rule}" stroke-width="1"/>

<g class="fade2">
  <circle class="pulse" cx="${M + 4}" cy="203" r="3.8" fill="none" stroke="${t.pos}" stroke-width="1.3"/>
  <circle cx="${M + 4}" cy="203" r="3.4" fill="${t.pos}"/>
  <text class="m tk" x="${M + 15}" y="206" font-size="9.5" fill="${t.ink2}">STILL SHIPPING</text>
  <text class="m tk dim" x="${W - M}" y="206" font-size="9.5" text-anchor="end">VP TECHNOLOGY · TRACXN</text>
</g>`;

  return svg({
    w: W, h: H, t, css, body,
    title: 'Ganapati V S — VP, Technology at Tracxn, Bengaluru',
    desc: 'A letterpress-style header: the name Ganapati V S set large, with the same name in Kannada beneath it, the line "Engineer, then lead, then VP — one company since 2015", and a status line reading "still shipping, VP Technology, Tracxn".',
  });
}

/* ================================= BUILD ================================== */

const ASSETS = { masthead };


let count = 0;
for (const [name, fn] of Object.entries(ASSETS)) {
  for (const key of ['light', 'dark']) {
    write(`${name}-${key}.svg`, fn(THEMES[key]));
    count++;
  }
}
console.log(`wrote ${count} svg files to assets/`);
