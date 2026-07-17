/**
 * StadiumIQ — Accessibility Service
 * POST /api/accessibility/assist
 */
import api from './api';
import { API_ENDPOINTS } from '@constants';

/**
 * Generate an accessible route and assistance plan.
 * @param {object} params
 * @param {string} params.need                 - Required, max 500 chars
 * @param {string} [params.currentLocation]    - Default "Stadium Entrance"
 * @param {string} [params.destination]        - Default "Seating Area"
 * @returns {Promise<{ need: string, currentLocation: string, destination: string, assistance: string, availableFeatures: string[] }>}
 */
export const getAccessibilityAssistance = async ({
  need,
  currentLocation,
  destination,
}) => {
  const { data } = await api.post(API_ENDPOINTS.ACCESSIBILITY_ASSIST, {
    need,
    currentLocation,
    destination,
  });
  return data.data;
};
