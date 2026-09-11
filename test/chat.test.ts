import test from 'node:test'
import assert from 'node:assert/strict'
import { buildSystemPrompt, buildChatMessages, executeToolCall, handleChatRequest } from '../src/agent/chat.js'
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

test('Benchmark parallel vs sequential execution of multiple tool calls', async () => {
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

  const calls = Array.from({ length: 5 }, (_, i) => ({
    id: `call_${i}`,
    function: { name: 'list_files', arguments: '{}' }
  }))

  // Simulate async tool execution delays (e.g. 50ms per tool)
  const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms))

  // Sequential execution
  const startSeq = Date.now()
  const seqResults: any[] = []
  for (const call of calls) {
    await delay(50)
    const res = await executeToolCall(call, enabledTools, store)
    seqResults.push(res)
  }
  const durationSeq = Date.now() - startSeq

  // Parallel execution
  const startPar = Date.now()
  const parResults = await Promise.all(
    calls.map(async call => {
      await delay(50)
      return executeToolCall(call, enabledTools, store)
    })
  )
  const durationPar = Date.now() - startPar

  console.log(`Sequential execution duration: ${durationSeq} ms`)
  console.log(`Parallel execution duration: ${durationPar} ms`)

  assert.equal(seqResults.length, 5)
  assert.equal(parResults.length, 5)
  for (let i = 0; i < 5; i++) {
    assert.equal(seqResults[i].toolMessage.tool_call_id, `call_${i}`)
    assert.equal(parResults[i].toolMessage.tool_call_id, `call_${i}`)
  }
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
