/**
 * StadiumIQ — NVIDIA NIM AI Service
 * The single, reusable AI client for the entire application.
 * Replaces the previous Gemini implementation while maintaining the same interface.
 *
 * Features:
 *   - Configurable model, temperature, system/user prompts
 *   - JSON mode support (using response_format: { type: "json_object" })
 *   - Exponential backoff retry logic
 *   - Centralized error handling and logging
 */

const logger = require("../utils/logger");
const { AI_MODELS, AI_CONFIG } = require("../constants");
const { AppError } = require("../middleware/errorHandler");

/**
 * Sleep for a given number of milliseconds.
 * @param {number} ms
 * @returns {Promise<void>}
 */
const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

/**
 * Call the NVIDIA NIM API with retry logic.
 *
 * @param {object} options
 * @param {string} options.systemPrompt - System-level instructions for the AI
 * @param {string} options.userPrompt   - User message / context to analyze
 * @param {string} [options.model]      - AI model ID (default: meta/llama-3.1-70b-instruct)
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

  if (!process.env.NVIDIA_API_KEY) {
    throw new AppError(
      "NVIDIA_API_KEY is not configured. Please add it to your .env file.",
      503
    );
  }

  for (let attempt = 1; attempt <= AI_CONFIG.MAX_RETRIES; attempt++) {
    try {
      logger.debug(`[NVIDIA AI] Attempt ${attempt} — model: ${model}`);

      const body = {
        model,
        messages: [
          { role: "system", content: systemPrompt },
          { role: "user", content: userPrompt }
        ],
        temperature,
        max_tokens: maxTokens,
      };

      // In NVIDIA API (OpenAI-compatible), JSON mode is usually requested this way:
      // Note: Llama 3 on NIM usually supports this, but it requires the prompt to also explicitly ask for JSON.
      // (The system prompts already ask for JSON).
      if (jsonMode) {
         body.response_format = { type: "json_object" };
      }

      const response = await fetch("https://integrate.api.nvidia.com/v1/chat/completions", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${process.env.NVIDIA_API_KEY}`,
        },
        body: JSON.stringify(body)
      });

      if (!response.ok) {
        const errText = await response.text();
        const error = new Error(`NVIDIA API Error: ${response.status} - ${errText}`);
        error.status = response.status;
        throw error;
      }

      const data = await response.json();
      const content = data.choices[0]?.message?.content;

      if (!content) {
        throw new Error("NVIDIA API returned an empty response.");
      }

      logger.debug(`[NVIDIA AI] Success — response received`);

      return content.trim();
    } catch (error) {
      lastError = error;
      logger.warn(`[NVIDIA AI] Attempt ${attempt} failed: ${error.message}`);

      // Do not retry on authentication or bad request errors
      if (error.status === 401 || error.status === 400 || error.status === 403) {
        break;
      }

      if (attempt < AI_CONFIG.MAX_RETRIES) {
        // Exponential backoff: 1s → 2s → 4s
        const delay = AI_CONFIG.RETRY_DELAY_MS * Math.pow(2, attempt - 1);
        logger.info(`[NVIDIA AI] Retrying in ${delay}ms...`);
        await sleep(delay);
      }
    }
  }

  logger.error(`[NVIDIA AI] All ${AI_CONFIG.MAX_RETRIES} attempts failed.`, {
    error: lastError?.message,
  });

  throw new AppError(
    "AI service is temporarily unavailable. Please try again shortly.",
    503
  );
};

/**
 * Parse JSON from an AI response string.
 * Strips any Markdown formatting (e.g., ```json ... ```) that Llama models sometimes return.
 *
 * @param {string} content - Raw string response from callAI
 * @returns {object} Parsed JSON object
 * @throws {AppError} If the content cannot be parsed
 */
const parseAIJson = (content) => {
  try {
    // Strip markdown wrappers if they exist
    let cleaned = content.trim();
    if (cleaned.startsWith('```')) {
      cleaned = cleaned.replace(/^```(?:json)?\s*/i, '').replace(/\s*```$/i, '').trim();
    }
    return JSON.parse(cleaned);
  } catch (error) {
    logger.error(`[NVIDIA AI] JSON parsing failed: ${error.message}`, { rawContent: content });
    throw new AppError("AI returned invalid data format. Please retry.", 500);
  }
};

module.exports = { callAI, parseAIJson };
