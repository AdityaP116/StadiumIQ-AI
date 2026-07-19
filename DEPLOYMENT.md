# Deployment Instructions

This guide provides steps for deploying the production build.

## Backend Deployment (e.g., Render)
1. Ensure all environment secrets (`FIREBASE_PROJECT_ID`, `FIREBASE_CLIENT_EMAIL`, `FIREBASE_PRIVATE_KEY`, `NVIDIA_API_KEY`) are set up in the hosting service's environment dashboard.
2. The server spins up using `npm start` which runs `server.js` on port `3000` (or the dynamic `$PORT`).

## Frontend Deployment (e.g., Vercel)
1. Build the production assets:
   ```bash
   npm run build
   ```
2. The production files in `dist/` can be served directly. Ensure `VITE_API_URL` points to your production backend.
