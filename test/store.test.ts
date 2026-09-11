import test from 'node:test'
import assert from 'node:assert/strict'
import { MongoClient } from 'mongodb'
import { Store, defaultTools } from '../src/agent/store.js'

test('Store - disconnected fallback behavior', async () => {
  const store = new Store(undefined) // No MongoDB URI
  const tool = await store.getTool('execute_python')
  assert.ok(tool)
  assert.equal(tool?.name, 'execute_python')

  const nonExistent = await store.getTool('non_existent_tool')
  assert.equal(nonExistent, undefined)
})

test('Store.connect - early return when uri is undefined', async (t) => {
  const connectMock = t.mock.method(MongoClient.prototype, 'connect', async () => {})
  const store = new Store(undefined)
  await store.connect()
  assert.equal(connectMock.mock.callCount(), 0)
})

test('Store.connect - connects to MongoDB and initializes tools collection with bulkWrite', async (t) => {
  let bulkWriteCalledWith: unknown[] = []
  let collectionRequested: string | undefined

  const mockCollection = {
    bulkWrite: async (operations: unknown[]) => {
      bulkWriteCalledWith = operations
      return { ok: 1 }
    }
  }

  const mockDb = {
    collection: (name: string) => {
      collectionRequested = name
      return mockCollection as any
    }
  }

  const connectMock = t.mock.method(MongoClient.prototype, 'connect', async () => {})
  const dbMock = t.mock.method(MongoClient.prototype, 'db', (dbName?: string) => {
    assert.equal(dbName, 'custom_agent_db')
    return mockDb as any
  })

  const store = new Store('mongodb://localhost:27017', 'custom_agent_db')
  await store.connect()

  assert.equal(connectMock.mock.callCount(), 1)
  assert.equal(dbMock.mock.callCount(), 1)
  assert.equal(collectionRequested, 'tools')
  assert.equal(bulkWriteCalledWith.length, defaultTools.length)

  const firstOp = bulkWriteCalledWith[0] as { updateOne: { filter: { name: string }; update: { $setOnInsert: Record<string, unknown> }; upsert: boolean } }
  assert.equal(firstOp.updateOne.filter.name, defaultTools[0].name)
  assert.equal(firstOp.updateOne.upsert, true)
  assert.equal(firstOp.updateOne.update.$setOnInsert.name, defaultTools[0].name)
  assert.ok(firstOp.updateOne.update.$setOnInsert.created_at instanceof Date)
  assert.ok(firstOp.updateOne.update.$setOnInsert.updated_at instanceof Date)
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
