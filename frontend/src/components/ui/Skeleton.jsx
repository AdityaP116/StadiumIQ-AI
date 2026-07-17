/**
 * StadiumIQ — Skeleton Loader
 * Animated shimmer placeholder for loading states.
 *
 * @param {string}  className - Additional Tailwind classes (width, height, etc.)
 * @param {number}  [count=1] - Number of skeleton lines to render
 * @param {string}  [spacing] - Gap between multiple lines
 */

const Skeleton = ({ className = '', count = 1, spacing = 'gap-2' }) => {
  if (count === 1) {
    return <div className={`skeleton ${className}`} />;
  }

  return (
    <div className={`flex flex-col ${spacing}`}>
      {Array.from({ length: count }).map((_, i) => (
        <div key={i} className={`skeleton ${className}`} />
      ))}
    </div>
  );
};

export default Skeleton;
