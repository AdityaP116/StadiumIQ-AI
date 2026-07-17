/**
 * StadiumIQ — Axios API Instance
 *
 * Single, configured Axios instance for all backend requests.
 * Features:
 *  - Base URL from environment
 *  - Request interceptor: auto-attaches Firebase ID token as Bearer
 *  - Response interceptor: normalizes errors to { message, errors }
 *  - 401 handling: redirects to /login
 */

import axios from 'axios';
import { auth } from './firebase';
import { API_BASE_URL } from '@constants';

// ─── Create Instance ──────────────────────────────────────────────────────────
const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 30_000,          // 30s — AI endpoints can take a moment
  headers: {
    'Content-Type': 'application/json',
  },
});

// ─── Request Interceptor — Attach Firebase Token ──────────────────────────────
api.interceptors.request.use(
  async (config) => {
    try {
      const user = auth.currentUser;
      if (user) {
        const token = await user.getIdToken();
        config.headers.Authorization = `Bearer ${token}`;
      }
    } catch {
      // Silently ignore — unauthenticated endpoints will still work
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// ─── Response Interceptor — Normalize Errors ─────────────────────────────────
api.interceptors.response.use(
  // Success: return response as-is
  (response) => response,

  // Error: normalize to a consistent shape
  (error) => {
    const status  = error.response?.status;
    const data    = error.response?.data;

    // 401 — clear auth state and redirect to login
    if (status === 401) {
      auth.signOut().catch(() => {});
      window.location.replace('/login');
      return Promise.reject(error);
    }

    // Surface the backend error shape to callers
    // Backend always returns: { success: false, message: string, errors: string[] }
    const normalizedError = new Error(
      data?.message || error.message || 'An unexpected error occurred.'
    );
    normalizedError.status  = status;
    normalizedError.errors  = data?.errors || [];
    normalizedError.isAxios = true;

    return Promise.reject(normalizedError);
  }
);

export default api;
