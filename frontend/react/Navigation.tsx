import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { WiredButton } from './doodle/WiredButton';
import { useI18n } from './hooks/useI18n';

interface NavigationProps {
  currentPath: string;
}

interface NavLinkData {
  path: string;
  label: string;
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
      {isActive && (
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
      )}
    </a>
  );
}

function MobileNavLink({
  link,
  isActive,
  onClick,
  delay,
}: {
  link: NavLinkData;
  isActive: boolean;
  onClick: () => void;
  delay: number;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay }}
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

export function Navigation({ currentPath }: NavigationProps) {
  const [isOpen, setIsOpen] = useState(false);
  const { locale, setLocale } = useI18n();
  const isEs = locale !== 'en';

  const isActive = (path: string) => currentPath === path;
  const mobileMenuLabel = isOpen
    ? isEs
      ? 'Cerrar menú'
      : 'Close menu'
    : isEs
      ? 'Abrir menú'
      : 'Open menu';

  const navLinks = [
    { path: '/', label: isEs ? 'Inicio' : 'Home' },
    { path: '/book', label: isEs ? 'Reservar' : 'Book Now' },
    { path: '/restaurants', label: isEs ? 'Restaurantes' : 'Restaurants' },
    { path: '/visits', label: isEs ? 'Visitas' : 'Visits' },
    { path: '/tourism', label: isEs ? 'Turismo' : 'Tourism' },
    { path: '/emergencies', label: isEs ? 'Emergencias' : 'Emergencies' },
  ];

  return (
    <motion.nav
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ type: 'spring', stiffness: 100, damping: 20 }}
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

          <div className="hidden md:flex items-center space-x-1">
            {navLinks.map((link) => (
              <DesktopNavLink key={link.path} link={link} isActive={isActive(link.path)} />
            ))}
          </div>

          <div className="flex items-center space-x-3">
            <motion.button
              whileHover={{ scale: 1.1, rotate: 8 }}
              whileTap={{ scale: 0.9 }}
              onClick={() => setLocale(isEs ? 'en' : 'es')}
              className="relative"
              aria-label={isEs ? 'Switch to English' : 'Cambiar a Español'}
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
                  {isEs ? 'ES' : 'EN'}
                </text>
              </svg>
            </motion.button>

            <div className="hidden sm:block">
              <WiredButton href="/admin" variant="outline" size="sm">
                {isEs ? 'Entrar' : 'Login'}
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
                {navLinks.map((link, index) => (
                  <MobileNavLink
                    key={link.path}
                    link={link}
                    isActive={isActive(link.path)}
                    onClick={() => setIsOpen(false)}
                    delay={index * 0.05}
                  />
                ))}
                <motion.div
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: navLinks.length * 0.05 }}
                >
                  <WiredButton href="/admin" variant="primary" className="w-full">
                    {isEs ? 'Acceso Admin' : 'Admin Login'}
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
