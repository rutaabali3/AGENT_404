import test from 'node:test'
import assert from 'node:assert/strict'
import fs from 'node:fs/promises'
import path from 'node:path'
import { runTool, toolSchemas, handlers, readFile, writeFile } from '../src/agent/tools.js'
import { ToolDoc } from '../src/agent/store.js'

test('runTool throws error when tool is disabled', async () => {
  const handlerName = 'test.disabledHandler'
  handlers[handlerName] = async () => 'should not run'

  try {
    const disabledTool: ToolDoc = {
      name: 'disabled_tool',
      description: 'A disabled tool',
      category: 'test',
      enabled: false,
      requires_sandbox: false,
      parameters: {},
      handler: handlerName
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
  } finally {
    delete handlers[handlerName]
  }
})

test('runTool propagates errors thrown by tool handlers', async () => {
  const handlerName = 'test.failingHandler'
  handlers[handlerName] = async () => {
    throw new Error('Handler execution failed')
  }

  try {
    const failingTool: ToolDoc = {
      name: 'failing_tool',
      description: 'Tool whose handler fails',
      category: 'test',
      enabled: true,
      requires_sandbox: false,
      parameters: {},
      handler: handlerName
    }

    await assert.rejects(
      async () => {
        await runTool(failingTool, {})
      },
      {
        name: 'Error',
        message: 'Handler execution failed'
      }
    )
  } finally {
    delete handlers[handlerName]
  }
})

test('readFile rejects path traversal outside the workspace', async () => {
  await assert.rejects(
    async () => {
      await readFile('../outside.txt')
    },
    {
      name: 'Error',
      message: 'Path is outside the workspace'
    }
  )

  await assert.rejects(
    async () => {
      await readFile('/etc/passwd')
    },
    {
      name: 'Error',
      message: 'Path is outside the workspace'
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

test('readFile and filesystem.read handler read valid workspace files correctly', async () => {
  const fileName = `test-read-${Date.now()}.txt`
  const content = 'Hello, unit test content!'

  await writeFile(fileName, content)

  try {
    const directResult = await readFile(fileName)
    assert.equal(directResult, content)

    const handlerResult = await handlers['filesystem.read']({ path: fileName })
    assert.equal(handlerResult, content)
  } finally {
    const workspaceRoot = path.resolve(process.env.WORKSPACE_DIR ?? './sandbox/workspace')
    await fs.rm(path.join(workspaceRoot, fileName), { force: true })
  }
})

test('readFile rejects non-existent files with ENOENT error', async () => {
  const nonExistentFile = `nonexistent-${Date.now()}-${Math.random().toString(16).slice(2)}.txt`
  await assert.rejects(
    async () => {
      await readFile(nonExistentFile)
    },
    (err: any) => {
      return err.code === 'ENOENT'
    }
  )
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

test('writeFile writes file content and returns path and byte count', async () => {
  const filePath = 'test-write-single.txt'
  const content = 'Hello, World! 🚀'
  const expectedBytes = Buffer.byteLength(content, 'utf8')

  try {
    const result = await writeFile(filePath, content)
    assert.deepEqual(result, { path: filePath, bytes: expectedBytes })

    const readBack = await readFile(filePath)
    assert.equal(readBack, content)
  } finally {
    const workspaceDir = path.resolve(process.env.WORKSPACE_DIR ?? './sandbox/workspace')
    await fs.rm(path.resolve(workspaceDir, filePath), { force: true })
  }
})

test('writeFile creates parent directories recursively when they do not exist', async () => {
  const filePath = 'nested/sub/dir/test-write-nested.txt'
  const content = 'Nested directory test content'

  try {
    const result = await writeFile(filePath, content)
    assert.deepEqual(result, { path: filePath, bytes: Buffer.byteLength(content) })

    const readBack = await readFile(filePath)
    assert.equal(readBack, content)
  } finally {
    const workspaceDir = path.resolve(process.env.WORKSPACE_DIR ?? './sandbox/workspace')
    await fs.rm(path.resolve(workspaceDir, 'nested'), { recursive: true, force: true })
  }
})

test('writeFile overwrites existing file content', async () => {
  const filePath = 'test-overwrite.txt'
  const initialContent = 'Initial content'
  const newContent = 'Updated content with new information'

  try {
    await writeFile(filePath, initialContent)
    assert.equal(await readFile(filePath), initialContent)

    const result = await writeFile(filePath, newContent)
    assert.deepEqual(result, { path: filePath, bytes: Buffer.byteLength(newContent) })
    assert.equal(await readFile(filePath), newContent)
  } finally {
    const workspaceDir = path.resolve(process.env.WORKSPACE_DIR ?? './sandbox/workspace')
    await fs.rm(path.resolve(workspaceDir, filePath), { force: true })
  }
})

test('writeFile throws error on path traversal outside workspace', async () => {
  await assert.rejects(
    async () => {
      await writeFile('../outside-workspace.txt', 'forbidden')
    },
    {
      name: 'Error',
      message: 'Path is outside the workspace'
    }
  )

  await assert.rejects(
    async () => {
      await writeFile('/etc/passwd', 'forbidden')
    },
    {
      name: 'Error',
      message: 'Path is outside the workspace'
    }
  )
})

test('handlers["filesystem.write"] delegates to writeFile and works with filesystem.read', async () => {
  const filePath = 'test-handler-write.txt'
  const content = 'Tool handler test content'

  try {
    const writeResult = await handlers['filesystem.write']({ path: filePath, content })
    assert.deepEqual(writeResult, { path: filePath, bytes: Buffer.byteLength(content) })

    const readResult = await handlers['filesystem.read']({ path: filePath })
    assert.equal(readResult, content)
  } finally {
    const workspaceDir = path.resolve(process.env.WORKSPACE_DIR ?? './sandbox/workspace')
    await fs.rm(path.resolve(workspaceDir, filePath), { force: true })
  }
})
