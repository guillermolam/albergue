import { useEffect, useRef } from 'react';

interface DoodlePatternProps {
  pattern: string;
  className?: string;
  grid?: string;
}

/**
 * DoodlePattern component using css-doodle syntax
 * Renders decorative doodle patterns as SVG backgrounds
 */
export function DoodlePattern({ pattern, className = '', grid = '10x10' }: DoodlePatternProps) {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (containerRef.current) {
      // Parse grid dimensions
      const [cols, rows] = grid.split('x').map(Number);

      // Generate SVG pattern
      const svg = generateDoodlePattern(pattern, cols, rows);
      containerRef.current.innerHTML = svg;
    }
  }, [pattern, grid]);

  return <div ref={containerRef} className={`absolute inset-0 pointer-events-none ${className}`} />;
}

function generateDoodlePattern(pattern: string, cols: number, rows: number): string {
  const width = 100;
  const height = 100;
  const cellWidth = width / cols;
  const cellHeight = height / rows;

  let shapes = '';

  for (let row = 0; row < rows; row++) {
    for (let col = 0; col < cols; col++) {
      const x = col * cellWidth + cellWidth / 2;
      const y = row * cellHeight + cellHeight / 2;
      const index = row * cols + col;

      // Random variation for organic feel
      const wobbleX = Math.sin(index * 1.23) * 2;
      const wobbleY = Math.cos(index * 0.87) * 2;
      const rotation = Math.sin(index * 2.34) * 15;
      const scale = 0.8 + Math.sin(index * 1.67) * 0.2;

      if (pattern === 'dots') {
        const radius = cellWidth * 0.15 * scale;
        shapes += `<circle 
          cx="${x + wobbleX}" 
          cy="${y + wobbleY}" 
          r="${radius}" 
          fill="currentColor" 
          opacity="${0.15 + Math.sin(index) * 0.1}"
        />`;
      } else if (pattern === 'crosses') {
        const size = cellWidth * 0.3 * scale;
        shapes += `<g transform="translate(${x + wobbleX}, ${y + wobbleY}) rotate(${rotation})">
          <line 
            x1="${-size}" y1="0" 
            x2="${size}" y2="0" 
            stroke="currentColor" 
            stroke-width="1.5" 
            opacity="0.2"
            stroke-linecap="round"
          />
          <line 
            x1="0" y1="${-size}" 
            x2="0" y2="${size}" 
            stroke="currentColor" 
            stroke-width="1.5" 
            opacity="0.2"
            stroke-linecap="round"
          />
        </g>`;
      } else if (pattern === 'stars') {
        const size = cellWidth * 0.25 * scale;
        shapes += `<g transform="translate(${x + wobbleX}, ${y + wobbleY}) rotate(${rotation})">
          <path 
            d="M 0,${-size} L ${size * 0.3},${-size * 0.3} L ${size},${-size * 0.2} L ${size * 0.4},${size * 0.2} L ${size * 0.5},${size} L 0,${size * 0.5} L ${-size * 0.5},${size} L ${-size * 0.4},${size * 0.2} L ${-size},${-size * 0.2} L ${-size * 0.3},${-size * 0.3} Z" 
            fill="currentColor" 
            opacity="${0.15 + Math.sin(index) * 0.08}"
          />
        </g>`;
      } else if (pattern === 'squiggles') {
        const size = cellWidth * 0.4;
        const cx1 = x - size + wobbleX;
        const cy1 = y + wobbleY;
        const cx2 = x + size + wobbleX;
        const cy2 = y + wobbleY;
        shapes += `<path 
          d="M ${cx1},${cy1} Q ${x},${y - size * 0.5} ${cx2},${cy2}" 
          stroke="currentColor" 
          stroke-width="1.5" 
          fill="none" 
          opacity="0.15"
          stroke-linecap="round"
        />`;
      } else if (pattern === 'circles') {
        const radius = cellWidth * 0.2 * scale;
        shapes += `<circle 
          cx="${x + wobbleX}" 
          cy="${y + wobbleY}" 
          r="${radius}" 
          fill="none" 
          stroke="currentColor" 
          stroke-width="1.5"
          opacity="${0.12 + Math.sin(index) * 0.08}"
        />`;
      }
    }
  }

  return `
    <svg 
      viewBox="0 0 ${width} ${height}" 
      preserveAspectRatio="xMidYMid slice"
      className="w-full h-full"
      style="color: currentColor"
    >
      ${shapes}
    </svg>
  `;
}

/**
 * Predefined doodle pattern presets
 */
export const DoodlePatterns = {
  Dots: (props: Omit<DoodlePatternProps, 'pattern'>) => <DoodlePattern pattern="dots" {...props} />,
  Crosses: (props: Omit<DoodlePatternProps, 'pattern'>) => (
    <DoodlePattern pattern="crosses" {...props} />
  ),
  Stars: (props: Omit<DoodlePatternProps, 'pattern'>) => (
    <DoodlePattern pattern="stars" {...props} />
  ),
  Squiggles: (props: Omit<DoodlePatternProps, 'pattern'>) => (
    <DoodlePattern pattern="squiggles" {...props} />
  ),
  Circles: (props: Omit<DoodlePatternProps, 'pattern'>) => (
    <DoodlePattern pattern="circles" {...props} />
  ),
};
