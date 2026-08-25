---
name: pdf
description: Conventions for producing PDFs with deterministic local tools
---

# PDF Generation Rules

- Prefer pandoc for text-first documents when the required output is a clean, portable PDF.
- Prefer puppeteer when the document needs precise HTML/CSS layout, images, or print styling.
- Write the completed artifact directly to /sandbox/outputs and keep intermediate assets in /sandbox/workspace.
- Validate that the output exists and is non-empty before reporting success.
- Never expose workspace paths as delivered files.
