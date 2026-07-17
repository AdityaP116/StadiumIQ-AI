/**
 * StadiumIQ — Crowd Intelligence Page
 * AI crowd analysis with risk assessment and gate occupancy data.
 */


import { 
  Users, Activity, ShieldAlert, Navigation, Megaphone, 
  CloudRain, HeartPulse, ListChecks, ArrowRight, Zap 
} from 'lucide-react';
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip, ResponsiveContainer, Cell
} from 'recharts';

import { useLiveStatus } from '@hooks/useLiveStatus';
import { useAIMutation } from '@hooks/useAIMutation';
import { analyzeCrowd } from '@services/crowd.service';
import { getRiskColor, formatNumber } from '@utils';
import {
  PageContainer,
  SectionHeader,
  DashboardCard,
  ProgressCard,
  Button,
  StatusBadge,
  Alert,
  DataTable,
  AIThinking,
  ErrorState,
  ChartCard,
  PageLoader
} from '@components';

// Custom Tooltip for Recharts
const CustomTooltip = ({ active, payload, label }) => {
  if (active && payload && payload.length) {
    const data = payload[0].payload;
    return (
      <div className="bg-surface-900 border border-white/10 p-3 rounded-lg shadow-glass text-sm">
        <p className="font-semibold text-white mb-1">{label}</p>
        <p className="text-white/70">Current: <span className="font-mono text-white">{formatNumber(data.current)}</span></p>
        <p className="text-white/70">Capacity: <span className="font-mono text-white">{formatNumber(data.capacity)}</span></p>
        <div className="mt-2 flex items-center justify-between gap-4">
          <span className="text-xs text-white/50">Occupancy</span>
          <StatusBadge variant={data.riskLevel.toLowerCase()} size="xs">
            {data.occupancyPercent}%
          </StatusBadge>
        </div>
      </div>
    );
  }
  return null;
};

