/**
 * StadiumIQ — Emergency Controller
 */

const { respondToEmergency } = require("../services/emergency.service");
const { sendSuccess } = require("../utils/responseHandler");
const asyncWrapper = require("../utils/asyncWrapper");

/**
 * POST /api/emergency/respond
 */
const respond = asyncWrapper(async (req, res) => {
  const { emergencyType, zone, severity, description } = req.body;

  const result = await respondToEmergency({ emergencyType, zone, severity, description });

  return sendSuccess(res, result, "Emergency response plan generated successfully.");
});

module.exports = { respond };
