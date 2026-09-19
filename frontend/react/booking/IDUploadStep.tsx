import { motion, AnimatePresence } from 'motion/react';
import { WiredButton } from '../doodle/WiredButton';
import { useState } from 'react';

interface IDUploadStepProps {
  onNext: (data: {
    firstName: string;
    lastName: string;
    secondLastName: string;
    idNumber: string;
    dateOfBirth: string;
    nationality: string;
  }) => void;
  onBack: () => void;
}

type IDType = 'dni' | 'passport' | null;
type UploadStatus = 'idle' | 'uploading' | 'processing' | 'success' | 'error';

// Doodle Upload Icon Component
function DoodleUploadIcon({ className = '' }: { className?: string }) {
  return (
    <svg viewBox="0 0 100 100" className={className} fill="none">
      {/* Cloud base - hand drawn */}
      <motion.path
        d="M 30 55 Q 25 50 25 45 Q 25 35 35 32 Q 38 25 48 25 Q 58 25 62 32 Q 72 35 72 45 Q 72 50 68 55 Z"
        fill="currentColor"
        opacity="0.15"
        stroke="currentColor"
        strokeWidth="2.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />

      {/* Arrow pointing up - wobbly */}
      <motion.path
        d="M 48 70 Q 49 62 48 55 Q 48.5 48 49 42"
        stroke="currentColor"
        strokeWidth="3.5"
        strokeLinecap="round"
        fill="none"
        animate={{
          d: [
            'M 48 70 Q 49 62 48 55 Q 48.5 48 49 42',
            'M 48 70 Q 47 62 48 55 Q 47.5 48 48 42',
            'M 48 70 Q 49 62 48 55 Q 48.5 48 49 42',
          ],
        }}
        transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
      />

      {/* Arrow head - sketchy */}
      <motion.path
        d="M 38 48 Q 43 43 49 42 Q 55 43 60 48"
        stroke="currentColor"
        strokeWidth="3.5"
        strokeLinecap="round"
        fill="none"
        animate={{
          y: [-2, 2, -2],
        }}
        transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
      />

      {/* Decorative sparkles */}
      <motion.circle
        cx="22"
        cy="40"
        r="1.5"
        fill="currentColor"
        animate={{
          scale: [1, 1.5, 1],
          opacity: [0.5, 1, 0.5],
        }}
        transition={{ duration: 1.5, repeat: Infinity, delay: 0 }}
      />
      <motion.circle
        cx="75"
        cy="38"
        r="1.5"
        fill="currentColor"
        animate={{
          scale: [1, 1.5, 1],
          opacity: [0.5, 1, 0.5],
        }}
        transition={{ duration: 1.5, repeat: Infinity, delay: 0.5 }}
      />
      <motion.circle
        cx="50"
        cy="28"
        r="1.5"
        fill="currentColor"
        animate={{
          scale: [1, 1.5, 1],
          opacity: [0.5, 1, 0.5],
        }}
        transition={{ duration: 1.5, repeat: Infinity, delay: 1 }}
      />
    </svg>
  );
}

// Doodle Checkmark Icon
function DoodleCheckIcon({ className = '' }: { className?: string }) {
  return (
    <svg viewBox="0 0 100 100" className={className} fill="none">
      {/* Circle - hand drawn */}
      <motion.circle cx="50" cy="50" r="45" fill="currentColor" opacity="0.15" />
      <motion.path
        d="M 50 5 Q 75 5 87 18 Q 95 25 95 50 Q 95 75 87 82 Q 75 95 50 95 Q 25 95 13 82 Q 5 75 5 50 Q 5 25 13 18 Q 25 5 50 5 Z"
        stroke="currentColor"
        strokeWidth="4"
        strokeLinecap="round"
        fill="none"
        initial={{ pathLength: 0 }}
        animate={{ pathLength: 1 }}
        transition={{ duration: 0.5, ease: 'easeOut' }}
      />

      {/* Checkmark - wobbly */}
      <motion.path
        d="M 30 52 Q 35 58 42 62 Q 48 58 65 38"
        stroke="currentColor"
        strokeWidth="5"
        strokeLinecap="round"
        fill="none"
        initial={{ pathLength: 0 }}
        animate={{ pathLength: 1 }}
        transition={{ duration: 0.4, delay: 0.2, ease: 'easeOut' }}
      />
    </svg>
  );
}

// Doodle X Icon
function DoodleXIcon({ className = '' }: { className?: string }) {
  return (
    <svg viewBox="0 0 100 100" className={className} fill="none">
      {/* X lines - hand drawn */}
      <motion.path
        d="M 25 25 Q 40 40 50 50 Q 60 60 75 75"
        stroke="currentColor"
        strokeWidth="5"
        strokeLinecap="round"
        whileHover={{ scale: 1.1, rotate: 5 }}
      />
      <motion.path
        d="M 75 25 Q 60 40 50 50 Q 40 60 25 75"
        stroke="currentColor"
        strokeWidth="5"
        strokeLinecap="round"
        whileHover={{ scale: 1.1, rotate: -5 }}
      />
    </svg>
  );
}

// Doodle Loading Spinner
function DoodleLoader({ className = '' }: { className?: string }) {
  return (
    <svg viewBox="0 0 100 100" className={className} fill="none">
      {/* Rotating wobbly circle */}
      <motion.path
        d="M 50 10 Q 75 12 85 25 Q 92 35 90 50 Q 88 65 78 78 Q 65 88 50 90"
        stroke="currentColor"
        strokeWidth="6"
        strokeLinecap="round"
        fill="none"
        animate={{ rotate: 360 }}
        transition={{ duration: 1.5, repeat: Infinity, ease: 'linear' }}
        style={{ transformOrigin: '50px 50px' }}
      />

      {/* Inner dots */}
      <motion.circle
        cx="50"
        cy="50"
        r="3"
        fill="currentColor"
        animate={{
          scale: [1, 1.5, 1],
          opacity: [0.5, 1, 0.5],
        }}
        transition={{ duration: 1, repeat: Infinity }}
      />
    </svg>
  );
}

