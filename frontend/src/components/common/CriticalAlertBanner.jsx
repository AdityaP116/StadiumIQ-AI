/**
 * StadiumIQ — Critical Alert Banner
 *
 * Full-width dismissible banner shown when Socket.io emits a crowd-alert.
 * Triggered only at CRITICAL occupancy level.
 */

import { motion } from 'framer-motion';
import { AlertTriangle, X } from 'lucide-react';
import { formatTime } from '@utils';

const CriticalAlertBanner = ({ alert, onDismiss }) => {
  if (!alert) return null;

  return (
    <motion.div
      initial={{ opacity: 0, height: 0 }}
      animate={{ opacity: 1, height: 'auto' }}
      exit={{    opacity: 0, height: 0 }}
      transition={{ duration: 0.25 }}
      className="bg-red-600/95 border-b border-red-500/50 px-4 py-3 flex items-center gap-3 shrink-0"
    >
      <AlertTriangle size={18} className="text-red-100 shrink-0 animate-bounce-subtle" />

      <div className="flex-1 min-w-0">
        <p className="text-red-50 text-sm font-semibold leading-snug">{alert.message}</p>
        {alert.timestamp && (
          <p className="text-red-200/60 text-xs mt-0.5">
            Triggered at {formatTime(alert.timestamp)}
          </p>
        )}
      </div>

      <button
        onClick={onDismiss}
        className="text-red-200 hover:text-white transition-colors shrink-0"
        aria-label="Dismiss alert"
      >
        <X size={16} />
      </button>
    </motion.div>
  );
};

export default CriticalAlertBanner;
