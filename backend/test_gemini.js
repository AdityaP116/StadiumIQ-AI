require("dotenv").config({ path: "./.env" });
const { callAI } = require("./src/services/openai.service");

async function run() {
  try {
    console.log("Calling Gemini API...");
    const res = await callAI({
      systemPrompt: "You are a helpful assistant.",
      userPrompt: "Say hello!",
    });
    console.log("Response:", res);
  } catch (err) {
    console.error("Error:", err);
  }
}

run();
