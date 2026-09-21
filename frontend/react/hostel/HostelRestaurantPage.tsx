import { useI18n } from '../hooks/useI18n';
import { PageHero } from '../shared/PageHero';
import { FancyCard } from '../shared/FancyCard';
import { MapLibreMap } from '../shared/MapLibreMap';
import { UtensilsIcon, PhoneIcon, MapPinIcon } from '../doodle/DoodleIcons';
import { WiredButton } from '../doodle/WiredButton';
import { RestaurantMenu } from './RestaurantMenu';
import { RestaurantPhotoGallery } from './RestaurantPhotoGallery';
import { RestaurantPressMedia } from './RestaurantPressMedia';

// Approximate town-center coordinates for El Carrascalejo, Badajoz
// (39.02278, -6.33722 per Wikipedia) -- not a precisely geocoded street
// address for Alqantara Plaza itself, just a reasonable pin location.
const RESTAURANT_COORDS: [number, number] = [-6.33722, 39.02278];

const COPY = {
  es: {
    eyebrow: 'El secreto mejor guardado de la A-66',
    title: 'Nuestro Restaurante',
    subtitle:
      'A pocos pasos del albergue, recomendamos Alqantara Plaza: una terraza acogedora en plena naturaleza de El Carrascalejo, ideal para reponer fuerzas tras una etapa del Camino.',
    aboutTitle: 'Sobre Alqantara Plaza',
    aboutText:
      'Cocina extremeña y a la brasa en un entorno rural apto para mascotas. Un lugar de confianza para peregrinos que buscan una buena comida casera cerca del albergue.',
    locationTitle: 'Cómo llegar',
    contactTitle: 'Contacto y Reservas',
    reserveCta: 'Reservar Mesa',
  },
  en: {
    eyebrow: 'The best-kept secret of the A-66',
    title: 'Our Restaurant',
    subtitle:
      'Just a short walk from the hostel, we recommend Alqantara Plaza: a welcoming terrace set in the natural surroundings of El Carrascalejo, perfect for refuelling after a stage of the Camino.',
    aboutTitle: 'About Alqantara Plaza',
    aboutText:
      'Extremaduran and grilled cuisine in a pet-friendly rural setting. A trusted spot for pilgrims looking for good home-style food near the hostel.',
    locationTitle: 'Getting There',
    contactTitle: 'Contact & Reservations',
    reserveCta: 'Reserve a Table',
  },
} as const;

export function HostelRestaurantPage() {
  const { locale } = useI18n();
  const isEs = locale !== 'en';
  const t = isEs ? COPY.es : COPY.en;

  return (
    <>
      <PageHero eyebrow={t.eyebrow} title={t.title} subtitle={t.subtitle} decor="hospitality" />

      <section className="container mx-auto max-w-4xl px-4 py-12">
        <FancyCard
          title={t.aboutTitle}
          description={t.aboutText}
          icon={<UtensilsIcon className="h-8 w-8" />}
        />
      </section>

      <RestaurantPhotoGallery />

      <section className="container mx-auto max-w-4xl px-4 py-6">
        <h2 className="mb-4 flex items-center gap-2 text-2xl font-bold text-[#5D4E37] font-sketch">
          <MapPinIcon className="h-6 w-6" />
          {t.locationTitle}
        </h2>
        <p className="mb-4 text-sm text-[#5D4E37]/80 font-handwritten">
          C. Gral. Mola, 30A, 06894 El Carrascalejo, Badajoz
        </p>
        <MapLibreMap
          center={RESTAURANT_COORDS}
          zoom={14}
          markers={[{ id: 'alqantara-plaza', coords: RESTAURANT_COORDS, label: 'Alqantara Plaza' }]}
        />
      </section>

      <RestaurantMenu />

      <RestaurantPressMedia />

      <section className="container mx-auto max-w-2xl px-4 py-12 text-center">
        <FancyCard
          title={t.contactTitle}
          description=""
          icon={<PhoneIcon className="h-8 w-8" />}
          meta={[
            { label: isEs ? 'Teléfono' : 'Phone', value: '+34 695 90 43 44' },
            { label: 'Email', value: 'info@alqantara.es' },
          ]}
        />
        <div className="mt-6">
          <WiredButton href="tel:+34695904344" variant="primary">
            {t.reserveCta}
          </WiredButton>
        </div>
      </section>
    </>
  );
}
