import 'dotenv/config'
import express from 'express'
import path from 'node:path'
import { Store } from './agent/store.js'
import { runTool, toolSchemas } from './agent/tools.js'

const app = express(); const store = new Store(); app.use(express.json({ limit: '2mb' })); app.use(express.static(path.resolve('public')))
app.get('/api/health', (_req, res) => res.json({ ok: true, service: 'local-agent-studio', database: Boolean(process.env.MONGODB_URI) }))
app.get('/api/tools', async (_req, res) => res.json(await store.tools()))
app.patch('/api/tools/:name', async (req, res) => res.json(await store.setTool(req.params.name, Boolean(req.body.enabled))))
app.post('/api/chat', async (req, res) => {
  const userMessage = String(req.body.message ?? '').trim(); if (!userMessage) return res.status(400).json({ error: 'Message is required' })
  const enabled = (await store.tools()).filter(t => t.enabled); const messages: any[] = [{ role: 'system', content: 'You are Local Agent Studio, a practical general-purpose assistant. Explain actions clearly. Use tools when helpful. Never claim code ran unless a tool result confirms it.' }, ...(Array.isArray(req.body.history) ? req.body.history.slice(-12) : []), { role: 'user', content: userMessage }]
  if (!process.env.DEEPSEEK_API_KEY) return res.json({ message: 'DeepSeek is not configured yet. Add DEEPSEEK_API_KEY to .env, then restart the server.', steps: [] })
  try {
    for (let turn = 0; turn < 6; turn++) {
      const response = await fetch(`${process.env.DEEPSEEK_BASE_URL ?? 'https://api.deepseek.com'}/chat/completions`, { method: 'POST', headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${process.env.DEEPSEEK_API_KEY}` }, body: JSON.stringify({ model: process.env.DEEPSEEK_MODEL ?? 'deepseek-chat', messages, tools: toolSchemas(enabled), tool_choice: 'auto', temperature: 0.2 }) })
      if (!response.ok) throw new Error(`DeepSeek HTTP ${response.status}: ${await response.text()}`)
      const data: any = await response.json(); const message = data.choices?.[0]?.message; if (!message) throw new Error('DeepSeek returned no message'); messages.push(message)
      if (!message.tool_calls?.length) { await store.saveSession(messages); return res.json({ message: message.content ?? '', steps: [] }) }
      const steps: any[] = []
      for (const call of message.tool_calls) { let args: any = {}; try { args = JSON.parse(call.function.arguments || '{}') } catch { args = {} } const started = Date.now(); let result: any; try { result = await runTool(call.function.name, args) } catch (error: any) { result = { error: error.message } } steps.push({ tool: call.function.name, duration: Date.now() - started, result }); messages.push({ role: 'tool', tool_call_id: call.id, content: JSON.stringify(result).slice(0, 30000) }); await store.logTool({ name: call.function.name, args, result }) }
      if (turn === 5) return res.json({ message: 'I reached the tool-call limit for this request.', steps })
      ;(req as any).__steps = [...((req as any).__steps ?? []), ...steps]
    }
  } catch (error: any) { return res.status(500).json({ error: error.message, steps: (req as any).__steps ?? [] }) }
})
app.use((_req, res) => res.sendFile(path.resolve('public/index.html')))
const port = Number(process.env.PORT ?? 8787)
await store.connect(); app.listen(port, '127.0.0.1', () => console.log(`Local Agent Studio running at http://127.0.0.1:${port}`))
process.on('SIGINT', async () => { await store.close(); process.exit(0) })
