/**
 * StadiumIQ — Chart Card (Molecule)
 *
 * Wrapper for Recharts or canvas charts. Enforces aspect ratio and loading states.
 */

import DashboardCard from './DashboardCard';
import LoadingSpinner from '../atoms/LoadingSpinner';
import ErrorState from '../ui/ErrorState';
import { motion } from 'framer-motion';

const ChartCard = ({
  title,
  icon,
  action,
  isLoading,
  isError,
  error,
  onRetry,
  height = 300,
  children,
  className = '',
}) => {
  return (
    <DashboardCard title={title} icon={icon} action={action} className={className}>
      <div
        className="w-full relative flex items-center justify-center"
        style={{ height }}
      >
        {isLoading ? (
          <div className="flex flex-col items-center gap-3">
            <LoadingSpinner size="lg" color="primary" />
            <span className="text-white/40 text-xs">Loading chart data…</span>
          </div>
        ) : isError ? (
          <ErrorState
            title="Chart Failed"
            message={error?.message || 'Could not load data'}
            onRetry={onRetry}
          />
        ) : (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.5 }} className="w-full h-full">
            {children}
          </motion.div>
        )}
      </div>
    </DashboardCard>
  );
};

export default ChartCard;
