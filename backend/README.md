# StadiumIQ — AI-Powered Stadium Operations Platform

> GenAI-enabled backend for FIFA World Cup 2026 stadium operations at Lusail Iconic Stadium, Qatar.

---

## Tech Stack

| Layer | Technology |
|---|---|
| Runtime | Node.js v20+ |
| Framework | Express.js v5 |
| Database | MongoDB (Mongoose) |
| AI | OpenAI API (gpt-4o-mini) |
| Real-time | Socket.io |
| Security | Helmet, express-rate-limit, CORS |

---

## Quick Start

```bash
# 1. Install dependencies
npm install

# 2. Configure environment
cp .env.example .env
# Edit .env — add MONGO_URI (Atlas) and OPENAI_API_KEY

# 3. Start development server
npm run dev

# 4. Health check
curl http://localhost:3000/health
```

---

## Environment Variables

| Variable | Required | Description |
|---|---|---|
| `PORT` | No | Server port (default: 3000) |
| `NODE_ENV` | No | `development` or `production` |
| `MONGO_URI` | **Yes** | MongoDB Atlas connection string |
| `OPENAI_API_KEY` | **Yes** | OpenAI API key (sk-...) |
| `CLIENT_URL` | No | Frontend URL for CORS (default: *) |

---

## API Reference

### Health
| Method | Endpoint | Description |
|---|---|---|
| GET | `/health` | Server health check |

### AI Fan Assistant
| Method | Endpoint | Description |
|---|---|---|
| POST | `/api/ai/chat` | Natural language fan assistant |

**Request:**
```json
{ "message": "Where is the nearest food court?", "language": "en", "userLocation": "Gate 2" }
```

### Navigation
| Method | Endpoint | Description |
|---|---|---|
| POST | `/api/navigation/route` | Get step-by-step directions |

**Request:**
```json
{ "currentLocation": "Gate 1 Entrance", "destination": "Section NS-C-14" }
```

### Crowd Intelligence
| Method | Endpoint | Description |
|---|---|---|
| POST | `/api/crowd/analyze` | AI crowd analysis & risk assessment |

### Dashboard
| Method | Endpoint | Description |
|---|---|---|
| POST | `/api/dashboard/insight` | AI executive operations report |
| GET | `/api/dashboard/summary` | Live data-only summary (fast) |

### Emergency Response
| Method | Endpoint | Description |
|---|---|---|
| POST | `/api/emergency/respond` | AI emergency response plan |

**Request:**
```json
{ "emergencyType": "medical", "zone": "North Stand", "severity": "Serious", "description": "Fan collapse" }
```

### Announcement Generator
| Method | Endpoint | Description |
|---|---|---|
| POST | `/api/announcement/generate` | Multilingual PA announcements |

**Request:**
```json
{ "type": "crowd_control", "zone": "Gate 3", "message": "Gate 3 is at capacity. Please use Gate 1.", "languages": ["en", "ar"] }
```

### Accessibility
| Method | Endpoint | Description |
|---|---|---|
| POST | `/api/accessibility/assist` | Accessible route & assistance plan |

**Request:**
```json
{ "need": "wheelchair user", "currentLocation": "Main Entrance", "destination": "Section ACC-WC1" }
```

### Transport
| Method | Endpoint | Description |
|---|---|---|
| POST | `/api/transport/recommend` | Ranked transport recommendations |

**Request:**
```json
{ "userLocation": "Stadium Main Exit", "destination": "Doha city center" }
```

### Sustainability
| Method | Endpoint | Description |
|---|---|---|
| POST | `/api/sustainability/tips` | Eco-friendly recommendations |

**Request:**
```json
{ "targetAudience": "fans", "specificConcern": "plastic waste" }
```

### Live Status
| Method | Endpoint | Description |
|---|---|---|
| GET | `/api/live/status` | Simulated live stadium metrics |

---

## Socket.io

Connect to `ws://localhost:3000` and listen for:

| Event | Frequency | Description |
|---|---|---|
| `stadium-update` | Every 10s | Full live stadium status snapshot |
| `crowd-alert` | On CRITICAL | Alert when capacity is critical |

**Example (browser):**
```js
const socket = io('http://localhost:3000');
socket.on('stadium-update', (data) => console.log(data));
socket.on('crowd-alert', (alert) => console.warn(alert));
```

---

## Project Structure

```
backend/
├── server.js                 # Entry point — boots HTTP + Socket.io + DB
├── .env                      # Environment variables (git-ignored)
├── .env.example              # Template
└── src/
    ├── app.js                # Express app — middleware + routes
    ├── config/
    │   └── db.js             # MongoDB connection
    ├── constants/
    │   └── index.js          # Centralized constants
    ├── controllers/          # Thin controllers (10 files)
    ├── middleware/
    │   ├── errorHandler.js   # AppError class + global error handler
    │   ├── validate.js       # Validation middleware factory
    │   └── rateLimiter.js    # General + AI rate limiters
    ├── models/               # 6 Mongoose models
    ├── prompts/              # 9 AI prompt builders
    ├── routes/               # 11 route files
    ├── services/
    │   ├── openai.service.js # Single OpenAI client (lazy-init, retry)
    │   └── *.service.js      # 9 feature services
    ├── socket/
    │   └── socket.js         # Socket.io broadcaster
    ├── utils/
    │   ├── asyncWrapper.js
    │   ├── fakeDataGenerator.js
    │   ├── logger.js
    │   ├── responseHandler.js
    │   ├── seatData.js
    │   └── stadiumData.js
    └── validators/           # 5 request validators
```

---

## Standard Response Format

**Success:**
```json
{ "success": true, "message": "...", "data": {} }
```

**Error:**
```json
{ "success": false, "message": "...", "errors": [] }
```

---

## Architecture

```
Routes → Controllers → Services → OpenAI / MongoDB
              ↓
         Validators
              ↓
         Middleware (Error, Rate Limit, Auth)
```

- **Routes**: Register path + middleware chain
- **Controllers**: Validate input → call service → send response (thin, ~10 lines)
- **Services**: All business logic, DB writes, AI calls
- **Prompts**: Centralized prompt engineering (never in controllers)
- **OpenAI Service**: Single lazy client, retry logic, JSON mode support
