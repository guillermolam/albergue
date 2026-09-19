import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ChevronDown } from 'lucide-react';
import { WiredButton } from './doodle/WiredButton';
import { useI18n } from './hooks/useI18n';
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
} from './ui/navigation-menu';

interface NavigationProps {
  currentPath: string;
}

interface NavLinkData {
  path: string;
  label: string;
}

interface NavGroupData {
  id: string;
  trigger: string;
  prefix: string;
  items: NavLinkData[];
}

type NavEntryData = NavLinkData | NavGroupData;

function isGroup(entry: NavEntryData): entry is NavGroupData {
  return 'items' in entry;
}

/** Shared squiggle underline shown under the active flat link or the
 * currently-open/active dropdown trigger -- extracted so both DesktopNavLink
 * and DesktopNavDropdown's trigger can render it via the same layoutId,
 * producing a sliding-underline FLIP animation between them. */
function ActiveUnderline() {
  return (
    <motion.svg
      layoutId="activeUnderline"
      className="absolute bottom-0 left-2 right-2 h-1"
      style={{ overflow: 'visible' }}
    >
      <motion.path
        d="M0,2 Q5,0 10,2 T20,2 T30,2 T40,2 T50,2"
        stroke="#00AB39"
        strokeWidth="2.5"
        fill="none"
        strokeLinecap="round"
        initial={{ pathLength: 0 }}
        animate={{ pathLength: 1 }}
        transition={{ duration: 0.5, type: 'spring' }}
      />
    </motion.svg>
  );
}

/** Extracted so Navigation's own cognitive complexity stays under
 * SonarCloud's threshold -- this was inline with its own active-state
 * ternary and conditional underline before. */
function DesktopNavLink({ link, isActive }: { link: NavLinkData; isActive: boolean }) {
  return (
    <a href={link.path} className="relative px-4 py-2 group">
      <motion.span
        whileHover={{ y: -2, scale: 1.05 }}
        className={`transition-colors ${isActive ? 'text-[#00AB39] font-semibold' : 'text-gray-700 group-hover:text-[#00AB39]'}`}
      >
        {link.label}
      </motion.span>
      {isActive && <ActiveUnderline />}
    </a>
  );
}

function DesktopNavDropdown({
  group,
  isGroupActive,
  currentPath,
}: Readonly<{
  group: NavGroupData;
  isGroupActive: boolean;
  currentPath: string;
}>) {
  return (
    <NavigationMenuItem className="relative">
      <NavigationMenuTrigger>{group.trigger}</NavigationMenuTrigger>
      {isGroupActive && <ActiveUnderline />}
      <NavigationMenuContent>
        <ul className="min-w-[220px] space-y-1 rounded-xl border-2 border-[#5D4E37]/30 bg-[#FFF9F0] p-2 paper-texture doodle-border doodle-shadow">
          {group.items.map((item) => (
            <li key={item.path}>
              <NavigationMenuLink asChild active={currentPath === item.path}>
                <a href={item.path}>{item.label}</a>
              </NavigationMenuLink>
            </li>
          ))}
        </ul>
      </NavigationMenuContent>
    </NavigationMenuItem>
  );
}

const NAV_COPY = {
  es: {
    home: 'Inicio',
    book: 'Reservar',
    camino: 'El Camino',
    contact: 'Contacto',
    hostel: {
      trigger: 'El Albergue',
      info: 'Info',
      facilities: 'Instalaciones',
      restaurant: 'Nuestra Cocina',
      services: 'Servicios',
    },
    area: {
      trigger: 'La Zona',
      visit: 'Qué Visitar',
      eat: 'Dónde Comer',
      do: 'Qué Hacer',
    },
    switchLang: 'Switch to English',
    langCode: 'ES',
    login: 'Entrar',
    adminLogin: 'Acceso Admin',
    closeMenu: 'Cerrar menú',
    openMenu: 'Abrir menú',
  },
  en: {
    home: 'Home',
    book: 'Book Now',
    camino: 'El Camino',
    contact: 'Contact',
    hostel: {
      trigger: 'The Hotel',
      info: 'Info',
      facilities: 'Facilities',
      restaurant: 'Our Restaurant',
      services: 'Services',
    },
    area: {
      trigger: 'The Area',
      visit: 'What to Visit',
      eat: 'Where to Eat',
      do: 'What to Do',
    },
    switchLang: 'Cambiar a Español',
    langCode: 'EN',
    login: 'Login',
    adminLogin: 'Admin Login',
    closeMenu: 'Close menu',
    openMenu: 'Open menu',
  },
} as const;

