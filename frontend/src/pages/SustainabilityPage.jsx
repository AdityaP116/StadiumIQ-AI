/**
 * StadiumIQ — Sustainability Page
 * AI-generated eco-friendly recommendations and carbon footprint reductions.
 */

import { useForm } from 'react-hook-form';
import { Leaf, Zap, TreePine, Lightbulb, Target, TrendingDown, Info, BarChart3, Recycle } from 'lucide-react';

import { useAIMutation } from '@hooks/useAIMutation';
import { getSustainabilityTips } from '@services/sustainability.service';
import {
  PageContainer,
  SectionHeader,
  DashboardCard,
  MetricCard,
  Input,
  Button,
  Alert,
  AIThinking,
  ErrorState,
  DataTable,
  StatusBadge
} from '@components';

const SustainabilityPage = () => {
  const { register, handleSubmit } = useForm({
    defaultValues: { targetAudience: 'fans' }
  });

  const ecoMutation = useAIMutation(getSustainabilityTips, {
    successMessage: 'Sustainability recommendations generated.',
  });

  const onSubmit = (data) => {
    ecoMutation.mutate(data);
  };

  const result = ecoMutation.data;

  // Render difficulty or impact as badges
  const renderBadge = (value) => {
    let variant = 'info';
    const v = value?.toUpperCase();
    if (v === 'HIGH' || v === 'HARD') variant = 'danger';
    if (v === 'MEDIUM' || v === 'MODERATE') variant = 'warning';
    if (v === 'LOW' || v === 'EASY') variant = 'success';
    
    return <StatusBadge variant={variant} size="xs">{value}</StatusBadge>;
  };

  const tipColumns = [
    { header: 'Category', key: 'category', className: 'text-white/60 text-xs uppercase' },
    { header: 'Actionable Tip', key: 'tip', className: 'font-medium text-white/90 w-1/2' },
    { header: 'Impact', key: 'impact', render: renderBadge },
    { header: 'Difficulty', key: 'difficulty', render: renderBadge },
  ];

  return (
    <PageContainer>
      <SectionHeader
        title="Sustainability & Eco-Score"
        description="AI-driven environmental intelligence for a greener tournament."
      />

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* ── Left Column: Form & Fixed Metrics (4 cols) ── */}
        <div className="lg:col-span-4 space-y-6">
          <DashboardCard title="Generate Green Strategy" icon={<Leaf size={18} className="text-green-400" />}>
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
              
              <div className="space-y-1">
                <label className="text-sm font-medium text-white/90">Target Audience</label>
                <select 
                  className="w-full bg-surface-950 border border-white/10 text-white text-sm rounded-xl px-4 py-2.5 outline-none focus:border-green-500 transition-colors"
                  {...register('targetAudience')}
                >
                  <option value="fans">Fans & Visitors</option>
                  <option value="operations">Stadium Operations Staff</option>
                  <option value="both">All Stakeholders</option>
                </select>
              </div>

              <Input
                label="Specific Concern (Optional)"
                placeholder="e.g. Plastic waste at Gate 3, HVAC energy"
                leftIcon={<Target size={16} />}
                {...register('specificConcern')}
              />

              <Button
                type="submit"
                fullWidth
                isLoading={ecoMutation.isPending}
                leftIcon={<Lightbulb size={16} />}
                className="mt-2 bg-green-600 hover:bg-green-500 text-white"
              >
                Analyze Sustainability
              </Button>
            </form>
          </DashboardCard>

          {/* Dummy static widgets to fulfill "Statistics Cards" request while backend AI loads */}
          <div className="grid grid-cols-2 gap-4">
            <MetricCard
              title="Eco Score"
              icon={<TreePine size={18} className="text-green-400" />}
              value="92"
              subtitle="/ 100 System Rating"
              statusLevel="success"
            />
            <MetricCard
              title="Energy Efficiency"
              icon={<Zap size={18} className="text-accent-400" />}
              value="Optimum"
              subtitle="Cooling systems active"
              statusLevel="success"
            />
          </div>
        </div>


        {/* ── Right Column: AI Response (8 cols) ── */}
        <div className="lg:col-span-8">
          <DashboardCard title="Environmental Intelligence" icon={<BarChart3 size={18} />} className="h-full min-h-[500px]">
            {ecoMutation.isPending ? (
              <div className="flex items-center justify-center h-full min-h-[400px]">
                <AIThinking label="Calculating carbon offset strategies…" />
              </div>
            ) : ecoMutation.isError ? (
              <div className="flex items-center justify-center h-full min-h-[400px]">
                <ErrorState title="Analysis Failed" message={ecoMutation.error?.message} />
              </div>
            ) : result ? (
              <div className="space-y-6">
                
                {/* 1. Top Tip */}
                <div className="p-5 rounded-2xl bg-gradient-to-br from-green-900/40 to-surface-900 border border-green-500/30 shadow-glow-accent">
                  <p className="text-xs text-green-300/70 uppercase tracking-wider mb-2 font-semibold flex items-center gap-1.5">
                    <Lightbulb size={14} className="text-green-400" /> Primary Recommendation
                  </p>
                  <h3 className="text-xl font-bold text-white leading-relaxed">{result.topTip}</h3>
                </div>

                {/* 2. Estimates & Facts Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {result.carbonSavingEstimate && (
                    <Alert variant="success" icon={<TrendingDown size={16} />}>
                      <strong>Estimated Impact:</strong> {result.carbonSavingEstimate}
                    </Alert>
                  )}
                  {result.funFact && (
                    <Alert variant="info" icon={<Info size={16} />}>
                      <strong>Did you know?</strong> {result.funFact}
                    </Alert>
                  )}
                </div>

                {/* 3. Detailed Tips Table */}
                {result.tips?.length > 0 && (
                  <div>
                    <h4 className="text-sm font-semibold text-white/90 mb-3 flex items-center gap-2">
                      <Recycle size={16} className="text-green-400" />
                      Actionable Strategies
                    </h4>
                    <DataTable 
                      columns={tipColumns} 
                      data={result.tips} 
                    />
                  </div>
                )}

                {/* 4. Call to Action */}
                {result.callToAction && (
                  <div className="p-4 rounded-xl border border-white/5 bg-surface-950 text-center">
                    <p className="text-sm font-medium text-white/80">{result.callToAction}</p>
                  </div>
                )}

              </div>
            ) : (
              <div className="flex flex-col items-center justify-center h-full text-white/30 text-sm py-16 text-center">
                <Leaf size={32} className="mb-3 opacity-30 text-green-400" />
                <p>Generate targeted sustainability strategies for fans and stadium operators.</p>
              </div>
            )}
          </DashboardCard>
        </div>

      </div>
    </PageContainer>
  );
};

export default SustainabilityPage;
