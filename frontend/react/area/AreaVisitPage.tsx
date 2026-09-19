import { useState } from 'react';
import { useI18n } from '../hooks/useI18n';
import { PageHero } from '../shared/PageHero';
import { FancyCard } from '../shared/FancyCard';
import { MapLibreMap, type MapLibreMarkerData } from '../shared/MapLibreMap';
import { WiredButton } from '../doodle/WiredButton';
import { MonumentIcon } from '../doodle/DoodleIcons';

/** Same invented-placeholder-coordinates caveat as AreaEatPage. */
const HOSTEL_CENTER: [number, number] = [-6.3487, 39.0027];

interface Activity {
  id: string;
  kind: 'free' | 'guided';
  coords: [number, number];
  es: {
    name: string;
    duration: string;
    distanceOrGroup: string;
    price?: string;
    description: string;
    highlights: string[];
  };
  en: {
    name: string;
    duration: string;
    distanceOrGroup: string;
    price?: string;
    description: string;
    highlights: string[];
  };
}

const ACTIVITIES: Activity[] = [
  {
    id: 'town-walk',
    kind: 'free',
    coords: [-6.3485, 39.0029],
    es: {
      name: 'Paseo por el Casco Histórico',
      duration: '1-2 horas',
      distanceOrGroup: 'Autoguiado',
      description: 'Explora las calles y edificios históricos de Carrascalejo a tu propio ritmo.',
      highlights: [
        'Plaza Mayor',
        'Iglesia de San Pedro',
        'Arquitectura tradicional',
        'Tiendas de artesanía',
      ],
    },
    en: {
      name: 'Historic Town Center Walk',
      duration: '1-2 hours',
      distanceOrGroup: 'Self-guided',
      description:
        'Explore the charming streets and historic buildings of Carrascalejo at your own pace.',
      highlights: [
        'Plaza Mayor',
        'Church of San Pedro',
        'Traditional architecture',
        'Local artisan shops',
      ],
    },
  },
  {
    id: 'camino-loop',
    kind: 'free',
    coords: [-6.3521, 39.0058],
    es: {
      name: 'Ruta del Camino Extendida',
      duration: '2-3 horas',
      distanceOrGroup: 'Circuito de 5 km',
      description: 'Un precioso circuito por el campo que rodea la localidad.',
      highlights: ['Olivares', 'Vistas panorámicas', 'Fauna local', 'Fotografía'],
    },
    en: {
      name: 'Camino Trail Extension',
      duration: '2-3 hours',
      distanceOrGroup: '5 km loop',
      description: 'A beautiful circular walk through the countryside surrounding the town.',
      highlights: ['Olive groves', 'Panoramic views', 'Wildlife spotting', 'Photo opportunities'],
    },
  },
  {
    id: 'sunset-viewpoint',
    kind: 'free',
    coords: [-6.3455, 39.0011],
    es: {
      name: 'Mirador del Atardecer',
      duration: '30 minutos',
      distanceOrGroup: '1 km',
      description: 'Un corto paseo hasta el mejor punto para ver la puesta de sol de la zona.',
      highlights: [
        'Vistas de 360°',
        'Ideal para la reflexión',
        'Fotografía',
        'Meditación al atardecer',
      ],
    },
    en: {
      name: 'Sunset Viewpoint',
      duration: '30 minutes',
      distanceOrGroup: '1 km',
      description: 'Short walk to the best sunset viewing spot in the area.',
      highlights: ['360° views', 'Perfect for reflection', 'Photography', 'Evening meditation'],
    },
  },
  {
    id: 'heritage-tour',
    kind: 'guided',
    coords: [-6.3512, 39.0042],
    es: {
      name: 'Ruta del Patrimonio de Extremadura',
      duration: '4 horas',
      distanceOrGroup: 'Mín. 4 personas',
      price: '25 € por persona',
      description:
        'Recorrido completo por los lugares históricos y culturales de la región con guía local.',
      highlights: [
        'Ruinas romanas',
        'Castillo medieval',
        'Visita a bodega local',
        'Comida tradicional incluida',
      ],
    },
    en: {
      name: 'Extremadura Heritage Tour',
      duration: '4 hours',
      distanceOrGroup: 'Min. 4 people',
      price: '€25 per person',
      description:
        "Comprehensive tour of the region's historical and cultural sites with a local expert.",
      highlights: [
        'Roman ruins',
        'Medieval castle',
        'Local winery visit',
        'Traditional lunch included',
      ],
    },
  },
  {
    id: 'camino-history',
    kind: 'guided',
    coords: [-6.3468, 39.0038],
    es: {
      name: 'Experiencia Histórica del Camino',
      duration: '3 horas',
      distanceOrGroup: 'Mín. 6 personas',
      price: '20 € por persona',
      description:
        'Un recorrido profundo por la historia y el significado del Camino de Santiago en la región.',
      highlights: [
        'Tradiciones del peregrino',
        'Lugares históricos',
        'Significado espiritual',
        'Turno de preguntas',
      ],
    },
    en: {
      name: 'Camino History Experience',
      duration: '3 hours',
      distanceOrGroup: 'Min. 6 people',
      price: '€20 per person',
      description:
        'Deep dive into the history and significance of the Camino de Santiago in this region.',
      highlights: [
        'Pilgrim traditions',
        'Historical sites',
        'Spiritual significance',
        'Q&A with guide',
      ],
    },
  },
  {
    id: 'nature-trek',
    kind: 'guided',
    coords: [-6.354, 39.0067],
    es: {
      name: 'Ruta de Naturaleza y Fauna',
      duration: '5 horas',
      distanceOrGroup: 'Mín. 4 personas',
      price: '35 € por persona',
      description: 'Paseo guiado por el ecosistema único de Extremadura.',
      highlights: [
        'Observación de aves',
        'Flora autóctona',
        'Formaciones geológicas',
        'Picnic incluido',
      ],
    },
    en: {
      name: 'Nature & Wildlife Trek',
      duration: '5 hours',
      distanceOrGroup: 'Min. 4 people',
      price: '€35 per person',
      description: "Guided nature walk through Extremadura's unique ecosystem.",
      highlights: ['Bird watching', 'Native flora', 'Geological features', 'Picnic lunch'],
    },
  },
];

