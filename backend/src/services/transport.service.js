/**
 * StadiumIQ — Transport Service
 * Business logic for generating transport recommendations for fans.
 */

const { callAI, parseAIJson } = require("./openai.service");
const { buildTransportPrompt } = require("../prompts/transport.prompt");
const { generateLiveStatus } = require("../utils/fakeDataGenerator");
const logger = require("../utils/logger");

/**
 * Generate transport recommendations based on live conditions.
 *
 * @param {object} params
 * @param {string} params.userLocation - Fan's current location
 * @param {string} [params.destination] - Intended destination
 * @param {object} [params.preferences] - Fan preferences
 * @returns {Promise<object>} Ranked transport options with recommendations
 */
const recommendTransport = async ({
  userLocation,
  destination = "city center",
  preferences = {},
}) => {
  logger.info("[TransportService] Generating transport recommendation", { userLocation, destination });

  // Get current live transport data
  const liveData = generateLiveStatus();
  const transportStatus = liveData.transport;

  const { systemPrompt, userPrompt } = buildTransportPrompt({
    userLocation,
    destination,
    transportStatus,
    preferences,
  });

  const aiResponse = await callAI({
    systemPrompt,
    userPrompt,
    jsonMode: true,
    temperature: 0.5,
  });

  const recommendation = parseAIJson(aiResponse);

  return {
    userLocation,
    destination,
    recommendation,
    liveTransportStatus: transportStatus,
  };
};

module.exports = { recommendTransport };
