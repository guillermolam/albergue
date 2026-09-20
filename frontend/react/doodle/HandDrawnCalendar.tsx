import { motion } from 'motion/react';

interface HandDrawnCalendarProps {
  className?: string;
  size?: number;
  animate?: boolean;
}

export function HandDrawnCalendar({
  className = '',
  size = 24,
  animate = false,
}: HandDrawnCalendarProps) {
  const WrapperComponent = animate ? motion.svg : 'svg';
  const animationProps = animate
    ? {
        animate: {
          rotate: [0, -5, 5, -3, 3, 0],
          y: [0, -2, 0, -1, 0],
        },
        transition: { duration: 3, repeat: Infinity, ease: 'easeInOut' },
      }
    : {};

  return (
    <WrapperComponent
      width={size}
      height={size}
      viewBox="0 0 100 100"
      fill="none"
      className={className}
      {...animationProps}
    >
      {/* Calendar body - hand-drawn rectangle */}
      <path
        d="M15,30 L15,85 C15,88 17,90 20,90 L80,90 C83,90 85,88 85,85 L85,30 Z"
        fill="#FFFFFF"
        stroke="#00AB39"
        strokeWidth="3"
        strokeLinecap="round"
        strokeLinejoin="round"
      />

      {/* Calendar header - darker section */}
      <path
        d="M15,18 C15,15 17,13 20,13 L80,13 C83,13 85,15 85,18 L85,30 L15,30 Z"
        fill="#00AB39"
        stroke="#00AB39"
        strokeWidth="3"
        strokeLinecap="round"
        strokeLinejoin="round"
      />

      {/* Left binding ring - sketchy circle */}
      <circle cx="30" cy="18" r="4" fill="white" stroke="#006b24" strokeWidth="2.5" />
      <circle cx="30" cy="18" r="2" fill="#006b24" />

      {/* Right binding ring - sketchy circle */}
      <circle cx="70" cy="18" r="4" fill="white" stroke="#006b24" strokeWidth="2.5" />
      <circle cx="70" cy="18" r="2" fill="#006b24" />

      {/* Grid dots representing calendar days - hand-drawn style */}
      {/* Row 1 */}
      <circle cx="25" cy="45" r="2.5" fill="#00AB39" opacity="0.4" />
      <circle cx="40" cy="45" r="2.5" fill="#00AB39" opacity="0.4" />
      <circle cx="55" cy="45" r="2.5" fill="#00AB39" opacity="0.4" />
      <circle cx="70" cy="45" r="2.5" fill="#00AB39" opacity="0.4" />

      {/* Row 2 */}
      <circle cx="25" cy="58" r="2.5" fill="#00AB39" opacity="0.4" />
      <circle cx="40" cy="58" r="2.5" fill="#00AB39" opacity="0.4" />
      <circle cx="55" cy="58" r="2.5" fill="#00AB39" opacity="0.4" />
      <circle cx="70" cy="58" r="2.5" fill="#00AB39" opacity="0.4" />

      {/* Row 3 */}
      <circle cx="25" cy="71" r="2.5" fill="#00AB39" opacity="0.4" />
      <circle cx="40" cy="71" r="2.5" fill="#00AB39" opacity="0.4" />
      <circle cx="55" cy="71" r="2.5" fill="#00AB39" opacity="0.6" />
      <circle cx="70" cy="71" r="2.5" fill="#00AB39" opacity="0.4" />

      {/* Highlight one day - today */}
      <circle cx="55" cy="71" r="5" fill="none" stroke="#00AB39" strokeWidth="2.5" />

      {/* Hand-drawn decorative scribbles on header */}
      <path
        d="M22,22 L25,20 M32,22 L35,20"
        stroke="white"
        strokeWidth="1.5"
        strokeLinecap="round"
        opacity="0.5"
      />
      <path
        d="M65,22 L68,20 M75,22 L78,20"
        stroke="white"
        strokeWidth="1.5"
        strokeLinecap="round"
        opacity="0.5"
      />
    </WrapperComponent>
  );
}
