import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { Megaphone, MapPin, Languages, AlertTriangle, CheckCircle } from 'lucide-react';

import { useAIMutation } from '@hooks/useAIMutation';
import { generateAnnouncement } from '@services/announcement.service';
import {
  PageContainer,
  SectionHeader,
  DashboardCard,
  Input,
  Button,
  Modal,
  AIThinking,
  ErrorState,
} from '@components';
import { STADIUM_ZONES } from '@constants';

const AnnouncementsPage = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const { register, handleSubmit } = useForm({
    defaultValues: {
      type: 'Emergency',
      zone: 'All Zones',
      languages: { English: true, Arabic: true, Spanish: false, French: false }
    }
  });

  const announcementMutation = useAIMutation(generateAnnouncement, {
    successMessage: 'Announcement generated successfully.',
  });

  const onSubmit = (data) => {
    const selectedLanguages = Object.entries(data.languages)
      .filter(([, isSelected]) => isSelected)
      .map(([lang]) => lang);
    
    announcementMutation.mutate({
      type: data.type,
      zone: data.zone,
      message: data.message,
      languages: selectedLanguages
    });
  };

  const result = announcementMutation.data;

  return (
    <PageContainer>
      <SectionHeader
        title="PA Announcements"
        description="AI-generated multilingual public address announcements."
        action={
          <div className="flex items-center gap-2 px-3 py-1 bg-primary-500/10 border border-primary-500/20 rounded-full">
            <Megaphone size={14} className="text-primary-400" />
            <span className="text-primary-400 text-xs font-semibold uppercase tracking-wider">Broadcasting System</span>
          </div>
        }
      />

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* ── Left Column: Generator Form (4 cols) ── */}
        <div className="lg:col-span-4 space-y-6">
          <DashboardCard title="Configure Announcement" icon={<MapPin size={18} />}>
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
              
              <div className="space-y-1">
                <label className="text-sm font-medium text-white/90">Announcement Type</label>
                <select 
                  className="w-full bg-surface-950 border border-white/10 text-white text-sm rounded-xl px-4 py-2.5 outline-none focus:border-primary-500 transition-colors"
                  {...register('type', { required: true })}
                >
                  <option value="Emergency">Emergency / Evacuation</option>
                  <option value="Operational">Operational / Crowd Control</option>
                  <option value="Informational">Informational / General</option>
                </select>
              </div>

              <div className="space-y-1">
                <label className="text-sm font-medium text-white/90">Target Zone</label>
                <select 
                  className="w-full bg-surface-950 border border-white/10 text-white text-sm rounded-xl px-4 py-2.5 outline-none focus:border-primary-500 transition-colors"
                  {...register('zone', { required: true })}
                >
                  <option value="All Zones">All Zones (Stadium-Wide)</option>
                  {Object.values(STADIUM_ZONES).map(zone => (
                    <option key={zone} value={zone}>{zone}</option>
                  ))}
                </select>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium text-white/90 flex items-center gap-2">
                  <Languages size={14} /> Languages
                </label>
                <div className="grid grid-cols-2 gap-2">
                  {['English', 'Arabic', 'Spanish', 'French'].map(lang => (
                    <label key={lang} className="flex items-center gap-2 text-sm text-white/70">
                      <input type="checkbox" {...register(`languages.${lang}`)} className="rounded border-white/20 bg-surface-950 text-primary-500 focus:ring-primary-500" />
                      {lang}
                    </label>
                  ))}
                </div>
              </div>

              <Input
                as="textarea"
                rows={3}
                label="Core Message Context"
                placeholder="Briefly describe what needs to be communicated..."
                {...register('message', { required: true })}
              />

              <Button
                type="submit"
                fullWidth
                variant="primary"
                isLoading={announcementMutation.isPending}
                leftIcon={<Megaphone size={16} />}
                className="mt-2"
              >
                Generate Scripts
              </Button>
            </form>
          </DashboardCard>
        </div>

        {/* ── Right Column: AI Output (8 cols) ── */}
        <div className="lg:col-span-8">
          <DashboardCard 
            title="Generated Broadcast Scripts" 
            icon={<AlertTriangle size={18} />} 
            className="h-full min-h-[500px]"
          >
            {announcementMutation.isPending ? (
              <div className="flex items-center justify-center h-full min-h-[400px]">
                <AIThinking label="Translating and adapting tone…" />
              </div>
            ) : announcementMutation.isError ? (
              <div className="flex items-center justify-center h-full min-h-[400px]">
                <ErrorState title="Generation Failed" message={announcementMutation.error?.message} />
              </div>
            ) : result && result.announcements ? (
              <div className="space-y-6">
                
                {result.announcements.map((ann, idx) => (
                  <div key={idx} className="p-5 rounded-xl border border-white/10 bg-surface-950">
                    <div className="flex items-center justify-between mb-3 border-b border-white/10 pb-3">
                      <h4 className="text-sm font-bold text-white flex items-center gap-2">
                        <Languages size={16} className="text-primary-400" />
                        {ann.language}
                      </h4>
                      {ann.language === 'English' && (
                        <span className="text-[10px] uppercase tracking-wider text-primary-400/70 font-semibold bg-primary-500/10 px-2 py-1 rounded">Primary</span>
                      )}
                    </div>
                    <p className="text-sm text-white/90 leading-relaxed font-mono whitespace-pre-wrap">
                      &quot;{ann.script}&quot;
                    </p>
                    {ann.phoneticPronunciation && (
                      <div className="mt-3 pt-3 border-t border-white/5">
                        <p className="text-xs text-white/40 uppercase tracking-wider mb-1">Phonetic Guide</p>
                        <p className="text-xs text-white/60 italic">{ann.phoneticPronunciation}</p>
                      </div>
                    )}
                  </div>
                ))}

                <div className="flex justify-end pt-4">
                  <Button variant="accent" onClick={() => setIsModalOpen(true)}>
                    Confirm & Broadcast to PA System
                  </Button>
                </div>

              </div>
            ) : (
              <div className="flex flex-col items-center justify-center h-full text-white/30 text-sm py-16 text-center">
                <Megaphone size={32} className="mb-3 opacity-30 text-primary-400" />
                <p>Configure and generate an announcement to view multilingual scripts.</p>
              </div>
            )}
          </DashboardCard>
        </div>

      </div>

      <Modal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
        title="Confirm Broadcast"
      >
        <div className="p-4">
          <p className="text-sm text-white/80 mb-6">
            You are about to transmit this message to the live Public Address system for the selected zones. This action cannot be undone. Are you sure you want to proceed?
          </p>
          <div className="flex items-center gap-3 justify-end">
            <Button variant="ghost" onClick={() => setIsModalOpen(false)}>Cancel</Button>
            <Button variant="danger" leftIcon={<CheckCircle size={16} />} onClick={() => {
              setIsModalOpen(false);
              // Mock broadcast success
              alert("Broadcast initiated successfully.");
            }}>
              Transmit Now
            </Button>
          </div>
        </div>
      </Modal>

    </PageContainer>
  );
};

export default AnnouncementsPage;
