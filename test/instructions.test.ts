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

  // Handle empty or whitespace request edge cases
  const emptyRelevant = await loadRelevantSkills('')
  assert.strictEqual(emptyRelevant, '')

  const spaceRelevant = await loadRelevantSkills('   ')
  assert.strictEqual(spaceRelevant, '')
})

test('benchmark loadRelevantSkills', async () => {
  // Benchmark empty request
  const iterations = 100000
  const startEmpty = performance.now()
  for (let i = 0; i < iterations; i++) {
    await loadRelevantSkills('')
  }
  const durationEmpty = performance.now() - startEmpty
  console.log(`[Benchmark] Empty request (${iterations} ops): ${durationEmpty.toFixed(2)} ms`)

  // Benchmark request that matches skills quickly
  const startMatch = performance.now()
  for (let i = 0; i < iterations; i++) {
    await loadRelevantSkills('schedule llm backup finance browser game pptx music persistent service ocr skill')
  }
  const durationMatch = performance.now() - startMatch
  console.log(`[Benchmark] Matching request (${iterations} ops): ${durationMatch.toFixed(2)} ms`)
})
