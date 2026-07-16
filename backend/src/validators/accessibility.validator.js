/**
 * StadiumIQ — Accessibility Validator
 * Validates requests for POST /api/accessibility/assist
 */

const validateAccessibilityAssist = (body) => {
  const errors = [];
  const { need, currentLocation, destination } = body;

  if (!need || typeof need !== "string" || need.trim().length === 0) {
    errors.push("'need' is required and must be a non-empty string describing the accessibility requirement.");
  }

  if (need && need.trim().length > 500) {
    errors.push("'need' must not exceed 500 characters.");
  }

  if (currentLocation !== undefined && (typeof currentLocation !== "string" || currentLocation.trim().length === 0)) {
    errors.push("'currentLocation' must be a non-empty string if provided.");
  }

  if (destination !== undefined && (typeof destination !== "string" || destination.trim().length === 0)) {
    errors.push("'destination' must be a non-empty string if provided.");
  }

  return errors;
};

module.exports = { validateAccessibilityAssist };
