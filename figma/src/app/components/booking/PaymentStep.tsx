import { motion, AnimatePresence } from 'motion/react';
import { CreditCard, Banknote, Check } from 'lucide-react';
import { useState } from 'react';
import { WiredButton } from '../doodle/WiredButton';
import { DateTimePicker } from '../doodle/DateTimePicker';

interface PaymentStepProps {
  onNext: (paymentData: any) => void;
  onBack: () => void;
  totalCost: number;
}

export function PaymentStep({ onNext, onBack, totalCost }: PaymentStepProps) {
  const [paymentMethod, setPaymentMethod] = useState<'card' | 'cash' | null>(null);
  const [etaDateTime, setEtaDateTime] = useState<Date>();
  const [cardData, setCardData] = useState({
    cardNumber: '',
    cardName: '',
    expiry: '',
    cvv: ''
  });
  const [errors, setErrors] = useState<Record<string, string>>({});

  const handlePaymentMethodSelect = (method: 'card' | 'cash') => {
    setPaymentMethod(method);
    setErrors({});
  };

  const handleCardChange = (field: string, value: string) => {
    setCardData(prev => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  const validatePayment = () => {
    const newErrors: Record<string, string> = {};

    if (!paymentMethod) {
      newErrors.method = 'Please select a payment method';
      setErrors(newErrors);
      return false;
    }

    if (paymentMethod === 'card') {
      if (!cardData.cardNumber) newErrors.cardNumber = 'Card number is required';
      if (!cardData.cardName) newErrors.cardName = 'Cardholder name is required';
      if (!cardData.expiry) newErrors.expiry = 'Expiry date is required';
      if (!cardData.cvv) newErrors.cvv = 'CVV is required';
    }

    if (paymentMethod === 'cash' && !etaDateTime) {
      newErrors.eta = 'Please provide your estimated time of arrival';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = () => {
    if (validatePayment()) {
      onNext({
        method: paymentMethod,
        ...(paymentMethod === 'card' ? cardData : { eta: etaDateTime })
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
        {/* Header */}
        <div className="text-center mb-12">
          <motion.div
            initial={{ scale: 0, rotate: -10 }}
            animate={{ scale: 1, rotate: 0 }}
            transition={{ type: "spring", stiffness: 150, delay: 0.2 }}
            className="inline-block mb-4"
          >
            <CreditCard className="w-20 h-20 text-[#00AB39] mx-auto" strokeWidth={2} />
          </motion.div>
          <h1 className="text-4xl md:text-5xl sketch-title text-[#5D4E37] mb-3">
            Payment Method
          </h1>
          <p className="text-lg text-gray-600 hand-drawn">
            Choose how you'd like to pay
          </p>
          
          {/* Decorative squiggle */}
          <svg className="mx-auto mt-4 w-32 h-2 opacity-40">
            <path d="M0,1 Q8,-1 16,1 T32,1 T48,1 T64,1 T80,1 T96,1 T112,1 T128,1" stroke="#00AB39" strokeWidth="2" fill="none" />
          </svg>
        </div>

        {/* Payment Method Selection */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          {/* Credit Card Option */}
          <motion.button
            whileHover={{ scale: 1.02, y: -4 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => handlePaymentMethodSelect('card')}
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
                fill={paymentMethod === 'card' ? '#E8F5E9' : 'white'}
                stroke={paymentMethod === 'card' ? '#00AB39' : '#D4A574'}
                strokeWidth={paymentMethod === 'card' ? '4' : '3'}
                rx="20"
              />
              {paymentMethod === 'card' && (
                <rect
                  x="6"
                  y="6"
                  width="calc(100% - 12px)"
                  height="calc(100% - 12px)"
                  fill="none"
                  stroke="#00AB39"
                  strokeWidth="2"
                  rx="18"
                  opacity="0.3"
                  strokeDasharray="6, 6"
                />
              )}
            </svg>

            <div className="relative z-10 p-8 text-center">
              <CreditCard className={`w-16 h-16 mx-auto mb-4 ${paymentMethod === 'card' ? 'text-[#00AB39]' : 'text-gray-400'}`} />
              <h3 className="text-2xl sketch-title text-[#5D4E37] mb-2">
                Credit/Debit Card
              </h3>
              <p className="text-sm text-gray-600 hand-drawn">
                Pay securely online now
              </p>
              {paymentMethod === 'card' && (
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  className="absolute top-4 right-4 w-8 h-8 rounded-full bg-[#00AB39] flex items-center justify-center"
                >
                  <Check className="w-5 h-5 text-white" />
                </motion.div>
              )}
            </div>
          </motion.button>

          {/* Cash Option */}
          <motion.button
            whileHover={{ scale: 1.02, y: -4 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => handlePaymentMethodSelect('cash')}
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
                fill={paymentMethod === 'cash' ? '#FFF9E6' : 'white'}
                stroke={paymentMethod === 'cash' ? '#EAC102' : '#D4A574'}
                strokeWidth={paymentMethod === 'cash' ? '4' : '3'}
                rx="20"
              />
              {paymentMethod === 'cash' && (
                <rect
                  x="6"
                  y="6"
                  width="calc(100% - 12px)"
                  height="calc(100% - 12px)"
                  fill="none"
                  stroke="#EAC102"
                  strokeWidth="2"
                  rx="18"
                  opacity="0.3"
                  strokeDasharray="6, 6"
                />
              )}
            </svg>

            <div className="relative z-10 p-8 text-center">
              <Banknote className={`w-16 h-16 mx-auto mb-4 ${paymentMethod === 'cash' ? 'text-[#EAC102]' : 'text-gray-400'}`} />
              <h3 className="text-2xl sketch-title text-[#5D4E37] mb-2">
                Cash at Arrival
              </h3>
              <p className="text-sm text-gray-600 hand-drawn">
                Pay when you check in
              </p>
              {paymentMethod === 'cash' && (
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  className="absolute top-4 right-4 w-8 h-8 rounded-full bg-[#EAC102] flex items-center justify-center"
                >
                  <Check className="w-5 h-5 text-white" />
                </motion.div>
              )}
            </div>
          </motion.button>
        </div>

        {/* Error for no payment method */}
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

        {/* Payment Forms */}
        <AnimatePresence mode="wait">
          {/* Credit Card Form */}
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
                <h3 className="text-2xl sketch-title text-[#00AB39] mb-6">
                  💳 Card Details
                </h3>

                <div>
                  <label className="block text-sm font-medium text-[#5D4E37] mb-2">
                    Card Number <span className="text-[#ED1C24]">*</span>
                  </label>
                  <input
                    type="text"
                    value={cardData.cardNumber}
                    onChange={(e) => handleCardChange('cardNumber', e.target.value)}
                    placeholder="1234 5678 9012 3456"
                    maxLength={19}
                    className={`w-full px-4 py-3 doodle-border bg-[#FFF9F0] focus:outline-none focus:ring-2 ${
                      errors.cardNumber ? 'focus:ring-[#ED1C24]' : 'focus:ring-[#00AB39]'
                    }`}
                    style={{ fontFamily: 'Patrick Hand, cursive' }}
                    autoFocus
                  />
                  {errors.cardNumber && <p className="mt-1 text-xs text-[#ED1C24] hand-drawn">{errors.cardNumber}</p>}
                </div>

                <div>
                  <label className="block text-sm font-medium text-[#5D4E37] mb-2">
                    Cardholder Name <span className="text-[#ED1C24]">*</span>
                  </label>
                  <input
                    type="text"
                    value={cardData.cardName}
                    onChange={(e) => handleCardChange('cardName', e.target.value)}
                    placeholder="John Doe"
                    className={`w-full px-4 py-3 doodle-border bg-[#FFF9F0] focus:outline-none focus:ring-2 ${
                      errors.cardName ? 'focus:ring-[#ED1C24]' : 'focus:ring-[#00AB39]'
                    }`}
                    style={{ fontFamily: 'Patrick Hand, cursive' }}
                  />
                  {errors.cardName && <p className="mt-1 text-xs text-[#ED1C24] hand-drawn">{errors.cardName}</p>}
                </div>

                <div className="grid grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-[#5D4E37] mb-2">
                      Expiry Date <span className="text-[#ED1C24]">*</span>
                    </label>
                    <input
                      type="text"
                      value={cardData.expiry}
                      onChange={(e) => handleCardChange('expiry', e.target.value)}
                      placeholder="MM/YY"
                      maxLength={5}
                      className={`w-full px-4 py-3 doodle-border bg-[#FFF9F0] focus:outline-none focus:ring-2 ${
                        errors.expiry ? 'focus:ring-[#ED1C24]' : 'focus:ring-[#00AB39]'
                      }`}
                      style={{ fontFamily: 'Patrick Hand, cursive' }}
                    />
                    {errors.expiry && <p className="mt-1 text-xs text-[#ED1C24] hand-drawn">{errors.expiry}</p>}
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
                      className={`w-full px-4 py-3 doodle-border bg-[#FFF9F0] focus:outline-none focus:ring-2 ${
                        errors.cvv ? 'focus:ring-[#ED1C24]' : 'focus:ring-[#00AB39]'
                      }`}
                      style={{ fontFamily: 'Patrick Hand, cursive' }}
                    />
                    {errors.cvv && <p className="mt-1 text-xs text-[#ED1C24] hand-drawn">{errors.cvv}</p>}
                  </div>
                </div>

                <div className="pt-4 text-center">
                  <p className="text-sm text-gray-500 hand-drawn">
                    🔒 Your payment information is encrypted and secure
                  </p>
                </div>
              </div>
            </motion.div>
          )}

          {/* Cash ETA Form */}
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
                <h3 className="text-2xl sketch-title text-[#EAC102] mb-6">
                  💵 When will you arrive?
                </h3>

                <DateTimePicker
                  value={etaDateTime}
                  onChange={setEtaDateTime}
                  label="Estimated Time of Arrival (ETA)"
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
                    💡 <strong>Important:</strong>
                  </p>
                  <ul className="space-y-2 text-sm text-gray-600 hand-drawn ml-6">
                    <li>• Please arrive during reception hours (2:00 PM - 10:00 PM)</li>
                    <li>• Bring exact change if possible (€{totalCost})</li>
                    <li>• Late arrivals must notify us in advance</li>
                  </ul>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Navigation Buttons */}
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
          >
            ← Back to Bed Selection
          </WiredButton>
          
          <WiredButton
            variant="primary"
            size="lg"
            onClick={handleSubmit}
          >
            Continue to Summary →
          </WiredButton>
        </motion.div>
      </motion.div>
    </div>
  );
}
