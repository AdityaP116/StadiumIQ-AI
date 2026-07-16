/**
 * StadiumIQ — Socket.io Module
 * Initializes Socket.io with the HTTP server and broadcasts
 * live stadium updates every 10 seconds to all connected clients.
 */

const { Server } = require("socket.io");
const { generateLiveStatus } = require("../utils/fakeDataGenerator");
const { SOCKET_EVENTS, SOCKET_INTERVALS } = require("../constants");
const logger = require("../utils/logger");

let io = null;
let broadcastInterval = null;

/**
 * Initialize Socket.io with an existing HTTP server.
 * @param {http.Server} httpServer - The Node.js HTTP server instance
 * @returns {Server} Socket.io server instance
 */
const initializeSocket = (httpServer) => {
  io = new Server(httpServer, {
    cors: {
      origin: process.env.CLIENT_URL || "*",
      methods: ["GET", "POST"],
    },
  });

  io.on(SOCKET_EVENTS.CONNECTION, (socket) => {
    logger.info(`[Socket.io] Client connected: ${socket.id}`);

    // Send current status immediately on connection
    socket.emit(SOCKET_EVENTS.STADIUM_UPDATE, generateLiveStatus());

    socket.on(SOCKET_EVENTS.DISCONNECT, () => {
      logger.info(`[Socket.io] Client disconnected: ${socket.id}`);
    });
  });

  // Broadcast live stadium updates every 10 seconds to ALL connected clients
  broadcastInterval = setInterval(() => {
    const liveData = generateLiveStatus();
    io.emit(SOCKET_EVENTS.STADIUM_UPDATE, liveData);

    // Trigger crowd alert if risk is CRITICAL
    if (liveData.overallOccupancy?.riskLevel === "CRITICAL") {
      io.emit(SOCKET_EVENTS.CROWD_ALERT, {
        message: "⚠️ CRITICAL: Stadium at maximum capacity. Activate crowd diversion protocols.",
        data: liveData.overallOccupancy,
        timestamp: new Date().toISOString(),
      });
    }

    logger.debug(`[Socket.io] Broadcast sent — ${io.engine.clientsCount} clients connected`);
  }, SOCKET_INTERVALS.STADIUM_UPDATE_MS);

  logger.info("[Socket.io] Initialized and broadcasting every 10 seconds");

  return io;
};

/**
 * Get the active Socket.io instance (for use in other modules).
 * @returns {Server|null}
 */
const getIO = () => io;

/**
 * Stop the broadcast interval (useful for graceful shutdown / testing).
 */
const stopBroadcast = () => {
  if (broadcastInterval) {
    clearInterval(broadcastInterval);
    broadcastInterval = null;
  }
};

module.exports = { initializeSocket, getIO, stopBroadcast };
