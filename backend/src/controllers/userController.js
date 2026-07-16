const { db } = require("../config/firebase");
const { sendSuccess, sendError } = require("../utils/responseHandler");
const asyncWrapper = require("../utils/asyncWrapper");
const logger = require("../utils/logger");

/**
 * GET /api/users/profile
 * Get the currently authenticated user's profile from Firestore
 */
const getProfile = asyncWrapper(async (req, res) => {
  const uid = req.user.uid;
  const userRef = db.collection("users").doc(uid);
  const doc = await userRef.get();

  if (!doc.exists) {
    // Return basic token info if profile not in Firestore yet
    return sendSuccess(res, {
      uid: req.user.uid,
      email: req.user.email,
      name: req.user.name || "",
    }, "Profile not found in database — returning token info");
  }

  return sendSuccess(res, doc.data(), "User profile retrieved successfully.");
});

/**
 * PUT /api/users/profile
 * Update or create the user's profile in Firestore
 */
const updateProfile = asyncWrapper(async (req, res) => {
  const uid = req.user.uid;
  const { name, age, phone } = req.body;

  const userRef = db.collection("users").doc(uid);

  // Use merge: true to update existing fields or create if not exists
  await userRef.set({
    uid,
    email: req.user.email,
    name: name || req.user.name || "",
    age: age || null,
    phone: phone || null,
    updatedAt: new Date().toISOString(),
  }, { merge: true });

  const updatedDoc = await userRef.get();

  return sendSuccess(res, updatedDoc.data(), "Profile updated successfully.");
});

module.exports = {
  getProfile,
  updateProfile,
};
