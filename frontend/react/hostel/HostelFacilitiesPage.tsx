import { useEffect, useRef, useState, type ReactNode } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useI18n } from '../hooks/useI18n';
import { usePrefersReducedMotion } from '../hooks/usePrefersReducedMotion';
import { PageHero } from '../shared/PageHero';
import { SectionDecor } from '../shared/SectionDecor';
import { FancyCard, type FancyCardMeta } from '../shared/FancyCard';
import { FacilityDetailModal, type Facility } from './FacilityDetailModal';
import {
  BedIcon,
  UtensilsIcon,
  ShowerIcon,
  WashingMachineIcon,
  WifiIcon,
  BicycleIcon,
} from '../doodle/DoodleIcons';

let scrollTriggerRegistered = false;

function ensureScrollTrigger() {
  if (!scrollTriggerRegistered) {
    gsap.registerPlugin(ScrollTrigger);
    scrollTriggerRegistered = true;
  }
}

const PAGE_COPY = {
  es: {
    title: 'Instalaciones',
    subtitle: 'Todo lo que necesitas para descansar y reponer fuerzas',
  },
  en: { title: 'Facilities', subtitle: 'Everything you need to rest and recharge' },
};

interface LocaleCopy {
  title: string;
  description: string;
  detail: string;
  meta: FancyCardMeta[];
}

interface FacilityEntry {
  id: string;
  /** Rendered with the page's current reduced-motion preference. */
  icon: (animate: boolean) => ReactNode;
  /** Real photos from the hostel's own site (scraped from
   * alberguedelcarrascalejo.com) -- not locale-specific. */
  images?: string[];
  /** Real network credentials, wifi facility only. */
  wifi?: { ssid: string; password: string };
  es: LocaleCopy;
  en: LocaleCopy;
}

const CDN = 'https://le-de.cdn-website.com/4e684d9f728943a6941686bc89abe581/dms3rep/multi/opt';

