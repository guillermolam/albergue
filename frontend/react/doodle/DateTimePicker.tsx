import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { CalendarIcon as Calendar, ClockIcon as Clock } from './DoodleIcons';
import { HandDrawnCalendar } from './HandDrawnCalendar';

interface DateTimePickerProps {
  value?: Date;
  onChange: (date: Date) => void;
  label?: string;
  minDate?: Date;
  required?: boolean;
}

export function DateTimePicker({
  value,
  onChange,
  label = 'Select Date & Time',
  minDate,
  required = false,
}: DateTimePickerProps) {
  const [selectedDate, setSelectedDate] = useState<string>('');
  const [selectedTime, setSelectedTime] = useState<string>('');
  const [focused, setFocused] = useState<'date' | 'time' | null>(null);

  useEffect(() => {
    if (value) {
      const dateStr = value.toISOString().split('T')[0];
      const timeStr = value.toTimeString().slice(0, 5);
      setSelectedDate(dateStr);
      setSelectedTime(timeStr);
    }
  }, [value]);

  const handleDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newDate = e.target.value;
    setSelectedDate(newDate);

    if (newDate && selectedTime) {
      const dateTime = new Date(`${newDate}T${selectedTime}`);
      onChange(dateTime);
    }
  };

  const handleTimeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newTime = e.target.value;
    setSelectedTime(newTime);

    if (selectedDate && newTime) {
      const dateTime = new Date(`${selectedDate}T${newTime}`);
      onChange(dateTime);
    }
  };

  const formatDisplayDate = () => {
    if (!selectedDate) return '';
    const date = new Date(selectedDate);
    return date.toLocaleDateString('en-US', {
      weekday: 'short',
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    });
  };

  const formatDisplayTime = () => {
    if (!selectedTime) return '';
    const [hours, minutes] = selectedTime.split(':');
    const hour = parseInt(hours);
    const ampm = hour >= 12 ? 'PM' : 'AM';
    const displayHour = hour % 12 || 12;
    return `${displayHour}:${minutes} ${ampm}`;
  };

  const minDateStr = minDate?.toISOString().split('T')[0];

  return (
    <div className="w-full">
      {label && (
        <label className="block text-sm font-medium text-[#5D4E37] mb-3 sketch-title">
          {label} {required && <span className="text-[#ED1C24]">*</span>}
        </label>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Date Picker */}
        <div className="relative">
          <svg
            className="absolute inset-0 w-full h-full pointer-events-none"
            style={{ filter: 'drop-shadow(2px 3px 4px rgba(0,0,0,0.08))' }}
          >
            <rect
              x="3"
              y="3"
              width="calc(100% - 6px)"
              height="calc(100% - 6px)"
              fill="#FFF9F0"
              stroke={focused === 'date' ? '#00AB39' : '#D4A574'}
              strokeWidth={focused === 'date' ? '3' : '2.5'}
              rx="12"
            />
            {focused === 'date' && (
              <rect
                x="5"
                y="5"
                width="calc(100% - 10px)"
                height="calc(100% - 10px)"
                fill="none"
                stroke="#00AB39"
                strokeWidth="2"
                rx="10"
                opacity="0.3"
                strokeDasharray="4, 4"
              />
            )}
          </svg>

          <div className="relative z-10 flex items-center">
            <HandDrawnCalendar className="absolute left-3 w-5 h-5 text-[#00AB39] pointer-events-none" />
            <input
              type="date"
              value={selectedDate}
              onChange={handleDateChange}
              onFocus={() => setFocused('date')}
              onBlur={() => setFocused(null)}
              min={minDateStr}
              className="w-full pl-11 pr-3 py-3 bg-transparent focus:outline-none text-[#5D4E37] cursor-pointer"
              style={{ fontFamily: 'Patrick Hand, cursive', fontSize: '16px' }}
            />
          </div>

          {/* Display formatted date */}
          <AnimatePresence>
            {selectedDate && (
              <motion.p
                initial={{ opacity: 0, y: -5 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -5 }}
                className="mt-2 text-xs text-[#00AB39] hand-drawn flex items-center gap-1"
              >
                <span>Selected:</span> {formatDisplayDate()}
              </motion.p>
            )}
          </AnimatePresence>
        </div>

        {/* Time Picker */}
        <div className="relative">
          <svg
            className="absolute inset-0 w-full h-full pointer-events-none"
            style={{ filter: 'drop-shadow(2px 3px 4px rgba(0,0,0,0.08))' }}
          >
            <rect
              x="3"
              y="3"
              width="calc(100% - 6px)"
              height="calc(100% - 6px)"
              fill="#FFF9F0"
              stroke={focused === 'time' ? '#0071BC' : '#D4A574'}
              strokeWidth={focused === 'time' ? '3' : '2.5'}
              rx="12"
            />
            {focused === 'time' && (
              <rect
                x="5"
                y="5"
                width="calc(100% - 10px)"
                height="calc(100% - 10px)"
                fill="none"
                stroke="#0071BC"
                strokeWidth="2"
                rx="10"
                opacity="0.3"
                strokeDasharray="4, 4"
              />
            )}
          </svg>

          <div className="relative z-10 flex items-center">
            <Clock className="absolute left-3 w-5 h-5 text-[#0071BC] pointer-events-none" />
            <input
              type="time"
              value={selectedTime}
              onChange={handleTimeChange}
              onFocus={() => setFocused('time')}
              onBlur={() => setFocused(null)}
              className="w-full pl-11 pr-3 py-3 bg-transparent focus:outline-none text-[#5D4E37] cursor-pointer"
              style={{ fontFamily: 'Patrick Hand, cursive', fontSize: '16px' }}
            />
          </div>

          {/* Display formatted time */}
          <AnimatePresence>
            {selectedTime && (
              <motion.p
                initial={{ opacity: 0, y: -5 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -5 }}
                className="mt-2 text-xs text-[#0071BC] hand-drawn flex items-center gap-1"
              >
                <span>🕐</span> {formatDisplayTime()}
              </motion.p>
            )}
          </AnimatePresence>
        </div>
      </div>

      {/* Combined Display */}
      <AnimatePresence>
        {selectedDate && selectedTime && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className="mt-4 relative"
          >
            <svg
              className="absolute inset-0 w-full h-full pointer-events-none"
              style={{ filter: 'drop-shadow(2px 3px 4px rgba(0,0,0,0.08))' }}
            >
              <rect
                x="3"
                y="3"
                width="calc(100% - 6px)"
                height="calc(100% - 6px)"
                fill="#E8F5E9"
                stroke="#00AB39"
                strokeWidth="2.5"
                rx="12"
              />
            </svg>

            <div className="relative z-10 p-4 text-center">
              <p className="text-sm text-gray-600 mb-1">Estimated Time of Arrival</p>
              <p className="text-lg font-medium text-[#00AB39] sketch-title">
                {formatDisplayDate()} at {formatDisplayTime()}
              </p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
