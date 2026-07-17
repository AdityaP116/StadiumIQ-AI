/**
 * StadiumIQ — AI Fan Chat Service
 * POST /api/ai/chat
 */
import api from './api';
import { API_ENDPOINTS } from '@constants';

/**
 * Send a fan message to the AI assistant and receive a response.
 * @param {object} params
 * @param {string} params.message       - Fan's question (required, max 2000 chars)
 * @param {string} [params.language]    - Language code, default "en"
 * @param {string} [params.userLocation]- Fan's stadium location
 * @returns {Promise<{ response: string, language: string, userLocation: string }>}
 */
export const sendFanChat = async ({ message, language = 'en', userLocation = 'Unknown' }) => {
  const { data } = await api.post(API_ENDPOINTS.AI_CHAT, {
    message,
    language,
    userLocation,
  });
  return data.data;
};
