/**
 * StadiumIQ — OpenAI Service
 * Centralized client for OpenAI API interactions using the official SDK.
 */

const { OpenAI } = require("openai");
const logger = require("../utils/logger");
const { AI_MODELS, AI_CONFIG } = require("../constants");
const { AppError } = require("../middleware/errorHandler");

// Initialize OpenAI client dynamically in the function or globally if env is loaded
let openaiClient = null;

const getOpenAIClient = () => {
  if (!openaiClient) {
    if (!process.env.NVIDIA_API_KEY) {
      throw new AppError("NVIDIA_API_KEY is not configured. Please add it to your .env file.", 503);
    }
    openaiClient = new OpenAI({
      apiKey: process.env.NVIDIA_API_KEY,
      baseURL: "https://integrate.api.nvidia.com/v1",
      maxRetries: AI_CONFIG.MAX_RETRIES, // OpenAI SDK has built-in retries
      timeout: 30000, // 30 seconds timeout
    });
  }
  return openaiClient;
};

/**
 * Call the OpenAI API.
 *
 * @param {object} options
 * @param {string} options.systemPrompt - System-level instructions for the AI
 * @param {string} options.userPrompt   - User message / context to analyze
 * @param {string} [options.model]      - AI model ID
 * @param {number} [options.temperature]- Sampling temperature 0–2 (default: 0.7)
 * @param {boolean} [options.jsonMode]  - If true, forces JSON output from the model
 * @param {number} [options.maxTokens]  - Maximum response tokens
 *
 * @returns {Promise<string>} The AI's text response
 * @throws {AppError} If the API returns an error
 */
const callAI = async ({
  systemPrompt,
  userPrompt,
  model = AI_MODELS.DEFAULT,
  temperature = AI_CONFIG.DEFAULT_TEMPERATURE,
  jsonMode = false,
  maxTokens = 4096,
}) => {
  try {
    const openai = getOpenAIClient();
    logger.debug(`[OpenAI] Requesting completion — model: ${model}`);

    const options = {
      model,
      messages: [
        { role: "system", content: systemPrompt },
        { role: "user", content: userPrompt }
      ],
      temperature,
      max_tokens: maxTokens,
    };

    if (jsonMode) {
      options.response_format = { type: "json_object" };
    }

    const response = await openai.chat.completions.create(options);

    const message = response.choices[0]?.message;
    const content = message?.content;
    const reasoning = message?.reasoning_content;

    if (reasoning) {
      logger.debug(`[OpenAI] Reasoning: ${reasoning}`);
    }

    if (!content) {
      throw new Error("OpenAI API returned an empty response.");
    }

    logger.debug(`[OpenAI] Success — response received`);
    return content.trim();

  } catch (error) {
    logger.error(`[OpenAI] API Error: ${error.message}`, { name: error.name, status: error.status });
    
    // Distinguish between bad config vs external API issues
    if (error.status === 401 || error.status === 403) {
      throw new AppError("AI service authentication failed. Check your API key.", 503);
    }
    
    throw new AppError("AI service is temporarily unavailable. Please try again shortly.", 503);
  }
};

/**
 * Parse JSON from an AI response string.
 * Strips any Markdown formatting (e.g., ```json ... ```).
 *
 * @param {string} content - Raw string response from callAI
 * @returns {object} Parsed JSON object
 * @throws {AppError} If the content cannot be parsed
 */
const parseAIJson = (content) => {
  try {
    let cleaned = content.trim();
    if (cleaned.startsWith('```')) {
      cleaned = cleaned.replace(/^```(?:json)?\s*/i, '').replace(/\s*```$/i, '').trim();
    }
    return JSON.parse(cleaned);
  } catch (error) {
    logger.error(`[OpenAI] JSON parsing failed: ${error.message}`, { rawContent: content });
    throw new AppError("AI returned invalid data format. Please retry.", 500);
  }
};

module.exports = { callAI, parseAIJson };
