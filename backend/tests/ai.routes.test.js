jest.mock("../src/config/firebase", () => ({
  db: {
    collection: jest.fn().mockReturnValue({
      doc: jest.fn().mockReturnValue({
        id: "mock-doc-id",
        set: jest.fn().mockResolvedValue({}),
        get: jest.fn().mockResolvedValue({
          exists: true,
          data: () => ({})
        })
      })
    })
  },
  auth: {
    verifyIdToken: jest.fn().mockResolvedValue({ uid: "mock-uid", email: "test@example.com" })
  }
}));

const request = require("supertest");
const app = require("../src/app");

jest.mock("../src/services/openai.service", () => ({
  callAI: jest.fn().mockResolvedValue("Mock AI Response"),
  parseAIJson: jest.fn(),
}));

describe("AI Chat API", () => {
  it("POST /api/ai/chat should return validation error for missing message", async () => {
    const response = await request(app)
      .post("/api/ai/chat")
      .send({});
    expect(response.status).toBe(400);
    expect(response.body.success).toBe(false);
    expect(response.body.errors).toContain("'message' is required and must be a non-empty string.");
  });

  it("POST /api/ai/chat should respond successfully for valid message", async () => {
    const response = await request(app)
      .post("/api/ai/chat")
      .send({ message: "Where is Section A?", language: "en" });
    expect(response.status).toBe(200);
    expect(response.body.success).toBe(true);
    expect(response.body.data).toHaveProperty("response", "Mock AI Response");
  });
});
