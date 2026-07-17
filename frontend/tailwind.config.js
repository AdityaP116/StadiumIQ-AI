/** @type {import('tailwindcss').Config} */
export default {
  content: [
    './index.html',
    './src/**/*.{js,ts,jsx,tsx}',
  ],
  darkMode: 'class',
  theme: {
    extend: {
      // ─── Brand Color Palette ─────────────────────────────────────────────────
      colors: {
        // Primary — Electric Indigo (Vibrant, modern)
        primary: {
          50:  '#eef2ff',
          100: '#e0e7ff',
          200: '#c7d2fe',
          300: '#a5b4fc',
          400: '#818cf8',
          500: '#6366f1',
          600: '#4f46e5',
          700: '#4338ca',
          800: '#3730a3',
          900: '#312e81',
          950: '#1e1b4b',
        },
        // Accent — Amber/Gold (stadium energy)
        accent: {
          50:  '#fffbeb',
          100: '#fef3c7',
          200: '#fde68a',
          300: '#fcd34d',
          400: '#fbbf24',
          500: '#f59e0b',
          600: '#d97706',
          700: '#b45309',
          800: '#92400e',
          900: '#78350f',
        },
        // Surface — Deep Neutral Navy (Clean, high contrast)
        surface: {
          DEFAULT: '#09090b',
          50:  '#fafafa',
          100: '#f4f4f5',
          200: '#e4e4e7',
          800: '#27272a',
          900: '#18181b',
          950: '#09090b',
        },
        // Risk Level Colors
        risk: {
          low:      '#22c55e',  // green-500
          medium:   '#f59e0b',  // amber-500
          high:     '#ef4444',  // red-500  (was orange; changed for stronger signal)
          critical: '#dc2626',  // red-600
        },
        // Security Status Colors
        security: {
          green:  '#16a34a',
          yellow: '#ca8a04',
          orange: '#ea580c',
          red:    '#dc2626',
        },
      },

      // ─── Typography ───────────────────────────────────────────────────────────
      fontFamily: {
        sans:  ['Inter', 'ui-sans-serif', 'system-ui', 'sans-serif'],
        mono:  ['JetBrains Mono', 'ui-monospace', 'monospace'],
        display: ['Inter', 'sans-serif'],
      },

      // ─── Spacing / Sizing ────────────────────────────────────────────────────
      spacing: {
        18:  '4.5rem',
        72:  '18rem',
        84:  '21rem',
        96:  '24rem',
        128: '32rem',
      },

      // ─── Border Radius ────────────────────────────────────────────────────────
      borderRadius: {
        xl:  '0.75rem',
        '2xl': '1rem',
        '3xl': '1.5rem',
        '4xl': '2rem',
      },

      // ─── Box Shadow ───────────────────────────────────────────────────────────
      boxShadow: {
        'glow-primary': '0 0 20px rgba(99, 102, 241, 0.25)',
        'glow-accent':  '0 0 20px rgba(245, 158, 11, 0.25)',
        'glow-danger':  '0 0 20px rgba(239, 68, 68, 0.25)',
        'glass':        '0 8px 32px rgba(0, 0, 0, 0.15)',
        'card':         '0 4px 20px -2px rgba(0, 0, 0, 0.2), 0 0 3px rgba(0,0,0,0.1)',
        'card-hover':   '0 10px 25px -5px rgba(0, 0, 0, 0.3), 0 8px 10px -6px rgba(0, 0, 0, 0.1)',
      },

      // ─── Backdrop Blur ────────────────────────────────────────────────────────
      backdropBlur: {
        xs: '2px',
      },

      // ─── Animation ────────────────────────────────────────────────────────────
      keyframes: {
        'pulse-slow': {
          '0%, 100%': { opacity: '1' },
          '50%':      { opacity: '0.5' },
        },
        'slide-up': {
          '0%':   { transform: 'translateY(10px)', opacity: '0' },
          '100%': { transform: 'translateY(0)',    opacity: '1' },
        },
        'slide-in-right': {
          '0%':   { transform: 'translateX(100%)', opacity: '0' },
          '100%': { transform: 'translateX(0)',     opacity: '1' },
        },
        'fade-in': {
          '0%':   { opacity: '0' },
          '100%': { opacity: '1' },
        },
        'spin-slow': {
          '0%':   { transform: 'rotate(0deg)' },
          '100%': { transform: 'rotate(360deg)' },
        },
        'bounce-subtle': {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%':      { transform: 'translateY(-4px)' },
        },
        shimmer: {
          '0%':   { backgroundPosition: '-200% 0' },
          '100%': { backgroundPosition: '200% 0' },
        },
      },
      animation: {
        'pulse-slow':      'pulse-slow 3s ease-in-out infinite',
        'slide-up':        'slide-up 0.3s ease-out',
        'slide-in-right':  'slide-in-right 0.3s ease-out',
        'fade-in':         'fade-in 0.2s ease-out',
        'spin-slow':       'spin-slow 3s linear infinite',
        'bounce-subtle':   'bounce-subtle 2s ease-in-out infinite',
        shimmer:           'shimmer 2s linear infinite',
      },
    },
  },
  plugins: [],
};
