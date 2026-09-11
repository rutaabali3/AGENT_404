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
