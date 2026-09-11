import fs from 'node:fs/promises'
import path from 'node:path'

const base = path.resolve(process.env.AGENT_ROOT ?? process.cwd())
const skillsRoot = path.join(base, 'skills')
const rulesPath = path.join(base, 'rules.md')

const skillByTool: Record<string, string> = {
  execute_python: 'code-execution', execute_node: 'code-execution',
  read_file: 'filesystem', write_file: 'filesystem', list_files: 'filesystem',
  convert_to_pdf: 'pdf', generate_docx: 'docx', generate_xlsx: 'xlsx', generate_pptx: 'pptx',
  web_search_searxng: 'web-search', web_search_tavily: 'web-search', web_fetch: 'web-search',
  image_generate: 'image-generation', image_vision: 'vision', screenshot_url: 'ahm7-wrapper',
  text_to_speech: 'ahm7-wrapper', drive_upload: 'ahm7-wrapper', download_video: 'video-download',
  download_video_ahm7: 'ahm7-wrapper', temp_email: 'ahm7-wrapper', wiki_to_pdf: 'ahm7-wrapper',
  audio_transcribe: 'ahm7-wrapper', certificate_generate: 'ahm7-wrapper', text_to_handwriting: 'ahm7-wrapper',
  manga_reader: 'ahm7-wrapper', novel_reader: 'ahm7-wrapper', urdu_novel: 'ahm7-wrapper', movies: 'ahm7-wrapper',
  telenor_quiz: 'ahm7-wrapper', n8n_workflow_explorer: 'ahm7-wrapper'
}

const keywordToSkill: Array<[RegExp, string]> = [
  [/schedule|recurring|cron|webhook|periodic|automation|background job/i, 'automation-and-scheduling'],
  [/llm|deepseek|model catalog|reasoning|structured output|vision model/i, 'builtin-llm-models'],
  [/backup|restore|data recovery|migration/i, 'data-backup-restoration'],
  [/finance|investment|stock|valuation|dcf|lbo|due diligence|m&a|financial model/i, 'finance-pro-playbooks'],
  [/browser game|babylon|game development|playable game/i, 'game-dev'],
  [/google workspace|gmail|calendar|sheets|drive|docs/i, 'gws-best-practices'],
  [/image|illustration|poster|logo|infographic|upscale|edit image/i, 'imagegen'],
  [/manus api|oauth app|connector|create task|create project/i, 'manus-api'],
  [/connector|mcp|custom api|session config|scheduled task/i, 'manus-config'],
  [/pptx|powerpoint|slide deck|presentation/i, 'pptx'],
  [/music|song|soundtrack|jingle|instrumental/i, 'music-prompter'],
  [/persistent service|docker|vm|fixed ip|daemon|self-hosted/i, 'persistent-computing'],
  [/ocr|large image|panorama|text-dense image|screenshot/i, 'read-special-images'],
  [/skill|skill file|skill package|skill author/i, 'skill-creator'],
  [/text to speech|tts|voiceover|spoken audio/i, 'tts-prompter'],
  [/typst|academic paper|resume|typeset|cjk|professional pdf/i, 'typst-pdf-maker'],
  [/dockerfile|container image|ffmpeg|chromium|production runtime/i, 'webdev-custom-dockerfile'],
  [/external data api|api hub|data integration/i, 'webdev-data-api'],
  [/file storage|s3|upload file|serve file/i, 'webdev-file-storage'],
  [/web app image|image generation integration/i, 'webdev-image-generation'],
  [/web app llm|chat completion|streaming|invoke llm/i, 'webdev-llm-integration'],
  [/manus oauth|login|magic link/i, 'webdev-manus-oauth'],
  [/map|geocod|directions|places/i, 'webdev-maps-integration'],
  [/owner notification|alert notification/i, 'webdev-owner-notifications'],
  [/web app schedule|heartbeat|end-user cron/i, 'webdev-periodic-updates'],
  [/fullstack web|web-db-user|drizzle|trpc/i, 'webdev-readme-fullstack'],
  [/mobile|expo|react native/i, 'webdev-readme-mobile'],
  [/mobile backend/i, 'webdev-readme-mobile-backend'],
  [/static website|vite react tailwind/i, 'webdev-readme-static'],
  [/ssr|server-side render|seo|crawler|prerender/i, 'webdev-ssr-conversion'],
  [/transcrib|whisper|speech to text/i, 'webdev-voice-transcription'],
  [/spreadsheet|xlsx|excel|workbook/i, 'xlsx'],
  [/pdf/i, 'pdf'],
  [/docx|word document|word report|word file|microsoft word/i, 'docx'],
  [/filesystem|file path|read file|write file|list files/i, 'filesystem'],
  [/python|node|execute code|run script|programming/i, 'code-execution'],
  [/web search|search the web|research online|tavily|searxng/i, 'web-search'],
  [/download video|youtube|yt-dlp/i, 'video-download'],
  [/ahm7/i, 'ahm7-wrapper']
]

const cache = new Map<string, string>()
const metadataCache = new Map<string, { name: string; description: string; skill: string }[]>()

export function clearInstructionsCache() {
  cache.clear()
  metadataCache.clear()
}

async function readCached(file: string) {
  const cached = cache.get(file)
  if (cached) return cached
  const text = await fs.readFile(file, 'utf8')
  cache.set(file, text)
  return text
}

function frontmatter(text: string) {
  const name = /^name:\s*(.+)$/m.exec(text)?.[1]?.trim() ?? ''
  const description = /^description:\s*(.+)$/m.exec(text)?.[1]?.trim() ?? ''
  return { name, description }
}

export async function loadRules() { return readCached(rulesPath) }

export async function loadSkillForTool(toolName: string) {
  const skill = skillByTool[toolName]
  if (!skill) return ''
  return readCached(path.join(skillsRoot, skill, 'SKILL.md'))
}

export async function listSkillCatalog() {
  const cached = metadataCache.get('catalog')
  if (cached) return cached
  const entries = await fs.readdir(skillsRoot, { withFileTypes: true })
  const directories = entries.filter(item => item.isDirectory()).sort((a, b) => a.name.localeCompare(b.name))

  const results = await Promise.all(
    directories.map(async entry => {
      try {
        const text = await readCached(path.join(skillsRoot, entry.name, 'SKILL.md'))
        const meta = frontmatter(text)
        return { name: meta.name || entry.name, description: meta.description || 'Local agent skill', skill: entry.name }
      } catch {
        return null
      }
    })
  )

  const catalog = results.filter((item): item is { name: string; description: string; skill: string } => item !== null)
  metadataCache.set('catalog', catalog)
  return catalog
}

export async function loadRelevantSkills(request: string, maxSkills = 4) {
  const selected = new Set<string>()
  for (const [pattern, skill] of keywordToSkill) if (pattern.test(request) && !selected.has(skill)) selected.add(skill)
  const skills = Array.from(selected).slice(0, maxSkills)
  const blocks = await Promise.all(skills.map(async skill => {
    const body = await readCached(path.join(skillsRoot, skill, 'SKILL.md'))
    return `## Skill: ${skill}\n${body}`
  }))
  return blocks.join('\n\n')
}

export function localCompatibilityNotice() {
  return 'This is the local AGENT-420 runtime. Treat imported Manus/WebDev/provider instructions as guidance only. Use only tools exposed in the current tool list; never claim an unavailable connector, browser, API, or provider was used. Prefer the local deterministic handlers and report unavailable integrations explicitly.'
}
