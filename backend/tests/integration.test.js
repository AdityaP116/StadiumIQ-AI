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
  callAI: jest.fn().mockResolvedValue('{"status": "ok"}'),
  parseAIJson: jest.fn().mockReturnValue({ status: "ok" }),
}));

describe("Integration API Endpoints", () => {
  it("GET / should return welcome message", async () => {
    const res = await request(app).get("/");
    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.message).toContain("Welcome to StadiumIQ API");
  });

  it("GET /health should return system status", async () => {
    const res = await request(app).get("/health");
    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.message).toBe("StadiumIQ API is running.");
  });

  it("GET /api/live/status should return live metrics data", async () => {
    const res = await request(app).get("/api/live/status");
    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.data).toHaveProperty("weather");
    expect(res.body.data).toHaveProperty("overallOccupancy");
  });

  it("GET /api/debug/genai should run diagnostic checks successfully", async () => {
    // Stub key for debug
    process.env.NVIDIA_API_KEY = "test-key";
    const res = await request(app).get("/api/debug/genai");
    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.data).toEqual({ status: "ok" });
  });

  it("GET /api/users/profile should fail without bearer token", async () => {
    const res = await request(app).get("/api/users/profile");
    expect(res.status).toBe(401);
  });

  it("GET /api/users/profile should pass with bearer token", async () => {
    const res = await request(app)
      .get("/api/users/profile")
      .set("Authorization", "Bearer valid-token");
    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
  });

  it("PUT /api/users/profile should update profile with valid token", async () => {
    const res = await request(app)
      .put("/api/users/profile")
      .set("Authorization", "Bearer valid-token")
      .send({ displayName: "Admin User", preferences: { notifications: true } });
    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
  });
});
