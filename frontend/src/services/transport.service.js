/**
 * StadiumIQ — Transport Service
 * POST /api/transport/recommend
 */
import api from './api';
import { API_ENDPOINTS } from '@constants';

/**
 * Get ranked transport recommendations based on live conditions.
 * @param {object} params
 * @param {string} params.userLocation    - Required
 * @param {string} [params.destination]   - Default "city center"
 * @param {object} [params.preferences]   - { mode: "eco"|"fast"|"cheap"|"accessible" }
 * @returns {Promise<{ userLocation: string, destination: string, recommendation: object, liveTransportStatus: object }>}
 */
export const recommendTransport = async ({
  userLocation,
  destination,
  preferences,
}) => {
  const { data } = await api.post(API_ENDPOINTS.TRANSPORT_RECOMMEND, {
    userLocation,
    destination,
    preferences,
  });
  return data.data;
};
