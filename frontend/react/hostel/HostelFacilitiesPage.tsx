import { useEffect, useRef, useState } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useI18n } from '../hooks/useI18n';
import { PageHero } from '../shared/PageHero';
import { FancyCard } from '../shared/FancyCard';
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

const COPY = {
  es: {
    title: 'Instalaciones',
    subtitle: 'Todo lo que necesitas para descansar y reponer fuerzas',
    accommodation: {
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
    rooms: {
      title: 'Habitaciones',
      description:
        'Terrazas privadas, aire acondicionado y TV de pantalla plana en todas las habitaciones.',
      detail:
        'Habitaciones privadas dobles con baño propio, terraza exterior y climatización individual. Ideales para parejas o quienes prefieren más intimidad tras la etapa.',
      meta: [{ label: 'Habitaciones', value: '4' }],
    },
    kitchen: {
      title: 'Cocina',
      description:
        'Cocina equipada con nevera, microondas, utensilios y especias básicas. Zona de comedor.',
      detail:
        'Cocina compartida abierta de 7:00 a 22:00, con dos fogones, nevera grande, microondas y menaje completo. La zona de comedor tiene mesas largas pensadas para compartir la cena entre peregrinos.',
      meta: [{ label: 'Horario', value: '7–22h' }],
    },
    bathrooms: {
      title: 'Baños',
      description: 'Duchas calientes 24h, secadores de pelo, jabón y champú ecológicos.',
      detail:
        'Baños separados por género con duchas individuales de agua caliente disponible las 24 horas. Jabón y champú ecológico incluidos, además de secadores de pelo en cada zona.',
      meta: [
        { label: 'Duchas', value: '6' },
        { label: 'Agua caliente', value: '24h' },
      ],
    },
    laundry: {
      title: 'Lavandería',
      description: 'Lavadora y secadora (€3 ciclo), tendedero exterior. Detergente incluido.',
      detail:
        'Lavadora y secadora de uso público junto al patio, con detergente incluido en el precio. También hay un tendedero exterior cubierto para quien prefiera secar al aire libre.',
      meta: [
        { label: 'Precio', value: '€3/ciclo' },
        { label: 'Detergente', value: 'Incluido' },
      ],
    },
    wifi: {
      title: 'WiFi y Carga',
      description: 'WiFi gratuito en todas las instalaciones. Puntos de carga USB y enchufes.',
      detail:
        'Cobertura WiFi gratuita en todo el albergue, incluida la zona de descanso exterior. Cada litera cuenta con su propio enchufe y puerto USB para cargar dispositivos sin salir de la cama.',
      meta: [{ label: 'Wifi', value: 'Gratis' }],
    },
    bikes: {
      title: 'Bicicletas',
      description: 'Alquiler de bicicletas €10/día. Incluye casco y candado. Reserva anticipada.',
      detail:
        'Alquiler de bicicletas de trekking en buen estado, con casco y candado incluidos. Recomendamos reservar con un día de antelación para asegurar disponibilidad en temporada alta.',
      meta: [{ label: 'Precio', value: '€10/día' }],
    },
  },
  en: {
    title: 'Facilities',
    subtitle: 'Everything you need to rest and recharge',
    accommodation: {
      title: 'Accommodation',
      description: '24 beds in mixed dormitories with individual lockers. Bed linen included.',
      detail:
        'Ventilated mixed dormitories with wooden bunks, each with its own outlet and reading light. Lockers fit large backpacks and come with a lock; arrive before 8pm to pick your bed.',
      meta: [
        { label: 'Beds', value: '24' },
        { label: 'Lockers', value: '24' },
      ],
    },
    rooms: {
      title: 'Rooms',
      description: 'Private terraces, air conditioning, and flat-screen TV in every room.',
      detail:
        'Private double rooms with their own bathroom, outdoor terrace and individual climate control. Ideal for couples or anyone who wants more privacy after the stage.',
      meta: [{ label: 'Rooms', value: '4' }],
    },
    kitchen: {
      title: 'Kitchen',
      description:
        'Equipped kitchen with fridge, microwave, utensils and basic spices. Dining area.',
      detail:
        'Shared kitchen open from 7am to 10pm, with two stovetops, a large fridge, microwave and full cookware. The dining area has long tables made for sharing dinner with other pilgrims.',
      meta: [{ label: 'Hours', value: '7am–10pm' }],
    },
    bathrooms: {
      title: 'Bathrooms',
      description: '24h hot showers, hair dryers, eco-friendly soap and shampoo.',
      detail:
        'Gender-separated bathrooms with individual showers and hot water available around the clock. Eco-friendly soap and shampoo included, plus hair dryers in every section.',
      meta: [
        { label: 'Showers', value: '6' },
        { label: 'Hot water', value: '24h' },
      ],
    },
    laundry: {
      title: 'Laundry',
      description: 'Washer and dryer (€3/cycle), outdoor clothesline. Detergent included.',
      detail:
        'Public washer and dryer next to the courtyard, with detergent included in the price. There is also a covered outdoor clothesline for anyone who prefers air-drying.',
      meta: [
        { label: 'Price', value: '€3/cycle' },
        { label: 'Detergent', value: 'Included' },
      ],
    },
    wifi: {
      title: 'WiFi & Charging',
      description: 'Free WiFi throughout the hostel. USB charging points and outlets.',
      detail:
        'Free WiFi coverage across the whole hostel, including the outdoor rest area. Every bunk has its own outlet and USB port so you can charge devices without leaving your bed.',
      meta: [{ label: 'WiFi', value: 'Free' }],
    },
    bikes: {
      title: 'Bicycles',
      description: 'Bike rental €10/day. Includes helmet and lock. Advance booking recommended.',
      detail:
        'Well-maintained trekking bikes for rent, helmet and lock included. We recommend booking a day ahead to guarantee availability during high season.',
      meta: [{ label: 'Price', value: '€10/day' }],
    },
  },
};

export function HostelFacilitiesPage() {
  const { locale } = useI18n();
  const isEs = locale !== 'en';
  const t = isEs ? COPY.es : COPY.en;

  const gridRef = useRef<HTMLDivElement>(null);
  const [activeFacility, setActiveFacility] = useState<Facility | null>(null);

  const facilities: Facility[] = [
    { id: 'accommodation', ...t.accommodation, icon: <BedIcon className="h-8 w-8" /> },
    {
      id: 'rooms',
      ...t.rooms,
      icon: <img src="/png/objects/tv.png" alt="" className="h-8 w-8" />,
    },
    { id: 'kitchen', ...t.kitchen, icon: <UtensilsIcon className="h-8 w-8" /> },
    { id: 'bathrooms', ...t.bathrooms, icon: <ShowerIcon className="h-8 w-8" /> },
    { id: 'laundry', ...t.laundry, icon: <WashingMachineIcon className="h-8 w-8" /> },
    { id: 'wifi', ...t.wifi, icon: <WifiIcon className="h-8 w-8" /> },
    { id: 'bikes', ...t.bikes, icon: <BicycleIcon className="h-8 w-8" /> },
  ];

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
      <PageHero title={t.title} subtitle={t.subtitle} />
      <section className="container mx-auto max-w-5xl px-4 py-12">
        <div ref={gridRef} className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {facilities.map((facility) => (
            <FancyCard
              key={facility.id}
              title={facility.title}
              description={facility.description}
              icon={facility.icon}
              meta={facility.meta}
              onClick={() => setActiveFacility(facility)}
            />
          ))}
        </div>
      </section>

      <FacilityDetailModal
        facility={activeFacility}
        open={activeFacility !== null}
        onOpenChange={(open) => {
          if (!open) setActiveFacility(null);
        }}
      />
    </>
  );
}
