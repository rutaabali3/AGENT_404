import fs from 'node:fs/promises'
import path from 'node:path'
import PDFDocument from 'pdfkit'
import { Document, Packer, Paragraph, HeadingLevel } from 'docx'
import ExcelJS from 'exceljs'
import pptxgenModule from 'pptxgenjs'
const PptxGenJS: any = pptxgenModule as any

const outputs = path.resolve(process.env.OUTPUTS_DIR ?? './sandbox/outputs')
function outputPath(filename: string, extension: string) { const clean = path.basename(filename || `agent-output.${extension}`); return path.join(outputs, clean.endsWith(`.${extension}`) ? clean : `${clean}.${extension}`) }
async function ensureOutputs() { await fs.mkdir(outputs, { recursive: true }) }
function lines(content: string) { return String(content).split(/\r?\n/).map(line => line.trim()).filter(Boolean) }

export async function convertToPdf(args: { content: string; filename?: string }) { await ensureOutputs(); const target = outputPath(args.filename ?? 'agent-output.pdf', 'pdf'); const doc = new PDFDocument({ margin: 54 }); const chunks: Buffer[] = []; doc.on('data', chunk => chunks.push(chunk)); const done = new Promise<void>((resolve, reject) => { doc.on('end', () => resolve()); doc.on('error', reject) }); for (const line of lines(args.content)) { const heading = /^(#{1,3})\s+(.+)$/.exec(line); if (heading) doc.fontSize(heading[1].length === 1 ? 20 : 15).font('Helvetica-Bold').text(heading[2]).moveDown(0.4); else doc.fontSize(11).font('Helvetica').text(line).moveDown(0.35) } doc.end(); await done; await fs.writeFile(target, Buffer.concat(chunks)); return { path: path.relative(outputs, target), bytes: (await fs.stat(target)).size }
}

export async function generateDocx(args: { content: string; filename?: string }) { await ensureOutputs(); const target = outputPath(args.filename ?? 'agent-output.docx', 'docx'); const children = lines(args.content).map(line => { const heading = /^(#{1,3})\s+(.+)$/.exec(line); return new Paragraph({ text: heading ? heading[2] : line, heading: heading ? heading[1].length === 1 ? HeadingLevel.HEADING_1 : HeadingLevel.HEADING_2 : undefined }) }); const buffer = await Packer.toBuffer(new Document({ sections: [{ properties: {}, children }] })); await fs.writeFile(target, buffer); return { path: path.relative(outputs, target), bytes: buffer.length }
}

export async function generateXlsx(args: { data: unknown[]; filename?: string }) { await ensureOutputs(); const target = outputPath(args.filename ?? 'agent-output.xlsx', 'xlsx'); const workbook = new ExcelJS.Workbook(); const sheet = workbook.addWorksheet('Data'); const rows = Array.isArray(args.data) ? args.data : []; const normalized = rows.map(row => Array.isArray(row) ? row : Object.values((row ?? {}) as Record<string, unknown>)); const first = normalized[0] ?? []; sheet.addRow(first); if (first.length) { const header = sheet.getRow(1); header.font = { bold: true, color: { argb: 'FFFFFFFF' } }; header.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FF263238' } }; header.alignment = { vertical: 'middle' }; } normalized.slice(1).forEach(row => sheet.addRow(row)); sheet.views = [{ state: 'frozen', ySplit: 1 }]; sheet.columns.forEach(column => { const columnNumber = column.number ?? 1; const widths: number[] = sheet.getColumn(columnNumber).values.slice(1).map(value => Number(String(value ?? '').length + 2)); const widest = widths.reduce((max, width) => Math.max(max, width), 12); column.width = Math.min(40, widest) }); await workbook.xlsx.writeFile(target); return { path: path.relative(outputs, target), bytes: (await fs.stat(target)).size, rows: normalized.length }
}

export async function generatePptx(args: { content: string; filename?: string }) { await ensureOutputs(); const target = outputPath(args.filename ?? 'agent-output.pptx', 'pptx'); const pptx = new PptxGenJS(); pptx.layout = 'LAYOUT_WIDE'; const sections = String(args.content).split(/\n\s*\n/).filter(Boolean); for (const section of sections.length ? sections : ['']) { const slide = pptx.addSlide(); const [title, ...body] = lines(section); slide.background = { color: '111315' }; slide.addText(title || 'Untitled slide', { x: 0.7, y: 0.65, w: 11.8, h: 0.55, fontFace: 'Aptos Display', fontSize: 25, bold: true, color: 'D4F36A', margin: 0 }); slide.addText(body.join('\n') || ' ', { x: 0.75, y: 1.55, w: 11.4, h: 4.7, fontFace: 'Aptos', fontSize: 17, color: 'EDF0EE', breakLine: false, margin: 0.04, valign: 'top', fit: 'shrink' }) } await pptx.writeFile({ fileName: target }); return { path: path.relative(outputs, target), bytes: (await fs.stat(target)).size, slides: sections.length || 1 } }
