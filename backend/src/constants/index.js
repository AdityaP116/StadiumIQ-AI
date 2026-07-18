/**
 * StadiumIQ — Application Constants
 * Centralizes all magic numbers, strings, and configuration values.
 */

// HTTP Status Codes
const HTTP_STATUS = {
  OK: 200,
  CREATED: 201,
  BAD_REQUEST: 400,
  UNAUTHORIZED: 401,
  FORBIDDEN: 403,
  NOT_FOUND: 404,
  TOO_MANY_REQUESTS: 429,
  INTERNAL_SERVER_ERROR: 500,
};

// AI Model Names
const AI_MODELS = {
  GPT_OSS_20B: "openai/gpt-oss-20b",
  DEFAULT: "openai/gpt-oss-20b",
};

// AI Configuration
const AI_CONFIG = {
  DEFAULT_TEMPERATURE: 0.7,
  MAX_RETRIES: 3,
  RETRY_DELAY_MS: 1000,
};

// Socket.io Event Names
const SOCKET_EVENTS = {
  STADIUM_UPDATE: "stadium-update",
  CROWD_ALERT: "crowd-alert",
  EMERGENCY_ALERT: "emergency-alert",
  CONNECTION: "connection",
  DISCONNECT: "disconnect",
};

// Socket.io Broadcast Intervals
const SOCKET_INTERVALS = {
  STADIUM_UPDATE_MS: 10000, // 10 seconds
};

// Rate Limiting
const RATE_LIMIT = {
  WINDOW_MS: 15 * 60 * 1000, // 15 minutes
  MAX_REQUESTS: 100,
  AI_WINDOW_MS: 60 * 1000, // 1 minute
  AI_MAX_REQUESTS: 20,
};

// Risk Levels
const RISK_LEVELS = {
  LOW: "LOW",
  MEDIUM: "MEDIUM",
  HIGH: "HIGH",
  CRITICAL: "CRITICAL",
};

// Stadium Zones
const STADIUM_ZONES = {
  NORTH: "North Stand",
  SOUTH: "South Stand",
  EAST: "East Stand",
  WEST: "West Stand",
  VIP: "VIP Box",
  MEDIA: "Media Center",
  PARKING_A: "Parking Zone A",
  PARKING_B: "Parking Zone B",
  PARKING_C: "Parking Zone C",
  MEDICAL: "Medical Center",
  SECURITY: "Security Hub",
};

// Transport Modes
const TRANSPORT_MODES = {
  METRO: "metro",
  BUS: "bus",
  TAXI: "taxi",
  WALKING: "walking",
  PARKING: "parking",
};

// Supported Languages
const LANGUAGES = {
  EN: "en",
  AR: "ar",
  FR: "fr",
  ES: "es",
  PT: "pt",
  ZH: "zh",
  JA: "ja",
  DE: "de",
};

// Emergency Types
const EMERGENCY_TYPES = {
  MEDICAL: "medical",
  SECURITY: "security",
  FIRE: "fire",
  EVACUATION: "evacuation",
  CROWD_CRUSH: "crowd_crush",
  STRUCTURAL: "structural",
  GENERAL: "general",
};

module.exports = {
  HTTP_STATUS,
  AI_MODELS,
  AI_CONFIG,
  SOCKET_EVENTS,
  SOCKET_INTERVALS,
  RATE_LIMIT,
  RISK_LEVELS,
  STADIUM_ZONES,
  TRANSPORT_MODES,
  LANGUAGES,
  EMERGENCY_TYPES,
};
