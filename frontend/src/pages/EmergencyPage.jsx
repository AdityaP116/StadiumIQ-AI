/**
 * StadiumIQ — Emergency Response Page
 * AI-driven crisis management and incident command.
 */

import { useForm } from 'react-hook-form';
import { 
  Siren, ShieldAlert, HeartPulse, Users, Megaphone, 
  Map, Activity, Clock, FileWarning, ArrowRight 
} from 'lucide-react';

import { useAIMutation } from '@hooks/useAIMutation';
import { respondToEmergency } from '@services/emergency.service';
import {
  PageContainer,
  SectionHeader,
  DashboardCard,
  Input,
  Button,
  Alert,
  AIThinking,
  ErrorState,
} from '@components';
import { STADIUM_ZONES } from '@constants';

const EmergencyPage = () => {
  const { register, handleSubmit } = useForm({
    defaultValues: { severity: 'Moderate' }
  });

  const emergencyMutation = useAIMutation(respondToEmergency, {
    successMessage: 'Emergency response plan generated.',
  });

  const onSubmit = (data) => {
    emergencyMutation.mutate(data);
  };

  const result = emergencyMutation.data;
  const plan = result?.responsePlan;

  return (
    <PageContainer>
      <SectionHeader
        title="Incident Command"
        description="AI-driven emergency response and protocol generation."
        action={
          <div className="flex items-center gap-2 px-3 py-1 bg-red-500/10 border border-red-500/20 rounded-full">
            <div className="w-2 h-2 rounded-full bg-red-500 animate-pulse" />
            <span className="text-red-400 text-xs font-semibold uppercase tracking-wider">Restricted Access</span>
          </div>
        }
      />

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* ── Left Column: Incident Report Form (4 cols) ── */}
        <div className="lg:col-span-4 space-y-6">
          <DashboardCard title="Declare Emergency" icon={<Siren size={18} className="text-red-400" />} className="border-red-500/20">
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
              
              <div className="space-y-1">
                <label className="text-sm font-medium text-white/90">Incident Type</label>
                <select 
                  className="w-full bg-surface-950 border border-white/10 text-white text-sm rounded-xl px-4 py-2.5 outline-none focus:border-red-500 transition-colors"
                  {...register('emergencyType', { required: true })}
                >
                  <option value="medical">Medical Emergency</option>
                  <option value="fire">Fire / Smoke</option>
                  <option value="crowd_crush">Crowd Surge</option>
                  <option value="security">Suspicious Package</option>
                  <option value="structural">Structural Failure</option>
                  <option value="security">Active Threat</option>
                </select>
              </div>

              <div className="space-y-1">
                <label className="text-sm font-medium text-white/90">Affected Zone</label>
                <select 
                  className="w-full bg-surface-950 border border-white/10 text-white text-sm rounded-xl px-4 py-2.5 outline-none focus:border-red-500 transition-colors"
                  {...register('zone', { required: true })}
                >
                  {Object.values(STADIUM_ZONES).map(zone => (
                    <option key={zone} value={zone}>{zone}</option>
                  ))}
                </select>
              </div>

              <div className="space-y-1">
                <label className="text-sm font-medium text-white/90">Severity Level</label>
                <select 
                  className="w-full bg-surface-950 border border-white/10 text-white text-sm rounded-xl px-4 py-2.5 outline-none focus:border-red-500 transition-colors"
                  {...register('severity')}
                >
                  <option value="Minor">Minor</option>
                  <option value="Moderate">Moderate</option>
                  <option value="Critical">Critical</option>
                </select>
              </div>

              <Input
                as="textarea"
                rows={3}
                label="Additional Context"
                placeholder="Briefly describe the situation..."
                {...register('description')}
              />

              <Button
                type="submit"
                fullWidth
                variant="danger"
                isLoading={emergencyMutation.isPending}
                leftIcon={<Activity size={16} />}
                className="mt-2"
              >
                Generate Response Plan
              </Button>
            </form>
          </DashboardCard>
          
          <Alert variant="danger" title="Warning">
            Activating an emergency response plan will log the incident to the official database. Ensure accuracy.
          </Alert>
        </div>

        {/* ── Right Column: AI Response Plan (8 cols) ── */}
        <div className="lg:col-span-8">
          <DashboardCard 
            title={result ? `Active Plan: ${result.emergencyType}` : "Response Plan"} 
            icon={<FileWarning size={18} />} 
            className="h-full min-h-[500px]"
            action={result && (
              <span className="text-xs text-white/40 font-mono">ID: {result.logId}</span>
            )}
          >
            {emergencyMutation.isPending ? (
              <div className="flex items-center justify-center h-full min-h-[400px]">
                <AIThinking label="Generating critical response protocols…" />
              </div>
            ) : emergencyMutation.isError ? (
              <div className="flex items-center justify-center h-full min-h-[400px]">
                <ErrorState title="Failed to generate plan" message={emergencyMutation.error?.message} />
              </div>
            ) : plan ? (
              <div className="space-y-6">
                
                {/* Header Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 border-b border-white/10 pb-6">
                  <div className="p-3 bg-red-500/10 border border-red-500/20 rounded-xl">
                    <p className="text-xs text-red-300/70 uppercase tracking-wider mb-1">Zone</p>
                    <p className="font-semibold text-red-100 flex items-center gap-2"><Map size={14}/> {result.zone}</p>
                  </div>
                  <div className="p-3 bg-red-500/10 border border-red-500/20 rounded-xl">
                    <p className="text-xs text-red-300/70 uppercase tracking-wider mb-1">Severity</p>
                    <p className="font-semibold text-red-100 flex items-center gap-2"><Activity size={14}/> {result.severity}</p>
                  </div>
                  <div className="p-3 bg-red-500/10 border border-red-500/20 rounded-xl">
                    <p className="text-xs text-red-300/70 uppercase tracking-wider mb-1">Est. Resolution</p>
                    <p className="font-semibold text-red-100 flex items-center gap-2"><Clock size={14}/> {plan.ESTIMATED_RESOLUTION_TIME}</p>
                  </div>
                </div>

                {/* PA Announcement */}
                {plan.PUBLIC_ANNOUNCEMENT && (
                  <div>
                    <h4 className="text-sm font-semibold text-white/90 mb-3 flex items-center gap-2">
                      <Megaphone size={16} className="text-primary-400" />
                      Public Address Announcement
                    </h4>
                    <div className="p-4 rounded-xl border border-primary-500/30 bg-primary-500/10 text-primary-100 font-mono text-sm leading-relaxed">
                      &quot;{plan.PUBLIC_ANNOUNCEMENT}&quot;
                    </div>
                  </div>
                )}

                {/* Immediate Actions */}
                {plan.IMMEDIATE_ACTIONS?.length > 0 && (
                  <div>
                    <h4 className="text-sm font-semibold text-white/90 mb-3">Immediate Critical Actions</h4>
                    <div className="space-y-2">
                      {plan.IMMEDIATE_ACTIONS.map((action, i) => (
                        <div key={i} className="flex items-start gap-3 p-3 rounded-lg bg-surface-950 border border-white/5">
                          <div className="w-5 h-5 rounded-full bg-red-500/20 text-red-400 flex items-center justify-center text-xs font-bold shrink-0">
                            {i + 1}
                          </div>
                          <p className="text-sm text-white/80 mt-0.5">{action}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Role Specific Instructions (Color Coded Alerts) */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {plan.SECURITY_INSTRUCTIONS && (
                    <Alert variant="danger" title="Security Protocol" icon={<ShieldAlert size={16} />}>
                      {plan.SECURITY_INSTRUCTIONS}
                    </Alert>
                  )}
                  {plan.MEDICAL_INSTRUCTIONS && (
                    <Alert variant="warning" title="Medical Protocol" icon={<HeartPulse size={16} />}>
                      {plan.MEDICAL_INSTRUCTIONS}
                    </Alert>
                  )}
                  {plan.VOLUNTEER_INSTRUCTIONS && (
                    <Alert variant="success" title="Volunteer Protocol" icon={<Users size={16} />}>
                      {plan.VOLUNTEER_INSTRUCTIONS}
                    </Alert>
                  )}
                </div>

                {/* Evacuation Plan */}
                {plan.EVACUATION_PLAN && plan.EVACUATION_PLAN !== "Not Required" && (
                  <div>
                    <h4 className="text-sm font-semibold text-red-400 mb-3 flex items-center gap-2">
                      <ArrowRight size={16} />
                      Evacuation Routing
                    </h4>
                    <div className="p-4 rounded-xl border border-red-500/30 bg-red-500/10 text-red-100 text-sm leading-relaxed whitespace-pre-wrap">
                      {plan.EVACUATION_PLAN}
                    </div>
                  </div>
                )}

              </div>
            ) : (
              <div className="flex flex-col items-center justify-center h-full text-white/30 text-sm py-16 text-center">
                <Siren size={32} className="mb-3 opacity-30 text-red-400" />
                <p>Complete the incident report form to generate AI-driven response protocols.</p>
              </div>
            )}
          </DashboardCard>
        </div>

      </div>
    </PageContainer>
  );
};

export default EmergencyPage;
