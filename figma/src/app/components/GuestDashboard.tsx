import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence, useInView } from 'motion/react';
import { X, MapPin, Phone, Mail, Clock, Navigation, AlertTriangle, Send } from 'lucide-react';
import { WiredButton } from './doodle/WiredButton';
import { DoodleCard } from './doodle/DoodleCard';
import logoImage from 'figma:asset/6340c39809bbb6dce9c21e3fed2ac80a388b79b7.png';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { useI18n } from '../contexts/I18nContext';
import { toast } from 'sonner@2.0.3';
import {
  PartyIcon,
  MapPinIcon,
  HomeIcon,
  SparkleIcon,
  ClipboardIcon,
  UtensilsIcon,
  MonumentIcon,
  PhoneIcon,
  ChatIcon,
  CheckIcon,
  PlusIcon,
  ExtremaduraFlag,
  MeridaFlag,
  CarrascalejoFlag
} from './doodle/DoodleIcons';

// Section wrapper with scroll animations
function Section({ 
  children, 
  id, 
  className = "" 
}: { 
  children: React.ReactNode; 
  id: string; 
  className?: string;
}) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  return (
    <motion.section
      id={id}
      ref={ref}
      initial={{ opacity: 0, y: 50 }}
      animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 50 }}
      transition={{ duration: 0.6, ease: "easeOut" }}
      className={className}
    >
      {children}
    </motion.section>
  );
}

