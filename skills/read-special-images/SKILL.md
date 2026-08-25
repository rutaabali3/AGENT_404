---
name: read-special-images
description: Read and OCR unusually tall, wide, high-resolution, or text-dense images without hallucinating content lost to inline vision scaling. Use for long screenshots, panoramic images, large diagrams, dense documents, tiny unreadable text, or any image whose whole-image preview is not reliable; keep ordinary readable images unsplit.
---

# Read Special Images

## Goal

Extract or interpret image content at a readable scale, preserve reading order, reconcile overlap correctly, and state uncertainty instead of guessing.

## When to Use

- Use for long screenshots, panoramic images, very large images, dense documents, tables, diagrams, or tiny text.
- Use when `<image_metadata>` or `<image_reading_guidance>` reports unusual or unknown dimensions.
- Use when the whole-image preview is visibly downscaled or its text is not legible.
- Do not tile an ordinary-size image when its requested details are already readable.

## Workflow

1. Identify the original local image path. Treat the inline preview as orientation/context only when fine details are unreadable.
2. Read dimensions before extracting content. Prefer trustworthy `<image_metadata>` supplied with the image. Otherwise run:

   ```bash
   python3 /home/ubuntu/skills/read-special-images/scripts/slice_image.py /absolute/path/to/image --inspect-only
   ```

3. Decide whether to tile. Tile when any condition holds:
   - longest side divided by shortest side is at least 2;
   - either side exceeds 4096 pixels;
   - total pixels exceed 16 million;
   - text or fine structure remains unreadable in the whole-image preview.
4. For a normal readable image, inspect it once and continue without creating tiles.
5. For an abnormal image, create ordered tiles with overlap:

   ```bash
   python3 /home/ubuntu/skills/read-special-images/scripts/slice_image.py /absolute/path/to/image --output-dir /home/ubuntu/tmp/image-tiles
   ```

   Add `--force` when dimensions are ordinary but dense text is still unreadable. Use `--mode vertical` for top-to-bottom screenshots, `--mode horizontal` for panoramas, or `--mode grid` for large two-dimensional documents. Keep the default 12% overlap unless the content has unusually tall lines or large boundary objects.
6. Read `manifest.json`, then view every listed tile using the existing file/image-view capability. Follow manifest order exactly: top-to-bottom for vertical images, left-to-right for horizontal images, and row-major for grids. Do not skip a tile because adjacent tiles look similar.
7. Record extraction notes per tile before merging. Keep headings, columns, numbered steps, and spatial relationships in source order.
8. Reconcile boundaries using the overlap:
   - compare the final lines/objects of one tile with the first lines/objects of the next;
   - retain one copy of repeated content;
   - repair a cut word or line only when the overlap shows the complete version;
   - prefer the clearer tile when OCR differs and flag unresolved conflicts;
   - never concatenate OCR fragments blindly.
9. Verify the merged result against several tiles, including at least one overlap boundary and the final tile.

## Reliability Rules

- Never invent text, numbers, names, or relationships that are not readable in a tile.
- If dimensions are unknown, read them from the original file before deciding that the preview is sufficient.
- If a tile is still unreadable, make a smaller crop or use an existing OCR capability; do not upscale and guess.
- If reliable extraction remains impossible, say which regions are unreadable and provide only the verified portion.
- Distinguish exact transcription from a summary. Preserve uncertainty in both.

## Verification Checklist

- Confirm recorded width, height, and aspect ratio came from the original file or trusted metadata.
- Confirm ordinary readable images were not tiled.
- Confirm all manifest tiles were viewed in order.
- Confirm overlap duplicates were removed without dropping boundary text.
- Confirm the final answer contains no unsupported reconstruction.

## Files Included

- `scripts/slice_image.py` inspects dimensions and creates deterministic overlapping tiles plus a reading-order manifest.
