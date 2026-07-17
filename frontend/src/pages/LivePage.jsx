/**
 * StadiumIQ — Live Status Page
 * Real-time stadium monitoring powered by Socket.io.
 */

import { PageContainer, SectionHeader, DashboardCard } from '@components';
import { Activity } from 'lucide-react';

const LivePage = () => (
  <PageContainer>
    <SectionHeader
      title="Live Status"
      description="Real-time stadium metrics — updates every 10 seconds"
      action={
        <div className="flex items-center gap-2">
          <div className="live-dot" />
          <span className="text-green-400 text-sm font-medium">Live</span>
        </div>
      }
    />
    <DashboardCard title="Live Systems" icon={<Activity size={18} />} className="min-h-[400px]">
      <div className="flex flex-col items-center justify-center h-full text-white/40 text-sm py-16 text-center">
        <Activity size={32} className="mb-3 opacity-30 text-green-400" />
        <p>Live status operational feeds are streaming on the Dashboard.</p>
      </div>
    </DashboardCard>
  </PageContainer>
);

export default LivePage;
