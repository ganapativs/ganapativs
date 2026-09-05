/**
 * Builds assets/masthead-light.svg and assets/masthead-dark.svg.
 *
 *   node scripts/generate-assets.mjs      # zero dependencies
 *
 * The header is one sheet of meetguns.com's drawing at 800 x 360: the frame
 * with its registration ticks, the measuring edge, the mark and the name, the
 * ink tray, the drawing title on its rule with the compass, the claim, and the
 * portrait printed as a 56 x 56 halftone and dimensioned like a part.
 *
 * Everything the image says is read off the live site's constants (see
 * TOKENS below and the sync note in NOTES.md). Fonts and the portrait grid are
 * pre-cut by scripts/prepare.py into assets/src/*.json.
 *
 * No animation, on purpose: the site's own rule is that nothing moves unless
 * the reader caused it, and a picture in a README cannot be caused.
 */
import { readFileSync, writeFileSync } from 'node:fs';

const SRC = new URL('../assets/src/', import.meta.url);
const OUT = new URL('../assets/', import.meta.url);
const FONTS = JSON.parse(readFileSync(new URL('_fonts.json', SRC), 'utf8'));
const PORTRAIT = JSON.parse(readFileSync(new URL('_portrait.json', SRC), 'utf8'));

/* ---- the site's tokens, mirrored ---------------------------------------------
   styles/press/tokens.css and lib/ink.ts in ganapativs/portfolio-v2. Change
   there, change here. */
const CAREER_YEARS = 13;
const INKS = [
  { id: 'dustblue', light: '#2b6083', dark: '#86b3db' },
  { id: 'amber', light: '#8f5c0c', dark: '#d9962b' },
  { id: 'bottle', light: '#176540', dark: '#7fbf93' },
  { id: 'oxblood', light: '#8d3936', dark: '#e58c7f' },
  { id: 'aubergine', light: '#6a3c7c', dark: '#c28fce' },
  { id: 'olive', light: '#65681f', dark: '#bebd66' },
];
const THEMES = {
  light: { paper: '#f5f3ec', raise: '#faf8f1', ink: '#1d1e1a', ink2: '#42433c', ink3: '#68695f',
           rule3: '#e6e1d2', rule: '#cfc9b6', rule2: '#98937f', dark: false },
  dark:  { paper: '#131417', raise: '#191b1f', ink: '#e8e9e4', ink2: '#b6b9bd', ink3: '#8e9299',
           rule3: '#23262b', rule: '#2e3238', rule2: '#4c525c', dark: true },
};
// lib/mark.ts
const MARK = {
  w: 84, h: 131.615,
  g: 'M83.24629,105.00076l-28.79883.14941c-14.84912,0-28.34863-2.39941-40.498-13.64941C4.19941,82.35135,1.04951,69.75174.3,52.95242C1.9499,22.35281,21.44893,.4548,55.798,.00456c12.59961,1.0498,20.54883,3.75,25.79883,5.09961L64.49727,51.45242l19.499-.15039-0.75,46.94873v6.75ZM35.99824,90.15115L64.19648,12.15359C37.34834,9.00418,14.24922,22.50318,13.799,52.95242c-0.44968,17.39893,9.14993,31.19873,22.19924,37.19873Zm12.14941,3.2998c7.65039,0,18.89941-.4502,22.94922-0.4502l0.4502-32.24951H59.09688Z',
  bar: 'M0,118.215h84v12H0v-12Z',
};

/* ---- copy. First person, no dashes, every number from lib/resume.ts -------- */
const NAME = 'Ganapati V S';
const NAME_KN = 'ಗಣಪತಿ ವಿ ಎಸ್';
const H1 = ['I build the interfaces', 'people work in.'];
const LEDE = [
  `Full-stack engineer with a design mind. ${CAREER_YEARS} years in, based in`,
  'Bengaluru. At Tracxn since 2015, VP of Technology now.',
  'I still write a lot of code.',
];
// The second paragraph. The two spans in the ink are the site's, and 106 is
// the count microcharts.dev publishes.
const NOW = [
  'Right now that code is an <tspan class="acc">AI assistant</tspan> over private-market',
  'data, and <tspan class="acc">106 word-sized chart types</tspan> built on my own time.',
];
const ASK = 'Open to talking about architecture, hiring loops and open source.';
const SHEET_TITLE = 'GITHUB · 2026';

