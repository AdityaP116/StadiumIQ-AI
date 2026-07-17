/**
 * StadiumIQ — Accessibility Support Page
 * AI-generated accessible routes and assistance plans.
 */

import { useForm } from 'react-hook-form';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { 
  Accessibility as AccessIcon, MapPin, Navigation as NavIcon, 
  Eye, Ear, CheckCircle2, HeartHandshake, Info 
} from 'lucide-react';

import { useAIMutation } from '@hooks/useAIMutation';
import { getAccessibilityAssistance } from '@services/accessibility.service';
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

const QUICK_NEEDS = [
  { id: 'wheelchair', label: 'Wheelchair Route', icon: <AccessIcon size={16} /> },
  { id: 'visual', label: 'Visual Assistance', icon: <Eye size={16} /> },
  { id: 'hearing', label: 'Hearing Assistance', icon: <Ear size={16} /> },
];

const AccessibilityPage = () => {
  const { register, handleSubmit, setValue, watch, formState: { errors } } = useForm();
  
  const accessMutation = useAIMutation(getAccessibilityAssistance, {
    successMessage: 'Accessibility plan generated.',
  });

  const watchNeed = watch('need');

  const onSubmit = (data) => {
    accessMutation.mutate(data);
  };

  const result = accessMutation.data;

  return (
    <PageContainer>
      <SectionHeader
        title="Accessibility Support"
        description="Dedicated routing and assistance for fans with disabilities."
      />

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* ── Configuration Form (4 cols) ── */}
        <div className="lg:col-span-4 space-y-6">
          <DashboardCard title="Request Assistance" icon={<HeartHandshake size={18} className="text-primary-400" />}>
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
              
              {/* Quick Select Needs */}
              <div className="space-y-2">
                <label className="text-sm font-medium text-white/90">Primary Need</label>
                <div className="grid grid-cols-1 gap-2">
                  {QUICK_NEEDS.map((need) => (
                    <button
                      key={need.id}
                      type="button"
                      onClick={() => setValue('need', need.label, { shouldValidate: true })}
                      className={`flex items-center gap-3 p-3 rounded-xl border text-sm transition-all text-left ${
                        watchNeed === need.label 
                          ? 'border-primary-500 bg-primary-500/20 text-white' 
                          : 'border-white/10 bg-white/5 text-white/70 hover:bg-white/10 hover:border-white/20'
                      }`}
                    >
                      <div className={watchNeed === need.label ? 'text-primary-400' : 'text-white/40'}>
                        {need.icon}
                      </div>
                      <span className="font-medium">{need.label}</span>
                      {watchNeed === need.label && <CheckCircle2 size={16} className="ml-auto text-primary-400" />}
                    </button>
                  ))}
                </div>
                {/* Fallback hidden input to register the field with react-hook-form */}
                <input type="hidden" {...register('need', { required: 'Please select or describe your accessibility need.' })} />
                {errors.need && <span className="text-xs text-red-400">{errors.need.message}</span>}
              </div>

              {/* Specifics */}
              <Input
                label="Custom Need (Optional)"
                placeholder="e.g. Sensory room access, service animal relief area"
                onChange={(e) => setValue('need', e.target.value, { shouldValidate: true })}
              />

              <Input
                label="Current Location"
                placeholder="e.g. Gate 3"
                leftIcon={<MapPin size={16} />}
                {...register('currentLocation')}
              />

              <Input
                label="Destination"
                placeholder="e.g. Accessible Restroom, Section 112"
                leftIcon={<NavIcon size={16} />}
                {...register('destination')}
              />

              <Button
                type="submit"
                fullWidth
                isLoading={accessMutation.isPending}
                className="mt-2"
              >
                Generate Plan
              </Button>
            </form>
          </DashboardCard>

          {/* Available Facilities List (Appears after fetching) */}
          {result?.availableFeatures?.length > 0 && (
            <DashboardCard title="Stadium Facilities" icon={<Info size={16} />} noPadding>
              <div className="p-2 space-y-1 max-h-[200px] overflow-y-auto no-scrollbar">
                {result.availableFeatures.map((feature, i) => (
                  <div key={i} className="flex items-center gap-2 p-2 rounded-lg hover:bg-white/5 text-sm text-white/80">
                    <CheckCircle2 size={14} className="text-green-400 shrink-0" />
                    <span>{feature}</span>
                  </div>
                ))}
              </div>
            </DashboardCard>
          )}
        </div>

        {/* ── Output (8 cols) ── */}
        <div className="lg:col-span-8">
          <DashboardCard title="Assistance Plan & Routing" icon={<AccessIcon size={18} />} className="h-full min-h-[400px]">
            {accessMutation.isPending ? (
              <div className="flex items-center justify-center h-full min-h-[300px]">
                <AIThinking label="Generating accessible routes and instructions…" />
              </div>
            ) : accessMutation.isError ? (
              <div className="flex items-center justify-center h-full min-h-[300px]">
                <ErrorState title="Failed to generate plan" message={accessMutation.error?.message} />
              </div>
            ) : result ? (
              <div className="space-y-6">
                <Alert variant="info" title={`Need: ${result.need}`}>
                  Routing from <strong>{result.currentLocation || 'Stadium Entrance'}</strong> to <strong>{result.destination || 'Seating Area'}</strong>.
                </Alert>

                <div className="prose prose-invert max-w-none text-sm prose-p:leading-relaxed prose-headings:text-primary-400 prose-a:text-accent-400">
                  <ReactMarkdown remarkPlugins={[remarkGfm]}>
                    {result.assistance}
                  </ReactMarkdown>
                </div>
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center h-full text-white/30 text-sm py-16 text-center">
                <AccessIcon size={32} className="mb-3 opacity-50" />
                <p>Select your needs and locations to generate a customized accessibility plan.</p>
              </div>
            )}
          </DashboardCard>
        </div>

      </div>
    </PageContainer>
  );
};

export default AccessibilityPage;
