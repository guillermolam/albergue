import { motion, AnimatePresence } from 'motion/react';
import { actions } from 'astro:actions';
import { CreditCardIcon as CreditCard, BanknoteIcon as Banknote } from '../doodle/DoodleIcons';
import type { ComponentType } from 'react';
import { useState } from 'react';
import { WiredButton } from '../doodle/WiredButton';
import { DateTimePicker } from '../doodle/DateTimePicker';
import { useI18n } from '../hooks/useI18n';

export interface PaymentResult {
  method: 'card' | 'cash';
  bookingReference: string;
  eta?: Date;
}

interface PaymentStepProps {
  /** Called once the booking is actually created server-side. For the cash
   * path this means the booking is confirmed; for the card path this is
   * only reached if Redsys was unavailable and we degraded to cash (a
   * successful card payment instead redirects the whole page to Redsys and
   * never returns here). */
  onNext: (result: PaymentResult) => void;
  onBack: () => void;
  totalCost: number;
}

const PAYMENT_COPY = {
  es: {
    title: 'Método de Pago',
    subtitle: 'Elige cómo quieres pagar',
    cardTitle: 'Tarjeta de Crédito/Débito',
    cardSubtitle: 'Serás redirigido a nuestra pasarela de pago segura',
    cashTitle: 'Efectivo al Llegar',
    cashSubtitle: 'Paga al hacer el check-in',
    selectMethod: 'Selecciona un método de pago',
    provideEta: 'Indica tu hora estimada de llegada',
    whenArrive: '¿Cuándo llegarás?',
    eta: 'Hora Estimada de Llegada',
    important: 'Importante:',
    receptionHours: 'Llega durante el horario de recepción (14:00 - 22:00)',
    exactChange: 'Trae el importe exacto si es posible',
    lateArrival: 'Las llegadas tardías deben avisarnos con antelación',
    back: 'Volver a Selección de Cama',
    continue: 'Continuar',
    redirecting: 'Redirigiendo al pago seguro...',
    submitting: 'Confirmando tu reserva...',
    cardUnavailable:
      'El pago con tarjeta no está disponible en este momento. Tu reserva se ha confirmado para pago en efectivo al llegar.',
    submitError: 'No se pudo confirmar tu reserva. Inténtalo de nuevo.',
  },
  en: {
    title: 'Payment Method',
    subtitle: "Choose how you'd like to pay",
    cardTitle: 'Credit/Debit Card',
    cardSubtitle: "You'll be redirected to our secure payment gateway",
    cashTitle: 'Cash at Arrival',
    cashSubtitle: 'Pay when you check in',
    selectMethod: 'Please select a payment method',
    provideEta: 'Please provide your estimated time of arrival',
    whenArrive: 'When will you arrive?',
    eta: 'Estimated Time of Arrival (ETA)',
    important: 'Important:',
    receptionHours: 'Please arrive during reception hours (2:00 PM - 10:00 PM)',
    exactChange: 'Bring exact change if possible',
    lateArrival: 'Late arrivals must notify us in advance',
    back: 'Back to Bed Selection',
    continue: 'Continue',
    redirecting: 'Redirecting to secure payment...',
    submitting: 'Confirming your booking...',
    cardUnavailable:
      "Card payment isn't available right now. Your booking is confirmed for cash payment on arrival instead.",
    submitError: "Couldn't confirm your booking. Please try again.",
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
        <Icon className={`w-16 h-16 mx-auto mb-4 ${selected ? '' : 'text-gray-400'}`} />
        <h3 className="text-2xl sketch-title text-[#5D4E37] mb-2">{title}</h3>
        <p className="text-sm text-gray-600 hand-drawn">{subtitle}</p>
      </div>
    </motion.button>
  );
}

/** Redirects the whole page to Redsys's hosted payment form -- this site
 * never collects card data itself. Builds and submits a real <form> (not a
 * fetch) so the browser navigates away, matching booking.astro's existing
 * pattern for the same redirect. */
