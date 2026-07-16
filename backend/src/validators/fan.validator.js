/**
 * StadiumIQ — Fan Validator
 * Validates requests for POST /api/ai/chat
 */

/**
 * @param {object} body - Request body
 * @returns {string[]} Array of validation error messages (empty = valid)
 */
const validateFanChat = (body) => {
  const errors = [];
  const { message, language } = body;

  if (!message || typeof message !== "string" || message.trim().length === 0) {
    errors.push("'message' is required and must be a non-empty string.");
  }

  if (message && message.trim().length > 2000) {
    errors.push("'message' must not exceed 2000 characters.");
  }

  const supportedLanguages = ["en", "ar", "fr", "es", "pt", "zh", "ja", "de"];
  if (language && !supportedLanguages.includes(language)) {
    errors.push(`'language' must be one of: ${supportedLanguages.join(", ")}.`);
  }

  return errors;
};

module.exports = { validateFanChat };
