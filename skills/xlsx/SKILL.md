---
name: xlsx
description: Create reliable Excel workbooks with normalized data, styled tables, formulas, filters, freeze panes, charts, and validation using ExcelJS.
---

# XLSX production workflow

Use `generate_xlsx` for spreadsheet deliverables. Clarify whether the user wants a raw export, a formatted table, an analysis workbook, a model, or a dashboard. Normalize input rows before writing. For arrays, define the header row explicitly; for objects, create a stable union of keys and document missing values.

## Workbook design

Use one purpose per worksheet and descriptive sheet names. Freeze the header row, apply filters or real Excel tables where appropriate, set explicit column widths, and use consistent number formats for currency, dates, percentages, units, and identifiers. Keep formulas transparent and reference cells rather than embedding unexplained constants. Distinguish inputs, calculations, and outputs with restrained styles and clear legends.

## Data integrity

Never coerce identifiers, leading zeros, dates, or account numbers into numbers without user intent. Validate row counts, required columns, duplicate keys, nulls, formula cells, and totals. Keep source data separate from derived analysis. Avoid volatile formulas and external links unless requested. For wide data, prefer a readable table and a separate summary sheet.

## Validation

After generation, confirm the file exists and is non-empty, reopen it with ExcelJS where possible, check worksheet names and row counts, and verify formulas or totals against a small deterministic fixture. Report that visual review in Excel may still be needed for chart layout and print settings.

Read `references/spreadsheet-patterns.md` and the official ExcelJS documentation before advanced work.
