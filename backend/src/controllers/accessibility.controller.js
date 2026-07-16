/**
 * StadiumIQ — Accessibility Controller
 */

const { getAccessibleAssistance } = require("../services/accessibility.service");
const { sendSuccess } = require("../utils/responseHandler");
const asyncWrapper = require("../utils/asyncWrapper");

/**
 * POST /api/accessibility/assist
 */
const assist = asyncWrapper(async (req, res) => {
  const { need, currentLocation, destination } = req.body;

  const result = await getAccessibleAssistance({ need, currentLocation, destination });

  return sendSuccess(res, result, "Accessibility assistance generated successfully.");
});

module.exports = { assist };
