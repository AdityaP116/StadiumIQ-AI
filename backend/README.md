# StadiumIQ — AI-Powered Stadium Operations Platform

> GenAI-enabled backend for FIFA World Cup 2026 stadium operations at Lusail Iconic Stadium, Qatar.

---

## Tech Stack

| Layer | Technology |
|---|---|
| Runtime | Node.js v20+ |
| Framework | Express.js v5 |
| Database | Firebase Firestore |
| Auth | Firebase Authentication |
| AI | Google Gemini API (gemini-2.0-flash) |
| Real-time | Socket.io |
| Security | Helmet, express-rate-limit, CORS |

---

## Quick Start

```bash
# 1. Install dependencies
npm install

# 2. Configure environment
cp .env.example .env
# Edit .env — add GEMINI_API_KEY and Firebase Service Account credentials

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
| `FIREBASE_PROJECT_ID` | **Yes** | Firebase project ID |
| `FIREBASE_CLIENT_EMAIL` | **Yes** | Firebase service account email |
| `FIREBASE_PRIVATE_KEY` | **Yes** | Firebase private key (with \n) |
| `GEMINI_API_KEY` | **Yes** | Google Gemini API key |
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

### User Profile (Protected)
| Method | Endpoint | Description |
|---|---|---|
| GET | `/api/users/profile` | Get authenticated user profile |
| PUT | `/api/users/profile` | Update user profile |
*(Requires `Authorization: Bearer <Firebase_ID_Token>`)*

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
    │   └── firebase.js       # Firebase Admin initialization
    ├── constants/
    │   └── index.js          # Centralized constants
    ├── controllers/          # Thin controllers
    ├── middleware/
    │   ├── auth.middleware.js# Firebase JWT token verifier
    │   ├── errorHandler.js   # AppError class + global error handler
    │   ├── validate.js       # Validation middleware factory
    │   └── rateLimiter.js    # General + AI rate limiters
    ├── prompts/              # AI prompt builders
    ├── routes/               # API route definitions
    ├── services/
    │   ├── openai.service.js # Single Gemini AI client (lazy-init, retry)
    │   └── *.service.js      # Feature business logic + Firestore operations
    ├── socket/
    │   └── socket.js         # Socket.io broadcaster
    ├── utils/
    │   ├── asyncWrapper.js
    │   ├── fakeDataGenerator.js
    │   ├── logger.js
    │   ├── responseHandler.js
    │   ├── seatData.js
    │   └── stadiumData.js
    └── validators/           # Request input validators
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
Routes → Controllers → Services → Gemini API / Firestore
              ↓
         Validators
              ↓
         Middleware (Error, Rate Limit, Auth)
```

- **Routes**: Register path + middleware chain
- **Controllers**: Validate input → call service → send response (thin)
- **Services**: All business logic, Firestore writes, AI calls
- **Prompts**: Centralized prompt engineering (never in controllers)
- **AI Service**: Single lazy client, exponential backoff, JSON mode support
