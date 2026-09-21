import { useI18n } from '../hooks/useI18n';
import { SectionDecor } from '../shared/SectionDecor';
import { ExternalLinkIcon, StarIcon, QuoteIcon } from '../doodle/DoodleIcons';

interface PressItem {
  id: string;
  outlet: string;
  outletUrl: string;
  title: string;
  date: string;
  excerpt: string;
  logo?: string;
  rating?: number;
}

const PRESS_ITEMS: PressItem[] = [
  {
    id: 'hoy',
    outlet: 'Hoy.es',
    outletUrl:
      'https://www.hoy.es/extremadura/juanma-chelo-reabren-bar-pueblo-pequeno-extremadura-20240919200222-nt.html',
    title: 'Juanma y Chelo reabren el bar de un pueblo pequeño de Extremadura',
    date: '19 Septiembre 2024',
    excerpt:
      'La pareja ha recuperado Alqantara Plaza, un establecimiento con historia en El Carrascalejo, apostando por la cocina extremeña y de brasa en un entorno rural.',
    rating: 5,
  },
  {
    id: 'tripadvisor',
    outlet: 'TripAdvisor',
    outletUrl:
      'https://www.tripadvisor.com/Restaurant_Review-g17765223-d33009470-Reviews-Alqantara_Plaza-El_Carrascalejo_Province_of_Badajoz_Extremadura.html',
    title: 'Alqantara Plaza - El Carrascalejo',
    date: '2024-2025',
    excerpt:
      "L'albergue est grande, moderne, très propre et très tranquille. Les hôtes sont très accueillants et font tout leur possible pour que le séjour de leurs clients se passe du mieux possible.",
    rating: 5,
  },
  {
    id: 'instagram',
    outlet: 'Instagram',
    outletUrl: 'https://www.instagram.com/alqantaraplaza_bar/',
    title: '@alqantaraplaza_bar',
    date: 'Activo',
    excerpt:
      'Síguenos para ver los platos del día, eventos especiales y la vida diaria en nuestra terraza. Cocina casera, brasa y buen ambiente.',
    rating: undefined,
  },
];

const COPY = {
  es: {
    title: 'En Prensa y Redes',
    subtitle: 'Lo que dicen de nosotros',
    readMore: 'Leer artículo completo',
    follow: 'Seguir en Instagram',
    ratingLabel: 'Valoración',
  },
  en: {
    title: 'Press & Social',
    subtitle: 'What they say about us',
    readMore: 'Read full article',
    follow: 'Follow on Instagram',
    ratingLabel: 'Rating',
  },
} as const;

function PressCard({ item, t }: Readonly<{ item: PressItem; t: (typeof COPY)['es'] }>) {
  const hasRating = item.rating !== undefined;

  return (
    <article className="relative group rounded-xl border-2 border-[#5D4E37]/20 bg-white p-5 paper-texture doodle-border transition-all hover:border-[#00AB39]/40 hover:shadow-lg">
      <div className="flex items-start gap-3">
        <div className="flex-shrink-0 w-12 h-12 rounded-lg bg-[#00AB39]/10 flex items-center justify-center">
          {item.rating ? (
            <>
              {Array.from({ length: 5 }, (_, i) => (
                <StarIcon
                  key={i}
                  className={`h-3.5 w-3.5 ${i < item.rating! ? 'text-[#EAC102]' : 'text-[#5D4E37]/20'}`}
                  animate={false}
                />
              ))}
            </>
          ) : (
            <QuoteIcon className="h-6 w-6 text-[#00AB39]" />
          )}
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-xs font-bold uppercase tracking-wide text-[#00AB39]">{item.outlet}</p>
          <h4 className="mt-0.5 text-base font-bold text-[#5D4E37] font-sketch line-clamp-2 group-hover:text-[#00AB39] transition-colors">
            {item.title}
          </h4>
          <p className="mt-1 text-xs text-[#5D4E37]/50">{item.date}</p>
          <p className="mt-3 text-sm text-[#5D4E37]/80 font-handwritten leading-relaxed line-clamp-3">
            {item.excerpt}
          </p>
          <a
            href={item.outletUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-3 inline-flex items-center gap-1.5 text-sm text-[#00AB39] font-bold font-sketch hover:text-[#5D4E37] transition-colors"
          >
            {item.outlet === 'Instagram' ? t.follow : t.readMore}
            <ExternalLinkIcon className="h-3.5 w-3.5" />
          </a>
        </div>
      </div>
    </article>
  );
}

export function RestaurantPressMedia() {
  const { locale } = useI18n();
  const isEs = locale !== 'en';
  const t = isEs ? COPY.es : COPY.en;

  return (
    <section className="relative isolate py-12" aria-labelledby="press-heading">
      <SectionDecor preset="hospitality" delayOffset={0.3} />
      <div className="container mx-auto max-w-5xl px-4">
        <header className="mb-8 text-center">
          <p
            id="press-heading"
            className="text-xs font-bold uppercase tracking-wide text-[#00AB39]"
          >
            {t.title}
          </p>
          <h2 className="mt-1 text-2xl font-bold text-[#5D4E37] font-sketch">{t.subtitle}</h2>
        </header>

        <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
          {PRESS_ITEMS.map((item) => (
            <PressCard key={item.id} item={item} t={t} />
          ))}
        </div>

        <div className="mt-8 text-center">
          <a
            href="https://alqantara.es/alqantara-plaza/"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 rounded-full border-2 border-[#5D4E37]/30 bg-white px-5 py-2.5 text-sm font-bold text-[#5D4E37] font-sketch hover:border-[#00AB39] hover:text-[#00AB39] hover:bg-[#f5f0e8] transition-all"
          >
            <ExternalLinkIcon className="h-4 w-4" />
            <span>
              {isEs
                ? 'Ver web oficial de Alqantara Plaza'
                : 'Visit Alqantara Plaza official website'}
            </span>
          </a>
        </div>
      </div>
    </section>
  );
}
