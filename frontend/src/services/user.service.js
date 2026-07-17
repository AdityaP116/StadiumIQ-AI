/**
 * StadiumIQ — User Profile Service
 * GET /api/users/profile  (protected)
 * PUT /api/users/profile  (protected)
 *
 * These endpoints require a valid Firebase ID token (auto-attached by api.js interceptor).
 */
import api from './api';
import { API_ENDPOINTS } from '@constants';

/**
 * Fetch the current user's profile from Firestore.
 * @returns {Promise<{ uid: string, email: string, name: string, age: number|null, phone: string|null, updatedAt: string }>}
 */
export const getUserProfile = async () => {
  const { data } = await api.get(API_ENDPOINTS.USER_PROFILE);
  return data.data;
};

/**
 * Create or update the user's profile in Firestore.
 * @param {object} profileData
 * @param {string} [profileData.name]
 * @param {number} [profileData.age]
 * @param {string} [profileData.phone]
 * @returns {Promise<object>} Updated profile document
 */
export const updateUserProfile = async (profileData) => {
  const { data } = await api.put(API_ENDPOINTS.USER_PROFILE, profileData);
  return data.data;
};
