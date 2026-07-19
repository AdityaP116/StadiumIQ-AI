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
  callAI: jest.fn().mockResolvedValue('{"insight": "mock dashboard insight"}'),
  parseAIJson: jest.fn().mockReturnValue({ insight: "mock dashboard insight" }),
}));

describe("Dashboard Routes API", () => {
  it("POST /api/dashboard/insight should return AI dashboard insights", async () => {
    const response = await request(app)
      .post("/api/dashboard/insight")
      .send({});
    expect(response.status).toBe(200);
    expect(response.body.success).toBe(true);
    expect(response.body.data).toHaveProperty("insight");
  });

  it("GET /api/dashboard/summary should return fast status summary", async () => {
    const response = await request(app)
      .get("/api/dashboard/summary");
    expect(response.status).toBe(200);
    expect(response.body.success).toBe(true);
    expect(response.body.data).toHaveProperty("crowd");
  });
});
