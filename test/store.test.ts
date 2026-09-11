import test from 'node:test'
import assert from 'node:assert/strict'
import { Store, defaultTools } from '../src/agent/store.js'

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

test('Store - connect bulkWrite mapping benchmark', async () => {
  const iterations = 100000

  // Baseline: Mapping defaultTools on every connect
  const startOld = performance.now()
  for (let i = 0; i < iterations; i++) {
    const now = new Date()
    const ops = defaultTools.map(tool => ({
      updateOne: {
        filter: { name: tool.name },
        update: { $setOnInsert: { ...tool, created_at: now, updated_at: now } },
        upsert: true
      }
    }))
    assert.equal(ops.length, defaultTools.length)
  }
  const durationOld = performance.now() - startOld

  // Pre-computed operations template
  const defaultToolBulkTemplates = defaultTools.map(tool => ({
    filter: { name: tool.name },
    tool
  }))

  const startNew = performance.now()
  for (let i = 0; i < iterations; i++) {
    const now = new Date()
    const ops = defaultToolBulkTemplates.map(({ filter, tool }) => ({
      updateOne: {
        filter,
        update: { $setOnInsert: { ...tool, created_at: now, updated_at: now } },
        upsert: true
      }
    }))
    assert.equal(ops.length, defaultTools.length)
  }
  const durationNew = performance.now() - startNew

  console.log(`Connect mapping Benchmark (${iterations} ops):`)
  console.log(`  Old (mapping array and objects on connect): ${durationOld.toFixed(2)} ms`)
  console.log(`  New (reusing pre-computed operations): ${durationNew.toFixed(2)} ms`)
  console.log(`  Speedup: ${(durationOld / durationNew).toFixed(1)}x faster`)
})
