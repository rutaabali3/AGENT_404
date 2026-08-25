# Reserved Hosting Reference

Reserved Hosting is a deployment add-on for an existing WebDev project — not a migration. This swaps the default stateless Autoscale (Cloud Run) backend for a managed reserved instance (1 vCPU, 512 MB RAM) that runs a single persistent process 24/7.

## What It Enables

A long-lived event loop that the default Autoscale (Cloud Run) backend cannot provide:
- Maintaining outbound WebSocket/SSE subscriptions
- Running background queue workers
- Polling APIs at sub-minute intervals
- Holding lightweight in-memory state (game rooms, CRDT docs)
- Executing tasks that exceed Autoscale (Cloud Run)'s 15-minute per-request timeout

## Limitations

- **Throttled under heavy load:** the service stays up, but response times degrade as load increases.
- **Fixed, capped resources:** the instance is limited to 1 vCPU and 512 MB RAM, with no GPU. Workloads that need more compute or memory, a GPU, or full control of the machine should run on a Cloud Computer (Persistent Sandbox) instead — see `cloud-computer-reference.md`.

## Pricing

Monthly billing for the default config (1 vCPU + 0.5 GB RAM, running 24/7). **All costs are usage-based, not flat fees** — CPU and RAM are metered on actual consumption, and egress on actual transfer. The figures below are upper bounds, assuming the full allocation is consumed continuously 24/7; actual cost depends on real usage and is typically lower.

Rates already include the 1.5× multiplier.

| Line item | Rate | Max monthly cost (full 24/7 use) |
|---|---|---|
| CPU | $30 / vCPU·mo | $30.00 (1 vCPU) |
| RAM | $15 / GB·mo | $7.50 (0.5 GB) |
| **Total compute** | | **up to $37.50/mo** |
| Egress | $0.075 / GB | usage-based |
| Volume (if needed) | $0.24 / GB·mo | ~$0.12/mo for 0.5 GB |

Egress and volume are billed on top of compute, both metered on actual usage.

WebDev includes $10 of free usage-billing credits per month, which are deducted from these charges before any out-of-pocket cost applies.

The cost must be communicated to the user before enabling Reserved Hosting: present it as usage-based (the per-unit rates and the ~$37.50/mo full-utilization ceiling, less the $10 monthly credit), not as a flat charge.
