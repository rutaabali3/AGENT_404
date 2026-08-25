---
name: docx
description: Create polished editable DOCX reports, resumes, letters, proposals, forms, and structured Word documents with semantic styles, sections, tables, and validation.
---

# DOCX production workflow

Use the deterministic `generate_docx` tool for ordinary text-first documents. Plan content and layout separately. Identify document type, audience, length, page size, orientation, margins, language, brand tone, and whether the user needs an editable Word file or a print-oriented PDF. Use one body font and no more than one accent font unless a template requires otherwise.

## Structure

Use semantic Title, Subtitle, Heading 1–3, Normal, Quote, List Bullet, and List Number styles. Use real paragraphs, runs, lists, tables, page breaks, sections, headers, footers, captions, and hyperlinks. Never simulate layout with repeated spaces. Keep headings with their following paragraph when possible. Use sections for orientation, margins, page numbering, or header/footer changes.

## Document types

Reports should contain metadata, executive summary, scope and assumptions, findings, evidence tables or figures, recommendations, conclusion, and references. Resumes should use ATS-friendly headings and measurable achievements. Proposals should define objectives, deliverables, timeline, assumptions, risks, team, commercials, and next steps. Letters should use date, recipient, subject, salutation, body, closing, and signature. Forms should include labels, instructions, writing space, and approval areas.

## Tables, images, and quality

Give tables meaningful headers, explicit widths, consistent number formats, and captions when useful. Change orientation or split a table rather than shrinking text excessively. Preserve image aspect ratios, use descriptive alternative text where supported, and place images beside their explanation. Validate that the output is non-empty, structurally readable, free of placeholders, and saved under `sandbox/outputs`. Do not claim tracked changes, comments, advanced numbering, or template-preserving edits unless implemented.

Read `references/design-checklist.md`, `references/content-patterns.md`, and the official python-docx documentation before advanced work.
