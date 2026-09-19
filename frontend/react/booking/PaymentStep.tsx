import { motion, AnimatePresence } from 'motion/react';
import { CreditCard, Banknote, Check } from 'lucide-react';
import type { ComponentType } from 'react';
import { useState } from 'react';
import { WiredButton } from '../doodle/WiredButton';
import { DateTimePicker } from '../doodle/DateTimePicker';
import { useI18n } from '../hooks/useI18n';

interface PaymentStepProps {
  onNext: (paymentData: Record<string, unknown>) => void;
  onBack: () => void;
  totalCost: number;
}

const PAYMENT_COPY = {
  es: {
    title: 'Método de Pago',
    subtitle: 'Elige cómo quieres pagar',
    cardTitle: 'Tarjeta de Crédito/Débito',
    cardSubtitle: 'Paga de forma segura ahora',
    cashTitle: 'Efectivo al Llegar',
    cashSubtitle: 'Paga al hacer el check-in',
    selectMethod: 'Selecciona un método de pago',
    required: 'Este campo es obligatorio',
    provideEta: 'Indica tu hora estimada de llegada',
    cardDetails: 'Datos de la Tarjeta',
    cardNumber: 'Número de Tarjeta',
    cardholderName: 'Nombre del Titular',
    expiryDate: 'Fecha de Caducidad',
    encrypted: 'Tu información de pago está cifrada y es segura',
    whenArrive: '¿Cuándo llegarás?',
    eta: 'Hora Estimada de Llegada',
    important: 'Importante:',
    receptionHours: 'Llega durante el horario de recepción (14:00 - 22:00)',
    exactChange: 'Trae el importe exacto si es posible',
    lateArrival: 'Las llegadas tardías deben avisarnos con antelación',
    back: 'Volver a Selección de Cama',
    continue: 'Continuar al Resumen',
  },
  en: {
    title: 'Payment Method',
    subtitle: "Choose how you'd like to pay",
    cardTitle: 'Credit/Debit Card',
    cardSubtitle: 'Pay securely online now',
    cashTitle: 'Cash at Arrival',
    cashSubtitle: 'Pay when you check in',
    selectMethod: 'Please select a payment method',
    required: 'This field is required',
    provideEta: 'Please provide your estimated time of arrival',
    cardDetails: 'Card Details',
    cardNumber: 'Card Number',
    cardholderName: 'Cardholder Name',
    expiryDate: 'Expiry Date',
    encrypted: 'Your payment information is encrypted and secure',
    whenArrive: 'When will you arrive?',
    eta: 'Estimated Time of Arrival (ETA)',
    important: 'Important:',
    receptionHours: 'Please arrive during reception hours (2:00 PM - 10:00 PM)',
    exactChange: 'Bring exact change if possible',
    lateArrival: 'Late arrivals must notify us in advance',
    back: 'Back to Bed Selection',
    continue: 'Continue to Summary',
  },
} as const;

interface PaymentMethodCardProps {
  icon: ComponentType<{ className?: string }>;
  title: string;
  subtitle: string;
  selected: boolean;
  activeColor: string;
  activeFill: string;
  onClick: () => void;
}

/** The card/cash options were near-identical JSX differing only in color
 * and copy -- extracted both to cut SonarCloud's duplicate-code flag and
 * PaymentStep's own cognitive complexity. */
function PaymentMethodCard({
  icon: Icon,
  title,
  subtitle,
  selected,
  activeColor,
  activeFill,
  onClick,
}: PaymentMethodCardProps) {
  return (
    <motion.button
      whileHover={{ scale: 1.02, y: -4 }}
      whileTap={{ scale: 0.98 }}
      onClick={onClick}
      className="relative text-left"
    >
      <svg
        className="absolute inset-0 w-full h-full pointer-events-none"
        style={{ filter: 'drop-shadow(3px 4px 6px rgba(0,0,0,0.1))' }}
      >
        <rect
          x="4"
          y="4"
          width="calc(100% - 8px)"
          height="calc(100% - 8px)"
          fill={selected ? activeFill : 'white'}
          stroke={selected ? activeColor : '#D4A574'}
          strokeWidth={selected ? '4' : '3'}
          rx="20"
        />
        {selected && (
          <rect
            x="6"
            y="6"
            width="calc(100% - 12px)"
            height="calc(100% - 12px)"
            fill="none"
            stroke={activeColor}
            strokeWidth="2"
            rx="18"
            opacity="0.3"
            strokeDasharray="6, 6"
          />
        )}
      </svg>

      <div className="relative z-10 p-8 text-center">
        <Icon
          className={`w-16 h-16 mx-auto mb-4 ${selected ? '' : 'text-gray-400'}`}
          style={selected ? { color: activeColor } : undefined}
        />
        <h3 className="text-2xl sketch-title text-[#5D4E37] mb-2">{title}</h3>
        <p className="text-sm text-gray-600 hand-drawn">{subtitle}</p>
        {selected && (
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            className="absolute top-4 right-4 w-8 h-8 rounded-full flex items-center justify-center"
            style={{ backgroundColor: activeColor }}
          >
            <Check className="w-5 h-5 text-white" />
          </motion.div>
        )}
      </div>
    </motion.button>
  );
}

