const logger = require("../src/utils/logger");

describe("Logger Utility", () => {
  let consoleLogSpy;
  let consoleErrorSpy;
  let consoleWarnSpy;

  beforeEach(() => {
    consoleLogSpy = jest.spyOn(console, 'log').mockImplementation(() => {});
    consoleErrorSpy = jest.spyOn(console, 'error').mockImplementation(() => {});
    consoleWarnSpy = jest.spyOn(console, 'warn').mockImplementation(() => {});
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  it("should output info logs via console.log", () => {
    logger.info("Test info message");
    expect(consoleLogSpy).toHaveBeenCalled();
  });

  it("should output error logs via console.error", () => {
    logger.error("Test error message", { detail: "test" });
    expect(consoleErrorSpy).toHaveBeenCalled();
  });

  it("should output warn logs via console.warn", () => {
    logger.warn("Test warn message");
    expect(consoleWarnSpy).toHaveBeenCalled();
  });
});
