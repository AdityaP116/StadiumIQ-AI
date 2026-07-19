const request = require("supertest");
const express = require("express");
const { errorHandler, notFoundHandler, AppError } = require("../src/middleware/errorHandler");

describe("Middleware Tests", () => {
  let app;

  beforeAll(() => {
    app = express();
    app.use(express.json());

    app.get("/operational-error", (req, res, next) => {
      next(new AppError("Operational error message", 400));
    });

    app.get("/generic-error", (req, res, next) => {
      next(new Error("Generic error message"));
    });

    app.use(notFoundHandler);
    app.use(errorHandler);
  });

  it("should handle 404 not found", async () => {
    const res = await request(app).get("/does-not-exist");
    expect(res.status).toBe(404);
    expect(res.body.success).toBe(false);
    expect(res.body.message).toContain("Route not found");
  });

  it("should format operational errors correctly", async () => {
    const res = await request(app).get("/operational-error");
    expect(res.status).toBe(400);
    expect(res.body.success).toBe(false);
    expect(res.body.message).toBe("Operational error message");
  });

  it("should return generic 500 error in test mode", async () => {
    const res = await request(app).get("/generic-error");
    expect(res.status).toBe(500);
    expect(res.body.success).toBe(false);
  });
});
