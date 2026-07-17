/**
 * StadiumIQ — useAIMutation Hook
 *
 * Generic wrapper for all AI-powered endpoint mutations (POST requests).
 * Provides consistent loading, error, success handling with toast notifications.
 *
 * @param {Function} mutationFn  - The service function to call (e.g. sendFanChat)
 * @param {object}   [options]
 * @param {string}   [options.successMessage] - Toast message on success
 * @param {boolean}  [options.showSuccessToast] - Default true
 * @param {boolean}  [options.showErrorToast]   - Default true
 */

import { useMutation } from '@tanstack/react-query';
import toast from 'react-hot-toast';
import { extractErrorMessage } from '@utils';

export const useAIMutation = (
  mutationFn,
  {
    successMessage   = 'AI response generated.',
    showSuccessToast = true,
    showErrorToast   = true,
    onSuccess,
    onError,
  } = {}
) => {
  return useMutation({
    mutationFn,
    onSuccess: (data) => {
      if (showSuccessToast) {
        toast.success(successMessage);
      }
      onSuccess?.(data);
    },
    onError: (error) => {
      if (showErrorToast) {
        toast.error(extractErrorMessage(error));
      }
      onError?.(error);
    },
  });
};
