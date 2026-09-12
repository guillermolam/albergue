import { motion, useMotionValue, useTransform, AnimatePresence } from 'motion/react';
import { WiredButton } from '../doodle/WiredButton';
import { PhoneInput } from '../doodle/PhoneInput';
import { AddressAutocomplete } from '../doodle/AddressAutocomplete';
import { useState, useEffect, useRef } from 'react';
import { User, MapPin, Phone, Mail, Calendar, Flag, Heart, Shield, CheckCircle2 } from 'lucide-react';

interface PilgrimCardProps {
  onNext: (formData: any) => void;
  onBack: () => void;
  prefillData?: {
    firstName: string;
    lastName: string;
    secondLastName: string;
    idNumber: string;
    dateOfBirth: string;
    nationality: string;
  };
}

// Rough Notation-style underline component
function RoughUnderline({ children, color, delay = 0 }: { children: React.ReactNode; color: string; delay?: number }) {
  return (
    <span className="relative inline-block">
      {children}
      <motion.svg
        className="absolute -bottom-1 left-0 w-full h-2 overflow-visible pointer-events-none"
        initial={{ pathLength: 0, opacity: 0 }}
        animate={{ pathLength: 1, opacity: 0.7 }}
        transition={{ duration: 0.8, delay, ease: "easeInOut" }}
      >
        <motion.path
          d="M 0 1 Q 10 0, 20 1 T 40 1 T 60 1 T 80 1 T 100 1 T 120 1 T 140 1 T 160 1 T 180 1 T 200 1"
          stroke={color}
          strokeWidth="2"
          fill="none"
          vectorEffect="non-scaling-stroke"
          style={{ transform: 'scaleX(2)' }}
        />
      </motion.svg>
    </span>
  );
}

// Sketchy Circle annotation
function SketchyCircle({ children, color, delay = 0 }: { children: React.ReactNode; color: string; delay?: number }) {
  return (
    <span className="relative inline-block">
      {children}
      <motion.svg
        className="absolute inset-0 w-full h-full overflow-visible pointer-events-none"
        style={{ padding: '8px' }}
        initial={{ pathLength: 0, opacity: 0 }}
        animate={{ pathLength: 1, opacity: 0.6 }}
        transition={{ duration: 1, delay, ease: "easeInOut" }}
      >
        <motion.ellipse
          cx="50%"
          cy="50%"
          rx="45%"
          ry="50%"
          stroke={color}
          strokeWidth="2.5"
          fill="none"
        />
      </motion.svg>
    </span>
  );
}

// 3D Photo Card component
function PhotoCard3D({ photoUrl }: { photoUrl?: string }) {
  const cardRef = useRef<HTMLDivElement>(null);
  const [isHovered, setIsHovered] = useState(false);
  
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);
  
  const rotateX = useTransform(mouseY, [-300, 300], [15, -15]);
  const rotateY = useTransform(mouseX, [-300, 300], [-15, 15]);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;
    mouseX.set(e.clientX - centerX);
    mouseY.set(e.clientY - centerY);
  };

  const handleMouseLeave = () => {
    setIsHovered(false);
    mouseX.set(0);
    mouseY.set(0);
  };

  // Mock pilgrim photo (from OCR in real scenario)
  const pilgrimPhoto = photoUrl || 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=400&h=500&fit=crop';

  return (
    <motion.div
      ref={cardRef}
      className="relative w-full h-full"
      style={{
        perspective: 1000,
        transformStyle: 'preserve-3d'
      }}
      onMouseMove={handleMouseMove}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={handleMouseLeave}
      animate={{
        scale: isHovered ? 1.02 : 1,
      }}
      transition={{ type: 'spring', stiffness: 300, damping: 30 }}
    >
      <motion.div
        className="relative w-full h-full rounded-2xl overflow-hidden"
        style={{
          rotateX,
          rotateY,
          transformStyle: 'preserve-3d'
        }}
      >
        {/* Gradient background with parallax */}
        <motion.div
          className="absolute inset-0 bg-gradient-to-br from-[#0071BC] via-[#00AB39] to-[#FFC837]"
          style={{
            transform: 'translateZ(-50px) scale(1.1)',
            transformStyle: 'preserve-3d'
          }}
        />

        {/* Photo */}
        <motion.div
          className="absolute inset-0"
          style={{
            transform: 'translateZ(20px)',
            transformStyle: 'preserve-3d'
          }}
        >
          <img
            src={pilgrimPhoto}
            alt="Pilgrim"
            className="w-full h-full object-cover"
            style={{ mixBlendMode: 'luminosity', opacity: 0.9 }}
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
        </motion.div>

        {/* Animated shine effect */}
        {isHovered && (
          <motion.div
            className="absolute inset-0 pointer-events-none"
            style={{
              background: 'linear-gradient(45deg, transparent 30%, rgba(255,255,255,0.3) 50%, transparent 70%)',
              transform: 'translateZ(30px)',
            }}
            animate={{
              x: ['-100%', '100%'],
            }}
            transition={{
              duration: 1,
              ease: 'easeInOut',
            }}
          />
        )}

        {/* Sketchy border */}
        <svg className="absolute inset-0 w-full h-full pointer-events-none" style={{ transform: 'translateZ(40px)' }}>
          <rect
            x="4"
            y="4"
            width="calc(100% - 8px)"
            height="calc(100% - 8px)"
            fill="none"
            stroke="white"
            strokeWidth="4"
            rx="16"
            opacity="0.4"
          />
        </svg>
      </motion.div>
    </motion.div>
  );
}

