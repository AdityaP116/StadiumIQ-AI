/**
 * StadiumIQ — Dashboard Service
 * GET  /api/dashboard/summary
 * POST /api/dashboard/insight
 */
import api from './api';
import { API_ENDPOINTS } from '@constants';

/**
 * Fetch a fast, data-only dashboard summary (no AI call).
 * @returns {Promise<object>}
 */
export const getDashboardSummary = async () => {
  const { data } = await api.get(API_ENDPOINTS.DASHBOARD_SUMMARY);
  return data.data;
};

/**
 * Request an AI-powered executive insight report.
 * @param {object} [liveData={}] - Optional live data; backend generates if empty
 * @returns {Promise<{ insight: object, dataSnapshot: object }>}
 */
export const getDashboardInsight = async (liveData = {}) => {
  const { data } = await api.post(API_ENDPOINTS.DASHBOARD_INSIGHT, liveData);
  return data.data;
};
