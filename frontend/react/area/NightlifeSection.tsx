import { useState } from 'react';
import { useI18n } from '../hooks/useI18n';
import { PlaceGallery } from '../places/PlaceGallery';
import { PlaceDetailModal } from '../places/PlaceDetailModal';
import type { PlaceWithDetails } from '../places/types';
import { SectionDecor } from '../shared/SectionDecor';

/** Same Nominatim-geocoded village centroid as AreaEatPage/AreaVisitPage. */
const HOSTEL_CENTER: [number, number] = [-6.3371905, 39.0223673];

const COPY = {
  es: {
    eyebrow: 'La Zona',
    title: 'Ocio y Vida Nocturna',
    subtitle: 'Bares, discotecas y planes para la noche cerca del albergue.',
    empty: 'Próximamente más opciones de ocio nocturno.',
  },
  en: {
    eyebrow: 'The Area',
    title: 'Leisure & Nightlife',
    subtitle: 'Bars, clubs, and evening plans near the hostel.',
    empty: 'More nightlife options coming soon.',
  },
} as const;

export function NightlifeSection({ places }: Readonly<{ places: PlaceWithDetails[] }>) {
  const { locale } = useI18n();
  const isEs = locale !== 'en';
  const t = isEs ? COPY.es : COPY.en;

  const [selectedPlace, setSelectedPlace] = useState<PlaceWithDetails | null>(null);
  const [modalOpen, setModalOpen] = useState(false);

  return (
    <section className="relative isolate py-10 bg-white">
      <SectionDecor preset="hospitality" delayOffset={2.4} />
      <div className="container mx-auto max-w-6xl px-4">
        <div className="mb-5 flex items-start gap-3">
          <img src="/png/food/drink.png" alt="" className="h-9 w-9 shrink-0" />
          <div>
            <p className="text-xs font-bold uppercase tracking-wide text-[#00AB39]">{t.eyebrow}</p>
            <h2 className="text-2xl font-bold text-[#5D4E37] font-sketch">{t.title}</h2>
            <p className="text-sm text-[#5D4E37]/70 font-handwritten">{t.subtitle}</p>
          </div>
        </div>

        {places.length === 0 ? (
          <p className="rounded-xl border-2 border-dashed border-[#5D4E37]/20 p-8 text-center text-sm text-[#5D4E37]/60">
            {t.empty}
          </p>
        ) : (
          <PlaceGallery
            places={places}
            mapCenter={HOSTEL_CENTER}
            onPlaceClick={(place) => {
              setSelectedPlace(place);
              setModalOpen(true);
            }}
          />
        )}

        <PlaceDetailModal place={selectedPlace} open={modalOpen} onOpenChange={setModalOpen} />
      </div>
    </section>
  );
}
