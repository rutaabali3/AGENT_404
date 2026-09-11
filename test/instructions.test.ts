import test from 'node:test'
import assert from 'node:assert/strict'
import { listSkillCatalog, loadRules, loadRelevantSkills, loadSkillForTool, clearInstructionsCache } from '../src/agent/instructions.js'

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

test('loadSkillForTool returns content for valid tools and empty string for unknown tools', async () => {
  clearInstructionsCache()

  const filesystemSkill = await loadSkillForTool('read_file')
  assert.ok(typeof filesystemSkill === 'string' && filesystemSkill.length > 0)

  const codeExecutionSkill = await loadSkillForTool('execute_python')
  assert.ok(typeof codeExecutionSkill === 'string' && codeExecutionSkill.length > 0)

  const unknownSkill = await loadSkillForTool('unknown_tool_123')
  assert.strictEqual(unknownSkill, '')

  // Verify caching: calling loadSkillForTool again returns same string from cache
  const filesystemSkillCached = await loadSkillForTool('read_file')
  assert.strictEqual(filesystemSkill, filesystemSkillCached)
})