// Stat bar with hand-drawn style
function StatBar({ label, value, icon: Icon, color, delay = 0 }: { 
  label: string; 
  value: string; 
  icon: any; 
  color: string;
  delay?: number;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay, type: 'spring', stiffness: 100 }}
      className="relative group"
    >
      {/* Background with sketchy effect */}
      <svg className="absolute inset-0 w-full h-full pointer-events-none">
        <rect
          x="2"
          y="2"
          width="calc(100% - 4px)"
          height="calc(100% - 4px)"
          fill="rgba(255,255,255,0.5)"
          stroke={color}
          strokeWidth="2"
          rx="8"
        />
      </svg>

      <div className="relative z-10 px-4 py-3 flex items-center gap-3">
        <motion.div
          whileHover={{ rotate: 360 }}
          transition={{ duration: 0.5 }}
          className="flex-shrink-0"
        >
          <Icon className="w-5 h-5" style={{ color }} strokeWidth={2.5} />
        </motion.div>
        <div className="flex-1 min-w-0">
          <p className="text-xs text-gray-600 uppercase tracking-wide" style={{ fontFamily: 'Cabin Sketch, cursive' }}>
            {label}
          </p>
          <p className="font-medium text-[#5D4E37] truncate" style={{ fontFamily: 'Patrick Hand, cursive', fontSize: '1rem' }}>
            {value || '---'}
          </p>
        </div>
        {value && (
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: delay + 0.3 }}
          >
            <CheckCircle2 className="w-5 h-5 text-[#00AB39]" />
          </motion.div>
        )}
      </div>
    </motion.div>
  );
}

