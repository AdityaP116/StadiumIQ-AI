/**
 * StadiumIQ — Navigation Controller
 */

const { getRoute } = require("../services/navigation.service");
const { sendSuccess } = require("../utils/responseHandler");
const asyncWrapper = require("../utils/asyncWrapper");

/**
 * POST /api/navigation/route
 */
const getNavigationRoute = asyncWrapper(async (req, res) => {
  const { currentLocation, destination } = req.body;

  const result = await getRoute({ currentLocation, destination });

  return sendSuccess(res, result, "Navigation route generated successfully.");
});

module.exports = { getNavigationRoute };
