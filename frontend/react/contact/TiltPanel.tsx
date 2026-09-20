import { useRef, type MouseEvent, type ReactNode } from 'react';
import { motion, useSpring } from 'motion/react';
import { usePrefersReducedMotion } from '../hooks/usePrefersReducedMotion';

interface TiltPanelProps {
  children: ReactNode;
  className?: string;
}

/** Mouse-tracked 2.5D tilt, the same spring-physics technique already
 * shipped in VisualAreaShowcase.tsx (perspective container -> preserve-3d
 * inner layer -> rotateX/rotateY driven by pointer position). Disabled
 * entirely under prefers-reduced-motion, rendering the panel flat/static. */
export function TiltPanel({ children, className = '' }: Readonly<TiltPanelProps>) {
  const containerRef = useRef<HTMLDivElement>(null);
  const reduceMotion = usePrefersReducedMotion();
  const rotateX = useSpring(0, { stiffness: 150, damping: 20 });
  const rotateY = useSpring(0, { stiffness: 150, damping: 20 });

  function handleMouseMove(event: MouseEvent<HTMLDivElement>) {
    if (reduceMotion || !containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const x = (event.clientX - rect.left) / rect.width - 0.5;
    const y = (event.clientY - rect.top) / rect.height - 0.5;
    rotateY.set(x * 8);
    rotateX.set(-y * 8);
  }

  function handleMouseLeave() {
    rotateX.set(0);
    rotateY.set(0);
  }

  return (
    <div
      ref={containerRef}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      className={`h-full ${className}`}
      style={{ perspective: 1000 }}
    >
      <motion.div
        style={
          reduceMotion
            ? { height: '100%' }
            : { rotateX, rotateY, transformStyle: 'preserve-3d', height: '100%' }
        }
      >
        {children}
      </motion.div>
    </div>
  );
}
