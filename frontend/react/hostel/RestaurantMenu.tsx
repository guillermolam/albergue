import { useState, useRef, type ReactNode } from 'react';
import { motion } from 'motion/react';
import { useI18n } from '../hooks/useI18n';
import { SectionDecor } from '../shared/SectionDecor';
import {
  ChevronDownIcon,
  UtensilsIcon,
  WineIcon,
  BreadIcon,
  SparklesIcon,
} from '../doodle/DoodleIcons';

type MenuItem = readonly [es: string, en: string, price: string];

interface MenuCategory {
  id: string;
  es: string;
  en: string;
  icon: ReactNode;
  items: MenuItem[];
}

const MENU_CATEGORIES: MenuCategory[] = [
  {
    id: 'entrantes',
    es: 'Entrantes',
    en: 'Starters',
    icon: <UtensilsIcon className="h-5 w-5" />,
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
    id: 'fritos',
    es: 'Fritos y Crujientes',
    en: 'Fried & Crispy',
    icon: <SparklesIcon className="h-5 w-5" animate={false} />,
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
    id: 'principales',
    es: 'Principales',
    en: 'Main Courses',
    icon: <UtensilsIcon className="h-5 w-5" />,
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
    id: 'ensaladas',
    es: 'Ensaladas',
    en: 'Salads',
    icon: <SparklesIcon className="h-5 w-5" animate={false} />,
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
        "Burrata, fresh basil, lamb's lettuce and cherry tomato",
        '14.00',
      ],
    ],
  },
  {
    id: 'postres',
    es: 'Postres',
    en: 'Desserts',
    icon: <SparklesIcon className="h-5 w-5" animate={false} />,
    items: [
      ['Tarta de aguacate y pistacho', 'Avocado and pistachio tart', '5.00'],
      ['Tarta de queso', 'Cheesecake', '5.00'],
      ['Tarta de chocolate y galleta', 'Chocolate cookie cake', '5.00'],
    ],
  },
  {
    id: 'vinos',
    es: 'Vinos',
    en: 'Wines',
    icon: <WineIcon className="h-5 w-5" />,
    items: [
      ['Balromero tinto selección (Copa)', 'Balromero red selection (glass)', '2.50'],
      ['Balromero blanco seco (Copa)', 'Balromero dry white (glass)', '2.50'],
      ['Balromero semidulce (Copa)', 'Balromero semi-sweet (glass)', '2.50'],
      ['Valparaíso roble', 'Valparaíso roble', '2.80'],
      ['Ramón Bilbao', 'Ramón Bilbao', '3.00'],
    ],
  },
  {
    id: 'panaderia',
    es: 'Panadería',
    en: 'Bakery',
    icon: <BreadIcon className="h-5 w-5" />,
    items: [['Bollo de pan (harina ecológica)', 'Bread roll (organic flour)', '1.00']],
  },
];

const COPY = {
  es: {
    title: 'Nuestra Carta',
    subtitle: 'Cocina extremeña y a la brasa',
    allergenNote:
      'La carta declara 14 categorías de alérgenos (gluten, crustáceos, huevo, pescado, cacahuetes, soja, lácteos, frutos de cáscara, apio, mostaza, sésamo, sulfitos, moluscos, altramuces). Consulta con el personal para más detalle.',
    allCategories: 'Ver todas las categorías',
  },
  en: {
    title: 'Our Menu',
    subtitle: 'Extremaduran & grilled cuisine',
    allergenNote:
      'The menu declares 14 allergen categories (gluten, crustaceans, eggs, fish, peanuts, soy, dairy, tree nuts, celery, mustard, sesame, sulfites, molluscs, lupin). Ask staff for details.',
    allCategories: 'View all categories',
  },
} as const;

interface CategoryTabProps {
  category: MenuCategory;
  isActive: boolean;
  onClick: () => void;
  isEs: boolean;
}

function CategoryTab({ category, isActive, onClick, isEs }: CategoryTabProps) {
  return (
    <motion.button
      type="button"
      data-category={category.id}
      onClick={onClick}
      className={`relative flex h-12 shrink-0 items-center gap-2 rounded-full px-4 py-1.5 text-sm font-bold font-sketch transition-all ${
        isActive
          ? 'bg-[#00AB39] text-white shadow-lg'
          : 'bg-white border-2 border-[#5D4E37]/20 text-[#5D4E37] hover:border-[#00AB39] hover:text-[#00AB39] hover:bg-[#f5f0e8]'
      }`}
      whileHover={{ scale: isActive ? 1 : 1.03 }}
      whileTap={{ scale: 0.97 }}
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, ease: 'easeOut' }}
    >
      <span className="flex items-center justify-center">{category.icon}</span>
      <span className="whitespace-nowrap">{isEs ? category.es : category.en}</span>
    </motion.button>
  );
}

function MenuItemRow({
  item,
  isEs,
  index,
}: Readonly<{ item: MenuItem; isEs: boolean; index: number }>) {
  const [es, en, price] = item;
  return (
    <motion.li
      key={es}
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.3, delay: index * 0.05, ease: 'easeOut' }}
      className="flex items-baseline justify-between gap-3 py-2 border-b border-[#5D4E37]/10 last:border-0"
    >
      <span className="font-handwritten text-[#5D4E37]/90 text-sm leading-relaxed pr-3">
        {isEs ? es : en}
      </span>
      <span className="shrink-0 font-bold text-[#5D4E37] text-sm font-sketch">{'€' + price}</span>
    </motion.li>
  );
}

