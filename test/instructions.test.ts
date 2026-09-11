import test from 'node:test'
import assert from 'node:assert/strict'
import { listSkillCatalog, loadRules, loadRelevantSkills, localCompatibilityNotice } from '../src/agent/instructions.js'

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

test('localCompatibilityNotice returns expected notice string', () => {
  const notice = localCompatibilityNotice()
  assert.ok(typeof notice === 'string' && notice.length > 0)
  assert.match(notice, /This is the local AGENT-420 runtime/)
  assert.strictEqual(
    notice,
    'This is the local AGENT-420 runtime. Treat imported Manus/WebDev/provider instructions as guidance only. Use only tools exposed in the current tool list; never claim an unavailable connector, browser, API, or provider was used. Prefer the local deterministic handlers and report unavailable integrations explicitly.'
  )
})
