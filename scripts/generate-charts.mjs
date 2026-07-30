/**
 * Renders the word-sized charts with the REAL library, via the microcharts MCP
 * server (`npx -y @microcharts/mcp`). Two things this buys over hand-drawing:
 *   1. the geometry is whatever @microcharts/react actually ships, and
 *   2. the alt text is his own generated summary, not my description of it.
 *
 * Theming goes through defineTheme() from @microcharts/react/theme, seeded with
 * the tokens lifted from meetguns.com. `positive` / `negative` are deliberately
 * left alone — the library keeps them on a colour-blind-safe pair and that is
 * not my call to override.
 */
import { spawn } from 'node:child_process';
import { writeFileSync, mkdirSync } from 'node:fs';
import { defineTheme } from '@microcharts/react/theme';

const OUT = new URL('../assets/', import.meta.url);
mkdirSync(OUT, { recursive: true });

/* ------------------------------- palette --------------------------------- */

const SITE = {
  light: {
    accent: '#1b6c46', stroke: '#001a0d', neutral: '#566a5e', band: '#c2d2c4',
    surface: '#e7eee4', surfaceInk: '#001a0d', surfaceEdge: '#c2d2c4',
    cat: ['#1b6c46', '#a48030', '#97403e', '#36698c', '#6b3c7e', '#72523d'],
  },
  dark: {
    accent: '#7dbf92', stroke: '#efeee7', neutral: '#91978a', band: '#2c3a2c',
    surface: '#03180c', surfaceInk: '#efeee7', surfaceEdge: '#2c3a2c',
    cat: ['#7dbf92', '#e2c376', '#e78c7f', '#85b2d9', '#c08acc', '#c19f88'],
  },
};

const FONT = '"Anek Latin","Helvetica Neue",Helvetica,Arial,sans-serif';
const MONO = '"Fragment Mono",ui-monospace,SFMono-Regular,Menlo,Consolas,monospace';

// The library's own light/dark values for the valence + moon tokens. Pinned per
// file so a light-OS reader viewing GitHub in dark mode still gets dark values.
const VALENCE = {
  light: { '--mc-positive': '#0e7a5f', '--mc-negative': '#bd4b2d', '--mc-moon': '#c1922f' },
  dark: { '--mc-positive': '#45a385', '--mc-negative': '#df7856', '--mc-moon': '#e0be6f' },
};

function themeVars(variant) {
  const s = SITE[variant];
  const t = defineTheme({
    extends: 'editorial',
    accent: s.accent, stroke: s.stroke, neutral: s.neutral, band: s.band,
    surface: s.surface, surfaceInk: s.surfaceInk, surfaceEdge: s.surfaceEdge,
    cat: s.cat, font: FONT, fontNumeric: MONO,
  });
  return { ...t.vars, ...VALENCE[variant] };
}

/** Unlayered `:root` — beats the library's layered `:where(:root)` and its
 *  prefers-color-scheme block, so each file is deterministically one theme. */
function themeStyle(variant) {
  const vars = themeVars(variant);
  const decls = Object.entries(vars).map(([k, v]) => `${k}:${v}`).join(';');
  return `<style><![CDATA[:root{${decls}}]]></style>`;
}

/**
 * The library's stylesheet declares `@property --mc-seat{syntax:"<number>"}`.
 * Inlined into a standalone .svg that browsers parse as XML, that `<number>`
 * reads as an element start tag and the whole file fails to parse — the image
 * renders as nothing. Wrapping the CSS in CDATA makes it character data again.
 * Reported upstream; harmless to keep once fixed.
 */
function cdataWrapStyles(svgText) {
  return svgText.replace(/<style>([\s\S]*?)<\/style>/g, (_m, css) =>
    css.includes('<![CDATA[') ? `<style>${css}</style>` : `<style><![CDATA[${css}]]></style>`);
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
  await send('initialize', { protocolVersion: '2024-11-05', capabilities: {}, clientInfo: { name: 'readme-build', version: '1' } });
  proc.stdin.write(JSON.stringify({ jsonrpc: '2.0', method: 'notifications/initialized', params: {} }) + '\n');
  return {
    render: async (args) => {
      const r = await send('tools/call', { name: 'render_microchart', arguments: args });
      if (r.error) throw new Error(r.error.message);
      const parts = r.result.content.filter((c) => c.type === 'text').map((c) => c.text);
      if (!parts[0] || !parts[0].trimStart().startsWith('<svg')) {
        throw new Error(parts[0] ? parts[0].split('\n')[0] : 'no svg returned');
      }
      return { svg: parts[0], summary: (parts[1] || '').replace(/\s*\(image\/svg\+xml,[^)]*\)\s*$/, '').trim() };
    },
    close: () => proc.kill(),
  };
}

/* ------------------------------- the charts ------------------------------- */
// Real, public figures — see NOTES.md. Nothing here is a count that moves on its
// own (no stars, no measured kB); those belong in markdown, not in a generated
// image, so no rebuild is ever needed to keep this page true.

// Role level by year, derived from the promotion years, so the series extends
// itself on rebuild instead of hard-coding an end year.
const ROLE_STEPS = [[2013, 0], [2014, 1], [2015, 2], [2016, 3], [2020, 4], [2022, 5], [2023, 6]];
const roleLevels = [];
for (let y = ROLE_STEPS[0][0]; y <= new Date().getFullYear(); y++) {
  const step = [...ROLE_STEPS].reverse().find(([sy]) => sy <= y);
  roleLevels.push(step ? step[1] : 0);
}

const INLINE = [
  { name: 'inline-ladder', type: 'sparkline', w: 92, h: 20,
    data: roleLevels,
    props: { title: 'Role level by year, since 2013' } },

  { name: 'inline-promos', type: 'pictogram-row', w: 58, h: 20,
    props: { value: 4, total: 4, title: 'Promotions at one company' } },

  { name: 'inline-npm', type: 'tally-marks', w: 80, h: 20,
    props: { value: 15, title: 'Published npm packages' } },



  { name: 'inline-status', type: 'status-dot', w: 16, h: 20,
    props: { status: 'ok', pulse: true, title: 'Shipping' } },
];

/* --------------------------------- build ---------------------------------- */

const mcp = await openMcp();
const manifest = {};
let ok = 0, failed = 0;

for (const spec of INLINE) {
  for (const variant of ['light', 'dark']) {
    try {
      const args = { type: spec.type, props: { ...spec.props, width: spec.w, height: spec.h } };
      if (spec.data) args.data = spec.data;
      const { svg, summary } = await mcp.render(args);
      const safe = cdataWrapStyles(svg);
      // inject the theme immediately after the library's own <style>
      const themed = safe.includes('</style>')
        ? safe.replace('</style>', `</style>${themeStyle(variant)}`)
        : safe.replace(/(<svg[^>]*>)/, `$1${themeStyle(variant)}`);
      writeFileSync(new URL(`${spec.name}-${variant}.svg`, OUT), themed);
      if (variant === 'light') {
        manifest[spec.name] = { type: spec.type, w: spec.w, h: spec.h, summary };
      }
      ok++;
    } catch (e) {
      failed++;
      console.error(`FAIL ${spec.name}-${variant} (${spec.type}): ${e.message}`);
    }
  }
}

writeFileSync(new URL('summaries.json', OUT), JSON.stringify(manifest, null, 2) + '\n');
mcp.close();
console.log(`\nrendered ${ok} files, ${failed} failed`);
for (const [k, v] of Object.entries(manifest)) console.log(`  ${k.padEnd(15)} ${v.type.padEnd(15)} "${v.summary}"`);
