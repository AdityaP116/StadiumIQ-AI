/**
 * StadiumIQ — Sustainability Service
 * POST /api/sustainability/tips
 */
import api from './api';
import { API_ENDPOINTS } from '@constants';

/**
 * Fetch AI-generated sustainability tips.
 * @param {object} [params={}]
 * @param {string} [params.targetAudience]  - "fans" | "operations" | "both"
 * @param {string} [params.specificConcern] - Max 500 chars
 * @returns {Promise<object>}
 */
export const getSustainabilityTips = async ({
  targetAudience = 'fans',
  specificConcern = '',
} = {}) => {
  const { data } = await api.post(API_ENDPOINTS.SUSTAINABILITY_TIPS, {
    targetAudience,
    specificConcern,
  });
  return data.data;
};
