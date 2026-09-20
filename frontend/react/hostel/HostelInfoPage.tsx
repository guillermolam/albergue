import { useI18n } from '../hooks/useI18n';
import { PageHero } from '../shared/PageHero';
import { FancyCard } from '../shared/FancyCard';
import { MapPinIcon } from '../doodle/DoodleIcons';

const COPY = {
  es: {
    title: 'Cómo Llegar',
    subtitle: 'Todo lo que necesitas saber para encontrarnos en el Camino de Santiago',
    bus: {
      title: 'En Autobús',
      description:
        'Autobuses regionales desde Mérida (15 km) hasta El Carrascalejo. Consulta horarios actualizados en recepción.',
    },
    camino: {
      title: 'Desde el Camino',
      description:
        'En la Vía de la Plata, la etapa 11 (Mérida → Alcuéscar) pasa directamente por El Carrascalejo.',
    },
    car: {
      title: 'En Coche',
      description:
        'A 15 km de Mérida y su estación de tren, en la provincia de Badajoz, Extremadura.',
    },
    coordinates: { title: 'Coordenadas GPS', description: '39.0224, -6.3372' },
  },
  en: {
    title: 'How to Arrive',
    subtitle: 'Everything you need to find us on the Camino de Santiago',
    bus: {
      title: 'By Bus',
      description:
        'Regional buses from Mérida (15 km) to El Carrascalejo. Check current timetables at reception.',
    },
    camino: {
      title: 'From the Camino',
      description:
        'On the Vía de la Plata, stage 11 (Mérida → Alcuéscar) passes directly through El Carrascalejo.',
    },
    car: {
      title: 'By Car',
      description:
        '15 km from Mérida and its train station, in the province of Badajoz, Extremadura.',
    },
    coordinates: { title: 'GPS Coordinates', description: '39.0224, -6.3372' },
  },
} as const;

export function HostelInfoPage() {
  const { locale } = useI18n();
  const isEs = locale !== 'en';
  const t = isEs ? COPY.es : COPY.en;

  const cards = [t.bus, t.camino, t.car, t.coordinates];

  return (
    <>
      <PageHero title={t.title} subtitle={t.subtitle} />
      <section className="container mx-auto max-w-4xl px-4 py-12">
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
          {cards.map((card) => (
            <FancyCard
              key={card.title}
              title={card.title}
              description={card.description}
              icon={<MapPinIcon className="h-8 w-8" />}
            />
          ))}
        </div>
      </section>
    </>
  );
}
