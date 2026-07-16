const { auth } = require("../config/firebase");
const logger = require("../utils/logger");

/**
 * Middleware to verify Firebase ID tokens
 */
const verifyToken = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      logger.warn(`Auth failed. Authorization header missing or malformed.`);
      return res.status(401).json({ 
        success: false,
        message: "Unauthorized: Missing or invalid Bearer token"
      });
    }

    const idToken = authHeader.split("Bearer ")[1];
    
    // Verify the token with Firebase Admin
    const decodedToken = await auth.verifyIdToken(idToken);
    
    // Attach the decoded token (user info) to the request object
    req.user = decodedToken;
    
    next();
  } catch (error) {
    logger.error("Token verification failed", { error: error.message });
    return res.status(401).json({ success: false, message: "Unauthorized: Invalid token" });
  }
};

module.exports = { verifyToken };
