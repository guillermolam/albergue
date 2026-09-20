import { useId, type ReactNode } from 'react';

interface DoodleFrameProps {
  children: ReactNode;
  className?: string;
  /** 'featured' tints the panel and border a stronger green. */
  variant?: 'default' | 'featured';
  /** Overrides the panel/pedestal stroke color (e.g. emergency-red cards). */
  borderColor?: string;
  /** Width in px of the hatched "pedestal" edge along the bottom and right. */
  edge?: number;
  /** Corner radius in px. */
  radius?: number;
}

/**
 * Hand-drawn card frame: a rounded double-line panel sitting on top of a
 * cross-hatched offset twin of itself, so only a hatched strip peeks out
 * along the bottom and right edges -- a sketched stand-in for a drop
 * shadow, matching the site's hand-drawn/sticker visual language.
 *
 * The offset is real layout space (padding-right/bottom on the outer box),
 * not an absolutely-positioned overlay, so the frame sizes itself to
 * whatever content is passed in.
 */
export function DoodleFrame({
  children,
  className = '',
  variant = 'default',
  borderColor,
  edge = 9,
  radius = 16,
}: Readonly<DoodleFrameProps>) {
  const patternId = useId();
  const innerRadius = Math.max(radius - 4, 4);
  const isFeatured = variant === 'featured';
  const panelFill = isFeatured ? '#F1F8F2' : '#FFFFFF';
  const strokeColor = borderColor ?? '#1A1A1A';
  const sketchLineColor = borderColor ?? (isFeatured ? '#00AB39' : '#1A1A1A');

  return (
    <div className={`relative ${className}`} style={{ paddingRight: edge, paddingBottom: edge }}>
      <svg className="pointer-events-none absolute inset-0 h-full w-full" aria-hidden="true">
        <defs>
          <pattern
            id={patternId}
            patternUnits="userSpaceOnUse"
            width="7"
            height="7"
            patternTransform="rotate(45)"
          >
            <rect width="7" height="7" fill="#FFFFFF" />
            <line x1="0" y1="0" x2="0" y2="7" stroke="#1A1A1A" strokeWidth="1.4" opacity="0.55" />
            <line x1="0" y1="0" x2="7" y2="0" stroke="#1A1A1A" strokeWidth="1.4" opacity="0.55" />
          </pattern>
        </defs>

        {/* Hatched pedestal, offset down-right */}
        <rect
          x={edge}
          y={edge}
          width={`calc(100% - ${edge}px)`}
          height={`calc(100% - ${edge}px)`}
          rx={radius}
          fill={`url(#${patternId})`}
          stroke={strokeColor}
          strokeWidth="2.2"
        />

        {/* Main panel */}
        <rect
          x="0"
          y="0"
          width={`calc(100% - ${edge}px)`}
          height={`calc(100% - ${edge}px)`}
          rx={radius}
          fill={panelFill}
          stroke={strokeColor}
          strokeWidth="2.6"
        />
        {/* Inner sketch line -- the doodle "retrace" */}
        <rect
          x="4"
          y="4"
          width={`calc(100% - ${edge}px - 8px)`}
          height={`calc(100% - ${edge}px - 8px)`}
          rx={innerRadius}
          fill="none"
          stroke={sketchLineColor}
          strokeWidth="1.4"
          opacity="0.5"
        />
      </svg>

      <div className="relative overflow-hidden" style={{ borderRadius: radius }}>
        {children}
      </div>
    </div>
  );
}
