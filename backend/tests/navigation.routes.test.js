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
  callAI: jest.fn().mockResolvedValue("mock navigation route"),
  parseAIJson: jest.fn(),
}));

describe("Navigation Routes API", () => {
  it("POST /api/navigation/route should return navigation plan", async () => {
    const response = await request(app)
      .post("/api/navigation/route")
      .send({ currentLocation: "Gate A", destination: "Section B" });
    expect(response.status).toBe(200);
    expect(response.body.success).toBe(true);
    expect(response.body.data).toHaveProperty("route", "mock navigation route");
  });
});
