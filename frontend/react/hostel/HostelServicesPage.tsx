import { PageHero } from '../shared/PageHero';
import { FancyCard } from '../shared/FancyCard';
import { PhoneIcon, ClipboardIcon } from '../doodle/DoodleIcons';
import { useI18n } from '../hooks/useI18n';

// Paired ES/EN source data -- COPY.es/COPY.en below derive their `rules`/
// `emergencies` arrays from these via .map() rather than repeating the same
// four-item shape twice, which SonarCloud's duplication detector (rightly)
// flags as a near-identical block when written out longhand per locale.
const RULES_DATA = [
  {
    titleES: 'Horarios',
    titleEN: 'Hours',
    descriptionES:
      'Entrada 15:00–22:00 · Salida antes de las 11:00 · Silencio 22:00–07:00 · Cocina cierra a las 21:30.',
    descriptionEN:
      'Check-in 3:00–10:00 PM · Check-out before 11:00 AM · Quiet hours 10:00 PM–7:00 AM · Kitchen closes at 9:30 PM.',
  },
  {
    titleES: 'Convivencia',
    titleEN: 'Shared living',
    descriptionES:
      'Zonas comunes limpias, respeta el descanso de otros peregrinos, no fumar en interiores, mascotas no permitidas.',
    descriptionEN:
      'Keep common areas clean, respect other pilgrims’ rest, no smoking indoors, pets not allowed.',
  },
  {
    titleES: 'Seguridad',
    titleEN: 'Security',
    descriptionES:
      'Taquillas con candado, no dejes objetos de valor a la vista, extintores señalizados en todo el edificio.',
    descriptionEN:
      'Lockers with a padlock, don’t leave valuables in plain sight, fire extinguishers signposted throughout.',
  },
  {
    titleES: 'Servicios incluidos',
    titleEN: 'Included services',
    descriptionES:
      'WiFi gratuito, ropa de cama incluida, uso libre de la cocina, consigna de equipaje disponible.',
    descriptionEN:
      'Free WiFi, linens included, free use of the kitchen, luggage storage available.',
  },
] as const;

const EMERGENCIES_DATA = [
  {
    titleES: 'Emergencias Generales',
    titleEN: 'General Emergency',
    number: '112',
    descriptionES: 'Policía, bomberos y sanidad para cualquier emergencia.',
    descriptionEN: 'Police, fire and medical for any emergency.',
    availableES: '24/7',
    availableEN: '24/7',
  },
  {
    titleES: 'Emergencia Médica',
    titleEN: 'Medical Emergency',
    number: '061',
    descriptionES: 'Ambulancia y asistencia médica urgente.',
    descriptionEN: 'Ambulance and urgent medical assistance.',
    availableES: '24/7',
    availableEN: '24/7',
  },
  {
    titleES: 'Policía Local',
    titleEN: 'Local Police',
    number: '092',
    descriptionES: 'Policía local de Carrascalejo.',
    descriptionEN: 'Carrascalejo local police.',
    availableES: '24/7',
    availableEN: '24/7',
  },
  {
    titleES: 'Centro de Salud',
    titleEN: 'Health Center',
    number: '924 123 456',
    descriptionES: 'Centro de Salud de Carrascalejo, para consultas no urgentes.',
    descriptionEN: 'Carrascalejo Health Center, for non-urgent matters.',
    availableES: 'L–V: 9:00–21:00',
    availableEN: 'Mon–Fri: 9am–9pm',
  },
] as const;

const COPY = {
  es: {
    eyebrow: 'El Albergue',
    title: 'Servicios',
    subtitle: 'Normas de convivencia y contactos de emergencia para tu estancia.',
    rulesHeading: 'Normas del albergue',
    rules: RULES_DATA.map((r) => ({ title: r.titleES, description: r.descriptionES })),
    emergencyHeading: 'Contactos de emergencia',
    emergencySubtitle: 'Disponibles las 24 horas, todos los días.',
    availability: 'Disponibilidad',
    emergencies: EMERGENCIES_DATA.map((e) => ({
      title: e.titleES,
      number: e.number,
      description: e.descriptionES,
      available: e.availableES,
    })),
    call: 'Llamar',
  },
  en: {
    eyebrow: 'The Hotel',
    title: 'Services',
    subtitle: 'House rules and emergency contacts for your stay.',
    rulesHeading: 'House rules',
    rules: RULES_DATA.map((r) => ({ title: r.titleEN, description: r.descriptionEN })),
    emergencyHeading: 'Emergency contacts',
    emergencySubtitle: 'Available 24 hours a day, every day.',
    availability: 'Availability',
    emergencies: EMERGENCIES_DATA.map((e) => ({
      title: e.titleEN,
      number: e.number,
      description: e.descriptionEN,
      available: e.availableEN,
    })),
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
