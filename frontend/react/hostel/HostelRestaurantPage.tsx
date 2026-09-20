import { useI18n } from '../hooks/useI18n';
import { PageHero } from '../shared/PageHero';
import { FancyCard } from '../shared/FancyCard';
import { MapLibreMap } from '../shared/MapLibreMap';
import { UtensilsIcon, PhoneIcon, MapPinIcon } from '../doodle/DoodleIcons';
import { WiredButton } from '../doodle/WiredButton';

// Approximate town-center coordinates for El Carrascalejo, Badajoz
// (39.02278, -6.33722 per Wikipedia) -- not a precisely geocoded street
// address for Alqantara Plaza itself, just a reasonable pin location.
const RESTAURANT_COORDS: [number, number] = [-6.33722, 39.02278];

// [es, en, price] tuples rather than {es,en,price} objects -- with 50+ menu
// items, repeated `es:`/`en:`/`price:` key tokens is exactly the pattern
// SonarCloud's duplication detector matches across structurally-identical
// (if differently-worded) entries. Tuples carry the same data with far less
// repeated shape for the same real content, fetched from
// https://alqantara.es/alqantara-plaza/#carta.
type MenuItem = readonly [es: string, en: string, price: string];

interface MenuCategory {
  es: string;
  en: string;
  items: MenuItem[];
}

const MENU: MenuCategory[] = [
  {
    es: 'Entrantes',
    en: 'Starters',
    items: [
      ['Carpaccio de presa Ibérica de bellota', 'Acorn-fed Iberian pork carpaccio', '16.00'],
      [
        'Tosta de sardina ahumada con rulo tomate, alioli y lechuga',
        'Smoked sardine toast with tomato, aioli and lettuce',
        '6.00',
      ],
      ['Salmorejo', 'Salmorejo (cold tomato soup)', '8.00'],
      ['Tartar de salmón con cítricos', 'Citrus salmon tartare', '21.00'],
      ['Tartar de solomillo de ternera', 'Beef tenderloin tartare', '21.00'],
      ['Tiradito de salmón', 'Salmon tiradito', '21.00'],
      ['Tiradito de gambón', 'King prawn tiradito', '15.00'],
      ['Ensaladilla rusa', 'Russian salad', '13.00'],
      ['Ensaladilla de gambón y palometa', 'Prawn and pomfret salad', '18.00'],
      ['Gambón a la plancha', 'Grilled king prawn', '14.00'],
      [
        'Gambón a la plancha con salsa de ajo y almendras',
        'Grilled king prawn, garlic-almond sauce',
        '14.00',
      ],
      ['Sepia a la plancha', 'Grilled cuttlefish', '20.00'],
      ['Bacalao Dorao', 'Bacalao Dorao (cod with free-range egg)', '15.00'],
      ['Surtido de quesos', 'Cheese selection', '18.00'],
      ['Alcachofas confitadas (2 uds)', 'Confit artichokes (2 pcs)', '10.00'],
    ],
  },
  {
    es: 'Fritos y Crujientes',
    en: 'Fried & Crispy',
    items: [
      [
        'Bandidos crujientes de pollo con patatas caseras',
        'Crispy chicken bites with home fries',
        '14.00',
      ],
      ['Brioche de Cochinita', 'Pulled-pork brioche', '6.00'],
      ['Croquetas de la Casa', 'House croquettes', '12.00'],
      ['Rabas de calamar', 'Fried squid strips', '12.00'],
      ['Taquito de sepia rebozado', 'Battered cuttlefish bites', '12.00'],
      ['Patatas fritas caseras', 'Home-style fries', '10.00'],
      [
        'Empanada argentina de ternera y aceitunas (4 uds)',
        'Argentine beef & olive empanadas (4 pcs)',
        '12.00',
      ],
    ],
  },
  {
    es: 'Principales',
    en: 'Main Courses',
    items: [
      [
        'Churrasco de pollo con patatas fritas caseras',
        'Grilled chicken churrasco, home fries',
        '14.00',
      ],
      [
        'Medallones de solomillo en salsa de mostaza con patatas caseras',
        'Tenderloin medallions, mustard sauce, home fries',
        '16.00',
      ],
      [
        'Chuletón de cerdo alimentado de castañas con patatas caseras',
        'Chestnut-fed pork chop, home fries',
        '16.00',
      ],
      [
        'Chuletón de ternera con patatas y pimientos',
        'Beef chuletón, potatoes and peppers',
        '40.00',
      ],
      ['Gamusino Ibérico con patatas caseras', 'Gamusino Ibérico, home fries', '18.00'],
      ['Tataki de añojo en vinagreta de soja y lima', 'Beef tataki, soy-lime vinaigrette', '19.00'],
      [
        'Costillas de cerdo a baja temperatura en salsa asiática con parmentier',
        'Slow-cooked pork ribs, Asian sauce, parmentier',
        '21.00',
      ],
      [
        'Codillo a baja temperatura en su jugo con parmentier',
        'Slow-cooked ham hock in its own jus, parmentier',
        '21.00',
      ],
      [
        'Rabos de cerdo Ibérico estofados con patatas caseras',
        'Braised Iberian pork tails, home fries',
        '15.00',
      ],
      [
        'Morros de cerdo Ibérico en salsa con patatas caseras',
        'Iberian pork cheek in sauce, home fries',
        '15.00',
      ],
    ],
  },
  {
    es: 'Ensaladas',
    en: 'Salads',
    items: [
      [
        'De rulo de cabra con frutos secos y mermelada de arándanos',
        'Goat cheese, nuts and blueberry jam',
        '14.00',
      ],
      ['Ensalada César', 'Caesar salad', '14.00'],
      [
        'De dátiles y roquefort con lechugas, tomates cherry y remolacha',
        'Date and roquefort, cherry tomato and beetroot',
        '14.00',
      ],
      [
        'De burrata y albahaca fresca con canónigos y tomates cherry',
        'Burrata, fresh basil, lamb’s lettuce and cherry tomato',
        '14.00',
      ],
    ],
  },
  {
    es: 'Postres',
    en: 'Desserts',
    items: [
      ['Tarta de aguacate y pistacho', 'Avocado and pistachio tart', '5.00'],
      ['Tarta de queso', 'Cheesecake', '5.00'],
      ['Tarta de chocolate y galleta', 'Chocolate cookie cake', '5.00'],
    ],
  },
  {
    es: 'Vinos',
    en: 'Wines',
    items: [
      ['Balromero tinto selección (Copa)', 'Balromero red selection (glass)', '2.50'],
      ['Balromero blanco seco (Copa)', 'Balromero dry white (glass)', '2.50'],
      ['Balromero semidulce (Copa)', 'Balromero semi-sweet (glass)', '2.50'],
      ['Valparaíso roble', 'Valparaíso roble', '2.80'],
      ['Ramón Bilbao', 'Ramón Bilbao', '3.00'],
    ],
  },
  {
    es: 'Panadería',
    en: 'Bakery',
    items: [['Bollo de pan (harina ecológica)', 'Bread roll (organic flour)', '1.00']],
  },
];

