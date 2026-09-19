import { motion } from 'motion/react';
import { useState } from 'react';
import { WiredCalendar } from '../doodle/WiredCalendar';
import { WritingEffect } from '../doodle/WritingEffect';
import { HandDrawnCalendar } from '../doodle/HandDrawnCalendar';
import { useI18n } from '../hooks/useI18n';

interface DatePickerStepProps {
  onNext: (checkIn: Date, checkOut: Date) => void;
  initialCheckIn?: Date;
  initialCheckOut?: Date;
}

export function DatePickerStep({ onNext, initialCheckIn, initialCheckOut }: DatePickerStepProps) {
  const { locale } = useI18n();
  const isEs = locale !== 'en';
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const [checkInDate, setCheckInDate] = useState<Date | undefined>(initialCheckIn);
  const [checkOutDate, setCheckOutDate] = useState<Date | undefined>(initialCheckOut);
  const [error, setError] = useState('');

  const handleRangeSelect = (startDate: Date, endDate: Date) => {
    setCheckInDate(startDate);
    setCheckOutDate(endDate);
    setError('');
  };

  const handleContinue = () => {
    if (!checkInDate || !checkOutDate) {
      setError(
        isEs
          ? 'Selecciona la fecha de entrada y salida'
          : 'Please select both check-in and check-out dates'
      );
      return;
    }

    if (checkOutDate <= checkInDate) {
      setError(
        isEs
          ? 'La salida debe ser posterior a la entrada'
          : 'Check-out date must be after check-in date'
      );
      return;
    }

    setError('');
    onNext(checkInDate, checkOutDate);
  };

  return (
    <div className="max-w-4xl mx-auto">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <div className="flex items-center justify-between gap-4 mb-8">
          <div className="flex items-center gap-4">
            <motion.div
              initial={{ scale: 0, rotate: -10 }}
              animate={{ scale: 1, rotate: 0 }}
              transition={{ type: 'spring', stiffness: 150, delay: 0.2 }}
            >
              <HandDrawnCalendar className="w-12 h-12 text-[#00AB39]" />
            </motion.div>
            <div className="text-left">
              <h1 className="text-4xl md:text-5xl sketch-title text-[#5D4E37] leading-none">
                {isEs ? '¿Cuándo nos visitas?' : 'When are you visiting?'}
              </h1>
              <p className="text-lg text-gray-600 hand-drawn">
                {isEs
                  ? 'Selecciona tu fecha de entrada y salida'
                  : 'Select your check-in and check-out dates'}
              </p>
            </div>
          </div>

          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
            className="text-right"
          >
            <p className="text-2xl sketch-title text-[#00AB39]">
              <WritingEffect
                text={isEs ? 'Selecciona tu estancia' : 'Select your stay dates'}
                speed={80}
              />
            </p>
          </motion.div>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <WiredCalendar
            selectedStartDate={checkInDate}
            selectedEndDate={checkOutDate}
            onSelectRange={handleRangeSelect}
            minDate={today}
            onContinue={handleContinue}
          />
        </motion.div>

        {error && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="mt-8 relative"
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
              <p className="text-[#ED1C24] font-medium hand-drawn">{error}</p>
            </div>
          </motion.div>
        )}
      </motion.div>
    </div>
  );
}
