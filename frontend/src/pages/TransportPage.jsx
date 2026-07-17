/**
 * StadiumIQ — Transport Page
 * AI transport recommendations and live transit status.
 */

import { useForm } from 'react-hook-form';
import { Train, Bus, Car, AlertTriangle, MapPin, CheckCircle2, Info, Zap, Navigation as NavIcon } from 'lucide-react';

import { useLiveStatus } from '@hooks/useLiveStatus';
import { useAIMutation } from '@hooks/useAIMutation';
import { recommendTransport } from '@services/transport.service';
import {
  PageContainer,
  SectionHeader,
  DashboardCard,
  StatusCard,
  Input,
  Button,
  Alert,
  AIThinking,
  ErrorState,
  DataTable,
  PageLoader
} from '@components';

const TransportPage = () => {
  const { liveStatus, isLoading: isLiveLoading, isError: isLiveError } = useLiveStatus();
  
  const { register, handleSubmit, formState: { errors } } = useForm({
    defaultValues: { destination: 'City Center' }
  });

  const transportMutation = useAIMutation(recommendTransport, {
    successMessage: 'Transport recommendations generated.',
  });

  const onSubmit = (data) => {
    // Format preferences correctly for the backend
    const payload = {
      userLocation: data.userLocation,
      destination: data.destination,
      preferences: { mode: data.preference }
    };
    transportMutation.mutate(payload);
  };

  if (isLiveLoading && !liveStatus) return <PageLoader />;
  if (isLiveError && !liveStatus) return <ErrorState title="Failed to load live data" />;

  const transportStatus = liveStatus?.transport || {};
  
  const result = transportMutation.data;
  const recommendation = result?.recommendation;

  // Table columns for Transport Options
  const optionColumns = [
    { header: 'Mode', key: 'mode', className: 'font-semibold text-white' },
    { header: 'Est. Time', key: 'estimatedTimeMinutes', render: (val) => `${val} min` },
    { header: 'Cost (QAR)', key: 'estimatedCostQAR' },
    { header: 'Status', key: 'availabilityStatus', className: 'text-xs uppercase tracking-wider' },
  ];

  return (
    <PageContainer>
      <SectionHeader
        title="Transport & Logistics"
        description="Live transit conditions and AI-optimized departure routing."
      />

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* ── Left Column: Form & Live Data (4 cols) ── */}
        <div className="lg:col-span-4 space-y-6">
          <DashboardCard title="Find Best Route" icon={<NavIcon size={18} className="text-primary-400" />}>
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
              
              <Input
                label="Current Location"
                placeholder="e.g. Gate 1, VIP Lounge"
                leftIcon={<MapPin size={16} />}
                error={errors.userLocation?.message}
                {...register('userLocation', { required: 'Please enter your location.' })}
              />

              <Input
                label="Destination"
                placeholder="e.g. Hotel, Airport, City Center"
                leftIcon={<MapPin size={16} />}
                {...register('destination')}
              />

              <div className="space-y-1">
                <label className="text-sm font-medium text-white/90">Preference</label>
                <select 
                  className="w-full bg-surface-950 border border-white/10 text-white text-sm rounded-xl px-4 py-2.5 outline-none focus:border-primary-500 transition-colors"
                  {...register('preference')}
                >
                  <option value="fast">Fastest (Time Priority)</option>
                  <option value="cheap">Cheapest (Cost Priority)</option>
                  <option value="eco">Eco-Friendly</option>
                  <option value="accessible">Accessible (Mobility Needs)</option>
                </select>
              </div>

              <Button
                type="submit"
                fullWidth
                isLoading={transportMutation.isPending}
                leftIcon={<Zap size={16} />}
                className="mt-2"
              >
                Analyze Options
              </Button>
            </form>
          </DashboardCard>

          {/* Live Transport Status Cards */}
          <div className="space-y-3">
            <h3 className="text-sm font-semibold text-white/90 mb-2">Live Hub Status</h3>
            
            <StatusCard
              title={`Metro: ${transportStatus.metro?.line}`}
              value={transportStatus.metro?.status}
              subtitle={transportStatus.metro?.delayMinutes > 0 ? `${transportStatus.metro.delayMinutes} min delay` : `Next train in ${transportStatus.metro?.nextDepartureMinutes}m`}
              icon={<Train size={18} />}
            />

            <StatusCard
              title="Taxi Rank"
              value={`Wait: ${transportStatus.taxiWaitMinutes} min`}
              subtitle="Karwa Ride-Hailing Zone"
              icon={<Car size={18} />}
            />

            {transportStatus.buses?.map((bus, i) => (
              <StatusCard
                key={i}
                title={`Bus: ${bus.route}`}
                value={bus.status}
                subtitle={`${bus.seatsAvailable} seats • ${bus.nextArrivalMinutes}m away`}
                icon={<Bus size={18} />}
              />
            ))}
          </div>
        </div>

        {/* ── Right Column: AI Response (8 cols) ── */}
        <div className="lg:col-span-8">
          <DashboardCard title="AI Transport Recommendation" icon={<Zap size={18} />} className="h-full min-h-[500px]">
            {transportMutation.isPending ? (
              <div className="flex items-center justify-center h-full min-h-[400px]">
                <AIThinking label="Analyzing live traffic and transit networks…" />
              </div>
            ) : transportMutation.isError ? (
              <div className="flex items-center justify-center h-full min-h-[400px]">
                <ErrorState title="Analysis Failed" message={transportMutation.error?.message} />
              </div>
            ) : recommendation ? (
              <div className="space-y-6">
                
                {/* 1. The Primary Recommendation */}
                <div className="p-5 rounded-2xl bg-gradient-to-br from-primary-900/40 to-surface-900 border border-primary-500/30">
                  <p className="text-xs text-primary-300/70 uppercase tracking-wider mb-2 font-semibold flex items-center gap-1.5">
                    <CheckCircle2 size={14} /> AI Top Pick
                  </p>
                  <h3 className="text-2xl font-bold text-white mb-2">{recommendation.recommendedOption}</h3>
                  <p className="text-sm text-white/80 leading-relaxed">
                    {recommendation.recommendationReason}
                  </p>
                </div>

                {/* 2. Ranked Options Table */}
                {recommendation.options?.length > 0 && (
                  <div>
                    <h4 className="text-sm font-semibold text-white/90 mb-3">All Available Options</h4>
                    <DataTable 
                      columns={optionColumns} 
                      data={recommendation.options} 
                    />
                  </div>
                )}

                {/* 3. Warnings */}
                {recommendation.warnings?.length > 0 && (
                  <div className="space-y-2">
                    {recommendation.warnings.map((warning, i) => (
                      <Alert key={i} variant="danger" icon={<AlertTriangle size={16} />}>
                        {warning}
                      </Alert>
                    ))}
                  </div>
                )}

                {/* 4. Tips */}
                {recommendation.tips?.length > 0 && (
                  <div>
                    <h4 className="text-sm font-semibold text-white/90 mb-3 mt-4 flex items-center gap-2">
                      <Info size={16} className="text-accent-400" />
                      Travel Tips
                    </h4>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      {recommendation.tips.map((tip, i) => (
                        <div key={i} className="p-3 rounded-lg border border-white/5 bg-surface-950 text-sm text-white/70">
                          {tip}
                        </div>
                      ))}
                    </div>
                  </div>
                )}

              </div>
            ) : (
              <div className="flex flex-col items-center justify-center h-full text-white/30 text-sm py-16 text-center">
                <Train size={32} className="mb-3 opacity-30" />
                <p>Enter your location and preferences to receive an optimized departure strategy.</p>
              </div>
            )}
          </DashboardCard>
        </div>

      </div>
    </PageContainer>
  );
};

export default TransportPage;
