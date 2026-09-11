import test from 'node:test'
import assert from 'node:assert/strict'
import { Store, defaultTools } from '../src/agent/store.js'

test('defaultTools - initialization and property correctness for mapped AHM7 tools', () => {
  const mappedNames = [
    'screenshot_url', 'text_to_speech', 'image_vision', 'image_generate',
    'drive_upload', 'download_video', 'download_video_ahm7', 'temp_email',
    'wiki_to_pdf', 'audio_transcribe', 'certificate_generate', 'text_to_handwriting',
    'manga_reader', 'novel_reader', 'urdu_novel', 'movies', 'telenor_quiz',
    'n8n_workflow_explorer'
  ]

  const enabledNames = new Set([
    'screenshot_url', 'text_to_speech', 'image_vision',
    'image_generate', 'drive_upload', 'download_video'
  ])

  // Verify unique names in defaultTools
  const names = defaultTools.map(t => t.name)
  assert.equal(names.length, new Set(names).size, 'defaultTools contains duplicate tool names')

  for (const name of mappedNames) {
    const tool = defaultTools.find(t => t.name === name)
    assert.ok(tool, `Tool ${name} should exist in defaultTools`)
    assert.equal(tool.category, 'media')
    assert.equal(tool.requires_sandbox, false)
    assert.equal(tool.description, `AHM7 integration: ${name}.`)
    assert.deepEqual(tool.parameters, { type: 'object', properties: { input: { type: 'string' } } })

    if (enabledNames.has(name)) {
      assert.equal(tool.enabled, true, `Tool ${name} should be enabled`)
    } else {
      assert.equal(tool.enabled, false, `Tool ${name} should be disabled`)
    }

    if (name === 'download_video') {
      assert.equal(tool.handler, 'media.downloadVideo')
    } else {
      assert.equal(tool.handler, `ahm7.${name}`)
    }
  }
})

test('defaultTools - schema compliance for all default tools', () => {
  for (const tool of defaultTools) {
    assert.ok(tool.name && typeof tool.name === 'string', 'Tool must have a non-empty string name')
    assert.ok(tool.description && typeof tool.description === 'string', 'Tool must have a non-empty description')
    assert.ok(tool.category && typeof tool.category === 'string', 'Tool must have a non-empty category')
    assert.equal(typeof tool.enabled, 'boolean', 'Tool enabled property must be boolean')
    assert.equal(typeof tool.requires_sandbox, 'boolean', 'Tool requires_sandbox property must be boolean')
    assert.ok(tool.handler && typeof tool.handler === 'string', 'Tool must have a non-empty handler')
    assert.ok(tool.parameters && typeof tool.parameters === 'object', 'Tool parameters must be an object')
  }
})

test('Store - disconnected fallback behavior', async () => {
  const store = new Store(undefined) // No MongoDB URI
  const tool = await store.getTool('execute_python')
  assert.ok(tool)
  assert.equal(tool?.name, 'execute_python')

  const nonExistent = await store.getTool('non_existent_tool')
  assert.equal(nonExistent, undefined)
})

test('Store - getTool with in-memory store simulation / benchmark', async () => {
  // Benchmark comparing finding in array vs findOne query simulation
  const numTools = 10000
  const mockTools = Array.from({ length: numTools }, (_, i) => ({
    name: `tool_${i}`,
    description: `Description ${i}`,
    category: i % 2 === 0 ? 'cat_a' : 'cat_b',
    enabled: true,
    requires_sandbox: false,
    parameters: {},
    handler: `handler_${i}`
  }))

  const targetName = `tool_${numTools - 1}`

  // Method 1 (Old): Fetch all tools sorted, then array.find
  const iterations = 1000
  const startOld = performance.now()
  for (let i = 0; i < iterations; i++) {
    const sorted = [...mockTools].sort((a, b) => a.category.localeCompare(b.category) || a.name.localeCompare(b.name))
    const found = sorted.find(t => t.name === targetName)
    assert.equal(found?.name, targetName)
  }
  const durationOld = performance.now() - startOld

  // Method 2 (New): Direct lookup (or MongoDB findOne)
  const map = new Map(mockTools.map(t => [t.name, t]))
  const startNew = performance.now()
  for (let i = 0; i < iterations; i++) {
    const found = map.get(targetName)
    assert.equal(found?.name, targetName)
  }
  const durationNew = performance.now() - startNew

  console.log(`Benchmark (${iterations} ops on ${numTools} tools):`)
  console.log(`  Old (fetch all + sort + find): ${durationOld.toFixed(2)} ms`)
  console.log(`  New (direct lookup): ${durationNew.toFixed(2)} ms`)
  console.log(`  Speedup: ${(durationOld / durationNew).toFixed(1)}x faster`)
})
