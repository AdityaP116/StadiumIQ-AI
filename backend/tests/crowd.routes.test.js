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
  callAI: jest.fn().mockResolvedValue('{"analysis": "mock crowd analysis", "riskLevel": "Low"}'),
  parseAIJson: jest.fn().mockReturnValue({ analysis: "mock crowd analysis", riskLevel: "Low" }),
}));

describe("Crowd Routes API", () => {
  it("POST /api/crowd/analyze should return 200 and return crowd analysis", async () => {
    const response = await request(app)
      .post("/api/crowd/analyze")
      .send({ gateId: "Gate 1", currentOccupancy: 450 });
    expect(response.status).toBe(200);
    expect(response.body.success).toBe(true);
    expect(response.body.data.analysis).toHaveProperty("analysis", "mock crowd analysis");
  });
});
