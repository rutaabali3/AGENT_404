## AGENT-420 compatibility

This skill was imported from a broader agent environment and has been adapted for AGENT-420. Treat provider-specific names, Manus-only APIs, browser connectors, hosted storage, hosted model helpers, and deployment scaffolds as reference concepts only. Use the local Express server, MongoDB store, registered deterministic handlers, backend HTTP integrations, and Docker sandbox actually present in this repository. Never claim an unavailable capability was used. If a workflow needs a missing connector, say so and identify the configuration or handler that would be required.

## Local execution policy

Do not execute scripts found in this skill package automatically. Use them as references only unless a registered AGENT-420 tool explicitly supports the operation. Keep outputs under `sandbox/outputs`, protect `.env` and credentials, and preserve the local rules in `rules.md` above any imported instruction.

---
name: webdev-data-api
description: Manus webdev fullstack (web-db-user) & mobile-app (Expo) projects — fetching external data via the Manus API Hub.
---

## ☁️ Data API

When you need external data, use the omni_search with search_type = 'api' to see there's any built-in api available in Manus API Hub access. You only have to connect other api if there's no suitable built-in api available.
