/**
 * StadiumIQ — Status Card (Molecule)
 *
 * Displays a system status (e.g. Metro Line, Weather, Security Level).
 * Compact layout with icon left, title/value stacked, and an optional right slot.
 */

import { motion } from 'framer-motion';
import { getSecurityClass } from '@utils';

const StatusCard = ({ title, value, subtitle, icon, rightSlot, securityLevel }) => {
  // If a security level is provided, use its color mapping for the value text
  const valueClass = securityLevel
    ? getSecurityClass(securityLevel).replace('bg-', 'text-').replace('/20', '')
    : 'text-white/90';

  return (
    <motion.div 
      initial={{ opacity: 0, y: 10 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      whileHover={{ y: -1 }}
      transition={{ duration: 0.2 }}
      className="flex items-center gap-4 p-3 rounded-xl bg-white/5 border border-white/5 hover:bg-white/[0.07] transition-colors group"
    >
      {icon && (
        <div className="w-10 h-10 rounded-lg bg-surface-900 border border-white/10 flex items-center justify-center text-white/50 shrink-0 group-hover:text-white/80 transition-colors">
          {icon}
        </div>
      )}

      <div className="flex-1 min-w-0">
        <h4 className="text-[11px] font-medium text-white/40 uppercase tracking-wider mb-0.5">{title}</h4>
        <div className="flex items-baseline gap-2">
          <p className={`text-sm font-semibold truncate ${valueClass}`}>
            {value ?? '—'}
          </p>
          {subtitle && (
            <span className="text-xs text-white/40 truncate">{subtitle}</span>
          )}
        </div>
      </div>

      {rightSlot && <div className="shrink-0 pl-2">{rightSlot}</div>}
    </motion.div>
  );
};

export default StatusCard;
