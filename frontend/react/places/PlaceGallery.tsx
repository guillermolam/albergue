import { useEffect, useRef, useState } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useI18n } from '../hooks/useI18n';
import { MapLibreMap, type MapLibreMarkerData } from '../shared/MapLibreMap';
import { PlaceCard } from './PlaceCard';
import type { PlaceCategory, PlaceWithDetails } from './types';

let scrollTriggerRegistered = false;

function ensureScrollTrigger() {
  if (!scrollTriggerRegistered) {
    gsap.registerPlugin(ScrollTrigger);
    scrollTriggerRegistered = true;
  }
}

const CATEGORY_LABELS: Record<PlaceCategory, { es: string; en: string }> = {
  restaurant: { es: 'Restaurantes', en: 'Restaurants' },
  bar: { es: 'Bares', en: 'Bars' },
  night_club: { es: 'Discotecas', en: 'Night Clubs' },
  museum: { es: 'Museos', en: 'Museums' },
  trail: { es: 'Rutas', en: 'Trails' },
  park: { es: 'Parques', en: 'Parks' },
  excursion: { es: 'Excursiones', en: 'Excursions' },
  pharmacy: { es: 'Farmacias', en: 'Pharmacies' },
  atm: { es: 'Cajeros', en: 'ATMs' },
  medical: { es: 'Sanidad', en: 'Medical' },
  transport: { es: 'Transporte', en: 'Transport' },
  supermarket: { es: 'Supermercados', en: 'Supermarkets' },
  other: { es: 'Otros', en: 'Other' },
};

interface PlaceGalleryProps {
  places: PlaceWithDetails[];
  mapCenter?: [number, number];
  showMap?: boolean;
  /** Optional: called (in addition to the existing map-sync highlight) when
   * a card is clicked -- callers can use this to open a detail modal. */
  onPlaceClick?: (place: PlaceWithDetails) => void;
}

export function PlaceGallery({
  places,
  mapCenter,
  showMap = true,
  onPlaceClick,
}: Readonly<PlaceGalleryProps>) {
  const { locale } = useI18n();
  const isEs = locale !== 'en';
  const [activeCategory, setActiveCategory] = useState<PlaceCategory | 'all'>('all');
  const [activeId, setActiveId] = useState<number | null>(null);
  const gridRef = useRef<HTMLDivElement>(null);

  const categories = Array.from(new Set(places.map((p) => p.category)));
  const filtered =
    activeCategory === 'all' ? places : places.filter((p) => p.category === activeCategory);

  const geolocated = filtered.filter((p) => p.latitude && p.longitude);
  const markers: MapLibreMarkerData[] = geolocated.map((place) => ({
    id: String(place.id),
    coords: [Number(place.longitude), Number(place.latitude)],
    label: isEs ? place.nameEs : place.nameEn,
    active: place.id === activeId,
    onClick: () => setActiveId(place.id),
  }));

  const center: [number, number] =
    mapCenter ??
    (geolocated[0] ? [Number(geolocated[0].longitude), Number(geolocated[0].latitude)] : [0, 0]);

  useEffect(() => {
    ensureScrollTrigger();
    if (!gridRef.current) return;

    const cards = gridRef.current.children;
    const ctx = gsap.context(() => {
      gsap.from(cards, {
        opacity: 0,
        y: 30,
        duration: 0.5,
        stagger: 0.08,
        ease: 'power2.out',
        scrollTrigger: {
          trigger: gridRef.current,
          start: 'top 85%',
        },
      });
    }, gridRef);

    return () => ctx.revert();
  }, [filtered.length]);

  return (
    <div>
      {categories.length > 1 && (
        <div className="daisy-filter mb-8 flex flex-wrap justify-center gap-2">
          <button
            type="button"
            className={`daisy-btn daisy-btn-sm ${activeCategory === 'all' ? 'daisy-btn-primary' : 'daisy-btn-outline'}`}
            onClick={() => setActiveCategory('all')}
          >
            {isEs ? 'Todos' : 'All'}
          </button>
          {categories.map((category) => (
            <button
              key={category}
              type="button"
              className={`daisy-btn daisy-btn-sm ${activeCategory === category ? 'daisy-btn-primary' : 'daisy-btn-outline'}`}
              onClick={() => setActiveCategory(category)}
            >
              {isEs ? CATEGORY_LABELS[category].es : CATEGORY_LABELS[category].en}
            </button>
          ))}
        </div>
      )}

      {showMap && geolocated.length > 0 && (
        <div className="mb-8">
          <MapLibreMap center={center} markers={markers} />
        </div>
      )}

      <div ref={gridRef} className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
        {filtered.map((place) => (
          <PlaceCard
            key={place.id}
            place={place}
            isActive={place.id === activeId}
            onClick={() => {
              setActiveId(place.id);
              onPlaceClick?.(place);
            }}
          />
        ))}
      </div>
    </div>
  );
}
