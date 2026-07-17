/**
 * StadiumIQ — Section Header (Molecule)
 *
 * Reusable header for sections inside pages.
 * Supports a title, description, and optional right-side action slot.
 */

const SectionHeader = ({ title, description, action }) => (
  <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-6">
    <div>
      <h2 className="section-title">{title}</h2>
      {description && <p className="text-white/40 text-sm mt-1">{description}</p>}
    </div>
    {action && <div className="shrink-0">{action}</div>}
  </div>
);

export default SectionHeader;
