import fs from 'node:fs/promises'
import path from 'node:path'
import { execFile } from 'node:child_process'
import { promisify } from 'node:util'
import axios from 'axios'
import { defaultTools, ToolDoc } from './store.js'
import { convertToPdf, generateDocx, generateXlsx, generatePptx } from './generators.js'
const exec = promisify(execFile)
const root = path.resolve(process.env.WORKSPACE_DIR ?? './sandbox/workspace')

export function assertSafeUrl(urlString: string) {
  let parsed: URL
  try {
    parsed = new URL(urlString)
  } catch {
    throw new Error('Invalid URL format')
  }
  if (parsed.protocol !== 'http:' && parsed.protocol !== 'https:') {
    throw new Error('Only http and https protocols are allowed')
  }
  const hostname = parsed.hostname.toLowerCase().replace(/^\[|\]$/g, '')
  if (
    hostname === 'localhost' ||
    hostname.endsWith('.localhost') ||
    hostname.endsWith('.local') ||
    hostname.endsWith('.internal')
  ) {
    throw new Error('Access to local or internal network host is restricted')
  }
  if (hostname.includes(':')) {
    if (
      hostname === '::1' ||
      hostname === '::' ||
      hostname === '0.0.0.0' ||
      hostname.startsWith('fe80:') ||
      hostname.startsWith('fc') ||
      hostname.startsWith('fd') ||
      hostname.startsWith('::ffff:')
    ) {
      throw new Error('Access to local or internal network host is restricted')
    }
  }
  // Check IPv4 addresses
  const ipv4Match = /^(\d{1,3})\.(\d{1,3})\.(\d{1,3})\.(\d{1,3})$/.exec(hostname)
  if (ipv4Match) {
    const [, a, b] = ipv4Match.map(Number)
    if (
      a === 127 || // Loopback
      a === 10 || // Private 10.0.0.0/8
      a === 0 || // 0.0.0.0/8
      (a === 172 && b >= 16 && b <= 31) || // Private 172.16.0.0/12
      (a === 192 && b === 168) || // Private 192.168.0.0/16
      (a === 169 && b === 254) // Link-local / Cloud metadata 169.254.0.0/16
    ) {
      throw new Error('Access to private or local IP address is restricted')
    }
  }
  if (hostname === '0' || /^0x[0-9a-f]+$/i.test(hostname) || /^\d+$/.test(hostname)) {
    throw new Error('Access to private or local IP address is restricted')
  }
}
async function safeFile(p = '') { const resolved = path.resolve(root, p); if (resolved !== root && !resolved.startsWith(root + path.sep)) throw new Error('Path is outside the workspace'); return resolved }
export async function listFiles() { await fs.mkdir(root, { recursive: true }); return (await fs.readdir(root, { withFileTypes: true })).map(x => ({ name: x.name, type: x.isDirectory() ? 'directory' : 'file' })) }
export async function readFile(p: string) { return await fs.readFile(await safeFile(p), 'utf8') }
export async function writeFile(p: string, content: string) { const f = await safeFile(p); await fs.mkdir(path.dirname(f), { recursive: true }); await fs.writeFile(f, content, 'utf8'); return { path: p, bytes: Buffer.byteLength(content) } }
async function dockerRun(language: 'python'|'node', code: string) { const host = path.resolve(process.cwd(), 'sandbox'); const work = path.join(host, 'workspace'); await fs.mkdir(work, { recursive: true }); await fs.mkdir(path.join(host, 'uploads'), { recursive: true }); await fs.mkdir(path.join(host, 'outputs'), { recursive: true }); const ext = language === 'python' ? 'py' : 'js'; const name = `.agent-run-${Date.now()}-${Math.random().toString(16).slice(2)}.${ext}`; const local = path.join(work, name); await fs.writeFile(local, code, 'utf8'); const image = process.env.SANDBOX_IMAGE ?? 'local-agent-sandbox'; const memLimit = process.env.SANDBOX_MEMORY_LIMIT ?? '1024m'; try { const command = language === 'python' ? ['python3', `/sandbox/workspace/${name}`] : ['node', `/sandbox/workspace/${name}`]; const { stdout, stderr } = await exec('docker', ['run','--rm',`--memory=${memLimit}`,'--cpus=1','--network','none','--read-only','--tmpfs','/tmp','-v',`${host}/workspace:/sandbox/workspace`,'-v',`${host}/outputs:/sandbox/outputs`,'-v',`${host}/uploads:/sandbox/uploads:ro`,'--user','1000:1000',image,...command], { maxBuffer: 1024 * 1024 }); return { stdout, stderr } } catch (e: any) { return { stdout: e.stdout ?? '', stderr: e.stderr ?? e.message, error: 'Sandbox unavailable or code failed' } } finally { await fs.rm(local, { force: true }) } }
export const handlers: Record<string, (args: any) => Promise<any>> = {
  'filesystem.list': async () => listFiles(), 'filesystem.read': async a => readFile(a.path), 'filesystem.write': async a => writeFile(a.path, a.content),
  'files.convertToPdf': async a => convertToPdf(a), 'files.generateDocx': async a => generateDocx(a), 'files.generateXlsx': async a => generateXlsx(a), 'files.generatePptx': async a => generatePptx(a),
  'sandbox.executePython': async a => dockerRun('python', a.code), 'sandbox.executeNode': async a => dockerRun('node', a.code),
  'web.searchSearxng': async a => { const url = process.env.SEARXNG_URL ?? 'http://localhost:8080'; try { const { data } = await axios.get(`${url}/search`, { params: { q: a.query, format: 'json' }, timeout: 10000 }); return { provider: 'searxng', results: data.results?.slice(0, 8) ?? data } } catch (error: any) { if (!process.env.TAVILY_API_KEY) return { error: `SearXNG unavailable: ${error.message}`, fallback: 'TAVILY_API_KEY is not configured' }; const { data } = await axios.post('https://api.tavily.com/search', { api_key: process.env.TAVILY_API_KEY, query: a.query, max_results: 5 }, { timeout: 10000 }); return { provider: 'tavily-fallback', results: data } } },
  'web.searchTavily': async a => { if (!process.env.TAVILY_API_KEY) return { error: 'TAVILY_API_KEY is not configured' }; const { data } = await axios.post('https://api.tavily.com/search', { api_key: process.env.TAVILY_API_KEY, query: a.query, max_results: 5 }, { timeout: 10000 }); return data },
  'web.fetch': async a => {
    assertSafeUrl(a.url); const { data } = await axios.get(a.url, { timeout: 15000, responseType: 'text', maxContentLength: 5 * 1024 * 1024, maxBodyLength: 5 * 1024 * 1024 }); return String(data).replace(/<script[\s\S]*?<\/script>|<style[\s\S]*?<\/style>/gi, '').replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ').slice(0, 20000)
  },
  'media.downloadVideo': async a => { assertSafeUrl(a?.url ?? ''); const outputDir = path.resolve(process.env.OUTPUTS_DIR ?? './sandbox/outputs'); await fs.mkdir(outputDir, { recursive: true }); const template = path.join(outputDir, '%(title).100s.%(ext)s'); try { const { stdout, stderr } = await exec('yt-dlp', ['--no-playlist', '-o', template, '--', a.url], { maxBuffer: 1024 * 1024 }); return { provider: 'yt-dlp', stdout, stderr, outputs: await fs.readdir(outputDir) } } catch (error: any) { return { error: `yt-dlp unavailable or download failed: ${error.message}`, hint: 'Install yt-dlp locally to enable download_video.' } } },
}
for (const tool of defaultTools.filter(t => t.handler.startsWith('ahm7.'))) handlers[tool.handler] = async () => ({ error: 'AHM7 integration is registered but not configured in this local build.' })
export function toolSchemas(tools: ToolDoc[]) { return tools.filter(t => t.enabled).map(t => ({ type: 'function', function: { name: t.name, description: t.description, parameters: t.parameters } })) }
export async function runTool(tool: ToolDoc, args: any) { if (!tool.enabled) throw new Error(`Tool ${tool.name} is disabled`); const handler = handlers[tool.handler]; if (!handler) throw new Error(`No handler for ${tool.name} (${tool.handler})`); return handler(args) }
