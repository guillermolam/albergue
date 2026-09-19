import { motion } from 'motion/react';
import { WiredButton } from '../doodle/WiredButton';
import { PhoneInput } from '../doodle/PhoneInput';
import { AddressAutocomplete } from '../doodle/AddressAutocomplete';
import { useState, useEffect } from 'react';
import { User } from 'lucide-react';
import { useI18n } from '../hooks/useI18n';

interface PilgrimFormData {
  firstName: string;
  lastName: string;
  secondLastName: string;
  phone: string;
  nationality: string;
  country: string;
  addressLine1: string;
  addressLine2: string;
  postalCode: string;
  city: string;
  dateOfBirth: string;
  email: string;
  emergencyContact: string;
  emergencyPhone: string;
}

interface PilgrimFormStepProps {
  onNext: (formData: PilgrimFormData) => void;
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

export function PilgrimFormStep({ onNext, onBack, prefillData }: PilgrimFormStepProps) {
  const { locale } = useI18n();
  const isEs = locale !== 'en';

  const [formData, setFormData] = useState<PilgrimFormData>({
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
    emergencyPhone: '',
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    if (prefillData) {
      setFormData((prev) => ({
        ...prev,
        firstName: prefillData.firstName,
        lastName: prefillData.lastName,
        secondLastName: prefillData.secondLastName,
        dateOfBirth: prefillData.dateOfBirth,
        nationality: prefillData.nationality === 'ESP' ? 'Spain' : prefillData.nationality,
        country: prefillData.nationality === 'ESP' ? 'Spain' : prefillData.nationality,
      }));
    }
  }, [prefillData]);

  const handleChange = (field: keyof PilgrimFormData, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: '' }));
    }
  };

  const handleAddressSelect = (place: {
    address: string;
    city: string;
    postalCode: string;
    country: string;
  }) => {
    setFormData((prev) => ({
      ...prev,
      addressLine1: place.address,
      city: place.city,
      postalCode: place.postalCode,
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
          '10003': 'Cáceres',
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
    const req = (v: string) => (isEs ? 'Este campo es obligatorio' : 'This field is required');

    if (!formData.firstName) newErrors.firstName = req(formData.firstName);
    if (!formData.lastName) newErrors.lastName = req(formData.lastName);
    if (!formData.phone) newErrors.phone = req(formData.phone);
    if (!formData.nationality) newErrors.nationality = req(formData.nationality);
    if (!formData.country) newErrors.country = req(formData.country);
    if (!formData.addressLine1) newErrors.addressLine1 = req(formData.addressLine1);
    if (!formData.postalCode) newErrors.postalCode = req(formData.postalCode);
    if (!formData.city) newErrors.city = req(formData.city);
    if (!formData.dateOfBirth) newErrors.dateOfBirth = req(formData.dateOfBirth);

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = () => {
    if (validateForm()) {
      onNext(formData);
    }
  };

  const inputClass = (field: string) =>
    `w-full px-4 py-3 doodle-border bg-[#FFF9F0] focus:outline-none focus:ring-2 ${
      errors[field] ? 'focus:ring-[#ED1C24] border-[#ED1C24]' : 'focus:ring-[#00AB39]'
    }`;

  return (
    <div className="max-w-4xl mx-auto">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <div className="text-center mb-12">
          <motion.div
            initial={{ scale: 0, rotate: -10 }}
            animate={{ scale: 1, rotate: 0 }}
            transition={{ type: 'spring', stiffness: 150, delay: 0.2 }}
            className="inline-block mb-4"
          >
            <User className="w-20 h-20 text-[#00AB39] mx-auto" strokeWidth={2} />
          </motion.div>
          <h1 className="text-4xl md:text-5xl sketch-title text-[#5D4E37] mb-3">
            {isEs ? 'Información del Peregrino' : 'Pilgrim Information'}
          </h1>
          <p className="text-lg text-gray-600 hand-drawn">
            {isEs ? 'Completa tus datos a continuación' : 'Complete your details below'}
          </p>

          <svg className="mx-auto mt-4 w-32 h-2 opacity-40">
            <path
              d="M0,1 Q8,-1 16,1 T32,1 T48,1 T64,1 T80,1 T96,1 T112,1 T128,1"
              stroke="#00AB39"
              strokeWidth="2"
              fill="none"
            />
          </svg>
        </div>

        <div className="relative">
          <svg
            className="absolute inset-0 w-full h-full pointer-events-none"
            style={{ filter: 'drop-shadow(3px 4px 6px rgba(0,0,0,0.1))' }}
          >
            <rect
              x="4"
              y="4"
              width="calc(100% - 8px)"
              height="calc(100% - 8px)"
              fill="white"
              stroke="#D4A574"
              strokeWidth="3.5"
              rx="24"
            />
            <rect
              x="6"
              y="6"
              width="calc(100% - 12px)"
              height="calc(100% - 12px)"
              fill="none"
              stroke="#D4A574"
              strokeWidth="2.5"
              rx="22"
              opacity="0.3"
              strokeDasharray="6, 6"
            />
          </svg>

          <div className="relative z-10 p-8 md:p-12 space-y-6">
            <div>
              <h3 className="text-2xl sketch-title text-[#5D4E37] mb-6 flex items-center gap-2">
                <span>👤</span> {isEs ? 'Datos Personales' : 'Personal Details'}
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.1 }}
                >
                  <label className="block text-sm font-medium text-[#5D4E37] mb-2">
                    {isEs ? 'Nombre' : 'First Name'} <span className="text-[#ED1C24]">*</span>
                  </label>
                  <input
                    type="text"
                    value={formData.firstName}
                    onChange={(e) => handleChange('firstName', e.target.value)}
                    className={inputClass('firstName')}
                    style={{ fontFamily: 'Patrick Hand, cursive' }}
                    required
                  />
                  {errors.firstName && (
                    <p className="mt-1 text-xs text-[#ED1C24] hand-drawn">{errors.firstName}</p>
                  )}
                </motion.div>

                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.15 }}
                >
                  <label className="block text-sm font-medium text-[#5D4E37] mb-2">
                    {isEs ? 'Apellido' : 'Last Name'} <span className="text-[#ED1C24]">*</span>
                  </label>
                  <input
                    type="text"
                    value={formData.lastName}
                    onChange={(e) => handleChange('lastName', e.target.value)}
                    className={inputClass('lastName')}
                    style={{ fontFamily: 'Patrick Hand, cursive' }}
                    required
                  />
                  {errors.lastName && (
                    <p className="mt-1 text-xs text-[#ED1C24] hand-drawn">{errors.lastName}</p>
                  )}
                </motion.div>

                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2 }}
                >
                  <label className="block text-sm font-medium text-[#5D4E37] mb-2">
                    {isEs ? 'Segundo Apellido' : 'Second Last Name'}
                  </label>
                  <input
                    type="text"
                    value={formData.secondLastName}
                    onChange={(e) => handleChange('secondLastName', e.target.value)}
                    className="w-full px-4 py-3 doodle-border bg-[#FFF9F0] focus:outline-none focus:ring-2 focus:ring-[#00AB39]"
                    style={{ fontFamily: 'Patrick Hand, cursive' }}
                  />
                </motion.div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.25 }}
                >
                  <label className="block text-sm font-medium text-[#5D4E37] mb-2">
                    {isEs ? 'Fecha de Nacimiento' : 'Date of Birth'}{' '}
                    <span className="text-[#ED1C24]">*</span>
                  </label>
                  <input
                    type="date"
                    value={formData.dateOfBirth}
                    onChange={(e) => handleChange('dateOfBirth', e.target.value)}
                    className={inputClass('dateOfBirth')}
                    style={{ fontFamily: 'Patrick Hand, cursive' }}
                    required
                  />
                  {errors.dateOfBirth && (
                    <p className="mt-1 text-xs text-[#ED1C24] hand-drawn">{errors.dateOfBirth}</p>
                  )}
                </motion.div>

                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3 }}
                >
                  <label className="block text-sm font-medium text-[#5D4E37] mb-2">
                    {isEs ? 'Nacionalidad' : 'Nationality'}{' '}
                    <span className="text-[#ED1C24]">*</span>
                  </label>
                  <input
                    type="text"
                    value={formData.nationality}
                    onChange={(e) => handleChange('nationality', e.target.value)}
                    placeholder={isEs ? 'p.ej., España' : 'e.g., Spain'}
                    className="w-full px-4 py-3 doodle-border bg-[#FFF9F0] focus:outline-none focus:ring-2 focus:ring-[#00AB39]"
                    style={{ fontFamily: 'Patrick Hand, cursive' }}
                    required
                  />
                </motion.div>
              </div>
            </div>

            <div className="pt-6 border-t-2 border-dashed border-gray-300">
              <h3 className="text-2xl sketch-title text-[#5D4E37] mb-6 flex items-center gap-2">
                <span>📞</span> {isEs ? 'Información de Contacto' : 'Contact Information'}
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.35 }}
                >
                  <PhoneInput
                    value={formData.phone}
                    onChange={(value) => handleChange('phone', value)}
                    label={isEs ? 'Teléfono' : 'Phone Number'}
                    defaultCountry="ES"
                    required
                  />
                  {errors.phone && (
                    <p className="mt-1 text-xs text-[#ED1C24] hand-drawn">{errors.phone}</p>
                  )}
                </motion.div>

                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.4 }}
                >
                  <label className="block text-sm font-medium text-[#5D4E37] mb-2">
                    {isEs ? 'Correo Electrónico' : 'Email Address'}{' '}
                    <span className="text-[#ED1C24]">*</span>
                  </label>
                  <input
                    type="email"
                    value={formData.email}
                    onChange={(e) => handleChange('email', e.target.value)}
                    placeholder="your@email.com"
                    className={inputClass('email')}
                    style={{ fontFamily: 'Patrick Hand, cursive' }}
                    required
                  />
                  {errors.email && (
                    <p className="mt-1 text-xs text-[#ED1C24] hand-drawn">{errors.email}</p>
                  )}
                </motion.div>
              </div>
            </div>

            <div className="pt-6 border-t-2 border-dashed border-gray-300">
              <h3 className="text-2xl sketch-title text-[#5D4E37] mb-6 flex items-center gap-2">
                <span>🏠</span> {isEs ? 'Dirección' : 'Home Address'}
              </h3>
              <div className="space-y-6">
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.45 }}
                >
                  <label className="block text-sm font-medium text-[#5D4E37] mb-2">
                    {isEs ? 'País' : 'Country'} <span className="text-[#ED1C24]">*</span>
                  </label>
                  <input
                    type="text"
                    value={formData.country}
                    onChange={(e) => handleChange('country', e.target.value)}
                    placeholder={isEs ? 'España' : 'Spain'}
                    className={inputClass('country').replace(
                      'focus:ring-[#00AB39]',
                      'focus:ring-[#0071BC]'
                    )}
                    style={{ fontFamily: 'Patrick Hand, cursive' }}
                    required
                  />
                  {errors.country && (
                    <p className="mt-1 text-xs text-[#ED1C24] hand-drawn">{errors.country}</p>
                  )}
                </motion.div>

                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.5 }}
                >
                  <AddressAutocomplete
                    value={formData.addressLine1}
                    onChange={(value) => handleChange('addressLine1', value)}
                    onPlaceSelected={handleAddressSelect}
                    label={isEs ? 'Dirección Línea 1' : 'Address Line 1'}
                    placeholder={
                      isEs
                        ? 'Empieza a escribir tu dirección...'
                        : 'Start typing your street address...'
                    }
                    required
                  />
                  {errors.addressLine1 && (
                    <p className="mt-1 text-xs text-[#ED1C24] hand-drawn">{errors.addressLine1}</p>
                  )}
                </motion.div>

                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.55 }}
                >
                  <label className="block text-sm font-medium text-[#5D4E37] mb-2">
                    {isEs ? 'Dirección Línea 2 (Opcional)' : 'Address Line 2 (Optional)'}
                  </label>
                  <input
                    type="text"
                    value={formData.addressLine2}
                    onChange={(e) => handleChange('addressLine2', e.target.value)}
                    placeholder={isEs ? 'Piso, puerta, etc.' : 'Apartment, suite, etc.'}
                    className="w-full px-4 py-3 doodle-border bg-[#FFF9F0] focus:outline-none focus:ring-2 focus:ring-[#0071BC]"
                    style={{ fontFamily: 'Patrick Hand, cursive' }}
                  />
                </motion.div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.6 }}
                  >
                    <label className="block text-sm font-medium text-[#5D4E37] mb-2">
                      {isEs ? 'Código Postal' : 'Postal / ZIP Code'}{' '}
                      <span className="text-[#ED1C24]">*</span>
                    </label>
                    <input
                      type="text"
                      value={formData.postalCode}
                      onChange={(e) => handlePostalCodeChange(e.target.value)}
                      placeholder="28001"
                      className={inputClass('postalCode').replace(
                        'focus:ring-[#00AB39]',
                        'focus:ring-[#0071BC]'
                      )}
                      style={{ fontFamily: 'Patrick Hand, cursive' }}
                      required
                    />
                    {errors.postalCode && (
                      <p className="mt-1 text-xs text-[#ED1C24] hand-drawn">{errors.postalCode}</p>
                    )}
                    {formData.postalCode && formData.postalCode.length >= 5 && (
                      <motion.p
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className="mt-1 text-xs text-[#00AB39] hand-drawn flex items-center gap-1"
                      >
                        <span>✓</span>{' '}
                        {isEs ? 'Autocompletando ciudad...' : 'Autocompleting city...'}
                      </motion.p>
                    )}
                  </motion.div>

                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.65 }}
                  >
                    <label className="block text-sm font-medium text-[#5D4E37] mb-2">
                      {isEs ? 'Ciudad' : 'City'} <span className="text-[#ED1C24]">*</span>
                    </label>
                    <input
                      type="text"
                      value={formData.city}
                      onChange={(e) => handleChange('city', e.target.value)}
                      placeholder="Madrid"
                      className={inputClass('city').replace(
                        'focus:ring-[#00AB39]',
                        'focus:ring-[#0071BC]'
                      )}
                      style={{ fontFamily: 'Patrick Hand, cursive' }}
                      required
                    />
                    {errors.city && (
                      <p className="mt-1 text-xs text-[#ED1C24] hand-drawn">{errors.city}</p>
                    )}
                  </motion.div>
                </div>
              </div>
            </div>

            <div className="pt-6 border-t-2 border-dashed border-gray-300">
              <h3 className="text-2xl sketch-title text-[#5D4E37] mb-6 flex items-center gap-2">
                <span>🚨</span> {isEs ? 'Contacto de Emergencia' : 'Emergency Contact'}
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.7 }}
                >
                  <label className="block text-sm font-medium text-[#5D4E37] mb-2">
                    {isEs ? 'Nombre de Contacto' : 'Contact Name'}
                  </label>
                  <input
                    type="text"
                    value={formData.emergencyContact}
                    onChange={(e) => handleChange('emergencyContact', e.target.value)}
                    placeholder="John Doe"
                    className="w-full px-4 py-3 doodle-border bg-[#FFF9F0] focus:outline-none focus:ring-2 focus:ring-[#00AB39]"
                    style={{ fontFamily: 'Patrick Hand, cursive' }}
                  />
                </motion.div>

                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.75 }}
                >
                  <PhoneInput
                    value={formData.emergencyPhone}
                    onChange={(value) => handleChange('emergencyPhone', value)}
                    label={isEs ? 'Teléfono de Emergencia' : 'Emergency Phone'}
                    defaultCountry="ES"
                    required={false}
                  />
                </motion.div>
              </div>
            </div>
          </div>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8 }}
          className="mt-10 flex gap-4 justify-between"
        >
          <WiredButton variant="outline" size="lg" onClick={onBack}>
            ← {isEs ? 'Volver a Documento' : 'Back to ID Upload'}
          </WiredButton>

          <WiredButton variant="primary" size="lg" onClick={handleSubmit}>
            {isEs ? 'Continuar a Selección de Cama' : 'Continue to Bed Selection'} →
          </WiredButton>
        </motion.div>
      </motion.div>
    </div>
  );
}