const esc = (s) => String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
const n = (v) => +v.toFixed(2);

/* ---- geometry. One place, so the render and its verification agree -------- */
const W = 800, H = 360;
const F = { x: 16.5, y: 16.5, w: W - 33, h: H - 33 };          // the frame
const M = 40;                                                    // content margin
const R = W - M;                                                 // right content edge
const HEAD = { cy: 46, rule: 78 };                               // header row, its rule
const PT = { x: 548, y: 104, s: 180 };                           // the portrait box
const DIM = 20;                                                  // dimension line offset from the box
const ANNO = 15;                                                 // dimension line to annotation baseline (8px clear + cap height)
const BASE = PT.y + PT.s + DIM + ANNO;                           // one shared foot baseline: the width label and the ask line

function fontFace(fam, weight, key) {
  return `@font-face{font-family:${fam};font-weight:${weight};font-display:block;src:url(data:font/woff2;base64,${FONTS[key]}) format("woff2")}`;
}

/** The registration cross at a frame corner: arms 5px past the trim. */
function tick(x, y, t) {
  return `<path d="M${x - 5} ${y}h10M${x} ${y - 5}v10" stroke="${t.rule2}"/>`;
}

/** The measuring edge, outside the frame on the left: a fine tick every 8px,
 *  a longer one every 40, the way a scale rule is graduated. */
function ruler(t) {
  let minor = '', major = '';
  for (let y = F.y + 8, i = 1; y < F.y + F.h; y += 8, i++) {
    if (i % 5 === 0) major += `M${F.x - 7} ${y}h7`;
    else minor += `M${F.x - 4} ${y}h4`;
  }
  return `<path d="${minor}" stroke="${t.rule}"/><path d="${major}" stroke="${t.rule2}"/>`;
}

/** The G with its bar in the ink, sized to the header's 26px. */
function mark(x, y, size, t, accent) {
  const k = size / MARK.h;
  return `<g transform="translate(${x} ${y}) scale(${n(k)})"><path d="${MARK.g}" fill="${t.ink}"/><path d="${MARK.bar}" fill="${accent}"/></g>`;
}

/** The six inks, dust blue pressed. 16px chips, 8px gap, right-aligned. */
function tray(t) {
  const size = 16, gap = 8;
  const x0 = R - (INKS.length * size + (INKS.length - 1) * gap);
  const y0 = HEAD.cy - size / 2;
  return INKS.map((ink, i) => {
    const c = t.dark ? ink.dark : ink.light;
    const x = x0 + i * (size + gap);
    const on = i === 0;
    return `<rect x="${x + 0.5}" y="${y0 + 0.5}" width="${size - 1}" height="${size - 1}" rx="2" fill="none" stroke="${on ? c : t.rule}"/>` +
           `<rect x="${x + 3.5}" y="${y0 + 3.5}" width="${size - 7}" height="${size - 7}" rx="1.5" fill="${c}"/>`;
  }).join('');
}

/** The compass from the header, north up. */
function compass(cx, cy, t, accent) {
  return `<g transform="translate(${cx - 9} ${cy - 9})" fill="none" stroke="${t.ink3}">` +
    `<circle cx="9" cy="9" r="8" fill="${t.paper}"/>` +
    `<path d="M9 1.3v1.6"/>` +
    `<path d="M9 3.4 10.85 7 9 9 7.15 7Z" fill="${accent}" stroke="none"/>` +
    `<path d="M9 14.6 10.85 11 9 9 7.15 11Z" fill="${t.ink3}" stroke="none"/>` +
    `<circle cx="9" cy="9" r="1" fill="${t.paper}" stroke="none"/></g>`;
}

/**
 * The halftone. The same print Portrait.tsx makes: on paper the darkness is
 * ink, on graphite the print emits (lum^1.2), the midtones 0.32..0.52 go in
 * the live ink, nothing under 0.14 is printed. Dots are zero-length subpaths
 * under a round cap, grouped by colour and radius, which is a tenth the bytes
 * of a <circle> each.
 */
