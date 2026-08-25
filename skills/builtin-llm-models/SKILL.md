---
name: builtin-llm-models
description: >
  Reference for Manus's built-in LLM catalog and how to call it correctly. Read
  this BEFORE writing any script that calls LLMs in bulk (summarization,
  translation, classification, extraction, deep analysis, judging/evaluation,
  map/parallel fan-out) inside the sandbox, AND before using the built-in LLM in
  a webdev project (invokeLLM / listLLMModels). Use it to discover which models
  exist, each model's price/capabilities, how to pick one, the exact request
  shapes (thinking/reasoning, JSON-schema structured output, vision, tools), and
  the per-model gotchas (max-token handling, reasoning syntax) verified against
  the live proxy.
---

# Built-in LLM Models

Manus ships an OpenAI-compatible LLM proxy. There are **two distinct entry points**
that share the **same model catalog** but use different credentials and SDKs:

| Context | Endpoint env vars | How to call |
| --- | --- | --- |
| Sandbox scripts (Python/shell) | `OPENAI_API_KEY`, `OPENAI_API_BASE` (preconfigured) | `openai` Python SDK with `OpenAI()` (base + key auto-read) |
| Webdev project (server-side) | `BUILT_IN_FORGE_API_URL`, `BUILT_IN_FORGE_API_KEY` | `invokeLLM` / `listLLMModels` from `server/_core/llm` |

Both speak the OpenAI Chat Completions schema. **Do NOT hardcode the model list
from memory** — it changes. Always pull the live catalog (Step 1) before relying
on any specific ID, price, or capability.

## Step 1 — Always fetch the live catalog first

The catalog (IDs, `pricing`, `capabilities.thinking_param`, `capabilities.thinking_example`)
is the source of truth. Snapshots in this skill go stale; the API does not.

Sandbox:
```bash
curl -s "$OPENAI_API_BASE/models" -H "Authorization: Bearer $OPENAI_API_KEY" | python3 -m json.tool
```

Webdev (project shell, or `listLLMModels()` at runtime):
```bash
curl "$BUILT_IN_FORGE_API_URL/v1/models" -H "Authorization: Bearer $BUILT_IN_FORGE_API_KEY"
```

### Model Catalog Snapshot (2026-06-29)

**This is a snapshot. Always re-verify against the live `/models` endpoint** because IDs, prices, and capabilities change over time. All models below support **tools, vision, JSON-schema structured output, and thinking/reasoning**; none expose streaming on the proxy (`supports_streaming: false`). Pricing is USD per 1M tokens (input / output).

| Model ID | Owner | In / Out ($/1M) | thinking_param | Best for |
| --- | --- | --- | --- | --- |
| `gpt-5-nano` | openai | 0.05 / 0.40 | `reasoning` | Cheapest/fastest; huge-volume lightweight tasks |
| `gpt-5-mini` | openai | 0.25 / 2.00 | `reasoning` | **Default** cheap+fast workhorse for most bulk jobs |
| `gpt-5` | openai | 1.25 / 10.00 | `reasoning` | Flagship reasoning + coding |
| `gpt-5.5` | openai | 5.00 / 30.00 | `reasoning` | Hardest reasoning/generation workloads |
| `claude-haiku-4-5` | anthropic | 1.00 / 5.00 | `thinking` | Fast, cost-efficient everyday work |
| `claude-sonnet-4-6` | anthropic | 3.00 / 15.00 | `thinking` | Balanced; strong code/reasoning, extended thinking |
| `claude-opus-4-6` | anthropic | 5.00 / 25.00 | `thinking` | High-capability reasoning/coding |
| `claude-opus-4-7` | anthropic | 5.00 / 25.00 | `thinking` | Latest high-capability; advanced workloads |
| `gemini-3-flash-preview` | google | 0.50 / 3.00 | `thinking` | Fast long-context + multimodal at low cost |
| `gemini-3.1-pro-preview` | google | 2.00 / 12.00 | `thinking` | Flagship long-context + multimodal reasoning |

## Step 2 — Pick a model

Decision order for typical Manus tasks:

1. **Translation / summarization / classification / tagging / simple extraction at scale** → `gpt-5-mini`. Drop to `gpt-5-nano` only if volume is very large and per-item quality tolerance is loose. Skip thinking for these (adds cost and latency with little gain).
2. **Nuanced analysis, code generation, structured reasoning over each item** → `claude-sonnet-4-6` or `gpt-5`, optionally with a modest thinking budget.
3. **LLM-as-judge / evaluation, multi-step agentic reasoning, hardest problems** → `claude-opus-4-7`, `gpt-5.5`, or `gemini-3.1-pro-preview`. Use a real thinking budget here.
4. **Very long inputs or image/PDF/audio/video inputs at low cost** → `gemini-3-flash-preview` (large context, multimodal, cheap), upgrade to `gemini-3.1-pro-preview` when quality matters.

### Cost-aware batching pattern

