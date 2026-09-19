import { useEffect } from 'react';

export type SkeletonVariant = 'card' | 'table' | 'stats' | 'text' | 'circle';

export interface SkeletonLoaderProps {
  variant?: SkeletonVariant;
  rows?: number;
  className?: string;
  /** When true, renders a CSS-only shimmer without React hooks (SSR-safe) */
  animated?: boolean;
}

const variantStyles: Record<SkeletonVariant, string> = {
  card: 'rounded-lg p-4 space-y-3',
  table: 'rounded-lg overflow-hidden',
  stats: 'rounded-lg p-4 flex items-center gap-4',
  text: 'rounded',
  circle: 'rounded-full',
};

const shimmerKeyframes = `
@keyframes shimmer {
  0% { background-position: -200% 0; }
  100% { background-position: 200% 0; }
}
`;

export function SkeletonLoader({
  variant = 'card',
  rows = 1,
  className = '',
  animated = true,
}: SkeletonLoaderProps) {
  useEffect(() => {
    if (typeof document !== 'undefined' && animated) {
      const style = document.createElement('style');
      style.textContent = shimmerKeyframes;
      document.head.appendChild(style);
      return () => {
        style.remove();
      };
    }
  }, [animated]);

  const shimmer = animated
    ? 'bg-gradient-to-r from-base-300 via-base-200 to-base-300 bg-[length:200%_100%] animate-shimmer'
    : 'bg-base-300';

  const renderCard = () => (
    <div className={`p-4 space-y-3 ${variantStyles.card}`}>
      <div className={`h-4 w-3/4 ${shimmer} rounded`} />
      <div className={`h-3 w-1/2 ${shimmer} rounded`} />
      <div className="space-y-2">
        <div className={`h-2 w-full ${shimmer} rounded`} />
        <div className={`h-2 w-5/6 ${shimmer} rounded`} />
      </div>
    </div>
  );

  const renderStats = () => (
    <div className="flex items-center gap-4 p-4">
      <div className={`w-12 h-12 ${shimmer} rounded-full ${variantStyles.circle}`} />
      <div className="space-y-2">
        <div className={`h-3 w-24 ${shimmer} rounded`} />
        <div className={`h-5 w-16 ${shimmer} rounded`} />
      </div>
    </div>
  );

  const renderText = () => (
    <div className="space-y-2">
      <div className={`h-4 w-full ${shimmer} rounded ${variantStyles.text}`} />
      <div className={`h-4 w-4/5 ${shimmer} rounded ${variantStyles.text}`} />
    </div>
  );

  const renderRow = (i: number) => (
    <tr key={i} className="border-b border-base-300/50">
      <td className="px-4 py-3">
        <div className={`h-4 w-20 ${shimmer} rounded`} />
      </td>
      <td className="px-4 py-3">
        <div className={`h-4 w-32 ${shimmer} rounded`} />
      </td>
      <td className="px-4 py-3">
        <div className={`h-4 w-24 ${shimmer} rounded`} />
      </td>
      <td className="px-4 py-3">
        <div className={`h-6 w-16 ${shimmer} rounded-full`} />
      </td>
    </tr>
  );

  switch (variant) {
    case 'card':
      return (
        <div className={className}>{Array.from({ length: rows }).map((_, i) => renderCard())}</div>
      );
    case 'table':
      return (
        <div className={className}>
          <table className="table w-full">
            <thead>
              <tr className="text-left text-sm text-base-content/60">
                <th className="px-4 py-2">Nombre</th>
                <th className="px-4 py-2">Email</th>
                <th className="px-4 py-2">Estado</th>
                <th className="px-4 py-2">Acciones</th>
              </tr>
            </thead>
            <tbody>{Array.from({ length: rows }).map((_, i) => renderRow(i))}</tbody>
          </table>
        </div>
      );
    case 'stats':
      return (
        <div className={className}>
          {Array.from({ length: rows }).map((_, i) => (
            <div key={i} className="bg-base-100 rounded-lg shadow">
              {renderStats()}
            </div>
          ))}
        </div>
      );
    case 'text':
      return <div className={className}>{renderText()}</div>;
    case 'circle':
      return (
        <div className={className}>
          {Array.from({ length: rows }).map((_, i) => (
            <div key={i} className={`w-12 h-12 ${shimmer} ${variantStyles.circle}`} />
          ))}
        </div>
      );
    default:
      return null;
  }
}

SkeletonLoader.defaultProps = {
  variant: 'card',
  rows: 1,
  animated: true,
};

export default SkeletonLoader;