const FACILITIES: FacilityEntry[] = [
  {
    id: 'accommodation',
    icon: (animate) => <BedIcon className="h-8 w-8" animate={animate} />,
    images: [
      `${CDN}/636cd43c350fa5b658be904d-file-1703101640529732__msi___jpeg-1920w.jpeg`,
      `${CDN}/97255325_l13__msi___jpg-862h.jpg`,
    ],
    es: {
      title: 'Alojamiento',
      description:
        '24 camas en dormitorios mixtos con taquillas individuales. Ropa de cama incluida.',
      detail:
        'Dormitorios mixtos ventilados con literas de madera, cada una con enchufe individual y luz de lectura. Las taquillas admiten mochilas grandes y tienen candado incluido; se recomienda llegar antes de las 20:00 para elegir cama.',
      meta: [
        { label: 'Camas', value: '24' },
        { label: 'Taquillas', value: '24' },
      ],
    },
    en: {
      title: 'Accommodation',
      description: '24 beds in mixed dormitories with individual lockers. Bed linen included.',
      detail:
        'Ventilated mixed dormitories with wooden bunks, each with its own outlet and reading light. Lockers fit large backpacks and come with a lock; arrive before 8pm to pick your bed.',
      meta: [
        { label: 'Beds', value: '24' },
        { label: 'Lockers', value: '24' },
      ],
    },
  },
  {
    id: 'rooms',
    icon: () => <img src="/png/objects/tv.png" alt="" className="h-8 w-8" />,
    images: [
      `${CDN}/636cd43c350fa5b658be904d-file-2742254582611335__msi___jpeg-1920w.webp`,
      `${CDN}/81318354_m_normal_none__msi___jpg-1920w.webp`,
      `${CDN}/120366765_m_173__msi___jpg-1920w.webp`,
      `${CDN}/636cd43c350fa5b658be904d-file-590501970153012__msi___jpeg-1920w.webp`,
    ],
    es: {
      title: 'Habitaciones',
      description:
        'Terrazas privadas, aire acondicionado y TV de pantalla plana en todas las habitaciones.',
      detail:
        'Habitaciones privadas dobles con baño propio, terraza exterior y climatización individual. Ideales para parejas o quienes prefieren más intimidad tras la etapa.',
      meta: [{ label: 'Habitaciones', value: '4' }],
    },
    en: {
      title: 'Rooms',
      description: 'Private terraces, air conditioning, and flat-screen TV in every room.',
      detail:
        'Private double rooms with their own bathroom, outdoor terrace and individual climate control. Ideal for couples or anyone who wants more privacy after the stage.',
      meta: [{ label: 'Rooms', value: '4' }],
    },
  },
  {
    id: 'kitchen',
    icon: (animate) => <UtensilsIcon className="h-8 w-8" animate={animate} />,
    images: [`${CDN}/636cd43c350fa5b658be904d-file-526309953533133__msi___jpeg-1920w.webp`],
    es: {
      title: 'Cocina',
      description:
        'Cocina equipada con nevera, microondas, utensilios y especias básicas. Zona de comedor.',
      detail:
        'Cocina compartida abierta de 7:00 a 22:00, con dos fogones, nevera grande, microondas y menaje completo. La zona de comedor tiene mesas largas pensadas para compartir la cena entre peregrinos.',
      meta: [{ label: 'Horario', value: '7–22h' }],
    },
    en: {
      title: 'Kitchen',
      description:
        'Equipped kitchen with fridge, microwave, utensils and basic spices. Dining area.',
      detail:
        'Shared kitchen open from 7am to 10pm, with two stovetops, a large fridge, microwave and full cookware. The dining area has long tables made for sharing dinner with other pilgrims.',
      meta: [{ label: 'Hours', value: '7am–10pm' }],
    },
  },
  {
    id: 'bathrooms',
    icon: (animate) => <ShowerIcon className="h-8 w-8" animate={animate} />,
    images: [
      `${CDN}/636cd43c350fa5b658be904d-file-847572484228159__msi___jpeg-1920w.jpeg`,
      `${CDN}/636cd43c350fa5b658be904d-file-8678956062191851__msi___jpeg-1920w.webp`,
    ],
    es: {
      title: 'Baños',
      description: 'Duchas calientes 24h, secadores de pelo, jabón y champú ecológicos.',
      detail:
        'Baños separados por género con duchas individuales de agua caliente disponible las 24 horas. Jabón y champú ecológico incluidos, además de secadores de pelo en cada zona.',
      meta: [
        { label: 'Duchas', value: '6' },
        { label: 'Agua caliente', value: '24h' },
      ],
    },
    en: {
      title: 'Bathrooms',
      description: '24h hot showers, hair dryers, eco-friendly soap and shampoo.',
      detail:
        'Gender-separated bathrooms with individual showers and hot water available around the clock. Eco-friendly soap and shampoo included, plus hair dryers in every section.',
      meta: [
        { label: 'Showers', value: '6' },
        { label: 'Hot water', value: '24h' },
      ],
    },
  },
  {
    id: 'laundry',
    icon: (animate) => <WashingMachineIcon className="h-8 w-8" animate={animate} />,
    images: [`${CDN}/636cd43c350fa5b658be904d-file-526309953533133__msi___jpeg-1920w.webp`],
    es: {
      title: 'Lavandería',
      description: 'Lavadora y secadora (€3 ciclo), tendedero exterior. Detergente incluido.',
      detail:
        'Lavadora y secadora de uso público junto al patio, con detergente incluido en el precio. También hay un tendedero exterior cubierto para quien prefiera secar al aire libre.',
      meta: [
        { label: 'Precio', value: '€3/ciclo' },
        { label: 'Detergente', value: 'Incluido' },
      ],
    },
    en: {
      title: 'Laundry',
      description: 'Washer and dryer (€3/cycle), outdoor clothesline. Detergent included.',
      detail:
        'Public washer and dryer next to the courtyard, with detergent included in the price. There is also a covered outdoor clothesline for anyone who prefers air-drying.',
      meta: [
        { label: 'Price', value: '€3/cycle' },
        { label: 'Detergent', value: 'Included' },
      ],
    },
  },
  {
    id: 'wifi',
    icon: (animate) => <WifiIcon className="h-8 w-8" animate={animate} />,
    // Real router credentials (TP-Link TL-MR6400, front-desk WiFi sign
    // matches the router label's default password) -- not fabricated.
    wifi: { ssid: 'TP-Link_E3E4', password: '77301925' },
    es: {
      title: 'WiFi y Carga',
      description: 'WiFi gratuito en todas las instalaciones. Puntos de carga USB y enchufes.',
      detail:
        'Cobertura WiFi gratuita en todo el albergue, incluida la zona de descanso exterior. Cada litera cuenta con su propio enchufe y puerto USB para cargar dispositivos sin salir de la cama.',
      meta: [{ label: 'Wifi', value: 'Gratis' }],
    },
    en: {
      title: 'WiFi & Charging',
      description: 'Free WiFi throughout the hostel. USB charging points and outlets.',
      detail:
        'Free WiFi coverage across the whole hostel, including the outdoor rest area. Every bunk has its own outlet and USB port so you can charge devices without leaving your bed.',
      meta: [{ label: 'WiFi', value: 'Free' }],
    },
  },
  {
    id: 'bikes',
    icon: (animate) => <BicycleIcon className="h-8 w-8" animate={animate} />,
    images: [`${CDN}/126045617_l__msi___jpg-1920w.png`],
    es: {
      title: 'Bicicletas',
      description: 'Alquiler de bicicletas €10/día. Incluye casco y candado. Reserva anticipada.',
      detail:
        'Alquiler de bicicletas de trekking en buen estado, con casco y candado incluidos. Recomendamos reservar con un día de antelación para asegurar disponibilidad en temporada alta.',
      meta: [{ label: 'Precio', value: '€10/día' }],
    },
    en: {
      title: 'Bicycles',
      description: 'Bike rental €10/day. Includes helmet and lock. Advance booking recommended.',
      detail:
        'Well-maintained trekking bikes for rent, helmet and lock included. We recommend booking a day ahead to guarantee availability during high season.',
      meta: [{ label: 'Price', value: '€10/day' }],
    },
  },
];