const COPY = {
  es: {
    eyebrow: 'La Zona',
    title: 'Qué Visitar',
    subtitle: 'Descubre la belleza y la historia de Carrascalejo y sus alrededores.',
    filterFree: 'Rutas Gratuitas',
    filterGuided: 'Visitas Guiadas',
    durationLabel: 'Duración',
    groupLabel: 'Grupo / distancia',
    priceLabel: 'Precio',
    bookingNote:
      'Las visitas guiadas deben reservarse con al menos 48 horas de antelación. Contacta con recepción o llama al +34 123 456 789.',
  },
  en: {
    eyebrow: 'The Area',
    title: 'What to Visit',
    subtitle: 'Explore the beauty and history of Carrascalejo and its surroundings.',
    filterFree: 'Free Tours',
    filterGuided: 'Guided Tours',
    durationLabel: 'Duration',
    groupLabel: 'Group / distance',
    priceLabel: 'Price',
    bookingNote:
      'Guided tours must be booked at least 48 hours in advance. Contact reception or call +34 123 456 789.',
  },
} as const;

export function AreaVisitPage() {
  const { locale } = useI18n();
  const isEs = locale !== 'en';
  const t = isEs ? COPY.es : COPY.en;
  const [filter, setFilter] = useState<'free' | 'guided'>('free');
  const [activeId, setActiveId] = useState<string | null>(null);

  const filtered = ACTIVITIES.filter((activity) => activity.kind === filter);

  const markers: MapLibreMarkerData[] = filtered.map((activity) => ({
    id: activity.id,
    coords: activity.coords,
    label: (isEs ? activity.es : activity.en).name,
    active: activity.id === activeId,
    onClick: () => setActiveId(activity.id),
  }));

  return (
    <>
      <PageHero eyebrow={t.eyebrow} title={t.title} subtitle={t.subtitle} />
      <section className="container mx-auto px-4 py-12">
        <div className="mb-8 flex justify-center gap-3">
          <WiredButton
            variant={filter === 'free' ? 'primary' : 'outline'}
            onClick={() => {
              setFilter('free');
              setActiveId(null);
            }}
          >
            {t.filterFree}
          </WiredButton>
          <WiredButton
            variant={filter === 'guided' ? 'primary' : 'outline'}
            onClick={() => {
              setFilter('guided');
              setActiveId(null);
            }}
          >
            {t.filterGuided}
          </WiredButton>
        </div>

        <div className="mb-8">
          <MapLibreMap center={HOSTEL_CENTER} markers={markers} />
        </div>

        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
          {filtered.map((activity) => {
            const copy = isEs ? activity.es : activity.en;
            return (
              <FancyCard
                key={activity.id}
                title={copy.name}
                description={copy.description}
                icon={<MonumentIcon className="h-8 w-8" />}
                meta={[
                  { label: t.durationLabel, value: copy.duration },
                  { label: t.groupLabel, value: copy.distanceOrGroup },
                  ...(copy.price ? [{ label: t.priceLabel, value: copy.price }] : []),
                ]}
                tags={copy.highlights}
                variant={activity.id === activeId ? 'featured' : 'default'}
                onClick={() => setActiveId(activity.id)}
              />
            );
          })}
        </div>

        {filter === 'guided' && (
          <div className="mx-auto mt-8 max-w-2xl rounded-xl border-2 border-[#0071BC]/30 bg-[#E3F2FD] p-6 text-center text-sm text-[#5D4E37] doodle-shadow">
            {t.bookingNote}
          </div>
        )}
      </section>
    </>
  );
}
