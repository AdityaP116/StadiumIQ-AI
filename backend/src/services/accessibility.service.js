/**
 * StadiumIQ — Accessibility Service
 * Business logic for generating accessible routes and assistance plans.
 */

const { callAI } = require("./openai.service");
const { buildAccessibilityPrompt } = require("../prompts/accessibility.prompt");
const stadiumData = require("../utils/stadiumData");
const logger = require("../utils/logger");

/**
 * Generate an accessible route and assistance plan for a fan with disabilities.
 *
 * @param {object} params
 * @param {string} params.need - Description of accessibility need
 * @param {string} [params.currentLocation] - Current position
 * @param {string} [params.destination] - Desired destination
 * @returns {Promise<object>} Accessible route and service recommendations
 */
const getAccessibleAssistance = async ({
  need,
  currentLocation = "Stadium Entrance",
  destination = "Seating Area",
}) => {
  logger.info("[AccessibilityService] Processing accessibility request", { need });

  const { systemPrompt, userPrompt } = buildAccessibilityPrompt({
    need,
    currentLocation,
    destination,
    stadiumData,
  });

  const response = await callAI({
    systemPrompt,
    userPrompt,
    temperature: 0.5,
  });

  return {
    need,
    currentLocation,
    destination,
    assistance: response,
    availableFeatures: stadiumData.accessibilityFeatures,
  };
};

module.exports = { getAccessibleAssistance };
