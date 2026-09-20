import { motion, AnimatePresence } from 'motion/react';
import { CalendarIcon as Calendar, BedIcon as Bed, EuroIcon as Euro } from '../doodle/DoodleIcons';
import { useI18n } from '../hooks/useI18n';

interface PriceSummaryModalProps {
  checkInDate?: Date;
  checkOutDate?: Date;
  nights: number;
  pricePerNight: number;
  selectedBed?: number;
  isExpanded: boolean;
  onClose?: () => void;
}

export function PriceSummaryModal({
  checkInDate,
  checkOutDate,
  nights,
  pricePerNight,
  selectedBed,
  isExpanded,
  onClose,
}: PriceSummaryModalProps) {
  const { locale } = useI18n();
  const isEs = locale !== 'en';
  const totalCost = nights * pricePerNight;

  const getBunkInfo = (bedNum?: number) => {
    if (!bedNum) return { dormNumber: undefined, position: undefined, bunkNumber: undefined };
    const dormNumber = bedNum <= 12 ? 1 : 2;
    const isBottom = bedNum % 2 === 1;
    const bunkNumber = Math.ceil(bedNum / 2);
    const bunkNumberInDorm = bedNum <= 12 ? bunkNumber : bunkNumber - 6;
    return {
      dormNumber,
      position: isBottom ? (isEs ? 'Inferior' : 'Bottom') : isEs ? 'Superior' : 'Top',
      bunkNumber: bunkNumberInDorm,
    };
  };

  const bunkInfo = getBunkInfo(selectedBed);

  if (isExpanded) {
    return (
      <AnimatePresence>
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.9 }}
          transition={{ type: 'spring', stiffness: 200, damping: 25 }}
          className="fixed inset-0 z-100 flex items-center justify-center p-4"
        >
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 bg-black/40 backdrop-blur-sm"
            onClick={onClose}
          />

          <div className="relative w-full max-w-2xl z-10">
            <svg
              className="absolute inset-0 w-full h-full pointer-events-none"
              style={{ filter: 'drop-shadow(4px 6px 12px rgba(0,0,0,0.2))' }}
            >
              <rect
                x="4"
                y="4"
                width="calc(100% - 8px)"
                height="calc(100% - 8px)"
                fill="white"
                stroke="#00AB39"
                strokeWidth="4"
                rx="20"
              />
            </svg>

            <div className="relative z-10 p-8">
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-3">
                  <Euro className="w-8 h-8 text-[#00AB39]" />
                  <h2 className="text-3xl sketch-title text-[#5D4E37]">
                    {isEs ? 'Resumen de Reserva' : 'Booking Summary'}
                  </h2>
                </div>
              </div>

              <div className="space-y-4">
                {checkInDate && checkOutDate && (
                  <div className="flex items-center gap-3 p-4 bg-[#E8F5E9] rounded-lg doodle-border">
                    <Calendar className="w-6 h-6 text-[#00AB39] flex-shrink-0" />
                    <div className="flex-1">
                      <p className="text-sm text-gray-600 mb-1">
                        {isEs ? 'Período de Estancia' : 'Stay Period'}
                      </p>
                      <p
                        className="font-medium text-[#5D4E37]"
                        style={{ fontFamily: 'Patrick Hand, cursive' }}
                      >
                        {checkInDate.toLocaleDateString('en-US', {
                          month: 'short',
                          day: 'numeric',
                        })}
                        {' → '}
                        {checkOutDate.toLocaleDateString('en-US', {
                          month: 'short',
                          day: 'numeric',
                        })}
                      </p>
                    </div>
                  </div>
                )}

                {selectedBed && (
                  <div className="flex items-center gap-3 p-4 bg-[#E3F2FD] rounded-lg doodle-border">
                    <Bed className="w-6 h-6 text-[#0071BC] flex-shrink-0" />
                    <div className="flex-1">
                      <p className="text-sm text-gray-600 mb-1">
                        {isEs ? 'Cama Seleccionada' : 'Selected Bed'}
                      </p>
                      <p
                        className="font-medium text-[#5D4E37]"
                        style={{ fontFamily: 'Patrick Hand, cursive' }}
                      >
                        {isEs ? 'Cama' : 'Bed'} #{selectedBed} ({isEs ? 'Dorm.' : 'Dorm'}{' '}
                        {bunkInfo.dormNumber}, {isEs ? 'litera' : 'bunk'} {bunkInfo.position}{' '}
                        {bunkInfo.bunkNumber})
                      </p>
                    </div>
                  </div>
                )}

                <div className="pt-4 border-t-2 border-dashed border-gray-300">
                  <div className="space-y-3">
                    <div className="flex justify-between items-baseline">
                      <span
                        className="text-gray-600"
                        style={{ fontFamily: 'Patrick Hand, cursive' }}
                      >
                        {nights} {isEs ? 'noche' : 'night'}
                        {nights > 1 ? 's' : ''} × €{pricePerNight}
                      </span>
                      <span className="font-medium text-[#5D4E37]">€{nights * pricePerNight}</span>
                    </div>
                    <div className="flex justify-between items-baseline">
                      <span
                        className="text-gray-600"
                        style={{ fontFamily: 'Patrick Hand, cursive' }}
                      >
                        {isEs ? 'Tasa de servicio' : 'Service fee'}
                      </span>
                      <span className="font-medium text-[#5D4E37]">€0</span>
                    </div>
                  </div>

                  <div className="mt-4 pt-4 border-t-2 border-[#00AB39]">
                    <div className="flex justify-between items-center">
                      <span className="text-2xl sketch-title text-[#5D4E37]">Total</span>
                      <span className="text-3xl sketch-title text-[#00AB39]">€{totalCost}</span>
                    </div>
                  </div>
                </div>

                <div className="mt-4 p-4 bg-[#FFFFFF] rounded-lg doodle-border">
                  <p className="text-sm text-gray-600 hand-drawn">
                    ✨ <strong>{isEs ? 'Tarifa Peregrino:' : 'Pilgrim Rate:'}</strong> €
                    {pricePerNight}/{isEs ? 'noche' : 'night'}
                  </p>
                  <p className="text-xs text-gray-500 mt-2 hand-drawn">
                    {isEs
                      ? 'Entrada: 14:00 | Salida: 10:00'
                      : 'Check-in: 2:00 PM | Check-out: 10:00 AM'}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      </AnimatePresence>
    );
  }

  return (
    <motion.div
      initial={{ y: -100, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      exit={{ y: -100, opacity: 0 }}
      transition={{ type: 'spring', stiffness: 200, damping: 25 }}
      className="fixed top-2 lg:top-4 left-0 lg:left-80 right-0 z-40 px-4 lg:px-8"
    >
      <div className="relative max-w-full mx-auto" style={{ height: '60px' }}>
        <svg
          className="absolute inset-0 w-full h-full pointer-events-none"
          style={{ filter: 'drop-shadow(2px 3px 6px rgba(0,0,0,0.12))' }}
        >
          <rect
            x="3"
            y="3"
            width="calc(100% - 6px)"
            height="calc(100% - 6px)"
            fill="white"
            stroke="#00AB39"
            strokeWidth="3"
            rx="14"
          />
        </svg>

        <div className="relative z-10 px-4 lg:px-6 h-full flex items-center justify-between gap-4">
          <div className="flex items-center gap-2 flex-shrink-0">
            <div className="w-8 h-8 rounded-full bg-[#00AB39] flex items-center justify-center flex-shrink-0">
              <Euro className="w-5 h-5 text-white" />
            </div>
            <h3
              className="text-base font-medium text-gray-600 hidden sm:block"
              style={{ fontFamily: 'Patrick Hand, cursive' }}
            >
              {isEs ? 'Resumen de Reserva' : 'Booking Summary'}
            </h3>
          </div>

          <div className="flex items-center gap-3 lg:gap-5 flex-1 justify-center overflow-x-auto scrollbar-hide">
            {checkInDate && checkOutDate && (
              <div className="flex items-center gap-2 flex-shrink-0">
                <Calendar className="w-4 h-4 text-[#00AB39]" />
                <span
                  className="text-sm text-[#5D4E37] whitespace-nowrap"
                  style={{ fontFamily: 'Patrick Hand, cursive' }}
                >
                  {checkInDate.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                  {' → '}
                  {checkOutDate.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                </span>
              </div>
            )}

            {nights > 0 && checkInDate && checkOutDate && (
              <div className="w-px h-6 bg-gray-300 hidden md:block" />
            )}

            {nights > 0 && (
              <div className="flex items-center gap-1.5 flex-shrink-0">
                <span
                  className="text-sm text-[#5D4E37] whitespace-nowrap"
                  style={{ fontFamily: 'Patrick Hand, cursive' }}
                >
                  🌙 {nights} {isEs ? 'noche' : 'night'}
                  {nights > 1 ? 's' : ''}
                </span>
              </div>
            )}

            {selectedBed && <div className="w-px h-6 bg-gray-300 hidden lg:block" />}

            {selectedBed && (
              <motion.div
                className="flex items-center gap-2 flex-shrink-0 hidden lg:flex"
                initial={{ scale: 0 }}
                animate={{ scale: 1, y: [0, -4, 0, -2, 0] }}
                transition={{
                  scale: { type: 'spring', stiffness: 300, damping: 15 },
                  y: { duration: 1.2, repeat: Infinity, repeatDelay: 0.5, ease: 'easeInOut' },
                }}
              >
                <motion.div
                  animate={{ y: [0, -6, 0, -3, 0] }}
                  transition={{
                    duration: 1.2,
                    repeat: Infinity,
                    repeatDelay: 0.5,
                    ease: 'easeInOut',
                  }}
                >
                  <Bed className="w-4 h-4 text-[#0071BC]" />
                </motion.div>
                <motion.span
                  className="text-sm text-[#5D4E37] whitespace-nowrap font-medium"
                  style={{ fontFamily: 'Patrick Hand, cursive' }}
                  animate={{ scale: [1, 1.05, 1, 1.03, 1] }}
                  transition={{
                    duration: 1.2,
                    repeat: Infinity,
                    repeatDelay: 0.5,
                    ease: 'easeInOut',
                  }}
                >
                  {isEs ? 'Cama' : 'Bed'} #{selectedBed} • {isEs ? 'Dorm.' : 'Dorm'}{' '}
                  {bunkInfo.dormNumber}, {isEs ? 'litera' : 'bunk'} {bunkInfo.position}{' '}
                  {bunkInfo.bunkNumber}
                </motion.span>
              </motion.div>
            )}
          </div>

          <div className="flex items-center gap-1.5 flex-shrink-0">
            <span
              className="text-xs text-gray-500 hidden md:inline"
              style={{ fontFamily: 'Patrick Hand, cursive' }}
            >
              Total
            </span>
            <span
              className="text-xl font-bold text-[#00AB39]"
              style={{ fontFamily: 'Patrick Hand, cursive' }}
            >
              €{totalCost}
            </span>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
