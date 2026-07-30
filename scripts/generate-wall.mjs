/**
 * Builds the chart wall out of 40 REAL renders from @microcharts/mcp.
 *
 * Data comes from each type's own documented `sample` (via get_microchart), so
 * nothing on the wall is invented — every shape is what the library draws when
 * you follow its docs. Names come from the catalogue's `name` field.
 *
 * Each chart is rendered `bare` (markup, no stylesheet) and nested as a
 * positioned <svg>. One copy of the stylesheet is inlined at the top, wrapped in
 * CDATA because of the `@property ... syntax:"<number>"` XML issue.
 */
import { spawn } from 'node:child_process';
import { writeFileSync, readFileSync } from 'node:fs';
import { defineTheme } from '@microcharts/react/theme';

const OUT = new URL('../assets/', import.meta.url);
const STYLES = readFileSync(
  new URL('../node_modules/@microcharts/react/dist/styles.css', import.meta.url), 'utf8');

const SLUGS = [
  'sparkline', 'sparkbar', 'forecast-cone', 'bullet', 'activity-grid', 'trend-arrow', 'status-dot', 'progress',
  'rug-strip', 'mini-bar', 'pictogram-row', 'seismogram', 'heat-strip', 'dot-plot', 'dumbbell', 'slope',
  'micro-scatter', 'segmented-bar', 'histogram-strip', 'micro-box', 'progress-ring', 'micro-donut', 'funnel', 'waterfall',
  'horizon', 'tally-marks', 'dice-pips', 'moon-phase', 'hourglass', 'honeycomb', 'constellation', 'tree-rings',
  'city-skyline', 'music-staff', 'thermometer', 'balance-beam', 'wind-barb', 'win-prob-worm', 'waveform', 'quadrant-dot',
];

const SITE = {
  light: { accent: '#1b6c46', stroke: '#001a0d', neutral: '#566a5e', band: '#c2d2c4',
    surface: '#e7eee4', surfaceInk: '#001a0d', surfaceEdge: '#c2d2c4', ink: '#001a0d', ink3: '#566a5e', rule: '#c2d2c4', paper: '#e7eee4',
    cat: ['#1b6c46', '#a48030', '#97403e', '#36698c', '#6b3c7e', '#72523d'] },
  dark: { accent: '#7dbf92', stroke: '#efeee7', neutral: '#91978a', band: '#2c3a2c',
    surface: '#03180c', surfaceInk: '#efeee7', surfaceEdge: '#2c3a2c', ink: '#efeee7', ink3: '#91978a', rule: '#2c3a2c', paper: '#03180c',
    cat: ['#7dbf92', '#e2c376', '#e78c7f', '#85b2d9', '#c08acc', '#c19f88'] },
};
const VALENCE = {
  light: { '--mc-positive': '#0e7a5f', '--mc-negative': '#bd4b2d', '--mc-moon': '#c1922f' },
  dark: { '--mc-positive': '#45a385', '--mc-negative': '#df7856', '--mc-moon': '#e0be6f' },
};
const FONT = '"Anek Latin","Helvetica Neue",Helvetica,Arial,sans-serif';
const MONO = '"Fragment Mono",ui-monospace,SFMono-Regular,Menlo,Consolas,monospace';

function tokens(variant) {
  const s = SITE[variant];
  const t = defineTheme({
    extends: 'editorial', accent: s.accent, stroke: s.stroke, neutral: s.neutral, band: s.band,
    surface: s.surface, surfaceInk: s.surfaceInk, surfaceEdge: s.surfaceEdge,
    cat: s.cat, font: FONT, fontNumeric: MONO,
  });
  return { ...t.vars, ...VALENCE[variant] };
}

/* ------------------------------ MCP client -------------------------------- */

async function openMcp() {
  const proc = spawn('npx', ['-y', '@microcharts/mcp@0.1.7'], { stdio: ['pipe', 'pipe', 'pipe'] });
  let buf = ''; const pending = new Map(); let id = 0;
  proc.stdout.on('data', (d) => {
    buf += d.toString(); let i;
    while ((i = buf.indexOf('\n')) >= 0) {
      const line = buf.slice(0, i).trim(); buf = buf.slice(i + 1);
      if (!line) continue;
      try { const m = JSON.parse(line); if (m.id && pending.has(m.id)) { pending.get(m.id)(m); pending.delete(m.id); } } catch {}
    }
  });
  const send = (method, params) => new Promise((res) => {
    const my = ++id; pending.set(my, res);
    proc.stdin.write(JSON.stringify({ jsonrpc: '2.0', id: my, method, params }) + '\n');
  });
  await send('initialize', { protocolVersion: '2024-11-05', capabilities: {}, clientInfo: { name: 'wall', version: '1' } });
  proc.stdin.write(JSON.stringify({ jsonrpc: '2.0', method: 'notifications/initialized', params: {} }) + '\n');
  const call = async (name, args) => {
    const r = await send('tools/call', { name, arguments: args });
    if (r.error) throw new Error(r.error.message);
    return r.result.content.filter((c) => c.type === 'text').map((c) => c.text);
  };
  return {
    get: async (slug) => JSON.parse((await call('get_microchart', { slug }))[0]),
    render: async (args) => {
      const parts = await call('render_microchart', args);
      if (!parts[0] || !parts[0].trimStart().startsWith('<svg')) {
        throw new Error(parts[0] ? parts[0].split('\n')[0].slice(0, 160) : 'no svg');
      }
      return { svg: parts[0], summary: (parts[1] || '').replace(/\s*\(image\/svg\+xml,[^)]*\)\s*$/, '').trim() };
    },
    close: () => proc.kill(),
  };
}

