const express = require("express");
const router = express.Router();
const { getProfile, updateProfile } = require("../controllers/userController");
const { verifyToken } = require("../middleware/auth.middleware");

// All user routes should be protected by the verifyToken middleware
router.use(verifyToken);

// GET /api/users/profile
router.get("/profile", getProfile);

// PUT /api/users/profile
router.put("/profile", updateProfile);

module.exports = router;
