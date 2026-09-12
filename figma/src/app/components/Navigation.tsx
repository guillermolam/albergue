import { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Menu, X, Globe } from 'lucide-react';
import { WiredButton } from './doodle/WiredButton';
import { motion, AnimatePresence } from 'motion/react';

export function Navigation() {
  const [isOpen, setIsOpen] = useState(false);
  const [language, setLanguage] = useState('EN');
  const location = useLocation();

  const isActive = (path: string) => location.pathname === path;

  const navLinks = [
    { path: '/', label: language === 'EN' ? 'Home' : 'Inicio' },
    { path: '/book', label: language === 'EN' ? 'Book Now' : 'Reservar' },
    { path: '/restaurants', label: language === 'EN' ? 'Restaurants' : 'Restaurantes' },
    { path: '/visits', label: language === 'EN' ? 'Visits' : 'Visitas' },
    { path: '/tourism', label: language === 'EN' ? 'Tourism' : 'Turismo' },
    { path: '/emergencies', label: language === 'EN' ? 'Emergencies' : 'Emergencias' },
  ];

  return (
    <motion.nav 
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ type: "spring", stiffness: 100, damping: 20 }}
      className="bg-[#FFF9F0] sticky top-0 z-50 paper-texture border-b-4 border-[#5D4E37]/20 doodle-border"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-20">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-3 group">
            <motion.div 
              whileHover={{ rotate: [0, -8, 8, -8, 0], scale: 1.1 }}
              transition={{ duration: 0.5 }}
              className="relative"
            >
              {/* Hand-drawn logo badge */}
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
              
              {/* Doodle stars */}
              <motion.svg 
                className="absolute -top-1 -right-1 w-4 h-4 text-[#EAC102]"
                animate={{ rotate: [0, 180, 360] }}
                transition={{ duration: 4, repeat: Infinity, ease: "linear" }}
              >
                <path d="M2,2 L2.5,1 L3,2 L4,2.5 L3,3 L2.5,4 L2,3 L1,2.5 Z" fill="currentColor" />
              </motion.svg>
            </motion.div>
            <div>
              <span className="font-bold text-xl hidden sm:block sketch-title">
                Albergue Carrascalejo
              </span>
              <span className="text-xs text-[#8B956D] hidden md:block hand-drawn">~ Camino de Santiago ~</span>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-1">
            {navLinks.map((link) => (
              <Link
                key={link.path}
                to={link.path}
                className="relative px-4 py-2 group"
              >
                <motion.span
                  whileHover={{ y: -2, scale: 1.05 }}
                  className={`transition-colors ${
                    isActive(link.path)
                      ? 'text-[#00AB39] font-semibold'
                      : 'text-gray-700 group-hover:text-[#00AB39]'
                  }`}
                >
                  {link.label}
                </motion.span>
                {isActive(link.path) && (
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
                      transition={{ duration: 0.5, type: "spring" }}
                    />
                  </motion.svg>
                )}
              </Link>
            ))}
          </div>

          {/* Right Side Actions */}
          <div className="flex items-center space-x-3">
            {/* Language Switcher with doodle style */}
            <motion.button
              whileHover={{ scale: 1.1, rotate: 8 }}
              whileTap={{ scale: 0.9 }}
              onClick={() => setLanguage(language === 'EN' ? 'ES' : 'EN')}
              className="relative"
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
                  {language}
                </text>
              </svg>
            </motion.button>

            {/* Login Button */}
            <Link to="/admin" className="hidden sm:block">
              <WiredButton variant="outline" size="sm">
                {language === 'EN' ? 'Login' : 'Entrar'}
              </WiredButton>
            </Link>

            {/* Mobile Menu Button */}
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              onClick={() => setIsOpen(!isOpen)}
              className="md:hidden relative"
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
                    <path d="M-6,-6 L6,6 M-6,6 L6,-6" stroke="#5D4E37" strokeWidth="2.5" strokeLinecap="round" />
                  </g>
                ) : (
                  <g transform="translate(12, 14)">
                    <path d="M0,0 L16,0 M0,6 L16,6 M0,12 L16,12" stroke="#5D4E37" strokeWidth="2.5" strokeLinecap="round" />
                  </g>
                )}
              </svg>
            </motion.button>
          </div>
        </div>

        {/* Mobile Menu */}
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
                  <motion.div
                    key={link.path}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.05 }}
                  >
                    <Link
                      to={link.path}
                      onClick={() => setIsOpen(false)}
                      className={`block px-4 py-3 doodle-border transition-all ${
                        isActive(link.path)
                          ? 'bg-[#00AB39] text-white doodle-shadow'
                          : 'bg-white text-gray-700 hover:bg-[#F5E6D3]'
                      }`}
                    >
                      {link.label}
                    </Link>
                  </motion.div>
                ))}
                <motion.div
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: navLinks.length * 0.05 }}
                >
                  <Link to="/admin" onClick={() => setIsOpen(false)}>
                    <WiredButton variant="primary" className="w-full">
                      {language === 'EN' ? 'Admin Login' : 'Acceso Admin'}
                    </WiredButton>
                  </Link>
                </motion.div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.nav>
  );
}