/**
 * StadiumIQ — Progress Card (Molecule)
 *
 * Displays a metric alongside a visual progress bar (e.g. Occupancy).
 * The progress bar color automatically maps to risk levels if standard StadiumIQ risk logic applies.
 */

import { motion } from 'framer-motion';
import { getRiskColor, riskFromOccupancy, formatPercent, formatNumber } from '@utils';

const ProgressCard = ({
  title,
  current,
  max,
  percent,
  icon,
  subtitle,
  riskOverride, // 'LOW'|'MEDIUM'|'HIGH'|'CRITICAL'
}) => {
  // Use provided percent, or calculate it
  const pct = percent ?? (max > 0 ? (current / max) * 100 : 0);
  const clampedPct = Math.min(100, Math.max(0, pct));

  // Determine risk color
  const risk = riskOverride || riskFromOccupancy(pct);
  const barColor = getRiskColor(risk);

  return (
    <motion.div 
      initial={{ opacity: 0, y: 15 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      whileHover={{ y: -2 }}
      transition={{ duration: 0.3 }}
      className="card-glass p-5"
    >
      <div className="flex justify-between items-start mb-4">
        <div className="flex items-center gap-2">
          {icon && <span className="text-white/50">{icon}</span>}
          <h3 className="text-sm font-medium text-white/70">{title}</h3>
        </div>
        <span className="text-2xl font-bold tabular-nums text-white leading-none">
          {formatPercent(pct)}
        </span>
      </div>

      {/* Progress Track */}
      <div className="w-full h-2.5 bg-white/10 rounded-full overflow-hidden mb-3">
        <div
          className="h-full rounded-full transition-all duration-700 ease-out"
          style={{ width: `${clampedPct}%`, backgroundColor: barColor }}
        />
      </div>

      <div className="flex justify-between text-xs text-white/50 font-mono">
        <span>{formatNumber(current)}</span>
        <span>{formatNumber(max)} {subtitle ? `/ ${subtitle}` : ''}</span>
      </div>
    </motion.div>
  );
};

export default ProgressCard;
