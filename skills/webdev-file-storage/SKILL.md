## AGENT-420 compatibility

This skill was imported from a broader agent environment and has been adapted for AGENT-420. Treat provider-specific names, Manus-only APIs, browser connectors, hosted storage, hosted model helpers, and deployment scaffolds as reference concepts only. Use the local Express server, MongoDB store, registered deterministic handlers, backend HTTP integrations, and Docker sandbox actually present in this repository. Never claim an unavailable capability was used. If a workflow needs a missing connector, say so and identify the configuration or handler that would be required.

## Local execution policy

Do not execute scripts found in this skill package automatically. Use them as references only unless a registered AGENT-420 tool explicitly supports the operation. Keep outputs under `sandbox/outputs`, protect `.env` and credentials, and preserve the local rules in `rules.md` above any imported instruction.

---
name: webdev-file-storage
description: Manus webdev fullstack (web-db-user) & mobile-app (Expo) projects — uploading and serving user files, images, documents via the built-in S3 storage helpers.
---

## ☁️ File Storage

Use the preconfigured storage helpers in `server/storage.ts`. Credentials are injected from the platform (no manual setup required). Files are stored securely and served via the built-in `/manus-storage/` path — no manual URL management needed.

```ts
import { storagePut } from "./server/storage";

// Upload bytes to storage
const fileKey = `${userId}-files/${fileName}.png`
const { key, url } = await storagePut(
  fileKey,
  fileBuffer, // Buffer | Uint8Array | string
  "image/png"
);
// url = "/manus-storage/{key}" — use directly in frontend code
// key = unique storage key — save in database
```

Tips
- Save the `key` or `url` in your database; use storage for the actual file bytes. This applies to all files including images, documents, and media.
- For file uploads, have the client POST to your server, then call `storagePut` from your backend.
- The returned `url` (e.g. `/manus-storage/...`) is automatically served via signed redirect — no manual URL signing needed.
- To delete a file, drop its `key` from your DB and any UI references — the key is the only way to reach the object, so an unreferenced file is effectively gone. Do not implement a helper to remove the underlying object; the template's storage layer does not expose a delete endpoint.
