/**
 * StadiumIQ — Announcement Validator
 * Validates requests for POST /api/announcement/generate
 */

const VALID_TYPES = ["crowd_control", "emergency", "general", "transport", "accessibility", "sustainability"];
const SUPPORTED_LANGUAGES = ["en", "ar", "fr", "es", "pt", "zh", "ja", "de"];

const validateAnnouncement = (body) => {
  const errors = [];
  const { type, zone, message, languages } = body;

  if (!type || typeof type !== "string") {
    errors.push("'type' is required.");
  } else if (!VALID_TYPES.includes(type)) {
    errors.push(`'type' must be one of: ${VALID_TYPES.join(", ")}.`);
  }

  if (!zone || typeof zone !== "string" || zone.trim().length === 0) {
    errors.push("'zone' is required and must be a non-empty string.");
  }

  if (!message || typeof message !== "string" || message.trim().length === 0) {
    errors.push("'message' is required and must be a non-empty string.");
  }

  if (message && message.trim().length > 500) {
    errors.push("'message' must not exceed 500 characters.");
  }

  if (languages !== undefined) {
    if (!Array.isArray(languages)) {
      errors.push("'languages' must be an array of language codes.");
    } else {
      const invalid = languages.filter((l) => !SUPPORTED_LANGUAGES.includes(l));
      if (invalid.length > 0) {
        errors.push(`Unsupported language codes: ${invalid.join(", ")}. Supported: ${SUPPORTED_LANGUAGES.join(", ")}.`);
      }
    }
  }

  return errors;
};

module.exports = { validateAnnouncement };
