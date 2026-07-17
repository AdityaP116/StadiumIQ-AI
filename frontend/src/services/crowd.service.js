/**
 * StadiumIQ — Crowd Intelligence Service
 * POST /api/crowd/analyze
 */
import api from './api';
import { API_ENDPOINTS } from '@constants';

/**
 * Run AI crowd analysis. All fields optional — backend generates simulated data if omitted.
 * @param {object} [params={}]
 * @param {Array}  [params.gateOccupancy]
 * @param {Array}  [params.parking]
 * @param {Array}  [params.medicalIncidents]
 * @param {object} [params.weather]
 * @param {object} [params.security]
 * @returns {Promise<{ analysisId: string, snapshot: object, analysis: object, generatedAt: string }>}
 */
export const analyzeCrowd = async (params = {}) => {
  const { data } = await api.post(API_ENDPOINTS.CROWD_ANALYZE, params);
  return data.data;
};
