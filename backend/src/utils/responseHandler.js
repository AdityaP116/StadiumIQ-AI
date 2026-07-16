/**
 * StadiumIQ — Response Handler
 * Provides standardized JSON response helpers for all controllers.
 */

const { HTTP_STATUS } = require("../constants");

/**
 * Send a standardized success response.
 * @param {object} res - Express response object
 * @param {object|null} data - Response payload
 * @param {string} message - Human-readable success message
 * @param {number} statusCode - HTTP status code (default 200)
 */
const sendSuccess = (
  res,
  data = null,
  message = "Operation completed successfully.",
  statusCode = HTTP_STATUS.OK
) => {
  return res.status(statusCode).json({
    success: true,
    message,
    data,
  });
};

/**
 * Send a standardized error response.
 * @param {object} res - Express response object
 * @param {string} message - Human-readable error message
 * @param {Array} errors - Array of detailed error messages
 * @param {number} statusCode - HTTP status code (default 500)
 */
const sendError = (
  res,
  message = "An unexpected error occurred.",
  errors = [],
  statusCode = HTTP_STATUS.INTERNAL_SERVER_ERROR
) => {
  return res.status(statusCode).json({
    success: false,
    message,
    errors: Array.isArray(errors) ? errors : [errors],
  });
};

/**
 * Send a 404 Not Found response.
 * @param {object} res - Express response object
 * @param {string} message - Custom not found message
 */
const sendNotFound = (res, message = "Resource not found.") => {
  return res.status(HTTP_STATUS.NOT_FOUND).json({
    success: false,
    message,
    errors: [],
  });
};

/**
 * Send a validation error response.
 * @param {object} res - Express response object
 * @param {Array} errors - Validation error messages
 */
const sendValidationError = (res, errors = []) => {
  return res.status(HTTP_STATUS.BAD_REQUEST).json({
    success: false,
    message: "Validation failed.",
    errors: Array.isArray(errors) ? errors : [errors],
  });
};

module.exports = { sendSuccess, sendError, sendNotFound, sendValidationError };
