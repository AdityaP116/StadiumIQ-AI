/**
 * StadiumIQ — Public Route Guard
 *
 * Redirects already-authenticated users away from login/register pages.
 * If a user is signed in and tries to visit /login, they go to /dashboard.
 */

import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '@context/AuthContext';
import { ROUTES } from '@constants';

const PublicRoute = () => {
  const { isAuthenticated, isLoading } = useAuth();

  if (isLoading) {
    return (
      <div className="min-h-screen bg-surface-900 flex items-center justify-center">
        <div className="w-10 h-10 rounded-full border-2 border-primary-500 border-t-transparent animate-spin" />
      </div>
    );
  }

  if (isAuthenticated) {
    return <Navigate to={ROUTES.DASHBOARD} replace />;
  }

  return <Outlet />;
};

export default PublicRoute;
