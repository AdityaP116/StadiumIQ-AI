/**
 * StadiumIQ — AI Routes
 * POST /api/ai/chat
 */

const express = require("express");
const router = express.Router();

const { chat } = require("../controllers/ai.controller");
const validate = require("../middleware/validate");
const { aiLimiter } = require("../middleware/rateLimiter");
const { validateFanChat } = require("../validators/fan.validator");

router.post("/chat", aiLimiter, validate(validateFanChat), chat);

module.exports = router;
