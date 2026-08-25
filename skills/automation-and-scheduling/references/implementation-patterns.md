# Implementation Patterns for Automation and Scheduling

Read this after a route is selected in `SKILL.md`, or when you need concrete implementation guidance. Each pattern corresponds to a route in the main skill.

## Pattern 1: Schedule → Manus Execution

Use when the task needs Manus-level judgment, writing, research, or connector access, and the trigger is a simple fixed time.

| Concern | Guidance |
| --- | --- |
| Context | Reuse the same session when historical continuity is valuable; use isolated runs when context cost or independence matters more. |
| Prompt | Describe what to do at execution time — data sources, output format, success criteria, failure behavior. Avoid "do the same thing as before" unless session context is intentionally reused. |
| State | For incremental tasks, track processed items, last-run timestamp, or cursors in a durable place. |
| Delivery | Results can stay inside Manus, or be delivered to third-party channels and databases via connectors — no extra integration setup needed for either path. |
| Cost | Each run consumes Manus credits. Suitable for low-frequency, high-value tasks. Not suitable for high-frequency or scaling workloads. |

### Script-in-sandbox variant

For tasks where the execution logic is deterministic (or nearly so), Manus can write a script in the session's sandbox and simply run it on each scheduled trigger. This gives the simplicity of Schedule → Manus (no API keys, no deployment, no infrastructure) while the actual per-run work is a script rather than AI reasoning.

The tradeoff is durability: the sandbox may become invalid over time, losing the script. When this happens Manus can rewrite it, but the run that discovers the loss may fail or be delayed. For low-frequency, non-critical tasks this is acceptable. For tasks where reliability matters, recommend this as a quick start and suggest upgrading to WebDev + cron or Persistent Sandbox as the durable alternative — explain that the upgrade requires a one-time setup cost (API keys, deployment) but eliminates the sandbox fragility.

## Pattern 2: WebDev (Cron / Event Handler)

Use when the execution is deterministic and can run inside WebDev's managed environment. Trigger can be time-based (cron) or event-based (webhooks, form submissions). Combine both in one app if needed.

| Concern | Guidance |
| --- | --- |
| Trigger | Cron jobs for scheduled tasks. HTTP endpoints for incoming webhooks (Stripe, GitHub, calendar changes) or form submissions. |
| Execution | Deterministic code — API calls, data processing, rule-based checks, notifications. Use built-in LLM for scoped AI substeps (classification, extraction) if needed. No Manus involved at runtime. |
| GUI | Add a frontend when the user needs to manage parameters over time, or when the app itself is a form / dashboard / approval portal. |
| Delivery | WebDev cannot use Manus connectors. For third-party channels (Slack, Telegram, email) or database writes (Sheets, Airtable, Supabase), the user provides API keys or webhook URLs. Guide them through the one-time setup. |
| Constraints | Managed environment — cannot install arbitrary system packages (see Pattern 4 if custom tooling is needed). Stateless execution, 15-minute timeout per job, 1 vCPU / 512 MB. Webhook handlers must respond promptly; offload heavy work to async processing within the timeout. |
| Cost | Free per run after initial setup. The user only pays for external API usage if applicable. |

Read `persistent-computing` skill for full WebDev capabilities and limitations.

## Pattern 3: Persistent Trigger + Manus API

Use when the workflow needs a durable or complex trigger (webhooks, polling with state, filtering, deduplication, throttling) but the actual work should be done by Manus.

| Layer | Responsibility |
| --- | --- |
| Trigger Host | Receive webhooks, poll external APIs, maintain state, deduplicate, throttle, retry. Runs in Persistent Sandbox, WebDev backend, third-party cloud, or external platform. |
| Manus Execution | Perform high-quality analysis, writing, research, cross-tool reasoning, connector-aware work. Invoked via Manus API. |
| Delivery + Result Handling | Results can stay inside Manus for user review (simplest — trigger host just confirms task was created). Or the trigger host can poll for completion and push results to external destinations (Slack, email, databases). Choose based on whether the user wants to review before results go out. |
| Observability | Track processed IDs, run logs, failures, retry counts, last successful execution. |

