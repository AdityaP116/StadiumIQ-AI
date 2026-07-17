/**
 * StadiumIQ — App Topbar
 *
 * Top navigation bar with:
 * - Hamburger menu toggle
 * - Page breadcrumb / title
 * - Live clock
 * - Socket status dot
 * - User menu (sign in / sign out)
 */

import { useState, useEffect } from 'react';
import { useLocation, Link } from 'react-router-dom';
import { Menu, LogIn, LogOut } from 'lucide-react';
import { motion } from 'framer-motion';
import { useAuth } from '@context/AuthContext';
import { useSocket } from '@context/SocketContext';
import { NAV_ITEMS, ROUTES } from '@constants';
import { formatTime } from '@utils';

const AppTopbar = ({ onMenuToggle }) => {
  const location              = useLocation();
  const { user, isAuthenticated, signOut } = useAuth();
  const { isConnected, lastUpdated }       = useSocket();
  const [now, setNow]         = useState(new Date().toISOString());

  // Tick the clock every second
  useEffect(() => {
    const id = setInterval(() => setNow(new Date().toISOString()), 1000);
    return () => clearInterval(id);
  }, []);

  // Derive page title from current path
  const currentNav = NAV_ITEMS.find((item) => item.path === location.pathname);
  const pageTitle  = currentNav?.label ?? 'StadiumIQ';

  return (
    <header className="h-16 bg-surface-950/80 backdrop-blur-sm border-b border-white/8 flex items-center px-4 gap-4 shrink-0 sticky top-0 z-10">
      {/* Menu toggle */}
      <button
        onClick={onMenuToggle}
        className="btn-ghost p-2 -ml-2"
        aria-label="Toggle sidebar"
      >
        <Menu size={18} />
      </button>

      {/* Page title */}
      <motion.h1
        key={pageTitle}
        initial={{ opacity: 0, x: -6 }}
        animate={{ opacity: 1, x: 0 }}
        className="text-base font-semibold text-white"
      >
        {pageTitle}
      </motion.h1>

      {/* Spacer */}
      <div className="flex-1" />

      {/* Live clock */}
      <div className="hidden sm:flex items-center gap-1.5 text-white/40 text-sm font-mono">
        <div className={`w-1.5 h-1.5 rounded-full ${isConnected ? 'bg-green-400 animate-pulse' : 'bg-red-400'}`} />
        {formatTime(now)}
      </div>

      {/* Last socket update */}
      {lastUpdated && (
        <div className="hidden md:block text-white/30 text-xs">
          Updated {formatTime(lastUpdated)}
        </div>
      )}

      {/* User menu */}
      {isAuthenticated ? (
        <div className="flex items-center gap-2">
          <Link
            to={ROUTES.PROFILE}
            className="flex items-center gap-2 px-3 py-1.5 rounded-xl hover:bg-white/8 transition-colors"
          >
            <div className="w-7 h-7 rounded-full bg-primary-600/40 border border-primary-500/30 flex items-center justify-center">
              <span className="text-primary-300 text-xs font-semibold">
                {user?.displayName?.[0]?.toUpperCase() ?? user?.email?.[0]?.toUpperCase() ?? '?'}
              </span>
            </div>
            <span className="hidden sm:block text-sm text-white/70 max-w-[120px] truncate">
              {user?.displayName ?? user?.email}
            </span>
          </Link>
          <button
            onClick={signOut}
            className="btn-ghost p-2"
            title="Sign out"
          >
            <LogOut size={16} />
          </button>
        </div>
      ) : (
        <Link to={ROUTES.LOGIN} className="btn-primary py-2 px-4 text-sm">
          <LogIn size={15} />
          Sign In
        </Link>
      )}
    </header>
  );
};

export default AppTopbar;
