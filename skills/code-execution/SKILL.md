---
name: code-execution
description: Conventions for using execute_python/execute_node inside the sandbox
---

# Code Execution Rules

- Always write working/draft files to /sandbox/workspace, never assume any other path is writable.
- Only copy a file to /sandbox/outputs when it is the final, complete deliverable — never partial or draft output.
- Never assume network access — the sandbox has none. If external data is needed, it must already exist in /sandbox/workspace (placed there by a backend tool like web_fetch before code execution runs) — do not attempt requests.get(), fetch(), or similar inside sandboxed code.
- Keep scripts single-purpose and short-lived; the container may be torn down between calls, so do not rely on in-memory state persisting across execute_python calls — persist anything needed via files in workspace/.
- Catch and surface errors clearly (print tracebacks) rather than failing silently.
