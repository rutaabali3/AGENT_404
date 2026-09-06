# Contributing to Local Agent Studio

Thank you for your interest in contributing to Local Agent Studio. This document provides guidelines and workflows to help you contribute effectively to the project.

---

## Code of Conduct

All contributors are expected to uphold a professional and respectful environment. Please ensure all interactions remain civil, clear, and constructive.

---

## Getting Started

### Prerequisites
- Node.js version 20 or higher
- Docker Desktop with WSL2 backend (for containerized execution)
- Git

### Initial Setup
1. Fork and clone the repository:
   ```bash
   git clone https://github.com/your-username/local-agent-studio.git
   cd local-agent-studio
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Set up environment configuration:
   ```bash
   cp .env.example .env
   ```

4. Build the Docker sandbox image:
   ```bash
   docker build -t local-agent-sandbox -f Dockerfile.sandbox .
   ```

---

## Development Workflow

### Project Structure Overview
- `src/agent-server.ts`: Entry point for Express server and primary API endpoints.
- `src/agent/`: Core agent orchestration, store, generators, and tools.
- `skills/`: Comprehensive skill definitions, reference documents, and guides.
- `rules.md`: Hard security boundaries and system instruction directives.
- `test/`: Integration and unit test suite.

### Available NPM Scripts
- `npm run dev`: Starts the application with live reloading using `tsx`.
- `npm run build`: Compiles TypeScript source files into the `dist/` directory.
- `npm run lint`: Runs TypeScript compiler type-checking without emitting files.
- `npm test`: Runs the test suite using Node's native test runner.

---

## Pull Request Guidelines

1. **Branch Naming**:
   Use descriptive branch names (e.g., `feature/add-new-tool`, `fix/sandbox-timeout`).

2. **Code Style & Quality**:
   - Maintain strict TypeScript types without implicit `any` where possible.
   - Run `npm run lint` and `npm test` before submitting your PR.
   - Ensure no console logs or debugging statements are committed.
   - Maintain the no-emoji policy in codebase documentation and comments.

3. **Submitting Changes**:
   - Create a Pull Request with a clear title and detailed summary of changes.
   - Reference any relevant issues in the PR description.
   - Ensure all automated checks and tests pass.

---

## Reporting Issues

When submitting a bug report or feature request:
- Provide a clear and descriptive title.
- Describe the exact steps to reproduce any bugs.
- Include environment details (Node version, OS, Docker version).
- Include expected vs actual behaviors.

---

## Security Vulnerabilities

If you discover a potential security vulnerability, please report it responsibly by contacting the maintainers directly rather than opening a public issue.
