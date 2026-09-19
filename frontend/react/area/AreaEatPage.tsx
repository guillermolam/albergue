import { useI18n } from '../hooks/useI18n';
import { PageHero } from '../shared/PageHero';
import { PlaceGallery } from '../places/PlaceGallery';
import type { PlaceWithDetails } from '../places/types';

/** Approximate center of El Carrascalejo, Badajoz -- used when the map has
 * no geolocated places to derive a center from. */
const HOSTEL_CENTER: [number, number] = [-6.3487, 39.0027];

const COPY = {
  es: {
    eyebrow: 'La Zona',
    title: 'Dónde Comer',
    subtitle: 'Descubre las mejores opciones para comer y tomar algo cerca del albergue.',
  },
  en: {
    eyebrow: 'The Area',
    title: 'Where to Eat',
    subtitle: 'Discover the best dining and drinking options near the hostel.',
  },
} as const;

interface AreaEatPageProps {
  places: PlaceWithDetails[];
}

export function AreaEatPage({ places }: Readonly<AreaEatPageProps>) {
  const { locale } = useI18n();
  const isEs = locale !== 'en';
  const t = isEs ? COPY.es : COPY.en;

  return (
    <>
      <PageHero eyebrow={t.eyebrow} title={t.title} subtitle={t.subtitle} />
      <section className="container mx-auto px-4 py-12">
        <PlaceGallery places={places} mapCenter={HOSTEL_CENTER} />
      </section>
    </>
  );
}
