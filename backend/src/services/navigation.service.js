/**
 * StadiumIQ — Navigation Service
 * Business logic for generating stadium navigation directions.
 */

const { callAI } = require("./openai.service");
const { buildNavigationPrompt } = require("../prompts/navigation.prompt");
const stadiumData = require("../utils/stadiumData");
const seatData = require("../utils/seatData");
const logger = require("../utils/logger");

/**
 * Generate navigation directions from a current location to a destination.
 *
 * @param {object} params
 * @param {string} params.currentLocation - Fan's current position
 * @param {string} params.destination - Where the fan wants to go
 * @returns {Promise<{ route: string, currentLocation: string, destination: string, seatContext: object|null }>}
 */
const getRoute = async ({ currentLocation, destination }) => {
  logger.info("[NavigationService] Generating route", { currentLocation, destination });

  // Try to enrich with seat-specific context if destination looks like a seat code
  const seatContext = seatData.lookup(destination);

  const { systemPrompt, userPrompt } = buildNavigationPrompt({
    currentLocation,
    destination,
    stadiumData,
  });

  const route = await callAI({
    systemPrompt,
    userPrompt,
    temperature: 0.5, // Lower temp for more consistent directions
  });

  return {
    route,
    currentLocation,
    destination,
    seatContext,
  };
};

module.exports = { getRoute };
