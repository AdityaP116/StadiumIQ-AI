/**
 * StadiumIQ — Frontend Constants
 *
 * Centralizes all magic strings, route paths, query keys, socket event names,
 * enum values and configuration constants. Import from this file only.
 */

// ─── API Base URL ─────────────────────────────────────────────────────────────
export const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000';

// ─── API Endpoints (path only — base URL prepended in api.js) ───────────────
export const API_ENDPOINTS = {
  // Health
  HEALTH:                  '/health',

  // Live
  LIVE_STATUS:             '/api/live/status',

  // Dashboard
  DASHBOARD_SUMMARY:       '/api/dashboard/summary',
  DASHBOARD_INSIGHT:       '/api/dashboard/insight',

  // AI Fan Chat
  AI_CHAT:                 '/api/ai/chat',

  // Navigation
  NAVIGATION_ROUTE:        '/api/navigation/route',

  // Crowd
  CROWD_ANALYZE:           '/api/crowd/analyze',

  // Emergency
  EMERGENCY_RESPOND:       '/api/emergency/respond',

  // Announcements
  ANNOUNCEMENT_GENERATE:   '/api/announcement/generate',

  // Accessibility
  ACCESSIBILITY_ASSIST:    '/api/accessibility/assist',

  // Transport
  TRANSPORT_RECOMMEND:     '/api/transport/recommend',

  // Sustainability
  SUSTAINABILITY_TIPS:     '/api/sustainability/tips',

  // User
  USER_PROFILE:            '/api/users/profile',
};

// ─── App Routes (React Router paths) ─────────────────────────────────────────
export const ROUTES = {
  ROOT:           '/',
  LOGIN:          '/login',
  REGISTER:       '/register',
  DASHBOARD:      '/dashboard',
  LIVE:           '/live',
  CHAT:           '/chat',
  NAVIGATION:     '/navigation',
  CROWD:          '/crowd',
  EMERGENCY:      '/emergency',
  ANNOUNCEMENTS:  '/announcements',
  ACCESSIBILITY:  '/accessibility',
  TRANSPORT:      '/transport',
  SUSTAINABILITY: '/sustainability',
  PROFILE:        '/profile',
  NOT_FOUND:      '*',
};

// ─── TanStack Query Keys ──────────────────────────────────────────────────────
export const QUERY_KEYS = {
  LIVE_STATUS:        ['live', 'status'],
  DASHBOARD_SUMMARY:  ['dashboard', 'summary'],
  DASHBOARD_INSIGHT:  ['dashboard', 'insight'],
  USER_PROFILE:       ['user', 'profile'],
  HEALTH:             ['health'],
};

// ─── Socket.io Event Names (must match backend constants/index.js) ────────────
export const SOCKET_EVENTS = {
  STADIUM_UPDATE:   'stadium-update',
  CROWD_ALERT:      'crowd-alert',
  EMERGENCY_ALERT:  'emergency-alert',
  CONNECTION:       'connect',
  DISCONNECT:       'disconnect',
  CONNECT_ERROR:    'connect_error',
};

// ─── Risk Levels ──────────────────────────────────────────────────────────────
export const RISK_LEVELS = {
  LOW:      'LOW',
  MEDIUM:   'MEDIUM',
  HIGH:     'HIGH',
  CRITICAL: 'CRITICAL',
};

// ─── Security Status Levels ───────────────────────────────────────────────────
export const SECURITY_LEVELS = {
  GREEN:  'GREEN',
  YELLOW: 'YELLOW',
  ORANGE: 'ORANGE',
};

// ─── Emergency Types (must match backend validators/emergency.validator.js) ──
export const EMERGENCY_TYPES = [
  { value: 'medical',     label: 'Medical Emergency' },
  { value: 'security',    label: 'Security Threat' },
  { value: 'fire',        label: 'Fire' },
  { value: 'evacuation',  label: 'Evacuation' },
  { value: 'crowd_crush', label: 'Crowd Crush' },
  { value: 'structural',  label: 'Structural Damage' },
  { value: 'general',     label: 'General Emergency' },
];

// ─── Emergency Severity Levels ────────────────────────────────────────────────
export const EMERGENCY_SEVERITIES = [
  { value: 'Minor',    label: 'Minor' },
  { value: 'Moderate', label: 'Moderate' },
  { value: 'Serious',  label: 'Serious' },
  { value: 'Critical', label: 'Critical' },
];

