/**
 * StadiumIQ — Validation Middleware Factory
 * Provides a reusable request validation middleware.
 * Validators are plain functions that return an array of error strings.
 */

const { sendValidationError } = require("../utils/responseHandler");

/**
 * Create an Express middleware that validates the request using a schema function.
 *
 * @param {Function} schemaFn - Function that receives req.body and returns an array of error strings.
 *                              An empty array means the request is valid.
 * @returns {Function} Express middleware
 *
 * @example
 *   router.post("/", validate(fanValidator), fanController.chat);
 */
const validate = (schemaFn) => {
  return (req, res, next) => {
    const errors = schemaFn(req.body);
    if (errors.length > 0) {
      return sendValidationError(res, errors);
    }
    next();
  };
};

module.exports = validate;
