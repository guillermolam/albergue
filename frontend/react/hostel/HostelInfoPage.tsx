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
      description: 'Desde Santiago: línea 5 hasta Carrascalejo, 45 minutos.',
    },
    camino: { title: 'Desde el Camino', description: 'A 2 km del desvío en Negreira, señalizado.' },
    car: { title: 'En Coche', description: 'A-8 salida 123, seguir señales a Carrascalejo.' },
    coordinates: { title: 'Coordenadas GPS', description: '42.1234, -8.5678' },
  },
  en: {
    title: 'How to Arrive',
    subtitle: 'Everything you need to find us on the Camino de Santiago',
    bus: { title: 'By Bus', description: 'From Santiago: line 5 to Carrascalejo, 45 minutes.' },
    camino: {
      title: 'From the Camino',
      description: '2 km from the Negreira turn-off, signposted.',
    },
    car: { title: 'By Car', description: 'A-8 exit 123, follow signs to Carrascalejo.' },
    coordinates: { title: 'GPS Coordinates', description: '42.1234, -8.5678' },
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
