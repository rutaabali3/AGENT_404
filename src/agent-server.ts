import 'dotenv/config'
import express from 'express'
import path from 'node:path'
import { Store } from './agent/store.js'
import { handleChatRequest } from './agent/chat.js'

const app = express()
const store = new Store()

app.use(express.json({ limit: '2mb' }))
app.use(express.static(path.resolve('public')))

app.use('/api', (req, res, next) => {
  if (req.path === '/health') return next()
  const apiKey = process.env.LOCAL_AGENT_API_KEY
  if (!apiKey) return next()
  const authHeader = req.headers.authorization
  const headerApiKey = req.headers['x-api-key']
  const providedKey = (typeof headerApiKey === 'string' ? headerApiKey : undefined) ??
    (authHeader ? authHeader.replace(/^Bearer\s+/i, '') : undefined)
  if (!providedKey || providedKey !== apiKey) return res.status(401).json({ error: 'Unauthorized' })
  next()
})

app.get('/api/health', (_req, res) => {
  res.json({
    ok: true,
    service: 'local-agent-studio',
    database: Boolean(process.env.MONGODB_URI),
    rules: true
  })
})

app.get('/api/tools', async (_req, res) => {
  res.json(await store.tools())
})

app.patch('/api/tools/:name', async (req, res) => {
  const name = req.params.name
  const enabled = Boolean(req.body.enabled)
  res.json(await store.setTool(name, enabled))
})

app.post('/api/chat', async (req, res) => {
  const result = await handleChatRequest(req.body ?? {}, store)
  res.status(result.status).json(result.body)
})

app.use((_req, res) => {
  res.sendFile(path.resolve('public/index.html'))
})

const port = Number(process.env.PORT ?? 8787)
await store.connect()

app.listen(port, '127.0.0.1', () => {
  console.log(`Local Agent Studio running at http://127.0.0.1:${port}`)
})

process.on('SIGINT', async () => {
  await store.close()
  process.exit(0)
})
