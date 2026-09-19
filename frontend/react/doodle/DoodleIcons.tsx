import { motion } from 'motion/react';

interface DoodleIconProps {
  className?: string;
  animate?: boolean;
}

// Party/Celebration icon
export function PartyIcon({ className = 'w-8 h-8', animate = true }: DoodleIconProps) {
  return (
    <motion.svg
      className={className}
      viewBox="0 0 100 100"
      fill="none"
      animate={animate ? { rotate: [0, 10, -10, 0] } : {}}
      transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
    >
      {/* Star burst */}
      <motion.path
        d="M50 20 L52 35 L65 30 L55 42 L68 48 L53 48 L55 62 L50 50 L45 62 L47 48 L32 48 L45 42 L35 30 L48 35 Z"
        fill="#00AB39"
        stroke="#1A1A1A"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        animate={animate ? { scale: [1, 1.1, 1] } : {}}
        transition={{ duration: 1.5, repeat: Infinity }}
      />
      {/* Confetti pieces */}
      {[...Array(6)].map((_, i) => (
        <motion.rect
          key={i}
          x={20 + i * 12}
          y={65 + (i % 2) * 5}
          width="4"
          height="8"
          fill={i % 2 === 0 ? '#00AB39' : '#D4A574'}
          stroke="#1A1A1A"
          strokeWidth="1"
          transform={`rotate(${i * 30} ${22 + i * 12} ${69 + (i % 2) * 5})`}
          animate={animate ? { y: [0, -3, 0], rotate: [0, 15, 0] } : {}}
          transition={{
            duration: 1 + i * 0.2,
            repeat: Infinity,
            delay: i * 0.1,
          }}
        />
      ))}
    </motion.svg>
  );
}

// Map pin/location icon
export function MapPinIcon({ className = 'w-8 h-8', animate = true }: DoodleIconProps) {
  return (
    <motion.svg
      className={className}
      viewBox="0 0 100 100"
      fill="none"
      animate={animate ? { y: [0, -3, 0] } : {}}
      transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
    >
      <path
        d="M50 20 C35 20 25 32 25 45 C25 62 50 85 50 85 C50 85 75 62 75 45 C75 32 65 20 50 20 Z"
        fill="#0071BC"
        stroke="#1A1A1A"
        strokeWidth="3"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <circle cx="50" cy="43" r="8" fill="white" stroke="#1A1A1A" strokeWidth="2" />
      {/* Squiggly details */}
      <path d="M30 45 Q32 48 30 51" stroke="#1A1A1A" strokeWidth="1.5" fill="none" />
      <path d="M70 45 Q68 48 70 51" stroke="#1A1A1A" strokeWidth="1.5" fill="none" />
    </motion.svg>
  );
}

// Home/Building icon
export function HomeIcon({ className = 'w-8 h-8', animate = true }: DoodleIconProps) {
  return (
    <motion.svg
      className={className}
      viewBox="0 0 100 100"
      fill="none"
      animate={animate ? { rotateZ: [0, 2, -2, 0] } : {}}
      transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
    >
      {/* Roof */}
      <path
        d="M50 25 L20 50 L30 50 L30 80 L70 80 L70 50 L80 50 Z"
        fill="#D4A574"
        stroke="#1A1A1A"
        strokeWidth="3"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      {/* Door */}
      <rect
        x="42"
        y="60"
        width="16"
        height="20"
        fill="#8B6914"
        stroke="#1A1A1A"
        strokeWidth="2"
        rx="2"
      />
      {/* Windows */}
      <rect x="35" y="55" width="10" height="10" fill="#FFF9F0" stroke="#1A1A1A" strokeWidth="2" />
      <rect x="55" y="55" width="10" height="10" fill="#FFF9F0" stroke="#1A1A1A" strokeWidth="2" />
      {/* Window details */}
      <line x1="40" y1="55" x2="40" y2="65" stroke="#1A1A1A" strokeWidth="1" />
      <line x1="60" y1="55" x2="60" y2="65" stroke="#1A1A1A" strokeWidth="1" />
    </motion.svg>
  );
}

