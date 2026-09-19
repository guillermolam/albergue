import { PageHero } from '../shared/PageHero';
import { FancyCard } from '../shared/FancyCard';
import { PhoneIcon, ClipboardIcon } from '../doodle/DoodleIcons';
import { useI18n } from '../hooks/useI18n';

const COPY = {
  es: {
    eyebrow: 'El Albergue',
    title: 'Servicios',
    subtitle: 'Normas de convivencia y contactos de emergencia para tu estancia.',
    rulesHeading: 'Normas del albergue',
    rules: [
      {
        title: 'Horarios',
        description:
          'Entrada 15:00–22:00 · Salida antes de las 11:00 · Silencio 22:00–07:00 · Cocina cierra a las 21:30.',
      },
      {
        title: 'Convivencia',
        description:
          'Zonas comunes limpias, respeta el descanso de otros peregrinos, no fumar en interiores, mascotas no permitidas.',
      },
      {
        title: 'Seguridad',
        description:
          'Taquillas con candado, no dejes objetos de valor a la vista, extintores señalizados en todo el edificio.',
      },
      {
        title: 'Servicios incluidos',
        description:
          'WiFi gratuito, ropa de cama incluida, uso libre de la cocina, consigna de equipaje disponible.',
      },
    ],
    emergencyHeading: 'Contactos de emergencia',
    emergencySubtitle: 'Disponibles las 24 horas, todos los días.',
    availability: 'Disponibilidad',
    emergencies: [
      {
        title: 'Emergencias Generales',
        number: '112',
        description: 'Policía, bomberos y sanidad para cualquier emergencia.',
        available: '24/7',
      },
      {
        title: 'Emergencia Médica',
        number: '061',
        description: 'Ambulancia y asistencia médica urgente.',
        available: '24/7',
      },
      {
        title: 'Policía Local',
        number: '092',
        description: 'Policía local de Carrascalejo.',
        available: '24/7',
      },
      {
        title: 'Centro de Salud',
        number: '924 123 456',
        description: 'Centro de Salud de Carrascalejo, para consultas no urgentes.',
        available: 'L–V: 9:00–21:00',
      },
    ],
    call: 'Llamar',
  },
  en: {
    eyebrow: 'The Hotel',
    title: 'Services',
    subtitle: 'House rules and emergency contacts for your stay.',
    rulesHeading: 'House rules',
    rules: [
      {
        title: 'Hours',
        description:
          'Check-in 3:00–10:00 PM · Check-out before 11:00 AM · Quiet hours 10:00 PM–7:00 AM · Kitchen closes at 9:30 PM.',
      },
      {
        title: 'Shared living',
        description:
          'Keep common areas clean, respect other pilgrims’ rest, no smoking indoors, pets not allowed.',
      },
      {
        title: 'Security',
        description:
          'Lockers with a padlock, don’t leave valuables in plain sight, fire extinguishers signposted throughout.',
      },
      {
        title: 'Included services',
        description:
          'Free WiFi, linens included, free use of the kitchen, luggage storage available.',
      },
    ],
    emergencyHeading: 'Emergency contacts',
    emergencySubtitle: 'Available 24 hours a day, every day.',
    availability: 'Availability',
    emergencies: [
      {
        title: 'General Emergency',
        number: '112',
        description: 'Police, fire and medical for any emergency.',
        available: '24/7',
      },
      {
        title: 'Medical Emergency',
        number: '061',
        description: 'Ambulance and urgent medical assistance.',
        available: '24/7',
      },
      {
        title: 'Local Police',
        number: '092',
        description: 'Carrascalejo local police.',
        available: '24/7',
      },
      {
        title: 'Health Center',
        number: '924 123 456',
        description: 'Carrascalejo Health Center, for non-urgent matters.',
        available: 'Mon–Fri: 9am–9pm',
      },
    ],
    call: 'Call',
  },
} as const;

export function HostelServicesPage() {
  const { locale } = useI18n();
  const isEs = locale !== 'en';
  const t = isEs ? COPY.es : COPY.en;

  return (
    <>
      <PageHero eyebrow={t.eyebrow} title={t.title} subtitle={t.subtitle} />

      <section className="container mx-auto max-w-5xl px-4 py-12">
        <h2 className="mb-6 text-2xl font-bold text-[#5D4E37] font-sketch">{t.rulesHeading}</h2>
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
          {t.rules.map((rule) => (
            <FancyCard
              key={rule.title}
              title={rule.title}
              description={rule.description}
              icon={<ClipboardIcon className="h-8 w-8" />}
            />
          ))}
        </div>
      </section>

      <section className="bg-[#FFF5F5] py-12">
        <div className="container mx-auto max-w-5xl px-4">
          <h2 className="mb-1 text-2xl font-bold text-[#ED1C24] font-sketch">
            {t.emergencyHeading}
          </h2>
          <p className="mb-6 text-sm text-[#5D4E37]/70 font-handwritten">{t.emergencySubtitle}</p>
          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
            {t.emergencies.map((contact) => (
              <FancyCard
                key={contact.title}
                title={contact.title}
                description={contact.description}
                icon={<PhoneIcon className="h-8 w-8" />}
                variant="featured"
                meta={[{ label: t.availability, value: contact.available }]}
                cta={{
                  label: `${t.call} ${contact.number}`,
                  href: `tel:${contact.number.replace(/\s/g, '')}`,
                }}
                className="border-[#ED1C24]/40"
              />
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