The trigger host can be a WebDev app (when the workflow also needs a management UI), a Persistent Sandbox script, or an external platform. When using WebDev as trigger host, this is a composite of Pattern 2 + Pattern 3 — the WebDev app receives events AND delegates AI work to Manus API.

Typical examples: Slack/Discord bots that need judgment, GitHub webhook → summarize + notify, RSS monitoring with semantic filtering, email arrival → AI analysis, alert triage with escalation.

Read `manus-api` skill for API details. Read `persistent-computing` skill for hosting options.

## Pattern 4: Persistent Sandbox

Use when the task needs a full Linux environment — either because WebDev's managed runtime cannot support the required tools, or because the service must stay online independently.

| Need | Why WebDev is insufficient |
| --- | --- |
| Custom tooling | The task depends on arbitrary system packages, CLI tools (`yt-dlp`, Feishu/Lark CLI, `ffmpeg`, etc.), native extensions, Docker, or specific language runtimes. WebDev is a managed environment that cannot install these. The default sandbox is ephemeral — installed tools are lost when the session ends. |
| Always-on service | Bots, listeners, daemons, webhook endpoints, or background workers that must remain online outside any Manus session. WebDev pods may sleep. |
| Persistent Sandbox as cron host | When a task is time-triggered and deterministic but needs custom tooling, set up a system cron job on the sandbox. You lose WebDev's managed GUI and hosting, but gain full control over the environment. |

Persistent Sandbox scripts can deliver to any destination via direct API calls (user provides API keys as environment variables). For AI-heavy steps, invoke Manus API (see Pattern 3).

Read `persistent-computing` skill before recommending or deploying.

## Pattern 5: Default Sandbox

Use for one-off or current-session automation: data cleanup, batch transformation, exploratory scraping, local file processing, short-lived API calls, or temporary glue scripts.

Do not rely on the default sandbox for unattended long-running services, webhook receivers, or background workers that must survive hibernation. If a sandbox script becomes a recurring need, reassess whether it should move to schedule, WebDev + cron, or persistent hosting.

## Using Built-in LLM

Built-in LLM is an execution option available inside WebDev apps and the default sandbox. It sits between deterministic code and full Manus execution.

| | Built-in LLM | Manus Execution |
| --- | --- | --- |
| Cost | Depends on the model chosen | Credits per run (significantly higher) |
| Setup | Out of the box, no API key needed | N/A |
| Model selection | A set of available models; user can choose | Full Manus capability |
| Best for | Substeps with clear, scoped instructions — translation, entity extraction, classification, formatting, simple generation | Complex, multi-step reasoning — research, analysis, long-form writing, tasks where quality is the priority |

### Rules

1. **Disclose the model before using it.** Tell the user which model the built-in LLM will use. Different models vary significantly in capability and cost — the user must be able to make an informed choice. Do not silently embed a model and let the user discover quality or cost issues after deployment.
2. **Offer alternatives if the result is unsatisfactory.** If the user finds the chosen model inadequate, suggest: (a) switching to a more capable built-in model, (b) routing the substep to Manus execution via Manus API, or (c) letting the user provide their own API key for a model of their choice.
3. **Match model to task.** Use a lightweight model for simple, high-volume substeps where cost matters. Use a more capable model when output quality directly affects the product. When unsure, default to a more capable model and let the user downgrade if cost is a concern.

## Safety and Operations Checklist

Apply this to any recurring or event-driven workflow, regardless of pattern.

| Area | Check |
| --- | --- |
| State | Store last-run timestamp, processed IDs, cursors, and output history for incremental tasks. |
| Idempotency | Make repeated triggers safe — avoid duplicate sends, posts, or destructive actions. |
| Retries | Decide which failures retry, how many times, and when to alert the user. |
| Human approval | Require confirmation for posting, emailing, purchasing, deleting, or modifying important external data unless the user explicitly approves full automation. |
| Cost | Explain cost shape: Manus credits per run, WebDev hosting, persistent compute monthly cost, external API costs. |
