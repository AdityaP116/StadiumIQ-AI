/**
 * StadiumIQ — Sustainability Validator
 * Validates requests for POST /api/sustainability/tips
 */

const VALID_AUDIENCES = ["fans", "operations", "both"];

const validateSustainabilityTips = (body) => {
  const errors = [];
  const { targetAudience, specificConcern } = body;

  if (targetAudience !== undefined) {
    if (typeof targetAudience !== "string" || !VALID_AUDIENCES.includes(targetAudience)) {
      errors.push(`'targetAudience' must be one of: ${VALID_AUDIENCES.join(", ")}.`);
    }
  }

  if (specificConcern !== undefined && typeof specificConcern !== "string") {
    errors.push("'specificConcern' must be a string if provided.");
  }

  if (specificConcern && specificConcern.trim().length > 500) {
    errors.push("'specificConcern' must not exceed 500 characters.");
  }

  return errors;
};

module.exports = { validateSustainabilityTips };
