"""Generate Pyydys PWA icons (192, 512, apple-touch 180, favicon 32).

Renders a flat blue rounded-square with a simple wrench glyph.
Run once; commits the PNG output to /app/frontend/public/.
"""
from PIL import Image, ImageDraw

OUT_DIR = "/app/frontend/public"
BG = (37, 99, 235)        # blue-600
FG = (255, 255, 255)


def rounded_rect(size, radius_ratio=0.22):
    img = Image.new("RGBA", (size, size), (0, 0, 0, 0))
    draw = ImageDraw.Draw(img)
    r = int(size * radius_ratio)
    draw.rounded_rectangle([(0, 0), (size - 1, size - 1)], radius=r, fill=BG)
    return img, draw


def draw_wrench(draw, size):
    """Draw a stylized wrench centered on the icon."""
    # Wrench geometry on a 1000x1000 canvas, then scaled to `size`.
    s = size / 1000.0

    # Diagonal handle (rounded rectangle, rotated visually via parallelogram)
    # Simplify: draw a thick diagonal line via polygon.
    # Handle going from upper-left to lower-right.
    handle_pts = [
        (300, 470),
        (380, 390),
        (760, 770),
        (680, 850),
    ]
    handle_pts = [(int(x * s), int(y * s)) for x, y in handle_pts]
    draw.polygon(handle_pts, fill=FG)

    # End cap (small circle on lower-right)
    cap_r = int(70 * s)
    cap_c = (int(720 * s), int(810 * s))
    draw.ellipse(
        [cap_c[0] - cap_r, cap_c[1] - cap_r, cap_c[0] + cap_r, cap_c[1] + cap_r],
        fill=FG,
    )

    # Open-end head: an arc / "C" shape on upper-left.
    head_cx, head_cy = int(290 * s), int(280 * s)
    head_outer = int(200 * s)
    head_inner = int(110 * s)
    # Outer disc
    draw.ellipse(
        [head_cx - head_outer, head_cy - head_outer,
         head_cx + head_outer, head_cy + head_outer],
        fill=FG,
    )
    # Inner hole (transparent against blue bg means we punch blue back in)
    draw.ellipse(
        [head_cx - head_inner, head_cy - head_inner,
         head_cx + head_inner, head_cy + head_inner],
        fill=BG,
    )
    # Notch (a rectangle cut into the disc towards upper-right)
    notch = [
        (head_cx, head_cy - head_outer - 10),
        (head_cx + head_outer + 10, head_cy - head_outer - 10),
        (head_cx + head_outer + 10, head_cy + int(20 * s)),
        (head_cx + int(20 * s), head_cy + int(20 * s)),
    ]
    draw.polygon(notch, fill=BG)


def make_icon(size, path, padding_ratio=0.0):
    img, draw = rounded_rect(size)
    if padding_ratio > 0:
        # For maskable: keep main art inside safe area, but our drawing already
        # has comfortable padding so this is a no-op.
        pass
    draw_wrench(draw, size)
    img.save(path, "PNG", optimize=True)
    print(f"wrote {path}")


def make_favicon(path):
    # 64px icon converted to .ico
    img, draw = rounded_rect(64)
    draw_wrench(draw, 64)
    img.save(path, format="ICO", sizes=[(16, 16), (32, 32), (48, 48), (64, 64)])
    print(f"wrote {path}")


if __name__ == "__main__":
    make_icon(192, f"{OUT_DIR}/icon-192.png")
    make_icon(512, f"{OUT_DIR}/icon-512.png")
    # Maskable variant — same art, browsers crop inside safe zone (80% radius)
    make_icon(512, f"{OUT_DIR}/icon-maskable-512.png")
    make_icon(180, f"{OUT_DIR}/apple-touch-icon.png")
    make_favicon(f"{OUT_DIR}/favicon.ico")
