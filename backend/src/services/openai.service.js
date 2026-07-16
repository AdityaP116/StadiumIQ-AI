/**
 * StadiumIQ — OpenAI Service
 * The single, reusable OpenAI client for the entire application.
 * All AI features must use this service — never create a second OpenAI instance.
 *
 * Features:
 *   - Configurable model, temperature, system/user prompts
 *   - JSON mode support
 *   - Exponential backoff retry logic
 *   - Centralized error handling and logging
 */

const OpenAI = require("openai");
const logger = require("../utils/logger");
const { AI_MODELS, AI_CONFIG } = require("../constants");
const { AppError } = require("../middleware/errorHandler");

// Lazy-initialized OpenAI client — created on first use, not at module load.
// This allows the server to start even without OPENAI_API_KEY set.
let _openai = null;

const getOpenAIClient = () => {
  if (!_openai) {
    if (!process.env.OPENAI_API_KEY) {
      throw new AppError(
        "OPENAI_API_KEY is not configured. Please add it to your .env file.",
        503
      );
    }
    _openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });
  }
  return _openai;
};

/**
 * Sleep for a given number of milliseconds.
 * @param {number} ms
 * @returns {Promise<void>}
 */
const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

/**
 * Call the OpenAI Chat Completions API with retry logic.
 *
 * @param {object} options
 * @param {string} options.systemPrompt - System-level instructions for the AI
 * @param {string} options.userPrompt - User message / context to analyze
 * @param {string} [options.model] - OpenAI model ID (default: gpt-4o-mini)
 * @param {number} [options.temperature] - Sampling temperature 0–2 (default: 0.7)
 * @param {boolean} [options.jsonMode] - If true, forces JSON output from the model
 * @param {number} [options.maxTokens] - Maximum response tokens
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
      logger.debug(`[OpenAI] Attempt ${attempt} — model: ${model}`);

      const requestParams = {
        model,
        temperature,
        max_tokens: maxTokens,
        messages: [
          { role: "system", content: systemPrompt },
          { role: "user", content: userPrompt },
        ],
      };

      // Enable JSON mode — model must be instructed to return JSON in the system prompt
      if (jsonMode) {
        requestParams.response_format = { type: "json_object" };
      }

      const response = await getOpenAIClient().chat.completions.create(requestParams);

      const content = response.choices[0]?.message?.content;

      if (!content) {
        throw new Error("OpenAI returned an empty response.");
      }

      logger.debug(`[OpenAI] Success — tokens used: ${response.usage?.total_tokens}`);

      return content.trim();
    } catch (error) {
      lastError = error;
      logger.warn(`[OpenAI] Attempt ${attempt} failed: ${error.message}`);

      // Do not retry on authentication or bad request errors
      if (error.status === 401 || error.status === 400) {
        break;
      }

      if (attempt < AI_CONFIG.MAX_RETRIES) {
        // Exponential backoff: 1s → 2s → 4s
        const delay = AI_CONFIG.RETRY_DELAY_MS * Math.pow(2, attempt - 1);
        logger.info(`[OpenAI] Retrying in ${delay}ms...`);
        await sleep(delay);
      }
    }
  }

  logger.error(`[OpenAI] All ${AI_CONFIG.MAX_RETRIES} attempts failed.`, {
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
