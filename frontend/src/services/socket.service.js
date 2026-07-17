/**
 * StadiumIQ — Socket.io Client Service
 *
 * Manages a single Socket.io connection.
 * Used by SocketContext to subscribe to real-time stadium events.
 */

import { io } from 'socket.io-client';
import { API_BASE_URL } from '@constants';

let socket = null;

/**
 * Connect to the Socket.io server.
 * Safe to call multiple times — returns existing socket if already connected.
 * @returns {import('socket.io-client').Socket}
 */
export const connectSocket = () => {
  if (socket && socket.connected) return socket;

  socket = io(API_BASE_URL, {
    reconnectionAttempts: 10,
    reconnectionDelay:    2000,
    reconnectionDelayMax: 10000,
    timeout:              10000,
  });

  return socket;
};

/**
 * Get the current socket instance (may be null if never connected).
 * @returns {import('socket.io-client').Socket|null}
 */
export const getSocket = () => socket;

/**
 * Disconnect and destroy the socket.
 */
export const disconnectSocket = () => {
  if (socket) {
    socket.disconnect();
    socket = null;
  }
};

/**
 * Check if the socket is currently connected.
 * @returns {boolean}
 */
export const isSocketConnected = () => socket?.connected ?? false;
