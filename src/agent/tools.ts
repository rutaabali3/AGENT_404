import fs from 'node:fs/promises'
import path from 'node:path'
import { execFile } from 'node:child_process'
import { promisify } from 'node:util'
import axios from 'axios'
import { defaultTools } from './store.js'
const exec = promisify(execFile)
const root = path.resolve(process.env.WORKSPACE_DIR ?? './sandbox/workspace')
async function safeFile(p = '') { const resolved = path.resolve(root, p); if (resolved !== root && !resolved.startsWith(root + path.sep)) throw new Error('Path is outside the workspace'); return resolved }
export async function listFiles() { await fs.mkdir(root, { recursive: true }); return (await fs.readdir(root, { withFileTypes: true })).map(x => ({ name: x.name, type: x.isDirectory() ? 'directory' : 'file' })) }
export async function readFile(p: string) { return await fs.readFile(await safeFile(p), 'utf8') }
export async function writeFile(p: string, content: string) { const f = await safeFile(p); await fs.mkdir(path.dirname(f), { recursive: true }); await fs.writeFile(f, content, 'utf8'); return { path: p, bytes: Buffer.byteLength(content) } }
async function dockerRun(language: 'python'|'node', code: string) { const host = path.resolve(process.cwd(), 'sandbox'); const work = path.join(host, 'workspace'); await fs.mkdir(work, { recursive: true }); await fs.mkdir(path.join(host, 'uploads'), { recursive: true }); await fs.mkdir(path.join(host, 'outputs'), { recursive: true }); const ext = language === 'python' ? 'py' : 'js'; const name = `.agent-run-${Date.now()}-${Math.random().toString(16).slice(2)}.${ext}`; const local = path.join(work, name); await fs.writeFile(local, code, 'utf8'); const image = process.env.SANDBOX_IMAGE ?? 'local-agent-sandbox'; try { const command = language === 'python' ? ['python3', `/sandbox/workspace/${name}`] : ['node', `/sandbox/workspace/${name}`]; const { stdout, stderr } = await exec('docker', ['run','--rm','--memory=1g','--cpus=1','--network','none','--read-only','--tmpfs','/tmp','-v',`${host}/workspace:/sandbox/workspace`,'-v',`${host}/outputs:/sandbox/outputs`,'-v',`${host}/uploads:/sandbox/uploads:ro`,'--user','1000:1000',image,...command], { maxBuffer: 1024 * 1024 }); return { stdout, stderr } } catch (e: any) { return { stdout: e.stdout ?? '', stderr: e.stderr ?? e.message, error: 'Sandbox unavailable or code failed' } } finally { await fs.rm(local, { force: true }) } }
export const handlers: Record<string, (args: any) => Promise<any>> = {
  'filesystem.list': async () => listFiles(), 'filesystem.read': async a => readFile(a.path), 'filesystem.write': async a => writeFile(a.path, a.content),
  'sandbox.executePython': async a => dockerRun('python', a.code), 'sandbox.executeNode': async a => dockerRun('node', a.code),
  'web.searchSearxng': async a => { const url = process.env.SEARXNG_URL ?? 'http://localhost:8080'; const { data } = await axios.get(`${url}/search`, { params: { q: a.query, format: 'json' }, timeout: 10000 }); return data.results?.slice(0, 8) ?? data },
  'web.searchTavily': async a => { if (!process.env.TAVILY_API_KEY) return { error: 'TAVILY_API_KEY is not configured' }; const { data } = await axios.post('https://api.tavily.com/search', { api_key: process.env.TAVILY_API_KEY, query: a.query, max_results: 5 }); return data },
  'web.fetch': async a => { const { data } = await axios.get(a.url, { timeout: 15000, responseType: 'text' }); return String(data).replace(/<script[\s\S]*?<\/script>|<style[\s\S]*?<\/style>/gi, '').replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ').slice(0, 20000) },
}
for (const tool of defaultTools.filter(t => t.handler.startsWith('ahm7.'))) handlers[tool.handler] = async () => ({ error: 'AHM7 integration is registered but not configured in this local build.' })
export function toolSchemas(tools: any[]) { return tools.filter(t => t.enabled).map(t => ({ type: 'function', function: { name: t.name, description: t.description, parameters: t.parameters } })) }
export async function runTool(name: string, args: any) { const tool = defaultTools.find(t => t.name === name); if (!tool) throw new Error(`Unknown tool ${name}`); const handler = handlers[tool.handler]; if (!handler) throw new Error(`No handler for ${name}`); return handler(args) }
