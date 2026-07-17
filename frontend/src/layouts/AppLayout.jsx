/**
 * StadiumIQ — App Layout
 *
 * Main application shell used by all authenticated/public app pages.
 * Contains: sidebar + topbar + main content area.
 * Outlet renders the active page.
 */

import { useState } from 'react';
import { Outlet } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import AppSidebar from '@components/layout/AppSidebar';
import AppTopbar  from '@components/layout/AppTopbar';
import CriticalAlertBanner from '@components/common/CriticalAlertBanner';
import { useSocket } from '@context/SocketContext';

const AppLayout = () => {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const { criticalAlert, clearCriticalAlert } = useSocket();

  return (
    <div className="flex h-screen bg-surface-900 overflow-hidden">
      {/* ── Sidebar ── */}
      <AppSidebar
        isOpen={sidebarOpen}
        onToggle={() => setSidebarOpen((prev) => !prev)}
      />

      {/* ── Main Area ── */}
      <div className="flex flex-col flex-1 min-w-0 overflow-hidden">
        {/* Topbar */}
        <AppTopbar
          onMenuToggle={() => setSidebarOpen((prev) => !prev)}
          sidebarOpen={sidebarOpen}
        />

        {/* Critical Alert Banner */}
        <AnimatePresence>
          {criticalAlert && (
            <CriticalAlertBanner
              alert={criticalAlert}
              onDismiss={clearCriticalAlert}
            />
          )}
        </AnimatePresence>

        {/* Page Content */}
        <main className="flex-1 overflow-y-auto">
          <AnimatePresence mode="wait">
            <motion.div
              key={location.pathname}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{    opacity: 0, y: -8 }}
              transition={{ duration: 0.2, ease: 'easeOut' }}
              className="h-full"
            >
              <Outlet />
            </motion.div>
          </AnimatePresence>
        </main>
      </div>
    </div>
  );
};

export default AppLayout;
