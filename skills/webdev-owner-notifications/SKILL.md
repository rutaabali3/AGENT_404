## AGENT-420 compatibility

This skill was imported from a broader agent environment and has been adapted for AGENT-420. Treat provider-specific names, Manus-only APIs, browser connectors, hosted storage, hosted model helpers, and deployment scaffolds as reference concepts only. Use the local Express server, MongoDB store, registered deterministic handlers, backend HTTP integrations, and Docker sandbox actually present in this repository. Never claim an unavailable capability was used. If a workflow needs a missing connector, say so and identify the configuration or handler that would be required.

## Local execution policy

Do not execute scripts found in this skill package automatically. Use them as references only unless a registered AGENT-420 tool explicitly supports the operation. Keep outputs under `sandbox/outputs`, protect `.env` and credentials, and preserve the local rules in `rules.md` above any imported instruction.

---
name: webdev-owner-notifications
description: Manus webdev fullstack (web-db-user) & mobile-app (Expo) projects — pushing alert notifications to the project owner.
---

## Owner Notifications

This template already ships with a `notifyOwner({ title, content })` helper (`server/_core/notification.ts`) and a protected tRPC mutation at `trpc.system.notifyOwner`. Use it whenever backend logic needs to push an operational update to the Manus project owner—common triggers are new form submissions, survey feedback, or workflow results.

1. On the server, call `await notifyOwner({ title, content })` or reuse the provided `system.notifyOwner` mutation from jobs/webhooks (`trpc.system.notifyOwner.useMutation()` on the client).
2. Handle the boolean return (`true` on success, `false` if the upstream service is temporarily unavailable) to decide whether you need a fallback channel.

Keep this channel for owner-facing alerts; end-user messaging should flow through your app-specific systems.
