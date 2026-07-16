/**
 * StadiumIQ — Async Wrapper
 * HOF that wraps async Express route handlers to eliminate repetitive try/catch blocks.
 * Any error thrown inside the wrapped function is forwarded to Express's error handler.
 */

/**
 * Wrap an async Express route handler to catch errors automatically.
 * @param {Function} fn - Async route handler
 * @returns {Function} Express-compatible route handler
 */
const asyncWrapper = (fn) => {
  return (req, res, next) => {
    Promise.resolve(fn(req, res, next)).catch(next);
  };
};

module.exports = asyncWrapper;
