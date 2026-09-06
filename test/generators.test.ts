import test from 'node:test'
import assert from 'node:assert/strict'
import path from 'node:path'
import fs from 'node:fs/promises'
import axios from 'axios'
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

test('web.fetch limits maximum response size via maxContentLength and maxBodyLength', async () => {
  const { handlers } = await import('../src/agent/tools.js')
  const fetchHandler = handlers['web.fetch']

  let capturedOptions: any = null
  const originalGet = axios.get
  axios.get = (async (url: string, options: any) => {
    capturedOptions = options
    return { data: '<html><body>Hello World</body></html>' }
  }) as any

  try {
    const res = await fetchHandler({ url: 'https://example.com' })
    assert.equal(capturedOptions?.maxContentLength, 5 * 1024 * 1024)
    assert.equal(capturedOptions?.maxBodyLength, 5 * 1024 * 1024)
    assert.equal(res.trim(), 'Hello World')
  } finally {
    axios.get = originalGet
  }
})

test('web.fetch prevents SSRF and non-http(s) requests', async () => {
  const { handlers } = await import('../src/agent/tools.js')
  const fetchHandler = handlers['web.fetch']

  const blockedUrls = [
    'file:///etc/passwd',
    'gopher://localhost:70',
    'http://localhost/admin',
    'http://127.0.0.1:8787',
    'http://[::1]:8787',
    'http://169.254.169.254/latest/meta-data/',
    'http://10.0.0.1/internal',
    'http://172.16.0.1/private',
    'http://192.168.1.1/router'
  ]

  for (const url of blockedUrls) {
    await assert.rejects(async () => {
      await fetchHandler({ url })
    })
  }
})

test('media.downloadVideo prevents SSRF and non-http(s) requests', async () => {
  const { handlers } = await import('../src/agent/tools.js')
  const downloadVideoHandler = handlers['media.downloadVideo']

  const blockedUrls = [
    'file:///etc/passwd',
    'http://localhost:8787',
    'http://127.0.0.1:8787',
    'http://[::1]:8787',
    'http://169.254.169.254/latest/meta-data/',
    'http://10.0.0.1/video.mp4',
    'http://192.168.1.1/stream'
  ]

  for (const url of blockedUrls) {
    await assert.rejects(async () => {
      await downloadVideoHandler({ url })
    })
  }
})