export function GuestDashboard() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { language } = useI18n();
  const [showWelcomeModal, setShowWelcomeModal] = useState(true);
  const [wizardStep, setWizardStep] = useState(0);
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [activeSection, setActiveSection] = useState('booking');
  const [contactForm, setContactForm] = useState({ name: '', email: '', message: '' });

  // Distance to Santiago from Carrascalejo (approximate)
  const distanceToSantiago = 527;
  const userName = user?.name || 'Peregrino';

  const wizardSteps = [
    {
      IconComponent: PartyIcon,
      title: language === 'es' ? '¡Bienvenido!' : 'Welcome!',
      description: language === 'es' 
        ? 'Tu reserva está confirmada. Revisa tu email para más detalles.'
        : 'Your booking is confirmed. Check your email for details.',
      color: '#00AB39'
    },
    {
      IconComponent: MapPinIcon,
      title: language === 'es' ? 'Cómo Llegar' : 'Getting Here',
      description: language === 'es'
        ? 'Estamos en el corazón de Carrascalejo, justo en el Camino.'
        : 'We\'re in the heart of Carrascalejo, right on the Camino path.',
      color: '#0071BC'
    },
    {
      IconComponent: HomeIcon,
      title: language === 'es' ? 'Check-in' : 'Check-in Info',
      description: language === 'es'
        ? 'El check-in comienza a las 14:00. ¿Llegas temprano? ¡Tenemos zona de descanso!'
        : 'Check-in starts at 2:00 PM. Early arrival? We have a rest area!',
      color: '#EAC102'
    },
    {
      IconComponent: SparkleIcon,
      title: language === 'es' ? '¡Todo Listo!' : 'You\'re All Set!',
      description: language === 'es'
        ? 'Explora el panel para planificar tu visita.'
        : 'Explore the dashboard to plan your visit.',
      color: '#00AB39'
    }
  ];

  const navItems = [
    { id: 'booking', IconComponent: ClipboardIcon, label: language === 'es' ? 'Mi Reserva' : 'Booking Details' },
    { id: 'directions', IconComponent: MapPinIcon, label: language === 'es' ? 'Direcciones' : 'Directions' },
    { id: 'restaurants', IconComponent: UtensilsIcon, label: language === 'es' ? 'Restaurantes' : 'Restaurants' },
    { id: 'places', IconComponent: MonumentIcon, label: language === 'es' ? 'Lugares' : 'Places to Visit' },
    { id: 'emergency', IconComponent: PhoneIcon, label: language === 'es' ? 'Emergencias' : 'Emergency' },
    { id: 'contact', IconComponent: ChatIcon, label: language === 'es' ? 'Contacto' : 'Contact Us' }
  ];

  const scrollToSection = (id: string) => {
    setActiveSection(id);
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  const handleNextStep = () => {
    if (wizardStep < wizardSteps.length - 1) {
      setWizardStep(wizardStep + 1);
    } else {
      setShowWelcomeModal(false);
    }
  };

  const handleContactSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    toast.success(language === 'es' ? '¡Mensaje enviado!' : 'Message sent!');
    setContactForm({ name: '', email: '', message: '' });
  };

  // Track active section on scroll
  useEffect(() => {
    const handleScroll = () => {
      const sections = navItems.map(item => item.id);
      for (const sectionId of sections) {
        const element = document.getElementById(sectionId);
        if (element) {
          const rect = element.getBoundingClientRect();
          if (rect.top <= 150 && rect.bottom >= 150) {
            setActiveSection(sectionId);
            break;
          }
        }
      }
    };

    const mainContent = document.getElementById('main-content');
    if (mainContent) {
      mainContent.addEventListener('scroll', handleScroll);
      return () => mainContent.removeEventListener('scroll', handleScroll);
    }
  }, []);

  return (
    <div className="min-h-screen bg-[#FFF9F0] paper-texture flex overflow-x-hidden w-full max-w-[100vw]">
      {/* Sidebar */}
      <motion.aside
        initial={{ x: -300 }}
        animate={{ x: sidebarOpen ? 0 : -300 }}
        transition={{ type: "spring", stiffness: 100 }}
        className="fixed left-0 top-0 bottom-0 w-80 flex-shrink-0 bg-[#006b24] shadow-2xl z-40"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.05'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`
        }}
      >
        {/* Header with user info */}
        <div className="p-6 border-b-4 border-[#00AB39]">
          <motion.div 
            className="cursor-pointer"
            onClick={() => navigate('/')}
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.97 }}
          >
            {/* Main Title with Flags */}
            <motion.div
              className="mb-5 bg-[#00AB39] rounded-2xl p-4 border-4 border-white relative overflow-visible"
              style={{
                boxShadow: '0 6px 20px rgba(0, 171, 57, 0.4)'
              }}
              animate={{
                boxShadow: [
                  '0 6px 20px rgba(0, 171, 57, 0.4)',
                  '0 8px 25px rgba(0, 171, 57, 0.6)',
                  '0 6px 20px rgba(0, 171, 57, 0.4)'
                ]
              }}
              transition={{ duration: 2, repeat: Infinity }}
            >
              {/* Decorative corner stars */}
              <motion.div
                className="absolute -top-2 -left-2"
                animate={{ rotate: [0, 360] }}
                transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
              >
                <SparkleIcon className="w-6 h-6" />
              </motion.div>
              <motion.div
                className="absolute -top-2 -right-2"
                animate={{ rotate: [360, 0] }}
                transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
              >
                <SparkleIcon className="w-6 h-6" />
              </motion.div>

              <h1 className="sketch-title text-white text-center text-2xl leading-tight mb-3">
                Albergue Municipal de<br />Carrascalejo
              </h1>

              {/* Flags Row */}
              <div className="flex justify-center items-center gap-3 mb-2">
                <motion.div
                  whileHover={{ scale: 1.15, y: -5 }}
                  className="cursor-pointer"
                >
                  <ExtremaduraFlag className="w-16 h-12" />
                </motion.div>
                
                <motion.div
                  whileHover={{ scale: 1.15, y: -5 }}
                  className="cursor-pointer"
                >
                  <MeridaFlag className="w-16 h-12" />
                </motion.div>
                
                <motion.div
                  whileHover={{ scale: 1.15, y: -5 }}
                  className="cursor-pointer"
                >
                  <CarrascalejoFlag className="w-16 h-12" />
                </motion.div>
              </div>

              <p className="text-white/90 text-center text-xs hand-drawn">
                Extremadura • Mérida • Carrascalejo
              </p>
            </motion.div>

            <motion.img
              src={logoImage}
              alt="Albergue Carrascalejo"
              className="w-20 h-20 mb-4 mx-auto"
              animate={{ rotate: [0, 5, -5, 0] }}
              transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
            />
            
            <h2 className="sketch-title text-3xl text-white text-center mb-2">
              {userName}
            </h2>
            
            <motion.p 
              className="text-center text-[#E8F5E9] hand-drawn text-lg mb-1"
              animate={{ opacity: [0.7, 1, 0.7] }}
              transition={{ duration: 3, repeat: Infinity }}
            >
              Vas en buen camino
            </motion.p>
            
            <div className="bg-[#00AB39] rounded-lg p-3 mt-3 border-4 border-[#00AB39] doodle-shadow">
              <p className="text-white text-center sketch-title text-2xl">
                {distanceToSantiago} km
              </p>
              <p className="text-[#E8F5E9] text-center text-sm hand-drawn">
                {language === 'es' ? 'hasta Santiago' : 'to Santiago'}
              </p>
            </div>
          </motion.div>
        </div>

        {/* Navigation */}
        <nav className="p-4 space-y-2 overflow-y-auto" style={{ maxHeight: 'calc(100vh - 320px)' }}>
          {navItems.map((item, i) => (
            <motion.button
              key={item.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: i * 0.1 }}
              onClick={() => scrollToSection(item.id)}
              className={`w-full text-left px-5 py-4 rounded-2xl transition-all flex items-center gap-4 border-4 ${
                activeSection === item.id
                  ? 'bg-[#00AB39] text-white border-[#00AB39] shadow-lg scale-105'
                  : 'bg-white/10 hover:bg-white/20 text-white border-white/20 hover:border-white/40'
              }`}
              whileHover={{ scale: 1.02, x: 5 }}
              whileTap={{ scale: 0.98 }}
            >
              <item.IconComponent className="w-7 h-7 flex-shrink-0" animate={false} />
              <span className="text-base" style={{ fontFamily: 'Patrick Hand, cursive' }}>
                {item.label}
              </span>
            </motion.button>
          ))}
        </nav>
      </motion.aside>

      {/* Main Content */}
      <div 
        id="main-content"
        className={`flex-1 transition-all ${sidebarOpen ? 'ml-80' : 'ml-0'} overflow-y-auto`}
        style={{ height: '100vh' }}
      >
        <div className="p-6 md:p-10 max-w-7xl mx-auto">
          
          {/* BOOKING DETAILS SECTION */}
          <Section id="booking" className="mb-16">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="mb-10"
            >
              <h1 className="text-5xl md:text-6xl sketch-title text-[#006b24] mb-3">
                {language === 'es' ? '¡Bienvenido!' : 'Welcome!'}
              </h1>
              <p className="text-2xl text-gray-600 hand-drawn">
                {language === 'es' 
                  ? 'Todo listo para tu estancia en el Camino' 
                  : 'Everything ready for your Camino stay'}
              </p>
            </motion.div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
              {/* Booking Confirmation */}
              <DoodleCard color="#00AB39">
                <div className="flex items-start gap-5">
                  <motion.div 
                    className="w-20 h-20 rounded-full bg-[#00AB39] flex items-center justify-center flex-shrink-0 border-4 border-[#006b24]"
                    whileHover={{ scale: 1.1, rotate: 360 }}
                    transition={{ type: "spring", stiffness: 200 }}
                  >
                    <CheckIcon className="w-12 h-12" />
                  </motion.div>
                  <div className="flex-1">
                    <h3 className="text-3xl sketch-title text-[#006b24] mb-3">
                      {language === 'es' ? '¡Reserva Confirmada!' : 'Booking Confirmed!'}
                    </h3>
                    <p className="text-gray-600 mb-4 text-lg hand-drawn">
                      {language === 'es' 
                        ? 'Confirmación enviada a tu email' 
                        : 'Confirmation sent to your email'}
                    </p>
                    <div className="space-y-2 text-base mb-5 bg-[#E8F5E9] p-4 rounded-lg border-3 border-[#00AB39]">
                      <p><strong>Check-in:</strong> 25 Diciembre, 2025</p>
                      <p><strong>{language === 'es' ? 'Camas' : 'Beds'}:</strong> 3, 7, 12</p>
                      <p><strong>ID:</strong> ALB-2025-001</p>
                      <p><strong>Total:</strong> 30€ (3 {language === 'es' ? 'noches' : 'nights'})</p>
                    </div>
                    
                    {/* Make Another Reservation Button */}
                    <motion.button
                      onClick={() => navigate('/book')}
                      className="relative w-full px-6 py-4 group bg-white rounded-2xl border-5 border-[#00AB39] overflow-hidden"
                      whileHover={{ scale: 1.03, rotateZ: -2, y: -3 }}
                      whileTap={{ scale: 0.97 }}
                      style={{
                        boxShadow: '4px 6px 0px rgba(0, 171, 57, 0.4)'
                      }}
                    >
                      <motion.div
                        className="absolute inset-0 bg-[#E8F5E9]"
                        initial={{ x: '-100%' }}
                        whileHover={{ x: 0 }}
                        transition={{ type: "spring", stiffness: 100 }}
                      />
                      <span 
                        className="relative z-10 text-[#00AB39] text-lg flex items-center justify-center gap-3 sketch-title"
                      >
                        <PlusIcon className="w-6 h-6" />
                        {language === 'es' ? 'Nueva Reserva' : 'Make Another Reservation'}
                      </span>
                    </motion.button>
                  </div>
                </div>
              </DoodleCard>

              {/* Quick Info */}
              <DoodleCard color="#0071BC">
                <h3 className="text-3xl sketch-title text-[#0071BC] mb-6 flex items-center gap-3">
                  <Clock className="w-8 h-8" />
                  {language === 'es' ? 'Info Rápida' : 'Quick Info'}
                </h3>
                <div className="space-y-4">
                  <motion.div 
                    className="flex items-start gap-4 bg-[#E3F2FD] p-4 rounded-xl border-3 border-[#0071BC]"
                    whileHover={{ scale: 1.02, x: 5 }}
                  >
                    <Clock className="w-6 h-6 text-[#0071BC] flex-shrink-0 mt-1" />
                    <div>
                      <p className="text-lg"><strong>Check-in:</strong> 14:00</p>
                      <p className="text-gray-600"><strong>Check-out:</strong> 10:00</p>
                    </div>
                  </motion.div>
                  
                  <motion.div 
                    className="flex items-start gap-4 bg-[#E8F5E9] p-4 rounded-xl border-3 border-[#00AB39]"
                    whileHover={{ scale: 1.02, x: 5 }}
                  >
                    <HomeIcon className="w-6 h-6 flex-shrink-0 mt-1" animate={false} />
                    <div>
                      <p className="text-lg"><strong>Calle Principal, 123</strong></p>
                      <p className="text-gray-600">Carrascalejo, Extremadura</p>
                    </div>
                  </motion.div>
                  
                  <motion.div 
                    className="flex items-start gap-4 bg-[#FFF3E0] p-4 rounded-xl border-3 border-[#D4A574]"
                    whileHover={{ scale: 1.02, x: 5 }}
                  >
                    <PhoneIcon className="w-6 h-6 flex-shrink-0 mt-1" animate={false} />
                    <div>
                      <p className="text-lg"><strong>+34 924 XXX XXX</strong></p>
                      <p className="text-gray-600">{language === 'es' ? 'Disponible 24/7' : 'Available 24/7'}</p>
                    </div>
                  </motion.div>
                </div>
              </DoodleCard>
            </div>
          </Section>

          {/* DIRECTIONS SECTION */}
          <Section id="directions" className="mb-16">
            <h2 className="text-4xl md:text-5xl sketch-title text-[#0071BC] mb-8 flex items-center gap-4">
              <MapPinIcon className="w-12 h-12" />
              {language === 'es' ? 'Cómo Llegar' : 'Directions'}
            </h2>
            
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              <DoodleCard color="#0071BC">
                <h3 className="text-2xl sketch-title text-[#0071BC] mb-4">
                  {language === 'es' ? 'Desde Mérida' : 'From Mérida'}
                </h3>
                <div className="space-y-4 text-lg">
                  <div className="flex gap-3">
                    <span className="text-2xl flex-shrink-0">1️⃣</span>
                    <p>{language === 'es' 
                      ? 'Sigue las flechas amarillas del Camino Mozárabe'
                      : 'Follow the yellow arrows of the Camino Mozárabe'}</p>
                  </div>
                  <div className="flex gap-3">
                    <span className="text-2xl flex-shrink-0">2️⃣</span>
                    <p>{language === 'es' 
                      ? 'Camina aproximadamente 24 km (5-6 horas)'
                      : 'Walk approximately 24 km (5-6 hours)'}</p>
                  </div>
                  <div className="flex gap-3">
                    <span className="text-2xl flex-shrink-0">3️⃣</span>
                    <p>{language === 'es' 
                      ? 'El albergue está en el centro del pueblo'
                      : 'The hostel is in the town center'}</p>
                  </div>
                </div>
              </DoodleCard>

              <DoodleCard color="#00AB39">
                <h3 className="text-2xl sketch-title text-[#00AB39] mb-4">
                  {language === 'es' ? 'En Coche' : 'By Car'}
                </h3>
                <div className="space-y-4 text-lg">
                  <p className="bg-[#E8F5E9] p-4 rounded-lg border-3 border-[#00AB39]">
                    <strong>GPS:</strong> 39.1234, -5.6789
                  </p>
                  <p>
                    {language === 'es'
                      ? '🚗 Aparcamiento gratuito disponible'
                      : '🚗 Free parking available'}
                  </p>
                  <p>
                    {language === 'es'
                      ? '📍 A 30 min de Mérida por la EX-352'
                      : '📍 30 min from Mérida via EX-352'}
                  </p>
                </div>
              </DoodleCard>
            </div>

            {/* Map placeholder */}
            <motion.div 
              className="mt-8 bg-[#E8F5E9] rounded-3xl border-5 border-[#00AB39] p-8 text-center"
              whileHover={{ scale: 1.01 }}
              style={{
                boxShadow: '6px 8px 0px rgba(0, 171, 57, 0.3)'
              }}
            >
              <MapPin className="w-16 h-16 text-[#00AB39] mx-auto mb-4" />
              <p className="text-2xl sketch-title text-[#00AB39] mb-2">
                {language === 'es' ? 'Ver en Mapa' : 'View on Map'}
              </p>
              <p className="text-gray-600 hand-drawn">
                {language === 'es' 
                  ? 'Haz clic para abrir Google Maps'
                  : 'Click to open Google Maps'}
              </p>
            </motion.div>
          </Section>

          {/* RESTAURANTS SECTION */}
          <Section id="restaurants" className="mb-16">
            <h2 className="text-4xl md:text-5xl sketch-title text-[#D4A574] mb-8 flex items-center gap-4">
              <UtensilsIcon className="w-12 h-12" />
              {language === 'es' ? 'Restaurantes Cercanos' : 'Nearby Restaurants'}
            </h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[
                {
                  name: 'El Rincón del Peregrino',
                  type: language === 'es' ? 'Cocina Tradicional' : 'Traditional Cuisine',
                  distance: '50 m',
                  price: '€€',
                  color: '#D4A574'
                },
                {
                  name: 'Bar Casa Pepe',
                  type: language === 'es' ? 'Tapas y Raciones' : 'Tapas & Portions',
                  distance: '100 m',
                  price: '€',
                  color: '#00AB39'
                },
                {
                  name: 'Restaurante El Camino',
                  type: language === 'es' ? 'Menú del Día' : 'Daily Menu',
                  distance: '200 m',
                  price: '€€',
                  color: '#0071BC'
                }
              ].map((restaurant, i) => (
                <motion.div
                  key={restaurant.name}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.1 }}
                  viewport={{ once: true }}
                >
                  <DoodleCard color={restaurant.color}>
                    <div className="text-center">
                      <UtensilsIcon className="w-16 h-16 mx-auto mb-4" />
                      <h3 className="text-2xl sketch-title mb-2">{restaurant.name}</h3>
                      <p className="text-gray-600 mb-3 hand-drawn">{restaurant.type}</p>
                      <div className="flex justify-center gap-4 text-sm">
                        <span className="bg-white px-3 py-1 rounded-full border-2 border-gray-300">
                          📍 {restaurant.distance}
                        </span>
                        <span className="bg-white px-3 py-1 rounded-full border-2 border-gray-300">
                          {restaurant.price}
                        </span>
                      </div>
                    </div>
                  </DoodleCard>
                </motion.div>
              ))}
            </div>
          </Section>

          {/* PLACES TO VISIT SECTION */}
          <Section id="places" className="mb-16">
            <h2 className="text-4xl md:text-5xl sketch-title text-[#8B6914] mb-8 flex items-center gap-4">
              <MonumentIcon className="w-12 h-12" />
              {language === 'es' ? 'Lugares para Visitar' : 'Places to Visit'}
            </h2>
            
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {[
                {
                  name: language === 'es' ? 'Teatro Romano de Mérida' : 'Roman Theatre of Mérida',
                  description: language === 'es' 
                    ? 'Patrimonio de la Humanidad. Espectacular teatro del siglo I a.C.'
                    : 'UNESCO World Heritage. Spectacular 1st century BC theatre.',
                  distance: '24 km',
                  color: '#8B6914'
                },
                {
                  name: language === 'es' ? 'Anfiteatro Romano' : 'Roman Amphitheatre',
                  description: language === 'es'
                    ? 'Construido en el año 8 a.C. para espectáculos de gladiadores.'
                    : 'Built in 8 BC for gladiator shows.',
                  distance: '24 km',
                  color: '#D4A574'
                },
                {
                  name: language === 'es' ? 'Puente Romano' : 'Roman Bridge',
                  description: language === 'es'
                    ? 'Puente de 792 metros sobre el río Guadiana.'
                    : '792-meter bridge over the Guadiana River.',
                  distance: '24 km',
                  color: '#00AB39'
                },
                {
                  name: language === 'es' ? 'Iglesia Local' : 'Local Church',
                  description: language === 'es'
                    ? 'Hermosa iglesia del siglo XVI en Carrascalejo.'
                    : 'Beautiful 16th-century church in Carrascalejo.',
                  distance: '300 m',
                  color: '#0071BC'
                }
              ].map((place, i) => (
                <motion.div
                  key={place.name}
                  initial={{ opacity: 0, x: i % 2 === 0 ? -20 : 20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.15 }}
                  viewport={{ once: true }}
                >
                  <DoodleCard color={place.color}>
                    <div className="flex gap-4">
                      <MonumentIcon className="w-16 h-16 flex-shrink-0" />
                      <div>
                        <h3 className="text-2xl sketch-title mb-2">{place.name}</h3>
                        <p className="text-gray-600 mb-3 hand-drawn text-lg">{place.description}</p>
                        <span className="inline-block bg-white px-4 py-2 rounded-full border-3 border-gray-300 text-sm">
                          📍 {place.distance}
                        </span>
                      </div>
                    </div>
                  </DoodleCard>
                </motion.div>
              ))}
            </div>
          </Section>

          {/* EMERGENCY CONTACTS SECTION */}
          <Section id="emergency" className="mb-16">
            <h2 className="text-4xl md:text-5xl sketch-title text-[#ED1C24] mb-8 flex items-center gap-4">
              <AlertTriangle className="w-12 h-12" />
              {language === 'es' ? 'Contactos de Emergencia' : 'Emergency Contacts'}
            </h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {[
                {
                  name: language === 'es' ? 'Emergencias' : 'Emergency',
                  number: '112',
                  description: language === 'es' ? 'Número de emergencias europeo' : 'European emergency number',
                  Icon: AlertTriangle,
                  color: '#ED1C24'
                },
                {
                  name: language === 'es' ? 'Policía Local' : 'Local Police',
                  number: '+34 924 XXX XXX',
                  description: language === 'es' ? 'Policía de Carrascalejo' : 'Carrascalejo Police',
                  Icon: Phone,
                  color: '#0071BC'
                },
                {
                  name: language === 'es' ? 'Centro de Salud' : 'Health Center',
                  number: '+34 924 YYY YYY',
                  description: language === 'es' ? 'Centro de salud más cercano en Mérida' : 'Nearest health center in Mérida',
                  Icon: Phone,
                  color: '#00AB39'
                },
                {
                  name: 'Albergue',
                  number: '+34 924 ZZZ ZZZ',
                  description: language === 'es' ? 'Teléfono del albergue' : 'Hostel phone',
                  Icon: Phone,
                  color: '#D4A574'
                }
              ].map((contact, i) => (
                <motion.div
                  key={contact.name}
                  initial={{ opacity: 0, scale: 0.9 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  transition={{ delay: i * 0.1 }}
                  viewport={{ once: true }}
                  whileHover={{ scale: 1.03, y: -5 }}
                >
                  <div 
                    className="bg-white rounded-3xl border-5 p-6"
                    style={{ 
                      borderColor: contact.color,
                      boxShadow: `6px 8px 0px ${contact.color}40`
                    }}
                  >
                    <div className="flex items-start gap-4">
                      <div 
                        className="w-14 h-14 rounded-full flex items-center justify-center flex-shrink-0 border-4"
                        style={{ 
                          backgroundColor: contact.color,
                          borderColor: contact.color
                        }}
                      >
                        <contact.Icon className="w-7 h-7 text-white" />
                      </div>
                      <div>
                        <h3 className="text-2xl sketch-title mb-1" style={{ color: contact.color }}>
                          {contact.name}
                        </h3>
                        <p className="text-2xl mb-2">
                          <strong>{contact.number}</strong>
                        </p>
                        <p className="text-gray-600 hand-drawn">{contact.description}</p>
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </Section>

          {/* CONTACT US SECTION */}
          <Section id="contact" className="mb-16">
            <h2 className="text-4xl md:text-5xl sketch-title text-[#00AB39] mb-8 flex items-center gap-4">
              <ChatIcon className="w-12 h-12" />
              {language === 'es' ? 'Contáctanos' : 'Contact Us'}
            </h2>
            
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              <DoodleCard color="#00AB39">
                <h3 className="text-2xl sketch-title text-[#00AB39] mb-6">
                  {language === 'es' ? 'Envíanos un Mensaje' : 'Send us a Message'}
                </h3>
                <form onSubmit={handleContactSubmit} className="space-y-5">
                  <div>
                    <label className="block text-lg mb-2 hand-drawn">
                      {language === 'es' ? 'Nombre' : 'Name'}
                    </label>
                    <input
                      type="text"
                      value={contactForm.name}
                      onChange={(e) => setContactForm({ ...contactForm, name: e.target.value })}
                      className="w-full px-4 py-3 rounded-xl border-4 border-[#00AB39] focus:outline-none focus:border-[#006b24] text-lg"
                      style={{ fontFamily: 'Patrick Hand, cursive' }}
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-lg mb-2 hand-drawn">Email</label>
                    <input
                      type="email"
                      value={contactForm.email}
                      onChange={(e) => setContactForm({ ...contactForm, email: e.target.value })}
                      className="w-full px-4 py-3 rounded-xl border-4 border-[#00AB39] focus:outline-none focus:border-[#006b24] text-lg"
                      style={{ fontFamily: 'Patrick Hand, cursive' }}
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-lg mb-2 hand-drawn">
                      {language === 'es' ? 'Mensaje' : 'Message'}
                    </label>
                    <textarea
                      value={contactForm.message}
                      onChange={(e) => setContactForm({ ...contactForm, message: e.target.value })}
                      rows={5}
                      className="w-full px-4 py-3 rounded-xl border-4 border-[#00AB39] focus:outline-none focus:border-[#006b24] text-lg resize-none"
                      style={{ fontFamily: 'Patrick Hand, cursive' }}
                      required
                    />
                  </div>
                  <motion.button
                    type="submit"
                    className="w-full bg-[#00AB39] text-white px-6 py-4 rounded-2xl border-5 border-[#006b24] sketch-title text-xl flex items-center justify-center gap-3"
                    whileHover={{ scale: 1.03, y: -3 }}
                    whileTap={{ scale: 0.97 }}
                    style={{
                      boxShadow: '5px 7px 0px rgba(0, 107, 36, 0.5)'
                    }}
                  >
                    <Send className="w-6 h-6" />
                    {language === 'es' ? 'Enviar' : 'Send'}
                  </motion.button>
                </form>
              </DoodleCard>

              <DoodleCard color="#0071BC">
                <h3 className="text-2xl sketch-title text-[#0071BC] mb-6">
                  {language === 'es' ? 'Información de Contacto' : 'Contact Information'}
                </h3>
                <div className="space-y-5 text-lg">
                  <motion.div 
                    className="flex items-start gap-4 bg-[#E3F2FD] p-4 rounded-xl border-3 border-[#0071BC]"
                    whileHover={{ x: 5, scale: 1.02 }}
                  >
                    <Mail className="w-6 h-6 text-[#0071BC] flex-shrink-0 mt-1" />
                    <div>
                      <p className="font-medium">Email</p>
                      <p className="text-gray-600">info@alberguecarrascalejo.com</p>
                    </div>
                  </motion.div>
                  
                  <motion.div 
                    className="flex items-start gap-4 bg-[#E8F5E9] p-4 rounded-xl border-3 border-[#00AB39]"
                    whileHover={{ x: 5, scale: 1.02 }}
                  >
                    <Phone className="w-6 h-6 text-[#00AB39] flex-shrink-0 mt-1" />
                    <div>
                      <p className="font-medium">{language === 'es' ? 'Teléfono' : 'Phone'}</p>
                      <p className="text-gray-600">+34 924 XXX XXX</p>
                    </div>
                  </motion.div>
                  
                  <motion.div 
                    className="flex items-start gap-4 bg-[#FFF3E0] p-4 rounded-xl border-3 border-[#D4A574]"
                    whileHover={{ x: 5, scale: 1.02 }}
                  >
                    <MapPin className="w-6 h-6 text-[#D4A574] flex-shrink-0 mt-1" />
                    <div>
                      <p className="font-medium">{language === 'es' ? 'Dirección' : 'Address'}</p>
                      <p className="text-gray-600">
                        Calle Principal, 123<br />
                        10680 Carrascalejo<br />
                        Extremadura, España
                      </p>
                    </div>
                  </motion.div>

                  <motion.div 
                    className="flex items-start gap-4 bg-[#F3E5F5] p-4 rounded-xl border-3 border-[#8B6914]"
                    whileHover={{ x: 5, scale: 1.02 }}
                  >
                    <Clock className="w-6 h-6 text-[#8B6914] flex-shrink-0 mt-1" />
                    <div>
                      <p className="font-medium">{language === 'es' ? 'Horario' : 'Hours'}</p>
                      <p className="text-gray-600">
                        Check-in: 14:00 - 22:00<br />
                        Check-out: 06:00 - 10:00
                      </p>
                    </div>
                  </motion.div>
                </div>
              </DoodleCard>
            </div>
          </Section>

        </div>
      </div>

      {/* Welcome Modal with Wizard */}
      <AnimatePresence>
        {showWelcomeModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4"
          >
            <motion.div
              initial={{ scale: 0.8, y: 50 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.8, y: 50 }}
              className="relative max-w-3xl w-full"
            >
              {/* Hand-drawn modal border */}
              <svg
                className="absolute inset-0 w-full h-full pointer-events-none"
                style={{ filter: 'drop-shadow(8px 12px 20px rgba(0,0,0,0.4))' }}
              >
                <rect
                  x="4"
                  y="4"
                  width="calc(100% - 8px)"
                  height="calc(100% - 8px)"
                  fill="white"
                  stroke={wizardSteps[wizardStep].color}
                  strokeWidth="6"
                  rx="32"
                />
                <rect
                  x="8"
                  y="8"
                  width="calc(100% - 16px)"
                  height="calc(100% - 16px)"
                  fill="none"
                  stroke={wizardSteps[wizardStep].color}
                  strokeWidth="4"
                  rx="28"
                  opacity="0.4"
                  strokeDasharray="12, 12"
                />
              </svg>

              <div className="relative z-10 p-12">
                {/* Close button */}
                <motion.button
                  onClick={() => setShowWelcomeModal(false)}
                  className="absolute top-6 right-6 w-12 h-12 rounded-full bg-gray-100 hover:bg-gray-200 flex items-center justify-center border-3 border-gray-300"
                  whileHover={{ scale: 1.1, rotate: 90 }}
                  whileTap={{ scale: 0.9 }}
                >
                  <X className="w-6 h-6" />
                </motion.button>

                {/* Wizard Content */}
                <AnimatePresence mode="wait">
                  <motion.div
                    key={wizardStep}
                    initial={{ opacity: 0, x: 30 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -30 }}
                    transition={{ duration: 0.4 }}
                    className="text-center"
                  >
                    <motion.div
                      initial={{ scale: 0, rotate: -180 }}
                      animate={{ scale: 1, rotate: 0 }}
                      transition={{ type: "spring", stiffness: 150, delay: 0.1 }}
                      className="flex justify-center mb-8"
                    >
                      {(() => {
                        const IconComponent = wizardSteps[wizardStep].IconComponent;
                        return <IconComponent className="w-28 h-28 md:w-40 md:h-40" />;
                      })()}
                    </motion.div>

                    <h2
                      className="text-5xl md:text-6xl sketch-title mb-6"
                      style={{ color: wizardSteps[wizardStep].color }}
                    >
                      {wizardSteps[wizardStep].title}
                    </h2>

                    <p className="text-2xl text-gray-600 mb-10 hand-drawn max-w-2xl mx-auto">
                      {wizardSteps[wizardStep].description}
                    </p>

                    {/* Progress Dots */}
                    <div className="flex justify-center gap-4 mb-10">
                      {wizardSteps.map((_, i) => (
                        <motion.div
                          key={i}
                          className={`h-4 rounded-full transition-all border-3 ${
                            i === wizardStep
                              ? 'w-12 border-transparent'
                              : i < wizardStep
                              ? 'w-4 border-transparent'
                              : 'w-4 bg-gray-200 border-gray-300'
                          }`}
                          style={{
                            backgroundColor: i <= wizardStep ? wizardSteps[wizardStep].color : undefined
                          }}
                          whileHover={{ scale: 1.2 }}
                        />
                      ))}
                    </div>

                    <motion.button
                      onClick={handleNextStep}
                      className="px-10 py-5 rounded-2xl border-6 sketch-title text-2xl"
                      style={{
                        backgroundColor: wizardSteps[wizardStep].color,
                        borderColor: wizardSteps[wizardStep].color,
                        color: 'white',
                        boxShadow: `6px 8px 0px ${wizardSteps[wizardStep].color}80`
                      }}
                      whileHover={{ scale: 1.05, y: -3 }}
                      whileTap={{ scale: 0.95 }}
                    >
                      {wizardStep < wizardSteps.length - 1 
                        ? (language === 'es' ? 'Siguiente →' : 'Next →')
                        : (language === 'es' ? '¡Empezar!' : 'Get Started!')}
                    </motion.button>
                  </motion.div>
                </AnimatePresence>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}