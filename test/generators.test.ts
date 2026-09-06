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

test('web.searchTavily and web.searchSearxng fallback send request with 10s timeout', async () => {
  const axios = (await import('axios')).default
  const { handlers } = await import('../src/agent/tools.js')

  const originalPost = axios.post
  const originalGet = axios.get
  const originalTavilyKey = process.env.TAVILY_API_KEY
  const originalSearxngUrl = process.env.SEARXNG_URL

  const calls: { url: string; config?: any }[] = []

  axios.post = (async (url: string, body?: any, config?: any) => {
    calls.push({ url, config })
    return { data: { results: ['test'] } }
  }) as any

  axios.get = (async (url: string, config?: any) => {
    throw new Error('SearXNG connection failed')
  }) as any

  try {
    process.env.TAVILY_API_KEY = 'test-key'

    // Test web.searchTavily
    const tavilyRes = await handlers['web.searchTavily']({ query: 'test query' })
    assert.deepEqual(tavilyRes, { results: ['test'] })
    assert.equal(calls.length, 1)
    assert.equal(calls[0].url, 'https://api.tavily.com/search')
    assert.equal(calls[0].config?.timeout, 10000)

    // Test web.searchSearxng fallback to Tavily
    calls.length = 0
    const searxngRes = await handlers['web.searchSearxng']({ query: 'test query' })
    assert.equal(searxngRes.provider, 'tavily-fallback')
    assert.equal(calls.length, 1)
    assert.equal(calls[0].url, 'https://api.tavily.com/search')
    assert.equal(calls[0].config?.timeout, 10000)
  } finally {
    axios.post = originalPost
    axios.get = originalGet
    if (originalTavilyKey === undefined) delete process.env.TAVILY_API_KEY
    else process.env.TAVILY_API_KEY = originalTavilyKey
    if (originalSearxngUrl === undefined) delete process.env.SEARXNG_URL
    else process.env.SEARXNG_URL = originalSearxngUrl
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
