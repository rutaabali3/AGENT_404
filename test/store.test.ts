import test, { mock } from 'node:test'
import assert from 'node:assert/strict'
import { MongoClient } from 'mongodb'
import { Store, defaultTools } from '../src/agent/store.js'

test('Store - fallback / disconnected mode (no URI or db uninitialized)', async () => {
  // Test constructor defaults and missing URI
  const storeNoUri = new Store(undefined)
  await storeNoUri.connect() // should return early without creating client

  const tools = await storeNoUri.tools()
  assert.deepEqual(tools, defaultTools)

  const tool = await storeNoUri.getTool('execute_python')
  assert.equal(tool?.name, 'execute_python')

  const nonExistent = await storeNoUri.getTool('non_existent_tool')
  assert.equal(nonExistent, undefined)

  // setTool when db is not connected
  const updatedTool = await storeNoUri.setTool('execute_python', false)
  assert.equal(updatedTool?.name, 'execute_python')
  assert.equal(updatedTool?.enabled, true)

  // saveSession and logTool should complete without throwing
  await storeNoUri.saveSession([{ role: 'user', content: 'hello' }])
  await storeNoUri.logTool({ tool: 'execute_python', result: 'ok' })

  // close when client is undefined
  await storeNoUri.close()
})

test('Store - connected mode with mocked MongoClient', async () => {
  let bulkWriteCalledWith: unknown = null
  let updateOneCalledWith: unknown = null
  let insertedSessionDoc: unknown = null
  let insertedLogDoc: unknown = null
  let clientConnected = false
  let clientClosed = false

  const mockToolsList = [
    { name: 'execute_python', category: 'code_execution', enabled: true },
    { name: 'execute_node', category: 'code_execution', enabled: false }
  ]

  const mockDb = {
    collection: (collName: string) => {
      if (collName === 'tools') {
        return {
          bulkWrite: async (ops: unknown[]) => {
            bulkWriteCalledWith = ops
            return { ok: 1 }
          },
          find: () => ({
            sort: (_sortObj: unknown) => ({
              toArray: async () => mockToolsList
            })
          }),
          updateOne: async (filter: unknown, update: unknown) => {
            updateOneCalledWith = { filter, update }
            return { acknowledged: true }
          }
        }
      }
      if (collName === 'sessions') {
        return {
          insertOne: async (doc: unknown) => {
            insertedSessionDoc = doc
            return { acknowledged: true }
          }
        }
      }
      if (collName === 'tool_logs') {
        return {
          insertOne: async (doc: unknown) => {
            insertedLogDoc = doc
            return { acknowledged: true }
          }
        }
      }
      throw new Error(`Unexpected collection name: ${collName}`)
    }
  }

  mock.method(MongoClient.prototype, 'connect', async function () {
    clientConnected = true
  })

  mock.method(MongoClient.prototype, 'db', function (dbName?: string) {
    assert.equal(dbName, 'custom_db')
    return mockDb as unknown
  })

  mock.method(MongoClient.prototype, 'close', async function () {
    clientClosed = true
  })

  const store = new Store('mongodb://localhost:27017', 'custom_db')

  await store.connect()
  assert.equal(clientConnected, true)
  assert.ok(Array.isArray(bulkWriteCalledWith))
  assert.equal((bulkWriteCalledWith as unknown[]).length, defaultTools.length)

  // tools()
  const tools = await store.tools()
  assert.deepEqual(tools, mockToolsList as any)

  // getTool()
  const tool = await store.getTool('execute_node')
  assert.equal(tool?.name, 'execute_node')

  // setTool()
  await store.setTool('execute_node', true)
  assert.deepEqual((updateOneCalledWith as any).filter, { name: 'execute_node' })
  assert.equal((updateOneCalledWith as any).update.$set.enabled, true)
  assert.ok((updateOneCalledWith as any).update.$set.updated_at instanceof Date)

  // saveSession()
  const messages = [{ role: 'user', content: 'test' }]
  await store.saveSession(messages)
  assert.deepEqual((insertedSessionDoc as any).messages, messages)
  assert.ok((insertedSessionDoc as any).created_at instanceof Date)

  // logTool()
  const logEntry = { name: 'execute_python', args: { code: 'print(1)' } }
  await store.logTool(logEntry)
  assert.equal((insertedLogDoc as any).name, 'execute_python')
  assert.ok((insertedLogDoc as any).created_at instanceof Date)

  // close()
  await store.close()
  assert.equal(clientClosed, true)

  mock.reset()
})
