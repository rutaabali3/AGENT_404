---
name: vision
description: Analyze images with explicit visual questions, OCR-aware handling, uncertainty reporting, and provider capability checks.
---

# Vision analysis workflow

Use this skill for image understanding, visual question answering, diagram interpretation, screenshots, document images, layout inspection, and OCR-adjacent tasks. State the visual question before analyzing. Identify the image source, resolution, orientation, visible regions, and whether text is legible. For large or text-dense images, use the dedicated slicing or OCR workflow instead of guessing from an unreadable preview.

Separate direct observations from interpretation. Quote visible text only when legible, preserve uncertainty, and say when a crop or higher-resolution image is needed. Do not infer sensitive traits, identity, intent, or hidden content from appearance. For diagrams, describe relationships and labels without inventing missing nodes.

AGENT-420's registered vision provider may be unavailable. Confirm the tool result before claiming analysis was performed. Read `references/vision-checklist.md` and the official image-and-vision documentation before advanced work.
