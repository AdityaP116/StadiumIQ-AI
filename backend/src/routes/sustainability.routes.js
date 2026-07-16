/**
 * StadiumIQ — Sustainability Routes
 * POST /api/sustainability/tips
 */

const express = require("express");
const router = express.Router();

const { tips } = require("../controllers/sustainability.controller");
const { aiLimiter } = require("../middleware/rateLimiter");
const validate = require("../middleware/validate");
const { validateSustainabilityTips } = require("../validators/sustainability.validator");

router.post("/tips", aiLimiter, validate(validateSustainabilityTips), tips);

module.exports = router;