// Sparkle/Star icon
export function SparkleIcon({ className = 'w-8 h-8', animate = true }: DoodleIconProps) {
  return (
    <motion.svg
      className={className}
      viewBox="0 0 100 100"
      fill="none"
      animate={animate ? { rotate: [0, 180, 360], scale: [1, 1.2, 1] } : {}}
      transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
    >
      <path
        d="M50 20 L55 45 L80 50 L55 55 L50 80 L45 55 L20 50 L45 45 Z"
        fill="#EAC102"
        stroke="#1A1A1A"
        strokeWidth="2.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <circle cx="50" cy="50" r="6" fill="white" stroke="#1A1A1A" strokeWidth="1.5" />
    </motion.svg>
  );
}

// Clipboard/Document icon
export function ClipboardIcon({ className = 'w-8 h-8', animate = true }: DoodleIconProps) {
  return (
    <motion.svg
      className={className}
      viewBox="0 0 100 100"
      fill="none"
      whileHover={animate ? { scale: 1.1, rotateZ: 5 } : {}}
    >
      <rect
        x="25"
        y="20"
        width="50"
        height="65"
        fill="#FFF9F0"
        stroke="#1A1A1A"
        strokeWidth="3"
        rx="4"
      />
      <rect
        x="35"
        y="15"
        width="30"
        height="10"
        fill="#00AB39"
        stroke="#1A1A1A"
        strokeWidth="2"
        rx="3"
      />
      {/* Lines */}
      <line
        x1="35"
        y1="40"
        x2="65"
        y2="40"
        stroke="#1A1A1A"
        strokeWidth="2"
        strokeLinecap="round"
      />
      <line
        x1="35"
        y1="50"
        x2="65"
        y2="50"
        stroke="#1A1A1A"
        strokeWidth="2"
        strokeLinecap="round"
      />
      <line
        x1="35"
        y1="60"
        x2="55"
        y2="60"
        stroke="#1A1A1A"
        strokeWidth="2"
        strokeLinecap="round"
      />
      <circle cx="35" cy="70" r="2" fill="#00AB39" />
    </motion.svg>
  );
}

// Utensils/Restaurant icon
export function UtensilsIcon({ className = 'w-8 h-8', animate = true }: DoodleIconProps) {
  return (
    <motion.svg
      className={className}
      viewBox="0 0 100 100"
      fill="none"
      animate={animate ? { rotateZ: [0, -3, 3, 0] } : {}}
      transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
    >
      {/* Fork */}
      <path d="M30 20 L30 45" stroke="#1A1A1A" strokeWidth="3" strokeLinecap="round" />
      <path d="M25 20 L25 40" stroke="#1A1A1A" strokeWidth="2.5" strokeLinecap="round" />
      <path d="M35 20 L35 40" stroke="#1A1A1A" strokeWidth="2.5" strokeLinecap="round" />
      <rect
        x="28"
        y="43"
        width="4"
        height="37"
        fill="#4A4A4A"
        stroke="#1A1A1A"
        strokeWidth="2"
        rx="2"
      />

      {/* Spoon */}
      <ellipse cx="70" cy="30" rx="6" ry="9" fill="#4A4A4A" stroke="#1A1A1A" strokeWidth="2.5" />
      <rect
        x="68"
        y="35"
        width="4"
        height="45"
        fill="#4A4A4A"
        stroke="#1A1A1A"
        strokeWidth="2"
        rx="2"
      />
    </motion.svg>
  );
}

// Monument/Building icon
export function MonumentIcon({ className = 'w-8 h-8', animate = true }: DoodleIconProps) {
  return (
    <motion.svg
      className={className}
      viewBox="0 0 100 100"
      fill="none"
      animate={animate ? { y: [0, -2, 0] } : {}}
      transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
    >
      {/* Base */}
      <rect x="20" y="75" width="60" height="8" fill="#5D4E37" stroke="#1A1A1A" strokeWidth="2" />
      {/* Columns */}
      <rect x="25" y="40" width="8" height="35" fill="#D4A574" stroke="#1A1A1A" strokeWidth="2" />
      <rect x="46" y="40" width="8" height="35" fill="#D4A574" stroke="#1A1A1A" strokeWidth="2" />
      <rect x="67" y="40" width="8" height="35" fill="#D4A574" stroke="#1A1A1A" strokeWidth="2" />
      {/* Roof */}
      <path
        d="M15 40 L50 20 L85 40 Z"
        fill="#8B6914"
        stroke="#1A1A1A"
        strokeWidth="2.5"
        strokeLinejoin="round"
      />
      <rect x="20" y="38" width="60" height="5" fill="#5D4E37" stroke="#1A1A1A" strokeWidth="2" />
    </motion.svg>
  );
}

