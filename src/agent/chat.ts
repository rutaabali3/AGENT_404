import { Store, ToolDoc } from './store.js'
import { runTool, toolSchemas } from './tools.js'
import {
  loadRules,
  loadSkillForTool,
  loadRelevantSkills,
  listSkillCatalog,
  localCompatibilityNotice
} from './instructions.js'

export async function buildSystemPrompt(userMessage: string): Promise<string> {
  const rules = await loadRules()
  const relevantSkills = await loadRelevantSkills(userMessage)
  const catalog = await listSkillCatalog()
  const catalogText = catalog
    .map(skill => `- ${skill.skill}: ${skill.description}`)
    .join('\n')

  return `${rules}\n\n${localCompatibilityNotice()}\n\nYou are Local Agent Studio, a practical general-purpose assistant. Explain actions clearly. Use tools when helpful. Never claim code ran unless a tool result confirms it.\n\nImported skill catalog:\n${catalogText}\n\nRelevant skill instructions for this request:\n${relevantSkills || 'No additional topic skill was selected; use the registered tool descriptions and always-loaded rules.'}`
}

export async function buildChatMessages(userMessage: string, history?: any[]): Promise<any[]> {
  const systemPrompt = await buildSystemPrompt(userMessage)
  const historySlice = Array.isArray(history) ? history.slice(-12) : []
  return [
    { role: 'system', content: systemPrompt },
    ...historySlice,
    { role: 'user', content: userMessage }
  ]
}

export async function executeToolCall(call: any, enabledTools: ToolDoc[], store: Store) {
  let args: any = {}
  try {
    args = JSON.parse(call.function?.arguments || '{}')
  } catch {
    args = {}
  }

  const toolName = call.function?.name
  const tool = enabledTools.find(candidate => candidate.name === toolName) ?? (await store.getTool(toolName))
  if (!tool) {
    throw new Error(`Tool ${toolName} is not registered`)
  }

  const started = Date.now()
  let result: any
  try {
    result = await runTool(tool, args)
  } catch (error: any) {
    result = { error: error.message }
  }

  const skill = await loadSkillForTool(tool.name)
  const step = { tool: tool.name, duration: Date.now() - started, result }

  const context = skill
    ? `Skill instructions for this tool:\n${skill}\n\nTool result:\n${JSON.stringify(result)}`
    : JSON.stringify(result)

  await store.logTool({
    name: tool.name,
    handler: tool.handler,
    args,
    result,
    skill_loaded: Boolean(skill)
  })

  return {
    step,
    toolMessage: {
      role: 'tool' as const,
      tool_call_id: call.id,
      content: context.slice(0, 30000)
    }
  }
}

export async function handleChatRequest(
  reqBody: { message?: string; history?: any[] },
  store: Store
): Promise<{ status: number; body: any }> {
  const userMessage = String(reqBody.message ?? '').trim()
  if (!userMessage) {
    return { status: 400, body: { error: 'Message is required' } }
  }

  if (!process.env.DEEPSEEK_API_KEY) {
    return {
      status: 200,
      body: {
        message: 'DeepSeek is not configured yet. Add DEEPSEEK_API_KEY to .env, then restart the server.',
        steps: []
      }
    }
  }

  const enabled = (await store.tools()).filter(t => t.enabled)
  const messages = await buildChatMessages(userMessage, reqBody.history)
  const allSteps: any[] = []

  try {
    for (let turn = 0; turn < 6; turn++) {
      const response = await fetch(
        `${process.env.DEEPSEEK_BASE_URL ?? 'https://api.deepseek.com'}/chat/completions`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${process.env.DEEPSEEK_API_KEY}`
          },
          body: JSON.stringify({
            model: process.env.DEEPSEEK_MODEL ?? 'deepseek-chat',
            messages,
            tools: toolSchemas(enabled),
            tool_choice: 'auto',
            temperature: 0.2
          })
        }
      )

      if (!response.ok) {
        throw new Error(`DeepSeek HTTP ${response.status}: ${await response.text()}`)
      }

      const data: any = await response.json()
      const message = data.choices?.[0]?.message
      if (!message) {
        throw new Error('DeepSeek returned no message')
      }

      messages.push(message)

      if (!message.tool_calls?.length) {
        await store.saveSession(messages)
        return {
          status: 200,
          body: {
            message: message.content ?? '',
            steps: allSteps
          }
        }
      }

      const results = await Promise.all(
        message.tool_calls.map((call: any) => executeToolCall(call, enabled, store))
      )
      for (const { step, toolMessage } of results) {
        allSteps.push(step)
        messages.push(toolMessage)
      }

      if (turn === 5) {
        return {
          status: 200,
          body: {
            message: 'I reached the tool-call limit for this request.',
            steps: allSteps
          }
        }
      }
    }

    return {
      status: 200,
      body: {
        message: 'I reached the tool-call limit for this request.',
        steps: allSteps
      }
    }
  } catch (error: any) {
    return {
      status: 500,
      body: {
        error: error.message,
        steps: allSteps
      }
    }
  }
}
