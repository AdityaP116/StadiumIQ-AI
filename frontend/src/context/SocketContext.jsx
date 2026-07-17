/**
 * StadiumIQ — Socket Context
 *
 * Manages the Socket.io connection lifecycle and distributes real-time
 * stadium data to the component tree.
 *
 * Provides:
 *   - isConnected       : boolean
 *   - liveStatus        : latest stadium-update payload
 *   - criticalAlert     : latest crowd-alert payload (null if none)
 *   - clearCriticalAlert: clears the alert after acknowledgement
 *   - lastUpdated       : ISO timestamp of last socket update
 */

/* eslint-disable react-refresh/only-export-components */
import {
  createContext,
  useContext,
  useEffect,
  useState,
  useCallback,
  useRef,
} from 'react';
import toast from 'react-hot-toast';
import { connectSocket, disconnectSocket } from '@services/socket.service';
import { SOCKET_EVENTS, TOAST_DURATION } from '@constants';

// ─── Context ──────────────────────────────────────────────────────────────────
const SocketContext = createContext(null);

// ─── Provider ─────────────────────────────────────────────────────────────────
export const SocketProvider = ({ children }) => {
  const [isConnected, setIsConnected]       = useState(false);
  const [liveStatus, setLiveStatus]         = useState(null);
  const [criticalAlert, setCriticalAlert]   = useState(null);
  const [lastUpdated, setLastUpdated]       = useState(null);
  const socketRef                           = useRef(null);

  useEffect(() => {
    const socket = connectSocket();
    socketRef.current = socket;

    // ── Connection lifecycle ────────────────────────────────────────────────
    socket.on(SOCKET_EVENTS.CONNECTION, () => {
      setIsConnected(true);
    });

    socket.on(SOCKET_EVENTS.DISCONNECT, () => {
      setIsConnected(false);
    });

    socket.on(SOCKET_EVENTS.CONNECT_ERROR, (err) => {
      console.warn('[Socket] Connection error:', err.message);
      setIsConnected(false);
    });

    // ── Stadium Update (every 10s + immediate on connect) ──────────────────
    socket.on(SOCKET_EVENTS.STADIUM_UPDATE, (data) => {
      setLiveStatus(data);
      setLastUpdated(data.timestamp || new Date().toISOString());
      setIsConnected(true); // implicitly connected if we receive data
    });

    // ── Crowd Alert (CRITICAL occupancy only) ──────────────────────────────
    socket.on(SOCKET_EVENTS.CROWD_ALERT, (alert) => {
      setCriticalAlert(alert);
      toast.error(alert.message, {
        duration: TOAST_DURATION.ALERT,
        id:       'crowd-alert', // prevent duplicate toasts
      });
    });

    return () => {
      disconnectSocket();
    };
  }, []);

  const clearCriticalAlert = useCallback(() => {
    setCriticalAlert(null);
  }, []);

  // ─── Context Value ─────────────────────────────────────────────────────────
  const value = {
    isConnected,
    liveStatus,
    criticalAlert,
    lastUpdated,
    clearCriticalAlert,
  };

  return (
    <SocketContext.Provider value={value}>
      {children}
    </SocketContext.Provider>
  );
};

// ─── Hook ─────────────────────────────────────────────────────────────────────
export const useSocket = () => {
  const ctx = useContext(SocketContext);
  if (!ctx) throw new Error('useSocket must be used inside <SocketProvider>');
  return ctx;
};

export default SocketContext;
