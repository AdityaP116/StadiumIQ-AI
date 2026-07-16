/**
 * StadiumIQ — Live Status Controller
 * Serves simulated live stadium metrics without an AI call (instant response).
 */

const { generateLiveStatus } = require("../utils/fakeDataGenerator");
const { sendSuccess } = require("../utils/responseHandler");
const asyncWrapper = require("../utils/asyncWrapper");

/**
 * GET /api/live/status
 */
const getLiveStatus = asyncWrapper(async (req, res) => {
  const status = generateLiveStatus();
  return sendSuccess(res, status, "Live stadium status retrieved successfully.");
});

module.exports = { getLiveStatus };
