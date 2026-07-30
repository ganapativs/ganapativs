/**
 * Design tokens lifted verbatim from meetguns.com's stylesheet
 * (bundle 0756510ea7a1c7d5.css — the bottle-green palette)
 * (oklch -> hex), so the README matches the site exactly.
 */
export const THEMES = {
  light: {
    name: 'light',
    paper: '#e7eee4',
    sunk: '#d3e0d2',
    ink: '#001a0d',
    ink2: '#344d3f',
    ink3: '#566a5e',
    rule: '#c2d2c4',
    rule2: '#a2b5a7',
    accent: '#1b6c46',
    accentInk: '#004934',
    accentLit: '#7dbf92',
    accentSoft: '#deebd8',
    pos: '#0e7a5f',
    neg: '#bd4b2d',
    misregOpacity: 0.34,
  },
  dark: {
    name: 'dark',
    paper: '#03180c',
    sunk: '#000a04',
    ink: '#efeee7',
    ink2: '#bebfb5',
    ink3: '#91978a',
    rule: '#2c3a2c',
    rule2: '#465143',
    accent: '#7dbf92',
    accentInk: '#97ce9e',
    accentLit: '#7dbf92',
    accentSoft: '#193427',
    pos: '#45a385',
    neg: '#df7856',
    misregOpacity: 0.42,
  },
};

/** His real font stacks. Webfonts can't load inside an <img> SVG, so these
 *  name his faces first and degrade to the same fallbacks his CSS declares. */
export const FONTS = `
.d{font-family:"Anek Latin","Helvetica Neue",Helvetica,Arial,sans-serif}
.s{font-family:Piazzolla,Georgia,"Times New Roman",serif}
.m{font-family:"Fragment Mono",ui-monospace,SFMono-Regular,Menlo,Consolas,monospace}
.k{font-family:anekKannada,"Noto Sans Kannada","Nirmala UI","Tunga","Helvetica Neue",Arial,sans-serif}
`.trim();

export const esc = (s) =>
  String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');

const n = (v) => (Math.round(v * 100) / 100).toString();

/**
 * Wrap body markup in a root <svg>.
 * `panel:true` paints a self-contained paper panel so the graphic stays legible
 * even if the viewer's GitHub theme and OS theme disagree.
 */
export function svg({ w, h, title, desc, body, t, panel = true, css = '' }) {
  const bg = panel
    ? `<rect x="0.5" y="0.5" width="${w - 1}" height="${h - 1}" fill="${t.paper}" stroke="${t.rule}"/>`
    : '';
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${w} ${h}" width="${w}" height="${h}" role="img" aria-labelledby="t d" font-kerning="normal">
<title id="t">${esc(title)}</title>
<desc id="d">${esc(desc)}</desc>
<style>
${FONTS}
text{fill:${t.ink}}
.lbl{fill:${t.ink2}}
.dim{fill:${t.ink3}}
.acc{fill:${t.accent}}
.tk{letter-spacing:.14em}
${css}
@media (prefers-reduced-motion:reduce){*{animation:none!important;transition:none!important}}
</style>
${bg}
${body}
</svg>`;
}
