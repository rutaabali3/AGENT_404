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

AGENT-420 includes the complete detailed skill export under `skills/`, including operational workflows, references, bundled documentation, and topic-specific guidance for automation, LLM usage, finance, games, Google Workspace, images, Manus APIs and connectors, presentations, music, persistent computing, OCR, TTS, Typst/PDF work, WebDev integrations, mobile and static applications, and voice transcription. It also retains local runtime skills for filesystem operations, Docker code execution, deterministic PDF/DOCX/XLSX/PPTX generation, web search, video downloads, vision, and AHM7 boundaries.

The agent uses progressive disclosure. `rules.md` is always loaded, the catalog metadata is available to the model for every chat, relevant skill bodies are selected from the user request, and the skill bound to a dispatched tool is attached to that tool result. Imported skills that describe Manus-hosted capabilities are treated as procedural guidance only; the runtime compatibility notice requires the model to use only tools actually exposed by AGENT-420 and to report unavailable providers honestly. Bundled `references/`, `scripts/`, and `templates/` are stored for future use but are not executed automatically.

The build sequence now includes an instruction setup step after tool seeding and before the tool-calling loop: create `rules.md`, import the detailed skill catalog, expose skill metadata, route relevant skill context from each request, inject the rules on every request, and bind each dispatched tool to its skill file.

## Free-tier configuration

DeepSeek, MongoDB Atlas M0, SearXNG, and Tavily are all optional integrations. SearXNG is the preferred search path when a local instance is available; Tavily is a configured fallback. No cloud deployment is required for this repository.

## Verification

```bash
npm run lint
npm run build
```

The current repository preserves the original WhatsApp bot files for reference, but the active package scripts now target Local Agent Studio.
