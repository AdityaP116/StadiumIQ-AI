/**
 * StadiumIQ — Emergency Response Service
 * POST /api/emergency/respond
 */
import api from './api';
import { API_ENDPOINTS } from '@constants';

/**
 * Generate an AI emergency response plan. Saves to Firestore emergencyLogs.
 * @param {object} params
 * @param {string} params.emergencyType  - Required enum
 * @param {string} params.zone           - Required
 * @param {string} [params.severity]     - Optional enum
 * @param {string} [params.description]  - Optional
 * @returns {Promise<{ logId: string, emergencyType: string, zone: string, severity: string, responsePlan: object, generatedAt: string }>}
 */
export const respondToEmergency = async ({
  emergencyType,
  zone,
  severity,
  description,
}) => {
  const { data } = await api.post(API_ENDPOINTS.EMERGENCY_RESPOND, {
    emergencyType,
    zone,
    severity,
    description,
  });
  return data.data;
};
