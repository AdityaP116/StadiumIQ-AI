/**
 * StadiumIQ — Fan Service
 * Business logic for the AI Fan Assistant chatbot.
 */

const { callAI } = require("./openai.service");
const { buildFanPrompt } = require("../prompts/fan.prompt");
const logger = require("../utils/logger");

/**
 * Process a fan's message and return an AI-generated response.
 *
 * @param {object} params
 * @param {string} params.message - Fan's question or request
 * @param {string} [params.language] - Fan's preferred language
 * @param {string} [params.userLocation] - Fan's current location in the stadium
 * @returns {Promise<{ response: string, language: string }>}
 */
const processChat = async ({ message, language = "en", userLocation = "Unknown" }) => {
  logger.info("[FanService] Processing fan chat", { language, userLocation });

  const { systemPrompt, userPrompt } = buildFanPrompt({ message, language, userLocation });

  const response = await callAI({
    systemPrompt,
    userPrompt,
    temperature: 0.7,
  });

  return {
    response,
    language,
    userLocation,
  };
};

module.exports = { processChat };
