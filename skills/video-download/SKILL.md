---
name: video-download
description: Conventions for downloading videos with the self-hosted yt-dlp integration
---

# Video Download Rules

- Prefer the local yt-dlp executable rather than the AHM7 fallback endpoint.
- Validate the URL before dispatch and save only the explicitly requested final media file to /sandbox/outputs.
- Never use the sandbox for downloading; the sandbox has no network. Perform the download in the deterministic backend and pass only the resulting file metadata forward.
- Report format, quality, destination, and provider errors clearly. Do not bypass access controls or download content the user is not authorized to save.
