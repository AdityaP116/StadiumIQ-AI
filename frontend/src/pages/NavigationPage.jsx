/**
 * StadiumIQ — Navigation Page
 * AI-powered step-by-step stadium navigation.
 */

import { useForm } from 'react-hook-form';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { MapPin, Navigation as NavIcon, Map, Compass } from 'lucide-react';
import { useAIMutation } from '@hooks/useAIMutation';
import { getNavigationRoute } from '@services/navigation.service';
import {
  PageContainer,
  SectionHeader,
  DashboardCard,
  Input,
  Button,
  AIThinking,
  ErrorState,
  Alert
} from '@components';

const NavigationPage = () => {
  const { register, handleSubmit, formState: { errors } } = useForm();
  
  const navMutation = useAIMutation(getNavigationRoute, {
    successMessage: 'Route generated successfully.',
  });

  const onSubmit = (data) => {
    navMutation.mutate(data);
  };

  const result = navMutation.data;

  return (
    <PageContainer>
      <SectionHeader
        title="Wayfinding & Navigation"
        description="AI-guided turn-by-turn navigation within Lusail Iconic Stadium."
      />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* ── Configuration Form (Left Column) ── */}
        <div className="lg:col-span-1 space-y-4">
          <DashboardCard title="Plan Your Route" icon={<Map size={18} />}>
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
              <Input
                label="Current Location"
                placeholder="e.g. Gate 3, Section 112, or VIP Parking"
                leftIcon={<MapPin size={16} />}
                error={errors.currentLocation?.message}
                {...register('currentLocation', { required: 'Please enter your current location.' })}
              />

              <Input
                label="Destination"
                placeholder="e.g. Nearest Restroom, Food Court, or Seat NS-C-14"
                leftIcon={<NavIcon size={16} />}
                error={errors.destination?.message}
                {...register('destination', { required: 'Please enter your destination.' })}
              />

              <Button
                type="submit"
                fullWidth
                isLoading={navMutation.isPending}
                leftIcon={<Compass size={16} />}
                className="mt-2"
              >
                Find Route
              </Button>
            </form>
          </DashboardCard>
          
          <Alert variant="info" title="How this works">
            Our AI engine calculates the optimal path based on live stadium layout data. It can route you to specific seats, facilities, or emergency exits.
          </Alert>
        </div>

        {/* ── Route Output (Right Column) ── */}
        <div className="lg:col-span-2">
          <DashboardCard title="Route Instructions" icon={<Compass size={18} />} className="h-full min-h-[400px]">
            {navMutation.isPending ? (
              <div className="flex items-center justify-center h-full min-h-[300px]">
                <AIThinking label="Calculating optimal route…" />
              </div>
            ) : navMutation.isError ? (
              <div className="flex items-center justify-center h-full min-h-[300px]">
                <ErrorState title="Navigation Failed" message={navMutation.error?.message} />
              </div>
            ) : result ? (
              <div className="space-y-6">
                
                {/* Seat Context Highlight (if applicable) */}
                {result.seatContext && (
                  <Alert variant="success" title={`Seat Information: ${result.seatContext.id}`}>
                    <ul className="mt-1 space-y-1 list-disc list-inside">
                      <li><strong>Zone:</strong> {result.seatContext.zone}</li>
                      <li><strong>Level:</strong> {result.seatContext.level}</li>
                      <li><strong>Nearest Gate:</strong> {result.seatContext.nearestGate}</li>
                      <li><strong>Accessible:</strong> {result.seatContext.accessible ? 'Yes' : 'No'}</li>
                    </ul>
                  </Alert>
                )}

                {/* AI Route Instructions */}
                <div className="prose prose-invert max-w-none text-sm prose-p:leading-relaxed prose-headings:text-primary-400 prose-a:text-accent-400">
                  <ReactMarkdown remarkPlugins={[remarkGfm]}>
                    {result.route}
                  </ReactMarkdown>
                </div>

              </div>
            ) : (
              <div className="flex flex-col items-center justify-center h-full text-white/30 text-sm py-16 text-center">
                <MapPin size={32} className="mb-3 opacity-50" />
                <p>Enter your location and destination to generate step-by-step instructions.</p>
              </div>
            )}
          </DashboardCard>
        </div>

      </div>
    </PageContainer>
  );
};

export default NavigationPage;
