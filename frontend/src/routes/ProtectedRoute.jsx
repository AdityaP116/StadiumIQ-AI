/**
 * StadiumIQ — Protected Route Guard
 *
 * Redirects unauthenticated users to /login.
 * Shows a loading spinner while Firebase resolves initial auth state.
 */

import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { useAuth } from '@context/AuthContext';
import { ROUTES } from '@constants';

const ProtectedRoute = () => {
  const { isAuthenticated, isLoading } = useAuth();
  const location                       = useLocation();

  // Firebase hasn't resolved yet — render nothing (prevents flicker)
  if (isLoading) {
    return (
      <div className="min-h-screen bg-surface-900 flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <div className="w-10 h-10 rounded-full border-2 border-primary-500 border-t-transparent animate-spin" />
          <p className="text-white/50 text-sm">Verifying authentication…</p>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    // Preserve the intended destination so we can redirect back after login
    return (
      <Navigate
        to={ROUTES.LOGIN}
        state={{ from: location }}
        replace
      />
    );
  }

  return <Outlet />;
};

export default ProtectedRoute;