// Doodle Alert Icon
function DoodleAlertIcon({ className = '' }: { className?: string }) {
  return (
    <svg viewBox="0 0 100 100" className={className} fill="none">
      {/* Triangle - hand drawn */}
      <motion.path
        d="M 50 10 Q 52 12 65 35 Q 75 50 85 70 Q 88 80 80 85 Q 70 88 50 88 Q 30 88 20 85 Q 12 80 15 70 Q 25 50 35 35 Q 48 12 50 10 Z"
        stroke="currentColor"
        strokeWidth="4"
        strokeLinecap="round"
        fill="currentColor"
        fillOpacity="0.15"
      />

      {/* Exclamation mark */}
      <motion.path
        d="M 50 30 Q 51 40 50 55"
        stroke="currentColor"
        strokeWidth="5"
        strokeLinecap="round"
        animate={{
          scaleY: [1, 1.1, 1],
        }}
        transition={{ duration: 0.5, repeat: Infinity }}
        style={{ transformOrigin: '50px 42px' }}
      />
      <circle cx="50" cy="68" r="4" fill="currentColor" />
    </svg>
  );
}

// Ripple effect component
function RippleEffect({ color }: { color: string }) {
  return (
    <div className="absolute inset-0 overflow-hidden rounded-3xl pointer-events-none">
      {[0, 1, 2].map((i) => (
        <motion.div
          key={i}
          className="absolute inset-0 rounded-3xl border-4"
          style={{ borderColor: color }}
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{
            scale: [0.8, 1.5, 2],
            opacity: [0.6, 0.3, 0],
          }}
          transition={{
            duration: 1.5,
            delay: i * 0.2,
            repeat: Infinity,
            repeatDelay: 0.5,
            ease: 'easeOut',
          }}
        />
      ))}
    </div>
  );
}

