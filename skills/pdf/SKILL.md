---
name: pdf
description: Generate print-ready PDFs with deterministic typography, pagination, tables, links, images, metadata, and validation through PDFKit.
---

# PDF production workflow

Use `convert_to_pdf` for text-first PDF generation. Treat PDF as a fixed-layout deliverable: plan page size, margins, typography, hierarchy, page breaks, headers, footers, and output filename before rendering. Do not describe PDFKit as an HTML/CSS browser renderer; it is a programmable document and drawing API.

## Layout rules

Use a consistent grid, readable body size, restrained color palette, adequate contrast, and predictable vertical rhythm. Keep titles and headings with their following content. Use explicit page breaks for major sections, keep tables within page width, and repeat headers or split tables when needed. Embed fonts when language coverage or brand fidelity requires it. Preserve aspect ratio for images and add links or annotations only when requested.

## Content patterns

Use report, invoice, certificate, resume, proposal, or handout patterns from `references/layout-patterns.md`. Use numeric formats and dates consistently. Add document metadata when supported. For long reports, include a table of contents only if page numbers can be validated.

## Validation

Confirm the output exists under `sandbox/outputs`, is non-empty, begins as a readable PDF package, and has the intended page count where available. Use `pdfinfo` or an equivalent local check when available. Inspect text extraction for missing or duplicated content and render representative pages for visual review when possible. Report limitations such as font substitution, unsupported complex tables, or unavailable image inputs.

Read `references/pdf-quality.md` and the official PDFKit documentation before advanced work.
