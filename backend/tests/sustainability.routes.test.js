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
  callAI: jest.fn().mockResolvedValue('{"tips": ["Recycle your plastic", "Use reusable cups"]}'),
  parseAIJson: jest.fn().mockReturnValue({ tips: ["Recycle your plastic", "Use reusable cups"] }),
}));

describe("Sustainability Routes API", () => {
  it("POST /api/sustainability/tips should return tips list", async () => {
    const response = await request(app)
      .post("/api/sustainability/tips")
      .send({ targetAudience: "fans" });
    expect(response.status).toBe(200);
    expect(response.body.success).toBe(true);
    expect(response.body.data).toHaveProperty("tips");
  });
});
