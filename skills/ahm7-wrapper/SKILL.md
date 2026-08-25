---
name: ahm7-wrapper
description: Conventions for calling centralized AHM7 adapter functions
---

# AHM7 Wrapper Rules

- Call AHM7 only through the centralized wrapper module; do not construct ad hoc provider requests in individual tools.
- Validate required inputs before making a request and preserve the provider's response shape in the tool result.
- If an endpoint is unavailable, rate-limited, blocked, or returns an unknown shape, report that plainly and do not silently substitute fabricated output.
- Keep provider-specific paths, headers, and fallback behavior inside the wrapper so endpoint changes have one maintenance point.
