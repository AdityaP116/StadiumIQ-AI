/**
 * StadiumIQ — Dashboard Card (Molecule)
 *
 * Base wrapper for dashboard panels.
 * Includes a glassmorphism shell, title, icon, and optional header action.
 */

import { motion } from 'framer-motion';

const DashboardCard = ({ title, icon, action, children, className = '', noPadding = false }) => (
  <motion.div
    initial={{ opacity: 0, y: 15 }}
    whileInView={{ opacity: 1, y: 0 }}
    viewport={{ once: true, margin: "-20px" }}
    transition={{ duration: 0.4, ease: 'easeOut' }}
    className={`card-glass flex flex-col overflow-hidden ${className}`}
  >
    {/* Header */}
    {(title || icon || action) && (
      <div className="flex items-center justify-between px-5 py-4 border-b border-white/5 bg-white/[0.02]">
        <div className="flex items-center gap-2.5">
          {icon && <span className="text-white/40 shrink-0">{icon}</span>}
          {title && <h3 className="font-semibold text-white/90">{title}</h3>}
        </div>
        {action && <div>{action}</div>}
      </div>
    )}

    {/* Content */}
    <div className={`flex-1 ${noPadding ? '' : 'p-5'}`}>
      {children}
    </div>
  </motion.div>
);

export default DashboardCard;
