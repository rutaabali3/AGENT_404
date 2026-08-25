---
name: xlsx
description: Conventions for generating spreadsheets via generate_xlsx
---

# XLSX Generation Rules

- Use `exceljs` for workbook creation and preserve formulas as formulas when the user requests calculations.
- Use static values only when the source data is final or when formulas would be misleading.
- Add clear worksheet names, header styling, frozen header rows, and explicit number formats.
- Validate the workbook can be opened before delivery and save final files to /sandbox/outputs.
