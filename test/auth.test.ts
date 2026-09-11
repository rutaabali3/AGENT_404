import test from 'node:test'
import assert from 'node:assert/strict'
import express from 'express'
import rateLimit from 'express-rate-limit'
import { requireApiKey, securityHeaders, chatRateLimiter } from '../src/agent/auth.js'

function createMockReqRes(headers: Record<string, string | undefined> = {}) {
  const req = { headers } as any
  let statusResult: number | undefined
  let jsonResult: any
  const responseHeaders: Record<string, string> = {}

  const res = {
    setHeader(name: string, value: string) {
      responseHeaders[name.toLowerCase()] = value
      return res
    },
    status(code: number) {
      statusResult = code
      return res
    },
    json(body: any) {
      jsonResult = body
      return res
    }
  } as any

  return { req, res, responseHeaders, getStatus: () => statusResult, getJson: () => jsonResult }
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

test('chatRateLimiter allows requests within rate limit and includes ratelimit headers', async () => {
  const app = express()
  app.post('/api/chat', chatRateLimiter, (_req, res) => {
    res.json({ ok: true })
  })

  const server = app.listen(0)
  const address = server.address()
  if (!address || typeof address === 'string') {
    throw new Error('Failed to start test server')
  }
  const port = address.port

  try {
    const res = await fetch(`http://127.0.0.1:${port}/api/chat`, { method: 'POST' })
    assert.equal(res.status, 200)
    assert.ok(res.headers.has('ratelimit-limit'))
  } finally {
    server.close()
  }
})

test('rateLimiter middleware blocks requests exceeding rate limit with 429 status', async () => {
  const app = express()
  const testLimiter = rateLimit({
    windowMs: 60 * 1000,
    limit: 2,
    standardHeaders: true,
    legacyHeaders: false,
    message: { error: 'Too many requests, please try again later.' }
  })

  app.post('/api/chat', testLimiter, (_req, res) => {
    res.json({ ok: true })
  })

  const server = app.listen(0)
  const address = server.address()
  if (!address || typeof address === 'string') {
    throw new Error('Failed to start test server')
  }
  const port = address.port

  try {
    const res1 = await fetch(`http://127.0.0.1:${port}/api/chat`, { method: 'POST' })
    assert.equal(res1.status, 200)

    const res2 = await fetch(`http://127.0.0.1:${port}/api/chat`, { method: 'POST' })
    assert.equal(res2.status, 200)

    const res3 = await fetch(`http://127.0.0.1:${port}/api/chat`, { method: 'POST' })
    assert.equal(res3.status, 429)
    const body = await res3.json()
    assert.equal(body.error, 'Too many requests, please try again later.')
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
