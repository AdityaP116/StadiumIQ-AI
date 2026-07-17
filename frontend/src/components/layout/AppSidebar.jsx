/**
 * StadiumIQ — App Sidebar
 *
 * Left navigation sidebar with:
 * - Logo / branding
 * - Navigation items (from NAV_ITEMS constant)
 * - Socket connection status indicator
 * - User avatar / profile link
 * - Collapsible mini-mode
 */

import { NavLink } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import * as Icons from 'lucide-react';
import { useAuth } from '@context/AuthContext';
import { useSocket } from '@context/SocketContext';
import { NAV_ITEMS, ROUTES } from '@constants';

const AppSidebar = ({ isOpen, onToggle }) => {
  const { user, isAuthenticated } = useAuth();
  const { isConnected } = useSocket();

  const sidebarWidth = isOpen ? 260 : 72;

  return (
    <motion.aside
      animate={{ width: sidebarWidth }}
      transition={{ duration: 0.25, ease: 'easeInOut' }}
      className="flex flex-col h-full bg-surface-950 border-r border-white/8 shrink-0 overflow-hidden z-10"
      style={{ minWidth: sidebarWidth }}
    >
      {/* ── Header / Logo ── */}
      <div className="flex items-center gap-3 px-4 h-16 border-b border-white/8 shrink-0">
        <div className="w-8 h-8 rounded-xl bg-primary-600 flex items-center justify-center shadow-glow-primary shrink-0">
          <span className="text-white font-bold text-sm">S</span>
        </div>
        <AnimatePresence>
          {isOpen && (
            <motion.div
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{    opacity: 0, x: -10 }}
              transition={{ duration: 0.15 }}
              className="overflow-hidden"
            >
              <p className="text-white font-bold text-base leading-none">StadiumIQ</p>
              <p className="text-white/30 text-xs mt-0.5">Operations Platform</p>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* ── Navigation ── */}
      <nav className="flex-1 overflow-y-auto no-scrollbar py-4 px-2 space-y-1">
        {NAV_ITEMS.map((item) => {
          const Icon = Icons[item.icon] ?? Icons.Circle;
          return (
            <NavLink
              key={item.path}
              to={item.path}
              title={!isOpen ? item.label : undefined}
              className={({ isActive }) =>
                `relative flex items-center p-2 rounded-xl transition-colors ${isActive ? 'text-white' : 'text-white/50 hover:text-white hover:bg-white/5'}`
              }
            >
              {({ isActive }) => (
                <>
                  {isActive && (
                    <motion.div
                      layoutId="activeTab"
                      className="absolute inset-0 bg-primary-500/15 border border-primary-500/20 rounded-xl"
                      initial={false}
                      transition={{ type: "spring", stiffness: 300, damping: 30 }}
                    />
                  )}
                  <div className="relative z-10 flex items-center gap-3 w-full">
                    <Icon
                      size={18}
                      className={item.danger ? 'text-red-400' : 'inherit'}
                    />
                    <AnimatePresence>
                {isOpen && (
                  <motion.span
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{    opacity: 0 }}
                    transition={{ duration: 0.1 }}
                    className={`flex-1 text-sm ${item.danger ? 'text-red-400' : ''}`}
                  >
                    {item.label}
                  </motion.span>
                )}
                    </AnimatePresence>
                    {isOpen && item.badge && (
                      <span className="badge badge-primary text-[10px] px-1.5 py-0.5">
                        {item.badge}
                      </span>
                    )}
                  </div>
                </>
              )}
            </NavLink>
          );
        })}
      </nav>

      {/* ── Footer — Socket Status + User ── */}
      <div className="border-t border-white/8 p-3 space-y-2 shrink-0">
        {/* Socket connection indicator */}
        <div
          className="flex items-center gap-2 px-2 py-1.5"
          title={isConnected ? 'Live — connected' : 'Disconnected'}
        >
          <div className={`w-2 h-2 rounded-full shrink-0 ${isConnected ? 'bg-green-400 animate-pulse' : 'bg-red-400'}`} />
          <AnimatePresence>
            {isOpen && (
              <motion.span
                initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                className={`text-xs ${isConnected ? 'text-green-400' : 'text-red-400'}`}
              >
                {isConnected ? 'Live' : 'Offline'}
              </motion.span>
            )}
          </AnimatePresence>
        </div>

        {/* User / Profile */}
        {isAuthenticated && (
          <NavLink
            to={ROUTES.PROFILE}
            className="flex items-center gap-2.5 px-2 py-1.5 rounded-xl hover:bg-white/5 transition-colors"
          >
            <div className="w-7 h-7 rounded-full bg-primary-600/40 border border-primary-500/30 flex items-center justify-center shrink-0">
              <span className="text-primary-300 text-xs font-semibold">
                {user?.displayName?.[0]?.toUpperCase() ?? user?.email?.[0]?.toUpperCase() ?? '?'}
              </span>
            </div>
            <AnimatePresence>
              {isOpen && (
                <motion.div
                  initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                  className="flex-1 min-w-0"
                >
                  <p className="text-white text-xs font-medium truncate">
                    {user?.displayName ?? 'Profile'}
                  </p>
                  <p className="text-white/30 text-[10px] truncate">{user?.email}</p>
                </motion.div>
              )}
            </AnimatePresence>
          </NavLink>
        )}

        {/* Collapse toggle */}
        <button
          onClick={onToggle}
          className="w-full flex items-center justify-center py-1.5 rounded-xl text-white/30 hover:text-white hover:bg-white/5 transition-all"
          title={isOpen ? 'Collapse sidebar' : 'Expand sidebar'}
        >
          {isOpen
            ? <Icons.PanelLeftClose size={16} />
            : <Icons.PanelLeftOpen  size={16} />
          }
        </button>
      </div>
    </motion.aside>
  );
};

export default AppSidebar;
