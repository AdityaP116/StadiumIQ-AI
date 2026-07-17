/**
 * StadiumIQ — LoadingSpinner (Atom)
 *
 * Animated circular spinner for loading states.
 * Used by Button (inline), PageLoader (full-screen), and any async component.
 *
 * @param {'xs'|'sm'|'md'|'lg'|'xl'} [size='md']
 * @param {'white'|'primary'|'accent'|'current'} [color='white']
 * @param {string} [className]
 * @param {string} [label]  - sr-only aria label
 *
 * @example
 * <LoadingSpinner size="sm" color="primary" />
 */

const SIZE_CLASSES = {
  xs: 'w-3 h-3  border',
  sm: 'w-4 h-4  border-[1.5px]',
  md: 'w-6 h-6  border-2',
  lg: 'w-9 h-9  border-2',
  xl: 'w-12 h-12 border-[3px]',
};

const COLOR_CLASSES = {
  white:   'border-white/30   border-t-white',
  primary: 'border-primary-500/30 border-t-primary-400',
  accent:  'border-accent-500/30  border-t-accent-400',
  current: 'border-current/30     border-t-current',
};

const LoadingSpinner = ({
  size      = 'md',
  color     = 'white',
  className = '',
  label     = 'Loading…',
}) => (
  <span
    role="status"
    aria-label={label}
    className={[
      'inline-block rounded-full animate-spin shrink-0',
      SIZE_CLASSES[size]  ?? SIZE_CLASSES.md,
      COLOR_CLASSES[color] ?? COLOR_CLASSES.white,
      className,
    ].join(' ')}
  />
);

export default LoadingSpinner;
