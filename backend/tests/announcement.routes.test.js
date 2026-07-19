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
  callAI: jest.fn().mockResolvedValue('[{"language": "en", "script": "mock announcement", "phoneticPronunciation": "mock phonetic"}]'),
  parseAIJson: jest.fn().mockReturnValue([{ language: "en", script: "mock announcement", phoneticPronunciation: "mock phonetic" }]),
}));

describe("Announcement Routes API", () => {
  it("POST /api/announcement/generate should return translated announcements", async () => {
    const response = await request(app)
      .post("/api/announcement/generate")
      .send({ type: "emergency", zone: "North Stand", message: "Evacuate", languages: ["en"] });
    expect(response.status).toBe(201);
    expect(response.body.success).toBe(true);
    expect(response.body.data).toHaveProperty("announcements");
  });
});
