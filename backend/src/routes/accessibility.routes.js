/**
 * StadiumIQ — Accessibility Routes
 * POST /api/accessibility/assist
 */

const express = require("express");
const router = express.Router();

const { assist } = require("../controllers/accessibility.controller");
const { aiLimiter } = require("../middleware/rateLimiter");
const validate = require("../middleware/validate");
const { validateAccessibilityAssist } = require("../validators/accessibility.validator");

router.post("/assist", aiLimiter, validate(validateAccessibilityAssist), assist);

module.exports = router;
