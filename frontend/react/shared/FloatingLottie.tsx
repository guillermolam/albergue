import { useEffect, useRef, useState } from 'react';
import { motion } from 'motion/react';
import { DotLottieReact } from '@lottiefiles/dotlottie-react';
import { usePrefersReducedMotion } from '../hooks/usePrefersReducedMotion';

/**
 * Decorative, non-semantic Lottie loop that floats in a section's side gutter.
 *
 * Deliberately *not* part of any row/column: it is absolutely positioned inside
 * a full-bleed `<SectionDecor>` layer, drifts slowly, and is allowed to spill
 * past the section's vertical edges so it lingers into the neighbouring block.
 * It never affects layout, never takes pointer events, and is hidden from
 * assistive tech.
 */

export type LottieClip = 'wave-hello' | 'handsaw' | 'pipe-wrench' | 'tape-measure';

const CLIP_SRC: Record<LottieClip, string> = {
  'wave-hello': '/lottie/wave-hello.lottie',
  handsaw: '/lottie/handsaw.lottie',
  'pipe-wrench': '/lottie/pipe-wrench.lottie',
  'tape-measure': '/lottie/tape-measure.lottie',
};

export interface FloatingLottieProps {
  /** Named clip from the registry. Ignored when `src` is given. */
  clip?: LottieClip;
  /** Explicit `.lottie` URL, for one-off use outside the named vocabulary. */
  src?: string;
  /** Which gutter it hangs in. */
  side?: 'left' | 'right';
  /** Vertical anchor within the section, as a CSS length/percentage. */
  top?: string;
  /** Rendered box in px (the clip is square). */
  size?: number;
  /** How far into the gutter, in px. Clamped against narrow viewports. */
  inset?: number;
  opacity?: number;
  /** Playback rate of the clip itself. */
  speed?: number;
  /** Seconds before the drift starts, so neighbours don't move in lockstep. */
  delay?: number;
  /** Static tilt, in degrees. */
  rotate?: number;
  /** Mirror horizontally -- useful when the same clip sits on both sides. */
  flip?: boolean;
}

export function FloatingLottie({
  clip,
  src,
  side = 'left',
  top = '50%',
  size = 160,
  inset = 24,
  opacity = 0.32,
  speed = 0.7,
  delay = 0,
  rotate = 0,
  flip = false,
}: Readonly<FloatingLottieProps>) {
  const hostRef = useRef<HTMLDivElement>(null);
  const [isNear, setIsNear] = useState(false);
  const prefersReducedMotion = usePrefersReducedMotion();

  // Only instantiate the renderer for sections the visitor is actually near --
  // a page with eight of these should not spin up eight canvases up front.
  useEffect(() => {
    const host = hostRef.current;
    if (!host || typeof IntersectionObserver === 'undefined') return;

    const observer = new IntersectionObserver(([entry]) => setIsNear(entry.isIntersecting), {
      rootMargin: '200px 0px',
    });
    observer.observe(host);
    return () => observer.disconnect();
  }, []);

  const source = src ?? (clip ? CLIP_SRC[clip] : undefined);

  // Purely decorative: with reduced motion requested there is nothing worth
  // showing, so it stays out of the DOM entirely rather than sitting frozen.
  // Same for a caller that named neither a clip nor a src -- a missing
  // decoration is never worth an exception.
  if (prefersReducedMotion || !source) return null;

  const gutter = `clamp(0px, ${inset / 16}rem, 8vw)`;

  return (
    <div
      ref={hostRef}
      aria-hidden="true"
      className="pointer-events-none absolute select-none"
      style={{
        top,
        [side]: gutter,
        width: size,
        height: size,
        marginTop: -size / 2,
        opacity,
      }}
    >
      <motion.div
        className="h-full w-full"
        style={{ rotate, scaleX: flip ? -1 : 1 }}
        animate={{
          y: [0, -14, 4, 0],
          x: side === 'left' ? [0, 6, -4, 0] : [0, -6, 4, 0],
          rotate: [rotate, rotate + 3, rotate - 2, rotate],
        }}
        transition={{
          duration: 14,
          repeat: Infinity,
          repeatType: 'loop',
          ease: 'easeInOut',
          delay,
        }}
      >
        {isNear && (
          <DotLottieReact src={source} loop autoplay speed={speed} className="h-full w-full" />
        )}
      </motion.div>
    </div>
  );
}