/* --------------------------------- build ---------------------------------- */

const CW = 112, CH = 34;           // chart box
const COLS = 6, M = 34, W = 880;
const colW = (W - M * 2) / COLS;
const cellH = 84, top = 112;

const mcp = await openMcp();

// 1. collect samples + real names once
const specs = [];
for (const slug of SLUGS) {
  try {
    const meta = await mcp.get(slug);
    const sample = meta.sample ?? {};
    const { data, ...props } = sample;
    specs.push({ slug, name: meta.name, tagline: meta.tagline, data, props });
  } catch (e) {
    console.error(`sample FAIL ${slug}: ${e.message}`);
  }
}
console.log(`collected ${specs.length}/${SLUGS.length} samples`);

// 2. render each, per theme
const rendered = { light: [], dark: [] };
let fails = 0;
for (const variant of ['light', 'dark']) {
  for (const s of specs) {
    try {
      const args = { type: s.slug, format: 'bare', props: { ...s.props, width: CW, height: CH } };
      if (s.data !== undefined) args.data = s.data;
      const { svg, summary } = await mcp.render(args);
      rendered[variant].push({ ...s, svg, summary });
    } catch (e) {
      fails++;
      console.error(`render FAIL ${s.slug} (${variant}): ${e.message}`);
      rendered[variant].push({ ...s, svg: null, summary: '' });
    }
  }
}
mcp.close();

// 3. compose
function compose(variant) {
  const t = SITE[variant];
  const items = rendered[variant].filter((r) => r.svg);
  const ROWS = Math.ceil(items.length / COLS);
  const H = top + ROWS * cellH + 62;
  const vars = Object.entries(tokens(variant)).map(([k, v]) => `${k}:${v}`).join(';');

  const cells = items.map((r, i) => {
    const c = i % COLS, row = Math.floor(i / COLS);
    const x = M + c * colW, y = top + row * cellH;
    // position the nested chart; keep its own viewBox
    const nested = r.svg.replace(/^<svg /, `<svg x="${x}" y="${y}" `);
    return `<g class="cell" style="animation-delay:${(0.028 * i).toFixed(2)}s">
${nested}
<text class="lab" x="${x}" y="${y + CH + 17}">${r.name}</text>
</g>`;
  }).join('\n');

  const css = `${STYLES}
:root{${vars}}
.lab{font-family:${MONO};font-size:9.5px;fill:${t.ink3}}
.eyebrow{font-family:${MONO};font-size:10.5px;letter-spacing:.14em;fill:${t.ink3}}
.head{font-family:${FONT};font-size:26px;font-weight:700;fill:${t.ink}}
.foot{font-family:Piazzolla,Georgia,"Times New Roman",serif;font-size:15.5px;fill:${t.neutral}}
.footr{font-family:${MONO};font-size:10px;letter-spacing:.14em;fill:${t.accent}}
@media (prefers-reduced-motion:no-preference){
  .cell{animation:cellin .5s cubic-bezier(0,0,.2,1) both}
  @keyframes cellin{from{opacity:0;transform:translateY(5px)}to{opacity:1;transform:translateY(0)}}
}`;

  const desc = `A wall of ${items.length} chart types from the microcharts catalogue, each rendered by the library at word size from the sample data in its own documentation. ` +
    items.map((r) => `${r.name}: ${r.tagline}`).join(' ');

  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${W} ${H}" width="${W}" height="${H}" role="img" aria-labelledby="wt wd">
<title id="wt">${items.length} chart types from microcharts, rendered by the library at word size</title>
<desc id="wd">${desc.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')}</desc>
<style><![CDATA[${css}]]></style>
<rect x="0.5" y="0.5" width="${W - 1}" height="${H - 1}" fill="${t.paper}" stroke="${t.rule}"/>
<text class="eyebrow" x="${M}" y="34">MICROCHARTS.DEV · ${items.length} CHART TYPES · RENDERED BY THE LIBRARY</text>
<line x1="${M}" y1="50" x2="${W - M}" y2="50" stroke="${t.rule}" stroke-width="1"/>
<text class="head" x="${M}" y="84">Every chart small enough to sit inside a sentence.</text>
${cells}
<line x1="${M}" y1="${H - 46}" x2="${W - M}" y2="${H - 46}" stroke="${t.rule}" stroke-width="1"/>
<text class="foot" x="${M}" y="${H - 22}">No axes, no legends, no gridlines — at this size each one costs more ink than it returns.</text>
<text class="footr" x="${W - M}" y="${H - 22}" text-anchor="end">ZERO RUNTIME DEPS · ~1–7 kB EACH</text>
</svg>`;
}

for (const variant of ['light', 'dark']) {
  writeFileSync(new URL(`wall-${variant}.svg`, OUT), compose(variant));
}
const n = rendered.light.filter((r) => r.svg).length;
console.log(`\nwall: ${n} real charts composed, ${fails} render failures`);
writeFileSync(new URL('wall-manifest.json', OUT),
  JSON.stringify(rendered.light.filter(r => r.svg).map(({ slug, name, tagline, summary }) => ({ slug, name, tagline, summary })), null, 2) + '\n');