export function PilgrimCard({ onNext, onBack, prefillData }: PilgrimCardProps) {
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    secondLastName: '',
    phone: '',
    nationality: '',
    country: '',
    addressLine1: '',
    addressLine2: '',
    postalCode: '',
    city: '',
    dateOfBirth: '',
    email: '',
    emergencyContact: '',
    emergencyPhone: ''
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [showStats, setShowStats] = useState(false);

  // Prefill from OCR data
  useEffect(() => {
    if (prefillData) {
      setFormData(prev => ({
        ...prev,
        firstName: prefillData.firstName,
        lastName: prefillData.lastName,
        secondLastName: prefillData.secondLastName,
        dateOfBirth: prefillData.dateOfBirth,
        nationality: prefillData.nationality === 'ESP' ? 'Spain' : prefillData.nationality,
        country: prefillData.nationality === 'ESP' ? 'Spain' : prefillData.nationality
      }));
      setTimeout(() => setShowStats(true), 500);
    }
  }, [prefillData]);

  const handleChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  const handleAddressSelect = (place: { address: string; city: string; postalCode: string; country: string }) => {
    setFormData(prev => ({
      ...prev,
      addressLine1: place.address,
      city: place.city,
      postalCode: place.postalCode
    }));
  };

  const handlePostalCodeChange = (value: string) => {
    handleChange('postalCode', value);
    
    if (value.length >= 5) {
      setTimeout(() => {
        const mockCities: Record<string, string> = {
          '28001': 'Madrid',
          '08001': 'Barcelona',
          '41001': 'Sevilla',
          '46001': 'Valencia',
          '06800': 'Mérida',
          '10003': 'Cáceres'
        };
        const city = mockCities[value] || '';
        if (city) {
          handleChange('city', city);
        }
      }, 500);
    }
  };

  const validateForm = () => {
    const newErrors: Record<string, string> = {};
    
    if (!formData.firstName) newErrors.firstName = 'First name is required';
    if (!formData.lastName) newErrors.lastName = 'Last name is required';
    if (!formData.phone) newErrors.phone = 'Phone number is required';
    if (!formData.nationality) newErrors.nationality = 'Nationality is required';
    if (!formData.country) newErrors.country = 'Country is required';
    if (!formData.addressLine1) newErrors.addressLine1 = 'Address is required';
    if (!formData.postalCode) newErrors.postalCode = 'Postal code is required';
    if (!formData.city) newErrors.city = 'City is required';
    if (!formData.dateOfBirth) newErrors.dateOfBirth = 'Date of birth is required';

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = () => {
    if (validateForm()) {
      onNext(formData);
    }
  };

  // Calculate "Pilgrim Score" based on form completion
  const calculateScore = () => {
    const fields = Object.keys(formData);
    const filled = fields.filter(key => formData[key as keyof typeof formData]).length;
    return Math.round((filled / fields.length) * 100);
  };

  const pilgrimScore = calculateScore();

  return (
    <div className="max-w-7xl mx-auto">
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, type: 'spring' }}
      >
        {/* Header with rough notation */}
        <div className="text-center mb-8">
          <motion.h1 
            className="text-4xl md:text-5xl sketch-title text-[#5D4E37] mb-3"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            <RoughUnderline color="#00AB39" delay={0.5}>
              Pilgrim Overview & Status
            </RoughUnderline>
          </motion.h1>
          <motion.p 
            className="text-lg text-gray-600 hand-drawn"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4 }}
          >
            Complete your pilgrim profile
          </motion.p>
        </div>

        {/* FIFA-Style Card Layout */}
        <div className="relative">
          {/* Main card container with 3D effect */}
          <motion.div
            className="relative overflow-hidden rounded-3xl"
            initial={{ scale: 0.95, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: 0.3, type: 'spring', stiffness: 100 }}
            style={{
              background: 'linear-gradient(135deg, rgba(0, 171, 57, 0.1) 0%, rgba(0, 113, 188, 0.1) 100%)',
            }}
          >
            {/* Sketchy border */}
            <svg className="absolute inset-0 w-full h-full pointer-events-none" style={{ filter: 'drop-shadow(4px 6px 12px rgba(0,0,0,0.15))' }}>
              <rect
                x="6"
                y="6"
                width="calc(100% - 12px)"
                height="calc(100% - 12px)"
                fill="none"
                stroke="#D4A574"
                strokeWidth="4"
                rx="24"
              />
            </svg>

            <div className="relative z-10 p-6 md:p-10">
              <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">
                {/* Left side - Stats & Info (FIFA style) */}
                <div className="lg:col-span-3 space-y-6">
                  {/* Player name header */}
                  <motion.div
                    initial={{ opacity: 0, x: -30 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.4 }}
                    className="relative"
                  >
                    <div className="inline-block">
                      <p className="text-sm text-gray-600 uppercase tracking-wider mb-1" style={{ fontFamily: 'Cabin Sketch, cursive' }}>
                        Pilgrim
                      </p>
                      <h2 className="text-4xl md:text-5xl sketch-title" style={{ color: '#00AB39' }}>
                        <SketchyCircle color="#00AB39" delay={0.8}>
                          {formData.firstName || 'Your Name'}
                        </SketchyCircle>
                      </h2>
                      <h3 className="text-3xl md:text-4xl sketch-title text-[#5D4E37] mt-1">
                        {formData.lastName} {formData.secondLastName}
                      </h3>
                    </div>

                    {/* Pilgrim Score Badge */}
                    <motion.div
                      className="absolute -top-4 -right-4 w-24 h-24 flex items-center justify-center"
                      initial={{ scale: 0, rotate: -180 }}
                      animate={{ scale: 1, rotate: 0 }}
                      transition={{ delay: 0.6, type: 'spring', stiffness: 200 }}
                    >
                      <svg className="absolute inset-0 w-full h-full">
                        <defs>
                          <linearGradient id="score-gradient" x1="0%" y1="0%" x2="100%" y2="100%">
                            <stop offset="0%" stopColor="#00AB39" />
                            <stop offset="100%" stopColor="#0071BC" />
                          </linearGradient>
                        </defs>
                        <motion.circle
                          cx="50%"
                          cy="50%"
                          r="40"
                          fill="url(#score-gradient)"
                          stroke="white"
                          strokeWidth="3"
                          initial={{ pathLength: 0 }}
                          animate={{ pathLength: 1 }}
                          transition={{ delay: 0.8, duration: 1 }}
                        />
                      </svg>
                      <div className="relative z-10 text-center">
                        <motion.div
                          initial={{ scale: 0 }}
                          animate={{ scale: 1 }}
                          transition={{ delay: 1, type: 'spring' }}
                        >
                          <p className="text-3xl font-bold text-white sketch-title">{pilgrimScore}</p>
                          <p className="text-xs text-white/80" style={{ fontFamily: 'Cabin Sketch, cursive' }}>OVR</p>
                        </motion.div>
                      </div>
                    </motion.div>
                  </motion.div>

                  {/* Status bars */}
                  <div className="space-y-3">
                    <StatBar
                      label="Status"
                      value={pilgrimScore >= 80 ? 'Ready to Journey' : 'In Progress'}
                      icon={Shield}
                      color="#00AB39"
                      delay={0.5}
                    />
                    <StatBar
                      label="Nationality"
                      value={formData.nationality}
                      icon={Flag}
                      color="#0071BC"
                      delay={0.6}
                    />
                    <StatBar
                      label="Contact"
                      value={formData.phone}
                      icon={Phone}
                      color="#FFC837"
                      delay={0.7}
                    />
                    <StatBar
                      label="Location"
                      value={formData.city || formData.country}
                      icon={MapPin}
                      color="#ED1C24"
                      delay={0.8}
                    />
                  </div>

                  {/* Form Fields with sketchy inputs */}
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.9 }}
                    className="space-y-4 mt-8"
                  >
                    {/* Personal Info Section */}
                    <div className="relative">
                      <svg className="absolute inset-0 w-full h-full pointer-events-none">
                        <rect
                          x="3"
                          y="3"
                          width="calc(100% - 6px)"
                          height="calc(100% - 6px)"
                          fill="white"
                          stroke="#00AB39"
                          strokeWidth="2.5"
                          rx="16"
                        />
                      </svg>
                      
                      <div className="relative z-10 p-6 space-y-4">
                        <h4 className="text-xl sketch-title text-[#00AB39] mb-4 flex items-center gap-2">
                          <User className="w-5 h-5" />
                          Personal Details
                        </h4>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          {/* First Name */}
                          <div>
                            <label className="block text-sm font-medium text-[#5D4E37] mb-2" style={{ fontFamily: 'Cabin Sketch, cursive' }}>
                              First Name <span className="text-[#ED1C24]">*</span>
                            </label>
                            <input
                              type="text"
                              value={formData.firstName}
                              onChange={(e) => handleChange('firstName', e.target.value)}
                              className={`w-full px-4 py-3 doodle-border bg-[#FFF9F0] focus:outline-none focus:ring-2 ${
                                errors.firstName ? 'focus:ring-[#ED1C24] border-[#ED1C24]' : 'focus:ring-[#00AB39]'
                              }`}
                              style={{ fontFamily: 'Patrick Hand, cursive' }}
                            />
                            {errors.firstName && (
                              <p className="text-xs text-[#ED1C24] mt-1">{errors.firstName}</p>
                            )}
                          </div>

                          {/* Last Name */}
                          <div>
                            <label className="block text-sm font-medium text-[#5D4E37] mb-2" style={{ fontFamily: 'Cabin Sketch, cursive' }}>
                              Last Name <span className="text-[#ED1C24]">*</span>
                            </label>
                            <input
                              type="text"
                              value={formData.lastName}
                              onChange={(e) => handleChange('lastName', e.target.value)}
                              className={`w-full px-4 py-3 doodle-border bg-[#FFF9F0] focus:outline-none focus:ring-2 ${
                                errors.lastName ? 'focus:ring-[#ED1C24] border-[#ED1C24]' : 'focus:ring-[#00AB39]'
                              }`}
                              style={{ fontFamily: 'Patrick Hand, cursive' }}
                            />
                            {errors.lastName && (
                              <p className="text-xs text-[#ED1C24] mt-1">{errors.lastName}</p>
                            )}
                          </div>

                          {/* Second Last Name */}
                          <div>
                            <label className="block text-sm font-medium text-[#5D4E37] mb-2" style={{ fontFamily: 'Cabin Sketch, cursive' }}>
                              Second Last Name
                            </label>
                            <input
                              type="text"
                              value={formData.secondLastName}
                              onChange={(e) => handleChange('secondLastName', e.target.value)}
                              className="w-full px-4 py-3 doodle-border bg-[#FFF9F0] focus:outline-none focus:ring-2 focus:ring-[#00AB39]"
                              style={{ fontFamily: 'Patrick Hand, cursive' }}
                            />
                          </div>

                          {/* Date of Birth */}
                          <div>
                            <label className="block text-sm font-medium text-[#5D4E37] mb-2" style={{ fontFamily: 'Cabin Sketch, cursive' }}>
                              <Calendar className="w-4 h-4 inline mr-1" />
                              Date of Birth <span className="text-[#ED1C24]">*</span>
                            </label>
                            <input
                              type="date"
                              value={formData.dateOfBirth}
                              onChange={(e) => handleChange('dateOfBirth', e.target.value)}
                              className={`w-full px-4 py-3 doodle-border bg-[#FFF9F0] focus:outline-none focus:ring-2 ${
                                errors.dateOfBirth ? 'focus:ring-[#ED1C24] border-[#ED1C24]' : 'focus:ring-[#00AB39]'
                              }`}
                              style={{ fontFamily: 'Patrick Hand, cursive' }}
                            />
                            {errors.dateOfBirth && (
                              <p className="text-xs text-[#ED1C24] mt-1">{errors.dateOfBirth}</p>
                            )}
                          </div>

                          {/* Nationality */}
                          <div>
                            <label className="block text-sm font-medium text-[#5D4E37] mb-2" style={{ fontFamily: 'Cabin Sketch, cursive' }}>
                              <Flag className="w-4 h-4 inline mr-1" />
                              Nationality <span className="text-[#ED1C24]">*</span>
                            </label>
                            <input
                              type="text"
                              value={formData.nationality}
                              onChange={(e) => handleChange('nationality', e.target.value)}
                              className={`w-full px-4 py-3 doodle-border bg-[#FFF9F0] focus:outline-none focus:ring-2 ${
                                errors.nationality ? 'focus:ring-[#ED1C24] border-[#ED1C24]' : 'focus:ring-[#00AB39]'
                              }`}
                              style={{ fontFamily: 'Patrick Hand, cursive' }}
                              placeholder="e.g., Spain, France, UK"
                            />
                            {errors.nationality && (
                              <p className="text-xs text-[#ED1C24] mt-1">{errors.nationality}</p>
                            )}
                          </div>

                          {/* Phone */}
                          <div>
                            <label className="block text-sm font-medium text-[#5D4E37] mb-2" style={{ fontFamily: 'Cabin Sketch, cursive' }}>
                              <Phone className="w-4 h-4 inline mr-1" />
                              Phone <span className="text-[#ED1C24]">*</span>
                            </label>
                            <PhoneInput
                              value={formData.phone}
                              onChange={(value) => handleChange('phone', value)}
                              error={errors.phone}
                            />
                          </div>

                          {/* Email */}
                          <div className="md:col-span-2">
                            <label className="block text-sm font-medium text-[#5D4E37] mb-2" style={{ fontFamily: 'Cabin Sketch, cursive' }}>
                              <Mail className="w-4 h-4 inline mr-1" />
                              Email
                            </label>
                            <input
                              type="email"
                              value={formData.email}
                              onChange={(e) => handleChange('email', e.target.value)}
                              className="w-full px-4 py-3 doodle-border bg-[#FFF9F0] focus:outline-none focus:ring-2 focus:ring-[#00AB39]"
                              style={{ fontFamily: 'Patrick Hand, cursive' }}
                              placeholder="pilgrim@caminodesantiago.com"
                            />
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Address Section */}
                    <div className="relative">
                      <svg className="absolute inset-0 w-full h-full pointer-events-none">
                        <rect
                          x="3"
                          y="3"
                          width="calc(100% - 6px)"
                          height="calc(100% - 6px)"
                          fill="white"
                          stroke="#0071BC"
                          strokeWidth="2.5"
                          rx="16"
                        />
                      </svg>
                      
                      <div className="relative z-10 p-6 space-y-4">
                        <h4 className="text-xl sketch-title text-[#0071BC] mb-4 flex items-center gap-2">
                          <MapPin className="w-5 h-5" />
                          Home Address
                        </h4>

                        <div className="grid grid-cols-1 gap-4">
                          {/* Country */}
                          <div>
                            <label className="block text-sm font-medium text-[#5D4E37] mb-2" style={{ fontFamily: 'Cabin Sketch, cursive' }}>
                              Country <span className="text-[#ED1C24]">*</span>
                            </label>
                            <input
                              type="text"
                              value={formData.country}
                              onChange={(e) => handleChange('country', e.target.value)}
                              className={`w-full px-4 py-3 doodle-border bg-[#FFF9F0] focus:outline-none focus:ring-2 ${
                                errors.country ? 'focus:ring-[#ED1C24] border-[#ED1C24]' : 'focus:ring-[#0071BC]'
                              }`}
                              style={{ fontFamily: 'Patrick Hand, cursive' }}
                            />
                            {errors.country && (
                              <p className="text-xs text-[#ED1C24] mt-1">{errors.country}</p>
                            )}
                          </div>

                          {/* Address Line 1 */}
                          <div>
                            <label className="block text-sm font-medium text-[#5D4E37] mb-2" style={{ fontFamily: 'Cabin Sketch, cursive' }}>
                              Address Line 1 <span className="text-[#ED1C24]">*</span>
                            </label>
                            <AddressAutocomplete
                              value={formData.addressLine1}
                              onChange={(value) => handleChange('addressLine1', value)}
                              onSelect={handleAddressSelect}
                              error={errors.addressLine1}
                            />
                          </div>

                          {/* Address Line 2 */}
                          <div>
                            <label className="block text-sm font-medium text-[#5D4E37] mb-2" style={{ fontFamily: 'Cabin Sketch, cursive' }}>
                              Address Line 2
                            </label>
                            <input
                              type="text"
                              value={formData.addressLine2}
                              onChange={(e) => handleChange('addressLine2', e.target.value)}
                              className="w-full px-4 py-3 doodle-border bg-[#FFF9F0] focus:outline-none focus:ring-2 focus:ring-[#0071BC]"
                              style={{ fontFamily: 'Patrick Hand, cursive' }}
                              placeholder="Apartment, suite, etc."
                            />
                          </div>

                          <div className="grid grid-cols-2 gap-4">
                            {/* Postal Code */}
                            <div>
                              <label className="block text-sm font-medium text-[#5D4E37] mb-2" style={{ fontFamily: 'Cabin Sketch, cursive' }}>
                                Postal Code <span className="text-[#ED1C24]">*</span>
                              </label>
                              <input
                                type="text"
                                value={formData.postalCode}
                                onChange={(e) => handlePostalCodeChange(e.target.value)}
                                className={`w-full px-4 py-3 doodle-border bg-[#FFF9F0] focus:outline-none focus:ring-2 ${
                                  errors.postalCode ? 'focus:ring-[#ED1C24] border-[#ED1C24]' : 'focus:ring-[#0071BC]'
                                }`}
                                style={{ fontFamily: 'Patrick Hand, cursive' }}
                              />
                              {errors.postalCode && (
                                <p className="text-xs text-[#ED1C24] mt-1">{errors.postalCode}</p>
                              )}
                            </div>

                            {/* City */}
                            <div>
                              <label className="block text-sm font-medium text-[#5D4E37] mb-2" style={{ fontFamily: 'Cabin Sketch, cursive' }}>
                                City <span className="text-[#ED1C24]">*</span>
                              </label>
                              <input
                                type="text"
                                value={formData.city}
                                onChange={(e) => handleChange('city', e.target.value)}
                                className={`w-full px-4 py-3 doodle-border bg-[#FFF9F0] focus:outline-none focus:ring-2 ${
                                  errors.city ? 'focus:ring-[#ED1C24] border-[#ED1C24]' : 'focus:ring-[#0071BC]'
                                }`}
                                style={{ fontFamily: 'Patrick Hand, cursive' }}
                              />
                              {errors.city && (
                                <p className="text-xs text-[#ED1C24] mt-1">{errors.city}</p>
                              )}
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Emergency Contact Section */}
                    <div className="relative">
                      <svg className="absolute inset-0 w-full h-full pointer-events-none">
                        <rect
                          x="3"
                          y="3"
                          width="calc(100% - 6px)"
                          height="calc(100% - 6px)"
                          fill="white"
                          stroke="#FFC837"
                          strokeWidth="2.5"
                          rx="16"
                        />
                      </svg>
                      
                      <div className="relative z-10 p-6 space-y-4">
                        <h4 className="text-xl sketch-title text-[#D4A574] mb-4 flex items-center gap-2">
                          <Heart className="w-5 h-5" />
                          Emergency Contact (Optional)
                        </h4>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          {/* Emergency Contact Name */}
                          <div>
                            <label className="block text-sm font-medium text-[#5D4E37] mb-2" style={{ fontFamily: 'Cabin Sketch, cursive' }}>
                              Contact Name
                            </label>
                            <input
                              type="text"
                              value={formData.emergencyContact}
                              onChange={(e) => handleChange('emergencyContact', e.target.value)}
                              className="w-full px-4 py-3 doodle-border bg-[#FFF9F0] focus:outline-none focus:ring-2 focus:ring-[#FFC837]"
                              style={{ fontFamily: 'Patrick Hand, cursive' }}
                            />
                          </div>

                          {/* Emergency Phone */}
                          <div>
                            <label className="block text-sm font-medium text-[#5D4E37] mb-2" style={{ fontFamily: 'Cabin Sketch, cursive' }}>
                              Emergency Phone
                            </label>
                            <PhoneInput
                              value={formData.emergencyPhone}
                              onChange={(value) => handleChange('emergencyPhone', value)}
                            />
                          </div>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                </div>

                {/* Right side - 3D Photo Card (FIFA style) */}
                <div className="lg:col-span-2">
                  <motion.div
                    initial={{ opacity: 0, x: 50, rotateY: -20 }}
                    animate={{ opacity: 1, x: 0, rotateY: 0 }}
                    transition={{ delay: 0.5, type: 'spring', stiffness: 80 }}
                    className="sticky top-8 h-[600px]"
                  >
                    <PhotoCard3D />
                  </motion.div>
                </div>
              </div>
            </div>

            {/* Animated particles background */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none opacity-20">
              {[...Array(20)].map((_, i) => (
                <motion.div
                  key={i}
                  className="absolute w-2 h-2 rounded-full bg-[#00AB39]"
                  style={{
                    left: `${Math.random() * 100}%`,
                    top: `${Math.random() * 100}%`,
                  }}
                  animate={{
                    y: [0, -30, 0],
                    opacity: [0.3, 0.8, 0.3],
                  }}
                  transition={{
                    duration: 3 + Math.random() * 2,
                    repeat: Infinity,
                    delay: Math.random() * 2,
                  }}
                />
              ))}
            </div>
          </motion.div>

          {/* Navigation Buttons */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1 }}
            className="flex gap-4 justify-between mt-8"
          >
            <WiredButton
              variant="outline"
              size="lg"
              onClick={onBack}
            >
              ← Back to ID Upload
            </WiredButton>
            
            <WiredButton
              variant="primary"
              size="lg"
              onClick={handleSubmit}
            >
              Continue to Bed Selection →
            </WiredButton>
          </motion.div>
        </div>
      </motion.div>
    </div>
  );
}
