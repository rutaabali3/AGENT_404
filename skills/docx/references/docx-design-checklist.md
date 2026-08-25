# DOCX design checklist

## Before generation

- Identify document type, audience, length, page size, orientation, margins, language, brand, and output folder.
- Choose a semantic outline and decide where tables, figures, citations, appendices, and page breaks belong.
- Choose one body font and at most one display or accent font.

## Layout

- Use consistent margins and paragraph spacing.
- Use Heading 1 for major sections, Heading 2 for subsections, and Heading 3 only when needed.
- Keep headings with their following paragraph when possible.
- Use section breaks for changes in orientation, margins, headers, footers, or numbering.
- Use explicit table widths and avoid dense tables that force unreadably small text.

## Content and accessibility

- Use real lists instead of typed bullets and numbers.
- Give tables meaningful headers and captions.
- Add descriptive image alt text when the implementation supports it.
- Use link text that describes the destination.
- Preserve language-specific punctuation and avoid invisible formatting characters.

## Validation

- Confirm the ZIP-based DOCX package is non-empty and structurally readable.
- Search extracted text for placeholders such as TODO, lorem ipsum, undefined, and [insert].
- Check that the first page has the intended title and that the last page is not blank.
- State any visual checks that could not be automated.

Authoritative reference: python-docx documentation, https://python-docx.readthedocs.io/en/latest/.