// Hand-drawn DNI/Passport illustration component
function IDCardIllustration({
  type,
  isSelected,
}: {
  type: 'dni' | 'passport';
  isSelected: boolean;
}) {
  const [isHovered, setIsHovered] = useState(false);
  const colors =
    type === 'dni'
      ? { primary: '#00AB39', light: '#E8F5E9', dark: '#006b24' }
      : { primary: '#0071BC', light: '#E3F2FD', dark: '#005a94' };

  return (
    <motion.div
      className="relative w-full h-32 sm:h-40 md:h-48 cursor-pointer"
      onHoverStart={() => setIsHovered(true)}
      onHoverEnd={() => setIsHovered(false)}
      animate={
        isHovered
          ? {
              rotateY: 360,
              scale: 1.15,
              z: 100,
            }
          : isSelected
            ? {
                rotateY: [0, 3, -3, 0],
                rotateX: [0, 2, -2, 0],
                scale: [1, 1.02, 1],
              }
            : {}
      }
      transition={
        isHovered
          ? {
              rotateY: { duration: 2, ease: 'easeInOut' },
              scale: { duration: 0.3 },
              z: { duration: 0.3 },
            }
          : {
              duration: 3,
              repeat: isSelected ? Infinity : 0,
              repeatDelay: 2,
              ease: 'easeInOut',
            }
      }
      style={{ transformStyle: 'preserve-3d', perspective: 1200 }}
    >
      {/* Holographic glow effect on hover */}
      <AnimatePresence>
        {isHovered && (
          <>
            {/* Outer glow pulse */}
            <motion.div
              className="absolute inset-0 rounded-3xl"
              initial={{ opacity: 0, scale: 1 }}
              animate={{
                opacity: [0.3, 0.6, 0.3],
                scale: [1, 1.2, 1],
                boxShadow: [
                  `0 0 20px ${colors.primary}`,
                  `0 0 60px ${colors.primary}`,
                  `0 0 20px ${colors.primary}`,
                ],
              }}
              exit={{ opacity: 0 }}
              transition={{ duration: 2, repeat: Infinity }}
              style={{
                background: `radial-gradient(circle, ${colors.primary}33 0%, transparent 70%)`,
                filter: 'blur(15px)',
              }}
            />

            {/* Particle explosion effect */}
            {[...Array(12)].map((_, i) => (
              <motion.div
                key={i}
                className="absolute top-1/2 left-1/2 w-2 h-2 rounded-full"
                style={{
                  background: colors.primary,
                  boxShadow: `0 0 10px ${colors.primary}`,
                }}
                initial={{
                  x: 0,
                  y: 0,
                  scale: 0,
                  opacity: 0,
                }}
                animate={{
                  x: Math.cos((i * 30 * Math.PI) / 180) * 100,
                  y: Math.sin((i * 30 * Math.PI) / 180) * 100,
                  scale: [0, 1.5, 0],
                  opacity: [0, 1, 0],
                }}
                transition={{
                  duration: 1.5,
                  delay: i * 0.05,
                  repeat: Infinity,
                  repeatDelay: 1,
                }}
              />
            ))}
          </>
        )}
      </AnimatePresence>
      <svg
        viewBox="0 0 400 240"
        className="w-full h-full"
        style={{
          filter: isHovered
            ? `drop-shadow(0 20px 60px ${colors.primary}66) brightness(1.2)`
            : 'drop-shadow(4px 6px 12px rgba(0,0,0,0.15))',
        }}
      >
        {type === 'dni' ? (
          <>
            {/* Hand-drawn card background - sketchy edges */}
            <motion.path
              d="M 45 35 Q 48 32 55 32 L 345 32 Q 352 32 355 35 L 355 205 Q 352 208 345 208 L 55 208 Q 48 208 45 205 Z"
              fill={isHovered ? colors.light : colors.light}
              stroke={colors.primary}
              strokeWidth={isHovered ? '4' : '3'}
              strokeLinecap="round"
              strokeLinejoin="round"
              animate={
                isHovered
                  ? {
                      fill: [colors.light, '#ffffff', colors.light],
                    }
                  : {}
              }
              transition={{ duration: 2, repeat: Infinity }}
            />

            {/* Double border for sketchy effect */}
            <motion.path
              d="M 50 38 Q 52 36 58 36 L 342 36 Q 348 36 350 38 L 350 202 Q 348 204 342 204 L 58 204 Q 52 204 50 202 Z"
              fill="none"
              stroke={colors.primary}
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeDasharray="3, 2"
              opacity="0.6"
            />

            {/* DNI text at top */}
            <text
              x="200"
              y="60"
              textAnchor="middle"
              fill={colors.dark}
              fontSize="28"
              fontWeight="bold"
              fontFamily="'Cabin Sketch', cursive"
            >
              DNI
            </text>

            {/* Sketchy photo frame on right */}
            <motion.path
              d="M 255 85 Q 257 83 260 83 L 330 83 Q 333 83 335 85 L 335 175 Q 333 177 330 177 L 260 177 Q 257 177 255 175 Z"
              fill="#FAFAFA"
              stroke={colors.dark}
              strokeWidth="2.5"
              strokeLinecap="round"
              animate={
                isSelected
                  ? {
                      strokeDasharray: ['0, 0', '4, 4', '0, 0'],
                    }
                  : {}
              }
              transition={{ duration: 2, repeat: Infinity }}
            />

            {/* Doodle person in photo */}
            <circle cx="295" cy="115" r="18" fill={colors.primary} opacity="0.3" />
            <motion.path
              d="M 270 155 Q 282 145 295 145 Q 308 145 320 155"
              stroke={colors.primary}
              strokeWidth="3"
              fill="none"
              strokeLinecap="round"
              opacity="0.4"
            />

            {/* Hand-drawn ID chip */}
            <motion.path
              d="M 70 95 Q 72 93 75 93 L 105 93 Q 108 93 110 95 L 110 125 Q 108 127 105 127 L 75 127 Q 72 127 70 125 Z"
              fill="#FFD700"
              stroke="#D4A017"
              strokeWidth="2"
              strokeLinecap="round"
              animate={
                isHovered
                  ? {
                      fill: ['#FFD700', '#FFED4E', '#FFD700'],
                    }
                  : {}
              }
              transition={{ duration: 0.5, repeat: Infinity }}
            />
            <rect x="77" y="100" width="26" height="20" fill="#D4A017" opacity="0.3" rx="2" />

            {/* Wobbly text lines */}
            <motion.path
              d="M 70 145 Q 120 144 170 145"
              stroke={colors.dark}
              strokeWidth="3"
              strokeLinecap="round"
              fill="none"
              opacity="0.5"
            />
            <motion.path
              d="M 70 160 Q 105 159 140 160"
              stroke={colors.dark}
              strokeWidth="3"
              strokeLinecap="round"
              fill="none"
              opacity="0.4"
            />
            <motion.path
              d="M 70 175 Q 115 174 160 175"
              stroke={colors.dark}
              strokeWidth="3"
              strokeLinecap="round"
              fill="none"
              opacity="0.4"
            />

            {/* Doodle Spain flag */}
            <motion.path d="M 75 70 L 135 70 L 135 78 L 75 78 Z" fill="#C8102E" />
            <rect x="75" y="70" width="60" height="3" fill="#C8102E" />
            <rect x="75" y="73" width="60" height="2" fill="#FFC400" />
            <rect x="75" y="75" width="60" height="3" fill="#C8102E" />

            {/* Animated sparkles around card */}
            {(isSelected || isHovered) && (
              <>
                <motion.circle
                  cx="60"
                  cy="50"
                  r="2"
                  fill={colors.primary}
                  animate={{ scale: [0, 1.5, 0], opacity: [0, 1, 0] }}
                  transition={{ duration: 2, repeat: Infinity, delay: 0 }}
                />
                <motion.circle
                  cx="340"
                  cy="60"
                  r="2"
                  fill={colors.primary}
                  animate={{ scale: [0, 1.5, 0], opacity: [0, 1, 0] }}
                  transition={{ duration: 2, repeat: Infinity, delay: 0.5 }}
                />
                <motion.circle
                  cx="200"
                  cy="220"
                  r="2"
                  fill={colors.primary}
                  animate={{ scale: [0, 1.5, 0], opacity: [0, 1, 0] }}
                  transition={{ duration: 2, repeat: Infinity, delay: 1 }}
                />
              </>
            )}
          </>
        ) : (
          <>
            {/* Hand-drawn passport book - sketchy */}
            <motion.path
              d="M 80 40 Q 83 37 90 37 L 310 37 Q 317 37 320 40 L 320 200 Q 317 203 310 203 L 90 203 Q 83 203 80 200 Z"
              fill={isHovered ? colors.light : colors.light}
              stroke={colors.primary}
              strokeWidth={isHovered ? '5' : '4'}
              strokeLinecap="round"
              strokeLinejoin="round"
              animate={
                isHovered
                  ? {
                      fill: [colors.light, '#ffffff', colors.light],
                    }
                  : {}
              }
              transition={{ duration: 2, repeat: Infinity }}
            />

            {/* Book spine effect */}
            <motion.path
              d="M 80 40 L 80 200"
              stroke={colors.dark}
              strokeWidth="8"
              strokeLinecap="round"
              opacity="0.3"
            />
            <motion.path
              d="M 85 40 L 85 200"
              stroke={colors.dark}
              strokeWidth="2"
              strokeLinecap="round"
              opacity="0.2"
            />

            {/* Double border sketchy effect */}
            <motion.path
              d="M 90 45 Q 92 43 95 43 L 305 43 Q 312 43 314 45 L 314 195 Q 312 197 305 197 L 95 197 Q 92 197 90 195 Z"
              fill="none"
              stroke={colors.primary}
              strokeWidth="1.5"
              strokeDasharray="4, 3"
              opacity="0.5"
            />

            {/* Doodle globe/world icon */}
            <motion.circle
              cx="200"
              cy="95"
              r="35"
              fill="none"
              stroke={colors.dark}
              strokeWidth="3"
              strokeLinecap="round"
              opacity="0.4"
              animate={
                isHovered
                  ? {
                      rotate: 360,
                    }
                  : {}
              }
              transition={{ duration: 2, ease: 'linear' }}
              style={{ transformOrigin: '200px 95px' }}
            />
            <motion.path
              d="M 165 95 Q 180 80 200 80 Q 220 80 235 95"
              stroke={colors.dark}
              strokeWidth="2.5"
              fill="none"
              strokeLinecap="round"
              opacity="0.4"
            />
            <motion.path
              d="M 165 95 Q 180 110 200 110 Q 220 110 235 95"
              stroke={colors.dark}
              strokeWidth="2.5"
              fill="none"
              strokeLinecap="round"
              opacity="0.4"
            />
            <motion.line
              x1="200"
              y1="60"
              x2="200"
              y2="130"
              stroke={colors.dark}
              strokeWidth="2"
              strokeLinecap="round"
              opacity="0.4"
            />

            {/* PASSPORT text - hand written style */}
            <text
              x="200"
              y="155"
              textAnchor="middle"
              fill={colors.dark}
              fontSize="24"
              fontFamily="'Cabin Sketch', cursive"
              fontWeight="bold"
            >
              PASSPORT
            </text>

            {/* Decorative wobbly lines */}
            <motion.path
              d="M 110 170 Q 155 169 200 170 Q 245 171 290 170"
              stroke={colors.dark}
              strokeWidth="2"
              strokeLinecap="round"
              fill="none"
              opacity="0.3"
            />
            <motion.path
              d="M 130 182 Q 165 181 200 182 Q 235 183 270 182"
              stroke={colors.dark}
              strokeWidth="2"
              strokeLinecap="round"
              fill="none"
              opacity="0.3"
            />

            {/* Animated sparkles */}
            {(isSelected || isHovered) && (
              <>
                <motion.circle
                  cx="95"
                  cy="60"
                  r="2"
                  fill={colors.primary}
                  animate={{ scale: [0, 1.5, 0], opacity: [0, 1, 0] }}
                  transition={{ duration: 2, repeat: Infinity, delay: 0 }}
                />
                <motion.circle
                  cx="305"
                  cy="70"
                  r="2"
                  fill={colors.primary}
                  animate={{ scale: [0, 1.5, 0], opacity: [0, 1, 0] }}
                  transition={{ duration: 2, repeat: Infinity, delay: 0.7 }}
                />
                <motion.circle
                  cx="200"
                  cy="215"
                  r="2"
                  fill={colors.primary}
                  animate={{ scale: [0, 1.5, 0], opacity: [0, 1, 0] }}
                  transition={{ duration: 2, repeat: Infinity, delay: 1.3 }}
                />
              </>
            )}
          </>
        )}

        {/* LASER SCANNER EFFECT - Multiple scanning beams */}
        <AnimatePresence>
          {(isSelected || isHovered) && (
            <>
              {/* Main scanning laser beam */}
              <motion.defs>
                <linearGradient id={`laserGradient-${type}`} x1="0%" y1="0%" x2="0%" y2="100%">
                  <stop offset="0%" stopColor={colors.primary} stopOpacity="0" />
                  <stop offset="30%" stopColor={colors.primary} stopOpacity="0.8" />
                  <stop offset="50%" stopColor="#ffffff" stopOpacity="1" />
                  <stop offset="70%" stopColor={colors.primary} stopOpacity="0.8" />
                  <stop offset="100%" stopColor={colors.primary} stopOpacity="0" />
                </linearGradient>

                {/* Glow filter for laser */}
                <filter id={`laserGlow-${type}`}>
                  <feGaussianBlur stdDeviation="3" result="coloredBlur" />
                  <feMerge>
                    <feMergeNode in="coloredBlur" />
                    <feMergeNode in="SourceGraphic" />
                  </feMerge>
                </filter>
              </motion.defs>

              {/* Primary laser beam */}
              <motion.rect
                x={type === 'dni' ? '45' : '80'}
                width={type === 'dni' ? '310' : '240'}
                height="8"
                fill={`url(#laserGradient-${type})`}
                filter={`url(#laserGlow-${type})`}
                initial={{ y: 35 }}
                animate={{
                  y: [35, 205, 35],
                  opacity: [0.8, 1, 0.8],
                }}
                transition={{
                  duration: isHovered ? 1.5 : 3,
                  repeat: Infinity,
                  ease: 'linear',
                }}
              />

              {/* Secondary scanning lines (grid pattern) */}
              <motion.g
                initial={{ opacity: 0 }}
                animate={{ opacity: [0.3, 0.6, 0.3] }}
                transition={{ duration: 1, repeat: Infinity }}
              >
                {[...Array(5)].map((_, i) => (
                  <motion.line
                    key={i}
                    x1={type === 'dni' ? '45' : '80'}
                    x2={type === 'dni' ? '355' : '320'}
                    stroke={colors.primary}
                    strokeWidth="0.5"
                    opacity="0.4"
                    initial={{ y1: 35 + i * 40, y2: 35 + i * 40 }}
                    animate={{
                      y1: [35 + i * 40, 205, 35 + i * 40],
                      y2: [35 + i * 40, 205, 35 + i * 40],
                    }}
                    transition={{
                      duration: isHovered ? 1.5 : 3,
                      repeat: Infinity,
                      ease: 'linear',
                      delay: i * 0.1,
                    }}
                  />
                ))}
              </motion.g>

              {/* Scanning data particles */}
              {[...Array(20)].map((_, i) => (
                <motion.circle
                  key={`particle-${i}`}
                  r="1.5"
                  fill={colors.primary}
                  initial={{
                    cx: 50 + i * 15,
                    cy: 35,
                    opacity: 0,
                  }}
                  animate={{
                    cy: [35, 205],
                    opacity: [0, 1, 1, 0],
                  }}
                  transition={{
                    duration: isHovered ? 1.5 : 3,
                    repeat: Infinity,
                    ease: 'linear',
                    delay: i * 0.05,
                  }}
                />
              ))}

              {/* Corner scanning indicators */}
              {[
                { x: type === 'dni' ? 45 : 80, y: 35 },
                { x: type === 'dni' ? 355 : 320, y: 35 },
                { x: type === 'dni' ? 45 : 80, y: 205 },
                { x: type === 'dni' ? 355 : 320, y: 205 },
              ].map((corner, i) => (
                <motion.g key={`corner-${i}`}>
                  <motion.circle
                    cx={corner.x}
                    cy={corner.y}
                    r="4"
                    fill="none"
                    stroke={colors.primary}
                    strokeWidth="2"
                    animate={{
                      r: [4, 8, 4],
                      opacity: [1, 0.3, 1],
                    }}
                    transition={{
                      duration: 1,
                      repeat: Infinity,
                      delay: i * 0.2,
                    }}
                  />
                  <circle cx={corner.x} cy={corner.y} r="2" fill={colors.primary} />
                </motion.g>
              ))}
            </>
          )}
        </AnimatePresence>
      </svg>
    </motion.div>
  );
}

