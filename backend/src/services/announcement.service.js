/**
 * StadiumIQ — Announcement Service
 * Business logic for generating and persisting multilingual stadium announcements.
 */

const { callAI, parseAIJson } = require("./openai.service");
const { buildAnnouncementPrompt } = require("../prompts/announcement.prompt");
const { db } = require("../config/firebase");
const logger = require("../utils/logger");

/**
 * Generate a multilingual stadium announcement and persist it.
 *
 * @param {object} params
 * @param {string} params.type - Announcement type
 * @param {string} params.zone - Target zone
 * @param {string} params.message - Core message to communicate
 * @param {string[]} [params.languages] - Languages to generate in
 * @returns {Promise<object>} Generated announcement + DB record ID
 */
const generateAnnouncement = async ({
  type,
  zone,
  message,
  languages = ["en", "ar"],
}) => {
  logger.info("[AnnouncementService] Generating announcement", { type, zone });

  const { systemPrompt, userPrompt } = buildAnnouncementPrompt({
    type,
    zone,
    message,
    languages,
  });

  const aiResponse = await callAI({
    systemPrompt,
    userPrompt,
    jsonMode: true,
    temperature: 0.5,
  });

  const announcementData = parseAIJson(aiResponse);

  const announcementRef = db.collection("announcements").doc();
  const announcementId = announcementRef.id;
  const generatedAt = new Date().toISOString();
  
  const finalType = announcementData.type || type;
  const finalZone = announcementData.zone || zone;
  const finalAnnouncements = announcementData.announcements || {};
  const finalUrgencyLevel = announcementData.urgencyLevel || "LOW";
  const finalRecommendedRepetitions = announcementData.recommendedRepetitions || 1;

  await announcementRef.set({
    announcementId,
    type: finalType,
    zone: finalZone,
    coreMessage: message,
    announcements: finalAnnouncements,
    urgencyLevel: finalUrgencyLevel,
    recommendedRepetitions: finalRecommendedRepetitions,
    notes: announcementData.notes || null,
    generatedAt,
  });

  logger.info("[AnnouncementService] Announcement generated and saved to Firestore", { id: announcementId });

  return {
    announcementId,
    type: finalType,
    zone: finalZone,
    announcements: finalAnnouncements,
    urgencyLevel: finalUrgencyLevel,
    recommendedRepetitions: finalRecommendedRepetitions,
    notes: announcementData.notes,
    generatedAt,
  };
};

module.exports = { generateAnnouncement };
