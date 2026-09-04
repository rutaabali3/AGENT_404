import test from 'node:test'
import assert from 'node:assert/strict'
import path from 'node:path'
import fs from 'node:fs/promises'
import { convertToPdf, generateDocx, generateXlsx, generatePptx } from '../src/agent/generators.js'

test('outputPath sanitizes path traversal attempts and keeps output inside outputs directory', async () => {
  const resPdf = await convertToPdf({ content: 'Test PDF', filename: '../../test_traversal.pdf' })
  assert.equal(resPdf.path, 'test_traversal.pdf')

  const resDocx = await generateDocx({ content: 'Test DOCX', filename: '..\\..\\test_traversal.docx' })
  assert.equal(resDocx.path, 'test_traversal.docx')

  const resXlsx = await generateXlsx({ data: [['a', 'b']], filename: '/etc/passwd.xlsx' })
  assert.equal(resXlsx.path, 'passwd.xlsx')

  const resPptx = await generatePptx({ content: 'Test PPTX', filename: '../../../test_traversal.pptx' })
  assert.equal(resPptx.path, 'test_traversal.pptx')

  // Clean up created test files in sandbox/outputs
  const outputs = path.resolve('./sandbox/outputs')
  await fs.rm(path.join(outputs, 'test_traversal.pdf'), { force: true })
  await fs.rm(path.join(outputs, 'test_traversal.docx'), { force: true })
  await fs.rm(path.join(outputs, 'passwd.xlsx'), { force: true })
  await fs.rm(path.join(outputs, 'test_traversal.pptx'), { force: true })
})
