import fs from 'node:fs/promises'
import path from 'node:path'

const base = path.resolve(process.env.AGENT_ROOT ?? process.cwd())
const rulesPath = path.join(base, 'rules.md')
const skillByTool: Record<string, string> = {
  execute_python: 'code-execution', execute_node: 'code-execution',
  convert_to_pdf: 'pdf', generate_docx: 'docx', generate_xlsx: 'xlsx', generate_pptx: 'pptx',
  web_search_searxng: 'web-search', web_search_tavily: 'web-search', web_fetch: 'web-search',
  image_generate: 'image-generation', image_vision: 'vision', screenshot_url: 'ahm7-wrapper', text_to_speech: 'ahm7-wrapper',
  drive_upload: 'ahm7-wrapper', download_video: 'ahm7-wrapper', download_video_ahm7: 'ahm7-wrapper', temp_email: 'ahm7-wrapper',
  wiki_to_pdf: 'ahm7-wrapper', audio_transcribe: 'ahm7-wrapper', certificate_generate: 'ahm7-wrapper', text_to_handwriting: 'ahm7-wrapper',
  manga_reader: 'ahm7-wrapper', novel_reader: 'ahm7-wrapper', urdu_novel: 'ahm7-wrapper', movies: 'ahm7-wrapper',
  telenor_quiz: 'ahm7-wrapper', n8n_workflow_explorer: 'ahm7-wrapper'
}
const cache = new Map<string, string>()
async function readCached(file: string) { const cached = cache.get(file); if (cached) return cached; const text = await fs.readFile(file, 'utf8'); cache.set(file, text); return text }
export async function loadRules() { return readCached(rulesPath) }
export async function loadSkillForTool(toolName: string) { const skill = skillByTool[toolName]; if (!skill) return ''; return readCached(path.join(base, 'skills', skill, 'SKILL.md')) }
