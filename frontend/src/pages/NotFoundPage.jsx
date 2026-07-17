/**
 * StadiumIQ — 404 Not Found Page
 */

import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Home, AlertCircle } from 'lucide-react';
import { ROUTES } from '@constants';

const NotFoundPage = () => (
  <div className="min-h-screen bg-surface-900 flex flex-col items-center justify-center gap-6 p-4">
    <motion.div
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1 }}
      className="text-center"
    >
      <p className="text-8xl font-black text-gradient-primary mb-4">404</p>
      <div className="w-16 h-16 rounded-2xl bg-primary-500/10 border border-primary-500/20 flex items-center justify-center mx-auto mb-4">
        <AlertCircle size={28} className="text-primary-400" />
      </div>
      <h1 className="text-2xl font-bold text-white mb-2">Page not found</h1>
      <p className="text-white/40 text-sm mb-8">The page you&apos;re looking for doesn&apos;t exist or has been moved.</p>
      <Link to={ROUTES.DASHBOARD} className="btn-primary">
        <Home size={16} />
        Back to Dashboard
      </Link>
    </motion.div>
  </div>
);

export default NotFoundPage;
