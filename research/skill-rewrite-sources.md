# AGENT-420 skill rewrite research

## DeepSeek tool calling

DeepSeek's official tool-calling guide documents the OpenAI-compatible chat-completions flow: send enabled function tools, append the assistant tool-call message, execute the server-side function, append a `tool` message with the matching `tool_call_id`, and request the final natural-language response. The model does not execute functions itself. Strict mode requires a strict function flag, required properties, and `additionalProperties: false` for supported JSON schemas.

Source: [DeepSeek Tool Calls](https://api-docs.deepseek.com/guides/tool_calls/)

## DOCX

The official python-docx documentation covers document creation and updating, semantic headings, paragraphs and runs, lists, pictures, tables, sections, headers and footers, styles, comments, and shape-related APIs. AGENT-420's Node `docx` handler is text-first, so its skill must distinguish supported structural generation from unsupported tracked changes, template-preserving edits, and advanced DrawingML.

Source: [python-docx documentation](https://python-docx.readthedocs.io/en/latest/)

## PDF

PDFKit is a Node and browser PDF generation library with chainable APIs, text alignment, lists, font embedding, image embedding, annotations, outlines, forms, security, and accessibility support. It streams output and should be treated as a layout engine, not an HTML-to-PDF renderer.

Source: [PDFKit](https://pdfkit.org/)

## Docker code execution

Docker's `run` command supports read-only root filesystems, no networking, memory and CPU limits, non-root user selection, tmpfs, bind mounts, automatic container removal, and PID/resource options. AGENT-420 uses these boundaries and must document that they reduce risk but do not make arbitrary code automatically safe.

Source: [Docker run reference](https://docs.docker.com/reference/cli/docker/container/run/)

## Web search

SearXNG exposes GET and POST `/` and `/search` endpoints. JSON output requires the `format=json` parameter and must be enabled by the instance administrator. Query, category, language, page, time range, and safe-search parameters are supported.

Source: [SearXNG Search API](https://docs.searxng.org/dev/search_api.html)

## Image and vision

OpenAI's official image documentation separates image generation/editing from image understanding. A compatible local skill must identify the configured provider, preserve input-image references, avoid claiming image generation or vision when no local handler exists, and return provider errors clearly.

Sources: [Images and vision](https://developers.openai.com/api/docs/guides/images-vision), [Image generation](https://developers.openai.com/api/docs/guides/image-generation)

## OCR and media

Tesseract's documentation recommends preprocessing for difficult OCR inputs. FFmpeg documents broad media input, filtering, and transcoding support. yt-dlp documents output templates and controlled download paths. AGENT-420 should keep downloads outside the Docker no-network code sandbox and write only explicitly requested outputs.

Sources: [Tesseract quality improvement](https://tesseract-ocr.github.io/tessdoc/ImproveQuality.html), [FFmpeg documentation](https://ffmpeg.org/ffmpeg.html), [yt-dlp](https://github.com/yt-dlp/yt-dlp)

## Spreadsheet and presentations

ExcelJS provides workbook and worksheet manipulation, styling, tables, formulas, and file writing. PptxGenJS supports presentations, charts, images, tables, templates, and slide masters. AGENT-420's local `xlsx` and `pptx` skills must target these handlers, while Manus-specific XML syntax belongs only in a separate optional reference and must not be routed to the local generator.

Sources: [ExcelJS](https://github.com/exceljs/exceljs), [PptxGenJS](https://github.com/gitbrent/pptxgenjs), [PptxGenJS slide masters](https://gitbrent.github.io/PptxGenJS/docs/masters/)

## Secure process execution

Node's official child-process documentation distinguishes `execFile()` from shell-based `exec()`: `execFile()` launches the command directly by default. AGENT-420 should use fixed executable names and argument arrays, never interpolate user-controlled shell fragments, and apply timeouts, output limits, and allowlists.

Source: [Node.js child_process](https://nodejs.org/api/child_process.html)
