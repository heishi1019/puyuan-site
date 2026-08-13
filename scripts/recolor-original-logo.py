from pathlib import Path

from PIL import Image, ImageFilter, ImageOps


SOURCE = Path(
    r"C:\Users\黑石\AppData\Local\Temp\codex-clipboard-34a484c6-b0d2-4394-95cc-72bc7b4d065b.png"
)
OUTPUT = Path(r"E:\Claude\puyuan-site\public\logo-concepts\logo-v2.png")
CROP = (520, 165, 985, 555)
CANVAS_SIZE = (2048, 1152)
LIME_TOP = (239, 255, 160)
LIME_MIDDLE = (215, 255, 0)
LIME_BOTTOM = (181, 238, 0)
BLACK_EDGE = (8, 8, 8)
BLACK_CENTER = (24, 24, 23)


def color_alpha(pixel: tuple[int, int, int]) -> int:
    red, green, blue = pixel
    chroma = max(green, blue) - red
    return max(0, min(255, round((chroma - 2) * 8.5)))


def mix_color(
    start: tuple[int, int, int],
    end: tuple[int, int, int],
    amount: float,
) -> tuple[int, int, int]:
    return tuple(
        round(start[channel] + (end[channel] - start[channel]) * amount)
        for channel in range(3)
    )


def main() -> None:
    source = Image.open(SOURCE).convert("RGB").crop(CROP)
    alpha = Image.new("L", source.size)
    alpha.putdata([color_alpha(pixel) for pixel in source.getdata()])

    recolored = Image.new("RGBA", source.size, (0, 0, 0, 0))
    recolored_pixels = recolored.load()
    alpha_pixels = alpha.load()

    for y in range(source.height):
        for x in range(source.width):
            opacity = alpha_pixels[x, y]
            if opacity == 0:
                continue
            vertical = y / max(1, source.height - 1)
            if vertical < 0.48:
                color = mix_color(LIME_TOP, LIME_MIDDLE, vertical / 0.48)
            else:
                color = mix_color(
                    LIME_MIDDLE,
                    LIME_BOTTOM,
                    (vertical - 0.48) / 0.52,
                )
            recolored_pixels[x, y] = (*color, opacity)

    content_box = alpha.getbbox()
    if content_box is None:
        raise RuntimeError("No logo pixels were detected in the source crop.")
    logo = recolored.crop(content_box)
    scale = min(900 / logo.width, 790 / logo.height)
    logo = logo.resize(
        (round(logo.width * scale), round(logo.height * scale)),
        Image.Resampling.LANCZOS,
    )
    logo = logo.filter(ImageFilter.GaussianBlur(0.18))

    radial = Image.radial_gradient("L").resize(CANVAS_SIZE, Image.Resampling.BICUBIC)
    radial = ImageOps.invert(radial)
    canvas = ImageOps.colorize(radial, BLACK_EDGE, BLACK_CENTER).convert("RGB")
    position = (
        (CANVAS_SIZE[0] - logo.width) // 2,
        (CANVAS_SIZE[1] - logo.height) // 2,
    )
    canvas.paste(logo, position, logo)
    OUTPUT.parent.mkdir(parents=True, exist_ok=True)
    canvas.save(OUTPUT, format="PNG", optimize=True)

    print(f"content_box={content_box} output={OUTPUT}")


if __name__ == "__main__":
    main()
