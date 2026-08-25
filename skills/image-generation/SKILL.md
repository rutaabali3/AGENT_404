---
name: image-generation
description: Plan and request image creation or editing through a configured local provider, with prompt structure, input-image handling, output validation, and honest capability reporting.
---

# Image generation workflow

Use this skill when the user requests a new image, an edit, an upscale, a restoration, an illustration, a poster, a logo, or visual assets. Separate the user-visible brief from provider parameters. Define subject, action, composition, camera or viewpoint, environment, lighting, palette, typography constraints, aspect ratio, resolution, and exclusions. For iterative edits, preserve the source image and state exactly what must remain unchanged.

## Capability check

AGENT-420 currently exposes a registered image tool but its provider integration may be unavailable. Verify the tool result before claiming an image was generated. Never invent a local image URL, pretend an external model ran, or expose provider credentials. If no provider is configured, provide a refined prompt and state the configuration needed.

## Quality and rights

Avoid requesting copyrighted character replication, deceptive identity manipulation, or unauthorized personal data. Inspect text-heavy images carefully because generated typography can be wrong. Validate MIME type, dimensions, file size, and output location. Keep final assets in `sandbox/outputs` and include a prompt summary and known limitations.

Read `references/prompt-template.md` and the official OpenAI image-generation documentation for provider-neutral concepts.
