/**
 * StadiumIQ — Announcement Service
 * POST /api/announcement/generate
 */
import api from './api';
import { API_ENDPOINTS } from '@constants';

/**
 * Generate a multilingual PA announcement. Returns 201. Saves to Firestore.
 * @param {object} params
 * @param {string}   params.type       - Required enum
 * @param {string}   params.zone       - Required
 * @param {string}   params.message    - Required, max 500 chars
 * @param {string[]} [params.languages]- Default ["en","ar"]
 * @returns {Promise<{ announcementId: string, type: string, zone: string, announcements: object, urgencyLevel: string, recommendedRepetitions: number, notes: string, generatedAt: string }>}
 */
export const generateAnnouncement = async ({
  type,
  zone,
  message,
  languages = ['en', 'ar'],
}) => {
  const { data } = await api.post(API_ENDPOINTS.ANNOUNCEMENT_GENERATE, {
    type,
    zone,
    message,
    languages,
  });
  return data.data;
};