For large batches, run a cheap model first (e.g. `gpt-5-nano`/`gpt-5-mini`), apply a programmatic quality gate (schema validation, length checks, confidence field), then re-run only the failures on a stronger model. This typically cuts spend by an order of magnitude versus running everything on a premium model.

### Mapping models to the `map` tool (wide / parallel research)

When using Manus's `map` tool for homogeneous parallel subtasks, the subtasks themselves run as full agents; you generally do not pick a proxy model there. Use this skill's `scripts/llm_batch.py` (or direct SDK calls) when YOU are writing a script that fans out raw LLM calls and needs explicit model/cost control.

## Step 3 — Call it with the correct request shape

The proxy mirrors OpenAI Chat Completions, but provider-specific behaviors (like extended thinking, reasoning effort, and strict JSON schemas) differ by family.

### 🚨 The Max-Token Trap (Crucial — differs by family)

When a model reasons/thinks, it consumes tokens *before* generating the final answer.

- **GPT:** Use `max_completion_tokens` to cap visible output while leaving reasoning unconstrained.
- **Claude:** Use `max_tokens`, and it *must* be strictly greater than `budget_tokens` (e.g. `budget_tokens=2048` requires `max_tokens=2049` or higher).
- **Gemini:** Use `max_tokens` (e.g. `max_tokens=16384`). Do **NOT** use `max_completion_tokens` — on the current proxy it causes `content: null` with `finish_reason: "length"` regardless of budget size. Omitting the parameter entirely also works (the model will use its default limit).

### A. Sandbox (Python)

The SDK auto-reads `OPENAI_API_KEY` and `OPENAI_API_BASE`; just call `OpenAI()`.

#### A1. Basic chat

```python
from openai import OpenAI
client = OpenAI()

resp = client.chat.completions.create(
    model="gpt-5-mini",
    messages=[
        {"role": "system", "content": "You are a precise translator."},
        {"role": "user", "content": "Translate to French: Good morning."},
    ],
)
print(resp.choices[0].message.content)
print(resp.usage.prompt_tokens, resp.usage.completion_tokens)
```

#### A2. Thinking / reasoning (family-specific, goes in `extra_body`)

The catalog field `capabilities.thinking_param` tells you which key to send; the field `capabilities.thinking_example` gives the exact shape.

**1. OpenAI GPT-5 Series** (`gpt-5-nano`, `gpt-5-mini`, `gpt-5`, `gpt-5.5`)
Controls reasoning via the `reasoning.effort` parameter. If you pass Anthropic/Google `thinking` syntax, it is silently ignored.
```python
client.chat.completions.create(
    model="gpt-5",
    messages=[{"role": "user", "content": "Prove sqrt(2) is irrational."}],
    max_completion_tokens=2000, # Prevents reasoning from eating the output budget
    extra_body={"reasoning": {"effort": "high"}}, # "minimal" | "low" | "medium" | "high"
)
```

**2. Anthropic Claude Series**
Anthropic's models require an explicit thinking budget, but behavior varies by generation.
- `claude-sonnet-4-6` and `claude-opus-4-6`: Require explicit thinking budget.
- `claude-opus-4-7`: Uses **adaptive thinking**. It does not require explicit thinking parameters.
- `claude-haiku-4-5`: Accepts the standard thinking block.
```python
client.chat.completions.create(
    model="claude-sonnet-4-6",
    messages=[{"role": "user", "content": "Prove sqrt(2) is irrational."}],
    max_tokens=4000, # MUST be strictly > budget_tokens
    extra_body={"thinking": {"type": "enabled", "budget_tokens": 2048}},
)
```

**3. Google Gemini Series** (`gemini-3.1-pro-preview`, `gemini-3-flash-preview`)
Gemini always reasons by default (no explicit param needed). Optionally use `reasoning_effort: "low"|"medium"|"high"` to adjust reasoning intensity.
```python
client.chat.completions.create(
    model="gemini-3.1-pro-preview",
    messages=[{"role": "user", "content": "Prove sqrt(2) is irrational."}],
    max_tokens=16384, # MUST use max_tokens for Gemini (NOT max_completion_tokens)
)
```

#### A3. Structured output (JSON schema) — preferred for extraction/analysis

All proxy models fully support OpenAI's `response_format` JSON Schema specification. **Required:** `strict: True` and `additionalProperties: False`.

```python
resp = client.chat.completions.create(
    model="gpt-5-mini",
    messages=[
        {"role": "system", "content": "Output JSON only."},
        {"role": "user", "content": "My name is Alice and I am 30."},
    ],
    response_format={
        "type": "json_schema",
        "json_schema": {
            "name": "person",
            "strict": True,
            "schema": {
                "type": "object",
                "properties": {
                    "name": {"type": "string"},
                    "age": {"type": "integer"},
                },
                "required": ["name", "age"],
                "additionalProperties": False,
            },
        },
    },
)
import json
data = json.loads(resp.choices[0].message.content)
```

#### A4. Vision (image input)

