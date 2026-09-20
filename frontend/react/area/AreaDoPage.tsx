import { useI18n } from '../hooks/useI18n';
import { PageHero } from '../shared/PageHero';
import { MapPinIcon, UtensilsIcon, SparkleIcon, MonumentIcon } from '../doodle/DoodleIcons';

const COPY = {
  es: {
    eyebrow: 'La Zona',
    title: 'Qué Hacer',
    subtitle: 'Todo lo que necesitas saber sobre Carrascalejo y sus alrededores.',
    sections: [
      {
        icon: MapPinIcon,
        title: 'Cómo Moverse',
        content:
          'Carrascalejo es una localidad pequeña y perfecta para recorrer a pie. El albergue está céntrico, con la mayoría de servicios a 5-10 minutos andando. Para distancias más largas hay autobuses locales, y la recepción puede ayudarte a organizar un taxi.',
      },
      {
        icon: UtensilsIcon,
        title: 'Gastronomía Local',
        content:
          'Extremadura es famosa por sus productos de cerdo ibérico, especialmente el jamón y el chorizo. No te pierdas los quesos locales, sobre todo la Torta del Casar. Entre los platos tradicionales están las migas extremeñas, la caldereta de cordero y el gazpacho extremeño.',
      },
      {
        icon: SparkleIcon,
        title: 'Compras y Mercados',
        content:
          'El mercado semanal se celebra todos los sábados por la mañana en la Plaza Mayor, con productos frescos, artesanía local y productos típicos. Varias tiendas del pueblo venden suministros para peregrinos y recuerdos. Hay bancos y cajeros en el centro.',
      },
      {
        icon: MonumentIcon,
        title: 'Lugares de Interés',
        content:
          'Visita la Iglesia de San Pedro, del siglo XVI, con su retablo barroco. El casco antiguo conserva la arquitectura tradicional extremeña, con casas encaladas y detalles en piedra. El cercano puente romano ofrece un vistazo a la larga historia de la región.',
      },
    ],
  },
  en: {
    eyebrow: 'The Area',
    title: 'What to Do',
    subtitle: 'Everything you need to know about Carrascalejo and the surrounding area.',
    sections: [
      {
        icon: MapPinIcon,
        title: 'Getting Around',
        content:
          'Carrascalejo is a small, walkable town perfect for exploring on foot. The hostel is centrally located, with most amenities within a 5-10 minute walk. For longer distances, local bus services are available, and reception can help arrange a taxi.',
      },
      {
        icon: UtensilsIcon,
        title: 'Local Cuisine',
        content:
          'Extremadura is famous for its Iberian pork products, especially jamón and chorizo. Don’t miss the local cheeses, particularly Torta del Casar. Traditional dishes include migas extremeñas, caldereta de cordero, and gazpacho extremeño.',
      },
      {
        icon: SparkleIcon,
        title: 'Shopping & Markets',
        content:
          'The weekly market takes place every Saturday morning in the Plaza Mayor, with fresh produce, local crafts, and artisan products. Several shops in town sell pilgrim supplies and souvenirs. Banks and ATMs are available in the town center.',
      },
      {
        icon: MonumentIcon,
        title: 'Cultural Sites',
        content:
          "Visit the Church of San Pedro, dating back to the 16th century, with its baroque altarpiece. The old town features traditional Extremadura architecture with whitewashed houses and stone details. The nearby Roman bridge offers a glimpse into the region's long history.",
      },
    ],
  },
} as const;

export function AreaDoPage() {
  const { locale } = useI18n();
  const isEs = locale !== 'en';
  const t = isEs ? COPY.es : COPY.en;

  return (
    <>
      <PageHero eyebrow={t.eyebrow} title={t.title} subtitle={t.subtitle} />
      <section className="container mx-auto max-w-3xl px-4 py-12">
        <div className="space-y-3">
          {t.sections.map((section) => {
            const Icon = section.icon;
            return (
              <details
                key={section.title}
                className="group rounded-xl border-2 border-[#5D4E37]/30 bg-[#FFFFFF] paper-texture doodle-shadow"
              >
                <summary className="flex cursor-pointer list-none items-center gap-3 px-5 py-4 font-semibold text-[#5D4E37]">
                  <Icon className="h-6 w-6 shrink-0 text-[#00AB39]" />
                  <span className="flex-1 font-sketch">{section.title}</span>
                  <span
                    aria-hidden="true"
                    className="text-[#00AB39] transition-transform group-open:rotate-180"
                  >
                    ▼
                  </span>
                </summary>
                <div className="px-5 pb-5 text-sm text-[#5D4E37]/80 font-handwritten">
                  {section.content}
                </div>
              </details>
            );
          })}
        </div>
      </section>
    </>
  );
}
