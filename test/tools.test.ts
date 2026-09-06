import test from 'node:test'
import assert from 'node:assert/strict'
import { toolSchemas } from '../src/agent/tools.js'
import { ToolDoc } from '../src/agent/store.js'

test('toolSchemas returns empty array when input tools array is empty', () => {
  const result = toolSchemas([])
  assert.deepEqual(result, [])
})

test('toolSchemas filters out disabled tools', () => {
  const tools: ToolDoc[] = [
    {
      name: 'tool_a',
      description: 'Tool A description',
      category: 'test',
      enabled: false,
      requires_sandbox: false,
      parameters: { type: 'object', properties: {} },
      handler: 'test.a'
    },
    {
      name: 'tool_b',
      description: 'Tool B description',
      category: 'test',
      enabled: false,
      requires_sandbox: false,
      parameters: { type: 'object', properties: {} },
      handler: 'test.b'
    }
  ]

  const result = toolSchemas(tools)
  assert.deepEqual(result, [])
})

test('toolSchemas maps enabled tools to Function declaration objects', () => {
  const tools: ToolDoc[] = [
    {
      name: 'tool_enabled_1',
      description: 'First enabled tool',
      category: 'category_1',
      enabled: true,
      requires_sandbox: false,
      parameters: {
        type: 'object',
        properties: { query: { type: 'string' } },
        required: ['query']
      },
      handler: 'handler.1'
    },
    {
      name: 'tool_disabled',
      description: 'Disabled tool',
      category: 'category_1',
      enabled: false,
      requires_sandbox: false,
      parameters: { type: 'object' },
      handler: 'handler.disabled'
    },
    {
      name: 'tool_enabled_2',
      description: 'Second enabled tool',
      category: 'category_2',
      enabled: true,
      requires_sandbox: true,
      parameters: {
        type: 'object',
        properties: { code: { type: 'string' } }
      },
      handler: 'handler.2'
    }
  ]

  const result = toolSchemas(tools)

  assert.equal(result.length, 2)
  assert.deepEqual(result, [
    {
      type: 'function',
      function: {
        name: 'tool_enabled_1',
        description: 'First enabled tool',
        parameters: {
          type: 'object',
          properties: { query: { type: 'string' } },
          required: ['query']
        }
      }
    },
    {
      type: 'function',
      function: {
        name: 'tool_enabled_2',
        description: 'Second enabled tool',
        parameters: {
          type: 'object',
          properties: { code: { type: 'string' } }
        }
      }
    }
  ])
})
