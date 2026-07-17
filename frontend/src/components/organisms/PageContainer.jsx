/**
 * StadiumIQ — Page Container (Organism)
 *
 * Higher-level wrapper replacing the raw `<div className="page-wrapper">`.
 * Ensures consistent padding, max-width, and animated entry across all routes.
 */

import { motion } from 'framer-motion';

const PageContainer = ({ children, className = '' }) => (
  <motion.div
    initial={{ opacity: 0, y: 15 }}
    animate={{ opacity: 1, y: 0 }}
    exit={{ opacity: 0, y: -15 }}
    transition={{ duration: 0.3, ease: 'easeOut' }}
    className={`flex flex-col gap-6 p-4 sm:p-6 md:p-8 max-w-screen-2xl mx-auto w-full ${className}`}
  >
    {children}
  </motion.div>
);

export default PageContainer;
