from pathlib import Path

from PIL import Image


SOURCE = Path(r"E:\Claude\puyuan-site\public\brand-logo-mark.png")
OUTPUT = Path(r"E:\Claude\puyuan-site\public\brand-logo-symbol.png")


def main() -> None:
    source = Image.open(SOURCE).convert("RGBA")
    output = Image.new("RGBA", source.size, (0, 0, 0, 0))
    source_pixels = source.load()
    output_pixels = output.load()

    for y in range(source.height):
        for x in range(source.width):
            red, green, blue, alpha = source_pixels[x, y]
            if alpha == 0:
                continue

            lime_strength = green - max(blue, red * 0.7)
            if green > 110 and lime_strength > 28:
                opacity = max(0, min(255, round(alpha * min(1, lime_strength / 80))))
                output_pixels[x, y] = (red, green, blue, opacity)

    bounds = output.getbbox()
    if bounds is None:
        raise RuntimeError("No fluorescent mark pixels were found.")

    cropped = output.crop(bounds)
    padding = 18
    side = max(cropped.size) + padding * 2
    square = Image.new("RGBA", (side, side), (0, 0, 0, 0))
    square.alpha_composite(
        cropped,
        ((side - cropped.width) // 2, (side - cropped.height) // 2),
    )
    square = square.resize((512, 512), Image.Resampling.LANCZOS)
    square.save(OUTPUT, optimize=True)
    print(OUTPUT)


if __name__ == "__main__":
    main()
