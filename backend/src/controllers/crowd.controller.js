/**
 * StadiumIQ — Crowd Controller
 */

const { analyzeCrowd } = require("../services/crowd.service");
const { sendSuccess } = require("../utils/responseHandler");
const asyncWrapper = require("../utils/asyncWrapper");

/**
 * POST /api/crowd/analyze
 */
const analyze = asyncWrapper(async (req, res) => {
  const { gateOccupancy, parking, medicalIncidents, weather, security } = req.body;

  const result = await analyzeCrowd({ gateOccupancy, parking, medicalIncidents, weather, security });

  return sendSuccess(res, result, "Crowd analysis completed successfully.");
});

module.exports = { analyze };
