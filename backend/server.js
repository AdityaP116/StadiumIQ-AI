/**
 * StadiumIQ — Server Entry Point
 * Boots the application: loads env, initializes Firebase, starts HTTP server,
 * and initializes Socket.io.
 */

require("dotenv").config();

const http = require("http");
const app = require("./src/app");

const { initializeSocket } = require("./src/socket/socket");
const logger = require("./src/utils/logger");

const PORT = process.env.PORT || 3000;

// Create HTTP server from Express app (required for Socket.io)
const httpServer = http.createServer(app);

// Initialize Socket.io
initializeSocket(httpServer);

httpServer.listen(PORT, () => {
  logger.info(`🚀 StadiumIQ Server running on port ${PORT}`);
  logger.info(`📡 Socket.io broadcasting live stadium updates every 10s`);
  logger.info(`🏥 Health check: http://localhost:${PORT}/health`);
});

// Graceful shutdown
process.on("SIGTERM", () => {
  logger.info("SIGTERM received. Shutting down gracefully...");
  httpServer.close(() => {
    logger.info("HTTP server closed.");
    process.exit(0);
  });
});

// Catch any unhandled promise rejections (e.g., from async code outside Express)
process.on("unhandledRejection", (reason, promise) => {
  logger.error("Unhandled Promise Rejection", { reason: reason?.message || reason });
  // Give the server time to finish ongoing requests before exiting
  httpServer.close(() => process.exit(1));
});

// Catch any uncaught synchronous exceptions
process.on("uncaughtException", (error) => {
  logger.error("Uncaught Exception — shutting down", { error: error.message });
  process.exit(1);
});