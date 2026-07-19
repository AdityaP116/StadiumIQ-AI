const { validateEmergencyResponse } = require("../src/validators/emergency.validator");

describe("Emergency Validator", () => {
  it("should return errors for missing emergencyType", () => {
    const body = { zone: "North Stand" };
    const errors = validateEmergencyResponse(body);
    expect(errors).toContain("'emergencyType' is required.");
  });

  it("should return empty array for valid input", () => {
    const body = { emergencyType: "medical", zone: "North Stand", severity: "Minor" };
    const errors = validateEmergencyResponse(body);
    expect(errors.length).toBe(0);
  });
});
