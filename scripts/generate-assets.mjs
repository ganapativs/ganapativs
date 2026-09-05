/**
 * Builds assets/masthead-light.svg and assets/masthead-dark.svg.
 *
 *   node scripts/generate-assets.mjs      # zero dependencies
 *
 * The header is one sheet of meetguns.com's drawing at 800 x 360: the frame
 * with its registration ticks, the measuring edge, the mark and the name, the
 * ink tray, the drawing title on its rule with the compass, the claim, and a
 * specimen tray of six open-source projects, each drawn as the part it is.
 *
 * Everything the image says is read off the live site's constants (see
 * TOKENS below and the sync note in NOTES.md). Fonts and the repo list are
 * pre-cut by scripts/prepare.py into assets/src/*.json.
 *
 * No animation, on purpose: the site's own rule is that nothing moves unless
 * the reader caused it, and a picture in a README cannot be caused.
 */
import { readFileSync, writeFileSync } from 'node:fs';

const SRC = new URL('../assets/src/', import.meta.url);
const OUT = new URL('../assets/', import.meta.url);
const FONTS = JSON.parse(readFileSync(new URL('_fonts.json', SRC), 'utf8'));
// Every original (non-fork) public repo on the account, from the GitHub API
// via scripts/prepare.py: name, stars, year created, language. Sorted by stars.
const REPOS = JSON.parse(readFileSync(new URL('_repos.json', SRC), 'utf8'));
const TOTAL_STARS = REPOS.reduce((a, r) => a + r.stars, 0);
const NPM_PACKAGES = 16;                                      // lib/resume.ts PUBLIC_WORK
const starsOf = (name) => REPOS.find((r) => r.name === name)?.stars ?? 0;
const fmt = (v) => v.toLocaleString('en-US');


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
const BASE = 319;                                                // one shared foot baseline: the ask line, and the tray's bottom rule sits on it

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
 * Fig. C: six projects on a specimen tray, each drawn as the part it is, in
 * four strokes or fewer, with its name and one true number.
 */