/**
 * Visual/structural port of the Figma prototype's mock payment step.
 * The card fields below are held in component state only and go nowhere --
 * this must NOT be wired to a real submission path before SEC-001/BOOK-004
 * (PSP-hosted tokenized fields) land per MIGRATION_PLAN.md; raw PAN/CVV must
 * never reach a request body, session, or persistence layer.
 */
export function PaymentStep({ onNext, onBack, totalCost }: PaymentStepProps) {
  const { locale } = useI18n();
  const isEs = locale !== 'en';
  const t = isEs ? PAYMENT_COPY.es : PAYMENT_COPY.en;

  const [paymentMethod, setPaymentMethod] = useState<'card' | 'cash' | null>(null);
  const [etaDateTime, setEtaDateTime] = useState<Date>();
  const [cardData, setCardData] = useState({ cardNumber: '', cardName: '', expiry: '', cvv: '' });
  const [errors, setErrors] = useState<Record<string, string>>({});

  const handlePaymentMethodSelect = (method: 'card' | 'cash') => {
    setPaymentMethod(method);
    setErrors({});
  };

  const handleCardChange = (field: string, value: string) => {
    setCardData((prev) => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: '' }));
    }
  };

  const validateCardFields = () => {
    const newErrors: Record<string, string> = {};
    if (!cardData.cardNumber) newErrors.cardNumber = t.required;
    if (!cardData.cardName) newErrors.cardName = t.required;
    if (!cardData.expiry) newErrors.expiry = t.required;
    if (!cardData.cvv) newErrors.cvv = t.required;
    return newErrors;
  };

  const validatePayment = () => {
    if (!paymentMethod) {
      setErrors({ method: t.selectMethod });
      return false;
    }

    const newErrors =
      paymentMethod === 'card' ? validateCardFields() : !etaDateTime ? { eta: t.provideEta } : {};

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = () => {
    if (validatePayment()) {
      onNext({
        method: paymentMethod,
        ...(paymentMethod === 'card' ? cardData : { eta: etaDateTime }),
      });
    }
  };

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
            <CreditCard className="w-20 h-20 text-[#00AB39] mx-auto" strokeWidth={2} />
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

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          <PaymentMethodCard
            icon={CreditCard}
            title={t.cardTitle}
            subtitle={t.cardSubtitle}
            selected={paymentMethod === 'card'}
            activeColor="#00AB39"
            activeFill="#E8F5E9"
            onClick={() => handlePaymentMethodSelect('card')}
          />
          <PaymentMethodCard
            icon={Banknote}
            title={t.cashTitle}
            subtitle={t.cashSubtitle}
            selected={paymentMethod === 'cash'}
            activeColor="#EAC102"
            activeFill="#FFF9E6"
            onClick={() => handlePaymentMethodSelect('cash')}
          />
        </div>

        {errors.method && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-6 relative"
          >
            <svg className="absolute inset-0 w-full h-full pointer-events-none">
              <rect
                x="4"
                y="4"
                width="calc(100% - 8px)"
                height="calc(100% - 8px)"
                fill="#FFE8E8"
                stroke="#ED1C24"
                strokeWidth="3"
                rx="16"
              />
            </svg>
            <div className="relative z-10 text-center p-4">
              <p className="text-[#ED1C24] font-medium hand-drawn">{errors.method}</p>
            </div>
          </motion.div>
        )}

        <AnimatePresence mode="wait">
          {paymentMethod === 'card' && (
            <motion.div
              key="card-form"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
              className="mb-8 relative"
            >
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
                  stroke="#00AB39"
                  strokeWidth="3.5"
                  rx="24"
                />
              </svg>

              <div className="relative z-10 p-8 space-y-6">
                <h3 className="text-2xl sketch-title text-[#00AB39] mb-6">💳 {t.cardDetails}</h3>

                <div>
                  <label className="block text-sm font-medium text-[#5D4E37] mb-2">
                    {t.cardNumber} <span className="text-[#ED1C24]">*</span>
                  </label>
                  <input
                    type="text"
                    value={cardData.cardNumber}
                    onChange={(e) => handleCardChange('cardNumber', e.target.value)}
                    placeholder="1234 5678 9012 3456"
                    maxLength={19}
                    className={`w-full px-4 py-3 doodle-border bg-[#FFF9F0] focus:outline-none focus:ring-2 ${errors.cardNumber ? 'focus:ring-[#ED1C24]' : 'focus:ring-[#00AB39]'}`}
                    style={{ fontFamily: 'Patrick Hand, cursive' }}
                    autoFocus
                  />
                  {errors.cardNumber && (
                    <p className="mt-1 text-xs text-[#ED1C24] hand-drawn">{errors.cardNumber}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-[#5D4E37] mb-2">
                    {t.cardholderName} <span className="text-[#ED1C24]">*</span>
                  </label>
                  <input
                    type="text"
                    value={cardData.cardName}
                    onChange={(e) => handleCardChange('cardName', e.target.value)}
                    placeholder="John Doe"
                    className={`w-full px-4 py-3 doodle-border bg-[#FFF9F0] focus:outline-none focus:ring-2 ${errors.cardName ? 'focus:ring-[#ED1C24]' : 'focus:ring-[#00AB39]'}`}
                    style={{ fontFamily: 'Patrick Hand, cursive' }}
                  />
                  {errors.cardName && (
                    <p className="mt-1 text-xs text-[#ED1C24] hand-drawn">{errors.cardName}</p>
                  )}
                </div>

                <div className="grid grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-[#5D4E37] mb-2">
                      {t.expiryDate} <span className="text-[#ED1C24]">*</span>
                    </label>
                    <input
                      type="text"
                      value={cardData.expiry}
                      onChange={(e) => handleCardChange('expiry', e.target.value)}
                      placeholder="MM/YY"
                      maxLength={5}
                      className={`w-full px-4 py-3 doodle-border bg-[#FFF9F0] focus:outline-none focus:ring-2 ${errors.expiry ? 'focus:ring-[#ED1C24]' : 'focus:ring-[#00AB39]'}`}
                      style={{ fontFamily: 'Patrick Hand, cursive' }}
                    />
                    {errors.expiry && (
                      <p className="mt-1 text-xs text-[#ED1C24] hand-drawn">{errors.expiry}</p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-[#5D4E37] mb-2">
                      CVV <span className="text-[#ED1C24]">*</span>
                    </label>
                    <input
                      type="text"
                      value={cardData.cvv}
                      onChange={(e) => handleCardChange('cvv', e.target.value)}
                      placeholder="123"
                      maxLength={4}
                      className={`w-full px-4 py-3 doodle-border bg-[#FFF9F0] focus:outline-none focus:ring-2 ${errors.cvv ? 'focus:ring-[#ED1C24]' : 'focus:ring-[#00AB39]'}`}
                      style={{ fontFamily: 'Patrick Hand, cursive' }}
                    />
                    {errors.cvv && (
                      <p className="mt-1 text-xs text-[#ED1C24] hand-drawn">{errors.cvv}</p>
                    )}
                  </div>
                </div>

                <div className="pt-4 text-center">
                  <p className="text-sm text-gray-500 hand-drawn">🔒 {t.encrypted}</p>
                </div>
              </div>
            </motion.div>
          )}

          {paymentMethod === 'cash' && (
            <motion.div
              key="cash-form"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
              className="mb-8 relative"
            >
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
                  stroke="#EAC102"
                  strokeWidth="3.5"
                  rx="24"
                />
              </svg>

              <div className="relative z-10 p-8 space-y-6">
                <h3 className="text-2xl sketch-title text-[#EAC102] mb-6">💵 {t.whenArrive}</h3>

                <DateTimePicker
                  value={etaDateTime}
                  onChange={setEtaDateTime}
                  label={t.eta}
                  minDate={new Date()}
                  required
                />

                {errors.eta && (
                  <motion.p
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="text-xs text-[#ED1C24] hand-drawn"
                  >
                    {errors.eta}
                  </motion.p>
                )}

                <div className="pt-4 mt-6 border-t-2 border-dashed border-gray-300">
                  <p className="text-sm text-gray-600 hand-drawn mb-3">
                    💡 <strong>{t.important}</strong>
                  </p>
                  <ul className="space-y-2 text-sm text-gray-600 hand-drawn ml-6">
                    <li>• {t.receptionHours}</li>
                    <li>
                      • {t.exactChange} (€{totalCost})
                    </li>
                    <li>• {t.lateArrival}</li>
                  </ul>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="flex gap-4 justify-between"
        >
          <WiredButton variant="outline" size="lg" onClick={onBack}>
            ← {t.back}
          </WiredButton>

          <WiredButton variant="primary" size="lg" onClick={handleSubmit}>
            {t.continue} →
          </WiredButton>
        </motion.div>
      </motion.div>
    </div>
  );
}
