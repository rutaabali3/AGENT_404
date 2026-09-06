import test from 'node:test'
import assert from 'node:assert/strict'
import path from 'node:path'
import fs from 'node:fs/promises'
import { safeFile, readFile, writeFile } from '../src/agent/tools.js'

const root = path.resolve(process.env.WORKSPACE_DIR ?? './sandbox/workspace')

test('safeFile resolves valid workspace paths correctly', async () => {
  assert.equal(await safeFile(), root)
  assert.equal(await safeFile('file.txt'), path.resolve(root, 'file.txt'))
  assert.equal(await safeFile('subdir/../file.txt'), path.resolve(root, 'file.txt'))
})

test('safeFile prevents path traversal outside workspace', async () => {
  for (const invalidPath of ['..', '../outside.txt', '../../etc/passwd', '/etc/passwd', 'subdir/../../outside.txt']) {
    await assert.rejects(() => safeFile(invalidPath), {
      name: 'Error',
      message: 'Path is outside the workspace'
    })
  }
})

test('readFile and writeFile enforce safeFile boundaries', async () => {
  const relativePath = 'safeFile_test_integration.txt'
  const content = 'Test content for safeFile integration'
  const writeRes = await writeFile(relativePath, content)
  assert.equal(writeRes.bytes, Buffer.byteLength(content))
  assert.equal(await readFile(relativePath), content)
  await fs.rm(await safeFile(relativePath), { force: true })
  await assert.rejects(() => readFile('../outside.txt'))
  await assert.rejects(() => writeFile('../outside.txt', 'forbidden content'))
})
