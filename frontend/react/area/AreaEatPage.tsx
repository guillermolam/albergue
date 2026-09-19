import { useState } from 'react';
import { useI18n } from '../hooks/useI18n';
import { PageHero } from '../shared/PageHero';
import { FancyCard } from '../shared/FancyCard';
import { MapLibreMap, type MapLibreMarkerData } from '../shared/MapLibreMap';
import { UtensilsIcon } from '../doodle/DoodleIcons';

/** Approximate center of El Carrascalejo, Badajoz -- the restaurant
 * coordinates below are invented offsets from this point (not real
 * geocoding), since this is curated placeholder content, not a live POI
 * API. Good enough to place pins sensibly on the map, not for navigation. */
const HOSTEL_CENTER: [number, number] = [-6.3487, 39.0027];

interface Restaurant {
  id: string;
  coords: [number, number];
  priceRange: string;
  distance: string;
  es: { name: string; type: string; description: string; specialties: string[] };
  en: { name: string; type: string; description: string; specialties: string[] };
}

const RESTAURANTS: Restaurant[] = [
  {
    id: 'el-camino',
    coords: [-6.3492, 39.0031],
    priceRange: '€€',
    distance: '0.2 km',
    es: {
      name: 'Restaurante El Camino',
      type: 'Cocina tradicional extremeña',
      description: 'Restaurante familiar con auténtica cocina de Extremadura.',
      specialties: ['Cerdo ibérico', 'Quesos locales', 'Guisos tradicionales'],
    },
    en: {
      name: 'Restaurante El Camino',
      type: 'Traditional Extremaduran',
      description: 'Family-run restaurant serving authentic Extremadura cuisine.',
      specialties: ['Iberian pork', 'Local cheese', 'Traditional stews'],
    },
  },
  {
    id: 'los-peregrinos',
    coords: [-6.3481, 39.0022],
    priceRange: '€',
    distance: '0.1 km',
    es: {
      name: 'Bar Los Peregrinos',
      type: 'Tapas y bar',
      description: 'Punto de encuentro popular entre peregrinos, tapas y bebidas económicas.',
      specialties: ['Tapas', 'Bocadillos', 'Menú del peregrino'],
    },
    en: {
      name: 'Bar Los Peregrinos',
      type: 'Tapas & bar',
      description: 'Popular pilgrim hangout with affordable tapas and drinks.',
      specialties: ['Tapas', 'Sandwiches', 'Pilgrim menu'],
    },
  },
  {
    id: 'la-encina',
    coords: [-6.3502, 39.0035],
    priceRange: '€€€',
    distance: '0.3 km',
    es: {
      name: 'Mesón La Encina',
      type: 'Cocina regional',
      description: 'Comedor de categoría superior con vinos locales e ingredientes de temporada.',
      specialties: ['Carnes de caza', 'Vinos regionales', 'Verduras de temporada'],
    },
    en: {
      name: 'Mesón La Encina',
      type: 'Regional cuisine',
      description: 'Upscale dining featuring local wines and seasonal ingredients.',
      specialties: ['Game meats', 'Regional wines', 'Seasonal vegetables'],
    },
  },
  {
    id: 'cafeteria-plaza',
    coords: [-6.3479, 39.0034],
    priceRange: '€',
    distance: '0.15 km',
    es: {
      name: 'Cafetería Plaza',
      type: 'Café y panadería',
      description: 'Perfecta para desayunar antes de empezar tu etapa del Camino.',
      specialties: ['Bollería fresca', 'Café', 'Desayunos'],
    },
    en: {
      name: 'Cafetería Plaza',
      type: 'Café & bakery',
      description: 'Perfect for breakfast before starting your day on the Camino.',
      specialties: ['Fresh pastries', 'Coffee', 'Breakfast'],
    },
  },
];

const COPY = {
  es: {
    eyebrow: 'La Zona',
    title: 'Dónde Comer',
    subtitle: 'Descubre las mejores opciones para comer cerca del albergue.',
    typeLabel: 'Tipo',
    distanceLabel: 'Distancia',
    priceLabel: 'Precio',
  },
  en: {
    eyebrow: 'The Area',
    title: 'Where to Eat',
    subtitle: 'Discover the best dining options near the hostel.',
    typeLabel: 'Type',
    distanceLabel: 'Distance',
    priceLabel: 'Price',
  },
} as const;

export function AreaEatPage() {
  const { locale } = useI18n();
  const isEs = locale !== 'en';
  const t = isEs ? COPY.es : COPY.en;
  const [activeId, setActiveId] = useState<string | null>(null);

  const markers: MapLibreMarkerData[] = RESTAURANTS.map((restaurant) => ({
    id: restaurant.id,
    coords: restaurant.coords,
    label: (isEs ? restaurant.es : restaurant.en).name,
    active: restaurant.id === activeId,
    onClick: () => setActiveId(restaurant.id),
  }));

  return (
    <>
      <PageHero eyebrow={t.eyebrow} title={t.title} subtitle={t.subtitle} />
      <section className="container mx-auto px-4 py-12">
        <div className="mb-8">
          <MapLibreMap center={HOSTEL_CENTER} markers={markers} />
        </div>
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
          {RESTAURANTS.map((restaurant) => {
            const copy = isEs ? restaurant.es : restaurant.en;
            return (
              <FancyCard
                key={restaurant.id}
                title={copy.name}
                description={copy.description}
                icon={<UtensilsIcon className="h-8 w-8" />}
                meta={[
                  { label: t.typeLabel, value: copy.type },
                  { label: t.distanceLabel, value: restaurant.distance },
                  { label: t.priceLabel, value: restaurant.priceRange },
                ]}
                tags={copy.specialties}
                variant={restaurant.id === activeId ? 'featured' : 'default'}
                onClick={() => setActiveId(restaurant.id)}
              />
            );
          })}
        </div>
      </section>
    </>
  );
}
