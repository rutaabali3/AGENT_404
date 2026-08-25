# Document Engineering Standards (Word/PPT)

This document defines the engineering standards for text-based reports, memos, and presentations. It focuses on "true structure" and cross-platform robustness rather than visual branding (which is governed by the user's corporate templates or the specific content skill).

## 1. Core Principles

1. **True Structure over Visual Fakes**: Use built-in heading styles, list numbering, and fields (TOC, page numbers). Never simulate structure with manual formatting (e.g., typing "1." or bullet characters).
2. **Cross-Platform Robustness**: Ensure documents render identically in Microsoft Word and Google Docs.
3. **Surgical Revisions**: When editing an existing document, use Tracked Changes with your agent name, modifying only the targeted text while preserving surrounding formatting.

## 2. Page and Typography Basics (Word)

- **Page Size**: Explicitly set to **US Letter** (8.5" x 11"), not A4, unless specified otherwise.
- **Margins**: 1 inch on all sides.
- **Font**: Default to **Arial** (highly compatible, professional). Keep headings black for readability.
- **Paragraphs**: NEVER use manual line breaks (`\n` or `Shift+Enter`) to create space. Each paragraph must be a distinct XML element with defined space-before/after to ensure correct spacing.
- **Quotes**: Use "smart quotes" (curly quotes) for a professional typographic look.

## 3. Headings and Navigation

- **Heading Styles**: Must use standard Heading styles (Heading 1, Heading 2, etc.) with explicit **Outline Levels**. This is required for the Navigation Pane to work and for generating an automatic Table of Contents (TOC).
- **TOC**: Must be generated using a TOC field code. Do not manually type a table of contents.
- **Consistency**: Do not manually alter font sizes of individual headings to fake a hierarchy; rely strictly on the style definitions.

## 4. Lists

- **List Numbering**: Always use the word processor's built-in list configuration.
- **NEVER hardcode bullets**: Do not type `•`, `-`, or manual numbers. Hardcoded symbols break indentation and prevent automatic renumbering.
- **Restart vs. Continue**: Properly configure whether a numbered list continues from a previous list or restarts at 1.

## 5. Tables (High Risk for Breakage)

Tables are the most common source of rendering errors across platforms.
- **Absolute Widths (DXA)**: Define table and column widths using absolute measurements (twips/DXA). NEVER use percentage widths, as they frequently break in Google Docs.
- **Width Math**: The total table width must exactly equal the sum of the individual column widths.
- **Padding**: Add cell margins (padding) so text does not touch the borders.
- **Shading**: Use `CLEAR` pattern for cell shading. Other patterns may render as solid black in some viewers.
- **No Table-as-Divider**: Never use an empty table row to simulate a horizontal line (it creates an empty box). Use paragraph bottom borders instead.

## 6. Layout Details

- **Page Breaks**: Use true Page Break elements. Never hit "Enter" repeatedly to force text to the next page.
- **Alignment**: Use Tab Stops (e.g., right-aligned tabs for dates, or dot leaders for TOC-style layouts) instead of mashing the spacebar.
- **Images**: Must be embedded inline with text and include descriptive **Alt Text**.
- **Headers/Footers**: Page numbers must use the automatic Page Number field code.
- **Citations**: Support footnotes for sourcing, hyperlinks, and internal bookmarks where appropriate.

## 7. Editing Existing Documents (Tracked Changes)

When tasked with updating an existing `.docx` file:
- **Author Attribution**: Set the revision author to your agent name (e.g., "Manus AI"), not a generic system name.
- **Minimal Revisions**: Mark only the exact words added or deleted. Do not replace entire paragraphs if only one word changed.
- **Preserve Formatting**: Retain the original bold, italic, and font size settings of the text being edited.
- **Clean Deletions**: When deleting a full paragraph, ensure the paragraph mark (`¶`) is also deleted to avoid leaving orphan empty lines.

## 8. Division of Labor

Understand what you control versus what the user/content controls:
- **This Standard controls**: Structure (XML), tables, TOC, pagination, tracked changes mechanism, and cross-platform stability.
- **The Content Skill controls**: The actual text, arguments, sections, and logic (e.g., Teaser structure, IC Memo arguments).
- **The Corporate Brand controls**: Visual identity, logos, specific fonts, and color palettes (applied via user-provided templates).
