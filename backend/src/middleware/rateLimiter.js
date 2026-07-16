/**
 * StadiumIQ — Rate Limiter Middleware
 * Configures and exports rate limiters to protect the API from abuse.
 */

const rateLimit = require("express-rate-limit");
const { RATE_LIMIT, HTTP_STATUS } = require("../constants");

/**
 * General API rate limiter — applied globally to all routes.
 */
const generalLimiter = rateLimit({
  windowMs: RATE_LIMIT.WINDOW_MS,
  max: RATE_LIMIT.MAX_REQUESTS,
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    success: false,
    message: "Too many requests. Please try again later.",
    errors: [],
  },
  statusCode: HTTP_STATUS.TOO_MANY_REQUESTS,
});

/**
 * Strict AI rate limiter — applied to OpenAI-powered endpoints.
 * More restrictive to prevent excessive AI API costs.
 */
const aiLimiter = rateLimit({
  windowMs: RATE_LIMIT.AI_WINDOW_MS,
  max: RATE_LIMIT.AI_MAX_REQUESTS,
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    success: false,
    message: "AI request limit reached. Please wait before sending another request.",
    errors: [],
  },
  statusCode: HTTP_STATUS.TOO_MANY_REQUESTS,
});

module.exports = { generalLimiter, aiLimiter };
