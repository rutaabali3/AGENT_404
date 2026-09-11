import test from 'node:test'
import assert from 'node:assert/strict'
import { listSkillCatalog, loadRules, loadRelevantSkills } from '../src/agent/instructions.js'

test('listSkillCatalog loads skills catalog concurrently and caches output', async () => {
  const catalog = await listSkillCatalog()
  assert.ok(Array.isArray(catalog))
  assert.ok(catalog.length > 0)

  for (const item of catalog) {
    assert.ok(typeof item.name === 'string' && item.name.length > 0)
    assert.ok(typeof item.description === 'string' && item.description.length > 0)
    assert.ok(typeof item.skill === 'string' && item.skill.length > 0)
  }

  // Ensure items are sorted alphabetically by directory/skill name
  const skillNames = catalog.map(c => c.skill)
  const sortedNames = [...skillNames].sort((a, b) => a.localeCompare(b))
  assert.deepEqual(skillNames, sortedNames)

  // Verify second invocation returns cached catalog
  const catalogCached = await listSkillCatalog()
  assert.strictEqual(catalog, catalogCached)
})

test('loadRules and loadRelevantSkills return expected content', async () => {
  const rules = await loadRules()
  assert.ok(typeof rules === 'string' && rules.length > 0)

  const relevant = await loadRelevantSkills('generate pdf document')
  assert.ok(typeof relevant === 'string' && relevant.includes('pdf'))
})

test('benchmark loadRelevantSkills matching loop performance', async () => {
  const requests = [
    'I need to schedule a recurring job with docker and python script',
    'Generate a pdf document with custom typst template and excel sheet',
    'Deploy web app with llm integration, static website, and image generation',
    'Transcribe audio voiceover with whisper and text to speech'
  ]

  // Warmup
  for (let i = 0; i < 1000; i++) {
    await loadRelevantSkills(requests[i % requests.length])
  }

  const start = performance.now()
  const iterations = 100000
  for (let i = 0; i < iterations; i++) {
    await loadRelevantSkills(requests[i % requests.length])
  }
  const end = performance.now()
  const duration = end - start

  console.log(`[Benchmark] loadRelevantSkills ${iterations} iterations took ${duration.toFixed(2)} ms (${(duration / iterations * 1000).toFixed(3)} µs/op)`)
})
