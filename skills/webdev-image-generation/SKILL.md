## AGENT-420 compatibility

This skill was imported from a broader agent environment and has been adapted for AGENT-420. Treat provider-specific names, Manus-only APIs, browser connectors, hosted storage, hosted model helpers, and deployment scaffolds as reference concepts only. Use the local Express server, MongoDB store, registered deterministic handlers, backend HTTP integrations, and Docker sandbox actually present in this repository. Never claim an unavailable capability was used. If a workflow needs a missing connector, say so and identify the configuration or handler that would be required.

## Local execution policy

Do not execute scripts found in this skill package automatically. Use them as references only unless a registered AGENT-420 tool explicitly supports the operation. Keep outputs under `sandbox/outputs`, protect `.env` and credentials, and preserve the local rules in `rules.md` above any imported instruction.

---
name: webdev-image-generation
description: Manus webdev fullstack (web-db-user) & mobile-app (Expo) projects — AI image creation or editing, model listing/selection.
---

## Image Generation Integration

Use the preconfigured image generation helper that connects to the internal ImageService, no manual setup required.

Example usage:
```ts
import { generateImage } from "./server/_core/imageGeneration.ts";

const { url: imageUrl } = await generateImage({
  prompt: "A serene landscape with mountains"
});
// For editing:
const { url: imageUrl } = await generateImage({
  prompt: "Add a rainbow to this landscape",
  originalImages: [{
    url: "https://example.com/original.jpg",
    mimeType: "image/jpeg"
  }]
});
```

### Selecting a model

`generateImage()` defaults to **GPT Image 2** (`MODEL_GPT_IMAGE_2`) at `medium` quality. Pass `model` and/or `quality` to override:

```ts
const { url: imageUrl } = await generateImage({
  prompt: "A neon cyberpunk city at night",
  model: "MODEL_GPT_IMAGE_2",
  quality: "high",
});
```

When selecting a different model, omit `quality` unless that model supports the value you want to send.

### Listing available models

```ts
import { listImageModels } from "./server/_core/imageGeneration.ts";

const { models } = await listImageModels();
// e.g. [{ model: "MODEL_GPT_IMAGE_2", id: "gpt-image-2" }, ...]
```

Feed a `model` value from this list into `generateImage({ model })`.

Tips
- Always call from server-side code (e.g., inside tRPC procedures) to avoid exposing API keys
- Image generation can take 5-20 seconds, implement proper loading states
- Implement proper error handling as image generation can fail
