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
const LADDER = [
  { year: 2013, level: 0, role: 'Intern, Web Frontend', org: 'Thinkappz' },
  { year: 2014, level: 1, role: 'UI/UX Engineer', org: 'InvenZone' },
  { year: 2015, level: 2, role: 'Software Engineer', org: 'Tracxn' },
  { year: 2016, level: 3, role: 'Technology Lead', org: 'Tracxn' },
  { year: 2020, level: 4, role: 'Associate VP, Technology', org: 'Tracxn' },
  { year: 2022, level: 5, role: 'Senior Associate VP', org: 'Tracxn' },
  { year: 2023, level: 6, role: 'VP, Technology', org: 'Tracxn' },
];
// The axis runs to 'now' rather than a printed year, so the figure can't date.
const END_YEAR = new Date().getFullYear();

/* =============================== 1. MASTHEAD ============================== */

function masthead(t) {
  // 880 wide: the profile README card is ~936px of content, so anything wider
  // gets scaled down and the small type stops being legible.
  const W = 880, H = 232, M = 34;
  const NAME = 'Ganapati V S';
  // Base styles are the finished, fully legible state. Motion is layered on
  // top only for readers who haven't asked for less of it, so a still render
  // (reduced motion, GitHub mobile, a rasteriser) is always the correct one.
  const css = `
.nm{font-size:60px;font-weight:700;letter-spacing:-.022em}
.misreg{opacity:${t.misregOpacity};transform:translate(2.6px,1.9px)}
.pulse{opacity:0}
@media (prefers-reduced-motion:no-preference){
  .misreg{animation:reg .9s cubic-bezier(0,0,.2,1) both}
  @keyframes reg{
    from{transform:translate(9.5px,6.6px);opacity:0}
    to{transform:translate(2.6px,1.9px);opacity:${t.misregOpacity}}
  }
  .plate{animation:up .7s cubic-bezier(0,0,.2,1) both}
  @keyframes up{from{opacity:0;transform:translateY(9px)}to{opacity:1;transform:translateY(0)}}
  .r1{animation:draw .95s cubic-bezier(0,0,.2,1) .1s both}
  .r2{animation:draw .95s cubic-bezier(0,0,.2,1) .28s both}
  @keyframes draw{from{stroke-dasharray:${W};stroke-dashoffset:${W}}to{stroke-dasharray:${W};stroke-dashoffset:0}}
  .fade{animation:fi .6s ease-out .42s both}
  .fade2{animation:fi .6s ease-out .56s both}
  @keyframes fi{from{opacity:0}to{opacity:1}}
  .pulse{transform-box:fill-box;transform-origin:center;animation:pl 2.8s cubic-bezier(0,0,.2,1) infinite}
  @keyframes pl{0%{transform:scale(.7);opacity:.7}100%{transform:scale(2.9);opacity:0}}
}`;

  const body = `
<g class="fade">
  <text class="m tk dim" x="${M}" y="26" font-size="9">MEETGUNS PRESS · EST. 2013 · BENGALURU</text>
  <text class="m tk dim" x="${W - M}" y="26" font-size="9" text-anchor="end">NO. 01 — THE MASTHEAD</text>
</g>
<line class="r1" x1="${M}" y1="40" x2="${W - M}" y2="40" stroke="${t.rule}" stroke-width="1"/>

<g class="plate">
  <text class="d nm misreg" x="${M}" y="112" fill="${t.accent}">${NAME}</text>
  <text class="d nm" x="${M}" y="112">${NAME}</text>
</g>

<g class="fade" transform="translate(${M + 2} 140) scale(0.74)" fill="${t.ink2}" aria-hidden="true">
${KANNADA_PATHS}
</g>
<text class="m tk fade" x="${n(M + 2 + KANNADA_WIDTH * 0.74 + 16)}" y="137" font-size="8.5" fill="${t.accent}">KARNATAKA · MADE IN INDIA</text>

<text class="s fade2" x="${M + 1}" y="172" font-size="13.5" fill="${t.ink2}">Engineering leader. At Tracxn since 2015, engineer to VP. Still shipping.</text>

<line class="r2" x1="${M}" y1="194" x2="${W - M}" y2="194" stroke="${t.rule}" stroke-width="1"/>

<g class="fade2">
  <circle class="pulse" cx="${M + 4}" cy="212" r="3.8" fill="none" stroke="${t.pos}" stroke-width="1.4"/>
  <circle cx="${M + 4}" cy="212" r="3.4" fill="${t.pos}"/>
  <text class="m tk" x="${M + 18}" y="276" font-size="10.5" fill="${t.ink2}">CURRENTLY SHIPPING</text>
  <text class="m tk dim" x="${W - M}" y="215" font-size="9" text-anchor="end">VP TECHNOLOGY · TRACXN · REPLIES IN IST</text>
</g>`;

  return svg({
    w: W, h: H, t, css, body,
    title: 'Ganapati V S — VP, Technology at Tracxn, Bengaluru',
    desc: 'Letterpress-style masthead. The name is printed twice, the second plate slightly out of register, the way a press looks when the plates do not line up. Below it: the name in Kannada, and the line "Engineering leader. At Tracxn since 2015, engineer to VP. Still shipping."',
  });
}

