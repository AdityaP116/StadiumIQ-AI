/**
 * StadiumIQ — Input (Atom)
 *
 * Universal form input supporting:
 * - type: text | email | password | number | search | url
 * - Textarea mode (multiline)
 * - Left/right icon/addon slots
 * - Label, error message, helper text
 * - React Hook Form compatible (forwardRef + rest spread)
 * - Controlled and uncontrolled usage
 *
 * @example
 * // With React Hook Form:
 * <Input
 *   label="Email Address"
 *   type="email"
 *   leftIcon={<Mail size={14} />}
 *   error={errors.email?.message}
 *   {...register('email', { required: true })}
 * />
 *
 * // Textarea:
 * <Input label="Description" as="textarea" rows={4} {...register('desc')} />
 */

import { forwardRef, useState } from 'react';
import { Eye, EyeOff } from 'lucide-react';

const Input = forwardRef(
  (
    {
      // Metadata
      label,
      helperText,
      error,
      id,

      // Layout
      as         = 'input',
      type       = 'text',
      leftIcon,
      rightIcon,
      className  = '',
      wrapperClassName = '',

      // State
      disabled   = false,
      readOnly   = false,

      // Textarea specific
      rows       = 3,

      ...rest
    },
    ref
  ) => {
    const [showPassword, setShowPassword] = useState(false);
    const inputId = id ?? (label ? label.toLowerCase().replace(/\s+/g, '-') : undefined);

    const isPassword  = type === 'password';
    const resolvedType = isPassword ? (showPassword ? 'text' : 'password') : type;

    const baseClass = [
      'w-full bg-white/5 border rounded-xl',
      'text-white text-sm placeholder:text-white/25',
      'transition-all duration-200',
      'focus:outline-none focus:ring-2 focus:ring-offset-0',
      disabled || readOnly
        ? 'opacity-50 cursor-not-allowed'
        : '',
      error
        ? 'border-red-500/50 focus:ring-red-500/50 focus:border-red-500/50'
        : 'border-white/10 focus:ring-primary-500/50 focus:border-primary-500/50',
      leftIcon  ? 'pl-10' : 'pl-4',
      rightIcon || isPassword ? 'pr-10' : 'pr-4',
      as === 'textarea' ? 'py-3 resize-none' : 'h-11',
    ]
      .filter(Boolean)
      .join(' ');

    const Tag = as === 'textarea' ? 'textarea' : 'input';

    return (
      <div className={`flex flex-col gap-1.5 ${wrapperClassName}`}>
        {/* Label */}
        {label && (
          <label
            htmlFor={inputId}
            className="text-sm font-medium text-white/60 select-none"
          >
            {label}
          </label>
        )}

        {/* Input wrapper */}
        <div className="relative">
          {/* Left icon */}
          {leftIcon && (
            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-white/30 pointer-events-none">
              {leftIcon}
            </span>
          )}

          {/* Input/Textarea */}
          <Tag
            ref={ref}
            id={inputId}
            type={as === 'textarea' ? undefined : resolvedType}
            disabled={disabled}
            readOnly={readOnly}
            rows={as === 'textarea' ? rows : undefined}
            className={`${baseClass} ${className}`}
            {...rest}
          />

          {/* Right icon OR password toggle */}
          {isPassword ? (
            <button
              type="button"
              onClick={() => setShowPassword((p) => !p)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-white/30 hover:text-white/60 transition-colors"
              tabIndex={-1}
              aria-label={showPassword ? 'Hide password' : 'Show password'}
            >
              {showPassword ? <EyeOff size={15} /> : <Eye size={15} />}
            </button>
          ) : rightIcon ? (
            <span className="absolute right-3 top-1/2 -translate-y-1/2 text-white/30 pointer-events-none">
              {rightIcon}
            </span>
          ) : null}
        </div>

        {/* Error message */}
        {error && (
          <p className="text-red-400 text-xs">{error}</p>
        )}

        {/* Helper text */}
        {helperText && !error && (
          <p className="text-white/30 text-xs">{helperText}</p>
        )}
      </div>
    );
  }
);

Input.displayName = 'Input';
export default Input;
