/**
 * StadiumIQ — AI Fan Assistant Controller
 * Thin controller: validates → calls service → returns response.
 */

const { processChat } = require("../services/fan.service");
const { sendSuccess } = require("../utils/responseHandler");
const asyncWrapper = require("../utils/asyncWrapper");

/**
 * POST /api/ai/chat
 * Handle a fan's chat message and return an AI response.
 */
const chat = asyncWrapper(async (req, res) => {
  const { message, language, userLocation } = req.body;

  const result = await processChat({ message, language, userLocation });

  return sendSuccess(res, result, "Fan assistant response generated successfully.");
});

module.exports = { chat };
