/**
 * StadiumIQ — Dashboard Page
 * Primary landing page: live summary cards + AI insight report.
 */


import {
  Users, Cloud, Car, ShieldAlert, Train, Activity, CheckCircle, Sparkles, AlertTriangle
} from 'lucide-react';
import ReactMarkdown from 'react-markdown';

import { useLiveStatus } from '@hooks/useLiveStatus';
import { useDashboard } from '@hooks/useDashboard';
import {
  ProgressCard,
  StatusCard,
  MetricCard,
  NotificationCard,
  DashboardCard,
  SectionHeader,
  PageContainer,
  PageLoader,
  ErrorState,
  Button,
  AIThinking
} from '@components';

const DashboardPage = () => {
  const { liveStatus, isLoading: isLiveLoading, isError: isLiveError } = useLiveStatus();
  const { generateInsight, insight, isInsightLoading, isInsightError } = useDashboard();

  // If initial hydration is loading
  if (isLiveLoading && !liveStatus) return <PageLoader />;
  if (isLiveError && !liveStatus) return <ErrorState title="Failed to load live data" />;

  // Safely extract data
  const {
    overallOccupancy = {},
    weather = {},
    parking = [],
    security = {},
    transport = {},
    medicalIncidents = [],
    activeVolunteers = 0,
    activeSecurity = 0,
    activeMedical = 0,
  } = liveStatus || {};

  // Aggregate parking
  const totalParkingCapacity = parking.reduce((sum, zone) => sum + zone.total, 0);
  const totalParkingOccupied = parking.reduce((sum, zone) => sum + zone.occupied, 0);

  // Unresolved medical
  const unresolvedMedical = medicalIncidents.filter((i) => !i.resolved).length;
  const activeStaffCount = activeVolunteers + activeSecurity + activeMedical;

  return (
    <PageContainer>
      <SectionHeader
        title="Dashboard"
        description="Executive operations overview — Lusail Iconic Stadium"
        action={
          <div className="flex items-center gap-2">
            <div className="live-dot" />
            <span className="text-green-400 text-sm font-medium">Live Stream Active</span>
          </div>
        }
      />

      {/* ── Top Level KPIs (Row 1) ── */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <ProgressCard
          title="Total Crowd"
          icon={<Users size={18} />}
          current={overallOccupancy.current || 0}
          max={overallOccupancy.capacity || 1}
          percent={overallOccupancy.percent}
          riskOverride={overallOccupancy.riskLevel}
        />

        <ProgressCard
          title="Parking Usage"
          icon={<Car size={18} />}
          current={totalParkingOccupied}
          max={totalParkingCapacity || 1}
          subtitle="Total Spaces"
        />

        <MetricCard
          title="Active Staff"
          icon={<CheckCircle size={18} />}
          value={activeStaffCount}
          subtitle={`${activeSecurity} Security, ${activeMedical} Medical`}
          statusLevel="success"
          statusLabel="Optimal"
        />

        <MetricCard
          title="Medical Incidents"
          icon={<Activity size={18} />}
          value={unresolvedMedical}
          subtitle="Unresolved cases"
          statusLevel={unresolvedMedical > 3 ? 'danger' : unresolvedMedical > 0 ? 'warning' : 'success'}
          statusLabel={unresolvedMedical > 3 ? 'HIGH' : unresolvedMedical > 0 ? 'ATTENTION' : 'CLEAR'}
        />
      </div>

      {/* ── Status Grid (Row 2) ── */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
        <StatusCard
          title="Live Weather"
          value={`${weather.temperatureCelsius}°C — ${weather.condition}`}
          subtitle={`Heat Index: ${weather.heatIndexCelsius}°C`}
          icon={<Cloud size={18} />}
        />
        <StatusCard
          title="Security Level"
          value={security.level}
          subtitle={security.alerts?.length ? `${security.alerts.length} active alerts` : 'No active threats'}
          icon={<ShieldAlert size={18} />}
          securityLevel={security.level}
        />
        <StatusCard
          title="Metro Line"
          value={`${transport.metro?.line} — ${transport.metro?.status}`}
          subtitle={transport.metro?.delayMinutes ? `${transport.metro.delayMinutes}m delay` : 'On Time'}
          icon={<Train size={18} />}
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mt-4">
        {/* ── AI Executive Insights (Col 1 & 2) ── */}
        <DashboardCard
          title="AI Executive Insights"
          icon={<Sparkles size={16} className="text-accent-400" />}
          className="lg:col-span-2"
          action={
            <Button
              variant="accent"
              size="sm"
              isLoading={isInsightLoading}
              onClick={() => generateInsight(liveStatus)}
            >
              Generate Report
            </Button>
          }
        >
          <div className="min-h-[150px] relative">
            {isInsightLoading ? (
              <div className="absolute inset-0 flex items-center justify-center">
                <AIThinking label="Analyzing stadium metrics…" />
              </div>
            ) : isInsightError ? (
              <ErrorState title="Failed to generate AI insight" />
            ) : insight ? (
              <div className="prose prose-invert max-w-none text-[15px] prose-p:leading-relaxed prose-a:text-primary-400 prose-headings:text-white prose-strong:text-white">
                <ReactMarkdown>{insight.insight || insight}</ReactMarkdown>
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center h-full text-white/30 text-sm py-8 text-center">
                <Sparkles size={24} className="mb-2 opacity-50" />
                <p>Click &quot;Generate Report&quot; to receive an AI-powered operational analysis.</p>
              </div>
            )}
          </div>
        </DashboardCard>

        {/* ── Live Activity Feed (Col 3) ── */}
        <DashboardCard
          title="Live Activity"
          icon={<AlertTriangle size={16} />}
          noPadding
        >
          <div className="max-h-[300px] overflow-y-auto no-scrollbar p-3 space-y-2">
            {/* Render Security Alerts */}
            {security.alerts?.map((alert, i) => (
              <NotificationCard
                key={`sec-${i}`}
                title="Security Alert"
                description={alert}
                statusVariant="danger"
                statusLabel={security.level}
                icon={<ShieldAlert size={16} className="text-red-400" />}
              />
            ))}

            {/* Render Medical Incidents */}
            {medicalIncidents.map((incident) => (
              <NotificationCard
                key={incident.id}
                title={`Medical: ${incident.type}`}
                description={`Location: ${incident.zone}`}
                timestamp={incident.timestamp}
                isResolved={incident.resolved}
                statusVariant={incident.severity === 'Minor' ? 'warning' : 'danger'}
                statusLabel={incident.severity}
                icon={<Activity size={16} className={incident.resolved ? 'text-white/30' : 'text-amber-400'} />}
              />
            ))}

            {!security.alerts?.length && medicalIncidents.length === 0 && (
              <div className="text-center text-white/30 text-xs py-6">
                No recent activity.
              </div>
            )}
          </div>
        </DashboardCard>
      </div>
    </PageContainer>
  );
};

export default DashboardPage;
