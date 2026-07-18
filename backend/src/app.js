/**
 * StadiumIQ — Express Application
 * Configures and exports the Express app with all middleware and routes mounted.
 * Does NOT start the server — that is done in server.js.
 */

const express = require("express");
const cors = require("cors");
const helmet = require("helmet");

const { generalLimiter } = require("./middleware/rateLimiter");
const { errorHandler, notFoundHandler } = require("./middleware/errorHandler");
const logger = require("./utils/logger");

// Route imports
const aiRoutes = require("./routes/ai.routes");
const navigationRoutes = require("./routes/navigation.routes");
const crowdRoutes = require("./routes/crowd.routes");
const dashboardRoutes = require("./routes/dashboard.routes");
const emergencyRoutes = require("./routes/emergency.routes");
const announcementRoutes = require("./routes/announcement.routes");
const accessibilityRoutes = require("./routes/accessibility.routes");
const transportRoutes = require("./routes/transport.routes");
const sustainabilityRoutes = require("./routes/sustainability.routes");
const liveRoutes = require("./routes/live.routes");
const userRoutes = require("./routes/userRoutes");
const debugRoutes = require("./routes/debug.routes");

const app = express();

// ─── Security Middleware ──────────────────────────────────────────────────────
app.use(helmet());

app.use(
  cors({
    origin: process.env.CLIENT_URL || "*",
    methods: ["GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);

// ─── General Rate Limiter (all routes) ───────────────────────────────────────
app.use(generalLimiter);

// ─── Body Parsing ─────────────────────────────────────────────────────────────
app.use(express.json({ limit: "10kb" }));
app.use(express.urlencoded({ extended: true, limit: "10kb" }));

// ─── Request Logger ──────────────────────────────────────────────────────────
app.use((req, res, next) => {
  logger.info(`${req.method} ${req.originalUrl}`);
  next();
});

// ─── Root Route ───────────────────────────────────────────────────────────────
app.get("/", (req, res) => {
  res.status(200).json({
    success: true,
    message: "Welcome to StadiumIQ API. The server is running successfully.",
    endpoints: "Access API endpoints via /api or check health at /health"
  });
});

// ─── Health Check ─────────────────────────────────────────────────────────────
app.get("/health", (req, res) => {
  res.status(200).json({
    success: true,
    message: "StadiumIQ API is running.",
    timestamp: new Date().toISOString(),
    version: "1.0.0",
  });
});

// ─── API Routes ───────────────────────────────────────────────────────────────
app.use("/api/ai", aiRoutes);
app.use("/api/navigation", navigationRoutes);
app.use("/api/crowd", crowdRoutes);
app.use("/api/dashboard", dashboardRoutes);
app.use("/api/emergency", emergencyRoutes);
app.use("/api/announcement", announcementRoutes);
app.use("/api/accessibility", accessibilityRoutes);
app.use("/api/transport", transportRoutes);
app.use("/api/sustainability", sustainabilityRoutes);
app.use("/api/live", liveRoutes);
app.use("/api/users", userRoutes);
app.use("/api/debug", debugRoutes);

// ─── 404 Handler (must be after all routes) ────────────────────────────────
app.use(notFoundHandler);

// ─── Global Error Handler (must be last) ─────────────────────────────────────
app.use(errorHandler);

module.exports = app;