/**
 * StadiumIQ — Announcement Controller
 */

const { generateAnnouncement } = require("../services/announcement.service");
const { sendSuccess } = require("../utils/responseHandler");
const asyncWrapper = require("../utils/asyncWrapper");

/**
 * POST /api/announcement/generate
 */
const generate = asyncWrapper(async (req, res) => {
  const { type, zone, message, languages } = req.body;

  const result = await generateAnnouncement({ type, zone, message, languages });

  return sendSuccess(res, result, "Announcement generated successfully.", 201);
});

module.exports = { generate };
