import test from 'node:test'
import assert from 'node:assert/strict'
import { MongoClient } from 'mongodb'
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

test('Store - setTool disconnected fallback behavior', async () => {
  const store = new Store(undefined)
  const tool = await store.setTool('execute_python', false)
  assert.ok(tool)
  assert.equal(tool?.name, 'execute_python')

  const nonExistent = await store.setTool('non_existent_tool', true)
  assert.equal(nonExistent, undefined)
})

test('Store - setTool connected behavior with mock database', async () => {
  const toolDocs: Record<string, any> = {
    execute_python: {
      name: 'execute_python',
      description: 'Run Python code',
      category: 'code_execution',
      enabled: true,
      requires_sandbox: true,
      parameters: {},
      handler: 'sandbox.executePython'
    }
  }

  let updateOneCall: { filter: any; update: any } | null = null

  const mockToolsCollection = {
    async updateOne(filter: { name: string }, update: { $set: { enabled: boolean; updated_at: Date } }) {
      updateOneCall = { filter, update }
      if (toolDocs[filter.name]) {
        toolDocs[filter.name].enabled = update.$set.enabled
        toolDocs[filter.name].updated_at = update.$set.updated_at
      }
      return { acknowledged: true, modifiedCount: toolDocs[filter.name] ? 1 : 0 }
    },
    async findOne(filter: { name: string }) {
      return toolDocs[filter.name] ?? null
    }
  }

  const mockDb = {
    collection(name: string) {
      if (name === 'tools') return mockToolsCollection
      throw new Error(`Unexpected collection: ${name}`)
    }
  }

  const store = new Store('mongodb://localhost:27017/test')
  ;(store as any).db = mockDb

  // Test 1: Disable an existing tool
  const resultDisabled = await store.setTool('execute_python', false)
  assert.ok(resultDisabled)
  assert.equal(resultDisabled?.name, 'execute_python')
  assert.equal(resultDisabled?.enabled, false)
  assert.ok(resultDisabled?.updated_at instanceof Date)
  assert.deepEqual(updateOneCall?.filter, { name: 'execute_python' })
  assert.equal(updateOneCall?.update.$set.enabled, false)
  assert.ok(updateOneCall?.update.$set.updated_at instanceof Date)

  // Test 2: Enable the tool back
  const resultEnabled = await store.setTool('execute_python', true)
  assert.ok(resultEnabled)
  assert.equal(resultEnabled?.enabled, true)
  assert.ok(resultEnabled?.updated_at instanceof Date)
  assert.equal(updateOneCall?.update.$set.enabled, true)

  // Test 3: setTool on a non-existent tool
  const resultNonExistent = await store.setTool('non_existent_tool', true)
  assert.equal(resultNonExistent, undefined)
  assert.deepEqual(updateOneCall?.filter, { name: 'non_existent_tool' })
})

test('Store - connected tools, saveSession, logTool, and close behavior', async () => {
  const toolsList = [
    { name: 'tool_b', category: 'cat_2', enabled: true },
    { name: 'tool_a', category: 'cat_1', enabled: true }
  ]

  let insertedSession: any = null
  let insertedLog: any = null
  let closed = false

  const mockDb = {
    collection(name: string) {
      if (name === 'tools') {
        return {
          find() {
            return {
              sort() {
                return {
                  async toArray() {
                    return toolsList
                  }
                }
              }
            }
          }
        }
      }
      if (name === 'sessions') {
        return {
          async insertOne(doc: any) {
            insertedSession = doc
            return { acknowledged: true }
          }
        }
      }
      if (name === 'tool_logs') {
        return {
          async insertOne(doc: any) {
            insertedLog = doc
            return { acknowledged: true }
          }
        }
      }
      throw new Error(`Unexpected collection ${name}`)
    }
  }

  const mockClient = {
    async close() {
      closed = true
    }
  }

  const store = new Store('mongodb://localhost:27017/test')
  ;(store as any).db = mockDb
  ;(store as any).client = mockClient

  // Test tools()
  const tools = await store.tools()
  assert.deepEqual(tools, toolsList as any)

  // Test saveSession()
  const sampleMessages = [{ role: 'user', content: 'hello' }]
  await store.saveSession(sampleMessages)
  assert.ok(insertedSession)
  assert.deepEqual(insertedSession.messages, sampleMessages)
  assert.ok(insertedSession.created_at instanceof Date)

  // Test logTool()
  const sampleLog = { tool: 'execute_python', duration: 100 }
  await store.logTool(sampleLog)
  assert.ok(insertedLog)
  assert.equal(insertedLog.tool, 'execute_python')
  assert.equal(insertedLog.duration, 100)
  assert.ok(insertedLog.created_at instanceof Date)

  // Test close()
  await store.close()
  assert.equal(closed, true)
})

test('Store - connect returns early if no URI is provided', async () => {
  const store = new Store(undefined)
  await store.connect()
  const tools = await store.tools()
  assert.equal(tools, defaultTools)
})

test('Store - connect initializes client, db, and populates default tools', async () => {
  let connectCalled = false
  let bulkWriteOps: any = null

  const originalConnect = MongoClient.prototype.connect
  const originalDb = MongoClient.prototype.db

  MongoClient.prototype.connect = async function () {
    connectCalled = true
    return this
  } as any

  MongoClient.prototype.db = function () {
    return {
      collection(name: string) {
        if (name === 'tools') {
          return {
            async bulkWrite(ops: any[]) {
              bulkWriteOps = ops
              return { ok: 1 }
            }
          }
        }
        throw new Error(`Unexpected collection ${name}`)
      }
    } as any
  }

  try {
    const store = new Store('mongodb://127.0.0.1:27017/test_db')
    await store.connect()
    assert.equal(connectCalled, true)
    assert.ok(Array.isArray(bulkWriteOps))
    assert.equal(bulkWriteOps.length, defaultTools.length)
    assert.equal(bulkWriteOps[0].updateOne.filter.name, defaultTools[0].name)
    assert.ok(bulkWriteOps[0].updateOne.update.$setOnInsert.created_at instanceof Date)
  } finally {
    MongoClient.prototype.connect = originalConnect
    MongoClient.prototype.db = originalDb
  }
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
