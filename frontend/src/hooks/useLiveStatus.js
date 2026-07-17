/**
 * StadiumIQ — useLiveStatus Hook
 *
 * Combines the Socket.io real-time stream with a TanStack Query HTTP fallback.
 * Socket data takes priority and updates automatically every 10s.
 * HTTP fetch is used for the initial hydration if socket hasn't fired yet.
 */

import { useQuery } from '@tanstack/react-query';
import { useSocket } from '@context/SocketContext';
import { getLiveStatus } from '@services/live.service';
import { QUERY_KEYS } from '@constants';

/**
 * @returns {{
 *   liveStatus: object | null,
 *   isConnected: boolean,
 *   lastUpdated: string | null,
 *   criticalAlert: object | null,
 *   isLoading: boolean,
 *   isError: boolean,
 * }}
 */
export const useLiveStatus = () => {
  const { liveStatus, isConnected, lastUpdated, criticalAlert } = useSocket();

  // HTTP fallback — only active until socket fires for the first time
  const query = useQuery({
    queryKey: QUERY_KEYS.LIVE_STATUS,
    queryFn:  getLiveStatus,
    // Don't re-fetch via HTTP once socket is supplying data
    enabled:  !liveStatus,
    // Stale immediately — we rely on socket pushes, not polling
    staleTime: 0,
  });

  return {
    liveStatus:     liveStatus ?? query.data ?? null,
    isConnected,
    lastUpdated,
    criticalAlert,
    isLoading:      !liveStatus && query.isLoading,
    isError:        !liveStatus && query.isError,
    error:          query.error,
  };
};
