"""One-off: key a flat magenta background to transparency with despill.

Magenta (#FF00FF) has uniquely low green relative to red+blue, while the
ivory / gold / espresso artwork does not — so we derive alpha from
"magentaness" = (R+B)/2 - G and suppress the magenta tint on edge pixels.

The raw key yields a crisp, sticker-like silhouette. To make the art melt
into the tile instead of sitting on a hard outline, we feather the alpha:
slightly erode it inward (so leftover key colour doesn't bleed) and then
Gaussian-blur it, producing a soft, polished edge.
"""
import sys

from PIL import Image, ImageFilter

LOW, HIGH = 40.0, 120.0  # magentaness thresholds for full opaque / full clear
FEATHER_RADIUS = 4.0  # px (at source resolution) of soft alpha falloff
ERODE_RADIUS = 1.5  # px inward contraction before feathering


def key_image(src: str, dst: str) -> None:
    im = Image.open(src).convert("RGB")
    w, h = im.size
    px = im.load()
    out = Image.new("RGBA", (w, h))
    op = out.load()
    sum_r = sum_g = sum_b = opaque = 0
    for y in range(h):
        for x in range(w):
            r, g, b = px[x, y]
            magentaness = (r + b) / 2.0 - g
            if magentaness <= LOW:
                a = 255
            elif magentaness >= HIGH:
                a = 0
            else:
                a = int(255 * (1 - (magentaness - LOW) / (HIGH - LOW)))
            if magentaness > 0:
                # Despill (applied even where alpha is 0): clamp red/blue down
                # to green so no magenta survives in the RGB channels.
                r = min(r, g)
                b = min(b, g)
            op[x, y] = (r, g, b, a)
            if a == 255:
                sum_r += r
                sum_g += g
                sum_b += b
                opaque += 1

    # Flood the transparent background's RGB with the motif's own mean tone.
    # Transparent pixels keep colour data that bleeds into the feathered edge
    # on resize/composite; matching it to the art makes that bleed invisible.
    if opaque:
        mean = (sum_r // opaque, sum_g // opaque, sum_b // opaque)
        for y in range(h):
            for x in range(w):
                r, g, b, a = op[x, y]
                if a == 0:
                    op[x, y] = (mean[0], mean[1], mean[2], 0)

    # Soften the silhouette: pull the alpha in slightly, then blur it so the
    # edge fades gently into whatever sits behind it (the tile gradient).
    alpha = out.getchannel("A")
    alpha = alpha.filter(ImageFilter.MinFilter(_odd(ERODE_RADIUS)))
    alpha = alpha.filter(ImageFilter.GaussianBlur(FEATHER_RADIUS))
    out.putalpha(alpha)
    out.save(dst)


def _odd(radius: float) -> int:
    """MinFilter needs an odd kernel size >= 3."""
    size = max(3, int(radius) * 2 + 1)
    return size if size % 2 else size + 1


if __name__ == "__main__":
    for pair in sys.argv[1:]:
        src, dst = pair.split("::")
        key_image(src, dst)
        print(f"keyed {dst}")
