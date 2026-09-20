import { useState } from 'react';
import { actions } from 'astro:actions';
import { AnimatePresence, motion } from 'motion/react';
import { DatePickerStep } from './booking/DatePickerStep';
import { IDUploadStep } from './booking/IDUploadStep';
import { PilgrimFormStep } from './booking/PilgrimFormStep';
import { BedSelectionStep, type AvailableBed } from './booking/BedSelectionStep';
import { PaymentStep, type PaymentResult } from './booking/PaymentStep';
import { PriceSummaryModal } from './booking/PriceSummaryModal';
import { BookingStepper } from './booking/BookingStepper';
import { HandDrawnCalendar } from './doodle/HandDrawnCalendar';
import { useI18n } from './hooks/useI18n';

interface OcrData {
  firstName: string;
  lastName: string;
  secondLastName: string;
  idNumber: string;
  dateOfBirth: string;
  nationality: string;
}

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

interface BookingData {
  checkInDate?: Date;
  checkOutDate?: Date;
  guestCount?: number;
  ocrData?: OcrData;
  pilgrimData?: PilgrimFormData;
  selectedBed?: AvailableBed;
  pricePerNight?: number;
  totalAmount?: number;
  paymentResult?: PaymentResult;
}

interface BookingConfirmationStepProps {
  isEs: boolean;
  bookingData: BookingData;
  nights: number;
  pricePerNight: number;
  totalAmount: number;
  onBack: () => void;
  onComplete: () => void;
}

/** Pulled out of BookingFlow's render: this step alone was most of that
 * function's cognitive-complexity budget (SonarCloud flagged 27 vs the
 * 15 allowed), and it's a self-contained summary screen with no state
 * of its own. */
const CONFIRMATION_COPY = {
  es: {
    title: '¡Reserva Confirmada!',
    subtitle: 'Tu reserva está completa',
    reference: 'Referencia de Reserva',
    stayDates: 'Fechas de Estancia',
    checkIn: 'Entrada',
    checkOut: 'Salida',
    guestInfo: 'Información del Huésped',
    name: 'Nombre',
    bedSelection: 'Selección de Cama',
    bed: 'Cama',
    paymentMethod: 'Método de Pago',
    card: 'Tarjeta de Crédito/Débito',
    cash: 'Efectivo al Llegar',
    totalCost: 'Coste Total',
    night: 'noche',
    nightPlural: 'noches',
    back: 'Volver',
    goToDashboard: '¡Ir al Panel! ✨',
  },
  en: {
    title: 'Booking Confirmed!',
    subtitle: 'Your reservation is complete',
    reference: 'Booking Reference',
    stayDates: 'Stay Dates',
    checkIn: 'Check-in',
    checkOut: 'Check-out',
    guestInfo: 'Guest Information',
    name: 'Name',
    bedSelection: 'Bed Selection',
    bed: 'Bed',
    paymentMethod: 'Payment Method',
    card: 'Credit/Debit Card',
    cash: 'Cash at Arrival',
    totalCost: 'Total Cost',
    night: 'night',
    nightPlural: 'nights',
    back: 'Back',
    goToDashboard: 'Go to Dashboard! ✨',
  },
} as const;

