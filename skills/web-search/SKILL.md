---
name: web-search
description: Conventions for web search through SearXNG and Tavily
---

# Web Search Rules

- Use local SearXNG first because it avoids API keys and monthly limits.
- Use Tavily only when SearXNG is unavailable or when its configured result quality is insufficient.
- Form queries with the user's core subject plus the needed time, geography, or format constraint; avoid stuffing unrelated intents into one query.
- Return a small, relevant result set and preserve title, URL, and snippet so the model can cite or summarize accurately.
