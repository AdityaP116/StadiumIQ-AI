/**
 * StadiumIQ — Crowd Validator
 * Validates requests for POST /api/crowd/analyze
 * Note: All fields are optional — the service generates simulated data if not provided.
 * Validation here only ensures provided data is of correct shape.
 */

const validateCrowdAnalysis = (body) => {
  const errors = [];
  const { gateOccupancy, parking, medicalIncidents } = body;

  if (gateOccupancy !== undefined && !Array.isArray(gateOccupancy)) {
    errors.push("'gateOccupancy' must be an array if provided.");
  }

  if (parking !== undefined && !Array.isArray(parking)) {
    errors.push("'parking' must be an array if provided.");
  }

  if (medicalIncidents !== undefined && !Array.isArray(medicalIncidents)) {
    errors.push("'medicalIncidents' must be an array if provided.");
  }

  return errors;
};

module.exports = { validateCrowdAnalysis };
