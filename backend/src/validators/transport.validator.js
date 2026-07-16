/**
 * StadiumIQ — Transport Validator
 * Validates requests for POST /api/transport/recommend
 */

const VALID_TRANSPORT_PREFERENCES = ["eco", "fast", "cheap", "accessible"];

const validateTransportRecommend = (body) => {
  const errors = [];
  const { userLocation, destination, preferences } = body;

  if (!userLocation || typeof userLocation !== "string" || userLocation.trim().length === 0) {
    errors.push("'userLocation' is required and must be a non-empty string.");
  }

  if (destination !== undefined && (typeof destination !== "string" || destination.trim().length === 0)) {
    errors.push("'destination' must be a non-empty string if provided.");
  }

  if (preferences !== undefined && (typeof preferences !== "object" || Array.isArray(preferences))) {
    errors.push("'preferences' must be an object if provided.");
  }

  return errors;
};

module.exports = { validateTransportRecommend };
