import 'dotenv/config'
import express from 'express'
import path from 'node:path'
import { Store } from './agent/store.js'
import { handleChatRequest } from './agent/chat.js'

import { requireApiKey, securityHeaders } from './agent/auth.js'

const app = express()
const store = new Store()

app.use(securityHeaders)
app.use(express.json({ limit: '2mb' }))
app.use(express.static(path.resolve('public')))

export { requireApiKey, securityHeaders }

app.get('/api/health', (_req, res) => {
  res.json({
    ok: true,
    service: 'local-agent-studio',
    database: Boolean(process.env.MONGODB_URI),
    rules: true
  })
})

app.use('/api', requireApiKey)

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
