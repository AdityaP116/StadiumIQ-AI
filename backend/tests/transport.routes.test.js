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
  callAI: jest.fn().mockResolvedValue('{"recommendations": ["Metro", "Bus"]}'),
  parseAIJson: jest.fn().mockReturnValue({ recommendations: ["Metro", "Bus"] }),
}));

describe("Transport Routes API", () => {
  it("POST /api/transport/recommend should return transport options", async () => {
    const response = await request(app)
      .post("/api/transport/recommend")
      .send({ userLocation: "Exit Gate 3", destination: "City Center" });
    expect(response.status).toBe(200);
    expect(response.body.success).toBe(true);
    expect(response.body.data).toHaveProperty("recommendation");
  });
});
