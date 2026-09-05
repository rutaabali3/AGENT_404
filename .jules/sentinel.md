# Sentinel Journal - Security Learnings

## 2025-03-09 - SSRF Prevention in Agent Web Fetch Tool
**Vulnerability:** The `web.fetch` tool accepted arbitrary URLs without scheme or hostname validation, allowing SSRF attacks targeting local services (`http://localhost:8787`), cloud metadata endpoints (`http://169.254.169.254`), private network devices (`10.0.0.0/8`, `192.168.0.0/16`), or arbitrary local files via `file://`.
**Learning:** AI agent tools that fetch web content directly using HTTP clients (like `axios`) must strictly validate URL protocols and restrict IP ranges to prevent agents from being tricked into querying local/internal services or exfiltrating cloud metadata.
**Prevention:** Validate that URL protocols are restricted to `http:` and `https:`, and block local/loopback, private IPv4 address spaces (`10.x.x.x`, `172.16-31.x.x`, `192.168.x.x`), and link-local/cloud metadata IPs (`169.254.x.x`).
