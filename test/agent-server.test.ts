import test from 'node:test'
import assert from 'node:assert/strict'
import path from 'node:path'
import { EventEmitter } from 'node:events'
import { createApp, chatRateLimiter } from '../src/agent-server.js'
import { Store, ToolDoc, defaultTools } from '../src/agent/store.js'

function createMockReqRes(options: {
  method?: string
  url?: string
  headers?: Record<string, string | undefined>
  body?: any
} = {}) {
  const req = new EventEmitter() as any
  req.method = options.method ?? 'GET'
  req.url = options.url ?? '/'
  req.headers = options.headers ?? {}
  req.body = options.body
  req.query = {}
  req.ip = '127.0.0.1'
  req.app = {
    get(setting: string) {
      if (setting === 'trust proxy fn') return () => false
      return undefined
    }
  }

  const resHeaders: Record<string, string> = {}
  let statusCode = 200
  let jsonResult: any
  let sentFile: string | undefined

  const res = new EventEmitter() as any
  res.statusCode = 200
  res.setHeader = (name: string, value: string) => {
    resHeaders[String(name)] = String(value)
    resHeaders[String(name).toLowerCase()] = String(value)
    return res
  }
  res.headersSent = false
  res.getHeader = (name: string) => resHeaders[name.toLowerCase()]
  res.status = (code: number) => {
    statusCode = code
    res.statusCode = code
    return res
  }
  res.json = (body: any) => {
    jsonResult = body
    res.emit('finish')
    return res
  }
  res.sendFile = (filepath: string) => {
    sentFile = filepath
    res.emit('finish')
    return res
  }

  return {
    req,
    res,
    getStatus: () => statusCode,
    getJson: () => jsonResult,
    getSentFile: () => sentFile,
    getHeaders: () => resHeaders
  }
}

function dispatchRequest(app: any, mock: ReturnType<typeof createMockReqRes>): Promise<void> {
  return new Promise<void>((resolve) => {
    mock.res.on('finish', () => resolve())
    app(mock.req, mock.res, (err?: any) => {
      if (err) resolve()
    })
    if (mock.req.body !== undefined) {
      process.nextTick(() => {
        mock.req.emit('data', Buffer.from(JSON.stringify(mock.req.body)))
        mock.req.emit('end')
      })
    } else {
      process.nextTick(() => {
        mock.req.emit('end')
      })
    }
  })
}

test('GET /api/health returns health status and security headers', async () => {
  const originalDbUri = process.env.MONGODB_URI
  delete process.env.MONGODB_URI

  try {
    const app = createApp()
    const mock = createMockReqRes({ method: 'GET', url: '/api/health' })
    await dispatchRequest(app, mock)

    assert.equal(mock.getStatus(), 200)
    assert.equal(mock.getHeaders()['X-Content-Type-Options'], 'nosniff')
    assert.equal(mock.getHeaders()['X-Frame-Options'], 'DENY')
    assert.equal(mock.getHeaders()['X-XSS-Protection'], '0')
    assert.equal(mock.getHeaders()['Referrer-Policy'], 'no-referrer')

    assert.deepEqual(mock.getJson(), {
      ok: true,
      service: 'local-agent-studio',
      database: false,
      rules: true
    })
  } finally {
    if (originalDbUri !== undefined) {
      process.env.MONGODB_URI = originalDbUri
    }
  }
})

test('GET /api/health reflects MONGODB_URI presence', async () => {
  const originalDbUri = process.env.MONGODB_URI
  process.env.MONGODB_URI = 'mongodb://localhost:27017/test_db'

  try {
    const app = createApp()
    const mock = createMockReqRes({ method: 'GET', url: '/api/health' })
    await dispatchRequest(app, mock)

    assert.equal(mock.getStatus(), 200)
    assert.equal(mock.getJson().database, true)
  } finally {
    if (originalDbUri !== undefined) {
      process.env.MONGODB_URI = originalDbUri
    } else {
      delete process.env.MONGODB_URI
    }
  }
})