/* =========================== 3. CAREER LADDER ============================= */

function ladder(t) {
  const W = 1200, H = 348, M = 46;
  const labelCol = 250;
  const axX = M + labelCol;
  const axW = W - axX - M - 66;
  const x = (yr) => axX + ((yr - 2013) / (END_YEAR - 2013)) * axW;
  const rowH = 30;
  const top = 116;

  const ticks = [2013, 2015, 2017, 2019, 2021, 2023, END_YEAR]
    .map((yr, i, all) => {
      const label = i === all.length - 1 ? 'now' : String(yr);
      return `<line x1="${n(x(yr))}" y1="${top - 12}" x2="${n(x(yr))}" y2="${n(top + LADDER.length * rowH - 4)}" stroke="${t.rule}" stroke-width="0.8"/>
<text class="m dim" x="${n(x(yr))}" y="${top - 18}" font-size="9.5" text-anchor="middle">${label}</text>`;
    }).join('\n');

  const rows = LADDER.map((r, i) => {
    const y = top + i * rowH;
    const x0 = x(r.year);
    const x1 = i === LADDER.length - 1 ? x(END_YEAR) : x(LADDER[i + 1].year);
    const cur = i === LADDER.length - 1;
    const span = i === LADDER.length - 1 ? `${r.year} → now` : `${r.year}–${LADDER[i + 1].year}`;
    return `<g>
  <text class="m" x="${n(M + labelCol - 14)}" y="${n(y + 13)}" font-size="12" text-anchor="end" fill="${cur ? t.ink : t.ink2}">${esc(r.role)}</text>
  <rect x="${n(x0)}" y="${n(y + 3)}" width="${n(Math.max(3, x1 - x0))}" height="13" fill="${t.accent}" opacity="${n(0.36 + i * 0.107)}"/>
  ${cur ? `<rect x="${n(x1 - 2)}" y="${n(y + 0.5)}" width="2" height="18" fill="${t.accent}"/>` : ''}
  <text class="m" x="${n(x1 + 8)}" y="${n(y + 13)}" font-size="10.5" fill="${t.ink3}">${span}</text>
</g>`;
  }).join('\n');

  const tracxnY = top + 2 * rowH;
  const tracxnH = 5 * rowH - 6;

  const body = `
<text class="m tk dim" x="${M}" y="34" font-size="10.5">THE LONG ONE · ONE COMPANY SINCE 2015</text>
<line x1="${M}" y1="40" x2="${W - M}" y2="40" stroke="${t.rule}" stroke-width="1"/>
<text class="d" x="${M}" y="82" font-size="26" font-weight="700">One place, while the industry moved every eighteen months.</text>
${ticks}
<rect x="${n(x(2015) - 5)}" y="${n(tracxnY - 3)}" width="${n(x(END_YEAR) - x(2015) + 10)}" height="${n(tracxnH)}" fill="none" stroke="${t.accent}" stroke-width="1" stroke-dasharray="3 3" opacity="0.55"/>
<text class="m tk" x="${n(x(2015))}" y="${n(tracxnY + tracxnH + 14)}" font-size="9.5" fill="${t.accent}">TRACXN — FOUR PROMOTIONS, NO DEPARTURES</text>
${rows}`;

  return svg({
    w: W, h: H, t, body,
    title: 'Career since 2013: seven roles, one company since 2015',
    desc: `Timeline of seven roles since 2013. ${LADDER.map((r, i) => `${r.role} at ${r.org} from ${r.year}`).join('; ')}, current. The Tracxn span begins in 2015 and covers four promotions.`,
  });
}

/* ============================== 6. INK LIBRARY ============================ */

// The six accents his site offers, named after one city.
const INKS = [
  ['bottle green', '#1b6c46', '#7dbf92'],
  ['brass', '#a48030', '#e2c376'],
  ['oxblood', '#97403e', '#e78c7f'],
  ['dust blue', '#36698c', '#85b2d9'],
  ['aubergine', '#6b3c7e', '#c08acc'],
  ['umber', '#72523d', '#c19f88'],
];

function inks(t) {
  const W = 660, H = 58, M = 10;
  const colW = (W - M * 2) / INKS.length;
  const cells = INKS.map(([label, l, d], i) => {
    const x = M + i * colW;
    const c = t.name === 'dark' ? d : l;
    return `<rect x="${n(x)}" y="14" width="${n(colW - 10)}" height="14" fill="${c}"/>
<text class="m" x="${n(x)}" y="44" font-size="9" fill="${t.ink3}">${esc(label)}</text>`;
  }).join('\n');
  return svg({
    w: W, h: H, t, panel: false, body: cells,
    title: 'Six inks, named after one city',
    desc: `Six colour swatches used across meetguns.com: ${INKS.map((k) => k[0]).join(', ')}. This page is set in the first of them, bottle green.`,
  });
}

/* ================================= BUILD ================================== */

const ASSETS = { masthead, ladder, inks };


let count = 0;
for (const [name, fn] of Object.entries(ASSETS)) {
  for (const key of ['light', 'dark']) {
    write(`${name}-${key}.svg`, fn(THEMES[key]));
    count++;
  }
}
console.log(`wrote ${count} svg files to assets/`);
