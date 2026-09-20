import { useI18n } from '../hooks/useI18n';
import { ClipboardIcon } from '../doodle/DoodleIcons';

export type LocalNoticeCategory = 'agenda' | 'noticias' | 'tablon';

export interface LocalNotice {
  id: string;
  category: LocalNoticeCategory;
  title: string;
  url: string;
  updated: string;
  summary: string | null;
  imageUrl: string | null;
}

const COPY = {
  es: {
    eyebrow: 'Ayuntamiento de El Carrascalejo',
    title: 'Vida local en nuestro pueblo',
    subtitle: 'Avisos y noticias reales del Ayuntamiento del pueblo donde está el albergue.',
    empty: 'No hay avisos publicados en este momento.',
    categoryLabel: { agenda: 'Agenda', noticias: 'Noticias', tablon: 'Tablón' } as Record<
      LocalNoticeCategory,
      string
    >,
    readMore: 'Leer más',
    source: 'Fuente: elcarrascalejo.es',
  },
  en: {
    eyebrow: 'El Carrascalejo Town Hall',
    title: 'Local life in our village',
    subtitle: 'Real notices and news from the town hall of the village the hostel is in.',
    empty: 'No notices published right now.',
    categoryLabel: { agenda: 'Agenda', noticias: 'News', tablon: 'Notice board' } as Record<
      LocalNoticeCategory,
      string
    >,
    readMore: 'Read more',
    source: 'Source: elcarrascalejo.es',
  },
} as const;

const CATEGORY_COLOR: Record<LocalNoticeCategory, string> = {
  agenda: '#0071BC',
  noticias: '#8B6914',
  tablon: '#00AB39',
};

function formatDate(iso: string, locale: string): string {
  const date = new Date(iso);
  if (Number.isNaN(date.getTime())) return '';
  return new Intl.DateTimeFormat(locale === 'en' ? 'en-GB' : 'es-ES', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  }).format(date);
}

export function CarrascalejoLocalSection({ notices }: Readonly<{ notices: LocalNotice[] }>) {
  const { locale } = useI18n();
  const isEs = locale !== 'en';
  const t = isEs ? COPY.es : COPY.en;

  return (
    <section className="py-10 bg-[#FFFFFF]">
      <div className="container mx-auto max-w-6xl px-4">
        <div className="mb-6 flex items-start gap-3">
          <ClipboardIcon className="h-9 w-9 shrink-0 text-[#00AB39]" />
          <div>
            <p className="text-xs font-bold uppercase tracking-wide text-[#00AB39]">{t.eyebrow}</p>
            <h2 className="text-2xl font-bold text-[#5D4E37] font-sketch">{t.title}</h2>
            <p className="text-sm text-[#5D4E37]/70 font-handwritten">{t.subtitle}</p>
          </div>
        </div>

        {notices.length === 0 ? (
          <p className="rounded-xl border-2 border-dashed border-[#5D4E37]/20 p-8 text-center text-sm text-[#5D4E37]/60">
            {t.empty}
          </p>
        ) : (
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {notices.map((notice) => (
              <a
                key={notice.id}
                href={notice.url}
                target="_blank"
                rel="noopener noreferrer"
                className="flex flex-col overflow-hidden rounded-xl border-2 border-[#5D4E37]/20 bg-white doodle-shadow paper-texture transition-transform hover:-translate-y-1"
              >
                {notice.imageUrl && (
                  <img
                    src={notice.imageUrl}
                    alt=""
                    className="h-36 w-full object-cover"
                    loading="lazy"
                  />
                )}
                <div className="flex flex-1 flex-col p-4">
                  <span
                    className="mb-2 w-fit rounded-full px-2.5 py-0.5 text-[10px] font-bold text-white"
                    style={{ backgroundColor: CATEGORY_COLOR[notice.category] }}
                  >
                    {t.categoryLabel[notice.category]}
                  </span>
                  <h3 className="mb-1 text-sm font-bold text-[#5D4E37] font-sketch">
                    {notice.title}
                  </h3>
                  {notice.summary && (
                    <p className="mb-2 text-xs text-[#5D4E37]/70">{notice.summary}</p>
                  )}
                  <span className="mt-auto text-xs text-[#5D4E37]/50">
                    {formatDate(notice.updated, locale)}
                  </span>
                </div>
              </a>
            ))}
          </div>
        )}

        <p className="mt-4 text-xs text-[#5D4E37]/50">{t.source}</p>
      </div>
    </section>
  );
}
