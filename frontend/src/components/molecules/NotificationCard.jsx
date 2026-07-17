/**
 * StadiumIQ — Notification Card (Molecule)
 *
 * Feed-style card for medical incidents, security alerts, and system logs.
 */

import { formatTime, timeAgo } from '@utils';
import StatusBadge from '../atoms/StatusBadge';

const NotificationCard = ({
  title,
  description,
  timestamp,
  icon,
  statusVariant = 'neutral',
  statusLabel,
  isResolved = false,
  onClick,
}) => (
  <div
    onClick={onClick}
    className={`p-4 rounded-xl border border-white/5 transition-colors ${
      onClick ? 'cursor-pointer hover:bg-white/[0.07]' : ''
    } ${isResolved ? 'opacity-50' : 'bg-white/[0.03]'}`}
  >
    <div className="flex items-start gap-3">
      {icon && (
        <div className={`mt-0.5 shrink-0 ${isResolved ? 'text-white/30' : ''}`}>
          {icon}
        </div>
      )}

      <div className="flex-1 min-w-0">
        <div className="flex items-start justify-between gap-2 mb-1">
          <h4 className={`text-sm font-semibold truncate ${isResolved ? 'text-white/50' : 'text-white/90'}`}>
            {title}
          </h4>
          {statusLabel && !isResolved && (
            <StatusBadge variant={statusVariant} size="xs">{statusLabel}</StatusBadge>
          )}
          {isResolved && (
            <StatusBadge variant="success" size="xs">Resolved</StatusBadge>
          )}
        </div>

        {description && (
          <p className={`text-xs mb-2 line-clamp-2 ${isResolved ? 'text-white/30' : 'text-white/60'}`}>
            {description}
          </p>
        )}

        {timestamp && (
          <div className="flex items-center gap-2 text-[10px] font-mono text-white/30">
            <span>{timeAgo(timestamp)}</span>
            <span>•</span>
            <span>{formatTime(timestamp)}</span>
          </div>
        )}
      </div>
    </div>
  </div>
);

export default NotificationCard;
