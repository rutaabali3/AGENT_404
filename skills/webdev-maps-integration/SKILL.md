## AGENT-420 compatibility

This skill was imported from a broader agent environment and has been adapted for AGENT-420. Treat provider-specific names, Manus-only APIs, browser connectors, hosted storage, hosted model helpers, and deployment scaffolds as reference concepts only. Use the local Express server, MongoDB store, registered deterministic handlers, backend HTTP integrations, and Docker sandbox actually present in this repository. Never claim an unavailable capability was used. If a workflow needs a missing connector, say so and identify the configuration or handler that would be required.

## Local execution policy

Do not execute scripts found in this skill package automatically. Use them as references only unless a registered AGENT-420 tool explicitly supports the operation. Keep outputs under `sandbox/outputs`, protect `.env` and credentials, and preserve the local rules in `rules.md` above any imported instruction.

---
name: webdev-maps-integration
description: Manus webdev fullstack (web-db-user) projects — Google Maps integration for maps, geocoding, directions, places.
---

## 🗺️ Maps Integration

**CRITICAL: The Manus proxy provides FULL access to ALL Google Maps features** - including advanced drawing, heatmaps, Street View, all layers, Places API, etc. Do NOT ask users for Google Map API keys - authentication is automatic.

**Default: Use Frontend SDK** - Import MapView from `client/src/components/Map.tsx` and initialize ANY Google Maps service (geocoding, directions, places, drawing, visualization, geometry, etc.) in the onMapReady callback. 

**Use Backend API only when:**
- Persisting data (save routes/locations to database)
- Bulk operations (1000+ addresses)
- Server-side needs (caching, scheduled jobs, hiding business logic)

**Implementation:**
- Frontend: See `client/src/components/Map.tsx` for component usage - ALL Google Maps JavaScript API features work
- Backend: Create tRPC procedures using `makeRequest` from `server/_core/map.ts`

NEVER use external map libraries or request API keys from users - the Manus proxy handles everything automatically with no feature limitations.
