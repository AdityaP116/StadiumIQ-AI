/**
 * StadiumIQ — Auth Layout
 *
 * Centered layout used for Login and Register pages.
 * Features a decorative background and centered card.
 */

import { Outlet } from 'react-router-dom';
import { motion } from 'framer-motion';

const AuthLayout = () => {
  return (
    <div className="min-h-screen bg-surface-900 flex items-center justify-center p-4 relative overflow-hidden">
      {/* Background glow effects */}
      <div className="absolute top-0 left-1/4 w-96 h-96 bg-primary-600/20 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-accent-500/10 rounded-full blur-3xl pointer-events-none" />

      {/* Auth Card */}
      <motion.div
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, ease: 'easeOut' }}
        className="relative z-10 w-full max-w-md"
      >
        {/* Logo */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center gap-2 mb-3">
            <div className="w-10 h-10 rounded-2xl bg-primary-600 flex items-center justify-center shadow-glow-primary">
              <span className="text-white font-bold text-lg">S</span>
            </div>
            <span className="text-2xl font-bold text-white">StadiumIQ</span>
          </div>
          <p className="text-white/40 text-sm">AI-Powered Stadium Operations</p>
        </div>

        {/* Page Content (Login or Register form) */}
        <Outlet />
      </motion.div>
    </div>
  );
};

export default AuthLayout;
