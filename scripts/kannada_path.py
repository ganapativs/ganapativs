"""Shape the Kannada name with HarfBuzz and emit a single SVG path,
so the masthead renders identically on machines with no Kannada font."""
import uharfbuzz as hb
from fontTools.ttLib import TTFont
from fontTools.pens.svgPathPen import SVGPathPen
from fontTools.varLib.instancer import instantiateVariableFont

TEXT = "ಗಣಪತಿ ವಿ ಎಸ್"
FONT = "/tmp/kn.ttf"
SIZE = 21.0  # target font-size in SVG user units

# pin the variable font to a normal weight/width
tt = instantiateVariableFont(TTFont(FONT), {"wght": 500, "wdth": 100}, inplace=False)
tt.save("/tmp/kn-static.ttf")

with open("/tmp/kn-static.ttf", "rb") as f:
    data = f.read()
face = hb.Face(data)
font = hb.Font(face)
upem = face.upem
buf = hb.Buffer()
buf.add_str(TEXT)
buf.guess_segment_properties()
hb.shape(font, buf)

tt2 = TTFont("/tmp/kn-static.ttf")
glyf = tt2.getGlyphSet()
order = tt2.getGlyphOrder()
scale = SIZE / upem

parts, x, y = [], 0.0, 0.0
for info, pos in zip(buf.glyph_infos, buf.glyph_positions):
    gname = order[info.codepoint]
    pen = SVGPathPen(glyf)
    glyf[gname].draw(pen)
    d = pen.getCommands()
    if d:
        # y flips: font space is up-positive, SVG is down-positive
        tx = (x + pos.x_offset) * scale
        ty = (y + pos.y_offset) * scale
        parts.append(f'<path transform="translate({tx:.3f} {ty:.3f}) scale({scale:.6f} {-scale:.6f})" d="{d}"/>')
    x += pos.x_advance
    y += pos.y_advance

width = x * scale
print(f"ADVANCE_WIDTH={width:.2f}")
print("GLYPH_COUNT=%d" % len(parts))
with open("assets/_kannada-path.svgfrag", "w") as f:
    f.write("\n".join(parts))
print("wrote assets/_kannada-path.svgfrag")
