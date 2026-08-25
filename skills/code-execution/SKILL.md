---
name: code-execution
description: Run Python and Node.js code through the local Docker sandbox with explicit files, tests, resource limits, and honest execution reporting.
---

# Local code execution workflow

Use this skill whenever the user asks the agent to write, run, debug, test, or transform code. Treat the model as an orchestrator: inspect the scoped workspace, decide what files are needed, write source code with filesystem tools, execute only through the registered sandbox tool, inspect stdout and stderr, and iterate until the requested result is verified.

## Execution contract

Use `execute_python` for Python and `execute_node` for Node.js. Submit complete, self-contained code or a clear entry point. Prefer deterministic scripts over opaque one-liners. Keep source drafts in `sandbox/workspace` and final artifacts in `sandbox/outputs`. Never execute model-produced code directly on the host and never claim success without a tool result.

## Security and reproducibility

The backend runs the code in an ephemeral Docker container with no network, a read-only root filesystem, a non-root UID, CPU and memory limits, and narrowly scoped mounts. These controls reduce exposure but do not make arbitrary code safe. Do not attempt privilege escalation, host inspection, secret discovery, package installation from the network, Docker socket access, or access outside the mounted directories. If a dependency is unavailable, explain the limitation instead of bypassing the boundary.

## Coding workflow

First restate the goal as inputs, outputs, constraints, and acceptance checks. Next inspect available files. Then write the smallest maintainable implementation, run it, inspect failures, and make targeted corrections. For non-trivial code, create a smoke test or unit test and run it inside the sandbox. Preserve useful error messages and return generated file paths, not only console output.

For data work, validate input shape, encoding, missing values, numeric types, and output schema. For web or API code, remember that sandbox networking is disabled; use the backend web tools before execution when current external data is required. For file generation, use the deterministic document tools instead of asking code execution to reimplement a format.

## Completion checklist

Confirm the command exited as expected, review stderr, verify every requested output exists and is non-empty, remove temporary files, and summarize what ran, what changed, and any unverified assumptions. Read `references/sandbox-contract.md` for the exact local boundary and `references/coding-checklist.md` for the iteration checklist.
