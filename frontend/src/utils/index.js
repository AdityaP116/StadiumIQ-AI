/**
 * StadiumIQ — Utility Functions
 * Pure helper functions. No side effects, no imports from project internals.
 */

import { RISK_LEVELS } from '@constants';

// ─── Date / Time ──────────────────────────────────────────────────────────────

/**
 * Format an ISO string into a human-readable time (HH:MM:SS).
 * @param {string} iso
 * @returns {string}
 */
export const formatTime = (iso) => {
  if (!iso) return '—';
  return new Date(iso).toLocaleTimeString('en-US', {
    hour:   '2-digit',
    minute: '2-digit',
    second: '2-digit',
    hour12: false,
  });
};

/**
 * Format an ISO string to a short date (Jul 17, 2026).
 * @param {string} iso
 * @returns {string}
 */
export const formatDate = (iso) => {
  if (!iso) return '—';
  return new Date(iso).toLocaleDateString('en-US', {
    year:  'numeric',
    month: 'short',
    day:   'numeric',
  });
};

/**
 * Format an ISO string to a short datetime.
 * @param {string} iso
 * @returns {string}
 */
export const formatDateTime = (iso) => {
  if (!iso) return '—';
  return new Date(iso).toLocaleString('en-US', {
    month:  'short',
    day:    'numeric',
    hour:   '2-digit',
    minute: '2-digit',
    hour12: false,
  });
};

/**
 * Get a relative time string ("2 minutes ago").
 * @param {string} iso
 * @returns {string}
 */
export const timeAgo = (iso) => {
  if (!iso) return '—';
  const seconds = Math.floor((Date.now() - new Date(iso).getTime()) / 1000);
  if (seconds < 10)  return 'just now';
  if (seconds < 60)  return `${seconds}s ago`;
  const minutes = Math.floor(seconds / 60);
  if (minutes < 60)  return `${minutes}m ago`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24)    return `${hours}h ago`;
  return formatDate(iso);
};

// ─── Numbers / Percentages ────────────────────────────────────────────────────

/**
 * Format a number with thousands separators (e.g. 92000 → "92,000").
 * @param {number} n
 * @returns {string}
 */
export const formatNumber = (n) => {
  if (n === null || n === undefined) return '—';
  return new Intl.NumberFormat('en-US').format(n);
};

/**
 * Format a percentage value.
 * @param {number} pct - 0–100
 * @param {number} [decimals=0]
 * @returns {string}
 */
export const formatPercent = (pct, decimals = 0) => {
  if (pct === null || pct === undefined) return '—';
  return `${pct.toFixed(decimals)}%`;
};

/**
 * Clamp a number between min and max.
 * @param {number} value
 * @param {number} min
 * @param {number} max
 * @returns {number}
 */
export const clamp = (value, min, max) =>
  Math.min(Math.max(value, min), max);

// ─── Risk Level Helpers ───────────────────────────────────────────────────────

/**
 * Get Tailwind CSS class for a risk level badge.
 * @param {string} level - LOW | MEDIUM | HIGH | CRITICAL
 * @returns {string}
 */
export const getRiskClass = (level) => {
  switch (level?.toUpperCase()) {
    case RISK_LEVELS.LOW:      return 'risk-low';
    case RISK_LEVELS.MEDIUM:   return 'risk-medium';
    case RISK_LEVELS.HIGH:     return 'risk-high';
    case RISK_LEVELS.CRITICAL: return 'risk-critical';
    default:                   return 'badge-neutral';
  }
};

/**
 * Get a hex color for a risk level (for charts / canvas).
 * @param {string} level
 * @returns {string}
 */
export const getRiskColor = (level) => {
  switch (level?.toUpperCase()) {
    case RISK_LEVELS.LOW:      return '#22c55e';
    case RISK_LEVELS.MEDIUM:   return '#f59e0b';
    case RISK_LEVELS.HIGH:     return '#ef4444';
    case RISK_LEVELS.CRITICAL: return '#dc2626';
    default:                   return '#6b7280';
  }
};