export function HostelFacilitiesPage() {
  const { locale } = useI18n();
  const isEs = locale !== 'en';
  const page = isEs ? PAGE_COPY.es : PAGE_COPY.en;
  const animateIcons = !usePrefersReducedMotion();

  const gridRef = useRef<HTMLDivElement>(null);
  const [activeFacilityId, setActiveFacilityId] = useState<string | null>(null);

  const facilities: Facility[] = FACILITIES.map(({ id, icon, images, wifi, es, en }) => ({
    id,
    icon: icon(animateIcons),
    images,
    wifi,
    ...(isEs ? es : en),
  }));

  // Re-derived from the current locale on every render (instead of storing
  // the localized Facility snapshot itself), so a modal left open through a
  // language switch shows the new locale's copy rather than a stale one.
  const activeFacility = facilities.find((facility) => facility.id === activeFacilityId) ?? null;

  useEffect(() => {
    ensureScrollTrigger();
    if (!gridRef.current) return;

    const ctx = gsap.context(() => {
      gsap.from(gsap.utils.toArray(gridRef.current!.children), {
        y: 30,
        opacity: 0,
        stagger: 0.1,
        duration: 0.6,
        ease: 'power2.out',
        scrollTrigger: {
          trigger: gridRef.current,
          start: 'top 80%',
        },
      });
    }, gridRef);

    return () => ctx.revert();
  }, []);

  return (
    <>
      <PageHero title={page.title} subtitle={page.subtitle} decor="works" />
      <section className="relative isolate container mx-auto max-w-5xl px-4 py-12">
        <SectionDecor preset="maintenance" />
        <div ref={gridRef} className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {facilities.map((facility) => (
            <FancyCard
              key={facility.id}
              title={facility.title}
              description={facility.description}
              icon={facility.icon}
              meta={facility.meta}
              onClick={() => setActiveFacilityId(facility.id)}
            />
          ))}
        </div>
      </section>

      <FacilityDetailModal
        facility={activeFacility}
        open={activeFacility !== null}
        onOpenChange={(open) => {
          if (!open) setActiveFacilityId(null);
        }}
      />
    </>
  );
}
