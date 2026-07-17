/**
 * StadiumIQ — Live Status Service
 * GET /api/live/status
 */
import api from './api';
import { API_ENDPOINTS } from '@constants';

/**
 * Fetch a single live stadium status snapshot via HTTP.
 * The Socket.io service provides continuous updates; use this for the initial load.
 * @returns {Promise<object>} Full live status snapshot
 */
export const getLiveStatus = async () => {
  const { data } = await api.get(API_ENDPOINTS.LIVE_STATUS);
  return data.data;
};
