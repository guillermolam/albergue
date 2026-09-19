import { useEffect, useRef, type ReactNode } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useI18n } from '../hooks/useI18n';
import { PageHero } from '../shared/PageHero';
import { FancyCard } from '../shared/FancyCard';
import { BedIcon, UtensilsIcon } from '../doodle/DoodleIcons';

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
    },
    kitchen: {
      title: 'Cocina',
      description:
        'Cocina equipada con nevera, microondas, utensilios y especias básicas. Zona de comedor.',
    },
    bathrooms: {
      title: 'Baños',
      description: 'Duchas calientes 24h, secadores de pelo, jabón y champú ecológicos.',
    },
    laundry: {
      title: 'Lavandería',
      description: 'Lavadora y secadora (€3 ciclo), tendedero exterior. Detergente incluido.',
    },
    wifi: {
      title: 'WiFi y Carga',
      description: 'WiFi gratuito en todas las instalaciones. Puntos de carga USB y enchufes.',
    },
    bikes: {
      title: 'Bicicletas',
      description: 'Alquiler de bicicletas €10/día. Incluye casco y candado. Reserva anticipada.',
    },
  },
  en: {
    title: 'Facilities',
    subtitle: 'Everything you need to rest and recharge',
    accommodation: {
      title: 'Accommodation',
      description: '24 beds in mixed dormitories with individual lockers. Bed linen included.',
    },
    kitchen: {
      title: 'Kitchen',
      description:
        'Equipped kitchen with fridge, microwave, utensils and basic spices. Dining area.',
    },
    bathrooms: {
      title: 'Bathrooms',
      description: '24h hot showers, hair dryers, eco-friendly soap and shampoo.',
    },
    laundry: {
      title: 'Laundry',
      description: 'Washer and dryer (€3/cycle), outdoor clothesline. Detergent included.',
    },
    wifi: {
      title: 'WiFi & Charging',
      description: 'Free WiFi throughout the hostel. USB charging points and outlets.',
    },
    bikes: {
      title: 'Bicycles',
      description: 'Bike rental €10/day. Includes helmet and lock. Advance booking recommended.',
    },
  },
} as const;

export function HostelFacilitiesPage() {
  const { locale } = useI18n();
  const isEs = locale !== 'en';
  const t = isEs ? COPY.es : COPY.en;

  const gridRef = useRef<HTMLDivElement>(null);

  const facilities: { title: string; description: string; icon?: ReactNode }[] = [
    { ...t.accommodation, icon: <BedIcon className="h-8 w-8" /> },
    { ...t.kitchen, icon: <UtensilsIcon className="h-8 w-8" /> },
    { ...t.bathrooms },
    { ...t.laundry },
    { ...t.wifi },
    { ...t.bikes },
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
              key={facility.title}
              title={facility.title}
              description={facility.description}
              icon={facility.icon}
            />
          ))}
        </div>
      </section>
    </>
  );
}
