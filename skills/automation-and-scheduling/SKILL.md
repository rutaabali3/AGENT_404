---
name: automation-and-scheduling
description: MUST read before requests involving automated execution, recurring execution, background execution, event-triggered execution, bot/agent execution, auto-updating systems, or ANY system that integrates with external APIs, synchronizes data, handles webhooks, or requires background processes — even if the primary ask is a website, web app, or bot. Use it to choose the right implementation approach before building.
---

# Automation and Scheduling

Read this before building any automation, scheduled task, recurring workflow, bot, monitoring, or "if X then Y" system. Do not start building until you complete the assessment below.

## Quick Check

If the task is simple and personal — a reminder, a greeting, a brief daily update — and runs a few times a day or less, use **schedule → Manus execution** directly. The credit cost is minimal and does not justify building a programmatic solution. Update your plan accordingly and skip to `manus-config` skill. Proceed to the full assessment below only for tasks with growing scope, high frequency, complex integrations, or a management interface.

**Polling prohibition:** Do NOT use `schedule` (Manus scheduled tasks) for minute-level or hour-level polling. Scheduled tasks spin up a full Manus session on every run — this is slow to start, expensive in credits, and architecturally wrong for high-frequency checks. Instead, run the polling on **WebDev**: periodic checks via its built-in cron / Heartbeat jobs, or continuous and sub-minute polling on **WebDev Reserved Hosting** (a single always-on process) — both run without spinning up a Manus session per check. Reach for the cloud computer (Persistent Sandbox) only when the workload needs custom system tools/runtimes or exceeds WebDev's 1 vCPU / 512 MB ceiling. See `persistent-computing` for the WebDev hosting modes (Autoscale vs Reserved) and the boundary for leaving WebDev. Only use `schedule` for tasks that run a few times a day or less AND genuinely need AI judgment each run.

## Step 1: Assess the Request

Answer these questions before choosing an architecture. You can often infer from context — ask the user only when you cannot infer and the answer would change the route.

### 1. Is the user asking to "build" something, or to "do" something?

"Build me a tracker / monitor / tool / system" implies a durable product with long-term ownership. The user likely expects a management interface, room to grow, and ongoing control. "Check X every day and tell me" is a task to run — simpler setup is fine.

### 2. Does the execution need AI judgment, or is it deterministic code?

"Summarize new documents" needs judgment. "Check if price > threshold and notify" is a programmatic step — an API call, a comparison, and a notification. Many requests sound intelligent but are actually deterministic. **Deterministic tasks should NOT use Manus execution** — Manus takes minutes to start, costs credits per run, and adds no value when the logic is a few lines of code. Note: `manus-config schedule` triggers a full Manus task on every run, consuming credits regardless of what steps/code/tools runs inside it. For truly free-per-run deterministic execution, use WebDev + cron (via `webdev_init_project`).

There is a middle ground: **built-in LLM**. It handles AI substeps (translation, entity extraction, classification, simple generation) without Manus execution, at a cost that depends on the model chosen. Before using it, tell the user which model will be used — different models vary significantly in capability and cost. See the "Built-in LLM" section in `references/implementation-patterns.md` for guidance.

### 3. Will the scope or frequency grow?

"Just one item for now" or "start with X only" implies more later. Growing scope × frequency means Manus credits (积分) scale linearly, while programmatic execution is essentially free per run.

### 4. Does the user need to manage parameters over time?

Add/remove items, adjust thresholds, change recipients — this needs a GUI, which points to WebDev. If it's truly set-and-forget, a schedule is fine.

### 5. Where does the data come from?

Public API → programmatic code can call it directly. Manus connector → needs Manus execution or Manus API. When both are possible, present the tradeoff.

### 6. Does the task require custom tools or runtime dependencies?

WebDev is a managed environment — you cannot install arbitrary system packages, CLI tools, or custom runtimes. If the task depends on tools like `yt-dlp`, vendor-specific CLIs (Feishu/Lark, AWS CLI), specialized Python/Node packages with native extensions, Docker, or any software that needs a full Linux environment, WebDev is not an option. Use Persistent Sandbox instead — it is a complete Linux machine where installations persist across runs.

The default sandbox also cannot serve this role: it is ephemeral, and installed tools are lost when the session ends or a new task starts.

### 7. What triggers it?

