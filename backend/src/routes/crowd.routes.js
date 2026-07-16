/**
 * StadiumIQ — Crowd Routes
 * POST /api/crowd/analyze
 */

const express = require("express");
const router = express.Router();

const { analyze } = require("../controllers/crowd.controller");
const validate = require("../middleware/validate");
const { aiLimiter } = require("../middleware/rateLimiter");
const { validateCrowdAnalysis } = require("../validators/crowd.validator");

router.post("/analyze", aiLimiter, validate(validateCrowdAnalysis), analyze);

module.exports = router;
