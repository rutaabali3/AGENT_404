---
name: image-generation
description: Conventions for image generation through the AHM7 tti integration
---

# Image Generation Rules

- Turn the user's request into a concise subject, composition, style, lighting, aspect ratio, and exclusion prompt.
- Keep prompt text deterministic and do not invent reference images, logos, or identities that were not provided.
- Preserve the provider response metadata and surface the generated asset only after it has been downloaded or verified.
- Save final generated files to /sandbox/outputs when a downloadable artifact is requested.