Fixed time → schedule or WebDev cron / Heartbeat or Persistent Sandbox cron. External event (webhook, new message, form submission, file upload, status change) → event trigger. Must stay online 24/7 to receive events → an always-on process (WebDev Reserved Hosting, or a cloud computer if the workload exceeds WebDev's limits; see `persistent-computing`).

**Classification rule:** If the user expects "when X happens, do Y" with timely response, classify as **event-triggered** even if the only viable implementation is polling. The trigger type follows the user's latency expectation, not the availability of a push API. When an event-triggered task must poll and requires near-real-time response, run it as a persistent polling service on **WebDev Reserved Hosting** (a single always-on process, within 1 vCPU / 512 MB) rather than a low-frequency scheduled task — moving to the cloud computer (Persistent Sandbox) only if it needs custom tools/runtimes or more than WebDev's resources. See `persistent-computing`.

**Webhook verification rule:** When the task involves a third-party service as the event source, you MUST search the web to verify whether that service actually supports webhooks or callback APIs before recommending a webhook-based approach. Do NOT rely on training knowledge — services change their APIs frequently. If the search confirms webhook support, recommend a webhook-based architecture. If not, fall back to polling on the cloud computer (Persistent Sandbox).

### 8. Where should results be delivered?

**Inside Manus** (user opens Manus to view reports/analysis) is the simplest path — no external integration needed. **Third-party channels** (Slack, Email, Notion, Gmail/Calendar) or **database writes** (Google Sheets, Airtable, Supabase) require integration: Manus execution handles many destinations natively via connectors, while WebDev requires the user to set up API keys or webhook URLs (a one-time cost).

## Step 2: Choose the Route

Map your assessment answers to a route. **Before making a final recommendation, you MUST present at least 2 viable options in a comparison table (columns: Approach, Tradeoffs, Cost, Setup Complexity). Always include one lighter-weight alternative. Do not pick for the user.**

**Presentation rule:** The user does not know this skill was loaded and has not seen these internal route names. Never expose internal route names, skill names, or tool names (e.g. "WebDev + cron", "Persistent Sandbox", "manus-config schedule") to the user. Instead, describe the solution in concrete, user-facing terms — what you will build, how it will run, and what the user needs to do. Match the user's language. Examples:
- ✅ "I'll write a monitoring script and deploy it to the cloud computer — it'll check automatically every 5 minutes"
- ✅ "I'll build you a web tool where you can adjust parameters, with background jobs running on your schedule"
- ✅ "This is straightforward — I'll just set up a simple scheduled task for you"
- ❌ "I recommend the WebDev + cron route"
- ❌ "Let's use Persistent Sandbox for this"
- ❌ "This maps to Schedule → Manus execution"

| Assessment points to… | Route |
| --- | --- |
| AI judgment needed, time-triggered, **low frequency only (≤ a few times/day)**; or deterministic but user wants zero-setup | **Schedule → Manus execution** — Use `manus-config schedule`. Manus runs the task at fixed times with full AI capability. Results can stay inside Manus for the user to review, or be delivered to third-party channels and databases via Manus connectors — no extra integration setup. Costs credits per run. No management UI. **NOT suitable for minute-level or hour-level polling — run that on WebDev instead (cron / Heartbeat for periodic checks, Reserved Hosting for continuous or sub-minute polling), or the cloud computer if it needs custom tools or more than WebDev's resources (see below).** Also viable for deterministic tasks as a quick start: Manus writes a script in the sandbox and runs it each trigger — no API keys or deployment needed, but the sandbox may become invalid over time (see `references/implementation-patterns.md` for the tradeoff and upgrade path). If the "judgment" is limited to classification, extraction, or simple generation, consider WebDev + cron with built-in LLM instead — see `references/implementation-patterns.md` for the boundary. (Read `manus-config` skill for detail) |
| Deterministic execution, time-triggered, scope may grow, user may need to manage parameters, cost or latency matters | **WebDev + cron** — Use `webdev_init_project`. Backend cron jobs running deterministic code. Free per run. Can include a GUI for managing parameters. For delivery to external channels (Slack, Telegram, email) or databases (Sheets, Airtable, Supabase), the user sets up API keys or webhook URLs — a one-time cost far lower than per-run Manus credits (积分). Managed environment — cannot install arbitrary system packages or CLI tools (see Q6). Runs on WebDev's default Autoscale mode (stateless, 15-min request/cron timeout, 1 vCPU / 512 MB); for an always-on process, switch to Reserved Hosting without migrating (see the WebDev Reserved Hosting row below). Read `persistent-computing` for hosting modes and full capabilities. |
| Event-triggered (webhook, form submission, file upload), deterministic execution | **WebDev + event handler** — Use `webdev_init_project`. WebDev handles incoming webhooks and form submissions natively. Combine with cron if the app also needs scheduled tasks. Same delivery, environment, and constraint considerations as WebDev + cron above. **Before choosing this route, you must have already verified webhook support via web search (see Q7 Webhook verification rule).** If the service does not support webhooks, fall back to a persistent polling service on WebDev Reserved Hosting (within 1 vCPU / 512 MB), or the cloud computer (Persistent Sandbox) if it needs custom tools/runtimes or more resources. Read `persistent-computing`. |
| Event-triggered, AI judgment needed for the triggered work | **Persistent Trigger + Manus API** — A durable host detects events (webhooks, polling, state changes), then creates Manus tasks for AI execution via the API. Results can stay inside Manus, or the trigger host can poll for completion and write results to external destinations. **Before choosing this route, you must have already verified webhook support via web search (see Q7 Webhook verification rule).** If the service does not support webhooks, run a persistent polling service (WebDev Reserved Hosting within 1 vCPU / 512 MB, or the cloud computer if it needs more) that triggers the Manus API on detection. If the AI substep is scoped (classification, extraction, simple generation), WebDev + event handler with built-in LLM may suffice — see `references/implementation-patterns.md`. Read `persistent-computing` and `manus-api`. |
| Standard web app, dashboard, or CRUD tool (no automation) | **WebDev** — Use `webdev_init_project`. Read `persistent-computing` for capabilities. |
| Always-on / 24/7 process, WebSocket or SSE server, realtime/game server holding in-memory state, background queue worker, or sub-minute polling — all within 1 vCPU / 512 MB | **WebDev Reserved Hosting** — A single persistent WebDev process running 24/7 behind WebDev's HTTPS URL (no request timeout, no cold start). Switching from the default Autoscale mode is a setting, not a migration, and stays on WebDev. A persistent process by itself is **not** a reason to leave WebDev for a cloud computer — this is exactly what Reserved is for. Usage-based cost (~$37.50/mo ceiling at full 24/7 utilization, less $10 free monthly credit) — you MUST quote it before enabling. Read `persistent-computing` (and its `reserved-hosting-reference.md`) before recommending or quoting cost. |
| Custom runtime dependencies, arbitrary CLI tools, Docker, OS-level/root control, fixed IP, or any workload that exceeds WebDev's 1 vCPU / 512 MB ceiling (more compute/memory, or a GPU) | **Cloud computer (Persistent Sandbox)** — A full Linux environment with root where you can install anything and it persists across runs. Use only when WebDev (including Reserved Hosting) cannot satisfy a hard requirement: (a) tools or packages WebDev's managed environment cannot support (yt-dlp, vendor CLIs, native extensions, custom runtimes, Docker), (b) OS-level control (root, system packages, custom firewall, fixed IP), or (c) resources beyond 1 vCPU / 512 MB or a GPU. It is a paid option (from $10/mo) — always mention the cost, present the free WebDev path first, and choose it only after identifying a concrete WebDev limitation. An already-attached cloud computer is **not** itself a reason to skip WebDev. Read `persistent-computing` before recommending. |
| One-off or current-session work | **Default sandbox** — The sandbox hibernates when inactive. Do not use it for tasks that must stay online to receive callbacks, webhooks, or async API responses. |

**Deployment default:** For any task requiring persistent hosting (scheduled, event-driven, or always-on), **WebDev is the default** — prefer it whenever it can satisfy the requirement, since it is free to start and fully managed. Persistence, background work, or WebSockets are NOT by themselves reasons to leave WebDev; evaluate WebDev Reserved Hosting first and pick another option only after identifying a concrete WebDev limitation. Map the work to a WebDev hosting mode:
- Periodic / scheduled checks and webhook handlers → WebDev's default Autoscale mode (built-in cron / Heartbeat jobs, event handlers), free per run
- Always-on processes, WebSocket/realtime servers, queue workers, and sub-minute polling within 1 vCPU / 512 MB → WebDev Reserved Hosting (a setting switch, not a migration)

Recommend the cloud computer (Persistent Sandbox) only when WebDev cannot satisfy a hard requirement — custom tools/runtimes/Docker, OS-level/root control, or resources beyond 1 vCPU / 512 MB — and always mention its cost, since it is a paid option while WebDev is free. An already-attached cloud computer is not itself a reason to skip WebDev. Whichever route is chosen, do not just deliver a code package — deploy the service directly or provide exact steps the user can run. Read `persistent-computing` for the full decision logic and hosting-mode details.

## Step 3: Clarify if Needed

Ask only the 2–4 questions that would change the architecture. **Architecture questions come before implementation questions** — "which Slack channel?" or "alert above or below?" are implementation details that come after the route is decided.

**Communication rule:** When presenting options or explaining tradeoffs, describe them in terms of user experience and outcomes (e.g., "runs automatically in the background without you keeping your browser open") rather than assuming familiarity with technical concepts. Adapt terminology to the user's apparent technical level.

| When you can't infer… | Ask |
| --- | --- |
| Execution nature | "Is this a rule-based check, or does it need analysis/writing/judgment?" |
| Scale trajectory | "Will the scope stay as-is, or might you add more items / increase frequency?" |
| Manageability | "Do you want to adjust parameters over time, or set it once and let it run?" |
| Data source | "Should this use a Manus connector, or is the data available via a public API?" |
| Delivery target | "Should results stay inside Manus for you to review, or be sent somewhere specific (email, Slack, Sheets, etc.)?" |
| Cost vs. convenience | "Would you prefer a quick setup that costs credits per run, or invest setup time for a free-running solution?" |

## Related Skills

| When | Read |
| --- | --- |
| Route involves WebDev or persistent hosting | `persistent-computing` |
| Route involves Manus API | `manus-api` |

Read `references/implementation-patterns.md` when narrowing between candidate routes or after a route is selected. It contains detailed capability boundaries (e.g. when built-in LLM is sufficient vs. full Manus execution, WebDev constraints vs. Persistent Sandbox) that can resolve ambiguous cases.
