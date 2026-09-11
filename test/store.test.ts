import test from 'node:test'
import assert from 'node:assert/strict'
import { Store, defaultTools } from '../src/agent/store.js'

import type { Db } from 'mongodb'

test('Store - disconnected fallback behavior', async () => {
  const store = new Store(undefined) // No MongoDB URI
  const tool = await store.getTool('execute_python')
  assert.ok(tool)
  assert.equal(tool?.name, 'execute_python')

  const nonExistent = await store.getTool('non_existent_tool')
  assert.equal(nonExistent, undefined)

  // logTool when disconnected completes safely without throwing
  await assert.doesNotReject(async () => {
    await store.logTool({ tool: 'execute_python', duration: 100 })
  })
})

test('Store - logTool inserts entry with created_at timestamp when connected', async () => {
  const store = new Store('mongodb://localhost:27017')
  const insertedDocs: { collection: string; doc: any }[] = []

  const mockDb = {
    collection: (colName: string) => ({
      insertOne: async (doc: any) => {
        insertedDocs.push({ collection: colName, doc })
        return { acknowledged: true, insertedId: 'mock_id' }
      }
    })
  } as unknown as Db

  ;(store as any).db = mockDb

  const before = new Date()
  await store.logTool({ tool: 'execute_python', duration: 123, success: true })
  const after = new Date()

  assert.equal(insertedDocs.length, 1)
  assert.equal(insertedDocs[0].collection, 'tool_logs')
  assert.equal(insertedDocs[0].doc.tool, 'execute_python')
  assert.equal(insertedDocs[0].doc.duration, 123)
  assert.equal(insertedDocs[0].doc.success, true)
  assert.ok(insertedDocs[0].doc.created_at instanceof Date)
  assert.ok(insertedDocs[0].doc.created_at.getTime() >= before.getTime())
  assert.ok(insertedDocs[0].doc.created_at.getTime() <= after.getTime())

  // Additional payload log
  await store.logTool({ name: 'read_file', args: { path: 'test.txt' } })
  assert.equal(insertedDocs.length, 2)
  assert.equal(insertedDocs[1].collection, 'tool_logs')
  assert.equal(insertedDocs[1].doc.name, 'read_file')
  assert.deepEqual(insertedDocs[1].doc.args, { path: 'test.txt' })
  assert.ok(insertedDocs[1].doc.created_at instanceof Date)
})

test('Store - saveSession behavior when disconnected and connected', async () => {
  // Disconnected fallback
  const disconnectedStore = new Store(undefined)
  await assert.doesNotReject(async () => {
    await disconnectedStore.saveSession([{ role: 'user', content: 'hello' }])
  })

  // Connected behavior
  const store = new Store('mongodb://localhost:27017')
  const insertedDocs: { collection: string; doc: any }[] = []

  const mockDb = {
    collection: (colName: string) => ({
      insertOne: async (doc: any) => {
        insertedDocs.push({ collection: colName, doc })
        return { acknowledged: true, insertedId: 'mock_session_id' }
      }
    })
  } as unknown as Db

  ;(store as any).db = mockDb

  const messages = [{ role: 'user', content: 'What is the weather?' }]
  const before = new Date()
  await store.saveSession(messages)
  const after = new Date()

  assert.equal(insertedDocs.length, 1)
  assert.equal(insertedDocs[0].collection, 'sessions')
  assert.deepEqual(insertedDocs[0].doc.messages, messages)
  assert.ok(insertedDocs[0].doc.created_at instanceof Date)
  assert.ok(insertedDocs[0].doc.created_at.getTime() >= before.getTime())
  assert.ok(insertedDocs[0].doc.created_at.getTime() <= after.getTime())
})

test('Store - setTool and tools methods when connected vs disconnected', async () => {
  // Disconnected behavior
  const disconnectedStore = new Store(undefined)
  const defaultList = await disconnectedStore.tools()
  assert.deepEqual(defaultList, defaultTools)

  const updatedDisconnected = await disconnectedStore.setTool('execute_python', false)
  assert.equal(updatedDisconnected?.name, 'execute_python')

  // Connected behavior
  const store = new Store('mongodb://localhost:27017')
  const updates: { filter: any; update: any }[] = []
  const mockToolsInDb = [
    { name: 'execute_python', description: 'desc', category: 'code', enabled: false, requires_sandbox: true, parameters: {}, handler: 'sandbox.executePython' }
  ]

  const mockDb = {
    collection: (colName: string) => ({
      find: () => ({
        sort: () => ({
          toArray: async () => mockToolsInDb
        })
      }),
      findOne: async (query: any) => mockToolsInDb.find(t => t.name === query.name) ?? null,
      updateOne: async (filter: any, update: any) => {
        updates.push({ filter, update })
        const tool = mockToolsInDb.find(t => t.name === filter.name)
        if (tool && update.$set?.enabled !== undefined) {
          tool.enabled = update.$set.enabled
        }
        return { acknowledged: true, modifiedCount: 1 }
      }
    })
  } as unknown as Db

  ;(store as any).db = mockDb

  // Test tools()
  const toolsFromDb = await store.tools()
  assert.equal(toolsFromDb.length, 1)
  assert.equal(toolsFromDb[0].name, 'execute_python')

  // Test setTool()
  const updatedTool = await store.setTool('execute_python', true)
  assert.equal(updates.length, 1)
  assert.deepEqual(updates[0].filter, { name: 'execute_python' })
  assert.equal(updates[0].update.$set.enabled, true)
  assert.ok(updates[0].update.$set.updated_at instanceof Date)
  assert.equal(updatedTool?.enabled, true)
})

test('Store - connect and close lifecycle behavior', async () => {
  // When no URI is provided, connect() early-returns and close() completes safely
  const storeNoUri = new Store(undefined)
  await storeNoUri.connect()
  await storeNoUri.close()

  // When URI is provided, test lifecycle with mocked MongoClient
  const storeWithUri = new Store('mongodb://localhost:27017', 'test_db')

  let bulkWriteCalled = false
  let closed = false

  const mockDb = {
    collection: (colName: string) => {
      assert.equal(colName, 'tools')
      return {
        bulkWrite: async (ops: any[]) => {
          bulkWriteCalled = true
          assert.equal(ops.length, defaultTools.length)
          return { acknowledged: true }
        }
      }
    }
  }

  const mockClient = {
    connect: async () => {},
    db: (name: string) => {
      assert.equal(name, 'test_db')
      return mockDb
    },
    close: async () => {
      closed = true
    }
  }

  // Inject client directly or mock connect behavior
  ;(storeWithUri as any).client = mockClient
  ;(storeWithUri as any).db = mockDb

  await storeWithUri.close()
  assert.equal(closed, true)
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
