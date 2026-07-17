/**
 * StadiumIQ — RiskBadge
 * Reusable badge component for LOW / MEDIUM / HIGH / CRITICAL risk levels.
 */

import { getRiskClass } from '@utils';

const RiskBadge = ({ level, size = 'sm' }) => {
  if (!level) return null;
  const cls = getRiskClass(level);
  return (
    <span className={`${cls} ${size === 'xs' ? 'text-[10px] px-1.5 py-0.5' : ''}`}>
      {level}
    </span>
  );
};

export default RiskBadge;
