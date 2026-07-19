# StadiumIQ Architecture

This document describes the high-level architecture of StadiumIQ.

## Overview
StadiumIQ uses a client-server architecture with real-time updates and generative AI processing.

```
+-------------------------------------------------+
|                    Client                       |
|               (React + Vite)                    |
+-----------------------+-------------------------+
                        | HTTP / Socket.io
                        v
+-------------------------------------------------+
|                    Server                       |
|              (Node.js + Express)                |
+------------------+---------------+--------------+
                   |               |
                   v               v
           Firebase SDK     NVIDIA NIM API
```

## Flow Definitions
- **Frontend Flow**: React components connect to endpoints and establish Socket.io listeners to dynamically update the live dashboard without page refreshes.
- **Backend Flow**: Incoming requests pass through security limiters, validation layers, and routes before invoking core operational logic.
- **Firebase Flow**: Persists audit logs for emergencies, crowd operations summaries, and handles Firebase Auth token verification.
- **AI Flow**: Calls NVIDIA NIM model endpoints with curated context templates containing current live operational metrics to prevent hallucinations.
