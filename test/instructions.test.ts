import test from 'node:test'
import assert from 'node:assert/strict'
import { listSkillCatalog, loadRules, loadRelevantSkills, clearInstructionsCache } from '../src/agent/instructions.js'

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

test('loadRelevantSkills handles unmatched queries, deduplication, and maxSkills limit', async () => {
  const empty = await loadRelevantSkills('xyz non matching query')
  assert.strictEqual(empty, '')

  // 'schedule' matches automation-and-scheduling, 'cron' matches automation-and-scheduling (deduplicated)
  // 'pdf' matches pdf, 'python' matches code-execution
  const relevantMax2 = await loadRelevantSkills('schedule cron pdf python execution', 2)
  const blocks = relevantMax2.split('\n\n## Skill: ').filter(Boolean)
  assert.strictEqual(blocks.length, 2)
  assert.ok(relevantMax2.includes('## Skill: automation-and-scheduling'))
})

test('clearInstructionsCache clears memory cache', async () => {
  clearInstructionsCache()
  const relevant = await loadRelevantSkills('pdf')
  assert.ok(relevant.includes('pdf'))
})

test('loadRelevantSkills handles malformed JSON response from LLM and falls back to keyword matching', async () => {
  const originalApiKey = process.env.DEEPSEEK_API_KEY
  const originalFetch = globalThis.fetch

  try {
    process.env.DEEPSEEK_API_KEY = 'mock-key'

    // Mock global fetch returning malformed JSON in message content
    globalThis.fetch = async () => {
      return new Response(
        JSON.stringify({
          choices: [
            {
              message: {
                content: 'invalid malformed json {{{'
              }
            }
          ]
        }),
        { status: 200, headers: { 'Content-Type': 'application/json' } }
      )
    }

    // Should catch JSON.parse error and fall back to keyword matching for "pdf"
    const result = await loadRelevantSkills('generate pdf document')
    assert.ok(typeof result === 'string')
    assert.ok(result.includes('pdf'))

    // Also verify valid JSON response works as expected
    globalThis.fetch = async () => {
      return new Response(
        JSON.stringify({
          choices: [
            {
              message: {
                content: JSON.stringify({ skills: ['pdf'] })
              }
            }
          ]
        }),
        { status: 200, headers: { 'Content-Type': 'application/json' } }
      )
    }

    const validResult = await loadRelevantSkills('some arbitrary prompt')
    assert.ok(validResult.includes('pdf'))
  } finally {
    if (originalApiKey === undefined) {
      delete process.env.DEEPSEEK_API_KEY
    } else {
      process.env.DEEPSEEK_API_KEY = originalApiKey
    }
    globalThis.fetch = originalFetch
  }
})