/**
 * Derive a risk level from an occupancy percentage.
 * Mirrors backend logic in fakeDataGenerator.js.
 * @param {number} pct
 * @returns {string}
 */
export const riskFromOccupancy = (pct) => {
  if (pct >= 95) return RISK_LEVELS.CRITICAL;
  if (pct >= 80) return RISK_LEVELS.HIGH;
  if (pct >= 60) return RISK_LEVELS.MEDIUM;
  return RISK_LEVELS.LOW;
};

// ─── Security Level Helpers ───────────────────────────────────────────────────

/**
 * Get color class for security level string.
 * @param {string} level - GREEN | YELLOW | ORANGE
 * @returns {string}
 */
export const getSecurityClass = (level) => {
  switch (level?.toUpperCase()) {
    case 'GREEN':  return 'badge-success';
    case 'YELLOW': return 'badge-warning';
    case 'ORANGE': return 'badge-danger';
    default:       return 'badge-neutral';
  }
};

// ─── String Helpers ───────────────────────────────────────────────────────────

/**
 * Capitalize the first letter of a string.
 * @param {string} str
 * @returns {string}
 */
export const capitalize = (str) => {
  if (!str) return '';
  return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();
};

/**
 * Truncate a string to maxLength and append ellipsis.
 * @param {string} str
 * @param {number} maxLength
 * @returns {string}
 */
export const truncate = (str, maxLength = 100) => {
  if (!str || str.length <= maxLength) return str || '';
  return `${str.slice(0, maxLength)}…`;
};

/**
 * Convert an emergency type value to a display label.
 * @param {string} type - e.g. "crowd_crush"
 * @returns {string}
 */
export const formatEmergencyType = (type) => {
  return type?.replace(/_/g, ' ').replace(/\b\w/g, (c) => c.toUpperCase()) || '—';
};

// ─── Object / Data Helpers ────────────────────────────────────────────────────

/**
 * Safely access a deeply nested value.
 * @param {object} obj
 * @param {string} path - dot notation: "a.b.c"
 * @param {*} fallback
 * @returns {*}
 */
export const getNestedValue = (obj, path, fallback = undefined) => {
  return path.split('.').reduce(
    (acc, key) => (acc && acc[key] !== undefined ? acc[key] : fallback),
    obj
  );
};

/**
 * Check if an object is empty.
 * @param {object} obj
 * @returns {boolean}
 */
export const isEmpty = (obj) =>
  !obj || (typeof obj === 'object' && Object.keys(obj).length === 0);

// ─── Validation Helpers ───────────────────────────────────────────────────────

/**
 * Common React Hook Form validation rules for reuse.
 */
export const VALIDATION_RULES = {
  required: (fieldName = 'This field') => ({
    required: `${fieldName} is required.`,
  }),
  maxLength: (max, fieldName = 'This field') => ({
    maxLength: { value: max, message: `${fieldName} must not exceed ${max} characters.` },
  }),
  minLength: (min, fieldName = 'This field') => ({
    minLength: { value: min, message: `${fieldName} must be at least ${min} characters.` },
  }),
  email: {
    pattern: {
      value:   /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
      message: 'Please enter a valid email address.',
    },
  },
};

// ─── URL / Network ────────────────────────────────────────────────────────────

/**
 * Extract a readable error message from an Axios error or a generic Error.
 * @param {Error|import('axios').AxiosError} error
 * @returns {string}
 */
export const extractErrorMessage = (error) => {
  // Axios API error with our { success, message, errors } shape
  if (error?.response?.data?.message) {
    return error.response.data.message;
  }
  // Generic Error
  if (error?.message) {
    return error.message;
  }
  return 'An unexpected error occurred. Please try again.';
};

/**
 * Extract the errors array from an Axios error response.
 * @param {import('axios').AxiosError} error
 * @returns {string[]}
 */
export const extractErrors = (error) => {
  return error?.response?.data?.errors || [];
};
