/**
 * StadiumIQ — Transport Controller
 */

const { recommendTransport } = require("../services/transport.service");
const { sendSuccess } = require("../utils/responseHandler");
const asyncWrapper = require("../utils/asyncWrapper");

/**
 * POST /api/transport/recommend
 */
const recommend = asyncWrapper(async (req, res) => {
  const { userLocation, destination, preferences } = req.body;

  const result = await recommendTransport({ userLocation, destination, preferences });

  return sendSuccess(res, result, "Transport recommendation generated successfully.");
});

module.exports = { recommend };
