/**
 * StadiumIQ — Dashboard Service
 * Business logic for generating executive dashboard insights and live summaries.
 */

const { callAI, parseAIJson } = require("./openai.service");
const { buildDashboardPrompt } = require("../prompts/dashboard.prompt");
const { generateLiveStatus } = require("../utils/fakeDataGenerator");
const logger = require("../utils/logger");

/**
 * Generate an AI-powered executive operational insight report.
 *
 * @param {object} [inputData] - Optional live data; falls back to simulated data
 * @returns {Promise<object>} Executive insight report
 */
const generateInsight = async (inputData = {}) => {
  logger.info("[DashboardService] Generating executive insight");

  const liveData = Object.keys(inputData).length > 0 ? inputData : generateLiveStatus();

  const { systemPrompt, userPrompt } = buildDashboardPrompt(liveData);

  const aiResponse = await callAI({
    systemPrompt,
    userPrompt,
    jsonMode: true,
    temperature: 0.5,
    maxTokens: 2000,
  });

  const insight = parseAIJson(aiResponse);

  return {
    insight,
    dataSnapshot: {
      overallOccupancy: liveData.overallOccupancy,
      weather: liveData.weather,
      security: liveData.security,
      medicalIncidentCount: liveData.medicalIncidents?.length || 0,
    },
  };
};

/**
 * Return a quick live stadium summary without AI (fast, data-only).
 *
 * @returns {object} Current crowd, parking, medical, weather, security snapshot
 */
const getSummary = () => {
  logger.info("[DashboardService] Fetching live summary");

  const liveData = generateLiveStatus();

  return {
    timestamp: liveData.timestamp,
    stadiumName: liveData.stadiumName,
    crowd: liveData.overallOccupancy,
    parking: liveData.parking,
    medical: {
      activeIncidents: liveData.medicalIncidents.length,
      incidents: liveData.medicalIncidents,
    },
    weather: liveData.weather,
    security: liveData.security,
    staff: {
      volunteers: liveData.activeVolunteers,
      security: liveData.activeSecurity,
      medical: liveData.activeMedical,
    },
  };
};

module.exports = { generateInsight, getSummary };
