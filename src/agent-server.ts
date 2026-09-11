import 'dotenv/config'
import express from 'express'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import { Store } from './agent/store.js'
import { handleChatRequest } from './agent/chat.js'
import { requireApiKey, securityHeaders } from './agent/auth.js'

export { requireApiKey, securityHeaders }

export function createApp(store: Store = new Store()) {
  const app = express()

  app.use(express.json({ limit: '2mb' }))
  app.use(express.static(path.resolve('public')))
  app.use(securityHeaders)

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

  return app
}

export async function startServer() {
  const store = new Store()
  const app = createApp(store)
  const port = Number(process.env.PORT ?? 8787)
  await store.connect()

  const server = app.listen(port, '127.0.0.1', () => {
    console.log(`Local Agent Studio running at http://127.0.0.1:${port}`)
  })

  process.on('SIGINT', async () => {
    await store.close()
    process.exit(0)
  })

  return { app, store, server }
}

const isMain = process.argv[1] ? path.resolve(process.argv[1]) === fileURLToPath(import.meta.url) : false

if (isMain) {
  startServer().catch(console.error)
}
