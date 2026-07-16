/**
 * StadiumIQ — Navigation Routes
 * POST /api/navigation/route
 */

const express = require("express");
const router = express.Router();

const { getNavigationRoute } = require("../controllers/navigation.controller");
const validate = require("../middleware/validate");
const { aiLimiter } = require("../middleware/rateLimiter");
const { validateNavigationRoute } = require("../validators/navigation.validator");

router.post("/route", aiLimiter, validate(validateNavigationRoute), getNavigationRoute);

module.exports = router;
