/**
 * StadiumIQ — Application Router
 *
 * Declares all routes using React Router v6 data router.
 * Structure:
 *   /               → redirect to /dashboard
 *   /login          → LoginPage  (public only)
 *   /register       → RegisterPage (public only)
 *   /dashboard      → DashboardPage   (AppLayout)
 *   /live           → LivePage        (AppLayout)
 *   /chat           → ChatPage        (AppLayout)
 *   /navigation     → NavigationPage  (AppLayout)
 *   /crowd          → CrowdPage       (AppLayout)
 *   /emergency      → EmergencyPage   (AppLayout)
 *   /announcements  → AnnouncementsPage (AppLayout)
 *   /accessibility  → AccessibilityPage (AppLayout)
 *   /transport      → TransportPage   (AppLayout)
 *   /sustainability → SustainabilityPage (AppLayout)
 *   /profile        → ProfilePage     (AppLayout + ProtectedRoute)
 *   *               → NotFoundPage
 */

import { createBrowserRouter, Navigate } from 'react-router-dom';

// Layouts
import AppLayout  from '@layouts/AppLayout';
import AuthLayout from '@layouts/AuthLayout';

// Route Guards
import ProtectedRoute from './ProtectedRoute';
import PublicRoute    from './PublicRoute';

// Pages — lazy loaded for code splitting
import { lazy, Suspense } from 'react';
import PageLoader from '@components/ui/PageLoader';

const wrap = (Component) => (
  <Suspense fallback={<PageLoader />}>
    <Component />
  </Suspense>
);

// Auth Pages
const LoginPage    = lazy(() => import('@pages/LoginPage'));
const RegisterPage = lazy(() => import('@pages/RegisterPage'));

// App Pages
const DashboardPage      = lazy(() => import('@pages/DashboardPage'));
const LivePage           = lazy(() => import('@pages/LivePage'));
const ChatPage           = lazy(() => import('@pages/ChatPage'));
const NavigationPage     = lazy(() => import('@pages/NavigationPage'));
const CrowdPage          = lazy(() => import('@pages/CrowdPage'));
const EmergencyPage      = lazy(() => import('@pages/EmergencyPage'));
const AnnouncementsPage  = lazy(() => import('@pages/AnnouncementsPage'));
const AccessibilityPage  = lazy(() => import('@pages/AccessibilityPage'));
const TransportPage      = lazy(() => import('@pages/TransportPage'));
const SustainabilityPage = lazy(() => import('@pages/SustainabilityPage'));
const ProfilePage        = lazy(() => import('@pages/ProfilePage'));
const NotFoundPage       = lazy(() => import('@pages/NotFoundPage'));

const router = createBrowserRouter([
  // ── Root redirect ───────────────────────────────────────────────────────────
  {
    path:    '/',
    element: <Navigate to="/dashboard" replace />,
  },

  // ── Auth Pages (public only — redirect authenticated users away) ────────────
  {
    element: <PublicRoute />,
    children: [
      {
        element: <AuthLayout />,
        children: [
          { path: '/login',    element: wrap(LoginPage) },
          { path: '/register', element: wrap(RegisterPage) },
        ],
      },
    ],
  },

  // ── App Pages (all public except /profile) ──────────────────────────────────
  {
    element: <AppLayout />,
    children: [
      { path: '/dashboard',      element: wrap(DashboardPage) },
      { path: '/live',           element: wrap(LivePage) },
      { path: '/chat',           element: wrap(ChatPage) },
      { path: '/navigation',     element: wrap(NavigationPage) },
      { path: '/crowd',          element: wrap(CrowdPage) },
      { path: '/emergency',      element: wrap(EmergencyPage) },
      { path: '/announcements',  element: wrap(AnnouncementsPage) },
      { path: '/accessibility',  element: wrap(AccessibilityPage) },
      { path: '/transport',      element: wrap(TransportPage) },
      { path: '/sustainability',  element: wrap(SustainabilityPage) },

      // ── Protected — requires Firebase auth ─────────────────────────────────
      {
        element: <ProtectedRoute />,
        children: [
          { path: '/profile', element: wrap(ProfilePage) },
        ],
      },
    ],
  },

  // ── 404 ─────────────────────────────────────────────────────────────────────
  {
    path:    '*',
    element: wrap(NotFoundPage),
  },
], {
  future: {
    v7_startTransition: true,
    v7_relativeSplatPath: true,
    v7_fetcherPersist: true,
    v7_normalizeFormMethod: true,
    v7_partialHydration: true,
    v7_skipActionErrorRevalidation: true,
  }
});

export default router;
