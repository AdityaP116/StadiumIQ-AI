/**
 * StadiumIQ — Page Loader (Suspense fallback)
 * Full-screen animated loading state used during lazy-loaded page transitions.
 */

import { motion } from 'framer-motion';

const PageLoader = () => (
  <div className="min-h-screen bg-surface-950 flex flex-col items-center justify-center gap-6">
    {/* Animated logo mark */}
    <div className="relative flex items-center justify-center">
      <motion.div
        animate={{ scale: [1, 1.2, 1], opacity: [0.3, 0.8, 0.3] }}
        transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
        className="absolute w-24 h-24 rounded-full bg-primary-500/20 blur-xl"
      />
      <motion.div
        animate={{ rotate: 360 }}
        transition={{ duration: 2, repeat: Infinity, ease: 'linear' }}
        className="w-12 h-12 rounded-2xl border-2 border-white/5 border-t-primary-500 shadow-glow-primary relative z-10 bg-surface-900/50 backdrop-blur-sm"
      />
    </div>
    <div className="flex flex-col items-center gap-1">
      <p className="text-white/80 text-[15px] font-medium tracking-wide">Initializing</p>
      <p className="text-white/30 text-xs tracking-widest uppercase">StadiumIQ AI Operations</p>
    </div>
  </div>
);

export default PageLoader;
