/**
 * StadiumIQ — Dashboard Routes
 * POST /api/dashboard/insight
 * GET  /api/dashboard/summary
 */

const express = require("express");
const router = express.Router();

const { insight, summary } = require("../controllers/dashboard.controller");
const { aiLimiter } = require("../middleware/rateLimiter");

// AI-powered insight — rate limited
router.post("/insight", aiLimiter, insight);

// Fast data-only summary — general rate limit only (applied globally in app.js)
router.get("/summary", summary);

module.exports = router;
