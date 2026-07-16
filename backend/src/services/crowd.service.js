/**
 * StadiumIQ — Crowd Service
 * Business logic for crowd intelligence analysis.
 * Calls AI and persists results to the database.
 */

const { callAI, parseAIJson } = require("./openai.service");
const { buildCrowdPrompt } = require("../prompts/crowd.prompt");
const { generateLiveStatus } = require("../utils/fakeDataGenerator");
const { db } = require("../config/firebase");
const logger = require("../utils/logger");

/**
 * Analyze current crowd conditions and generate operational intelligence.
 * Optionally accepts live data; falls back to simulated data if not provided.
 *
 * @param {object} [inputData] - Optional crowd data to analyze
 * @param {Array}  [inputData.gateOccupancy]
 * @param {Array}  [inputData.parking]
 * @param {Array}  [inputData.medicalIncidents]
 * @param {object} [inputData.weather]
 * @param {object} [inputData.security]
 * @returns {Promise<object>} AI analysis + snapshot
 */
const analyzeCrowd = async (inputData = {}) => {
  logger.info("[CrowdService] Starting crowd analysis");

  // Use provided data or generate simulated data
  const liveData = generateLiveStatus();
  const gateOccupancy = inputData.gateOccupancy || liveData.gates;
  const parking = inputData.parking || liveData.parking;
  const medicalIncidents = inputData.medicalIncidents || liveData.medicalIncidents;
  const weather = inputData.weather || liveData.weather;
  const security = inputData.security || liveData.security;

  const { systemPrompt, userPrompt } = buildCrowdPrompt({
    gateOccupancy,
    parking,
    medicalIncidents,
    weather,
    security,
  });

  const aiResponse = await callAI({
    systemPrompt,
    userPrompt,
    jsonMode: true,
    temperature: 0.4,
  });

  const aiAnalysis = parseAIJson(aiResponse);

  const analysisRef = db.collection("crowdSnapshots").doc();
  const analysisId = analysisRef.id;
  const generatedAt = new Date().toISOString();
  const snapshot = {
    overallOccupancy: liveData.overallOccupancy,
    gates: gateOccupancy,
  };

  await analysisRef.set({
    analysisId,
    snapshot,
    analysis: aiAnalysis,
    generatedAt,
  });

  logger.info("[CrowdService] Analysis complete and saved to Firestore", { id: analysisId });

  return {
    analysisId,
    snapshot,
    analysis: aiAnalysis,
    generatedAt,
  };
};

module.exports = { analyzeCrowd };
