/**
 * StadiumIQ — Profile Page (Protected)
 * View and edit the authenticated user's profile.
 */

import { PageContainer, SectionHeader, DashboardCard } from '@components';
import { User, Shield } from 'lucide-react';
import { useAuth } from '@context/AuthContext';

const ProfilePage = () => {
  const { user } = useAuth();
  
  return (
    <PageContainer>
      <SectionHeader
        title="My Profile"
        description="Manage your StadiumIQ account"
        action={
          <div className="px-3 py-1 bg-primary-500/10 border border-primary-500/20 rounded-full">
            <span className="text-primary-400 text-xs font-semibold tracking-wider">Account Active</span>
          </div>
        }
      />
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <DashboardCard title="Account Details" icon={<User size={18} />}>
          <div className="space-y-4">
            <div>
              <p className="text-xs text-white/40 uppercase tracking-wider mb-1">Email</p>
              <p className="text-white text-sm">{user?.email || 'Authenticated User'}</p>
            </div>
            <div>
              <p className="text-xs text-white/40 uppercase tracking-wider mb-1">User ID</p>
              <p className="text-white/70 text-sm font-mono">{user?.uid || 'N/A'}</p>
            </div>
          </div>
        </DashboardCard>

        <DashboardCard title="Security & Roles" icon={<Shield size={18} />}>
           <div className="flex flex-col items-center justify-center h-full text-white/40 text-sm py-4 text-center">
            <Shield size={32} className="mb-3 opacity-30 text-primary-400" />
            <p>Role management is restricted.</p>
          </div>
        </DashboardCard>
      </div>
    </PageContainer>
  );
};

export default ProfilePage;
