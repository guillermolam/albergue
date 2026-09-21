import type { ComponentType } from 'react';
import { motion } from 'motion/react';
import { StarIcon } from '../doodle/DoodleIcons';
import { FacebookIcon, InstagramIcon, TwitterIcon, YoutubeIcon } from '../doodle/SocialIcons';
import { useI18n } from '../hooks/useI18n';
import { usePrefersReducedMotion } from '../hooks/usePrefersReducedMotion';
import { SOCIAL_MEDIA } from '../constants/footerData';
import { NEO_INTERACTIVE } from './neo';

const ICON_MAP: Record<string, ComponentType<{ className?: string }>> = {
  facebook: FacebookIcon,
  instagram: InstagramIcon,
  twitter: TwitterIcon,
  youtube: YoutubeIcon,
  tripadvisor: StarIcon,
};

const COLORS = [
  'bg-[#1877F2]',
  'bg-[#E4405F]',
  'bg-[#1A1A1A]',
  'bg-[#FF0000]',
  'bg-[#00AA6C]',
] as const;

const COPY = {
  es: { title: 'Síguenos', subtitle: 'Redes del albergue' },
  en: { title: 'Follow us', subtitle: 'Hostel socials' },
};

export function SocialSection() {
  const { locale } = useI18n();
  const isEs = locale !== 'en';
  const t = isEs ? COPY.es : COPY.en;
  const reduceMotion = usePrefersReducedMotion();

  return (
    <section className="container mx-auto max-w-5xl px-4 py-10">
      <h2 className="mb-1 text-2xl font-black text-[#1A1A1A] font-sketch">{t.title}</h2>
      <p className="mb-5 text-sm font-semibold text-[#1A1A1A]/60">{t.subtitle}</p>

      <div className="flex flex-wrap gap-3">
        {SOCIAL_MEDIA.map((social, i) => {
          const Icon = ICON_MAP[social.id] ?? StarIcon;
          return (
            <motion.a
              key={social.id}
              href={social.url}
              target="_blank"
              rel="noopener noreferrer"
              aria-label={social.name}
              className={`${NEO_INTERACTIVE} ${COLORS[i % COLORS.length]} flex h-14 items-center gap-2 rounded-xl px-4 text-white`}
              initial={reduceMotion ? false : { opacity: 0, scale: 0.85 }}
              whileInView={reduceMotion ? undefined : { opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.04, type: 'spring', stiffness: 260, damping: 18 }}
            >
              <Icon className="h-5 w-5" />
              <span className="text-sm font-black">{social.name}</span>
            </motion.a>
          );
        })}
      </div>
    </section>
  );
}
