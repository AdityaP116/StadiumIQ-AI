/**
 * StadiumIQ — Navigation Validator
 * Validates requests for POST /api/navigation/route
 */

const validateNavigationRoute = (body) => {
  const errors = [];
  const { currentLocation, destination } = body;

  if (!currentLocation || typeof currentLocation !== "string" || currentLocation.trim().length === 0) {
    errors.push("'currentLocation' is required and must be a non-empty string.");
  }

  if (!destination || typeof destination !== "string" || destination.trim().length === 0) {
    errors.push("'destination' is required and must be a non-empty string.");
  }

  return errors;
};

module.exports = { validateNavigationRoute };
