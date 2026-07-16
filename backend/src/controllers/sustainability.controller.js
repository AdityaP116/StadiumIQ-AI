/**
 * StadiumIQ — Sustainability Controller
 */

const { getTips } = require("../services/sustainability.service");
const { sendSuccess } = require("../utils/responseHandler");
const asyncWrapper = require("../utils/asyncWrapper");

/**
 * POST /api/sustainability/tips
 */
const tips = asyncWrapper(async (req, res) => {
  const { targetAudience, specificConcern } = req.body;

  const result = await getTips({ targetAudience, specificConcern });

  return sendSuccess(res, result, "Sustainability tips generated successfully.");
});

module.exports = { tips };
