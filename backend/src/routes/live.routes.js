/**
 * StadiumIQ — Live Status Routes
 * GET /api/live/status
 */

const express = require("express");
const router = express.Router();

const { getLiveStatus } = require("../controllers/live.controller");

router.get("/status", getLiveStatus);

module.exports = router;