function MobileNavLink({
  link,
  isActive,
  onClick,
  delay,
  indent,
}: {
  link: NavLinkData;
  isActive: boolean;
  onClick: () => void;
  delay: number;
  indent?: boolean;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay }}
      className={indent ? 'pl-4' : undefined}
    >
      <a
        href={link.path}
        onClick={onClick}
        className={`block px-4 py-3 doodle-border transition-all ${isActive ? 'bg-[#00AB39] text-white doodle-shadow' : 'bg-white text-gray-700 hover:bg-[#F5E6D3]'}`}
      >
        {link.label}
      </a>
    </motion.div>
  );
}

function MobileNavSection({
  group,
  currentPath,
  onNavigate,
  delay,
}: Readonly<{
  group: NavGroupData;
  currentPath: string;
  onNavigate: () => void;
  delay: number;
}>) {
  const groupActive = currentPath === group.prefix || currentPath.startsWith(`${group.prefix}/`);
  const [expanded, setExpanded] = useState(groupActive);

  return (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay }}
    >
      <button
        type="button"
        onClick={() => setExpanded((value) => !value)}
        aria-expanded={expanded}
        aria-controls={`mobile-group-${group.id}`}
        className={`flex w-full items-center justify-between px-4 py-3 doodle-border transition-all ${groupActive ? 'bg-[#00AB39]/10 text-[#00AB39]' : 'bg-white text-gray-700 hover:bg-[#F5E6D3]'}`}
      >
        <span>{group.trigger}</span>
        <ChevronDown className={`h-4 w-4 transition-transform ${expanded ? 'rotate-180' : ''}`} />
      </button>
      <AnimatePresence>
        {expanded && (
          <motion.div
            id={`mobile-group-${group.id}`}
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="overflow-hidden pt-2"
          >
            <div className="space-y-2">
              {group.items.map((item, index) => (
                <MobileNavLink
                  key={item.path}
                  link={item}
                  isActive={currentPath === item.path}
                  onClick={onNavigate}
                  delay={index * 0.03}
                  indent
                />
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}

export function Navigation({ currentPath }: NavigationProps) {
  const [isOpen, setIsOpen] = useState(false);
  const { locale, setLocale } = useI18n();
  const isEs = locale !== 'en';

  const t = isEs ? NAV_COPY.es : NAV_COPY.en;
  const isActive = (path: string) => currentPath === path;
  const isGroupActive = (group: NavGroupData) =>
    currentPath === group.prefix || currentPath.startsWith(`${group.prefix}/`);
  const mobileMenuLabel = isOpen ? t.closeMenu : t.openMenu;

  const navEntries: NavEntryData[] = [
    { path: '/', label: t.home },
    {
      id: 'hostel',
      trigger: t.hostel.trigger,
      prefix: '/hostel',
      items: [
        { path: '/hostel/info', label: t.hostel.info },
        { path: '/hostel/facilities', label: t.hostel.facilities },
        { path: '/hostel/restaurant', label: t.hostel.restaurant },
        { path: '/hostel/services', label: t.hostel.services },
      ],
    },
    {
      id: 'area',
      trigger: t.area.trigger,
      prefix: '/area',
      items: [
        { path: '/area/visit', label: t.area.visit },
        { path: '/area/eat', label: t.area.eat },
        { path: '/area/do', label: t.area.do },
      ],
    },
    { path: '/camino', label: t.camino },
    { path: '/contact', label: t.contact },
    { path: '/book', label: t.book },
  ];

  return (
    <motion.nav
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ type: 'spring', stiffness: 100, damping: 20 }}
      aria-label="Main navigation"
      className="bg-[#FFF9F0] sticky top-0 z-50 paper-texture border-b-4 border-[#5D4E37]/20 doodle-border"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-20">
          <a href="/" className="flex items-center space-x-3 group">
            <motion.div
              whileHover={{ rotate: [0, -8, 8, -8, 0], scale: 1.1 }}
              transition={{ duration: 0.5 }}
              className="relative"
            >
              <svg width="56" height="56" className="transform wobble">
                <circle
                  cx="28"
                  cy="28"
                  r="24"
                  fill="#00AB39"
                  stroke="#005a1e"
                  strokeWidth="3"
                  style={{ filter: 'drop-shadow(2px 2px 2px rgba(0,0,0,0.2))' }}
                />
                <circle
                  cx="28"
                  cy="28"
                  r="22"
                  fill="none"
                  stroke="#005a1e"
                  strokeWidth="2"
                  opacity="0.3"
                  style={{ strokeDasharray: '4, 4' }}
                />
                <text
                  x="28"
                  y="35"
                  textAnchor="middle"
                  fill="white"
                  fontSize="20"
                  fontFamily="Cabin Sketch, cursive"
                  fontWeight="bold"
                >
                  AC
                </text>
              </svg>
              <motion.svg
                className="absolute -top-1 -right-1 w-4 h-4 text-[#EAC102]"
                animate={{ rotate: [0, 180, 360] }}
                transition={{ duration: 4, repeat: Infinity, ease: 'linear' }}
              >
                <path d="M2,2 L2.5,1 L3,2 L4,2.5 L3,3 L2.5,4 L2,3 L1,2.5 Z" fill="currentColor" />
              </motion.svg>
            </motion.div>
            <div>
              <span className="font-bold text-xl hidden sm:block sketch-title">
                Albergue Carrascalejo
              </span>
              <span className="text-xs text-[#8B956D] hidden md:block hand-drawn">
                ~ Camino de Santiago ~
              </span>
            </div>
          </a>

          <div className="hidden md:flex items-center">
            <NavigationMenu viewport={false} aria-label="Site sections">
              <NavigationMenuList>
                {navEntries.map((entry) =>
                  isGroup(entry) ? (
                    <DesktopNavDropdown
                      key={entry.id}
                      group={entry}
                      isGroupActive={isGroupActive(entry)}
                      currentPath={currentPath}
                    />
                  ) : (
                    <NavigationMenuItem key={entry.path}>
                      <DesktopNavLink link={entry} isActive={isActive(entry.path)} />
                    </NavigationMenuItem>
                  )
                )}
              </NavigationMenuList>
            </NavigationMenu>
          </div>

          <div className="flex items-center space-x-3">
            <motion.button
              whileHover={{ scale: 1.1, rotate: 8 }}
              whileTap={{ scale: 0.9 }}
              onClick={() => setLocale(isEs ? 'en' : 'es')}
              className="relative"
              aria-label={t.switchLang}
            >
              <svg width="48" height="36" className="hover:drop-shadow-lg transition-all">
                <ellipse
                  cx="24"
                  cy="18"
                  rx="22"
                  ry="16"
                  fill="#F5E6D3"
                  stroke="#5D4E37"
                  strokeWidth="2.5"
                />
                <ellipse
                  cx="24"
                  cy="18"
                  rx="20"
                  ry="14"
                  fill="none"
                  stroke="#5D4E37"
                  strokeWidth="2"
                  opacity="0.2"
                  style={{ strokeDasharray: '2, 2' }}
                />
                <text
                  x="24"
                  y="23"
                  textAnchor="middle"
                  fill="#5D4E37"
                  fontSize="12"
                  fontFamily="Patrick Hand, cursive"
                  fontWeight="bold"
                >
                  {t.langCode}
                </text>
              </svg>
            </motion.button>

            <div className="hidden sm:block">
              <WiredButton href="/admin" variant="outline" size="sm">
                {t.login}
              </WiredButton>
            </div>

            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              onClick={() => setIsOpen(!isOpen)}
              className="md:hidden relative"
              aria-label={mobileMenuLabel}
              aria-expanded={isOpen}
            >
              <svg width="40" height="40">
                <rect
                  x="4"
                  y="4"
                  width="32"
                  height="32"
                  rx="6"
                  fill="#F5E6D3"
                  stroke="#5D4E37"
                  strokeWidth="2.5"
                />
                {isOpen ? (
                  <g transform="translate(20, 20)">
                    <path
                      d="M-6,-6 L6,6 M-6,6 L6,-6"
                      stroke="#5D4E37"
                      strokeWidth="2.5"
                      strokeLinecap="round"
                    />
                  </g>
                ) : (
                  <g transform="translate(12, 14)">
                    <path
                      d="M0,0 L16,0 M0,6 L16,6 M0,12 L16,12"
                      stroke="#5D4E37"
                      strokeWidth="2.5"
                      strokeLinecap="round"
                    />
                  </g>
                )}
              </svg>
            </motion.button>
          </div>
        </div>

        <AnimatePresence>
          {isOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.3 }}
              className="md:hidden overflow-hidden pb-4"
            >
              <div className="space-y-3 pt-2">
                {navEntries.map((entry, index) =>
                  isGroup(entry) ? (
                    <MobileNavSection
                      key={entry.id}
                      group={entry}
                      currentPath={currentPath}
                      onNavigate={() => setIsOpen(false)}
                      delay={index * 0.05}
                    />
                  ) : (
                    <MobileNavLink
                      key={entry.path}
                      link={entry}
                      isActive={isActive(entry.path)}
                      onClick={() => setIsOpen(false)}
                      delay={index * 0.05}
                    />
                  )
                )}
                <motion.div
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: navEntries.length * 0.05 }}
                >
                  <WiredButton href="/admin" variant="primary" className="w-full">
                    {t.adminLogin}
                  </WiredButton>
                </motion.div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.nav>
  );
}
