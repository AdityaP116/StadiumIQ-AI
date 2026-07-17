/**
 * StadiumIQ — Footer (Layout)
 *
 * Minimal footer displayed at the bottom of the main content area.
 */

const AppFooter = () => (
  <footer className="w-full py-6 px-4 mt-auto border-t border-white/5 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-white/30">
    <p>© {new Date().getFullYear()} StadiumIQ. All rights reserved.</p>
    <div className="flex gap-4">
      <a href="#" className="hover:text-white/60 transition-colors">Privacy</a>
      <a href="#" className="hover:text-white/60 transition-colors">Terms</a>
      <a href="#" className="hover:text-white/60 transition-colors">Support</a>
    </div>
  </footer>
);

export default AppFooter;
