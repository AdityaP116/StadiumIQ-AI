/**
 * StadiumIQ — Custom Application Error
 * Extends the native Error class with an HTTP status code and structured detail.
 * Used throughout the application to throw meaningful, catchable errors.
 */
class AppError extends Error {
  /**
   * @param {string} message - Human-readable error description
   * @param {number} statusCode - HTTP status code (e.g. 400, 404, 500)
   * @param {Array} [errors=[]] - Detailed error breakdown (e.g. validation messages)
   */
  constructor(message, statusCode = 500, errors = []) {
    super(message);
    this.statusCode = statusCode;
    this.errors = Array.isArray(errors) ? errors : [errors];
    this.isOperational = true; // Distinguish from unexpected programmer errors
    Error.captureStackTrace(this, this.constructor);
  }
}

/**
 * StadiumIQ — Global Error Handler Middleware
 * Catches all errors forwarded via next(err) and returns a consistent JSON response.
 * Must be registered AFTER all routes in app.js.
 */
const errorHandler = (err, req, res, next) => {
  // Set defaults
  let statusCode = err.statusCode || 500;
  let message = err.message || "An unexpected error occurred.";
  let errors = err.errors || [];

  // Log all errors for observability
  const logger = require("../utils/logger");
  logger.error(`${req.method} ${req.originalUrl} — ${message}`, {
    statusCode,
    stack: process.env.NODE_ENV !== "production" ? err.stack : undefined,
  });

  // Never leak internal errors to clients in production
  if (!err.isOperational && process.env.NODE_ENV === "production") {
    message = "An internal server error occurred.";
    errors = [];
  }

  return res.status(statusCode).json({
    success: false,
    message,
    errors,
  });
};

/**
 * 404 Handler — Catch all unmatched routes.
 * Must be registered AFTER all routes and BEFORE errorHandler.
 */
const notFoundHandler = (req, res) => {
  return res.status(404).json({
    success: false,
    message: `Route not found: ${req.method} ${req.originalUrl}`,
    errors: [],
  });
};

module.exports = { AppError, errorHandler, notFoundHandler };
