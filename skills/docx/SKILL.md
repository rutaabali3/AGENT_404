---
name: docx
description: Conventions for generating Word documents via generate_docx
---

# DOCX Generation Rules

- Use the `docx` npm package — do not hand-write raw OOXML/XML.
- Structure every document with proper heading levels (Heading1/Heading2), not bold-large-text substitutes.
- Default to a clean, single readable font; do not mix more than two fonts in one document.
- Tables: always set explicit column widths — do not leave them to auto-fit.
- Save the finished file directly to /sandbox/outputs, never workspace/.
- Confirm the file opens (basic structural validation) before considering the task complete.
