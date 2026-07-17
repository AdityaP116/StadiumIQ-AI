/**
 * StadiumIQ — Alert (Molecule)
 *
 * Inline informational alert box (Info, Warning, Danger, Success).
 */

import { Info, AlertTriangle, CheckCircle, XCircle } from 'lucide-react';

const VARIANTS = {
  info:    { bg: 'bg-sky-500/10',    border: 'border-sky-500/20',    text: 'text-sky-200',    icon: Info,          iconColor: 'text-sky-400' },
  warning: { bg: 'bg-amber-500/10',  border: 'border-amber-500/20',  text: 'text-amber-200',  icon: AlertTriangle, iconColor: 'text-amber-400' },
  danger:  { bg: 'bg-red-500/10',    border: 'border-red-500/20',    text: 'text-red-200',    icon: XCircle,       iconColor: 'text-red-400' },
  success: { bg: 'bg-green-500/10',  border: 'border-green-500/20',  text: 'text-green-200',  icon: CheckCircle,   iconColor: 'text-green-400' },
};

const Alert = ({ variant = 'info', title, children, className = '' }) => {
  const v    = VARIANTS[variant] || VARIANTS.info;
  const Icon = v.icon;

  return (
    <div className={`flex gap-3 p-4 rounded-xl border ${v.bg} ${v.border} ${className}`}>
      <Icon size={18} className={`shrink-0 mt-0.5 ${v.iconColor}`} />
      <div className="flex-1 min-w-0">
        {title && <h5 className={`text-sm font-semibold mb-1 ${v.text}`}>{title}</h5>}
        <div className={`text-sm leading-relaxed ${title ? 'text-white/70' : v.text}`}>
          {children}
        </div>
      </div>
    </div>
  );
};

export default Alert;
