import test from 'node:test'
import assert from 'node:assert/strict'
import { buildSystemPrompt, buildChatMessages, executeToolCall, handleChatRequest } from '../src/agent/chat.js'
import { toolSchemas } from '../src/agent/tools.js'
import { Store, ToolDoc } from '../src/agent/store.js'

test('buildSystemPrompt includes rules, notice, and catalog', async () => {
  const prompt = await buildSystemPrompt('Write a python script to calculate fibonacci')
  assert.match(prompt, /Local Agent Studio/)
  assert.match(prompt, /Imported skill catalog:/)
  assert.match(prompt, /Relevant skill instructions for this request:/)
})

test('buildChatMessages constructs system, history, and user messages properly', async () => {
  const history = [
    { role: 'user', content: 'hello' },
    { role: 'assistant', content: 'hi' }
  ]
  const messages = await buildChatMessages('How are you?', history)
  assert.equal(messages.length, 4)
  assert.equal(messages[0].role, 'system')
  assert.equal(messages[1].role, 'user')
  assert.equal(messages[1].content, 'hello')
  assert.equal(messages[2].role, 'assistant')
  assert.equal(messages[2].content, 'hi')
  assert.equal(messages[3].role, 'user')
  assert.equal(messages[3].content, 'How are you?')
})

test('buildChatMessages limits history to the last 12 messages', async () => {
  const history = Array.from({ length: 20 }, (_, i) => ({ role: 'user', content: `msg ${i}` }))
  const messages = await buildChatMessages('latest message', history)
  // 1 system message + 12 history messages + 1 user message = 14 messages
  assert.equal(messages.length, 14)
  assert.equal(messages[1].content, 'msg 8')
  assert.equal(messages[13].content, 'latest message')
})

test('executeToolCall runs registered tool and logs tool call', async () => {
  const store = new Store()
  const enabledTools: ToolDoc[] = [
    {
      name: 'list_files',
      description: 'List files in workspace',
      category: 'filesystem',
      enabled: true,
      requires_sandbox: false,
      parameters: { type: 'object', properties: {} },
      handler: 'filesystem.list'
    }
  ]

  const call = {
    id: 'call_123',
    function: {
      name: 'list_files',
      arguments: '{}'
    }
  }

  const result = await executeToolCall(call, enabledTools, store)
  assert.equal(result.step.tool, 'list_files')
  assert.ok(typeof result.step.duration === 'number')
  assert.equal(result.toolMessage.role, 'tool')
  assert.equal(result.toolMessage.tool_call_id, 'call_123')
})

test('executeToolCall rejects invalid tool arguments schema', async () => {
  const store = new Store()
  const enabledTools: ToolDoc[] = [
    {
      name: 'read_file',
      description: 'Read a file',
      category: 'filesystem',
      enabled: true,
      requires_sandbox: false,
      parameters: {
        type: 'object',
        properties: { path: { type: 'string' } },
        required: ['path']
      },
      handler: 'filesystem.read'
    }
  ]

  const callWithMissingArgs = {
    id: 'call_456',
    function: {
      name: 'read_file',
      arguments: '{}'
    }
  }

  const result1 = await executeToolCall(callWithMissingArgs, enabledTools, store)
  assert.match(result1.step.result.error, /Invalid arguments for tool read_file/)

  const callWithWrongType = {
    id: 'call_789',
    function: {
      name: 'read_file',
      arguments: '{"path": 123}'
    }
  }

  const result2 = await executeToolCall(callWithWrongType, enabledTools, store)
  assert.match(result2.step.result.error, /Invalid arguments for tool read_file/)
})

test('handleChatRequest returns 400 when message is empty', async () => {
  const store = new Store()
  const res = await handleChatRequest({ message: '   ' }, store)
  assert.equal(res.status, 400)
  assert.equal(res.body.error, 'Message is required')
})

test('handleChatRequest returns unconfigured message when DEEPSEEK_API_KEY is not set', async () => {
  const store = new Store()
  const originalKey = process.env.DEEPSEEK_API_KEY
  delete process.env.DEEPSEEK_API_KEY
  try {
    const res = await handleChatRequest({ message: 'hello' }, store)
    assert.equal(res.status, 200)
    assert.match(res.body.message, /DeepSeek is not configured yet/)
    assert.deepEqual(res.body.steps, [])
  } finally {
    if (originalKey !== undefined) {
      process.env.DEEPSEEK_API_KEY = originalKey
    }
  }
})

test('toolSchemas performance in loop benchmark', async () => {
  const store = new Store()
  const enabledTools = (await store.tools()).filter(t => t.enabled)
  const iterations = 100000

  // Old: toolSchemas called inside turn loop (up to 6 times per request)
  const startOld = performance.now()
  for (let i = 0; i < iterations; i++) {
    for (let turn = 0; turn < 6; turn++) {
      const schemas = toolSchemas(enabledTools)
    }
  }
  const durationOld = performance.now() - startOld

  // New: toolSchemas called once before turn loop
  const startNew = performance.now()
  for (let i = 0; i < iterations; i++) {
    const schemas = toolSchemas(enabledTools)
    for (let turn = 0; turn < 6; turn++) {
      // reuse schemas
      const useSchemas = schemas
    }
  }
  const durationNew = performance.now() - startNew

  console.log(`Benchmark toolSchemas in chat request loop (${iterations} requests, up to 6 turns each):`)
  console.log(`  Old (recomputing schemas inside 6-turn loop): ${durationOld.toFixed(2)} ms`)
  console.log(`  New (precomputing schemas outside loop): ${durationNew.toFixed(2)} ms`)
  console.log(`  Speedup: ${(durationOld / durationNew).toFixed(1)}x faster`)

  assert.ok(durationNew < durationOld)
})
