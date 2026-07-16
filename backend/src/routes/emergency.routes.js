/**
 * StadiumIQ — Emergency Routes
 * POST /api/emergency/respond
 */

const express = require("express");
const router = express.Router();

const { respond } = require("../controllers/emergency.controller");
const validate = require("../middleware/validate");
const { aiLimiter } = require("../middleware/rateLimiter");
const { validateEmergencyResponse } = require("../validators/emergency.validator");

router.post("/respond", aiLimiter, validate(validateEmergencyResponse), respond);

module.exports = router;