// ─── Announcement Types ───────────────────────────────────────────────────────
export const ANNOUNCEMENT_TYPES = [
  { value: 'crowd_control',  label: 'Crowd Control' },
  { value: 'emergency',      label: 'Emergency' },
  { value: 'general',        label: 'General' },
  { value: 'transport',      label: 'Transport' },
  { value: 'accessibility',  label: 'Accessibility' },
  { value: 'sustainability', label: 'Sustainability' },
];

// ─── Supported Languages ──────────────────────────────────────────────────────
export const SUPPORTED_LANGUAGES = [
  { value: 'en', label: 'English',    flag: '🇬🇧' },
  { value: 'ar', label: 'Arabic',     flag: '🇸🇦' },
  { value: 'fr', label: 'French',     flag: '🇫🇷' },
  { value: 'es', label: 'Spanish',    flag: '🇪🇸' },
  { value: 'pt', label: 'Portuguese', flag: '🇧🇷' },
  { value: 'zh', label: 'Chinese',    flag: '🇨🇳' },
  { value: 'ja', label: 'Japanese',   flag: '🇯🇵' },
  { value: 'de', label: 'German',     flag: '🇩🇪' },
];

// ─── Transport Preferences ────────────────────────────────────────────────────
export const TRANSPORT_PREFERENCES = [
  { value: 'eco',        label: 'Eco Friendly' },
  { value: 'fast',       label: 'Fastest' },
  { value: 'cheap',      label: 'Cheapest' },
  { value: 'accessible', label: 'Accessible' },
];

// ─── Sustainability Target Audiences ─────────────────────────────────────────
export const SUSTAINABILITY_AUDIENCES = [
  { value: 'fans',       label: 'Fans' },
  { value: 'operations', label: 'Operations' },
  { value: 'both',       label: 'Everyone' },
];

// ─── Stadium Zones (static reference — matches backend stadiumData.js) ───────
export const STADIUM_ZONES = [
  'North Stand',
  'South Stand',
  'East Stand',
  'West Stand',
  'VIP Box',
  'Media Center',
  'Parking Zone A',
  'Parking Zone B',
  'Parking Zone C',
  'Medical Center',
  'Security Hub',
];

// ─── Rate Limit Info (for frontend debounce / UX copy) ───────────────────────
export const RATE_LIMITS = {
  AI_MAX_REQUESTS:    20,
  AI_WINDOW_LABEL:    '1 minute',
  GENERAL_MAX:        100,
  GENERAL_WINDOW_LABEL: '15 minutes',
};

// ─── Socket Broadcast Interval ────────────────────────────────────────────────
export const SOCKET_UPDATE_INTERVAL_MS = 10_000;

// ─── Toast Durations ──────────────────────────────────────────────────────────
export const TOAST_DURATION = {
  SHORT:  2000,
  BASE:   3000,
  LONG:   5000,
  ALERT:  8000,  // Critical alerts stay longer
};

// ─── Sidebar Navigation Items ─────────────────────────────────────────────────
// Used by AppSidebar to render nav links
// Icons are referenced by string name — mapped in the sidebar component
export const NAV_ITEMS = [
  {
    label:    'Dashboard',
    path:     ROUTES.DASHBOARD,
    icon:     'LayoutDashboard',
    badge:    null,
  },
  {
    label:    'Live Status',
    path:     ROUTES.LIVE,
    icon:     'Radio',
    badge:    'LIVE',
  },
  {
    label:    'Fan Assistant',
    path:     ROUTES.CHAT,
    icon:     'MessageSquare',
    badge:    null,
  },
  {
    label:    'Navigation',
    path:     ROUTES.NAVIGATION,
    icon:     'MapPin',
    badge:    null,
  },
  {
    label:    'Crowd Intelligence',
    path:     ROUTES.CROWD,
    icon:     'Users',
    badge:    null,
  },
  {
    label:    'Emergency',
    path:     ROUTES.EMERGENCY,
    icon:     'AlertTriangle',
    badge:    null,
    danger:   true,
  },
  {
    label:    'Announcements',
    path:     ROUTES.ANNOUNCEMENTS,
    icon:     'Volume2',
    badge:    null,
  },
  {
    label:    'Accessibility',
    path:     ROUTES.ACCESSIBILITY,
    icon:     'Accessibility',
    badge:    null,
  },
  {
    label:    'Transport',
    path:     ROUTES.TRANSPORT,
    icon:     'Train',
    badge:    null,
  },
  {
    label:    'Sustainability',
    path:     ROUTES.SUSTAINABILITY,
    icon:     'Leaf',
    badge:    null,
  },
];

// ─── Stadium Info ─────────────────────────────────────────────────────────────
export const STADIUM = {
  NAME:     'Lusail Iconic Stadium',
  CITY:     'Lusail, Qatar',
  CAPACITY: 92_000,
};
