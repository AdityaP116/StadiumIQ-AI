/**
 * StadiumIQ — Button (Atom)
 *
 * Fully self-contained, accessible button with:
 * - 6 variants: primary | secondary | danger | ghost | accent | outline
 * - 4 sizes: xs | sm | md | lg
 * - Loading state (spinner replaces children)
 * - Left/right icon slots
 * - Full-width mode
 * - Forwards all native button props
 *
 * @example
 * <Button variant="primary" size="md" leftIcon={<Save size={14} />} isLoading={saving}>
 *   Save Changes
 * </Button>
 */

import { forwardRef } from 'react';
import LoadingSpinner from './LoadingSpinner';

// ─── Variant → class map ──────────────────────────────────────────────────────
const VARIANTS = {
  primary:  'bg-primary-600 text-white hover:bg-primary-500 active:bg-primary-700 shadow-glow-primary disabled:shadow-none',
  secondary:'bg-white/10 text-white hover:bg-white/20 border border-white/10',
  danger:   'bg-red-600 text-white hover:bg-red-500 active:bg-red-700 shadow-glow-danger disabled:shadow-none',
  ghost:    'text-white/70 hover:text-white hover:bg-white/10',
  accent:   'bg-accent-500 text-surface-900 hover:bg-accent-400 active:bg-accent-600 font-semibold',
  outline:  'border border-primary-500/50 text-primary-400 hover:bg-primary-500/10 hover:border-primary-400',
};

// ─── Size → class map ─────────────────────────────────────────────────────────
const SIZES = {
  xs: 'h-7  px-2.5 text-xs  gap-1',
  sm: 'h-8  px-3   text-sm  gap-1.5',
  md: 'h-10 px-4   text-sm  gap-2',
  lg: 'h-12 px-6   text-base gap-2.5',
};

const Button = forwardRef(
  (
    {
      children,
      variant    = 'primary',
      size       = 'md',
      isLoading  = false,
      leftIcon,
      rightIcon,
      fullWidth  = false,
      className  = '',
      disabled,
      type       = 'button',
      ...rest
    },
    ref
  ) => {
    const isDisabled = disabled || isLoading;

    return (
      <button
        ref={ref}
        type={type}
        disabled={isDisabled}
        className={[
          // Base
          'inline-flex items-center justify-center font-medium rounded-xl',
          'transition-all duration-200 select-none',
          'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-500 focus-visible:ring-offset-2 focus-visible:ring-offset-surface-900',
          'disabled:opacity-50 disabled:cursor-not-allowed',
          // Variant
          VARIANTS[variant] ?? VARIANTS.primary,
          // Size
          SIZES[size] ?? SIZES.md,
          // Width
          fullWidth ? 'w-full' : '',
          className,
        ]
          .filter(Boolean)
          .join(' ')}
        {...rest}
      >
        {isLoading ? (
          <LoadingSpinner size="sm" color="current" />
        ) : (
          <>
            {leftIcon && <span className="shrink-0">{leftIcon}</span>}
            {children && <span>{children}</span>}
            {rightIcon && <span className="shrink-0">{rightIcon}</span>}
          </>
        )}
      </button>
    );
  }
);

Button.displayName = 'Button';
export default Button;
