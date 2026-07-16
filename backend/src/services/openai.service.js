/**
 * StadiumIQ — Gemini AI Service
 * The single, reusable Gemini AI client for the entire application.
 * All AI features must use this service — never create a second Gemini instance.
 *
 * Features:
 *   - Configurable model, temperature, system/user prompts
 *   - JSON mode support (responseMimeType: application/json)
 *   - Exponential backoff retry logic
 *   - Centralized error handling and logging
 *
 * NOTE: Keeps the same callAI / parseAIJson interface as the former OpenAI service
 * so no other files in the project needed to change.
 */

const { GoogleGenerativeAI } = require("@google/generative-ai");
const logger = require("../utils/logger");
const { AI_MODELS, AI_CONFIG } = require("../constants");
const { AppError } = require("../middleware/errorHandler");

// Lazy-initialized Gemini client — created on first use, not at module load.
// This allows the server to start even without GEMINI_API_KEY set.
let _genAI = null;

const getGeminiClient = () => {
  if (!_genAI) {
    if (!process.env.GEMINI_API_KEY) {
      throw new AppError(
        "GEMINI_API_KEY is not configured. Please add it to your .env file.",
        503
      );
    }
    _genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
  }
  return _genAI;
};

/**
 * Sleep for a given number of milliseconds.
 * @param {number} ms
 * @returns {Promise<void>}
 */
const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

/**
 * Call the Gemini API with retry logic.
 *
 * @param {object} options
 * @param {string} options.systemPrompt - System-level instructions for the AI
 * @param {string} options.userPrompt   - User message / context to analyze
 * @param {string} [options.model]      - Gemini model ID (default: gemini-2.0-flash)
 * @param {number} [options.temperature]- Sampling temperature 0–2 (default: 0.7)
 * @param {boolean} [options.jsonMode]  - If true, forces JSON output from the model
 * @param {number} [options.maxTokens]  - Maximum response tokens
 *
 * @returns {Promise<string>} The AI's text response
 * @throws {AppError} If all retries are exhausted or the API returns an error
 */
const callAI = async ({
  systemPrompt,
  userPrompt,
  model = AI_MODELS.DEFAULT,
  temperature = AI_CONFIG.DEFAULT_TEMPERATURE,
  jsonMode = false,
  maxTokens = 1500,
}) => {
  let lastError;

  for (let attempt = 1; attempt <= AI_CONFIG.MAX_RETRIES; attempt++) {
    try {
      logger.debug(`[Gemini] Attempt ${attempt} — model: ${model}`);

      const genAI = getGeminiClient();

      const generationConfig = {
        temperature,
        maxOutputTokens: maxTokens,
      };

      // Enable JSON mode — instructs Gemini to return valid JSON
      if (jsonMode) {
        generationConfig.responseMimeType = "application/json";
      }

      const geminiModel = genAI.getGenerativeModel({
        model,
        systemInstruction: systemPrompt,
        generationConfig,
      });

      const result = await geminiModel.generateContent(userPrompt);
      const content = result.response.text();

      if (!content) {
        throw new Error("Gemini returned an empty response.");
      }

      logger.debug(`[Gemini] Success — response received`);

      return content.trim();
    } catch (error) {
      lastError = error;
      logger.warn(`[Gemini] Attempt ${attempt} failed: ${error.message}`);

      // Do not retry on authentication or bad request errors
      if (error.status === 401 || error.status === 400 || error.status === 403) {
        break;
      }

      if (attempt < AI_CONFIG.MAX_RETRIES) {
        // Exponential backoff: 1s → 2s → 4s
        const delay = AI_CONFIG.RETRY_DELAY_MS * Math.pow(2, attempt - 1);
        logger.info(`[Gemini] Retrying in ${delay}ms...`);
        await sleep(delay);
      }
    }
  }

  logger.error(`[Gemini] All ${AI_CONFIG.MAX_RETRIES} attempts failed.`, {
    error: lastError?.message,
  });

  throw new AppError(
    "AI service is temporarily unavailable. Please try again shortly.",
    503
  );
};

/**
 * Parse JSON from an AI response string.
 * Use when jsonMode was enabled and you need a JavaScript object.
 *
 * @param {string} content - Raw string response from callAI
 * @returns {object} Parsed JSON object
 * @throws {AppError} If the content cannot be parsed
 */
const parseAIJson = (content) => {
  try {
    return JSON.parse(content);
  } catch {
    throw new AppError("AI returned invalid JSON. Please retry.", 500);
  }
};

module.exports = { callAI, parseAIJson };
