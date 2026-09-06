<div align="center">

# LOCAL AGENT STUDIO

**Local-First, Secure, Extensible AI Agent Execution Framework**

[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](LICENSE)
[![Node.js](https://img.shields.io/badge/Node.js-v20%2B-brightgreen.svg)](https://nodejs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.9-blue.svg)](https://www.typescriptlang.org/)
[![Docker](https://img.shields.io/badge/Docker-Containerized-blue.svg)](https://www.docker.com/)
[![Express](https://img.shields.io/badge/Express-5.1-lightgrey.svg)](https://expressjs.com/)
[![DeepSeek](https://img.shields.io/badge/Reasoning-DeepSeek-orange.svg)](https://www.deepseek.com/)

---

[Quick Start](#quick-start) • [Architecture](#architecture) • [API Reference](#api-reference) • [Tool Registry](#tool-and-skill-system) • [Configuration](#configuration) • [Security](#security-and-isolation)

---

</div>

## Overview

**Local Agent Studio** is an enterprise-grade, local-first general-purpose AI agent workstation powered by DeepSeek reasoning models, Express server middleware, and Docker-isolated code execution environments.

Engineered specifically for local workstation deployment, Local Agent Studio provides strong security guarantees by isolating untrusted generated code within unprivileged, network-isolated Docker containers while exposing a rich suite of local media generation, web search, document processing, and system manipulation tools.

---

## Highlights & Capability Matrix

| Capability Category | Feature Description | Security & Execution Model |
| :--- | :--- | :--- |
| **Reasoning Engine** | DeepSeek Reasoner integration with live streaming thoughts | Direct API connection; no host execution |
| **Sandboxed Code Execution** | Python 3 and Node.js code execution in ephemeral containers | Read-only root filesystem, no network access, 1GB RAM limit |
| **Document Generation** | Deterministic PDF, DOCX, XLSX, and PPTX report generation | Native Node.js stream builders inside workspace |
| **Persistence Layer** | MongoDB Atlas or Local MongoDB session & tool history store | In-memory fallback available automatically |
| **Web Search & Mining** | SearXNG and Tavily web extraction fallbacks | Validated SSRF-protected http(s) fetch engine |
| **Skill & Rule System** | Instruction layer via `rules.md` and progressive disclosure | Rules enforced on every system prompt context |

---

## Architecture

```
+-------------------------------------------------------------------------+
|                           BROWSER DASHBOARD                             |
|                        http://127.0.0.1:8787                            |
+-------------------------------------------------------------------------+
                                     |
                                     v
+-------------------------------------------------------------------------+
|                        EXPRESS SERVER / API                             |
|  - System Instruction Engine (rules.md)                                |
|  - Tool & Skill Dispatch Registry                                       |
|  - MongoDB Persistence / In-Memory Store                                |
+-------------------------------------------------------------------------+
          |                                            |
          v                                            v
+-------------------+                        +-------------------+
|  DEEPSEEK API     |                        | DOCKER SANDBOX    |
|  Reasoning Loop   |                        | - Ephemeral container
|  Tool Invocation  |                        | - Read-only root  |
|  Structured Schema|                        | - Isolated net    |
+-------------------+                        +-------------------+
```

---

## Interactive Details & Features

<details>
<summary><b>1. Docker Security & Isolation Model</b></summary>

<br>

Local Agent Studio strictly prevents arbitrary code execution on host machines by isolating all model-generated code inside disposable Docker containers.

* **Read-Only Root Filesystem**: Prevents permanent container modifications or rootkit installations.
* **Network Isolation**: Disabled container networking prevents data exfiltration and unauthorized network requests.
* **Resource Quotas**: Strict memory cap (1024 MB) and single CPU core allocation prevent resource exhaustion.
* **Strict Mount Scoping**: Only three dedicated directories are bound:
  * Read-only uploads (`sandbox/uploads`)
  * Writable workspace (`sandbox/workspace`)
  * Output directory (`sandbox/outputs`)
* **Path Traversal Shield**: Filesystem access algorithms sanitize and reject relative path traversals (`../`).

</details>

<details>
<summary><b>2. System Rules & Skill Injection Layer</b></summary>

<br>

The runtime architecture separates tool capabilities from execution guidance through a multi-tier instruction pipeline:

1. **Rule File (`rules.md`)**: Enforces hard system boundaries, identity guidelines, credential security, and network constraints across every single message exchange.
2. **Progressive Disclosure**: Detailed skill context (located under `skills/`) is dynamically selected based on user input and injected into the model payload when relevant tools are invoked.
3. **Compatibility Layer**: Manus-hosted or external third-party skill definitions are automatically converted to Local Agent Studio compatibility standards, ensuring clear failure reporting for unconfigured services.

</details>

<details>
<summary><b>3. Document Generation Suite</b></summary>

<br>

Local Agent Studio features native server-side document synthesis engines:

* **PDF Documents**: Built using `pdfkit` for precise layout control, custom styling, and structured pagination.
* **Word Documents (`.docx`)**: Constructed via `docx` with table, header, bullet list, and style support.
* **Excel Spreadsheets (`.xlsx`)**: Generated through `exceljs` supporting multi-sheet workbooks and formula formatting.
* **PowerPoint Presentations (`.pptx`)**: Assembled via `pptxgenjs` with slide themes, shapes, text frames, and layout templates.

</details>

---

## Quick Start

### Prerequisites
- **Node.js**: Version 20.0.0 or higher
- **Docker Desktop**: Running with WSL2 backend (for Windows) or native Docker engine (Linux/macOS)
- **MongoDB** (Optional): Local instance or MongoDB Atlas M0 free tier for persistent sessions

### Installation & Run

1. **Clone and Install Dependencies**:
   ```bash
   git clone https://github.com/your-org/local-agent-studio.git
   cd local-agent-studio
   npm install
   ```

2. **Configure Environment Variables**:
   ```bash
   cp .env.example .env
   ```
   Edit `.env` to add your `DEEPSEEK_API_KEY` and optional database/search credentials.

3. **Build the Sandbox Image**:
   ```bash
   docker build -t local-agent-sandbox -f Dockerfile.sandbox .
   ```

4. **Build and Launch Application**:
   ```bash
   npm run build
   npm run dev
   ```

5. **Access Dashboard**:
   Open browser at `http://127.0.0.1:8787`.

---

## API Reference

<details>
<summary><b>View Endpoint Documentation</b></summary>

<br>

### Base URL: `http://127.0.0.1:8787`

| Endpoint | Method | Description | Request Payload | Response |
| :--- | :--- | :--- | :--- | :--- |
| `/api/health` | `GET` | Health check and environment status | None | `{ status: "ok", timestamp: "..." }` |
| `/api/chat` | `POST` | Primary conversation endpoint | `{ message: string, sessionId?: string }` | Server-Sent Events / JSON response |
| `/api/tools` | `GET` | Fetch registered tools and status | None | `[ { name: string, enabled: boolean } ]` |
| `/api/tools/:name` | `PUT` | Enable or disable specific tool | `{ enabled: boolean }` | `{ success: true, tool: object }` |
| `/api/system/skills` | `GET` | Retrieve installed skill catalog | None | `[ { id: string, description: string } ]` |

</details>

---

## Tool and Skill System

Local Agent Studio ships with an extensive catalog of pre-configured tools categorized into core operations:

```
skills/
├── automation/          # Workflow & process automation
├── code-execution/      # Docker-isolated Python & Node.js execution
├── docx/                # Word document creation
├── pdf/                 # PDF report compilation
├── xlsx/                # Excel sheet generation
├── pptx/                # PowerPoint deck creation
├── filesystem/          # Safe workspace file manipulations
├── image-generation/    # Vision & image synthesis wrappers
├── web-search/          # SearXNG & Tavily search integration
└── ahm7-wrapper/        # Extensible API connector inventory
```

---

## Configuration

Local Agent Studio is configured via environment variables defined in `.env`:

```env
# Server Configuration
PORT=8787
HOST=127.0.0.1
LOCAL_AGENT_API_KEY=your_local_secret_key_here

# AI Model Credentials
DEEPSEEK_API_KEY=your_deepseek_api_key_here
DEEPSEEK_MODEL=deepseek-reasoner

# Database Persistence (Optional)
MONGODB_URI=mongodb://localhost:27017/local_agent_studio

# Web Search Providers (Optional)
SEARXNG_URL=http://localhost:8080
TAVILY_API_KEY=your_tavily_api_key_here

# Docker Sandbox Settings
SANDBOX_IMAGE=local-agent-sandbox
SANDBOX_MEMORY_LIMIT=1024m
```

---

## Verification & Testing

Execute code quality checks and unit test suites:

```bash
# Type check TypeScript code
npm run lint

# Execute native unit tests
npm test

# Build production bundle
npm run build
```

---

## Contributing

Contributions are welcome. Please read our [CONTRIBUTING.md](CONTRIBUTING.md) guide for details on repository structure, code standards, and pull request procedures.

---

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.