function halftone(t, accent) {
  const { n: N, lum } = PORTRAIT;
  const cell = PT.s / N;                       // CSS px per cell
  const groups = new Map();
  for (let i = 0; i < lum.length; i++) {
    const l = lum[i];
    if (l < 0) continue;
    const st = t.dark ? Math.pow(l, 1.2) : 1 - l;
    if (st < 0.14) continue;
    const cap = t.dark ? 0.46 : 0.6;
    let r = Math.max(0.5 / cell, Math.min(cap, st * 0.72));
    r = Math.round(r * 50) / 50;               // 0.02-cell steps: ~20 groups a colour
    const color = st > 0.32 && st < 0.52 ? accent : t.ink;
    const key = `${color}|${r}`;
    const x = (i % N) + 0.5, y = Math.floor(i / N) + 0.5;
    groups.set(key, (groups.get(key) ?? '') + `M${x} ${y}h0`);
  }
  let paths = '';
  for (const [key, d] of groups) {
    const [color, r] = key.split('|');
    paths += `<path d="${d}" stroke="${color}" stroke-width="${n(r * 2)}"/>`;
  }
  return `<svg x="${PT.x}" y="${PT.y}" width="${PT.s}" height="${PT.s}" viewBox="0 0 ${N} ${N}" fill="none" stroke-linecap="round">${paths}</svg>`;
}

/** An arrowhead at (x,y) pointing along (dx,dy), 7px long, filled. */
function arrow(x, y, dx, dy, c) {
  const L = 7, Wd = 2.6;
  const px = -dy, py = dx;
  const bx = x - dx * L, by = y - dy * L;
  return `<path d="M${n(x)} ${n(y)}L${n(bx + px * Wd)} ${n(by + py * Wd)}L${n(bx - px * Wd)} ${n(by - py * Wd)}Z" fill="${c}"/>`;
}

/** The portrait's two dimensions and its callout, as the site draws them. */
function dimensions(t, accent) {
  const { x, y, s } = PT;
  const r = x + s, b = y + s;
  const dx = r + DIM, dy = b + DIM;               // dimension lines
  let g = `<g stroke="${t.rule}">` +
    `<path d="M${r + 4} ${y + 0.5}H${dx + 6}M${r + 4} ${b - 0.5}H${dx + 6}"/>` +   // extension, height
    `<path d="M${x + 0.5} ${b + 4}V${dy + 6}M${r - 0.5} ${b + 4}V${dy + 6}"/>` +   // extension, width
    `</g>`;
  g += `<g stroke="${t.ink3}">` +
    `<path d="M${dx + 0.5} ${y + 7}V${b - 7}"/>` +
    `<path d="M${x + 7} ${dy + 0.5}H${r - 7}"/></g>`;
  g += arrow(dx + 0.5, y + 0.5, 0, -1, t.ink3) + arrow(dx + 0.5, b - 0.5, 0, 1, t.ink3) +
       arrow(x + 0.5, dy + 0.5, -1, 0, t.ink3) + arrow(r - 0.5, dy + 0.5, 1, 0, t.ink3);
  const mid = y + s / 2;
  g += `<text class="anno" x="${dx + ANNO}" y="${mid}" transform="rotate(-90 ${dx + ANNO} ${mid})" text-anchor="middle">${CAREER_YEARS} yrs experience</text>`;
  g += `<text class="anno" x="${x + s / 2}" y="${BASE}" text-anchor="middle">VP of Technology, Tracxn</text>`;
  // The callout: a point on the print, a leader up and out, the note above it.
  const px = x + s * 0.75, py = y + s * 0.25;
  g += `<circle cx="${px}" cy="${py}" r="2" fill="${t.ink3}"/>` +
       `<path d="M${px + 2} ${py - 2}L${r + 12} ${HEAD.rule + 18.5}H${R}" stroke="${t.ink3}" fill="none"/>` +
       `<text class="anno" x="${R}" y="${HEAD.rule + 14}" text-anchor="end">56 × 56 halftone</text>`;
  return g;
}

