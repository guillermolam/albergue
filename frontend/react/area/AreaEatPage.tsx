import { useI18n } from '../hooks/useI18n';
import { PageHero } from '../shared/PageHero';
import { SectionDecor } from '../shared/SectionDecor';
import { PlaceGallery } from '../places/PlaceGallery';
import type { PlaceWithDetails } from '../places/types';

/** Real "El Carrascalejo, Badajoz" village centroid (Nominatim-geocoded,
 * see domain_model/seed/geocode.mjs), matching the hostel's corrected
 * coordinates in dev_seed_places_and_hostel.sql -- used when the map has no
 * geolocated places to derive a center from. */
const HOSTEL_CENTER: [number, number] = [-6.3371905, 39.0223673];

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
      <PageHero eyebrow={t.eyebrow} title={t.title} subtitle={t.subtitle} decor="journey" />
      <section className="relative isolate container mx-auto px-4 py-12">
        <SectionDecor preset="hospitality" />
        <PlaceGallery places={places} mapCenter={HOSTEL_CENTER} />
      </section>
    </>
  );
}
