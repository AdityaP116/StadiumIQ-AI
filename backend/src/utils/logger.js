/**
 * StadiumIQ — Logger
 * Lightweight console logger with timestamps and severity levels.
 */

const LOG_LEVELS = {
  INFO: "INFO",
  WARN: "WARN",
  ERROR: "ERROR",
  DEBUG: "DEBUG",
};

/**
 * Get formatted timestamp string.
 * @returns {string}
 */
const getTimestamp = () => new Date().toISOString();

/**
 * Format a log message with prefix and timestamp.
 * @param {string} level
 * @param {string} message
 * @param {object} [meta]
 * @returns {string}
 */
const format = (level, message, meta) => {
  const ts = getTimestamp();
  const base = `[${ts}] [${level}] ${message}`;
  return meta ? `${base} ${JSON.stringify(meta)}` : base;
};

const logger = {
  /**
   * Log an informational message.
   * @param {string} message
   * @param {object} [meta]
   */
  info: (message, meta) => {
    console.log(format(LOG_LEVELS.INFO, message, meta));
  },

  /**
   * Log a warning message.
   * @param {string} message
   * @param {object} [meta]
   */
  warn: (message, meta) => {
    console.warn(format(LOG_LEVELS.WARN, message, meta));
  },

  /**
   * Log an error message.
   * @param {string} message
   * @param {object} [meta]
   */
  error: (message, meta) => {
    console.error(format(LOG_LEVELS.ERROR, message, meta));
  },

  /**
   * Log a debug message (only in development).
   * @param {string} message
   * @param {object} [meta]
   */
  debug: (message, meta) => {
    if (process.env.NODE_ENV !== "production") {
      console.debug(format(LOG_LEVELS.DEBUG, message, meta));
    }
  },
};

module.exports = logger;
