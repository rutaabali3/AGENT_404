---
name: video-download
description: Download authorized public video or audio with yt-dlp through controlled output templates, format selection, metadata reporting, and safe file handling.
---

# Video download workflow

Use `download_video` only when the user is authorized to save the media and the source terms permit it. Validate the URL, clarify whether video, audio, subtitles, metadata, or a specific format is needed, and avoid playlists unless explicitly requested. Use a controlled output template under `sandbox/outputs`; never write arbitrary paths supplied by the model.

Prefer the local yt-dlp executable. Select formats deliberately, explain codec and container tradeoffs, and use ffmpeg for post-processing only when installed and explicitly needed. Record provider, title, extension, size, and errors. Do not bypass authentication, DRM, paywalls, geo-restrictions, or access controls.

The download occurs in the backend because the Docker code sandbox has no network. Validate the output exists and is non-empty, remove partial files on failure, and report when yt-dlp is missing. Read `references/download-policy.md` and the official yt-dlp and FFmpeg documentation before advanced work.