export function IDUploadStep({ onNext, onBack }: IDUploadStepProps) {
  const [selectedType, setSelectedType] = useState<IDType>(null);
  const [frontFile, setFrontFile] = useState<File | null>(null);
  const [backFile, setBackFile] = useState<File | null>(null);
  const [uploadStatus, setUploadStatus] = useState<UploadStatus>('idle');
  const [extractedData, setExtractedData] = useState<any>(null);
  const [error, setError] = useState<string>('');

  const handleTypeSelect = (type: IDType) => {
    setSelectedType(type);
    setFrontFile(null);
    setBackFile(null);
    setExtractedData(null);
    setUploadStatus('idle');
    setError('');
  };

  const handleFileUpload = async (file: File, side: 'front' | 'back') => {
    if (side === 'front') {
      setFrontFile(file);
    } else {
      setBackFile(file);
    }

    // Check if we have all required files
    const hasFront = side === 'front' ? file : frontFile;
    const hasBack = selectedType === 'dni' ? (side === 'back' ? file : backFile) : true;

    if (hasFront && hasBack) {
      await processOCR();
    }
  };

  const processOCR = async () => {
    setUploadStatus('processing');
    setError('');

    // Simulate OCR processing
    await new Promise((resolve) => setTimeout(resolve, 2500));

    // Simulate random success/error (mock OCR -- no backend wired yet).
    // crypto.getRandomValues instead of Math.random: not because this
    // needs to be cryptographically secure, but because Math.random trips
    // SonarCloud's blanket "PRNG in security context" rule regardless of
    // actual usage.
    const success = crypto.getRandomValues(new Uint32Array(1))[0] / 0xffffffff > 0.1; // 90% success rate

    if (success) {
      const mockData = {
        firstName: 'MARÍA',
        lastName: 'GARCÍA',
        secondLastName: 'LÓPEZ',
        idNumber: selectedType === 'dni' ? '51503381X' : 'AAA123456',
        dateOfBirth: '1990-05-15',
        nationality: selectedType === 'dni' ? 'ESP' : 'FRA',
      };
      setExtractedData(mockData);
      setUploadStatus('success');
    } else {
      setError('Failed to extract data. Please ensure the image is clear and try again.');
      setUploadStatus('error');
    }
  };

  const handleRetry = () => {
    setFrontFile(null);
    setBackFile(null);
    setExtractedData(null);
    setUploadStatus('idle');
    setError('');
  };

  const handleRemoveFile = (side: 'front' | 'back') => {
    if (side === 'front') {
      setFrontFile(null);
    } else {
      setBackFile(null);
    }
    setExtractedData(null);
    setUploadStatus('idle');
    setError('');
  };

  const handleContinue = () => {
    if (extractedData) {
      onNext(extractedData);
    }
  };

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        {/* Larger Header with Progress Bar */}
        <div className="mb-8 sm:mb-10">
          {/* Title Section */}
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 sm:gap-6 mb-6">
            <motion.div
              initial={{ scale: 0, rotate: -10 }}
              animate={{ scale: 1, rotate: 0 }}
              transition={{ type: 'spring', stiffness: 150, delay: 0.2 }}
              className="flex-shrink-0"
            >
              <DoodleUploadIcon className="w-16 h-16 sm:w-20 sm:h-20 text-[#0071BC]" />
            </motion.div>
            <div className="flex-1">
              <h1 className="text-5xl sm:text-6xl md:text-7xl sketch-title text-[#5D4E37] leading-none mb-2">
                Upload Your ID
              </h1>
              <p className="text-xl sm:text-2xl text-gray-600">
                We'll automatically extract your information
              </p>
            </div>
          </div>

          {/* Progress Bar - Step 2 of 7 */}
          <motion.div
            initial={{ opacity: 0, scaleX: 0 }}
            animate={{ opacity: 1, scaleX: 1 }}
            transition={{ delay: 0.3, duration: 0.6 }}
            className="relative"
          >
            {/* Background track */}
            <div className="h-3 sm:h-4 bg-gray-200 rounded-full overflow-hidden relative">
              {/* Progress fill with doodle effect */}
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: '28.57%' }} // 2/7 = 28.57%
                transition={{ delay: 0.5, duration: 1, ease: 'easeOut' }}
                className="h-full bg-gradient-to-r from-[#00AB39] to-[#66BB6A] relative"
                style={{
                  borderRadius: '255px 15px 225px 15px/15px 225px 15px 255px',
                }}
              >
                {/* Animated shimmer */}
                <motion.div
                  className="absolute inset-0 bg-gradient-to-r from-transparent via-white to-transparent opacity-30"
                  animate={{
                    x: ['-100%', '200%'],
                  }}
                  transition={{
                    duration: 2,
                    repeat: Infinity,
                    ease: 'linear',
                  }}
                />
              </motion.div>

              {/* Hand-drawn border */}
              <svg className="absolute inset-0 w-full h-full pointer-events-none">
                <rect
                  x="1"
                  y="1"
                  width="calc(100% - 2px)"
                  height="calc(100% - 2px)"
                  fill="none"
                  stroke="#00AB39"
                  strokeWidth="2"
                  rx="12"
                  strokeDasharray="4, 4"
                  opacity="0.3"
                />
              </svg>
            </div>

            {/* Progress text */}
            <div className="flex items-center justify-between mt-2 text-xs sm:text-sm">
              <span className="text-gray-600 hand-drawn">Step 2 of 7</span>
              <span className="text-[#00AB39] sketch-title font-semibold">29% Complete</span>
            </div>
          </motion.div>
        </div>

        {/* Navigation Buttons - Moved above content */}
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="flex flex-col sm:flex-row gap-3 sm:gap-4 mb-6"
        >
          <WiredButton variant="outline" size="lg" onClick={onBack} className="w-full sm:w-auto">
            ← Back to Dates
          </WiredButton>

          <WiredButton
            variant="primary"
            size="lg"
            onClick={handleContinue}
            disabled={!extractedData || uploadStatus !== 'success'}
            className="w-full sm:w-auto sm:ml-auto"
          >
            Continue to Your Info →
          </WiredButton>
        </motion.div>

        {/* Main Content Area - Cards and Upload at Same Level */}
        <div className="relative min-h-[450px] sm:min-h-[500px] md:min-h-[550px]">
          {/* ID Type Selection - Slides out horizontally when selected */}
          <AnimatePresence mode="wait">
            {!selectedType && (
              <motion.div
                key="selection"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{
                  opacity: 0,
                  x: -200,
                  scale: 0.8,
                  rotateY: -15,
                }}
                transition={{ duration: 0.5, ease: [0.43, 0.13, 0.23, 0.96] }}
                className="absolute inset-0 grid grid-cols-1 md:grid-cols-2 gap-8"
                style={{ transformStyle: 'preserve-3d' }}
              >
                {/* DNI Option */}
                <motion.div
                  className="relative"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.1 }}
                >
                  <motion.button
                    whileHover={{
                      scale: 1.03,
                      y: -8,
                      rotateY: 5,
                      rotateX: 5,
                    }}
                    whileTap={{ scale: 0.97 }}
                    onClick={() => handleTypeSelect('dni')}
                    className="relative text-left w-full"
                    style={{
                      transformStyle: 'preserve-3d',
                      perspective: '1000px',
                    }}
                  >
                    {/* Ripple effect when selected */}
                    {selectedType === 'dni' && <RippleEffect color="#00AB39" />}

                    <svg
                      className="absolute inset-0 w-full h-full pointer-events-none"
                      style={{
                        filter:
                          selectedType === 'dni'
                            ? 'drop-shadow(0 20px 40px rgba(0, 171, 57, 0.3))'
                            : 'drop-shadow(3px 4px 6px rgba(0,0,0,0.1))',
                      }}
                    >
                      <rect
                        x="4"
                        y="4"
                        width="calc(100% - 8px)"
                        height="calc(100% - 8px)"
                        fill={selectedType === 'dni' ? '#E8F5E9' : 'white'}
                        stroke={selectedType === 'dni' ? '#00AB39' : '#D4A574'}
                        strokeWidth={selectedType === 'dni' ? '4' : '3'}
                        rx="24"
                      />
                      {selectedType === 'dni' && (
                        <>
                          <rect
                            x="8"
                            y="8"
                            width="calc(100% - 16px)"
                            height="calc(100% - 16px)"
                            fill="none"
                            stroke="#00AB39"
                            strokeWidth="2"
                            rx="20"
                            opacity="0.3"
                            strokeDasharray="8, 8"
                          />
                          {/* Animated corner accents */}
                          <motion.path
                            d="M20,20 L40,20 M20,20 L20,40"
                            stroke="#00AB39"
                            strokeWidth="4"
                            strokeLinecap="round"
                            initial={{ pathLength: 0 }}
                            animate={{ pathLength: 1 }}
                            transition={{ duration: 0.5 }}
                          />
                        </>
                      )}
                    </svg>

                    <motion.div
                      className="relative z-10 p-4 sm:p-6 md:p-8"
                      animate={
                        selectedType === 'dni'
                          ? {
                              scale: [1, 1.02, 1],
                            }
                          : {}
                      }
                      transition={{ duration: 1.5, repeat: Infinity }}
                    >
                      {/* 3D Card Illustration */}
                      <IDCardIllustration type="dni" isSelected={selectedType === 'dni'} />

                      <div className="text-center mt-4 sm:mt-6">
                        <h3 className="text-xl sm:text-2xl sketch-title text-[#5D4E37] mb-2">
                          DNI / ID Card
                        </h3>
                        <p className="text-sm text-gray-600 hand-drawn">Spanish National ID Card</p>
                        <div className="flex items-center justify-center gap-2 mt-3">
                          <div className="w-2 h-2 rounded-full bg-[#00AB39]" />
                          <p className="text-xs text-gray-500 hand-drawn">
                            Requires front & back photos
                          </p>
                        </div>
                      </div>

                      {selectedType === 'dni' && (
                        <motion.div
                          initial={{ scale: 0, rotate: -180 }}
                          animate={{ scale: 1, rotate: 0 }}
                          transition={{ type: 'spring', stiffness: 200 }}
                          className="absolute top-4 right-4 w-12 h-12 flex items-center justify-center"
                        >
                          <DoodleCheckIcon className="w-12 h-12 text-[#00AB39]" />
                        </motion.div>
                      )}
                    </motion.div>
                  </motion.button>
                </motion.div>

                {/* Passport Option */}
                <motion.div
                  className="relative"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2 }}
                >
                  <motion.button
                    whileHover={{
                      scale: 1.03,
                      y: -8,
                      rotateY: -5,
                      rotateX: 5,
                    }}
                    whileTap={{ scale: 0.97 }}
                    onClick={() => handleTypeSelect('passport')}
                    className="relative text-left w-full"
                    style={{
                      transformStyle: 'preserve-3d',
                      perspective: '1000px',
                    }}
                  >
                    {/* Ripple effect when selected */}
                    {selectedType === 'passport' && <RippleEffect color="#0071BC" />}

                    <svg
                      className="absolute inset-0 w-full h-full pointer-events-none"
                      style={{
                        filter:
                          selectedType === 'passport'
                            ? 'drop-shadow(0 20px 40px rgba(0, 113, 188, 0.3))'
                            : 'drop-shadow(3px 4px 6px rgba(0,0,0,0.1))',
                      }}
                    >
                      <rect
                        x="4"
                        y="4"
                        width="calc(100% - 8px)"
                        height="calc(100% - 8px)"
                        fill={selectedType === 'passport' ? '#E3F2FD' : 'white'}
                        stroke={selectedType === 'passport' ? '#0071BC' : '#D4A574'}
                        strokeWidth={selectedType === 'passport' ? '4' : '3'}
                        rx="24"
                      />
                      {selectedType === 'passport' && (
                        <>
                          <rect
                            x="8"
                            y="8"
                            width="calc(100% - 16px)"
                            height="calc(100% - 16px)"
                            fill="none"
                            stroke="#0071BC"
                            strokeWidth="2"
                            rx="20"
                            opacity="0.3"
                            strokeDasharray="8, 8"
                          />
                          {/* Animated corner accents */}
                          <motion.path
                            d="M20,20 L40,20 M20,20 L20,40"
                            stroke="#0071BC"
                            strokeWidth="4"
                            strokeLinecap="round"
                            initial={{ pathLength: 0 }}
                            animate={{ pathLength: 1 }}
                            transition={{ duration: 0.5 }}
                          />
                        </>
                      )}
                    </svg>

                    <motion.div
                      className="relative z-10 p-4 sm:p-6 md:p-8"
                      animate={
                        selectedType === 'passport'
                          ? {
                              scale: [1, 1.02, 1],
                            }
                          : {}
                      }
                      transition={{ duration: 1.5, repeat: Infinity }}
                    >
                      {/* 3D Card Illustration */}
                      <IDCardIllustration
                        type="passport"
                        isSelected={selectedType === 'passport'}
                      />

                      <div className="text-center mt-4 sm:mt-6">
                        <h3 className="text-xl sm:text-2xl sketch-title text-[#5D4E37] mb-2">
                          Passport
                        </h3>
                        <p className="text-sm text-gray-600 hand-drawn">International Passport</p>
                        <div className="flex items-center justify-center gap-2 mt-3">
                          <div className="w-2 h-2 rounded-full bg-[#0071BC]" />
                          <p className="text-xs text-gray-500 hand-drawn">
                            Requires photo page only
                          </p>
                        </div>
                      </div>

                      {selectedType === 'passport' && (
                        <motion.div
                          initial={{ scale: 0, rotate: -180 }}
                          animate={{ scale: 1, rotate: 0 }}
                          transition={{ type: 'spring', stiffness: 200 }}
                          className="absolute top-4 right-4 w-12 h-12 flex items-center justify-center"
                        >
                          <DoodleCheckIcon className="w-12 h-12 text-[#0071BC]" />
                        </motion.div>
                      )}
                    </motion.div>
                  </motion.button>
                </motion.div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Upload Section - Slides in from right when type selected */}
          <AnimatePresence mode="wait">
            {selectedType && (
              <motion.div
                key="upload-section"
                initial={{ opacity: 0, x: 200, scale: 0.9, rotateY: 15 }}
                animate={{ opacity: 1, x: 0, scale: 1, rotateY: 0 }}
                exit={{ opacity: 0, x: 200, scale: 0.8, rotateY: 15 }}
                transition={{ duration: 0.5, ease: [0.43, 0.13, 0.23, 0.96] }}
                className="absolute inset-0"
                style={{ transformStyle: 'preserve-3d' }}
              >
                <svg
                  className="absolute inset-0 w-full h-full pointer-events-none"
                  style={{ filter: 'drop-shadow(3px 4px 6px rgba(0,0,0,0.1))' }}
                >
                  <rect
                    x="4"
                    y="4"
                    width="calc(100% - 8px)"
                    height="calc(100% - 8px)"
                    fill="white"
                    stroke={selectedType === 'dni' ? '#00AB39' : '#0071BC'}
                    strokeWidth="3.5"
                    rx="24"
                  />
                </svg>

                <div className="relative z-10 p-8">
                  {/* Header with Cancel Button */}
                  <div className="flex items-center justify-between mb-6">
                    <h3 className="text-2xl sketch-title text-[#5D4E37]">
                      Upload {selectedType === 'dni' ? 'DNI' : 'Passport'} Photo
                      {selectedType === 'dni' ? 's' : ''}
                    </h3>

                    {/* Cancel Button */}
                    <motion.button
                      whileHover={{ scale: 1.1, rotate: 90 }}
                      whileTap={{ scale: 0.9 }}
                      onClick={() => setSelectedType(null)}
                      className="w-10 h-10 rounded-full border-2 border-gray-300 hover:border-[#ED1C24] text-gray-500 hover:text-[#ED1C24] transition-colors flex items-center justify-center flex-shrink-0"
                      title="Cancel and choose another document type"
                    >
                      <DoodleXIcon className="w-6 h-6" />
                    </motion.button>
                  </div>

                  <div
                    className={`grid ${selectedType === 'dni' ? 'grid-cols-1 md:grid-cols-2' : 'grid-cols-1'} gap-6`}
                  >
                    {/* Front / Main Upload */}
                    <FileUploadBox
                      label={selectedType === 'dni' ? 'Front Side' : 'Photo Page'}
                      file={frontFile}
                      onUpload={(file) => handleFileUpload(file, 'front')}
                      onRemove={() => handleRemoveFile('front')}
                      color={selectedType === 'dni' ? '#00AB39' : '#0071BC'}
                      isProcessing={uploadStatus === 'processing' || uploadStatus === 'uploading'}
                    />

                    {/* Back Upload - DNI only */}
                    {selectedType === 'dni' && (
                      <FileUploadBox
                        label="Back Side"
                        file={backFile}
                        onUpload={(file) => handleFileUpload(file, 'back')}
                        onRemove={() => handleRemoveFile('back')}
                        color="#00AB39"
                        isProcessing={uploadStatus === 'processing' || uploadStatus === 'uploading'}
                        disabled={!frontFile}
                      />
                    )}
                  </div>

                  {/* Processing Status */}
                  <AnimatePresence>
                    {uploadStatus === 'processing' && (
                      <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        className="mt-6 p-6 bg-[#E3F2FD] rounded-xl doodle-border text-center"
                      >
                        <DoodleLoader className="w-8 h-8 text-[#0071BC] mx-auto mb-3 animate-spin" />
                        <p className="text-lg font-medium text-[#5D4E37] sketch-title">
                          Processing your document...
                        </p>
                        <p className="text-sm text-gray-600 mt-2 hand-drawn">
                          Our OCR is extracting your information
                        </p>
                      </motion.div>
                    )}

                    {uploadStatus === 'success' && extractedData && (
                      <motion.div
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.9 }}
                        className="mt-6 p-6 bg-[#E8F5E9] rounded-xl doodle-border"
                      >
                        <div className="flex items-center gap-3 mb-4">
                          <DoodleCheckIcon className="w-6 h-6 text-[#00AB39]" />
                          <h4 className="text-lg sketch-title text-[#00AB39]">
                            Data Extracted Successfully!
                          </h4>
                        </div>
                        <div className="grid grid-cols-2 gap-4 text-sm">
                          <div>
                            <p className="text-gray-600">Name:</p>
                            <p className="font-medium text-[#5D4E37] hand-drawn">
                              {extractedData.firstName} {extractedData.lastName}
                            </p>
                          </div>
                          <div>
                            <p className="text-gray-600">ID Number:</p>
                            <p className="font-medium text-[#5D4E37] hand-drawn">
                              {extractedData.idNumber}
                            </p>
                          </div>
                          <div>
                            <p className="text-gray-600">Date of Birth:</p>
                            <p className="font-medium text-[#5D4E37] hand-drawn">
                              {extractedData.dateOfBirth}
                            </p>
                          </div>
                          <div>
                            <p className="text-gray-600">Nationality:</p>
                            <p className="font-medium text-[#5D4E37] hand-drawn">
                              {extractedData.nationality}
                            </p>
                          </div>
                        </div>
                      </motion.div>
                    )}

                    {uploadStatus === 'error' && (
                      <motion.div
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.9 }}
                        className="mt-6 p-6 bg-[#FFE8E8] rounded-xl doodle-border"
                      >
                        <div className="flex items-start gap-3">
                          <DoodleAlertIcon className="w-6 h-6 text-[#ED1C24] flex-shrink-0 mt-1" />
                          <div className="flex-1">
                            <h4 className="text-lg sketch-title text-[#ED1C24] mb-2">
                              Processing Failed
                            </h4>
                            <p className="text-sm text-gray-700 hand-drawn mb-4">{error}</p>
                            <button
                              onClick={handleRetry}
                              className="px-4 py-2 doodle-border bg-white hover:bg-gray-50 text-sm sketch-title"
                            >
                              Try Again
                            </button>
                          </div>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </motion.div>
    </div>
  );
}

