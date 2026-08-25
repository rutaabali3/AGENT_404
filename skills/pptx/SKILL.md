---
name: pptx
description: Create editable PowerPoint presentations with focused slide messages, consistent masters, charts, tables, images, notes, and structural validation using PptxGenJS.
---

# PPTX production workflow

Use the local `generate_pptx` tool for text-first decks. Do not route ordinary presentations to Manus-specific XML syntax. First define audience, decision, slide count, narrative arc, aspect ratio, visual theme, data sources, and speaker-note needs. One slide should communicate one main message.

## Narrative and layout

Use a reliable sequence such as title, context, problem, evidence, insight, options, recommendation, plan, risks, and next steps. Keep titles declarative where possible. Use a grid, consistent margins, readable font sizes, high contrast, and deliberate whitespace. Prefer charts, diagrams, tables, and annotated visuals over dense paragraphs. Keep chart labels legible and do not distort images.

## Data and accessibility

Label axes, units, time periods, and sources. Use color redundantly with labels or patterns. Provide alt text or notes when supported. Avoid relying on color alone. Use slide masters or reusable layout constants for repeated headers, footers, and branding. Use notes for speaking context instead of placing every sentence on the slide.

## Validation

Confirm the output is non-empty and can be opened as a ZIP-based Office package. Check slide count, titles, missing assets, overflow risk, and repeated elements. If visual rendering is available, inspect a contact sheet. Report limitations of the local text-first handler, especially for advanced charts, notes, animations, embedded media, and custom templates.

Read `references/deck-patterns.md` and the official PptxGenJS documentation before advanced work.