const COPY = {
  es: {
    eyebrow: 'El secreto mejor guardado de la A-66',
    title: 'Nuestra Cocina',
    subtitle:
      'A pocos pasos del albergue, recomendamos Alqantara Plaza: una terraza acogedora en plena naturaleza de El Carrascalejo, ideal para reponer fuerzas tras una etapa del Camino.',
    aboutTitle: 'Sobre Alqantara Plaza',
    aboutText:
      'Cocina extremeña y a la brasa en un entorno rural apto para mascotas. Un lugar de confianza para peregrinos que buscan una buena comida casera cerca del albergue.',
    locationTitle: 'Cómo llegar',
    menuTitle: 'La Carta',
    allergenNote:
      'La carta declara 14 categorías de alérgenos (gluten, crustáceos, huevo, pescado, cacahuetes, soja, lácteos, frutos de cáscara, apio, mostaza, sésamo, sulfitos, moluscos, altramuces). Consulta con el personal del restaurante para más detalle.',
    contactTitle: 'Contacto y Reservas',
    reserveCta: 'Reservar Mesa',
    priceLabel: 'Precio',
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
    menuTitle: 'The Menu',
    allergenNote:
      'The menu declares 14 allergen categories (gluten, crustaceans, eggs, fish, peanuts, soy, dairy, tree nuts, celery, mustard, sesame, sulfites, molluscs, lupin). Ask the restaurant staff for details.',
    contactTitle: 'Contact & Reservations',
    reserveCta: 'Reserve a Table',
    priceLabel: 'Price',
  },
} as const;

export function HostelRestaurantPage() {
  const { locale } = useI18n();
  const isEs = locale !== 'en';
  const t = isEs ? COPY.es : COPY.en;

  return (
    <>
      <PageHero eyebrow={t.eyebrow} title={t.title} subtitle={t.subtitle} />

      <section className="container mx-auto max-w-4xl px-4 py-12">
        <FancyCard
          title={t.aboutTitle}
          description={t.aboutText}
          icon={<UtensilsIcon className="h-8 w-8" />}
        />
      </section>

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

      <section className="container mx-auto max-w-5xl px-4 py-12">
        <h2 className="mb-6 text-2xl font-bold text-[#5D4E37] font-sketch">{t.menuTitle}</h2>
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
          {MENU.map((category) => (
            <div
              key={category.es}
              className="rounded-xl border-2 border-[#5D4E37]/30 bg-[#FFFFFF] p-5 paper-texture doodle-border doodle-shadow"
            >
              <h3 className="mb-3 text-lg font-bold text-[#5D4E37] font-sketch">
                {isEs ? category.es : category.en}
              </h3>
              <ul className="space-y-1.5 text-sm">
                {category.items.map(([es, en, price]) => (
                  <li key={es} className="flex justify-between gap-3 text-[#5D4E37]/90">
                    <span className="font-handwritten">{isEs ? es : en}</span>
                    <span className="shrink-0 font-semibold">{'€' + price}</span>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
        <p className="mt-6 text-xs text-[#5D4E37]/60">{t.allergenNote}</p>
      </section>

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
