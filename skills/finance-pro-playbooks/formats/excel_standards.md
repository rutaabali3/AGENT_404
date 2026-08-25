# Excel Modeling & Formatting Standards

This document defines the engineering and formatting standards for **any finance-domain Excel output**, superseding generic spreadsheet guidance (themes, decorative highlighting, and general aesthetics from skills such as excel-generator). The goal is to produce models that are instantly readable by finance professionals, with clear separation of inputs vs. calculations, and full auditability.

## 1. Color Semantics (Crucial)

Font colors dictate the nature of the data. You must apply these strictly using `openpyxl` or equivalent libraries:

| Font Color | Hex Code | Meaning |
| --- | --- | --- |
| **Blue** | `#0000FF` | Hardcoded inputs, assumptions, and manual entries |
| **Black** | `#000000` | Formulas and calculations within the same sheet |
| **Green** | `#008000` | Links/references to other sheets within the workbook |
| **Purple** | `#800080` | Formulas calling external provider add-ins (e.g., `=CIQ()`, `=FDS()`) |

**Fill Colors (Shading)** are used sparingly for structure, NEVER for highlighting inputs:
- **Dark Green** (`#135B44`, white text): **ONLY** used for the main title bar (Row 3) of each tab.
- **Light Green** (`#CFE9E0`, black text): Used for section divider bars (use sparingly) and sensitivity table headers.
- **Light Gray** (`#E7E5E4`): Used as a vertical border/fill to separate Historical from Projected periods, or for the base case cell in a sensitivity table.

*Principle: White space is the default; shading is the exception. Do not highlight inputs in yellow.*

## 2. Layout Skeleton (Fixed per Tab)

Every tab must follow this exact row structure:

| Row | Content |
| --- | --- |
| 1–2 | Empty (spacer) |
| 3 | **Main Title** (Column C), Dark Green fill, White text, 16pt Bold |
| 4 | Empty |
| 5 | **Subtitle** (Column C), 11pt Bold |
| 6 | **Unit notation** (Column C), Italic, e.g., *($ in millions)* |
| 7 | Empty |
| 8+ | Body content starts from **Row 8, Column C** |

**Columns A & B** act as the "gutter" (binding margin). Set their width to 20 and leave them empty. This is the only manual column width you should set.
**Column C onwards** must use auto-fit width. Do not hardcode widths for data columns to ensure consistency.

## 3. Number Formatting

| Type | Format String / Convention |
| --- | --- |
| Currency | `$#,##0.0`; **Negative numbers in parentheses** e.g., `($10.0)`; Zeros as dashes `-` |
| Percentage | `#,##0.0%` |
| Multiples | `#,##0.0x` |
| Share Price | Two decimals `0.00` |

- All numerical values must be **Right-Aligned**.
- The `$` symbol should only appear on the **first row of a block** and on **per-share metrics** (EPS, stock price). Do not repeat `$` on every row in a contiguous block of currency values.

## 4. Time Period Conventions

- **Years**: Do not use prefixes (e.g., write `2025`, not `FY2025`).
- **Quarters**: Write as `Q1 '25`.
- **Status**: Append "A" for Actuals (e.g., `2024A`) and "E" for Estimates/Projected (e.g., `2025E`). Do not use "P".
- **Separation**: Do not add a "Historical/Projected" label row. Instead, use a **Light Gray vertical border** on the right side of the last actual (A) column.

## 5. Hierarchy and Emphasis

Use font weight and borders to show hierarchy, not colors.

- **Bold**: Key subtotals (Revenue, Gross Profit, EBITDA, EBIT, Net Income).
- **Regular**: Cost items (COGS, SG&A, D&A, Interest, Taxes).
- **Italic**: Margins and assumption drivers.
- **Margins Spacing**: Margins must be italicized, indented, and followed by a narrow empty row (height=5) to separate them from the next line item.
- **Borders**: 
  - Top border for standard subtotals.
  - Bold top border for key subtotals (EBITDA, EBIT).
  - Top border + Double bottom border for the final bottom line (Net Income).
- **Deductions**: Expenses and deductions must be displayed as negative numbers in parentheses.

## 6. Restraint Rules

- **No Cover Pages**: Unless explicitly requested.
- **No Watermarks/Logos**: Keep the sheets clean.
- **Freeze Panes**: Be conservative. Only freeze panes (headers/labels) on newly created single-sheet models. Never freeze panes on multi-sheet outputs like comps. If editing an existing user file, leave existing freeze panes untouched.

## 7. Print Settings

Configure each tab for printing:
- Page Layout: Page Break Preview
- Orientation: Landscape
- Scaling: Fit to 1 page wide, height automatic
- Print Area: From B2 to the end of the data
- Footer: Tab name + Page number

## 8. Source Comments (The Audit Trail)

**EVERY hardcoded input (Blue text) MUST have an Excel comment/note attached to the cell.**
The comment must specify:
1. Source document/database name
2. Date or period of the source
3. Specific page, table, or section

*Example comment: "Source: Q3 2024 10-Q, page 24, Management's Discussion and Analysis."*

This is non-negotiable. It replaces UI-based source highlighting and ensures the model is fully auditable by the user.

---
*When updating existing models, respect the user's existing formatting if it conflicts with these defaults.*