function CategoryContent({
  category,
  isEs,
  isOpen,
  onToggle,
}: Readonly<{ category: MenuCategory; isEs: boolean; isOpen: boolean; onToggle: () => void }>) {
  return (
    <motion.div
      initial={false}
      animate={{
        height: isOpen ? 'auto' : 0,
        opacity: isOpen ? 1 : 0,
        paddingTop: isOpen ? '1rem' : 0,
        paddingBottom: isOpen ? '0.5rem' : 0,
      }}
      transition={{ duration: 0.4, ease: 'easeInOut' }}
      className="overflow-hidden"
    >
      <div className="rounded-xl border-2 border-[#5D4E37]/20 bg-white p-4 paper-texture doodle-border doodle-shadow">
        <ul className="space-y-1">
          {category.items.map((item, i) => (
            <MenuItemRow key={item[0]} item={item} isEs={isEs} index={i} />
          ))}
        </ul>
      </div>
    </motion.div>
  );
}

export function RestaurantMenu() {
  const { locale } = useI18n();
  const isEs = locale !== 'en';
  const t = isEs ? COPY.es : COPY.en;

  const [activeCategoryId, setActiveCategoryId] = useState<string>(MENU_CATEGORIES[0].id);
  const [openCategories, setOpenCategories] = useState<Set<string>>(
    new Set([MENU_CATEGORIES[0].id])
  );
  const tabsRef = useRef<HTMLDivElement>(null);

  const handleTabClick = (categoryId: string) => {
    setActiveCategoryId(categoryId);
    if (tabsRef.current) {
      const tab = tabsRef.current.querySelector(`[data-category="${categoryId}"]`) as HTMLElement;
      if (tab) {
        tab.scrollIntoView({ behavior: 'smooth', inline: 'center', block: 'nearest' });
      }
    }
  };

  const handleCategoryToggle = (categoryId: string) => {
    setOpenCategories((prev) => {
      const next = new Set(prev);
      if (next.has(categoryId)) {
        next.delete(categoryId);
      } else {
        next.add(categoryId);
      }
      return next;
    });
  };

  return (
    <section className="relative isolate py-12" aria-labelledby="menu-heading">
      <SectionDecor preset="journey" delayOffset={0.5} />
      <div className="container mx-auto max-w-5xl px-4">
        <header className="mb-8 text-center">
          <p id="menu-heading" className="text-xs font-bold uppercase tracking-wide text-[#00AB39]">
            {t.title}
          </p>
          <h2 className="mt-1 text-2xl font-bold text-[#5D4E37] font-sketch">{t.subtitle}</h2>
        </header>

        <nav
          ref={tabsRef}
          className="mb-6 flex gap-2 overflow-x-auto pb-2 scrollbar-hide -mx-4 px-4"
          aria-label={isEs ? 'Categorías del menú' : 'Menu categories'}
        >
          {MENU_CATEGORIES.map((category, i) => (
            <CategoryTab
              key={category.id}
              category={category}
              isActive={activeCategoryId === category.id}
              onClick={() => handleTabClick(category.id)}
              isEs={isEs}
            />
          ))}
        </nav>

        <div className="space-y-4">
          {MENU_CATEGORIES.map((category) => (
            <motion.div
              key={category.id}
              layout
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: 0.1 }}
              className="group"
            >
              <button
                type="button"
                onClick={() => {
                  handleCategoryToggle(category.id);
                  if (activeCategoryId !== category.id) {
                    handleTabClick(category.id);
                  }
                }}
                className={`w-full flex items-center justify-between gap-4 rounded-xl border-2 p-4 transition-all ${
                  openCategories.has(category.id)
                    ? 'bg-white border-[#00AB39]/40 shadow-lg'
                    : 'bg-[#fafafa] border-[#5D4E37]/20 hover:border-[#00AB39]/40'
                }`}
                aria-expanded={openCategories.has(category.id)}
              >
                <div className="flex items-center gap-3">
                  <span
                    className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-lg ${
                      openCategories.has(category.id)
                        ? 'bg-[#00AB39]/10 text-[#00AB39]'
                        : 'bg-[#5D4E37]/10 text-[#5D4E37]'
                    } transition-colors`}
                  >
                    {category.icon}
                  </span>
                  <div>
                    <h3 className="font-bold text-[#5D4E37] font-sketch">
                      {isEs ? category.es : category.en}
                    </h3>
                    <p className="text-xs text-[#5D4E37]/50 font-handwritten">
                      {category.items.length} {isEs ? 'platos' : 'items'}
                    </p>
                  </div>
                </div>
                <motion.div
                  animate={{ rotate: openCategories.has(category.id) ? 180 : 0 }}
                  transition={{ duration: 0.3, ease: 'easeInOut' }}
                  className="flex-shrink-0 text-[#5D4E37]/60"
                >
                  <ChevronDownIcon className="h-5 w-5" />
                </motion.div>
              </button>

              <CategoryContent
                category={category}
                isEs={isEs}
                isOpen={openCategories.has(category.id)}
                onToggle={() => handleCategoryToggle(category.id)}
              />
            </motion.div>
          ))}
        </div>

        <p className="mt-6 text-xs text-[#5D4E37]/60 text-center">{t.allergenNote}</p>
      </div>
    </section>
  );
}
