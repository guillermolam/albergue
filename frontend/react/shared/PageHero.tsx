import { useEffect, useRef, type ReactNode } from 'react';
import { motion } from 'motion/react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { WiredButton } from '../doodle/WiredButton';
import { DoodlePatterns } from '../doodle/DoodlePattern';
import { SectionDecor, type SectionDecorPreset } from './SectionDecor';

let scrollTriggerRegistered = false;

function ensureScrollTrigger() {
  if (!scrollTriggerRegistered) {
    gsap.registerPlugin(ScrollTrigger);
    scrollTriggerRegistered = true;
  }
}

export interface PageHeroCta {
  label: string;
  href: string;
  variant?: 'primary' | 'outline';
}

interface PageHeroProps {
  eyebrow?: string;
  title: string;
  subtitle?: string;
  ctas?: PageHeroCta[];
  /** Optional floating Lottie decoration for this hero. */
  decor?: SectionDecorPreset;
  children?: ReactNode;
}

export function PageHero({
  eyebrow,
  title,
  subtitle,
  ctas,
  decor,
  children,
}: Readonly<PageHeroProps>) {
  const sectionRef = useRef<HTMLElement>(null);
  const patternRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    ensureScrollTrigger();
    if (!sectionRef.current || !patternRef.current) return;

    const ctx = gsap.context(() => {
      gsap.to(patternRef.current, {
        yPercent: 20,
        ease: 'none',
        scrollTrigger: {
          trigger: sectionRef.current,
          start: 'top top',
          end: 'bottom top',
          scrub: true,
        },
      });
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={sectionRef}
      className="relative isolate overflow-hidden bg-linear-to-br from-[#E8F5E9] to-[#FFFFFF] py-10 md:py-14"
    >
      <div ref={patternRef} className="absolute inset-0 text-[#00AB39]">
        <DoodlePatterns.Squiggles grid="8x8" />
      </div>

      {decor && <SectionDecor preset={decor} />}

      <div className="relative z-10 container mx-auto px-4 max-w-4xl text-center">
        {eyebrow && (
          <motion.p
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-2 text-sm font-semibold uppercase tracking-wide text-[#00AB39] hand-drawn"
          >
            {eyebrow}
          </motion.p>
        )}
        <motion.h1
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.05 }}
          className="mb-4 text-3xl font-bold text-[#5D4E37] font-sketch md:text-5xl"
        >
          {title}
        </motion.h1>
        {subtitle && (
          <motion.p
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="mx-auto max-w-2xl text-lg text-[#5D4E37]/80 font-handwritten"
          >
            {subtitle}
          </motion.p>
        )}
        {ctas && ctas.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.15 }}
            className="mt-8 flex flex-wrap justify-center gap-4"
          >
            {ctas.map((cta) => (
              <WiredButton key={cta.href} href={cta.href} variant={cta.variant ?? 'primary'}>
                {cta.label}
              </WiredButton>
            ))}
          </motion.div>
        )}
        {children}
      </div>
    </section>
  );
}
