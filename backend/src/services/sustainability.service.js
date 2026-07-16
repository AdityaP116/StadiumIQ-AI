/**
 * StadiumIQ — Sustainability Service
 * Business logic for generating eco-friendly recommendations.
 */

const { callAI, parseAIJson } = require("./openai.service");
const { buildSustainabilityPrompt } = require("../prompts/sustainability.prompt");
const { generateLiveStatus } = require("../utils/fakeDataGenerator");
const logger = require("../utils/logger");

/**
 * Generate sustainability tips and recommendations.
 *
 * @param {object} params
 * @param {string} [params.targetAudience] - "fans", "operations", or "both"
 * @param {string} [params.specificConcern] - Optional specific concern
 * @returns {Promise<object>} Sustainability tips and recommendations
 */
const getTips = async ({
  targetAudience = "fans",
  specificConcern = "",
} = {}) => {
  logger.info("[SustainabilityService] Generating sustainability tips", { targetAudience });

  const liveData = generateLiveStatus();

  const { systemPrompt, userPrompt } = buildSustainabilityPrompt({
    targetAudience,
    currentData: {
      weather: liveData.weather,
      occupancy: liveData.overallOccupancy,
    },
    specificConcern,
  });

  const aiResponse = await callAI({
    systemPrompt,
    userPrompt,
    jsonMode: true,
    temperature: 0.7,
  });

  const tips = parseAIJson(aiResponse);

  return {
    targetAudience,
    specificConcern: specificConcern || "General sustainability",
    ...tips,
  };
};

module.exports = { getTips };