```python
client.chat.completions.create(
    model="gemini-3-flash-preview",
    messages=[{
        "role": "user",
        "content": [
            {"type": "text", "text": "Describe this image."},
            {"type": "image_url",
             "image_url": {"url": "https://example.com/pic.jpg", "detail": "auto"}},
        ],
    }],
)
```
For local images, base64-encode and use a `data:image/...;base64,...` URL.

#### A5. Tool / function calling

```python
tools = [{
    "type": "function",
    "function": {
        "name": "get_weather",
        "description": "Get weather for a city",
        "parameters": {
            "type": "object",
            "properties": {"city": {"type": "string"}},
            "required": ["city"],
        },
    },
}]
resp = client.chat.completions.create(
    model="claude-sonnet-4-6",
    messages=[{"role": "user", "content": "Weather in Tokyo?"}],
    tools=tools,
    tool_choice="auto",
)
# resp.choices[0].message.tool_calls -> execute -> append role:"tool" result -> call again
```

#### A6. Concurrent batch (the common case for bulk summarize/translate/analyze)

A ready-to-run batch driver is bundled:
```bash
# Sandbox batch LLM driver: concurrent, retrying, optional JSON-schema output.
python3 /home/ubuntu/skills/builtin-llm-models/scripts/llm_batch.py --help
```

Minimal inline version:
```python
import concurrent.futures as cf
from openai import OpenAI
client = OpenAI()

def one(text):
    r = client.chat.completions.create(
        model="gpt-5-mini",
        messages=[{"role": "user", "content": f"Summarize in one sentence:\n{text}"}],
    )
    return r.choices[0].message.content

items = [...]  # list of inputs
with cf.ThreadPoolExecutor(max_workers=8) as ex:
    results = list(ex.map(one, items))
```
Keep `max_workers` modest (4–10); the proxy rate-limits and the SDK already retries.

### B. Webdev project (TypeScript, server-side only)

Import from the scaffold's core helper. Credentials are injected by the platform (`BUILT_IN_FORGE_API_URL` / `BUILT_IN_FORGE_API_KEY`); never call from the client. Calls deduct project credits.

#### B1. Basic + list models

```ts
import { invokeLLM, listLLMModels } from "./server/_core/llm";

const { data } = await listLLMModels();         // discover IDs at runtime
const model = data.find(m => m.id.startsWith("claude-"))?.id;

const res = await invokeLLM({
  model,                                          // optional; omit for default
  messages: [
    { role: "system", content: "You are helpful." },
    { role: "user", content: "Hello" },
  ],
});
const text = res.choices[0].message.content;
```

#### B2. Thinking / reasoning (forwarded unchanged)

```ts
await invokeLLM({
  model: "claude-sonnet-4-6",
  messages: [...],
  thinking: { type: "enabled", budget_tokens: 2048 },
});
await invokeLLM({
  model: "gpt-5",
  messages: [...],
  reasoning: { effort: "low" },
});
```

#### B3. Structured output

```ts
const r = await invokeLLM({
  messages: [
    { role: "system", content: "Output JSON." },
    { role: "user", content: "name=Alice age=30" },
  ],
  response_format: {
    type: "json_schema",
    json_schema: {
      name: "person",
      strict: true,
      schema: {
        type: "object",
        properties: { name: { type: "string" }, age: { type: "integer" } },
        required: ["name", "age"],
        additionalProperties: false,
      },
    },
  },
});
// JSON.parse(r.choices[0].message.content)
```
The helper also accepts `outputSchema`/`output_schema` as a shorthand, plus `tools`, `toolChoice`, `maxTokens`. It retries non-2xx/network errors with exponential backoff internally.

#### B4. Streaming (not exposed by default)

`invokeLLM()` does not expose `stream`. If you truly need it, modify the helper to send `stream: true` and parse the SSE response. When proxying SSE, listen on the response object's close event (not the request) and guard with a `finished` flag, or the upstream gets aborted after the first event. Render markdown with `<Streamdown>{content}</Streamdown>` from `streamdown`.

### C. Raw HTTP (any language)

```bash
curl -s "$OPENAI_API_BASE/chat/completions" \
  -H "Authorization: Bearer $OPENAI_API_KEY" \
  -H "Content-Type: application/json" \
  -d '{"model":"gpt-5-mini","messages":[{"role":"user","content":"ping"}]}'
```
Webdev path is `"$BUILT_IN_FORGE_API_URL/v1/chat/completions"` with `BUILT_IN_FORGE_API_KEY`.

## Troubleshooting

| Symptom | Likely Cause | Fix |
| --- | --- | --- |
| Gemini returns `content: null` + `finish_reason: "length"` | Used `max_completion_tokens` | Switch to `max_tokens` or omit the parameter |
| Claude returns 400 Bad Request | `max_tokens` <= `budget_tokens` | Set `max_tokens` strictly greater than `budget_tokens` |
| GPT output truncated with reasoning on | Used `max_tokens` with reasoning | Switch to `max_completion_tokens` for GPT |

## Files in this skill

- `scripts/llm_batch.py` — concurrent, retrying batch driver for sandbox bulk jobs.