function BookingConfirmationStep({
  isEs,
  bookingData,
  nights,
  pricePerNight,
  totalAmount,
  onBack,
  onComplete,
}: BookingConfirmationStepProps) {
  const t = isEs ? CONFIRMATION_COPY.es : CONFIRMATION_COPY.en;
  const paymentMethodLabel = bookingData.paymentResult?.method === 'card' ? t.card : t.cash;
  const nightLabel = nights > 1 ? t.nightPlural : t.night;

  return (
    <motion.div
      key="step-6"
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.95 }}
      transition={{ duration: 0.3 }}
      className="max-w-3xl mx-auto"
    >
      <div className="text-center mb-12">
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ type: 'spring', stiffness: 150, delay: 0.2 }}
          className="mb-6"
        >
          <div className="w-24 h-24 mx-auto rounded-full bg-[#00AB39] flex items-center justify-center text-6xl">
            ✓
          </div>
        </motion.div>
        <h1 className="text-5xl sketch-title text-[#00AB39] mb-4">{t.title}</h1>
        <p className="text-gray-600 hand-drawn text-lg">{t.subtitle}</p>

        <svg className="mx-auto mt-4 w-32 h-2 opacity-40">
          <path
            d="M0,1 Q8,-1 16,1 T32,1 T48,1 T64,1 T80,1 T96,1 T112,1 T128,1"
            stroke="#00AB39"
            strokeWidth="2"
            fill="none"
          />
        </svg>
      </div>

      <div className="relative mb-8">
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
          {bookingData.paymentResult?.bookingReference && (
            <div>
              <h3 className="text-xl sketch-title mb-2">{t.reference}</h3>
              <p className="text-2xl font-mono text-[#00AB39]">
                {bookingData.paymentResult.bookingReference}
              </p>
            </div>
          )}

          <div className="border-t-2 border-dashed pt-6">
            <h3 className="text-xl sketch-title mb-4 flex items-center gap-2">
              <HandDrawnCalendar size={28} animate />
              {t.stayDates}
            </h3>
            <div className="grid grid-cols-2 gap-4 text-gray-700">
              <div>
                <p className="text-sm text-gray-500">{t.checkIn}</p>
                <p className="font-medium hand-drawn">
                  {bookingData.checkInDate?.toLocaleDateString()}
                </p>
              </div>
              <div>
                <p className="text-sm text-gray-500">{t.checkOut}</p>
                <p className="font-medium hand-drawn">
                  {bookingData.checkOutDate?.toLocaleDateString()}
                </p>
              </div>
            </div>
          </div>

          <div className="border-t-2 border-dashed pt-6">
            <h3 className="text-xl sketch-title mb-4">{t.guestInfo}</h3>
            <div className="grid grid-cols-2 gap-4 text-gray-700">
              <div>
                <p className="text-sm text-gray-500">{t.name}</p>
                <p className="font-medium hand-drawn">
                  {bookingData.pilgrimData?.firstName} {bookingData.pilgrimData?.lastName}
                </p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Email</p>
                <p className="font-medium hand-drawn">{bookingData.pilgrimData?.email}</p>
              </div>
            </div>
          </div>

          <div className="border-t-2 border-dashed pt-6">
            <h3 className="text-xl sketch-title mb-4">{t.bedSelection}</h3>
            <p className="text-gray-700 hand-drawn">
              {t.bed} #{bookingData.selectedBed?.bedNumber} · {bookingData.selectedBed?.roomName}
            </p>
          </div>

          <div className="border-t-2 border-dashed pt-6">
            <h3 className="text-xl sketch-title mb-4">{t.paymentMethod}</h3>
            <p className="text-gray-700 hand-drawn">{paymentMethodLabel}</p>
            {bookingData.paymentResult?.method === 'cash' && bookingData.paymentResult?.eta && (
              <p className="text-sm text-gray-600 mt-2 hand-drawn">
                ETA: {new Date(bookingData.paymentResult.eta).toLocaleString()}
              </p>
            )}
          </div>

          <div className="border-t-2 border-dashed pt-6">
            <h3 className="text-xl sketch-title mb-4">{t.totalCost}</h3>
            <p className="text-3xl sketch-title text-[#00AB39]">€{totalAmount}</p>
            <p className="text-sm text-gray-500 hand-drawn">
              ({nights} {nightLabel} × €{pricePerNight}/{t.night})
            </p>
          </div>
        </div>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
        className="flex gap-4"
      >
        <button
          onClick={onBack}
          className="flex-1 px-6 py-4 text-lg doodle-border bg-white hover:bg-gray-50 transition-colors sketch-title"
        >
          ← {t.back}
        </button>
        <button
          onClick={onComplete}
          className="flex-1 px-6 py-4 text-lg doodle-border bg-[#00AB39] text-white hover:bg-[#008c2f] transition-colors sketch-title"
        >
          {t.goToDashboard}
        </button>
      </motion.div>
    </motion.div>
  );
}

function toIsoDate(date: Date): string {
  return date.toISOString().slice(0, 10);
}

/** Maps PilgrimFormStep's local field names to booking.setContact's Action
 * input shape. addressLine2 has no counterpart in that schema, so it's
 * folded into addressStreet rather than dropped. */
function toSetContactInput(data: PilgrimFormData) {
  const addressStreet = data.addressLine2
    ? `${data.addressLine1}, ${data.addressLine2}`
    : data.addressLine1;

  return {
    firstName: data.firstName,
    lastName1: data.lastName,
    lastName2: data.secondLastName || undefined,
    email: data.email || undefined,
    phone: data.phone,
    documentType: data.documentType as 'dni' | 'nie' | 'passport',
    documentNumber: data.documentNumber,
    birthDate: data.dateOfBirth,
    gender: data.gender as 'male' | 'female' | 'other',
    nationality: data.nationality || undefined,
    addressCountry: data.country,
    addressStreet: addressStreet.slice(0, 120),
    addressCity: data.city,
    addressPostalCode: data.postalCode,
  };
}