function redirectToRedsys(payment: { gatewayUrl: string; clientToken: string; signature: string }) {
  const form = document.createElement('form');
  form.method = 'POST';
  form.action = payment.gatewayUrl;

  const fields: Record<string, string> = {
    Ds_SignatureVersion: 'HMAC_SHA256_V1',
    Ds_MerchantParameters: payment.clientToken,
    Ds_Signature: payment.signature,
  };
  for (const [name, value] of Object.entries(fields)) {
    const input = document.createElement('input');
    input.type = 'hidden';
    input.name = name;
    input.value = value;
    form.appendChild(input);
  }

  document.body.appendChild(form);
  form.submit();
}

/**
 * This site never collects raw card data -- "pay by card" calls the real
 * booking.submit Action and redirects the browser to Redsys's own hosted
 * payment page (PSP-hosted, PCI-DSS-safe). Only method selection and, for
 * cash, an ETA are ever held in this component's state.
 */
export function PaymentStep({ onNext, onBack, totalCost }: PaymentStepProps) {
  const { locale } = useI18n();
  const isEs = locale !== 'en';
  const t = isEs ? PAYMENT_COPY.es : PAYMENT_COPY.en;

  const [paymentMethod, setPaymentMethod] = useState<'card' | 'cash' | null>(null);
  const [etaDateTime, setEtaDateTime] = useState<Date>();
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [submitting, setSubmitting] = useState(false);
  const [redirecting, setRedirecting] = useState(false);

  const handlePaymentMethodSelect = (method: 'card' | 'cash') => {
    setPaymentMethod(method);
    setErrors({});
  };

  const handleSubmit = async () => {
    if (!paymentMethod) {
      setErrors({ method: t.selectMethod });
      return;
    }
    if (paymentMethod === 'cash' && !etaDateTime) {
      setErrors({ eta: t.provideEta });
      return;
    }

    setErrors({});
    setSubmitting(true);
    const { data, error } = await actions.booking.submit();
    setSubmitting(false);

    if (error || !data) {
      setErrors({ _form: t.submitError });
      return;
    }

    if (paymentMethod === 'card' && data.payment && 'gatewayUrl' in data.payment) {
      setRedirecting(true);
      redirectToRedsys(
        data.payment as { gatewayUrl: string; clientToken: string; signature: string }
      );
      return;
    }

    if (paymentMethod === 'card') {
      setErrors({ _form: t.cardUnavailable });
    }

    onNext({
      method: 'cash',
      bookingReference: data.bookingReference,
      eta: etaDateTime,
    });
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
            <CreditCard className="w-20 h-20 text-[#00AB39] mx-auto" />
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

        {errors._form && (
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
                fill="#FFF9E6"
                stroke="#EAC102"
                strokeWidth="3"
                rx="16"
              />
            </svg>
            <div className="relative z-10 text-center p-4">
              <p className="text-[#5D4E37] font-medium hand-drawn">{errors._form}</p>
            </div>
          </motion.div>
        )}

        <AnimatePresence mode="wait">
          {paymentMethod === 'card' && (
            <motion.div
              key="card-info"
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

              <div className="relative z-10 p-8 text-center space-y-2">
                <p className="text-lg text-[#5D4E37] hand-drawn">
                  🔒{' '}
                  {isEs ? 'Pago seguro gestionado por Redsys' : 'Secure payment handled by Redsys'}
                </p>
                <p className="text-sm text-gray-500 hand-drawn">
                  {isEs
                    ? 'Nunca recopilamos ni almacenamos los datos de tu tarjeta.'
                    : 'We never collect or store your card details.'}
                </p>
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
          <WiredButton
            variant="outline"
            size="lg"
            onClick={onBack}
            disabled={submitting || redirecting}
          >
            ← {t.back}
          </WiredButton>

          <WiredButton
            variant="primary"
            size="lg"
            onClick={handleSubmit}
            disabled={submitting || redirecting}
          >
            {redirecting ? t.redirecting : submitting ? t.submitting : `${t.continue} →`}
          </WiredButton>
        </motion.div>
      </motion.div>
    </div>
  );
}
