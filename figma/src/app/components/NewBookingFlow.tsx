import { useState } from 'react';
import { AnimatePresence, motion } from 'motion/react';
import { useNavigate } from 'react-router-dom';
import { DatePickerStep } from './booking/DatePickerStep';
import { IDUploadStep } from './booking/IDUploadStep';
import { PilgrimFormStep } from './booking/PilgrimFormStep';
import { BedSelectionStep } from './booking/BedSelectionStep';
import { PaymentStep } from './booking/PaymentStep';
import { PriceSummaryModal } from './booking/PriceSummaryModal';
import { BookingStepper } from './booking/BookingStepper';
import { HandDrawnCalendar } from './doodle/HandDrawnCalendar';

export function NewBookingFlow() {
  const [currentStep, setCurrentStep] = useState(1);
  const [completedSteps, setCompletedSteps] = useState<number[]>([]);
  const [isPriceModalExpanded, setIsPriceModalExpanded] = useState(false);
  const navigate = useNavigate();
  
  const [bookingData, setBookingData] = useState({
    checkInDate: undefined as Date | undefined,
    checkOutDate: undefined as Date | undefined,
    ocrData: undefined as any,
    pilgrimData: undefined as any,
    selectedBeds: [] as number[],
    paymentData: undefined as any,
  });

  const pricePerNight = 10;

  // Step 1: Date Picker
  const handleDateNext = (checkIn: Date, checkOut: Date) => {
    setBookingData(prev => ({ ...prev, checkInDate: checkIn, checkOutDate: checkOut }));
    markStepComplete(1);
    setCurrentStep(2);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Step 2: ID Upload
  const handleIDNext = (data: any) => {
    setBookingData(prev => ({ ...prev, ocrData: data }));
    markStepComplete(2);
    setCurrentStep(3);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Step 3: Pilgrim Form
  const handleFormNext = (data: any) => {
    setBookingData(prev => ({ ...prev, pilgrimData: data }));
    markStepComplete(3);
    setCurrentStep(4);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Step 4: Bed Selection
  const handleBedNext = (beds: number[]) => {
    setBookingData(prev => ({ ...prev, selectedBeds: beds }));
    markStepComplete(4);
    setCurrentStep(5);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Step 5: Payment
  const handlePaymentNext = (paymentData: any) => {
    setBookingData(prev => ({ ...prev, paymentData }));
    markStepComplete(5);
    setIsPriceModalExpanded(true); // Expand modal for summary
    setCurrentStep(6);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Step 6: Summary and Complete
  const handleComplete = () => {
    navigate('/dashboard');
  };

  const markStepComplete = (step: number) => {
    if (!completedSteps.includes(step)) {
      setCompletedSteps(prev => [...prev, step]);
    }
  };

  const handleStepClick = (step: number) => {
    setCurrentStep(step);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const nights = bookingData.checkInDate && bookingData.checkOutDate
    ? Math.ceil((bookingData.checkOutDate.getTime() - bookingData.checkInDate.getTime()) / (1000 * 60 * 60 * 24))
    : 0;

  const selectedBed = bookingData.selectedBeds.length > 0 ? bookingData.selectedBeds[0] : undefined;

  return (
    <div className="min-h-screen bg-[#FFF9F0] paper-texture flex overflow-x-hidden w-full max-w-[100vw]">
      {/* Left Sidebar - Stepper */}
      <div className="hidden lg:block w-80 flex-shrink-0 bg-white/80 backdrop-blur-sm border-r-4 border-[#D4A574]/30 p-8 sticky top-0 h-screen overflow-y-auto">
        {/* Logo */}
        <div className="mb-12">
          <motion.div
            className="w-16 h-16 mx-auto mb-4 cursor-pointer flex items-center justify-center"
            animate={{ rotate: [0, 5, -5, 0] }}
            transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
            whileHover={{ scale: 1.1, rotate: 10 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => navigate('/')}
            aria-label="Albergue Carrascalejo"
          >
            <svg viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full">
              <circle cx="32" cy="32" r="30" fill="#E8F5E9" stroke="#00AB39" strokeWidth="3"/>
              <path d="M32 12 C20 12 12 22 14 34 C16 44 24 50 32 52 C40 50 48 44 50 34 C52 22 44 12 32 12Z" fill="#00AB39" opacity="0.15"/>
              <path d="M32 48 L20 30 C20 22 25 16 32 16 C39 16 44 22 44 30 Z" fill="#00AB39" opacity="0.3"/>
              <path d="M32 16 L32 48 M20 30 L44 30" stroke="#006b24" strokeWidth="2" strokeLinecap="round"/>
              <circle cx="32" cy="16" r="4" fill="#00AB39"/>
              <path d="M26 38 L32 48 L38 38" stroke="#006b24" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </motion.div>
          <h2 className="sketch-title text-2xl text-[#00AB39] text-center cursor-pointer" onClick={() => navigate('/')}>
            Albergue Carrascalejo
          </h2>
          <p className="text-sm text-gray-500 hand-drawn text-center mt-1">
            Camino de Santiago
          </p>
        </div>

        {/* Stepper */}
        <BookingStepper
          currentStep={currentStep}
          completedSteps={completedSteps}
          onStepClick={handleStepClick}
        />
      </div>

      {/* Main Content Area */}
      <div className="flex-1 relative">
        {/* Mobile Logo Header */}
        <div className="lg:hidden fixed top-0 left-0 right-0 z-50 bg-[#FFF9F0]/95 backdrop-blur-sm border-b-3 border-[#00AB39]/20">
          <div className="px-4 py-4 flex items-center gap-3">
            <motion.div
              className="w-12 h-12 cursor-pointer flex items-center justify-center"
              animate={{ rotate: [0, 5, -5, 0] }}
              transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => navigate('/')}
              aria-label="Albergue Carrascalejo"
            >
              <svg viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full">
                <circle cx="32" cy="32" r="30" fill="#E8F5E9" stroke="#00AB39" strokeWidth="3"/>
                <path d="M32 12 C20 12 12 22 14 34 C16 44 24 50 32 52 C40 50 48 44 50 34 C52 22 44 12 32 12Z" fill="#00AB39" opacity="0.15"/>
                <path d="M32 48 L20 30 C20 22 25 16 32 16 C39 16 44 22 44 30 Z" fill="#00AB39" opacity="0.3"/>
                <path d="M32 16 L32 48 M20 30 L44 30" stroke="#006b24" strokeWidth="2" strokeLinecap="round"/>
                <circle cx="32" cy="16" r="4" fill="#00AB39"/>
                <path d="M26 38 L32 48 L38 38" stroke="#006b24" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </motion.div>
            <div className="cursor-pointer" onClick={() => navigate('/')}>
              <h2 className="sketch-title text-lg text-[#00AB39]">Albergue Carrascalejo</h2>
              <p className="text-xs text-gray-500 hand-drawn">Step {currentStep} of 7</p>
            </div>
          </div>
        </div>

        {/* Step Content with animations */}
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
                <IDUploadStep
                  onNext={handleIDNext}
                  onBack={() => setCurrentStep(1)}
                />
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
                  totalCost={nights * pricePerNight}
                />
              </motion.div>
            )}

            {currentStep === 6 && (
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
                    transition={{ type: "spring", stiffness: 150, delay: 0.2 }}
                    className="mb-6"
                  >
                    <div className="w-24 h-24 mx-auto rounded-full bg-[#00AB39] flex items-center justify-center text-6xl">
                      ✓
                    </div>
                  </motion.div>
                  <h1 className="text-5xl sketch-title text-[#00AB39] mb-4">Booking Confirmed!</h1>
                  <p className="text-gray-600 hand-drawn text-lg">Your reservation is complete</p>
                  
                  <svg className="mx-auto mt-4 w-32 h-2 opacity-40">
                    <path d="M0,1 Q8,-1 16,1 T32,1 T48,1 T64,1 T80,1 T96,1 T112,1 T128,1" stroke="#00AB39" strokeWidth="2" fill="none" />
                  </svg>
                </div>

                <div className="relative mb-8">
                  <svg className="absolute inset-0 w-full h-full pointer-events-none"
                    style={{ filter: 'drop-shadow(3px 4px 6px rgba(0,0,0,0.1))' }}>
                    <rect x="4" y="4" width="calc(100% - 8px)" height="calc(100% - 8px)"
                      fill="white" stroke="#00AB39" strokeWidth="3.5" rx="24" />
                  </svg>

                  <div className="relative z-10 p-8 space-y-6">
                    <div>
                      <h3 className="text-xl sketch-title mb-4 flex items-center gap-2">
                        <HandDrawnCalendar size={28} animate />
                        Stay Dates
                      </h3>
                      <div className="grid grid-cols-2 gap-4 text-gray-700">
                        <div>
                          <p className="text-sm text-gray-500">Check-in</p>
                          <p className="font-medium hand-drawn">{bookingData.checkInDate?.toLocaleDateString()}</p>
                        </div>
                        <div>
                          <p className="text-sm text-gray-500">Check-out</p>
                          <p className="font-medium hand-drawn">{bookingData.checkOutDate?.toLocaleDateString()}</p>
                        </div>
                      </div>
                    </div>

                    <div className="border-t-2 border-dashed pt-6">
                      <h3 className="text-xl sketch-title mb-4">Guest Information</h3>
                      <div className="grid grid-cols-2 gap-4 text-gray-700">
                        <div>
                          <p className="text-sm text-gray-500">Name</p>
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
                      <h3 className="text-xl sketch-title mb-4">Bed Selection</h3>
                      <p className="text-gray-700 hand-drawn">
                        Bed #{bookingData.selectedBeds[0]}
                      </p>
                    </div>

                    <div className="border-t-2 border-dashed pt-6">
                      <h3 className="text-xl sketch-title mb-4">Payment Method</h3>
                      <p className="text-gray-700 hand-drawn">
                        {bookingData.paymentData?.method === 'card' ? 'Credit/Debit Card' : 'Cash at Arrival'}
                      </p>
                      {bookingData.paymentData?.method === 'cash' && bookingData.paymentData?.eta && (
                        <p className="text-sm text-gray-600 mt-2 hand-drawn">
                          ETA: {new Date(bookingData.paymentData.eta).toLocaleString()}
                        </p>
                      )}
                    </div>

                    <div className="border-t-2 border-dashed pt-6">
                      <h3 className="text-xl sketch-title mb-4">Total Cost</h3>
                      <p className="text-3xl sketch-title text-[#00AB39]">
                        €{nights * pricePerNight}
                      </p>
                      <p className="text-sm text-gray-500 hand-drawn">
                        ({nights} night{nights > 1 ? 's' : ''} × €{pricePerNight}/night)
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
                    onClick={() => setCurrentStep(5)}
                    className="flex-1 px-6 py-4 text-lg doodle-border bg-white hover:bg-gray-50 transition-colors sketch-title"
                  >
                    ← Back
                  </button>
                  <button
                    onClick={handleComplete}
                    className="flex-1 px-6 py-4 text-lg doodle-border bg-[#00AB39] text-white hover:bg-[#008c2f] transition-colors sketch-title"
                  >
                    Go to Dashboard! ✨
                  </button>
                </motion.div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Price Summary Modal - Bottom left (or centered when expanded) */}
        {nights > 0 && currentStep < 6 && (
          <PriceSummaryModal
            checkInDate={bookingData.checkInDate}
            checkOutDate={bookingData.checkOutDate}
            nights={nights}
            pricePerNight={pricePerNight}
            selectedBed={selectedBed}
            isExpanded={isPriceModalExpanded}
            onClose={() => setIsPriceModalExpanded(false)}
          />
        )}
      </div>
    </div>
  );
}