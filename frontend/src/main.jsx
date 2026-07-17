/**
 * StadiumIQ — main.jsx
 * Application entry point.
 * Wraps the app with all providers in the correct order.
 */

import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { RouterProvider } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import { Toaster } from 'react-hot-toast';

import { AuthProvider }   from './context/AuthContext';
import { SocketProvider } from './context/SocketContext';
import router             from './routes/router';

import './styles/globals.css';

// ─── TanStack Query Client ────────────────────────────────────────────────────
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry:                1,
      refetchOnWindowFocus: false,
      staleTime:            30_000,
    },
    mutations: {
      retry: 0,
    },
  },
});

// ─── Toast Config ─────────────────────────────────────────────────────────────
const toastOptions = {
  style: {
    background:   '#1e293b',
    color:        '#f1f5f9',
    border:       '1px solid rgba(255,255,255,0.08)',
    borderRadius: '12px',
    fontSize:     '14px',
    fontFamily:   'Inter, sans-serif',
  },
  success: {
    iconTheme: { primary: '#22c55e', secondary: '#1e293b' },
  },
  error: {
    iconTheme: { primary: '#ef4444', secondary: '#1e293b' },
    duration:  5000,
  },
};

// ─── Render ───────────────────────────────────────────────────────────────────
createRoot(document.getElementById('root')).render(
  <StrictMode>
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <SocketProvider>
          <RouterProvider router={router} />
          <Toaster position="top-right" toastOptions={toastOptions} />
          {import.meta.env.DEV && (
            <ReactQueryDevtools initialIsOpen={false} />
          )}
        </SocketProvider>
      </AuthProvider>
    </QueryClientProvider>
  </StrictMode>
);
