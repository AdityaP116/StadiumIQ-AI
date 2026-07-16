/**
 * StadiumIQ — Emergency Service
 * Business logic for emergency response planning.
 * Calls AI and persists to EmergencyLog for audit trail.
 */

const { callAI, parseAIJson } = require("./openai.service");
const { buildEmergencyPrompt } = require("../prompts/emergency.prompt");
const { generateLiveStatus } = require("../utils/fakeDataGenerator");
const { db } = require("../config/firebase");
const logger = require("../utils/logger");

/**
 * Generate an AI emergency response plan and log it to the database.
 *
 * @param {object} params
 * @param {string} params.emergencyType - Type of emergency
 * @param {string} params.zone - Affected zone
 * @param {string} [params.severity] - Severity level
 * @param {string} [params.description] - Additional details
 * @returns {Promise<object>} Emergency response plan + log ID
 */
const respondToEmergency = async ({
  emergencyType,
  zone,
  severity = "Moderate",
  description = "",
}) => {
  logger.warn("[EmergencyService] Emergency response triggered", {
    emergencyType,
    zone,
    severity,
  });

  // Get live stadium context to inform the response
  const liveData = generateLiveStatus();

  const { systemPrompt, userPrompt } = buildEmergencyPrompt({
    emergencyType,
    zone,
    severity,
    description,
    liveData,
  });

  const aiResponse = await callAI({
    systemPrompt,
    userPrompt,
    jsonMode: true,
    temperature: 0.3, // Low temp for consistent emergency responses
    maxTokens: 2500,
  });

  const responsePlan = parseAIJson(aiResponse);

  const logRef = db.collection("emergencyLogs").doc();
  const logId = logRef.id;
  const generatedAt = new Date().toISOString();

  await logRef.set({
    logId,
    emergencyType,
    zone,
    severity,
    responsePlan,
    description,
    generatedAt,
  });

  logger.info("[EmergencyService] Emergency log generated and saved to Firestore", { id: logId });

  return {
    logId,
    emergencyType,
    zone,
    severity,
    responsePlan,
    generatedAt,
  };
};

module.exports = { respondToEmergency };
