import { motion } from 'motion/react';

interface DoodleBedProps {
  bedNumber: number;
  status: 'available' | 'selected' | 'reserved' | 'occupied';
  onClick: () => void;
}

export function DoodleBed({ bedNumber, status, onClick }: DoodleBedProps) {
  const colors = {
    available: { fill: '#E8F5E9', stroke: '#00AB39', text: '#00AB39' },
    selected: { fill: '#0071BC', stroke: '#005a8f', text: '#ffffff' },
    reserved: { fill: '#FFF9C4', stroke: '#EAC102', text: '#5D4E37' },
    occupied: { fill: '#FFEBEE', stroke: '#ED1C24', text: '#ED1C24' }
  };

  const color = colors[status];
  const isDisabled = status === 'reserved' || status === 'occupied';

  return (
    <motion.button
      onClick={onClick}
      disabled={isDisabled}
      whileHover={!isDisabled ? { scale: 1.05, rotate: 2 } : {}}
      whileTap={!isDisabled ? { scale: 0.95 } : {}}
      transition={{ type: "spring", stiffness: 300, damping: 15 }}
      className={`relative ${isDisabled ? 'cursor-not-allowed opacity-60' : 'cursor-pointer'}`}
      style={{ width: '100%', aspectRatio: '1/1' }}
    >
      <svg
        className="w-full h-full"
        viewBox="0 0 100 100"
        style={{ filter: 'drop-shadow(2px 2px 2px rgba(0,0,0,0.1))' }}
      >
        {/* Main bed shape - hand-drawn rectangle */}
        <rect
          x="10"
          y="30"
          width="80"
          height="50"
          fill={color.fill}
          stroke={color.stroke}
          strokeWidth="3"
          rx="4"
          style={{ strokeLinecap: 'round', strokeLinejoin: 'round' }}
        />
        
        {/* Secondary sketchy border */}
        <rect
          x="11"
          y="31"
          width="78"
          height="48"
          fill="none"
          stroke={color.stroke}
          strokeWidth="2"
          rx="3"
          opacity="0.3"
          style={{ strokeDasharray: '4, 4' }}
        />
        
        {/* Bed headboard */}
        <rect
          x="5"
          y="20"
          width="10"
          height="65"
          fill={color.fill}
          stroke={color.stroke}
          strokeWidth="3"
          rx="2"
        />
        
        {/* Bed pillow - hand-drawn */}
        <ellipse
          cx="35"
          cy="45"
          rx="18"
          ry="10"
          fill="white"
          stroke={color.stroke}
          strokeWidth="2"
          opacity="0.8"
        />
        
        {/* Decorative lines (bed sheets) */}
        <path
          d="M20,60 Q50,58 80,60"
          stroke={color.stroke}
          strokeWidth="2"
          fill="none"
          opacity="0.4"
          style={{ strokeDasharray: '3, 3' }}
        />
        
        {/* Bed number */}
        <text
          x="70"
          y="70"
          textAnchor="middle"
          fill={color.text}
          fontSize="20"
          fontFamily="Cabin Sketch, Patrick Hand, cursive"
          fontWeight="bold"
        >
          {bedNumber}
        </text>
        
        {/* Status icon */}
        {status === 'selected' && (
          <g>
            <circle cx="70" cy="40" r="8" fill="white" opacity="0.9" />
            <path
              d="M67,40 L69,42 L73,38"
              stroke={color.text}
              strokeWidth="2.5"
              fill="none"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </g>
        )}
        
        {status === 'reserved' && (
          <g>
            <circle cx="70" cy="40" r="8" fill="white" opacity="0.9" />
            <text
              x="70"
              y="45"
              textAnchor="middle"
              fill={color.stroke}
              fontSize="14"
              fontWeight="bold"
            >
              R
            </text>
          </g>
        )}
        
        {status === 'occupied' && (
          <g>
            <circle cx="70" cy="40" r="8" fill="white" opacity="0.9" />
            <path
              d="M66,36 L74,44 M66,44 L74,36"
              stroke={color.stroke}
              strokeWidth="2.5"
              strokeLinecap="round"
            />
          </g>
        )}
        
        {/* Doodle decorations */}
        <motion.path
          d="M85,25 Q88,22 91,25"
          stroke={color.stroke}
          strokeWidth="1.5"
          fill="none"
          opacity="0.4"
          animate={{ d: ["M85,25 Q88,22 91,25", "M85,25 Q88,28 91,25", "M85,25 Q88,22 91,25"] }}
          transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
        />
      </svg>
      
      {/* Hover glow effect for available beds */}
      {!isDisabled && (
        <motion.div
          className="absolute inset-0 rounded-lg"
          style={{ 
            background: `radial-gradient(circle, ${color.stroke}20 0%, transparent 70%)`,
            pointerEvents: 'none'
          }}
          initial={{ opacity: 0 }}
          whileHover={{ opacity: 1 }}
        />
      )}
    </motion.button>
  );
}
