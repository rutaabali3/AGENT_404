---
name: ahm7-wrapper
description: Use the registered AHM7 provider boundary for external integrations while enforcing local capability checks, explicit credentials, schema validation, and honest failure reporting.
---

# External provider wrapper workflow

Treat every AHM7 entry as a provider boundary, not as an implementation guarantee. Before dispatch, identify the exact operation, required credentials, request schema, response shape, privacy impact, and whether the user authorized the action. Validate inputs and redact secrets from logs. Use only the registered handler for the selected operation.

AGENT-420 currently registers many AHM7-compatible names, but unsupported provider operations return a configuration error. Never claim that an integration ran when the tool result says it is unavailable. Do not silently substitute a different provider. For external side effects such as uploads, messages, account changes, or paid actions, require explicit confirmation immediately before execution.

Read `references/provider-contract.md` for the wrapper contract and `references/side-effect-policy.md` for confirmation and privacy requirements.
