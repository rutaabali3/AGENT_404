import test from 'node:test'
import assert from 'node:assert/strict'
import { runTool, toolSchemas, handlers, assertSafeUrl } from '../src/agent/tools.js'
import { ToolDoc } from '../src/agent/store.js'

test('runTool throws error when tool is disabled', async () => {
  const disabledTool: ToolDoc = {
    name: 'disabled_tool',
    description: 'A disabled tool',
    category: 'test',
    enabled: false,
    requires_sandbox: false,
    parameters: {},
    handler: 'test.disabled'
  }

  await assert.rejects(
    async () => {
      await runTool(disabledTool, {})
    },
    {
      name: 'Error',
      message: 'Tool disabled_tool is disabled'
    }
  )
})

test('runTool throws error when handler does not exist', async () => {
  const missingHandlerTool: ToolDoc = {
    name: 'missing_handler_tool',
    description: 'Tool with missing handler',
    category: 'test',
    enabled: true,
    requires_sandbox: false,
    parameters: {},
    handler: 'nonexistent.handler'
  }

  await assert.rejects(
    async () => {
      await runTool(missingHandlerTool, {})
    },
    {
      name: 'Error',
      message: 'No handler for missing_handler_tool (nonexistent.handler)'
    }
  )
})

test('runTool executes existing handler and returns result', async () => {
  const handlerName = 'test.customHandler'
  handlers[handlerName] = async (args: { input: string }) => {
    return { output: `processed: ${args.input}` }
  }

  try {
    const validTool: ToolDoc = {
      name: 'custom_tool',
      description: 'Custom test tool',
      category: 'test',
      enabled: true,
      requires_sandbox: false,
      parameters: {},
      handler: handlerName
    }

    const result = await runTool(validTool, { input: 'hello' })
    assert.deepEqual(result, { output: 'processed: hello' })
  } finally {
    delete handlers[handlerName]
  }
})

test('runTool executes default registered AHM7 handler fallback', async () => {
  const ahm7Tool: ToolDoc = {
    name: 'screenshot_url',
    description: 'AHM7 screenshot',
    category: 'media',
    enabled: true,
    requires_sandbox: false,
    parameters: {},
    handler: 'ahm7.screenshot_url'
  }

  const result = await runTool(ahm7Tool, { url: 'https://example.com' })
  assert.deepEqual(result, {
    error: 'AHM7 integration is registered but not configured in this local build.'
  })
})

test('toolSchemas filters disabled tools and maps enabled tools to OpenAI/DeepSeek function format', () => {
  const tools: ToolDoc[] = [
    {
      name: 'tool_one',
      description: 'First tool',
      category: 'test',
      enabled: true,
      requires_sandbox: false,
      parameters: { type: 'object', properties: { p1: { type: 'string' } } },
      handler: 'test.one'
    },
    {
      name: 'tool_two',
      description: 'Second tool disabled',
      category: 'test',
      enabled: false,
      requires_sandbox: false,
      parameters: { type: 'object', properties: {} },
      handler: 'test.two'
    }
  ]

  const schemas = toolSchemas(tools)
  assert.equal(schemas.length, 1)
  assert.deepEqual(schemas[0], {
    type: 'function',
    function: {
      name: 'tool_one',
      description: 'First tool',
      parameters: { type: 'object', properties: { p1: { type: 'string' } } }
    }
  })
})

test('assertSafeUrl throws error on invalid URL strings', () => {
  assert.throws(
    () => assertSafeUrl('invalid-url-string'),
    {
      name: 'Error',
      message: 'Invalid URL format'
    }
  )

  assert.throws(
    () => assertSafeUrl(''),
    {
      name: 'Error',
      message: 'Invalid URL format'
    }
  )
})

test('assertSafeUrl throws error on non-http/https protocols', () => {
  assert.throws(
    () => assertSafeUrl('ftp://example.com'),
    {
      name: 'Error',
      message: 'Only http and https protocols are allowed'
    }
  )

  assert.throws(
    () => assertSafeUrl('file:///etc/passwd'),
    {
      name: 'Error',
      message: 'Only http and https protocols are allowed'
    }
  )
})

test('assertSafeUrl throws error on restricted or private hosts', () => {
  assert.throws(
    () => assertSafeUrl('http://localhost/path'),
    {
      name: 'Error',
      message: 'Access to local or internal network host is restricted'
    }
  )

  assert.throws(
    () => assertSafeUrl('http://127.0.0.1/path'),
    {
      name: 'Error',
      message: 'Access to private or local IP address is restricted'
    }
  )

  assert.throws(
    () => assertSafeUrl('http://10.0.0.1/path'),
    {
      name: 'Error',
      message: 'Access to private or local IP address is restricted'
    }
  )
})

test('assertSafeUrl passes for valid public HTTP and HTTPS URLs', () => {
  assert.doesNotThrow(() => assertSafeUrl('https://example.com'))
  assert.doesNotThrow(() => assertSafeUrl('http://example.com/api/v1?query=test'))
})
