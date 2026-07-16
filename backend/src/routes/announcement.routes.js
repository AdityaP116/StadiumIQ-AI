/**
 * StadiumIQ — Announcement Routes
 * POST /api/announcement/generate
 */

const express = require("express");
const router = express.Router();

const { generate } = require("../controllers/announcement.controller");
const validate = require("../middleware/validate");
const { aiLimiter } = require("../middleware/rateLimiter");
const { validateAnnouncement } = require("../validators/announcement.validator");

router.post("/generate", aiLimiter, validate(validateAnnouncement), generate);

module.exports = router;
