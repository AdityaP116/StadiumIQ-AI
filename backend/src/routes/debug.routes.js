/**
 * StadiumIQ — Debug Routes
 * Temporary diagnostic endpoints for verifying backend integrations.
 */

const express = require("express");
const { callAI, parseAIJson } = require("../services/openai.service");
const logger = require("../utils/logger");

const router = express.Router();

/**
 * @route   GET /api/debug/genai
 * @desc    Diagnose NVIDIA GenAI Integration
 * @access  Public (Development Only)
 */
router.get("/genai", async (req, res) => {
  const diagnostic = {
    envLoaded: false,
    reachable: false,
    modelConfigured: true, // Assuming constants are loaded if this file runs
    sdkInitialized: true,  // Fetch is built-in
    testPromptSuccess: false,
    responseLatencyMs: 0,
    errorDetails: null,
  };

  try {
    // 1. Verify Env
    if (process.env.NVIDIA_API_KEY) {
      diagnostic.envLoaded = true;
    } else {
      throw new Error("NVIDIA_API_KEY is missing from environment variables.");
    }

    // 2. Test Prompt & Reachability
    const start = Date.now();
    
    const aiResponse = await callAI({
      systemPrompt: "You are a helpful diagnostic assistant. You must reply strictly in JSON format.",
      userPrompt: "Return a JSON object with a single key 'status' set to 'ok'.",
      jsonMode: true,
      maxTokens: 50
    });

    diagnostic.reachable = true;
    diagnostic.responseLatencyMs = Date.now() - start;

    // 3. Test JSON Parsing
    const parsed = parseAIJson(aiResponse);
    if (parsed && parsed.status === 'ok') {
      diagnostic.testPromptSuccess = true;
    } else {
      throw new Error("Parsed JSON did not match expected output.");
    }

    logger.info("[Debug] GenAI diagnostic test passed successfully.");
    res.status(200).json({ success: true, diagnostic, data: parsed });

  } catch (error) {
    diagnostic.errorDetails = error.message;
    logger.error(`[Debug] GenAI diagnostic test failed: ${error.message}`);
    res.status(500).json({ success: false, diagnostic });
  }
});

module.exports = router;
