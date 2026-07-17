/**
 * StadiumIQ — Navigation Service
 * POST /api/navigation/route
 */
import api from './api';
import { API_ENDPOINTS } from '@constants';

/**
 * Get step-by-step navigation directions.
 * @param {object} params
 * @param {string} params.currentLocation - Fan's current position (required)
 * @param {string} params.destination     - Target location or seat code e.g. "NS-C-14" (required)
 * @returns {Promise<{ route: string, currentLocation: string, destination: string, seatContext: object|null }>}
 */
export const getNavigationRoute = async ({ currentLocation, destination }) => {
  const { data } = await api.post(API_ENDPOINTS.NAVIGATION_ROUTE, {
    currentLocation,
    destination,
  });
  return data.data;
};
