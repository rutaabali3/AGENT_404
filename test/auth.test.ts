import test from 'node:test'
import assert from 'node:assert/strict'
import { requireApiKey, securityHeaders } from '../src/agent/auth.js'

function createMockReqRes(headers: Record<string, string | undefined> = {}) {
  const req = { headers } as any
  let statusResult: number | undefined
  let jsonResult: any

  const res = {
    status(code: number) {
      statusResult = code
      return res
    },
    json(body: any) {
      jsonResult = body
      return res
    }
  } as any

  return { req, res, getStatus: () => statusResult, getJson: () => jsonResult }
}

test('securityHeaders sets expected HTTP response headers and calls next', () => {
  const req = {} as any
  const headersSet: Record<string, string> = {}
  const res = {
    setHeader(name: string, value: string) {
      headersSet[name] = value
      return res
    }
  } as any

  let nextCalled = false
  securityHeaders(req, res, () => {
    nextCalled = true
  })

  assert.equal(nextCalled, true)
  assert.equal(headersSet['X-Content-Type-Options'], 'nosniff')
  assert.equal(headersSet['X-Frame-Options'], 'DENY')
  assert.equal(headersSet['X-XSS-Protection'], '0')
  assert.equal(headersSet['Referrer-Policy'], 'no-referrer')
})

test('requireApiKey allows request when LOCAL_AGENT_API_KEY is not set', () => {
  const originalEnv = process.env.LOCAL_AGENT_API_KEY
  delete process.env.LOCAL_AGENT_API_KEY

  try {
    let nextCalled = false
    const { req, res } = createMockReqRes()
    requireApiKey(req, res, () => {
      nextCalled = true
    })
    assert.equal(nextCalled, true)
  } finally {
    if (originalEnv !== undefined) {
      process.env.LOCAL_AGENT_API_KEY = originalEnv
    }
  }
})

test('express middleware pipeline includes security headers before static files and routes', async () => {
  const express = (await import('express')).default
  const path = (await import('node:path')).default

  const app = express()
  app.use(securityHeaders)
  app.use(express.json({ limit: '2mb' }))
  app.use(express.static(path.resolve('public')))

  app.get('/test-route', (_req, res) => {
    res.json({ ok: true })
  })

  const server = app.listen(0)
  const address = server.address()
  if (!address || typeof address === 'string') {
    server.close()
    throw new Error('Server port not allocated')
  }

  const baseUrl = `http://127.0.0.1:${address.port}`

  try {
    // 1. Test static asset response
    const staticRes = await fetch(`${baseUrl}/index.html`)
    assert.equal(staticRes.headers.get('x-content-type-options'), 'nosniff')
    assert.equal(staticRes.headers.get('x-frame-options'), 'DENY')
    assert.equal(staticRes.headers.get('x-xss-protection'), '0')
    assert.equal(staticRes.headers.get('referrer-policy'), 'no-referrer')

    // 2. Test standard route response
    const routeRes = await fetch(`${baseUrl}/test-route`)
    assert.equal(routeRes.headers.get('x-content-type-options'), 'nosniff')
    assert.equal(routeRes.headers.get('x-frame-options'), 'DENY')
    assert.equal(routeRes.headers.get('x-xss-protection'), '0')
    assert.equal(routeRes.headers.get('referrer-policy'), 'no-referrer')
  } finally {
    server.close()
  }
})

test('requireApiKey rejects request with 401 when key prefix matches but length differs', () => {
  const originalEnv = process.env.LOCAL_AGENT_API_KEY
  process.env.LOCAL_AGENT_API_KEY = 'secret-key-123'

  try {
    let nextCalled = false
    const { req, res, getStatus, getJson } = createMockReqRes({ 'x-api-key': 'secret-key-12' })
    requireApiKey(req, res, () => {
      nextCalled = true
    })
    assert.equal(nextCalled, false)
    assert.equal(getStatus(), 401)
    assert.deepEqual(getJson(), { error: 'Unauthorized' })
  } finally {
    if (originalEnv !== undefined) {
      process.env.LOCAL_AGENT_API_KEY = originalEnv
    } else {
      delete process.env.LOCAL_AGENT_API_KEY
    }
  }
})

test('requireApiKey rejects request with 401 when LOCAL_AGENT_API_KEY is set and no key provided', () => {
  const originalEnv = process.env.LOCAL_AGENT_API_KEY
  process.env.LOCAL_AGENT_API_KEY = 'secret-key-123'

  try {
    let nextCalled = false
    const { req, res, getStatus, getJson } = createMockReqRes()
    requireApiKey(req, res, () => {
      nextCalled = true
    })
    assert.equal(nextCalled, false)
    assert.equal(getStatus(), 401)
    assert.deepEqual(getJson(), { error: 'Unauthorized' })
  } finally {
    if (originalEnv !== undefined) {
      process.env.LOCAL_AGENT_API_KEY = originalEnv
    } else {
      delete process.env.LOCAL_AGENT_API_KEY
    }
  }
})

test('requireApiKey rejects request with 401 when LOCAL_AGENT_API_KEY is set and wrong key provided', () => {
  const originalEnv = process.env.LOCAL_AGENT_API_KEY
  process.env.LOCAL_AGENT_API_KEY = 'secret-key-123'

  try {
    let nextCalled = false
    const { req, res, getStatus, getJson } = createMockReqRes({ 'x-api-key': 'wrong-key' })
    requireApiKey(req, res, () => {
      nextCalled = true
    })
    assert.equal(nextCalled, false)
    assert.equal(getStatus(), 401)
    assert.deepEqual(getJson(), { error: 'Unauthorized' })
  } finally {
    if (originalEnv !== undefined) {
      process.env.LOCAL_AGENT_API_KEY = originalEnv
    } else {
      delete process.env.LOCAL_AGENT_API_KEY
    }
  }
})

test('requireApiKey allows request when valid x-api-key header is provided', () => {
  const originalEnv = process.env.LOCAL_AGENT_API_KEY
  process.env.LOCAL_AGENT_API_KEY = 'secret-key-123'

  try {
    let nextCalled = false
    const { req, res } = createMockReqRes({ 'x-api-key': 'secret-key-123' })
    requireApiKey(req, res, () => {
      nextCalled = true
    })
    assert.equal(nextCalled, true)
  } finally {
    if (originalEnv !== undefined) {
      process.env.LOCAL_AGENT_API_KEY = originalEnv
    } else {
      delete process.env.LOCAL_AGENT_API_KEY
    }
  }
})

test('requireApiKey allows request when valid Authorization Bearer header is provided', () => {
  const originalEnv = process.env.LOCAL_AGENT_API_KEY
  process.env.LOCAL_AGENT_API_KEY = 'secret-key-123'

  try {
    let nextCalled = false
    const { req, res } = createMockReqRes({ authorization: 'Bearer secret-key-123' })
    requireApiKey(req, res, () => {
      nextCalled = true
    })
    assert.equal(nextCalled, true)
  } finally {
    if (originalEnv !== undefined) {
      process.env.LOCAL_AGENT_API_KEY = originalEnv
    } else {
      delete process.env.LOCAL_AGENT_API_KEY
    }
  }
})