// Phone icon
export function PhoneIcon({ className = 'w-8 h-8', animate = true }: DoodleIconProps) {
  return (
    <motion.svg
      className={className}
      viewBox="0 0 100 100"
      fill="none"
      animate={animate ? { rotateZ: [0, 10, -10, 0] } : {}}
      transition={{ duration: 2.5, repeat: Infinity, ease: 'easeInOut' }}
    >
      <path
        d="M30 25 C28 25 25 27 25 30 L25 70 C25 73 28 75 30 75 L70 75 C72 75 75 73 75 70 L75 30 C75 27 72 25 70 25 Z"
        fill="#00AB39"
        stroke="#1A1A1A"
        strokeWidth="3"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <rect
        x="32"
        y="33"
        width="36"
        height="28"
        fill="#E8F5E9"
        stroke="#1A1A1A"
        strokeWidth="2"
        rx="2"
      />
      <circle cx="50" cy="68" r="4" fill="white" stroke="#1A1A1A" strokeWidth="2" />
    </motion.svg>
  );
}

// Chat/Message icon
export function ChatIcon({ className = 'w-8 h-8', animate = true }: DoodleIconProps) {
  return (
    <motion.svg
      className={className}
      viewBox="0 0 100 100"
      fill="none"
      animate={animate ? { scale: [1, 1.05, 1] } : {}}
      transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
    >
      <path
        d="M25 30 C25 25 28 22 33 22 L67 22 C72 22 75 25 75 30 L75 55 C75 60 72 63 67 63 L45 63 L30 75 L30 63 C27 63 25 60 25 55 Z"
        fill="#0071BC"
        stroke="#1A1A1A"
        strokeWidth="3"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      {/* Message dots */}
      <circle cx="40" cy="42" r="3" fill="white" />
      <circle cx="50" cy="42" r="3" fill="white" />
      <circle cx="60" cy="42" r="3" fill="white" />
    </motion.svg>
  );
}

// Checkmark icon
export function CheckIcon({ className = 'w-8 h-8', animate = true }: DoodleIconProps) {
  return (
    <motion.svg
      className={className}
      viewBox="0 0 100 100"
      fill="none"
      initial={{ pathLength: 0 }}
      animate={animate ? { pathLength: 1 } : {}}
      transition={{ duration: 0.5 }}
    >
      <motion.path
        d="M20 50 L40 70 L80 30"
        stroke="white"
        strokeWidth="8"
        strokeLinecap="round"
        strokeLinejoin="round"
        fill="none"
      />
    </motion.svg>
  );
}

// Arrow Right icon
export function ArrowRightIcon({ className = 'w-6 h-6', animate = true }: DoodleIconProps) {
  return (
    <motion.svg
      className={className}
      viewBox="0 0 100 100"
      fill="none"
      animate={animate ? { x: [0, 5, 0] } : {}}
      transition={{ duration: 1.5, repeat: Infinity, ease: 'easeInOut' }}
    >
      <path
        d="M20 50 L70 50 M55 35 L70 50 L55 65"
        stroke="currentColor"
        strokeWidth="6"
        strokeLinecap="round"
        strokeLinejoin="round"
        fill="none"
      />
    </motion.svg>
  );
}

