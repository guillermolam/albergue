import { motion } from 'motion/react';
import { WiredButton } from '../doodle/WiredButton';
import { PhoneInput } from '../doodle/PhoneInput';
import { AddressAutocomplete } from '../doodle/AddressAutocomplete';
import { useState, useEffect } from 'react';
import { UserIcon as User } from '../doodle/DoodleIcons';
import { useI18n } from '../hooks/useI18n';
import { countries } from '../constants/countries';

interface PilgrimFormData {
  firstName: string;
  lastName: string;
  secondLastName: string;
  phone: string;
  nationality: string;
  country: string;
  documentType: 'dni' | 'nie' | 'passport' | '';
  documentNumber: string;
  gender: 'male' | 'female' | 'other' | '';
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
  /** Returns true on a successful server submit (advance to the next step)
   * or false on failure (stay on this step, error already surfaced by the
   * parent -- see BookingFlow.tsx's handleFormNext). */
  onNext: (formData: PilgrimFormData) => Promise<boolean>;
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

// Bounds mirror src/actions/index.ts's booking.setContact Zod schema exactly
// -- keep these in sync if that schema changes.
const FIELD_LIMITS = {
  firstName: { min: 1, max: 80 },
  lastName: { min: 1, max: 80 },
  secondLastName: { min: 0, max: 80 },
  phone: { min: 6, max: 32 },
  nationality: { min: 0, max: 64 },
  country: { min: 2, max: 64 },
  documentNumber: { min: 3, max: 32 },
  addressLine1: { min: 1, max: 120 },
  addressLine2: { min: 0, max: 80 },
  postalCode: { min: 3, max: 16 },
  city: { min: 1, max: 80 },
  email: { min: 0, max: 254 },
  emergencyContact: { min: 0, max: 120 },
} as const;

/** Single copy-object lookup instead of ~25 scattered `isEs ? a : b`
 * ternaries -- SonarCloud counts each inline ternary as its own
 * cognitive-complexity point, and this form genuinely has that many
 * bilingual labels. One ternary (`t = isEs ? ... : ...`) replaces all
 * of them. */
const FORM_COPY = {
  es: {
    title: 'Información del Peregrino',
    subtitle: 'Completa tus datos a continuación',
    personalDetails: 'Datos Personales',
    firstName: 'Nombre',
    lastName: 'Apellido',
    secondLastName: 'Segundo Apellido',
    dateOfBirth: 'Fecha de Nacimiento',
    nationality: 'Nacionalidad',
    nationalityPlaceholder: 'p.ej., España',
    documentType: 'Tipo de Documento',
    documentTypeDni: 'DNI',
    documentTypeNie: 'NIE',
    documentTypePassport: 'Pasaporte',
    documentNumber: 'Número de Documento',
    gender: 'Género',
    genderMale: 'Hombre',
    genderFemale: 'Mujer',
    genderOther: 'Otro',
    genderSelect: 'Selecciona...',
    contactInfo: 'Información de Contacto',
    phone: 'Teléfono',
    email: 'Correo Electrónico',
    address: 'Dirección',
    country: 'País',
    addressLine1: 'Dirección Línea 1',
    addressLine1Placeholder: 'Empieza a escribir tu dirección...',
    addressLine2: 'Dirección Línea 2 (Opcional)',
    addressLine2Placeholder: 'Piso, puerta, etc.',
    postalCode: 'Código Postal',
    city: 'Ciudad',
    emergencyContact: 'Contacto de Emergencia',
    emergencyContactName: 'Nombre de Contacto',
    emergencyPhone: 'Teléfono de Emergencia',
    back: 'Volver a Documento',
    continue: 'Continuar a Selección de Cama',
    submitting: 'Guardando...',
    required: 'Este campo es obligatorio',
    tooShort: 'Demasiado corto',
    tooLong: 'Demasiado largo',
    submitError: 'No se pudieron guardar tus datos. Inténtalo de nuevo.',
  },
  en: {
    title: 'Pilgrim Information',
    subtitle: 'Complete your details below',
    personalDetails: 'Personal Details',
    firstName: 'First Name',
    lastName: 'Last Name',
    secondLastName: 'Second Last Name',
    dateOfBirth: 'Date of Birth',
    nationality: 'Nationality',
    nationalityPlaceholder: 'e.g., Spain',
    documentType: 'Document Type',
    documentTypeDni: 'DNI',
    documentTypeNie: 'NIE',
    documentTypePassport: 'Passport',
    documentNumber: 'Document Number',
    gender: 'Gender',
    genderMale: 'Male',
    genderFemale: 'Female',
    genderOther: 'Other',
    genderSelect: 'Select...',
    contactInfo: 'Contact Information',
    phone: 'Phone Number',
    email: 'Email Address',
    address: 'Home Address',
    country: 'Country',
    addressLine1: 'Address Line 1',
    addressLine1Placeholder: 'Start typing your street address...',
    addressLine2: 'Address Line 2 (Optional)',
    addressLine2Placeholder: 'Apartment, suite, etc.',
    postalCode: 'Postal / ZIP Code',
    city: 'City',
    emergencyContact: 'Emergency Contact',
    emergencyContactName: 'Contact Name',
    emergencyPhone: 'Emergency Phone',
    back: 'Back to ID Upload',
    continue: 'Continue to Bed Selection',
    submitting: 'Saving...',
    required: 'This field is required',
    tooShort: 'Too short',
    tooLong: 'Too long',
    submitError: "Couldn't save your details. Please try again.",
  },
} as const;

export function PilgrimFormStep({ onNext, onBack, prefillData }: PilgrimFormStepProps) {
  const { locale } = useI18n();
  const isEs = locale !== 'en';
  const t = isEs ? FORM_COPY.es : FORM_COPY.en;

  const [formData, setFormData] = useState<PilgrimFormData>({
    firstName: '',
    lastName: '',
    secondLastName: '',
    phone: '',
    nationality: '',
    country: 'Spain',
    documentType: '',
    documentNumber: '',
    gender: '',
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
  const [submitting, setSubmitting] = useState(false);

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
      city: place.city || prev.city,
      postalCode: place.postalCode || prev.postalCode,
      country: place.country || prev.country,
    }));
  };

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    const checkLength = (
      field: keyof typeof FIELD_LIMITS,
      value: string,
      requiredOverride?: boolean
    ) => {
      const limits = FIELD_LIMITS[field];
      const required = requiredOverride ?? limits.min > 0;
      if (!value) {
        if (required) newErrors[field] = t.required;
        return;
      }
      if (value.length < limits.min) newErrors[field] = t.tooShort;
      else if (value.length > limits.max) newErrors[field] = t.tooLong;
    };

    checkLength('firstName', formData.firstName);
    checkLength('lastName', formData.lastName);
    checkLength('secondLastName', formData.secondLastName);
    checkLength('phone', formData.phone);
    checkLength('country', formData.country);
    checkLength('documentNumber', formData.documentNumber);
    checkLength('addressLine1', formData.addressLine1);
    checkLength('addressLine2', formData.addressLine2);
    checkLength('postalCode', formData.postalCode);
    checkLength('city', formData.city);
    checkLength('email', formData.email, false);

    if (!formData.documentType) newErrors.documentType = t.required;
    if (!formData.gender) newErrors.gender = t.required;
    if (!formData.dateOfBirth) newErrors.dateOfBirth = t.required;

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async () => {
    if (!validateForm() || submitting) return;

    setSubmitting(true);
    const ok = await onNext(formData);
    setSubmitting(false);
    if (!ok) {
      setErrors((prev) => ({ ...prev, _form: t.submitError }));
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
            <User className="w-20 h-20 text-[#00AB39] mx-auto" />
          </motion.div>
          <h1 className="text-4xl md:text-5xl sketch-title text-[#5D4E37] mb-3">{t.title}</h1>
          <p className="text-lg text-gray-600 hand-drawn">{t.subtitle}</p>

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
                <span>👤</span> {t.personalDetails}
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.1 }}
                >
                  <label className="block text-sm font-medium text-[#5D4E37] mb-2">
                    {t.firstName} <span className="text-[#ED1C24]">*</span>
                  </label>
                  <input
                    type="text"
                    value={formData.firstName}
                    onChange={(e) => handleChange('firstName', e.target.value)}
                    className={inputClass('firstName')}
                    style={{ fontFamily: 'Patrick Hand, cursive' }}
                    autoComplete="given-name"
                    minLength={FIELD_LIMITS.firstName.min}
                    maxLength={FIELD_LIMITS.firstName.max}
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
                    {t.lastName} <span className="text-[#ED1C24]">*</span>
                  </label>
                  <input
                    type="text"
                    value={formData.lastName}
                    onChange={(e) => handleChange('lastName', e.target.value)}
                    className={inputClass('lastName')}
                    style={{ fontFamily: 'Patrick Hand, cursive' }}
                    autoComplete="family-name"
                    minLength={FIELD_LIMITS.lastName.min}
                    maxLength={FIELD_LIMITS.lastName.max}
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
                    {t.secondLastName}
                  </label>
                  <input
                    type="text"
                    value={formData.secondLastName}
                    onChange={(e) => handleChange('secondLastName', e.target.value)}
                    className="w-full px-4 py-3 doodle-border bg-[#FFF9F0] focus:outline-none focus:ring-2 focus:ring-[#00AB39]"
                    style={{ fontFamily: 'Patrick Hand, cursive' }}
                    maxLength={FIELD_LIMITS.secondLastName.max}
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
                    {t.dateOfBirth} <span className="text-[#ED1C24]">*</span>
                  </label>
                  <input
                    type="date"
                    value={formData.dateOfBirth}
                    onChange={(e) => handleChange('dateOfBirth', e.target.value)}
                    className={inputClass('dateOfBirth')}
                    style={{ fontFamily: 'Patrick Hand, cursive' }}
                    autoComplete="bday"
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
                    {t.nationality}
                  </label>
                  <input
                    type="text"
                    value={formData.nationality}
                    onChange={(e) => handleChange('nationality', e.target.value)}
                    placeholder={t.nationalityPlaceholder}
                    className="w-full px-4 py-3 doodle-border bg-[#FFF9F0] focus:outline-none focus:ring-2 focus:ring-[#00AB39]"
                    style={{ fontFamily: 'Patrick Hand, cursive' }}
                    maxLength={FIELD_LIMITS.nationality.max}
                  />
                </motion.div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.32 }}
                >
                  <label className="block text-sm font-medium text-[#5D4E37] mb-2">
                    {t.documentType} <span className="text-[#ED1C24]">*</span>
                  </label>
                  <select
                    value={formData.documentType}
                    onChange={(e) => handleChange('documentType', e.target.value)}
                    className={inputClass('documentType')}
                    style={{ fontFamily: 'Patrick Hand, cursive' }}
                    required
                  >
                    <option value="">{t.genderSelect}</option>
                    <option value="dni">{t.documentTypeDni}</option>
                    <option value="nie">{t.documentTypeNie}</option>
                    <option value="passport">{t.documentTypePassport}</option>
                  </select>
                  {errors.documentType && (
                    <p className="mt-1 text-xs text-[#ED1C24] hand-drawn">{errors.documentType}</p>
                  )}
                </motion.div>

                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.34 }}
                >
                  <label className="block text-sm font-medium text-[#5D4E37] mb-2">
                    {t.documentNumber} <span className="text-[#ED1C24]">*</span>
                  </label>
                  <input
                    type="text"
                    value={formData.documentNumber}
                    onChange={(e) => handleChange('documentNumber', e.target.value)}
                    className={inputClass('documentNumber')}
                    style={{ fontFamily: 'Patrick Hand, cursive' }}
                    minLength={FIELD_LIMITS.documentNumber.min}
                    maxLength={FIELD_LIMITS.documentNumber.max}
                    required
                  />
                  {errors.documentNumber && (
                    <p className="mt-1 text-xs text-[#ED1C24] hand-drawn">
                      {errors.documentNumber}
                    </p>
                  )}
                </motion.div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.36 }}
                >
                  <label className="block text-sm font-medium text-[#5D4E37] mb-2">
                    {t.gender} <span className="text-[#ED1C24]">*</span>
                  </label>
                  <select
                    value={formData.gender}
                    onChange={(e) => handleChange('gender', e.target.value)}
                    className={inputClass('gender')}
                    style={{ fontFamily: 'Patrick Hand, cursive' }}
                    autoComplete="sex"
                    required
                  >
                    <option value="">{t.genderSelect}</option>
                    <option value="male">{t.genderMale}</option>
                    <option value="female">{t.genderFemale}</option>
                    <option value="other">{t.genderOther}</option>
                  </select>
                  {errors.gender && (
                    <p className="mt-1 text-xs text-[#ED1C24] hand-drawn">{errors.gender}</p>
                  )}
                </motion.div>
              </div>
            </div>

            <div className="pt-6 border-t-2 border-dashed border-gray-300">
              <h3 className="text-2xl sketch-title text-[#5D4E37] mb-6 flex items-center gap-2">
                <span>📞</span> {t.contactInfo}
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.4 }}
                >
                  <PhoneInput
                    value={formData.phone}
                    onChange={(value) => handleChange('phone', value)}
                    label={t.phone}
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
                  transition={{ delay: 0.42 }}
                >
                  <label className="block text-sm font-medium text-[#5D4E37] mb-2">{t.email}</label>
                  <input
                    type="email"
                    value={formData.email}
                    onChange={(e) => handleChange('email', e.target.value)}
                    placeholder="your@email.com"
                    className={inputClass('email')}
                    style={{ fontFamily: 'Patrick Hand, cursive' }}
                    autoComplete="email"
                    maxLength={FIELD_LIMITS.email.max}
                  />
                  {errors.email && (
                    <p className="mt-1 text-xs text-[#ED1C24] hand-drawn">{errors.email}</p>
                  )}
                </motion.div>
              </div>
            </div>

            <div className="pt-6 border-t-2 border-dashed border-gray-300">
              <h3 className="text-2xl sketch-title text-[#5D4E37] mb-6 flex items-center gap-2">
                <span>🏠</span> {t.address}
              </h3>
              <div className="space-y-6">
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.45 }}
                >
                  <label className="block text-sm font-medium text-[#5D4E37] mb-2">
                    {t.country} <span className="text-[#ED1C24]">*</span>
                  </label>
                  <select
                    value={formData.country}
                    onChange={(e) => handleChange('country', e.target.value)}
                    className={inputClass('country').replace(
                      'focus:ring-[#00AB39]',
                      'focus:ring-[#0071BC]'
                    )}
                    style={{ fontFamily: 'Patrick Hand, cursive' }}
                    autoComplete="country-name"
                    required
                  >
                    {countries.map((c) => (
                      <option key={c.code} value={c.name}>
                        {c.flag} {c.name}
                      </option>
                    ))}
                  </select>
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
                    label={t.addressLine1}
                    placeholder={t.addressLine1Placeholder}
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
                    {t.addressLine2}
                  </label>
                  <input
                    type="text"
                    value={formData.addressLine2}
                    onChange={(e) => handleChange('addressLine2', e.target.value)}
                    placeholder={t.addressLine2Placeholder}
                    className="w-full px-4 py-3 doodle-border bg-[#FFF9F0] focus:outline-none focus:ring-2 focus:ring-[#0071BC]"
                    style={{ fontFamily: 'Patrick Hand, cursive' }}
                    autoComplete="address-line2"
                    maxLength={FIELD_LIMITS.addressLine2.max}
                  />
                </motion.div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.6 }}
                  >
                    <label className="block text-sm font-medium text-[#5D4E37] mb-2">
                      {t.postalCode} <span className="text-[#ED1C24]">*</span>
                    </label>
                    <input
                      type="text"
                      value={formData.postalCode}
                      onChange={(e) => handleChange('postalCode', e.target.value)}
                      placeholder="28001"
                      pattern="[A-Za-z0-9 \-]+"
                      title={
                        isEs
                          ? 'Solo letras, números, espacios y guiones'
                          : 'Letters, numbers, spaces and hyphens only'
                      }
                      className={inputClass('postalCode').replace(
                        'focus:ring-[#00AB39]',
                        'focus:ring-[#0071BC]'
                      )}
                      style={{ fontFamily: 'Patrick Hand, cursive' }}
                      autoComplete="postal-code"
                      minLength={FIELD_LIMITS.postalCode.min}
                      maxLength={FIELD_LIMITS.postalCode.max}
                      required
                    />
                    {errors.postalCode && (
                      <p className="mt-1 text-xs text-[#ED1C24] hand-drawn">{errors.postalCode}</p>
                    )}
                  </motion.div>

                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.65 }}
                  >
                    <label className="block text-sm font-medium text-[#5D4E37] mb-2">
                      {t.city} <span className="text-[#ED1C24]">*</span>
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
                      autoComplete="address-level2"
                      minLength={FIELD_LIMITS.city.min}
                      maxLength={FIELD_LIMITS.city.max}
                      required
                    />
                    {errors.city && (
                      <p className="mt-1 text-xs text-[#ED1C24] hand-drawn">{errors.city}</p>
                    )}
                  </motion.div>
                </div>
              </div>
            </div>

            {/* Not yet persisted server-side -- booking.setContact's schema has
                no emergency-contact fields and neither does the pilgrims
                table. Kept as an optional local convenience until that gap
                is closed with a schema change. */}
            <div className="pt-6 border-t-2 border-dashed border-gray-300">
              <h3 className="text-2xl sketch-title text-[#5D4E37] mb-6 flex items-center gap-2">
                <span>🚨</span> {t.emergencyContact}
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.7 }}
                >
                  <label className="block text-sm font-medium text-[#5D4E37] mb-2">
                    {t.emergencyContactName}
                  </label>
                  <input
                    type="text"
                    value={formData.emergencyContact}
                    onChange={(e) => handleChange('emergencyContact', e.target.value)}
                    placeholder="John Doe"
                    className="w-full px-4 py-3 doodle-border bg-[#FFF9F0] focus:outline-none focus:ring-2 focus:ring-[#00AB39]"
                    style={{ fontFamily: 'Patrick Hand, cursive' }}
                    maxLength={FIELD_LIMITS.emergencyContact.max}
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
                    label={t.emergencyPhone}
                    defaultCountry="ES"
                    required={false}
                  />
                </motion.div>
              </div>
            </div>

            {errors._form && (
              <p role="alert" className="text-sm text-[#ED1C24] hand-drawn text-center">
                {errors._form}
              </p>
            )}
          </div>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8 }}
          className="mt-10 flex gap-4 justify-between"
        >
          <WiredButton variant="outline" size="lg" onClick={onBack} disabled={submitting}>
            ← {t.back}
          </WiredButton>

          <WiredButton variant="primary" size="lg" onClick={handleSubmit} disabled={submitting}>
            {submitting ? t.submitting : `${t.continue} →`}
          </WiredButton>
        </motion.div>
      </motion.div>
    </div>
  );
}

export type { PilgrimFormData };
