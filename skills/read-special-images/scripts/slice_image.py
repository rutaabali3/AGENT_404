#!/usr/bin/env python3
import argparse
import json
import math
from pathlib import Path

try:
    from PIL import Image, ImageOps
except ImportError as exc:
    raise SystemExit(
        "Pillow is required for deterministic image tiling. Use the existing Manus image/file capability instead; "
        "do not install dependencies unless the user authorizes it."
    ) from exc


SPECIAL_ASPECT_RATIO = 2.0
SPECIAL_MAX_DIMENSION = 4096
SPECIAL_PIXEL_COUNT = 16_000_000


def parse_args() -> argparse.Namespace:
    parser = argparse.ArgumentParser(description="Inspect and tile unusually sized or text-dense images.")
    parser.add_argument("image", type=Path, help="Path to the original image")
    parser.add_argument("--output-dir", type=Path, help="Directory for tiles and manifest.json")
    parser.add_argument("--inspect-only", action="store_true", help="Print dimensions without creating tiles")
    parser.add_argument("--force", action="store_true", help="Tile even when dimensions look ordinary")
    parser.add_argument("--mode", choices=("auto", "vertical", "horizontal", "grid"), default="auto")
    parser.add_argument("--tile-width", type=int, help="Override tile width in pixels")
    parser.add_argument("--tile-height", type=int, help="Override tile height in pixels")
    parser.add_argument("--overlap", type=float, default=0.12, help="Overlap fraction in [0, 0.5); default 0.12")
    return parser.parse_args()


def greatest_common_divisor(left: int, right: int) -> int:
    while right:
        left, right = right, left % right
    return left


def image_summary(path: Path, width: int, height: int) -> dict:
    divisor = greatest_common_divisor(width, height)
    return {
        "source": str(path.resolve()),
        "pixel_width": width,
        "pixel_height": height,
        "aspect_ratio": f"{width // divisor}:{height // divisor}",
        "aspect_ratio_decimal_width_over_height": round(width / height, 6),
        "orientation": "portrait" if height > width else "landscape" if width > height else "square",
    }


def is_special(width: int, height: int) -> bool:
    aspect_ratio = max(width, height) / min(width, height)
    return (
        aspect_ratio >= SPECIAL_ASPECT_RATIO
        or max(width, height) > SPECIAL_MAX_DIMENSION
        or width * height > SPECIAL_PIXEL_COUNT
    )


def choose_mode(requested: str, width: int, height: int, force: bool) -> str:
    if requested != "auto":
        return requested
    aspect_ratio = max(width, height) / min(width, height)
    if aspect_ratio >= SPECIAL_ASPECT_RATIO:
        return "vertical" if height > width else "horizontal"
    if force or max(width, height) > SPECIAL_MAX_DIMENSION or width * height > SPECIAL_PIXEL_COUNT:
        return "grid"
    return "vertical" if height >= width else "horizontal"


def positions(length: int, window: int, overlap: float) -> list[int]:
    if window >= length:
        return [0]
    target_step = max(1, round(window * (1 - overlap)))
    distance = length - window
    interval_count = max(1, round(distance / target_step), math.ceil(distance / window))
    return [round(index * distance / interval_count) for index in range(interval_count + 1)]


def actual_overlap(ordered_positions: list[int], window: int) -> float:
    if len(ordered_positions) < 2:
        return 0.0
    overlaps = [
        1 - (current - previous) / window for previous, current in zip(ordered_positions, ordered_positions[1:])
    ]
    return round(min(overlaps), 6)


def tile_geometry(mode: str, width: int, height: int, args: argparse.Namespace) -> tuple[int, int]:
    if mode == "vertical":
        tile_width = width
        tile_height = args.tile_height or min(1200, max(600, round(width * 0.75)))
    elif mode == "horizontal":
        tile_width = args.tile_width or min(1200, max(600, round(height * 0.75)))
        tile_height = height
    else:
        default_width = max(320, round(width * 0.55)) if args.force else 1400
        default_height = max(320, round(height * 0.55)) if args.force else 1400
        tile_width = args.tile_width or min(width, default_width)
        tile_height = args.tile_height or min(height, default_height)
    return min(width, tile_width), min(height, tile_height)


def ensure_valid_args(args: argparse.Namespace) -> None:
    if not args.image.is_file():
        raise SystemExit(f"Image does not exist: {args.image}")
    if not 0 <= args.overlap < 0.5:
        raise SystemExit("--overlap must be at least 0 and less than 0.5")
    if args.tile_width is not None and args.tile_width <= 0:
        raise SystemExit("--tile-width must be positive")
    if args.tile_height is not None and args.tile_height <= 0:
        raise SystemExit("--tile-height must be positive")


def main() -> None:
    args = parse_args()
    ensure_valid_args(args)

    with Image.open(args.image) as opened:
        image = ImageOps.exif_transpose(opened)
        image.load()
        if image.mode not in {"RGB", "RGBA", "L"}:
            image = image.convert("RGB")
        width, height = image.size
        summary = image_summary(args.image, width, height)

        if args.inspect_only:
            print(json.dumps({**summary, "tiled": False}, ensure_ascii=False, indent=2))
            return

        if not args.force and not is_special(width, height):
            print(
                json.dumps(
                    {**summary, "tiled": False, "reason": "ordinary dimensions; no tiles created"},
                    ensure_ascii=False,
                    indent=2,
                )
            )
            return

        mode = choose_mode(args.mode, width, height, args.force)
        tile_width, tile_height = tile_geometry(mode, width, height, args)
        x_positions = positions(width, tile_width, args.overlap) if mode in {"horizontal", "grid"} else [0]
        y_positions = positions(height, tile_height, args.overlap) if mode in {"vertical", "grid"} else [0]

        output_dir = args.output_dir or args.image.with_name(f"{args.image.stem}-tiles")
        output_dir.mkdir(parents=True, exist_ok=True)
        tiles = []
        index = 1
        for y in y_positions:
            for x in x_positions:
                right = min(width, x + tile_width)
                bottom = min(height, y + tile_height)
                filename = f"tile_{index:03d}_x{x:06d}_y{y:06d}.png"
                output_path = output_dir / filename
                image.crop((x, y, right, bottom)).save(output_path, format="PNG", optimize=True)
                tiles.append(
                    {
                        "index": index,
                        "path": str(output_path.resolve()),
                        "x": x,
                        "y": y,
                        "pixel_width": right - x,
                        "pixel_height": bottom - y,
                    }
                )
                index += 1

    manifest = {
        **summary,
        "tiled": True,
        "mode": mode,
        "overlap_fraction_requested_target": args.overlap,
        "overlap_fraction_actual_minimum": {
            "horizontal": actual_overlap(x_positions, tile_width),
            "vertical": actual_overlap(y_positions, tile_height),
        },
        "reading_order": (
            "top-to-bottom"
            if mode == "vertical"
            else "left-to-right"
            if mode == "horizontal"
            else "row-major: top-to-bottom rows, left-to-right within each row"
        ),
        "tile_count": len(tiles),
        "tiles": tiles,
    }
    manifest_path = output_dir / "manifest.json"
    manifest_path.write_text(json.dumps(manifest, ensure_ascii=False, indent=2) + "\n", encoding="utf-8")
    print(json.dumps({**manifest, "manifest": str(manifest_path.resolve())}, ensure_ascii=False, indent=2))


if __name__ == "__main__":
    main()
