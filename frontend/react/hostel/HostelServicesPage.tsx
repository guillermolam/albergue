import { PageHero } from '../shared/PageHero';
import { FancyCard } from '../shared/FancyCard';
import { PhoneIcon, ClipboardIcon } from '../doodle/DoodleIcons';
import { useI18n } from '../hooks/useI18n';

export interface HostelServiceItem {
  id: number;
  titleEs: string;
  titleEn: string;
  descriptionEs: string | null;
  descriptionEn: string | null;
  price: string | null;
  currency: string | null;
  iconName: string | null;
}

interface HostelServicesPageProps {
  services: HostelServiceItem[];
}

const COPY = {
  es: {
    eyebrow: 'El Albergue',
    title: 'Servicios',
    subtitle: 'Normas de convivencia y contactos de emergencia para tu estancia.',
    rulesHeading: 'Normas del albergue',
    emergencyHeading: 'Contactos de emergencia',
    emergencySubtitle: 'Disponibles las 24 horas, todos los días.',
  },
  en: {
    eyebrow: 'The Hotel',
    title: 'Services',
    subtitle: 'House rules and emergency contacts for your stay.',
    rulesHeading: 'House rules',
    emergencyHeading: 'Emergency contacts',
    emergencySubtitle: 'Available 24 hours a day, every day.',
  },
} as const;

export function HostelServicesPage({ services }: Readonly<HostelServicesPageProps>) {
  const { locale } = useI18n();
  const isEs = locale !== 'en';
  const t = isEs ? COPY.es : COPY.en;

  // Emergency contacts were seeded with icon_name 'phone'; everything else
  // is a house rule / included service.
  const rules = services.filter((s) => s.iconName !== 'phone');
  const emergencies = services.filter((s) => s.iconName === 'phone');

  return (
    <>
      <PageHero eyebrow={t.eyebrow} title={t.title} subtitle={t.subtitle} />

      <section className="container mx-auto max-w-5xl px-4 py-12">
        <h2 className="mb-6 text-2xl font-bold text-[#5D4E37] font-sketch">{t.rulesHeading}</h2>
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
          {rules.map((service) => (
            <FancyCard
              key={service.id}
              title={isEs ? service.titleEs : service.titleEn}
              description={(isEs ? service.descriptionEs : service.descriptionEn) ?? ''}
              icon={<ClipboardIcon className="h-8 w-8" />}
            />
          ))}
        </div>
      </section>

      {emergencies.length > 0 && (
        <section className="bg-[#FFF5F5] py-12">
          <div className="container mx-auto max-w-5xl px-4">
            <h2 className="mb-1 text-2xl font-bold text-[#ED1C24] font-sketch">
              {t.emergencyHeading}
            </h2>
            <p className="mb-6 text-sm text-[#5D4E37]/70 font-handwritten">{t.emergencySubtitle}</p>
            <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
              {emergencies.map((service) => (
                <FancyCard
                  key={service.id}
                  title={isEs ? service.titleEs : service.titleEn}
                  description={(isEs ? service.descriptionEs : service.descriptionEn) ?? ''}
                  icon={<PhoneIcon className="h-8 w-8" />}
                  variant="featured"
                  borderColor="#ED1C24"
                />
              ))}
            </div>
          </div>
        </section>
      )}
    </>
  );
}
