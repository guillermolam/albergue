import type { ComponentType } from 'react';
import { DoodleFrame } from '../doodle/DoodleFrame';
import { StarIcon, SparkleIcon } from '../doodle/DoodleIcons';
import { FacebookIcon, InstagramIcon, TwitterIcon, YoutubeIcon } from '../doodle/SocialIcons';
import { useI18n } from '../hooks/useI18n';
import { SOCIAL_MEDIA } from '../constants/footerData';

const ICON_MAP: Record<string, ComponentType<{ className?: string }>> = {
  facebook: FacebookIcon,
  instagram: InstagramIcon,
  twitter: TwitterIcon,
  youtube: YoutubeIcon,
  tripadvisor: StarIcon,
};

const COPY = {
  es: { title: 'Síguenos', subtitle: 'Todo lo que compartimos, en un solo sitio' },
  en: { title: 'Follow Us', subtitle: 'Everything we share, in one place' },
};

export function SocialSection() {
  const { locale } = useI18n();
  const isEs = locale !== 'en';
  const t = isEs ? COPY.es : COPY.en;

  return (
    <section className="container mx-auto max-w-5xl px-4 py-12">
      <h2 className="mb-1 flex items-center gap-2 text-2xl font-bold text-[#5D4E37] font-sketch">
        <SparkleIcon className="h-7 w-7" />
        {t.title}
      </h2>
      <p className="mb-6 text-sm text-[#5D4E37]/70 font-handwritten">{t.subtitle}</p>

      <div className="flex flex-wrap gap-4">
        {SOCIAL_MEDIA.map((social) => {
          const Icon = ICON_MAP[social.id] ?? StarIcon;
          return (
            <a
              key={social.id}
              href={social.url}
              target="_blank"
              rel="noopener noreferrer"
              aria-label={social.name}
              className="focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#00AB39]"
            >
              <DoodleFrame edge={7} radius={999}>
                <div className="flex h-14 w-14 items-center justify-center text-[#00AB39]">
                  <Icon className="h-6 w-6" />
                </div>
              </DoodleFrame>
            </a>
          );
        })}
      </div>
    </section>
  );
}
