import { motion } from 'motion/react';
import { ReactNode } from 'react';

interface DoodleCardProps {
  children: ReactNode;
  delay?: number;
  className?: string;
  color?: string;
}

export function DoodleCard({ children, delay = 0, className = '', color = '#000' }: DoodleCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20, rotate: -1 }}
      whileInView={{ opacity: 1, y: 0, rotate: 0 }}
      transition={{ 
        duration: 0.5, 
        delay,
        type: "spring",
        stiffness: 80
      }}
      whileHover={{ 
        y: -5, 
        rotate: 1,
        scale: 1.02,
        transition: { duration: 0.2 }
      }}
      viewport={{ once: true }}
      className={`relative group ${className}`}
    >
      {/* Hand-drawn border effect */}
      <svg
        className="absolute inset-0 w-full h-full pointer-events-none"
        style={{ filter: 'drop-shadow(2px 2px 1px rgba(0,0,0,0.1))' }}
      >
        <rect
          x="2"
          y="2"
          width="calc(100% - 4px)"
          height="calc(100% - 4px)"
          fill="white"
          stroke={color}
          strokeWidth="2.5"
          rx="12"
          ry="12"
          style={{
            strokeDasharray: '2, 2',
            strokeLinecap: 'round',
            strokeLinejoin: 'round',
          }}
        />
        {/* Secondary sketchy border */}
        <rect
          x="3"
          y="3"
          width="calc(100% - 6px)"
          height="calc(100% - 6px)"
          fill="none"
          stroke={color}
          strokeWidth="2"
          rx="10"
          ry="10"
          opacity="0.3"
          style={{
            strokeDasharray: '3, 3',
            strokeLinecap: 'round',
          }}
        />
      </svg>
      
      {/* Content */}
      <div className="relative z-10 p-6 paper-texture">
        {children}
      </div>
      
      {/* Doodle decorations - random squiggles */}
      <svg className="absolute -top-2 -right-2 w-8 h-8 pointer-events-none opacity-60" style={{ color }}>
        <path
          d="M2,6 Q4,2 6,6 T10,6"
          stroke="currentColor"
          strokeWidth="2"
          fill="none"
          strokeLinecap="round"
        />
      </svg>
      
      <svg className="absolute -bottom-2 -left-2 w-6 h-6 pointer-events-none opacity-60" style={{ color }}>
        <circle cx="3" cy="3" r="2" fill="currentColor" />
      </svg>
    </motion.div>
  );
}
