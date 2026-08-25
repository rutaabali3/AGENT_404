import { MongoClient, Db } from 'mongodb'

export type ToolDoc = {
  name: string; description: string; category: string; enabled: boolean; requires_sandbox: boolean
  parameters: Record<string, unknown>; handler: string; created_at?: Date; updated_at?: Date
}

export const defaultTools: ToolDoc[] = [
  { name: 'execute_python', description: 'Run Python code in an isolated Docker sandbox.', category: 'code_execution', enabled: true, requires_sandbox: true, parameters: { type: 'object', properties: { code: { type: 'string' } }, required: ['code'] }, handler: 'sandbox.executePython' },
  { name: 'execute_node', description: 'Run Node.js code in an isolated Docker sandbox.', category: 'code_execution', enabled: true, requires_sandbox: true, parameters: { type: 'object', properties: { code: { type: 'string' } }, required: ['code'] }, handler: 'sandbox.executeNode' },
  { name: 'read_file', description: 'Read a file from the scoped workspace.', category: 'filesystem', enabled: true, requires_sandbox: false, parameters: { type: 'object', properties: { path: { type: 'string' } }, required: ['path'] }, handler: 'filesystem.read' },
  { name: 'write_file', description: 'Write a file to the scoped workspace.', category: 'filesystem', enabled: true, requires_sandbox: false, parameters: { type: 'object', properties: { path: { type: 'string' }, content: { type: 'string' } }, required: ['path', 'content'] }, handler: 'filesystem.write' },
  { name: 'list_files', description: 'List files in the scoped workspace.', category: 'filesystem', enabled: true, requires_sandbox: false, parameters: { type: 'object', properties: {} }, handler: 'filesystem.list' },
  { name: 'web_search_searxng', description: 'Search the web through a local SearXNG instance.', category: 'web', enabled: true, requires_sandbox: false, parameters: { type: 'object', properties: { query: { type: 'string' } }, required: ['query'] }, handler: 'web.searchSearxng' },
  { name: 'web_search_tavily', description: 'Search the web using Tavily as a fallback.', category: 'web', enabled: false, requires_sandbox: false, parameters: { type: 'object', properties: { query: { type: 'string' } }, required: ['query'] }, handler: 'web.searchTavily' },
  { name: 'web_fetch', description: 'Fetch readable text from a public web page.', category: 'web', enabled: true, requires_sandbox: false, parameters: { type: 'object', properties: { url: { type: 'string' } }, required: ['url'] }, handler: 'web.fetch' },
  ...(['screenshot_url','text_to_speech','image_vision','image_generate','drive_upload','download_video','download_video_ahm7','temp_email','wiki_to_pdf','audio_transcribe','certificate_generate','text_to_handwriting','manga_reader','novel_reader','urdu_novel','movies','telenor_quiz','n8n_workflow_explorer'].map(name => ({ name, description: `AHM7 integration: ${name}.`, category: 'media', enabled: ['screenshot_url','text_to_speech','image_vision','image_generate','drive_upload','download_video'].includes(name), requires_sandbox: false, parameters: { type: 'object', properties: { input: { type: 'string' } } }, handler: `ahm7.${name}` })))
]

export class Store {
  private client?: MongoClient; private db?: Db
  constructor(private uri = process.env.MONGODB_URI, private dbName = process.env.MONGODB_DB ?? 'local_agent') {}
  async connect() { if (!this.uri) return; this.client = new MongoClient(this.uri); await this.client.connect(); this.db = this.client.db(this.dbName); const col = this.db.collection<ToolDoc>('tools'); if (await col.countDocuments() === 0) await col.insertMany(defaultTools.map(t => ({ ...t, created_at: new Date(), updated_at: new Date() }))); }
  async tools() { if (!this.db) return defaultTools; return this.db.collection<ToolDoc>('tools').find().sort({ category: 1, name: 1 }).toArray() }
  async setTool(name: string, enabled: boolean) { if (this.db) await this.db.collection('tools').updateOne({ name }, { $set: { enabled, updated_at: new Date() } }); return (await this.tools()).find(t => t.name === name) }
  async saveSession(messages: unknown[]) { if (this.db) await this.db.collection('sessions').insertOne({ messages, created_at: new Date() }) }
  async logTool(entry: unknown) { if (this.db) await this.db.collection('tool_logs').insertOne({ ...entry as object, created_at: new Date() }) }
  async close() { await this.client?.close() }
}
