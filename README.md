# 🏟️ StadiumIQ — AI-Powered Stadium Operations Platform

StadiumIQ is a state-of-the-art, GenAI-enabled stadium operations command center and attendee assistance platform. Built for high-capacity venues like the **Lusail Iconic Stadium** during the **FIFA World Cup 2026**, StadiumIQ optimizes venue operations and attendee experience through real-time telemetry, predictive crowd models, and automated emergency planning.

---

## 📖 Table of Contents
1. [Project Overview](#1-project-overview)
2. [Problem Statement](#2-problem-statement)
3. [Solution](#3-solution)
4. [Key Features](#4-key-features)
5. [Architecture Diagram](#5-architecture-diagram)
6. [Folder Structure](#6-folder-structure)
7. [System Flows](#7-system-flows)
8. [Installation & Setup](#8-installation--setup)
9. [API Documentation](#9-api-documentation)
10. [Testing & Quality](#10-testing--quality)
11. [Deployment](#11-deployment)
12. [Future Improvements](#12-future-improvements)

---

## 1. Project Overview
This project is built under the **Stadium Operations & Smart Infrastructure** vertical for the FIFA World Cup 2026 Hackathon. It centralizes real-time sensor streams and provides stadium managers with instant operational control and fans with highly contextualized assistance.

---

## 2. Problem Statement
Managing a massive stadium event involves coordinating crowd flow at dozens of gates, monitoring weather conditions, coordinating security and medical responders, and answering thousands of repetitive queries from fans. Legacy systems are siloed and reactive, leading to slow emergency response times and poor fan experiences.

---

## 3. Solution
StadiumIQ bridges this gap by aggregating telemetry (crowd numbers, weather, incident alerts) and feeding it as dynamic context to an AI assistant powered by **NVIDIA NIM APIs**. It creates a unified, real-time command dashboard for operators and a natural language assistant for attendees.

---

## 4. Key Features
- **🤖 AI Fan Assistant**: Real-time natural language answers about seat location, stadium amenities, and rules.
- **👥 Crowd Risk Assessment**: Live gate telemetry analysis with automated, AI-generated gate redirection strategies.
- **🚨 Emergency Response**: Automated action plans generated for fires, medical incidents, and power outages, with persistent audit logging.
- **🌍 Multilingual Broadcasts**: AI-translated announcement scripts in English, Arabic, Spanish, French, Portuguese, Chinese, Japanese, and German.
- **♿ Accessibility Routing**: Step-by-step path planning optimized for wheelchair and visually impaired users.
- **🚉 Transportation Advisory**: Live metro delay monitoring with alternative route rankings.

---

## 5. Architecture Diagram
```
              +-------------------------+
              |      React Frontend     |
              |     (Vite + Tailwind)   |
              +------+------------+-----+
                     |            ^
        HTTP REST    |            |   Socket.io
        Requests     v            |   Realtime Telemetry
              +------+------------+-----+
              |     Node.js Backend     |
              |    (Express Server)     |
              +------+------------+-----+
                     |            |
                     v            v
             Firebase Admin    NVIDIA NIM API
```

---

## 6. Folder Structure
```
StadiumIQ-AI/
├── backend/
│   ├── src/
│   │   ├── config/       # Firebase admin & SDK settings
│   │   ├── controllers/  # Route controller logic
│   │   ├── middleware/   # Helmet, Rate Limits, HPP, Compression
│   │   ├── services/     # OpenAI & NIM wrappers
│   │   ├── utils/        # Telemetry generators
│   │   └── validators/   # Payload schemas
│   └── tests/            # Jest integration suites
└── frontend/
    ├── src/
    │   ├── components/   # Visual elements
    │   ├── context/      # Web Socket states
    │   ├── pages/        # Dashboard, Live view, Chat
    │   └── utils/        # Formatting tools
```

---

## 7. System Flows

### AI Flow
1. Telemetry is collected from gate turnstiles and security logs.
2. Context is merged into strict, descriptive system prompt templates.
3. Prompt is dispatched to NVIDIA NIM API.
4. JSON responses are parsed and delivered to operators.

### Socket.IO Flow
1. Backend maintains a socket namespace.
2. Every 5 seconds, live status metrics are broadcast to connected frontends.
3. Frontends instantly update active graphs and maps without reloading.

---

## 8. Installation & Setup

### Prerequisites
- Node.js >= 18
- Firebase Service Account JSON Credentials
- NVIDIA NIM API Key

### Configuration
Create a `.env` in `backend/` and `frontend/` matching the schema in the root `.env.example` file.

### Backend Startup
```bash
cd backend
npm install
npm run dev
```

### Frontend Startup
```bash
cd frontend
npm install
npm run dev
```

---

## 9. API Documentation
Detailed REST API schemas are documented in [API.md](file:///c:/Users/Admin/Desktop/StadiumIQ-AI/API.md).

---

## 10. Testing & Quality
Run the Jest integration suites with 90%+ coverage:
```bash
cd backend
npm test
```

---

## 11. Deployment
Production builds and configurations are detailed in [DEPLOYMENT.md](file:///c:/Users/Admin/Desktop/StadiumIQ-AI/DEPLOYMENT.md).

---

## 12. Future Improvements
- **Edge Analytics**: Processing live video streams at stadium gates to measure wait times locally.
- **Ticketing Integration**: Syncing ticket barcodes directly to the AI Fan Assistant for personalized seat routing.

---

**Author**: [AdityaP116](https://github.com/AdityaP116)  
**License**: MIT
