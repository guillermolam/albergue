import { useI18n } from '../hooks/useI18n';
import { PageHero } from '../shared/PageHero';
import { PlaceGallery } from '../places/PlaceGallery';
import type { PlaceWithDetails } from '../places/types';

/** Same Nominatim-geocoded village centroid as AreaEatPage. */
const HOSTEL_CENTER: [number, number] = [-6.3371905, 39.0223673];

const COPY = {
  es: {
    eyebrow: 'La Zona',
    title: 'Qué Visitar',
    subtitle: 'Descubre la belleza y la historia de Carrascalejo y sus alrededores.',
    bookingNote:
      'Las visitas guiadas deben reservarse con al menos 48 horas de antelación. Contacta con recepción o llama al +34 123 456 789.',
  },
  en: {
    eyebrow: 'The Area',
    title: 'What to Visit',
    subtitle: 'Explore the beauty and history of Carrascalejo and its surroundings.',
    bookingNote:
      'Guided tours must be booked at least 48 hours in advance. Contact reception or call +34 123 456 789.',
  },
} as const;

interface AreaVisitPageProps {
  places: PlaceWithDetails[];
}

export function AreaVisitPage({ places }: Readonly<AreaVisitPageProps>) {
  const { locale } = useI18n();
  const isEs = locale !== 'en';
  const t = isEs ? COPY.es : COPY.en;
  const hasExcursions = places.some((p) => p.category === 'excursion');

  return (
    <>
      <PageHero eyebrow={t.eyebrow} title={t.title} subtitle={t.subtitle} />
      <section className="container mx-auto px-4 py-12">
        <PlaceGallery places={places} mapCenter={HOSTEL_CENTER} />

        {hasExcursions && (
          <div className="mx-auto mt-8 max-w-2xl rounded-xl border-2 border-[#0071BC]/30 bg-[#E3F2FD] p-6 text-center text-sm text-[#5D4E37] doodle-shadow">
            {t.bookingNote}
          </div>
        )}
      </section>
    </>
  );
}
