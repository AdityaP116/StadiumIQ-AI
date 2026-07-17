/**
 * StadiumIQ — StatusBadge (Atom)
 *
 * Generic badge for any status, risk level, severity, or category.
 * Supersedes RiskBadge (which now wraps this component).
 *
 * @param {'success'|'warning'|'danger'|'critical'|'info'|'primary'|'neutral'} variant
 * @param {'xs'|'sm'|'md'} [size='sm']
 * @param {boolean} [dot=false]       - Show a colored dot instead of text
 * @param {boolean} [pulse=false]     - Animate the dot (for live/critical states)
 * @param {React.ReactNode} [icon]    - Optional icon prefix
 * @param {string} [className]
 * @param {React.ReactNode} children  - Badge label text
 *
 * @example
 * <StatusBadge variant="danger" pulse>CRITICAL</StatusBadge>
 * <StatusBadge variant="success" dot />
 * <StatusBadge variant="warning" size="xs">HIGH</StatusBadge>
 */

const VARIANT_CLASSES = {
  success:  'bg-green-500/15  text-green-300  border-green-500/25',
  warning:  'bg-amber-500/15  text-amber-300  border-amber-500/25',
  danger:   'bg-red-500/15    text-red-300    border-red-500/25',
  critical: 'bg-red-600/20    text-red-200    border-red-500/40',
  info:     'bg-sky-500/15    text-sky-300    border-sky-500/25',
  primary:  'bg-primary-500/15 text-primary-300 border-primary-500/25',
  neutral:  'bg-white/8       text-white/60   border-white/10',
};

const DOT_COLORS = {
  success:  'bg-green-400',
  warning:  'bg-amber-400',
  danger:   'bg-red-400',
  critical: 'bg-red-400',
  info:     'bg-sky-400',
  primary:  'bg-primary-400',
  neutral:  'bg-white/40',
};

const SIZE_CLASSES = {
  xs: 'text-[10px] px-1.5 py-0.5 gap-1',
  sm: 'text-xs     px-2   py-0.5 gap-1',
  md: 'text-sm     px-2.5 py-1   gap-1.5',
};

const StatusBadge = ({
  children,
  variant   = 'neutral',
  size      = 'sm',
  dot       = false,
  pulse     = false,
  icon,
  className = '',
}) => {
  const variantCls = VARIANT_CLASSES[variant] ?? VARIANT_CLASSES.neutral;
  const sizeCls    = SIZE_CLASSES[size]        ?? SIZE_CLASSES.sm;

  if (dot) {
    return (
      <span
        className={[
          'inline-block rounded-full shrink-0',
          size === 'xs' ? 'w-1.5 h-1.5' : size === 'md' ? 'w-2.5 h-2.5' : 'w-2 h-2',
          DOT_COLORS[variant] ?? DOT_COLORS.neutral,
          pulse ? 'animate-pulse' : '',
          className,
        ].join(' ')}
        role="status"
        aria-label={String(children ?? variant)}
      />
    );
  }

  return (
    <span
      className={[
        'inline-flex items-center font-semibold rounded-lg border',
        'tracking-wide uppercase leading-none',
        variantCls,
        sizeCls,
        pulse ? 'animate-pulse' : '',
        className,
      ].join(' ')}
    >
      {icon && <span className="shrink-0">{icon}</span>}
      {children}
    </span>
  );
};

export default StatusBadge;
