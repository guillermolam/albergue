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

/** Local hostel photos under `frontend/public/albergue/`. */
const PHOTO = {
  dorm: '/albergue/dorm01_medio.webp',
  dormHero: '/albergue/636cd43c350fa5b658be904d-file-1703101640529732__msi___jpeg-631w.webp',
  kitchen: '/albergue/kitchen.webp',
  bath1: '/albergue/bathroom_1.webp',
  bath2: '/albergue/bath02.jpg',
  patio1: '/albergue/patio_interior.webp',
  patio2: '/albergue/patio_interior2.webp',
  ac: '/albergue/ac.webp',
} as const;

const FACILITIES: FacilityEntry[] = [
  {
    id: 'accommodation',
    icon: (animate) => <BedIcon className="h-8 w-8" animate={animate} />,
    images: [PHOTO.dorm, PHOTO.dormHero, PHOTO.patio1, PHOTO.patio2],
    es: {
      title: 'Alojamiento',
      description:
        '24 camas en 2 dormitorios mixtos (6 literas cada uno) con taquillas. Ropa de cama incluida.',
      detail:
        'Dos dormitorios mixtos ventilados con 6 literas cada uno (12 camas por sala). Cada cama tiene enchufe y luz de lectura; taquillas junto a las ventanas para mochilas grandes. Patio interior acristalado con plantas.',
      meta: [
        { label: 'Camas', value: '24' },
        { label: 'Dormitorios', value: '2' },
        { label: 'Taquillas', value: 'Sí' },
      ],
    },
    en: {
      title: 'Accommodation',
      description: '24 beds in 2 mixed dorms (6 bunks each) with lockers. Bed linen included.',
      detail:
        'Two ventilated mixed dormitories with 6 bunks each (12 beds per room). Every bed has an outlet and reading light; lockers by the windows fit large backpacks. Glass-enclosed interior patio with plants.',
      meta: [
        { label: 'Beds', value: '24' },
        { label: 'Dorms', value: '2' },
        { label: 'Lockers', value: 'Yes' },
      ],
    },
  },
  {
    id: 'rooms',
    icon: () => <img src="/png/objects/tv.png" alt="" className="h-8 w-8" />,
    // No dedicated room photos yet — omit carousel rather than showing patio/AC assets.
    images: [],
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
    images: [PHOTO.kitchen, PHOTO.patio1],
    es: {
      title: 'Cocina',
      description:
        'Cocina equipada con nevera, microondas, utensilios y especias básicas. Zona de comedor.',
      detail:
        'Cocina compartida abierta de 7:00 a 22:00, con dos fogones, nevera grande, microondas, lavadora/secadora en la misma línea (~4,5 m) y menaje completo. La zona de comedor tiene mesas largas pensadas para compartir la cena entre peregrinos.',
      meta: [{ label: 'Horario', value: '7–22h' }],
    },
    en: {
      title: 'Kitchen',
      description:
        'Equipped kitchen with fridge, microwave, utensils and basic spices. Dining area.',
      detail:
        'Shared kitchen open from 7am to 10pm, with two stovetops, a large fridge, microwave, washer/dryer on the same ~4.5 m run, and full cookware. The dining area has long tables made for sharing dinner with other pilgrims.',
      meta: [{ label: 'Hours', value: '7am–10pm' }],
    },
  },
  {
    id: 'bathrooms',
    icon: (animate) => <ShowerIcon className="h-8 w-8" animate={animate} />,
    images: [PHOTO.bath1, PHOTO.bath2],
    es: {
      title: 'Baños',
      description: '2 baños: 2 duchas, 3 WC y 2 lavabos en cada uno. Agua caliente 24h.',
      detail:
        'Dos baños completos (separados), cada uno con 2 duchas individuales, 3 aseos y 2 lavabos. Agua caliente las 24 horas; jabón y champú ecológicos incluidos.',
      meta: [
        { label: 'Baños', value: '2' },
        { label: 'Duchas', value: '4' },
        { label: 'WC', value: '6' },
        { label: 'Lavabos', value: '4' },
      ],
    },
    en: {
      title: 'Bathrooms',
      description: '2 bathrooms: 2 showers, 3 WCs and 2 sinks each. Hot water 24h.',
      detail:
        'Two full bathrooms, each with 2 individual showers, 3 toilets and 2 sinks. Hot water around the clock; eco-friendly soap and shampoo included.',
      meta: [
        { label: 'Bathrooms', value: '2' },
        { label: 'Showers', value: '4' },
        { label: 'WCs', value: '6' },
        { label: 'Sinks', value: '4' },
      ],
    },
  },
  {
    id: 'laundry',
    icon: (animate) => <WashingMachineIcon className="h-8 w-8" animate={animate} />,
    images: [PHOTO.kitchen],
    es: {
      title: 'Lavandería',
      description: 'Lavadora y secadora (€3 ciclo), tendedero exterior. Detergente incluido.',
      detail:
        'Lavadora y secadora de uso público en la cocina, con detergente incluido en el precio. También hay un tendedero exterior cubierto para quien prefiera secar al aire libre.',
      meta: [
        { label: 'Precio', value: '€3/ciclo' },
        { label: 'Detergente', value: 'Incluido' },
      ],
    },
    en: {
      title: 'Laundry',
      description: 'Washer and dryer (€3/cycle), outdoor clothesline. Detergent included.',
      detail:
        'Public washer and dryer in the kitchen area, with detergent included in the price. There is also a covered outdoor clothesline for anyone who prefers air-drying.',
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
    // Intentionally public, guest-facing WiFi access info (displayed with
    // a QR code on the site itself), not a secret requiring env-var storage.
    wifi: { ssid: 'TP-Link_E3E4', password: '77301925' }, // NOSONAR typescript:S2068
    images: [PHOTO.ac],
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
