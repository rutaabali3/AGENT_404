---
name: filesystem
description: Safe workspace file operations through read_file, write_file, and list_files
---

# Filesystem Rules

- Treat all model-supplied paths as untrusted and keep every operation inside the scoped workspace.
- Use relative workspace paths only; never access host paths, environment files, credentials, or parent directories.
- Read user uploads only through the explicitly provided read-only upload scope when that capability is available.
- Write drafts to workspace and reserve outputs for files that are complete and intentionally delivered.
- Do not delete files, overwrite existing content, or infer a path outside the workspace unless the user explicitly requests a safe in-scope replacement.
