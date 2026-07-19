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
  callAI: jest.fn().mockResolvedValue('{"plan": "mock emergency response plan"}'),
  parseAIJson: jest.fn().mockReturnValue({ plan: "mock emergency response plan" }),
}));

describe("Emergency Routes API", () => {
  it("POST /api/emergency/respond should return emergency response plan", async () => {
    const response = await request(app)
      .post("/api/emergency/respond")
      .send({ emergencyType: "medical", zone: "North Stand" });
    expect(response.status).toBe(200);
    expect(response.body.success).toBe(true);
    expect(response.body.data).toHaveProperty("responsePlan");
  });
});
