/**
 * StadiumIQ — Emergency Validator
 * Validates requests for POST /api/emergency/respond
 */

const VALID_EMERGENCY_TYPES = ["medical", "security", "fire", "evacuation", "crowd_crush", "structural", "general"];
const VALID_SEVERITIES = ["Minor", "Moderate", "Serious", "Critical"];

const validateEmergencyResponse = (body) => {
  const errors = [];
  const { emergencyType, zone, severity } = body;

  if (!emergencyType || typeof emergencyType !== "string") {
    errors.push("'emergencyType' is required.");
  } else if (!VALID_EMERGENCY_TYPES.includes(emergencyType)) {
    errors.push(`'emergencyType' must be one of: ${VALID_EMERGENCY_TYPES.join(", ")}.`);
  }

  if (!zone || typeof zone !== "string" || zone.trim().length === 0) {
    errors.push("'zone' is required and must be a non-empty string.");
  }

  if (severity && !VALID_SEVERITIES.includes(severity)) {
    errors.push(`'severity' must be one of: ${VALID_SEVERITIES.join(", ")}.`);
  }

  return errors;
};

module.exports = { validateEmergencyResponse };
