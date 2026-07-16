const { initializeApp, getApps, cert } = require("firebase-admin/app");
const { getFirestore } = require("firebase-admin/firestore");
const { getAuth } = require("firebase-admin/auth");
const logger = require("../utils/logger");

if (!process.env.FIREBASE_PROJECT_ID || !process.env.FIREBASE_CLIENT_EMAIL || !process.env.FIREBASE_PRIVATE_KEY) {
  logger.error("❌ Missing Firebase credentials in .env file. Please add FIREBASE_PROJECT_ID, FIREBASE_CLIENT_EMAIL, and FIREBASE_PRIVATE_KEY to your .env file.");
  process.exit(1);
}

if (!getApps().length) {
  try {
    // Attempt to parse the private key, handling potential literal \n characters
    let privateKey = process.env.FIREBASE_PRIVATE_KEY;
    if (privateKey) {
      privateKey = privateKey.replace(/\\n/g, "\n");
    }

    initializeApp({
      credential: cert({
        projectId: process.env.FIREBASE_PROJECT_ID,
        clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
        privateKey: privateKey,
      }),
    });
    logger.info("✅ Firebase Admin SDK Initialized");
  } catch (error) {
    logger.error("❌ Failed to initialize Firebase Admin SDK", { error: error.message });
    process.exit(1);
  }
}

const db = getFirestore();
const auth = getAuth();

module.exports = { db, auth };
