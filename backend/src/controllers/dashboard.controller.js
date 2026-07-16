/**
 * StadiumIQ — Dashboard Controller
 */

const { generateInsight, getSummary } = require("../services/dashboard.service");
const { sendSuccess } = require("../utils/responseHandler");
const asyncWrapper = require("../utils/asyncWrapper");

/**
 * POST /api/dashboard/insight
 * AI-powered executive operational intelligence report.
 */
const insight = asyncWrapper(async (req, res) => {
  const result = await generateInsight(req.body);
  return sendSuccess(res, result, "Dashboard insight generated successfully.");
});

/**
 * GET /api/dashboard/summary
 * Fast, data-only stadium summary (no AI call).
 */
const summary = asyncWrapper(async (req, res) => {
  const result = getSummary();
  return sendSuccess(res, result, "Dashboard summary retrieved successfully.");
});

module.exports = { insight, summary };