// Bed icon
export function BedIcon({ className = 'w-8 h-8', animate = true }: DoodleIconProps) {
  return (
    <motion.svg
      className={className}
      viewBox="0 0 100 100"
      fill="none"
      animate={animate ? { y: [0, -2, 0] } : {}}
      transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
    >
      {/* Bed frame */}
      <rect
        x="15"
        y="50"
        width="70"
        height="25"
        fill="#D4A574"
        stroke="#1A1A1A"
        strokeWidth="3"
        rx="3"
      />
      {/* Pillow */}
      <rect
        x="60"
        y="42"
        width="20"
        height="12"
        fill="#E8F5E9"
        stroke="#1A1A1A"
        strokeWidth="2"
        rx="2"
      />
      {/* Mattress detail */}
      <line x1="15" y1="62" x2="85" y2="62" stroke="#1A1A1A" strokeWidth="2" />
      {/* Legs */}
      <rect x="18" y="75" width="5" height="10" fill="#5D4E37" stroke="#1A1A1A" strokeWidth="2" />
      <rect x="77" y="75" width="5" height="10" fill="#5D4E37" stroke="#1A1A1A" strokeWidth="2" />
    </motion.svg>
  );
}

// Plus/Add icon
export function PlusIcon({ className = 'w-6 h-6', animate = true }: DoodleIconProps) {
  return (
    <motion.svg
      className={className}
      viewBox="0 0 100 100"
      fill="none"
      whileHover={animate ? { rotate: 90, scale: 1.1 } : {}}
      transition={{ type: 'spring', stiffness: 300 }}
    >
      <path
        d="M50 20 L50 80 M20 50 L80 50"
        stroke="currentColor"
        strokeWidth="8"
        strokeLinecap="round"
      />
    </motion.svg>
  );
}

// Extremadura Flag - Red, White, Green horizontal stripes
export function ExtremaduraFlag({ className = 'w-12 h-8', animate = true }: DoodleIconProps) {
  return (
    <motion.svg
      className={className}
      viewBox="0 0 120 80"
      fill="none"
      animate={
        animate
          ? {
              rotateY: [0, 5, -5, 0],
              rotateZ: [0, 1, -1, 0],
            }
          : {}
      }
      transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
    >
      {/* Flag pole */}
      <rect x="2" y="5" width="4" height="70" fill="#5D4E37" stroke="#1A1A1A" strokeWidth="1" />

      {/* Flag with wavy edges */}
      <path
        d="M8 12 Q12 10 20 12 L115 12 Q117 14 115 16 L20 16 Q12 14 8 12 Z"
        fill="#ED1C24"
        stroke="#1A1A1A"
        strokeWidth="2"
        strokeLinecap="round"
      />
      <path
        d="M8 18 Q12 16 20 18 L115 18 Q117 20 115 22 L20 22 Q12 20 8 18 Z M8 24 Q12 22 20 24 L115 24 Q117 26 115 28 L20 28 Q12 26 8 24 Z"
        fill="white"
        stroke="#1A1A1A"
        strokeWidth="2"
      />
      <path
        d="M8 30 Q12 28 20 30 L115 30 Q117 32 115 34 L20 34 Q12 32 8 30 Z M8 36 Q12 34 20 36 L115 36 Q117 38 115 40 L20 40 Q12 38 8 36 Z"
        fill="#00AB39"
        stroke="#1A1A1A"
        strokeWidth="2"
      />

      {/* Sketchy details */}
      {animate &&
        [...Array(5)].map((_, i) => (
          <motion.circle
            key={i}
            cx={25 + i * 18}
            cy={24}
            r="1"
            fill="#1A1A1A"
            opacity="0.3"
            animate={{
              scale: [1, 1.5, 1],
              opacity: [0.3, 0.6, 0.3],
            }}
            transition={{
              duration: 2,
              repeat: Infinity,
              delay: i * 0.2,
            }}
          />
        ))}
    </motion.svg>
  );
}