test('Protected /api routes require API key when LOCAL_AGENT_API_KEY is set', async () => {
  const originalApiKey = process.env.LOCAL_AGENT_API_KEY
  process.env.LOCAL_AGENT_API_KEY = 'test-secret-key'

  try {
    const app = createApp()
    const mockUnauth = createMockReqRes({ method: 'GET', url: '/api/tools' })
    await dispatchRequest(app, mockUnauth)

    assert.equal(mockUnauth.getStatus(), 401)
    assert.deepEqual(mockUnauth.getJson(), { error: 'Unauthorized' })

    const mockAuth = createMockReqRes({
      method: 'GET',
      url: '/api/tools',
      headers: { 'x-api-key': 'test-secret-key' }
    })
    await dispatchRequest(app, mockAuth)

    assert.equal(mockAuth.getStatus(), 200)
    assert.ok(Array.isArray(mockAuth.getJson()))
  } finally {
    if (originalApiKey !== undefined) {
      process.env.LOCAL_AGENT_API_KEY = originalApiKey
    } else {
      delete process.env.LOCAL_AGENT_API_KEY
    }
  }
})

test('GET /api/tools returns available tools', async () => {
  const store = new Store()
  const app = createApp(store)
  const mock = createMockReqRes({ method: 'GET', url: '/api/tools' })
  await dispatchRequest(app, mock)

  assert.equal(mock.getStatus(), 200)
  const tools = mock.getJson() as any[]
  assert.ok(Array.isArray(tools))
  assert.ok(tools.length > 0)
  assert.ok(tools.some((t) => t.name === 'execute_python'))
})

test('PATCH /api/tools/:name toggles tool status', async () => {
  const store = new Store()
  const toolsMap = new Map<string, ToolDoc>(defaultTools.map((t) => [t.name, { ...t }]))
  store.setTool = async (name: string, enabled: boolean) => {
    const tool = toolsMap.get(name)
    if (tool) tool.enabled = enabled
    return tool
  }

  const app = createApp(store)
  const mock = createMockReqRes({
    method: 'PATCH',
    url: '/api/tools/web_search_tavily',
    body: { enabled: true }
  })
  await dispatchRequest(app, mock)

  assert.equal(mock.getStatus(), 200)
  const updatedTool = mock.getJson() as any
  assert.equal(updatedTool.name, 'web_search_tavily')
  assert.equal(updatedTool.enabled, true)
})

test('POST /api/chat enforces rate limiting and delegates to handleChatRequest', async () => {
  const store = new Store()
  const app = createApp(store)
  const originalDeepseekKey = process.env.DEEPSEEK_API_KEY
  delete process.env.DEEPSEEK_API_KEY

  try {
    const mockInvalid = createMockReqRes({
      method: 'POST',
      url: '/api/chat',
      body: { message: '' }
    })
    await dispatchRequest(app, mockInvalid)

    assert.equal(mockInvalid.getStatus(), 400)
    assert.equal(mockInvalid.getJson().error, 'Message is required')
    assert.equal(mockInvalid.getHeaders()['ratelimit-limit'], '100')

    const mockValid = createMockReqRes({
      method: 'POST',
      url: '/api/chat',
      body: { message: 'Hello agent' }
    })
    await dispatchRequest(app, mockValid)

    assert.equal(mockValid.getStatus(), 200)
    assert.match(mockValid.getJson().message, /DeepSeek is not configured yet/)
    assert.equal(mockValid.getHeaders()['ratelimit-limit'], '100')
  } finally {
    if (originalDeepseekKey !== undefined) {
      process.env.DEEPSEEK_API_KEY = originalDeepseekKey
    }
  }
})

test('Wildcard route serves public index.html SPA fallback', async () => {
  const app = createApp()
  const mock = createMockReqRes({ method: 'GET', url: '/some/client/route' })
  await dispatchRequest(app, mock)

  assert.equal(mock.getStatus(), 200)
  assert.equal(mock.getSentFile(), path.resolve('public/index.html'))
})