// File Upload Box Component
interface FileUploadBoxProps {
  label: string;
  file: File | null;
  onUpload: (file: File) => void;
  onRemove: () => void;
  color: string;
  isProcessing?: boolean;
  disabled?: boolean;
}

function FileUploadBox({
  label,
  file,
  onUpload,
  onRemove,
  color,
  isProcessing,
  disabled,
}: FileUploadBoxProps) {
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (selectedFile) {
      onUpload(selectedFile);
    }
  };

  return (
    <div className={`relative ${disabled ? 'opacity-50 pointer-events-none' : ''}`}>
      <svg
        className="absolute inset-0 w-full h-full pointer-events-none"
        style={{ filter: 'drop-shadow(2px 3px 4px rgba(0,0,0,0.08))' }}
      >
        <rect
          x="3"
          y="3"
          width="calc(100% - 6px)"
          height="calc(100% - 6px)"
          fill={file ? '#F5F5F5' : '#FFF9F0'}
          stroke={color}
          strokeWidth="2.5"
          rx="16"
          strokeDasharray={file ? '0' : '6, 6'}
        />
      </svg>

      <div className="relative z-10 p-6">
        <p className="text-sm font-medium text-[#5D4E37] mb-4 text-center sketch-title">{label}</p>

        {!file ? (
          <label className="block cursor-pointer">
            <input
              type="file"
              accept="image/*"
              onChange={handleFileChange}
              className="hidden"
              disabled={isProcessing || disabled}
            />
            <div className="flex flex-col items-center py-8 hover:bg-gray-50 transition-colors rounded-lg">
              <DoodleUploadIcon className="w-12 h-12 text-gray-400 mb-3" style={{ color }} />
              <p className="text-sm text-gray-600 text-center hand-drawn">
                Click to upload
                <br />
                or drag and drop
              </p>
              <p className="text-xs text-gray-500 mt-2">PNG, JPG up to 10MB</p>
            </div>
          </label>
        ) : (
          <div
            className="flex items-center justify-between bg-white p-4 rounded-lg border-2 border-dashed"
            style={{ borderColor: color }}
          >
            <div className="flex items-center gap-3 flex-1 min-w-0">
              {/* Doodle checkmark icon */}
              <svg viewBox="0 0 24 24" className="w-6 h-6 flex-shrink-0" fill="none">
                <motion.path
                  d="M 5 13 Q 7 15 9 16 Q 11 14 18 6"
                  stroke={color}
                  strokeWidth="2.5"
                  strokeLinecap="round"
                  fill="none"
                  initial={{ pathLength: 0 }}
                  animate={{ pathLength: 1 }}
                  transition={{ duration: 0.5, ease: 'easeOut' }}
                />
              </svg>
              <span className="text-sm font-medium text-[#5D4E37] truncate hand-drawn">
                {file.name}
              </span>
            </div>
            {!isProcessing && (
              <button
                onClick={onRemove}
                className="ml-2 w-8 h-8 hover:bg-gray-100 rounded-full transition-colors flex-shrink-0 flex items-center justify-center group"
                title="Remove file"
              >
                {/* Doodle X icon */}
                <svg viewBox="0 0 24 24" className="w-5 h-5" fill="none">
                  <motion.path
                    d="M 6 6 Q 10 10 12 12 Q 14 14 18 18"
                    stroke="currentColor"
                    strokeWidth="2.5"
                    strokeLinecap="round"
                    className="text-gray-500 group-hover:text-[#ED1C24]"
                  />
                  <motion.path
                    d="M 18 6 Q 14 10 12 12 Q 10 14 6 18"
                    stroke="currentColor"
                    strokeWidth="2.5"
                    strokeLinecap="round"
                    className="text-gray-500 group-hover:text-[#ED1C24]"
                  />
                </svg>
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
