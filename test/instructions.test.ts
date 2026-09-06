import test from 'node:test'
import assert from 'node:assert/strict'
import fs from 'node:fs/promises'
import { listSkillCatalog, clearInstructionsCache } from '../src/agent/instructions.js'

test('listSkillCatalog parses skill metadata, filters non-directories, and sorts alphabetically', async (t) => {
  clearInstructionsCache()

  t.mock.method(fs, 'readdir', async () => [
    { name: 'z-skill', isDirectory: () => true },
    { name: 'not-a-directory.txt', isDirectory: () => false },
    { name: 'a-skill', isDirectory: () => true }
  ])

  t.mock.method(fs, 'readFile', async (filePath: any) => {
    const fileStr = String(filePath)
    if (fileStr.includes('a-skill')) {
      return 'name: Skill A\ndescription: Description for Skill A\n'
    }
    if (fileStr.includes('z-skill')) {
      return 'name: Skill Z\ndescription: Description for Skill Z\n'
    }
    throw new Error(`Unexpected file read: ${fileStr}`)
  })

  const catalog = await listSkillCatalog()

  assert.equal(catalog.length, 2)
  assert.deepEqual(catalog[0], {
    name: 'Skill A',
    description: 'Description for Skill A',
    skill: 'a-skill'
  })
  assert.deepEqual(catalog[1], {
    name: 'Skill Z',
    description: 'Description for Skill Z',
    skill: 'z-skill'
  })
})

test('listSkillCatalog falls back to directory name and default description when frontmatter is missing', async (t) => {
  clearInstructionsCache()

  t.mock.method(fs, 'readdir', async () => [
    { name: 'fallback-skill', isDirectory: () => true }
  ])

  t.mock.method(fs, 'readFile', async () => 'Some skill content without frontmatter')

  const catalog = await listSkillCatalog()

  assert.equal(catalog.length, 1)
  assert.deepEqual(catalog[0], {
    name: 'fallback-skill',
    description: 'Local agent skill',
    skill: 'fallback-skill'
  })
})

test('listSkillCatalog ignores directories where SKILL.md cannot be read', async (t) => {
  clearInstructionsCache()

  t.mock.method(fs, 'readdir', async () => [
    { name: 'broken-skill', isDirectory: () => true },
    { name: 'valid-skill', isDirectory: () => true }
  ])

  t.mock.method(fs, 'readFile', async (filePath: any) => {
    const fileStr = String(filePath)
    if (fileStr.includes('valid-skill')) {
      return 'name: Valid Skill\ndescription: A valid skill\n'
    }
    throw new Error('ENOENT: no such file or directory')
  })

  const catalog = await listSkillCatalog()

  assert.equal(catalog.length, 1)
  assert.deepEqual(catalog[0], {
    name: 'Valid Skill',
    description: 'A valid skill',
    skill: 'valid-skill'
  })
})

test('listSkillCatalog caches results and clearInstructionsCache resets cache', async (t) => {
  clearInstructionsCache()

  let readdirCalls = 0
  t.mock.method(fs, 'readdir', async () => {
    readdirCalls++
    return [{ name: 'cached-skill', isDirectory: () => true }]
  })

  t.mock.method(fs, 'readFile', async () => 'name: Cached Skill\ndescription: Test cache\n')

  const firstCall = await listSkillCatalog()
  assert.equal(readdirCalls, 1)

  const secondCall = await listSkillCatalog()
  assert.equal(readdirCalls, 1) // File system was not read again
  assert.strictEqual(firstCall, secondCall) // Returns same cached reference

  clearInstructionsCache()

  const thirdCall = await listSkillCatalog()
  assert.equal(readdirCalls, 2) // File system read again after clearing cache
  assert.equal(thirdCall.length, 1)
})