const CrowdPage = () => {
  const { liveStatus, isLoading: isLiveLoading, isError: isLiveError } = useLiveStatus();
  
  const crowdMutation = useAIMutation(analyzeCrowd, {
    successMessage: 'Crowd analysis complete.',
  });

  const handleAnalyze = () => {
    // Send current live status payload to backend to be analyzed by AI
    crowdMutation.mutate(liveStatus);
  };

  if (isLiveLoading && !liveStatus) return <PageLoader />;
  if (isLiveError && !liveStatus) return <ErrorState title="Failed to load live data" />;

  const gates = liveStatus?.gates || [];
  const analysis = crowdMutation.data?.analysis; // The parsed JSON from OpenAI

  // Table columns for Volunteer Deployment
  const volunteerColumns = [
    { header: 'Zone', key: 'zone', className: 'w-1/4' },
    { header: 'Staff', key: 'count', className: 'w-1/6 font-mono text-accent-400 font-bold' },
    { header: 'Reason', key: 'reason' }
  ];

  return (
    <PageContainer>
      <SectionHeader
        title="Crowd Intelligence"
        description="AI-powered crowd risk analysis and gate management."
        action={
          <Button
            variant="accent"
            leftIcon={<Zap size={16} />}
            isLoading={crowdMutation.isPending}
            onClick={handleAnalyze}
          >
            Run Intelligence Scan
          </Button>
        }
      />

      <div className="grid grid-cols-1 xl:grid-cols-12 gap-6">
        
        {/* ── Left Column: Live Gate Data (5 cols) ── */}
        <div className="xl:col-span-5 space-y-6">
          <ChartCard
            title="Live Gate Occupancy"
            icon={<Users size={18} />}
            height={300}
            action={
              <div className="flex items-center gap-2">
                <div className="live-dot" />
                <span className="text-green-400 text-xs font-medium">Live</span>
              </div>
            }
          >
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={gates} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" vertical={false} />
                <XAxis dataKey="gate" stroke="rgba(255,255,255,0.3)" fontSize={12} tickLine={false} axisLine={false} />
                <YAxis stroke="rgba(255,255,255,0.3)" fontSize={12} tickLine={false} axisLine={false} />
                <RechartsTooltip content={<CustomTooltip />} cursor={{ fill: 'rgba(255,255,255,0.02)' }} />
                <Bar dataKey="current" radius={[4, 4, 0, 0]}>
                  {gates.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={getRiskColor(entry.riskLevel)} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </ChartCard>

          <DashboardCard title="Gate Details" icon={<Activity size={18} />}>
            <div className="space-y-4">
              {gates.map(gate => (
                <div key={gate.gate}>
                  <div className="flex justify-between items-end mb-1">
                    <span className="text-sm font-medium text-white/80">{gate.gate}</span>
                    <span className="text-xs text-white/40">{gate.waitTimeMinutes}m wait</span>
                  </div>
                  <ProgressCard
                    current={gate.current}
                    max={gate.capacity}
                    percent={gate.occupancyPercent}
                    riskOverride={gate.riskLevel}
                  />
                </div>
              ))}
            </div>
          </DashboardCard>
        </div>


        {/* ── Right Column: AI Analysis Results (7 cols) ── */}
        <div className="xl:col-span-7">
          <DashboardCard 
            title="AI Operational Analysis" 
            icon={<ShieldAlert size={18} />}
            className="h-full min-h-[500px]"
          >
            {crowdMutation.isPending ? (
              <div className="flex flex-col items-center justify-center h-full min-h-[400px]">
                <AIThinking label="AI Engine analyzing crowd telemetry…" />
              </div>
            ) : crowdMutation.isError ? (
              <div className="flex flex-col items-center justify-center h-full min-h-[400px]">
                <ErrorState title="Analysis Failed" message={crowdMutation.error?.message} onRetry={handleAnalyze} />
              </div>
            ) : analysis ? (
              <div className="space-y-6">
                
                {/* 1. Overall Risk & Summary */}
                <div className="flex flex-col sm:flex-row gap-4 items-start border-b border-white/10 pb-6">
                  <div className="shrink-0 p-4 rounded-xl border border-white/5 bg-white/[0.02] text-center w-full sm:w-auto">
                    <p className="text-xs text-white/40 uppercase tracking-wider mb-2">System Risk</p>
                    <StatusBadge variant={analysis.overallRiskLevel.toLowerCase()} size="md" pulse={analysis.overallRiskLevel === 'CRITICAL'}>
                      {analysis.overallRiskLevel}
                    </StatusBadge>
                  </div>
                  <div className="flex-1">
                    <h4 className="text-lg font-semibold text-white mb-2">Situation Overview</h4>
                    <p className="text-sm text-white/70 leading-relaxed">
                      {analysis.riskSummary}
                    </p>
                  </div>
                </div>

                {/* 2. Priority Actions */}
                {analysis.priorityActions?.length > 0 && (
                  <div>
                    <h4 className="text-sm font-semibold text-white/90 mb-3 flex items-center gap-2">
                      <ListChecks size={16} className="text-accent-400" />
                      Immediate Priority Actions
                    </h4>
                    <div className="space-y-2">
                      {analysis.priorityActions.map((action, i) => (
                        <Alert key={i} variant="warning" className="py-2.5">
                          <div className="flex items-start gap-2">
                            <ArrowRight size={14} className="mt-0.5 shrink-0 opacity-50" />
                            <span>{action}</span>
                          </div>
                        </Alert>
                      ))}
                    </div>
                  </div>
                )}

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  {/* 3. Diversion Strategy */}
                  <div>
                    <h4 className="text-sm font-semibold text-white/90 mb-3 flex items-center gap-2">
                      <Navigation size={16} className="text-sky-400" />
                      Diversion Strategy
                    </h4>
                    <div className="p-4 rounded-xl border border-sky-500/20 bg-sky-500/5 text-sm text-sky-100/80 leading-relaxed">
                      {analysis.diversionStrategy || 'No diversions currently required.'}
                    </div>
                  </div>

                  {/* 4. Contextual Notes */}
                  <div className="space-y-4">
                    {analysis.medicalNotes && (
                      <div className="p-3 rounded-lg border border-red-500/20 bg-red-500/5">
                        <h5 className="text-xs font-semibold text-red-300 flex items-center gap-1.5 mb-1">
                          <HeartPulse size={12} /> Medical Context
                        </h5>
                        <p className="text-xs text-red-200/70">{analysis.medicalNotes}</p>
                      </div>
                    )}
                    {analysis.weatherImpact && (
                      <div className="p-3 rounded-lg border border-amber-500/20 bg-amber-500/5">
                        <h5 className="text-xs font-semibold text-amber-300 flex items-center gap-1.5 mb-1">
                          <CloudRain size={12} /> Weather Factor
                        </h5>
                        <p className="text-xs text-amber-200/70">{analysis.weatherImpact}</p>
                      </div>
                    )}
                  </div>
                </div>

                {/* 5. Volunteer Deployment */}
                {analysis.volunteerDeployment?.length > 0 && (
                  <div>
                    <h4 className="text-sm font-semibold text-white/90 mb-3 flex items-center gap-2">
                      <Users size={16} className="text-green-400" />
                      Recommended Staff Deployment
                    </h4>
                    <DataTable 
                      columns={volunteerColumns} 
                      data={analysis.volunteerDeployment} 
                    />
                  </div>
                )}

                {/* 6. Announcement Draft */}
                {analysis.recommendedAnnouncement && (
                  <div>
                    <h4 className="text-sm font-semibold text-white/90 mb-3 flex items-center gap-2">
                      <Megaphone size={16} className="text-purple-400" />
                      PA System Announcement Draft
                    </h4>
                    <div className="p-4 rounded-xl border border-white/10 bg-surface-950 font-mono text-sm text-white/70 relative group">
                      <span className="absolute top-2 right-3 text-[10px] uppercase text-white/30 font-sans">Suggested</span>
                      &quot;{analysis.recommendedAnnouncement}&quot;
                    </div>
                  </div>
                )}

              </div>
            ) : (
              <div className="flex flex-col items-center justify-center h-full text-white/30 text-sm py-16 text-center">
                <ShieldAlert size={32} className="mb-3 opacity-50" />
                <p>Run an intelligence scan to generate crowd management strategies, diversion routes, and staff deployment plans.</p>
              </div>
            )}
          </DashboardCard>
        </div>

      </div>
    </PageContainer>
  );
};

export default CrowdPage;
