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
})

test('clearInstructionsCache resets catalog and file content cache', async () => {
  // Populate catalog and rules cache
  const catalog1 = await listSkillCatalog()
  const rules1 = await loadRules()

  const catalogCached = await listSkillCatalog()
  const rulesCached = await loadRules()

  assert.strictEqual(catalog1, catalogCached)
  assert.strictEqual(rules1, rulesCached)

  // Clear cache
  clearInstructionsCache()

  // Subsequent calls should fetch/compute new references
  const catalog2 = await listSkillCatalog()
  const rules2 = await loadRules()

  assert.notStrictEqual(catalog1, catalog2)
  assert.deepEqual(catalog1, catalog2)
  assert.strictEqual(rules1, rules2)
})
