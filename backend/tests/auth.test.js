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

const { verifyToken } = require("../src/middleware/auth.middleware");

// Mock response and logger
const mockRes = () => {
  const res = {};
  res.status = jest.fn().mockReturnValue(res);
  res.json = jest.fn().mockReturnValue(res);
  return res;
};

describe("Authentication Middleware", () => {
  it("should return 401 if Authorization header is missing", async () => {
    const req = { headers: {} };
    const res = mockRes();
    const next = jest.fn();

    await verifyToken(req, res, next);

    expect(res.status).toHaveBeenCalledWith(401);
    expect(res.json).toHaveBeenCalledWith(
      expect.objectContaining({ message: "Unauthorized: Missing or invalid Bearer token" })
    );
    expect(next).not.toHaveBeenCalled();
  });

  it("should return 401 if Authorization header is not Bearer token", async () => {
    const req = { headers: { authorization: "Basic logpass" } };
    const res = mockRes();
    const next = jest.fn();

    await verifyToken(req, res, next);

    expect(res.status).toHaveBeenCalledWith(401);
    expect(next).not.toHaveBeenCalled();
  });

  it("should verify valid token and call next()", async () => {
    const req = { headers: { authorization: "Bearer valid-token" } };
    const res = mockRes();
    const next = jest.fn();

    await verifyToken(req, res, next);

    expect(req.user).toBeDefined();
    expect(req.user.uid).toBe("mock-uid");
    expect(next).toHaveBeenCalled();
  });
});
