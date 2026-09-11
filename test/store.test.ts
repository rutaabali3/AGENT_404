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

  // saveSession should be a no-op when disconnected and not throw
  await assert.doesNotReject(async () => {
    await store.saveSession([{ role: 'user', content: 'hello' }])
  })
})

test('Store - saveSession inserts session into database when connected', async () => {
  const store = new Store(undefined)
  const insertedDocs: unknown[] = []

  // Mock DB and collection
  const mockCollection = {
    insertOne: async (doc: unknown) => {
      insertedDocs.push(doc)
      return { acknowledged: true, insertedId: 'mock_id' }
    }
  }

  const mockDb = {
    collection: (name: string) => {
      assert.equal(name, 'sessions')
      return mockCollection
    }
  }

  // Inject mock db into store instance
  ;(store as any).db = mockDb

  const messages = [
    { role: 'user', content: 'hello' },
    { role: 'assistant', content: 'world' }
  ]

  const before = Date.now()
  await store.saveSession(messages)
  const after = Date.now()

  assert.equal(insertedDocs.length, 1)
  const inserted = insertedDocs[0] as { messages: unknown[]; created_at: Date }
  assert.deepEqual(inserted.messages, messages)
  assert.ok(inserted.created_at instanceof Date)
  assert.ok(inserted.created_at.getTime() >= before && inserted.created_at.getTime() <= after)

  // Edge case: empty messages array
  await store.saveSession([])
  assert.equal(insertedDocs.length, 2)
  assert.deepEqual((insertedDocs[1] as { messages: unknown[] }).messages, [])
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
