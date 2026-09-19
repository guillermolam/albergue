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

interface MenuItem {
  es: string;
  en: string;
  price: string;
}

interface MenuCategory {
  es: string;
  en: string;
  items: MenuItem[];
}

// Real menu data fetched from https://alqantara.es/alqantara-plaza/#carta
const MENU: MenuCategory[] = [
  {
    es: 'Entrantes',
    en: 'Starters',
    items: [
      {
        es: 'Carpaccio de presa Ibérica de bellota',
        en: 'Acorn-fed Iberian pork carpaccio',
        price: '16.00',
      },
      {
        es: 'Tosta de sardina ahumada con rulo tomate, alioli y lechuga',
        en: 'Smoked sardine toast with tomato, aioli and lettuce',
        price: '6.00',
      },
      { es: 'Salmorejo', en: 'Salmorejo (cold tomato soup)', price: '8.00' },
      { es: 'Tartar de salmón con cítricos', en: 'Citrus salmon tartare', price: '21.00' },
      { es: 'Tartar de solomillo de ternera', en: 'Beef tenderloin tartare', price: '21.00' },
      { es: 'Tiradito de salmón', en: 'Salmon tiradito', price: '21.00' },
      { es: 'Tiradito de gambón', en: 'King prawn tiradito', price: '15.00' },
      { es: 'Ensaladilla rusa', en: 'Russian salad', price: '13.00' },
      { es: 'Ensaladilla de gambón y palometa', en: 'Prawn and pomfret salad', price: '18.00' },
      { es: 'Gambón a la plancha', en: 'Grilled king prawn', price: '14.00' },
      {
        es: 'Gambón a la plancha con salsa de ajo y almendras',
        en: 'Grilled king prawn, garlic-almond sauce',
        price: '14.00',
      },
      { es: 'Sepia a la plancha', en: 'Grilled cuttlefish', price: '20.00' },
      { es: 'Bacalao Dorao', en: 'Bacalao Dorao (cod with free-range egg)', price: '15.00' },
      { es: 'Surtido de quesos', en: 'Cheese selection', price: '18.00' },
      { es: 'Alcachofas confitadas (2 uds)', en: 'Confit artichokes (2 pcs)', price: '10.00' },
    ],
  },
  {
    es: 'Fritos y Crujientes',
    en: 'Fried & Crispy',
    items: [
      {
        es: 'Bandidos crujientes de pollo con patatas caseras',
        en: 'Crispy chicken bites with home fries',
        price: '14.00',
      },
      { es: 'Brioche de Cochinita', en: 'Pulled-pork brioche', price: '6.00' },
      { es: 'Croquetas de la Casa', en: 'House croquettes', price: '12.00' },
      { es: 'Rabas de calamar', en: 'Fried squid strips', price: '12.00' },
      { es: 'Taquito de sepia rebozado', en: 'Battered cuttlefish bites', price: '12.00' },
      { es: 'Patatas fritas caseras', en: 'Home-style fries', price: '10.00' },
      {
        es: 'Empanada argentina de ternera y aceitunas (4 uds)',
        en: 'Argentine beef & olive empanadas (4 pcs)',
        price: '12.00',
      },
    ],
  },
  {
    es: 'Principales',
    en: 'Main Courses',
    items: [
      {
        es: 'Churrasco de pollo con patatas fritas caseras',
        en: 'Grilled chicken churrasco, home fries',
        price: '14.00',
      },
      {
        es: 'Medallones de solomillo en salsa de mostaza con patatas caseras',
        en: 'Tenderloin medallions, mustard sauce, home fries',
        price: '16.00',
      },
      {
        es: 'Chuletón de cerdo alimentado de castañas con patatas caseras',
        en: 'Chestnut-fed pork chop, home fries',
        price: '16.00',
      },
      {
        es: 'Chuletón de ternera con patatas y pimientos',
        en: 'Beef chuletón, potatoes and peppers',
        price: '40.00',
      },
      {
        es: 'Gamusino Ibérico con patatas caseras',
        en: 'Gamusino Ibérico, home fries',
        price: '18.00',
      },
      {
        es: 'Tataki de añojo en vinagreta de soja y lima',
        en: 'Beef tataki, soy-lime vinaigrette',
        price: '19.00',
      },
      {
        es: 'Costillas de cerdo a baja temperatura en salsa asiática con parmentier',
        en: 'Slow-cooked pork ribs, Asian sauce, parmentier',
        price: '21.00',
      },
      {
        es: 'Codillo a baja temperatura en su jugo con parmentier',
        en: 'Slow-cooked ham hock in its own jus, parmentier',
        price: '21.00',
      },
      {
        es: 'Rabos de cerdo Ibérico estofados con patatas caseras',
        en: 'Braised Iberian pork tails, home fries',
        price: '15.00',
      },
      {
        es: 'Morros de cerdo Ibérico en salsa con patatas caseras',
        en: 'Iberian pork cheek in sauce, home fries',
        price: '15.00',
      },
    ],
  },
  {
    es: 'Ensaladas',
    en: 'Salads',
    items: [
      {
        es: 'De rulo de cabra con frutos secos y mermelada de arándanos',
        en: 'Goat cheese, nuts and blueberry jam',
        price: '14.00',
      },
      { es: 'Ensalada César', en: 'Caesar salad', price: '14.00' },
      {
        es: 'De dátiles y roquefort con lechugas, tomates cherry y remolacha',
        en: 'Date and roquefort, cherry tomato and beetroot',
        price: '14.00',
      },
      {
        es: 'De burrata y albahaca fresca con canónigos y tomates cherry',
        en: 'Burrata, fresh basil, lamb’s lettuce and cherry tomato',
        price: '14.00',
      },
    ],
  },
  {
    es: 'Postres',
    en: 'Desserts',
    items: [
      { es: 'Tarta de aguacate y pistacho', en: 'Avocado and pistachio tart', price: '5.00' },
      { es: 'Tarta de queso', en: 'Cheesecake', price: '5.00' },
      { es: 'Tarta de chocolate y galleta', en: 'Chocolate cookie cake', price: '5.00' },
    ],
  },
  {
    es: 'Vinos',
    en: 'Wines',
    items: [
      {
        es: 'Balromero tinto selección (Copa)',
        en: 'Balromero red selection (glass)',
        price: '2.50',
      },
      { es: 'Balromero blanco seco (Copa)', en: 'Balromero dry white (glass)', price: '2.50' },
      { es: 'Balromero semidulce (Copa)', en: 'Balromero semi-sweet (glass)', price: '2.50' },
      { es: 'Valparaíso roble', en: 'Valparaíso roble', price: '2.80' },
      { es: 'Ramón Bilbao', en: 'Ramón Bilbao', price: '3.00' },
    ],
  },
  {
    es: 'Panadería',
    en: 'Bakery',
    items: [
      { es: 'Bollo de pan (harina ecológica)', en: 'Bread roll (organic flour)', price: '1.00' },
    ],
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
    <main>
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
              className="rounded-xl border-2 border-[#5D4E37]/30 bg-[#FFF9F0] p-5 paper-texture doodle-border doodle-shadow"
            >
              <h3 className="mb-3 text-lg font-bold text-[#5D4E37] font-sketch">
                {isEs ? category.es : category.en}
              </h3>
              <ul className="space-y-1.5 text-sm">
                {category.items.map((item) => (
                  <li key={item.es} className="flex justify-between gap-3 text-[#5D4E37]/90">
                    <span className="font-handwritten">{isEs ? item.es : item.en}</span>
                    <span className="shrink-0 font-semibold">{'€' + item.price}</span>
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
    </main>
  );
}
