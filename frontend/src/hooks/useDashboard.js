/**
 * StadiumIQ — useDashboard Hook
 *
 * Provides dashboard summary (HTTP polling) and AI insight mutation.
 */

import { useQuery } from '@tanstack/react-query';
import { getDashboardSummary, getDashboardInsight } from '@services/dashboard.service';
import { useAIMutation } from './useAIMutation';
import { QUERY_KEYS } from '@constants';

export const useDashboard = () => {
  // ─── Fast summary (data only, no AI) ──────────────────────────────────────
  const summaryQuery = useQuery({
    queryKey: QUERY_KEYS.DASHBOARD_SUMMARY,
    queryFn:  getDashboardSummary,
    staleTime: 30_000,       // 30s — refresh periodically
    refetchInterval: 60_000, // background refresh every 60s
  });

  // ─── AI Insight (on-demand mutation) ──────────────────────────────────────
  const insightMutation = useAIMutation(getDashboardInsight, {
    successMessage:   'Executive insight generated.',
    showSuccessToast: false, // result appears inline — no need for toast
  });

  return {
    summary:          summaryQuery.data ?? null,
    isSummaryLoading: summaryQuery.isLoading,
    isSummaryError:   summaryQuery.isError,
    generateInsight:  insightMutation.mutate,
    insight:          insightMutation.data ?? null,
    isInsightLoading: insightMutation.isPending,
    isInsightError:   insightMutation.isError,
  };
};
