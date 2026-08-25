# Local Agent Studio

Local Agent Studio is a **local-first general-purpose AI agent** with a browser dashboard, DeepSeek reasoning, an explicit tool registry, MongoDB persistence, web tools, and Docker-isolated code execution. It is intentionally designed to run on a developer-owned machine rather than being deployed to a cloud host.

## Run locally

Install Node.js 20+, Docker Desktop with the WSL2 backend, and optionally a free MongoDB Atlas M0 database. Then run:

```bash
cp .env.example .env
npm install
npm run build
npm run dev
```

Open `http://127.0.0.1:8787`. The app works in memory mode without MongoDB, but setting `MONGODB_URI` enables persistence for tools, sessions, and tool logs. Setting `DEEPSEEK_API_KEY` enables live reasoning. Build the sandbox image once with `docker build -t local-agent-sandbox -f Dockerfile.sandbox .`.

## Architecture

The Express server serves the dashboard and exposes `/api/chat`, `/api/tools`, `/api/tools/:name`, and `/api/health`. The chat endpoint sends only enabled tools to DeepSeek and executes tool calls through a fixed server-side handler map. It never evaluates model-produced code on the host.

Python and Node execution are sent to an ephemeral container with a read-only root filesystem, no network, a 1 GB memory limit, one CPU, a non-root UID, and only three bind mounts: read-only uploads plus writable workspace and outputs. Filesystem tools are scoped to `sandbox/workspace` and reject path traversal.

The tool registry includes the core code, filesystem, and web tools, plus the complete requested AHM7 integration inventory. AHM7 entries are visible and toggleable; the wrapper slots return a clear configuration message until provider-specific credentials and payload contracts are supplied.

## Skills and rules

The agent now has a separate instruction layer. `rules.md` is loaded into every DeepSeek system message and defines identity, hard boundaries, filesystem scope, credential handling, sandbox networking, and failure-reporting behavior. Tools describe what the agent can do, while rules describe what it must never do and skills describe how to do supported work consistently.

Each supported capability has a matching `skills/<name>/SKILL.md` file. The current skill set covers code execution, DOCX, PDF, XLSX, PPTX, web search, image generation, vision, and the centralized AHM7 wrapper. When a tool is dispatched, the backend loads its matching skill and includes those instructions alongside the tool result in the next model context. This keeps the implementation deterministic without adding a dynamic skill router.

The build sequence now includes an instruction setup step after tool seeding and before the tool-calling loop: create `rules.md`, create all listed skill files, inject the rules on every request, and bind each tool to its skill file.

## Free-tier configuration

DeepSeek, MongoDB Atlas M0, SearXNG, and Tavily are all optional integrations. SearXNG is the preferred search path when a local instance is available; Tavily is a configured fallback. No cloud deployment is required for this repository.

## Verification

```bash
npm run lint
npm run build
```

The current repository preserves the original WhatsApp bot files for reference, but the active package scripts now target Local Agent Studio.
