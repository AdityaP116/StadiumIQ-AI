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
  callAI: jest.fn().mockResolvedValue('{"assistance": "mock accessibility assistance"}'),
  parseAIJson: jest.fn().mockReturnValue({ assistance: "mock accessibility assistance" }),
}));

describe("Accessibility Routes API", () => {
  it("POST /api/accessibility/assist should return accessibility help details", async () => {
    const response = await request(app)
      .post("/api/accessibility/assist")
      .send({ need: "wheelchair", currentLocation: "Entrance Gate" });
    expect(response.status).toBe(200);
    expect(response.body.success).toBe(true);
    expect(response.body.data).toHaveProperty("assistance");
  });
});