function specimens(t, accent) {
  const inks = INKS.map((i) => (t.dark ? i.dark : i.light));
  // Each glyph is drawn in a 48 x 32 box centred on the origin, in the same
  // conventions as fig. 1's slabs: line, not shading; at most one solid mark
  // in the ink; the greyed parts in --rule-2 so the ink stays the subject.
  const greek = (d) => `<path d="${d}" stroke="${t.rule2}" stroke-width="1.5"/>`;
  const items = [
    { name: 'microcharts', spec: `${fmt(starsOf('microcharts'))} stars · 2026`, live: true,
      // A sentence with two charts set in it at word size. That is the library.
      glyph: greek('M-22 -8H-11M14 -8H22M-22 2H-6M14 2H22M-22 12H4') +
        `<path d="M-7 -5L-3.5 -11L0 -7L3.5 -12.5L7 -8.5L10.5 -11" stroke="${accent}" stroke-width="1.75"/>` +
        [[-2, 4], [1.5, 7.5], [5, 5.5], [8.5, 10]].map(([x, h]) => `<rect x="${x}" y="${4 - h}" width="2.2" height="${h}" fill="${accent}" stroke="none"/>`).join('') },
    { name: 'bttn.css', spec: `${fmt(starsOf('bttn.css'))} stars · 2016`,
      // A button on its press depth, a pointer over it.
      glyph: `<rect x="-19" y="-5" width="34" height="15" rx="3" stroke="${t.rule2}"/>` +
        `<rect x="-21" y="-9" width="34" height="15" rx="3" fill="${t.raise}"/>` +
        `<path d="M-13 -1.5H5" stroke="${accent}" stroke-width="2"/>` +
        `<path d="M13 2L13 14L16.2 10.9L18.6 16L20.8 15L18.4 10L22.5 10Z" fill="${t.ink}" stroke="${t.paper}" stroke-width="0.75" stroke-linejoin="miter"/>` },
    { name: 'react-spectrum', spec: `${fmt(starsOf('react-spectrum'))} stars · 2019`,
      // Placeholder text, justified, every word a different ink.
      glyph: (() => {
        const rows = [[10, 6, 14, 8], [8, 12, 5, 13], [14, 7, 9, 8], [11, 9, 7]];
        let out = '', k = 0;
        rows.forEach((ws, r) => {
          let x = -22;
          for (const w of ws) {
            out += `<rect x="${x}" y="${-12 + r * 7}" width="${w}" height="4.5" rx="2" fill="${inks[k++ % 6]}" stroke="none"/>`;
            x += w + 2;
          }
        });
        return out;
      })() },
    { name: 'react-dynamic-import', spec: `${fmt(starsOf('react-dynamic-import'))} stars · 2018`,
      // The app, the chunk it asks for, and the component that arrives in it.
      glyph: `<rect x="-23" y="-11" width="16" height="22"/>` + greek('M-19 -5H-11M-19 0H-11M-19 5H-14') +
        `<path d="M-4 0H7M3.5 -3.5L7 0L3.5 3.5" stroke="${accent}" stroke-width="1.5"/>` +
        `<rect x="10" y="-11" width="14" height="22" stroke-dasharray="2.5 2"/>` +
        `<rect x="13" y="-3" width="8" height="6" rx="1" fill="${accent}" stroke="none"/>` },
    { name: 'pure-cache', spec: `${fmt(starsOf('pure-cache'))} stars · 2017`,
      // A store of entries, one fresh, and the clock that expires them.
      glyph: `<rect x="-22" y="-13" width="32" height="26" rx="1"/>` +
        `<rect x="-18" y="-9" width="20" height="4" rx="2" fill="${t.rule2}" stroke="none"/>` +
        `<rect x="-18" y="-2" width="24" height="4" rx="2" fill="${accent}" stroke="none"/>` +
        `<rect x="-18" y="5" width="15" height="4" rx="2" fill="${t.rule2}" stroke="none"/>` +
        `<circle cx="15" cy="7" r="7.5" fill="${t.paper}"/><path d="M15 7V2.5M15 7H18.5" stroke="${accent}" stroke-width="1.5"/>` },
    { name: 'sgb', spec: 'gold bonds · 2021',
      // An ingot, and the yield curve it is ranked by.
      glyph: `<path d="M-19 14H11L7 5H-15Z" fill="${t.paper}"/><path d="M-15 5L-10 -1H12L7 5Z" fill="${t.raise}"/><path d="M7 5L11 14L16 8L12 -1Z" fill="${t.sunk}"/>` +
        `<path d="M-21 -6L-13 -10L-5 -7.5L4 -13L13 -15" stroke="${accent}" stroke-width="1.5"/><circle cx="13" cy="-15" r="1.8" fill="${accent}" stroke="none"/>` },
  ];
  // The tray fills the right half from the figure title to the foot baseline:
  // three rows of 72 from 104 land the bottom rule at 320, on the line the
  // ask sits on. Inside a tile: 7px, the glyph (48 x 32 at .95), 6px, the
  // name, the spec, 5px. The footer line went into the title so the rows
  // could have the room.
  const gx = 500, gy = 104, cw = 130, rh = 72, cols = 2;
  let g = `<text class="anno" x="${R}" y="${HEAD.rule + 14}" text-anchor="end">open source · ${REPOS.length} repos · ${fmt(TOTAL_STARS)} stars · ${NPM_PACKAGES} on npm</text>`;
  const rows = items.length / cols;
  let grid = `M${gx + 0.5} ${gy + 0.5}H${gx + cw * cols - 0.5}V${gy + rh * rows - 0.5}H${gx + 0.5}Z`;
  for (let c = 1; c < cols; c++) grid += `M${gx + c * cw + 0.5} ${gy}V${gy + rh * rows}`;
  for (let r = 1; r < rows; r++) grid += `M${gx} ${gy + r * rh + 0.5}H${gx + cw * cols}`;
  g += `<path d="${grid}" stroke="${t.rule}" fill="none"/>`;
  items.forEach((it, i) => {
    const x = gx + (i % cols) * cw, y = gy + Math.floor(i / cols) * rh;
    g += `<g transform="translate(${x + cw / 2} ${y + 23}) scale(.95)" fill="none" stroke="${t.ink2}" stroke-width="1.25" stroke-linejoin="round" stroke-linecap="round">${it.glyph}</g>` +
      `<text class="s lbl" x="${x + cw / 2}" y="${y + 52}" text-anchor="middle" fill="${it.live ? accent : t.ink}">${it.name}</text>` +
      `<text class="anno" x="${x + cw / 2}" y="${y + 64.5}" text-anchor="middle">${it.spec}</text>`;
  });
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
    `.lbl{font-size:11px;font-weight:500}`,
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

${specimens(t, accent)}`;

  const title = `${NAME}. VP of Technology at Tracxn, Bengaluru.`;
  const desc = `One sheet of an engineering drawing. The name ${NAME} with the same name in Kannada, a tray of six inks, the drawing title ${SHEET_TITLE}, the claim "${H1.join(' ')}", two short paragraphs of introduction, and a tray of six open-source projects drawn as parts: microcharts, bttn.css, react-spectrum, react-dynamic-import, pure-cache and sgb, each with its stars and year.`;

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
