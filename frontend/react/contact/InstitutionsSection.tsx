import { motion } from 'motion/react';
import { CompassIcon, ExternalLinkIcon } from '../doodle/DoodleIcons';
import { useI18n } from '../hooks/useI18n';
import { usePrefersReducedMotion } from '../hooks/usePrefersReducedMotion';
import { QUICK_LINKS } from '../constants/footerData';
import { NEO_INTERACTIVE } from './neo';

const COPY = {
  es: {
    title: 'Instituciones',
    subtitle: 'Camino, turismo y consumo — enlaces oficiales',
  },
  en: {
    title: 'Institutions',
    subtitle: 'Camino, tourism, and consumer protection',
  },
};

const ACCENTS = ['bg-[#E8F5E9]', 'bg-[#E3F2FD]', 'bg-[#FFF8E7]'] as const;

export function InstitutionsSection() {
  const { locale } = useI18n();
  const isEs = locale !== 'en';
  const t = isEs ? COPY.es : COPY.en;
  const reduceMotion = usePrefersReducedMotion();

  return (
    <section className="container mx-auto max-w-5xl px-4 py-10">
      <h2 className="mb-1 text-2xl font-black text-[#1A1A1A] font-sketch">{t.title}</h2>
      <p className="mb-5 text-sm font-semibold text-[#1A1A1A]/60">{t.subtitle}</p>

      <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
        {QUICK_LINKS.external.map((link, i) => (
          <motion.a
            key={link.id}
            href={link.url}
            target="_blank"
            rel="noopener noreferrer"
            className={`${NEO_INTERACTIVE} ${ACCENTS[i % ACCENTS.length]} flex items-center gap-3 rounded-xl p-4`}
            initial={reduceMotion ? false : { opacity: 0, y: 14 }}
            whileInView={reduceMotion ? undefined : { opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: i * 0.05, duration: 0.35 }}
          >
            <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg border-2 border-[#1A1A1A] bg-white">
              <CompassIcon className="h-5 w-5" />
            </span>
            <span className="flex-1 text-sm font-black text-[#1A1A1A] font-sketch">
              {isEs ? link.labelES : link.labelEN}
            </span>
            <ExternalLinkIcon className="h-4 w-4 shrink-0 text-[#1A1A1A]/50" />
          </motion.a>
        ))}
      </div>
    </section>
  );
}
