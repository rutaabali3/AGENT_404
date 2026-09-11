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
