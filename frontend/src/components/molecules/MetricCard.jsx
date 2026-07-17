/**
 * StadiumIQ — Metric Card (Molecule)
 *
 * A specific type of DashboardCard optimized for displaying a single large number
 * (e.g. total attendance) along with a trend indicator or status badge.
 */

import { TrendingUp, TrendingDown, Minus } from 'lucide-react';
import { motion } from 'framer-motion';
import { formatNumber } from '@utils';
import StatusBadge from '../atoms/StatusBadge';

const MetricCard = ({
  title,
  value,
  subtitle,
  icon,
  trend,         // 'up' | 'down' | 'neutral' | null
  trendValue,    // e.g. "+5%"
  statusLevel,   // 'success' | 'warning' | 'danger' | 'critical' | null
  statusLabel,   // Text for the badge if statusLevel is provided
  format = true, // Whether to run value through formatNumber()
}) => {
  const displayValue = format && typeof value === 'number' ? formatNumber(value) : value;

  return (
    <motion.div 
      initial={{ opacity: 0, y: 15 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      whileHover={{ y: -2 }}
      transition={{ duration: 0.3 }}
      className="card-glass p-5 relative overflow-hidden group"
    >
      {/* Background glow on hover */}
      <div className="absolute inset-0 bg-primary-500/0 group-hover:bg-primary-500/5 transition-colors duration-300 pointer-events-none" />

      <div className="flex items-start justify-between mb-4 relative z-10">
        <div className="flex items-center gap-2">
          {icon && (
            <div className="w-8 h-8 rounded-lg bg-white/5 border border-white/10 flex items-center justify-center text-white/60">
              {icon}
            </div>
          )}
          <h3 className="text-sm font-medium text-white/60">{title}</h3>
        </div>
        {statusLevel && statusLabel && (
          <StatusBadge variant={statusLevel} size="xs" pulse={statusLevel === 'critical'}>
            {statusLabel}
          </StatusBadge>
        )}
      </div>

      <div className="relative z-10">
        <div className="flex items-baseline gap-3">
          <p className="text-3xl font-bold tabular-nums tracking-tight text-white">
            {displayValue ?? '—'}
          </p>

          {trend && (
            <div className={`flex items-center text-xs font-semibold ${
              trend === 'up' ? 'text-green-400' :
              trend === 'down' ? 'text-red-400' :
              'text-white/40'
            }`}>
              {trend === 'up' && <TrendingUp size={14} className="mr-1" />}
              {trend === 'down' && <TrendingDown size={14} className="mr-1" />}
              {trend === 'neutral' && <Minus size={14} className="mr-1" />}
              {trendValue}
            </div>
          )}
        </div>
        {subtitle && <p className="text-xs text-white/40 mt-1">{subtitle}</p>}
      </div>
    </motion.div>
  );
};

export default MetricCard;
