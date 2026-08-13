from pathlib import Path

from PIL import Image


SOURCE = Path(r"E:\Claude\puyuan-site\public\brand-logo-symbol.png")
OUTPUT = Path(r"E:\Claude\puyuan-site\public\brand-logo-symbol-dark.png")
GRAPHITE = (17, 17, 17)


def main() -> None:
    source = Image.open(SOURCE).convert("RGBA")
    output = Image.new("RGBA", source.size, (0, 0, 0, 0))
    output.paste((*GRAPHITE, 255), (0, 0, source.width, source.height), source.getchannel("A"))
    output.save(OUTPUT, optimize=True)
    print(OUTPUT)


if __name__ == "__main__":
    main()
