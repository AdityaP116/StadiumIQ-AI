# API Reference

The StadiumIQ backend provides several REST API categories.

## Authentication
All requests under `/api/users/*` require a `Bearer <token>` Authorization header.

## Endpoints

### 1. General & Live Diagnostics
- **GET /**: Welcome check.
- **GET /health**: Operational system diagnostic check.
- **GET /api/live/status**: Live simulated weather, gate wait times, security state, and active medical incidents.

### 2. AI Operational Services
- **POST /api/ai/chat**: Direct fan assistance chatbot.
  - Body: `{ "message": "string", "language": "en|ar|es|..." }`
- **POST /api/crowd/analyze**: AI crowd analysis and gate diversion strategy.
  - Body: `{ "gateId": "string", "currentOccupancy": number }`
- **POST /api/emergency/respond**: Generates action protocols for medical, fires, power loss, and logs for audits.
  - Body: `{ "emergencyType": "string", "zone": "string", "severity": "string" }`
- **POST /api/announcement/generate**: Translates public service announcements to foreign scripts.
  - Body: `{ "type": "string", "zone": "string", "message": "string", "languages": [] }`
- **POST /api/transport/recommend**: Live ranking of transport lines based on current station congestion.
- **POST /api/accessibility/assist**: Plan specialized assistance routes.
- **POST /api/sustainability/tips**: Eco-friendly stadium operations advice.