function masthead(t) {
  const accent = t.dark ? INKS[0].dark : INKS[0].light;
  const css = [
    fontFace('HG', 400, 'hanken-grotesk-400'),
    fontFace('HG', 700, 'hanken-grotesk-700'),
    fontFace('PM', 400, 'ibm-plex-mono-400'),
    fontFace('AK', 600, 'anek-kannada-600'),
    `.s{font-family:HG,"Hanken Grotesk","Helvetica Neue",Arial,sans-serif}`,
    `.m,.anno{font-family:PM,"IBM Plex Mono",ui-monospace,Menlo,Consolas,monospace}`,
    `.k{font-family:AK,"Anek Kannada","Noto Sans Kannada",sans-serif;font-weight:600;font-size:14px;fill:${t.ink3}}`,
    `.nm{font-size:22px;font-weight:700;letter-spacing:-.018em;fill:${t.ink}}`,
    `.h1{font-size:32px;font-weight:700;letter-spacing:-.018em;fill:${t.ink}}`,
    `.lede{font-size:15px;fill:${t.ink2}}`,
    `.acc{fill:${accent}}`,
    `.ttl{font-size:10px;letter-spacing:.14em;fill:${t.ink2}}`,
    `.anno{font-size:9.5px;letter-spacing:.02em;fill:${t.ink3}}`,
    `.ask{font-size:10.5px;fill:${t.ink3}}`,
  ].join('\n');

  // The drawing title, on the rule it interrupts, with the compass dead centre.
  const cx = W / 2, gap = 14, ring = 9;
  const titleEnd = cx - ring - gap;
  const titleW = SHEET_TITLE.length * 7.4;           // 10px Plex Mono at .14em tracking
  const ruleL = `M${M} ${HEAD.rule + 0.5}H${n(titleEnd - titleW - gap)}`;
  const ruleR = `M${cx + ring + gap} ${HEAD.rule + 0.5}H${R}`;

  const body = `
<rect width="${W}" height="${H}" fill="${t.paper}"/>
<rect x="${F.x}" y="${F.y}" width="${F.w}" height="${F.h}" fill="none" stroke="${t.rule2}"/>
<g fill="none">${tick(F.x, F.y, t)}${tick(F.x + F.w, F.y, t)}${tick(F.x, F.y + F.h, t)}${tick(F.x + F.w, F.y + F.h, t)}</g>
<g fill="none">${ruler(t)}</g>

${mark(M, HEAD.cy - 13, 26, t, accent)}
<text class="s" x="${M + 29}" y="${HEAD.cy + 8}"><tspan class="nm">${NAME}</tspan><tspan class="k" dx="12" dy="-0.5">${NAME_KN}</tspan></text>
${tray(t)}

<path d="${ruleL}${ruleR}" stroke="${t.rule}" fill="none"/>
<text class="m ttl" x="${titleEnd}" y="${HEAD.rule + 4}" text-anchor="end">${SHEET_TITLE}</text>
${compass(cx, HEAD.rule + 0.5, t, accent)}

<text class="s h1" x="${M}" y="128">${H1[0]}</text>
<text class="s h1" x="${M}" y="163">${H1[1]}</text>
<text class="s lede" x="${M}" y="196">${LEDE[0]}</text>
<text class="s lede" x="${M}" y="218">${LEDE[1]}</text>
<text class="s lede" x="${M}" y="240">${LEDE[2]}</text>
<text class="s lede" x="${M}" y="268">${NOW[0]}</text>
<text class="s lede" x="${M}" y="290">${NOW[1]}</text>
<text class="m ask" x="${M}" y="${BASE}">${esc(ASK)}</text>

<rect x="${PT.x + 0.5}" y="${PT.y + 0.5}" width="${PT.s - 1}" height="${PT.s - 1}" fill="${t.raise}" stroke="${t.rule}"/>
${halftone(t, accent)}
${dimensions(t, accent)}`;

  const title = `${NAME}. VP of Technology at Tracxn, Bengaluru.`;
  const desc = `One sheet of an engineering drawing. The name ${NAME} with the same name in Kannada, a tray of six inks, the drawing title ${SHEET_TITLE}, the claim "${H1.join(' ')}", two short paragraphs of introduction, and a halftone portrait dimensioned ${CAREER_YEARS} years experience by VP of Technology, Tracxn.`;

  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${W} ${H}" width="${W}" height="${H}" role="img" aria-labelledby="t d">
<title id="t">${esc(title)}</title>
<desc id="d">${esc(desc)}</desc>
<style>
${css}
</style>${body}
</svg>
`;
}

for (const key of ['light', 'dark']) {
  const svg = masthead(THEMES[key]);
  writeFileSync(new URL(`masthead-${key}.svg`, OUT), svg);
  console.log(`masthead-${key}.svg  ${(svg.length / 1024).toFixed(1)} kB`);
}