export function BookingFlow() {
  const { locale } = useI18n();
  const isEs = locale !== 'en';

  const [currentStep, setCurrentStep] = useState(1);
  const [completedSteps, setCompletedSteps] = useState<number[]>([]);
  const [isPriceModalExpanded, setIsPriceModalExpanded] = useState(false);

  const [bookingData, setBookingData] = useState<BookingData>({});

  const markStepComplete = (step: number) => {
    setCompletedSteps((prev) => (prev.includes(step) ? prev : [...prev, step]));
  };

  const handleDateNext = async (
    checkIn: Date,
    checkOut: Date,
    guestCount: number
  ): Promise<boolean> => {
    const { error: datesError } = await actions.booking.setDates({
      arrivalDate: toIsoDate(checkIn),
      departureDate: toIsoDate(checkOut),
    });
    if (datesError) return false;

    const { error: guestsError } = await actions.booking.setGuests({ guestCount });
    if (guestsError) return false;

    setBookingData((prev) => ({
      ...prev,
      checkInDate: checkIn,
      checkOutDate: checkOut,
      guestCount,
    }));
    markStepComplete(1);
    setCurrentStep(2);
    window.scrollTo({ top: 0, behavior: 'smooth' });
    return true;
  };

  const handleIDNext = (data: OcrData) => {
    setBookingData((prev) => ({ ...prev, ocrData: data }));
    markStepComplete(2);
    setCurrentStep(3);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleFormNext = async (data: PilgrimFormData): Promise<boolean> => {
    const { error } = await actions.booking.setContact(toSetContactInput(data));
    if (error) return false;

    setBookingData((prev) => ({ ...prev, pilgrimData: data }));
    markStepComplete(3);
    setCurrentStep(4);
    window.scrollTo({ top: 0, behavior: 'smooth' });
    return true;
  };

  const handleBedNext = async (bed: AvailableBed): Promise<boolean> => {
    const { data, error } = await actions.booking.setBeds({ selectedBedId: String(bed.id) });
    if (error || !data) return false;

    setBookingData((prev) => ({
      ...prev,
      selectedBed: bed,
      pricePerNight: data.quote ? Number(data.quote.pricePerNight) : prev.pricePerNight,
      totalAmount: data.quote ? Number(data.quote.totalAmount) : prev.totalAmount,
    }));
    markStepComplete(4);
    setCurrentStep(5);
    window.scrollTo({ top: 0, behavior: 'smooth' });
    return true;
  };

  const handlePaymentNext = (result: PaymentResult) => {
    setBookingData((prev) => ({ ...prev, paymentResult: result }));
    markStepComplete(5);
    setIsPriceModalExpanded(true);
    setCurrentStep(6);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleComplete = () => {
    window.location.href = '/dashboard';
  };

  const handleStepClick = (step: number) => {
    setCurrentStep(step);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const nights =
    bookingData.checkInDate && bookingData.checkOutDate
      ? Math.ceil(
          (bookingData.checkOutDate.getTime() - bookingData.checkInDate.getTime()) /
            (1000 * 60 * 60 * 24)
        )
      : 0;

  const pricePerNight = bookingData.pricePerNight ?? 0;
  const totalAmount = bookingData.totalAmount ?? nights * pricePerNight;

  return (
    <div className="min-h-screen bg-[#FFFFFF] paper-texture flex overflow-x-hidden w-full max-w-[100vw]">
      <div className="hidden lg:block w-80 flex-shrink-0 bg-white/80 backdrop-blur-sm border-r-4 border-[#D4A574]/30 p-8 sticky top-0 h-screen overflow-y-auto">
        <div className="mb-12">
          <motion.a
            href="/"
            className="w-16 h-16 mx-auto mb-4 cursor-pointer flex items-center justify-center"
            animate={{ rotate: [0, 5, -5, 0] }}
            transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
            whileHover={{ scale: 1.1, rotate: 10 }}
            whileTap={{ scale: 0.95 }}
            aria-label="Albergue Carrascalejo"
          >
            <svg
              viewBox="0 0 64 64"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
              className="w-full h-full"
            >
              <circle cx="32" cy="32" r="30" fill="#E8F5E9" stroke="#00AB39" strokeWidth="3" />
              <path
                d="M32 12 C20 12 12 22 14 34 C16 44 24 50 32 52 C40 50 48 44 50 34 C52 22 44 12 32 12Z"
                fill="#00AB39"
                opacity="0.15"
              />
              <path
                d="M32 48 L20 30 C20 22 25 16 32 16 C39 16 44 22 44 30 Z"
                fill="#00AB39"
                opacity="0.3"
              />
              <path
                d="M32 16 L32 48 M20 30 L44 30"
                stroke="#006b24"
                strokeWidth="2"
                strokeLinecap="round"
              />
              <circle cx="32" cy="16" r="4" fill="#00AB39" />
              <path
                d="M26 38 L32 48 L38 38"
                stroke="#006b24"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </motion.a>
          <h2 className="sketch-title text-2xl text-[#00AB39] text-center">
            <a href="/">Albergue Carrascalejo</a>
          </h2>
          <p className="text-sm text-gray-500 hand-drawn text-center mt-1">Camino de Santiago</p>
        </div>

        <BookingStepper
          currentStep={currentStep}
          completedSteps={completedSteps}
          onStepClick={handleStepClick}
        />
      </div>

      <div className="flex-1 relative">
        <div className="lg:hidden fixed top-0 left-0 right-0 z-50 bg-[#FFFFFF]/95 backdrop-blur-sm border-b-3 border-[#00AB39]/20">
          <div className="px-4 py-4 flex items-center gap-3">
            <motion.a
              href="/"
              className="w-12 h-12 cursor-pointer flex items-center justify-center"
              animate={{ rotate: [0, 5, -5, 0] }}
              transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.95 }}
              aria-label="Albergue Carrascalejo"
            >
              <svg
                viewBox="0 0 64 64"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
                className="w-full h-full"
              >
                <circle cx="32" cy="32" r="30" fill="#E8F5E9" stroke="#00AB39" strokeWidth="3" />
                <path
                  d="M32 12 C20 12 12 22 14 34 C16 44 24 50 32 52 C40 50 48 44 50 34 C52 22 44 12 32 12Z"
                  fill="#00AB39"
                  opacity="0.15"
                />
                <path
                  d="M32 48 L20 30 C20 22 25 16 32 16 C39 16 44 22 44 30 Z"
                  fill="#00AB39"
                  opacity="0.3"
                />
                <path
                  d="M32 16 L32 48 M20 30 L44 30"
                  stroke="#006b24"
                  strokeWidth="2"
                  strokeLinecap="round"
                />
                <circle cx="32" cy="16" r="4" fill="#00AB39" />
                <path
                  d="M26 38 L32 48 L38 38"
                  stroke="#006b24"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </motion.a>
            <a href="/">
              <h2 className="sketch-title text-lg text-[#00AB39]">Albergue Carrascalejo</h2>
              <p className="text-xs text-gray-500 hand-drawn">
                {isEs ? 'Paso' : 'Step'} {currentStep} {isEs ? 'de' : 'of'} 6
              </p>
            </a>
          </div>
        </div>

        <div className={`${nights > 0 ? 'pt-20 lg:pt-20' : 'pt-24 lg:pt-16'} pb-32 px-4 lg:px-12`}>
          <AnimatePresence mode="wait">
            {currentStep === 1 && (
              <motion.div
                key="step-1"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.3 }}
              >
                <DatePickerStep
                  onNext={handleDateNext}
                  initialCheckIn={bookingData.checkInDate}
                  initialCheckOut={bookingData.checkOutDate}
                  initialGuestCount={bookingData.guestCount}
                />
              </motion.div>
            )}

            {currentStep === 2 && (
              <motion.div
                key="step-2"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.3 }}
              >
                <IDUploadStep onNext={handleIDNext} onBack={() => setCurrentStep(1)} />
              </motion.div>
            )}

            {currentStep === 3 && (
              <motion.div
                key="step-3"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.3 }}
              >
                <PilgrimFormStep
                  onNext={handleFormNext}
                  onBack={() => setCurrentStep(2)}
                  prefillData={bookingData.ocrData}
                />
              </motion.div>
            )}

            {currentStep === 4 && (
              <motion.div
                key="step-4"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.3 }}
              >
                <BedSelectionStep
                  checkInDate={bookingData.checkInDate}
                  checkOutDate={bookingData.checkOutDate}
                  onNext={handleBedNext}
                  onBack={() => setCurrentStep(3)}
                />
              </motion.div>
            )}

            {currentStep === 5 && (
              <motion.div
                key="step-5"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.3 }}
              >
                <PaymentStep
                  onNext={handlePaymentNext}
                  onBack={() => setCurrentStep(4)}
                  totalCost={totalAmount}
                />
              </motion.div>
            )}

            {currentStep === 6 && (
              <BookingConfirmationStep
                isEs={isEs}
                bookingData={bookingData}
                nights={nights}
                pricePerNight={pricePerNight}
                totalAmount={totalAmount}
                onBack={() => setCurrentStep(5)}
                onComplete={handleComplete}
              />
            )}
          </AnimatePresence>
        </div>

        {nights > 0 && currentStep < 6 && (
          <PriceSummaryModal
            checkInDate={bookingData.checkInDate}
            checkOutDate={bookingData.checkOutDate}
            nights={nights}
            pricePerNight={pricePerNight}
            selectedBed={bookingData.selectedBed?.bedNumber}
            isExpanded={isPriceModalExpanded}
            onClose={() => setIsPriceModalExpanded(false)}
          />
        )}
      </div>
    </div>
  );
}