// Mérida Flag - Gold and red with Roman column
export function MeridaFlag({ className = 'w-12 h-8', animate = true }: DoodleIconProps) {
  return (
    <motion.svg
      className={className}
      viewBox="0 0 120 80"
      fill="none"
      animate={
        animate
          ? {
              rotateY: [0, -5, 5, 0],
              rotateZ: [0, -1, 1, 0],
            }
          : {}
      }
      transition={{
        duration: 3.5,
        repeat: Infinity,
        ease: 'easeInOut',
        delay: 0.5,
      }}
    >
      {/* Flag pole */}
      <rect x="2" y="5" width="4" height="70" fill="#5D4E37" stroke="#1A1A1A" strokeWidth="1" />

      {/* Background - Gold */}
      <path
        d="M8 15 Q12 13 18 15 L112 15 Q115 17 112 19 L112 50 Q115 52 112 54 L18 54 Q12 52 8 50 Z"
        fill="#EAC102"
        stroke="#1A1A1A"
        strokeWidth="2.5"
        strokeLinecap="round"
      />

      {/* Red stripe */}
      <rect x="12" y="20" width="95" height="10" fill="#ED1C24" stroke="#1A1A1A" strokeWidth="2" />

      {/* Roman column (simplified) */}
      <rect x="52" y="25" width="8" height="20" fill="#8B6914" stroke="#1A1A1A" strokeWidth="1.5" />
      <rect x="50" y="23" width="12" height="3" fill="#5D4E37" stroke="#1A1A1A" strokeWidth="1.5" />
      <rect x="50" y="44" width="12" height="3" fill="#5D4E37" stroke="#1A1A1A" strokeWidth="1.5" />

      {/* Sparkles */}
      {animate &&
        [...Array(3)].map((_, i) => (
          <motion.path
            key={i}
            d={`M${35 + i * 20} ${35 + i * 2} L${37 + i * 20} ${37 + i * 2} M${36 + i * 20} ${34 + i * 2} L${36 + i * 20} ${38 + i * 2}`}
            stroke="white"
            strokeWidth="1.5"
            strokeLinecap="round"
            animate={{
              opacity: [0, 1, 0],
              scale: [0.5, 1.2, 0.5],
            }}
            transition={{
              duration: 2,
              repeat: Infinity,
              delay: i * 0.4,
            }}
          />
        ))}
    </motion.svg>
  );
}

// Carrascalejo Flag - Green with oak tree
export function CarrascalejoFlag({ className = 'w-12 h-8', animate = true }: DoodleIconProps) {
  return (
    <motion.svg
      className={className}
      viewBox="0 0 120 80"
      fill="none"
      animate={
        animate
          ? {
              rotateY: [0, 5, -5, 0],
              rotateZ: [0, 1, -1, 0],
            }
          : {}
      }
      transition={{
        duration: 4,
        repeat: Infinity,
        ease: 'easeInOut',
        delay: 1,
      }}
    >
      {/* Flag pole */}
      <rect x="2" y="5" width="4" height="70" fill="#5D4E37" stroke="#1A1A1A" strokeWidth="1" />

      {/* Background - Green */}
      <path
        d="M8 15 Q12 13 18 15 L112 15 Q115 17 112 19 L112 50 Q115 52 112 54 L18 54 Q12 52 8 50 Z"
        fill="#00AB39"
        stroke="#1A1A1A"
        strokeWidth="2.5"
        strokeLinecap="round"
      />

      {/* Oak tree - simplified */}
      {/* Tree crown */}
      <circle cx="55" cy="28" r="8" fill="#006b24" stroke="#1A1A1A" strokeWidth="1.5" />
      <circle cx="62" cy="30" r="7" fill="#006b24" stroke="#1A1A1A" strokeWidth="1.5" />
      <circle cx="48" cy="30" r="7" fill="#006b24" stroke="#1A1A1A" strokeWidth="1.5" />
      <circle cx="55" cy="35" r="8" fill="#006b24" stroke="#1A1A1A" strokeWidth="1.5" />

      {/* Tree trunk */}
      <rect
        x="52"
        y="36"
        width="6"
        height="10"
        fill="#8B6914"
        stroke="#1A1A1A"
        strokeWidth="1.5"
        rx="1"
      />

      {/* White stripe */}
      <rect x="12" y="48" width="95" height="4" fill="white" stroke="#1A1A1A" strokeWidth="1.5" />

      {/* Animated leaves falling */}
      {animate &&
        [...Array(4)].map((_, i) => (
          <motion.ellipse
            key={i}
            cx={40 + i * 10}
            cy={25}
            rx="2"
            ry="3"
            fill="#00AB39"
            stroke="#1A1A1A"
            strokeWidth="0.5"
            animate={{
              y: [0, 15, 0],
              x: [0, 3, -3, 0],
              rotate: [0, 180, 360],
            }}
            transition={{
              duration: 3 + i * 0.5,
              repeat: Infinity,
              delay: i * 0.3,
            }}
          />
        ))}
    </motion.svg>
  );
}
