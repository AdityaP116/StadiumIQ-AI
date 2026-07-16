/**
 * StadiumIQ — Transport Routes
 * POST /api/transport/recommend
 */

const express = require("express");
const router = express.Router();

const { recommend } = require("../controllers/transport.controller");
const { aiLimiter } = require("../middleware/rateLimiter");
const validate = require("../middleware/validate");
const { validateTransportRecommend } = require("../validators/transport.validator");

router.post("/recommend", aiLimiter, validate(validateTransportRecommend), recommend);

module.exports = router;
