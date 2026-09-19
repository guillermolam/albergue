import { motion } from 'motion/react';
import { WiredButton } from '../doodle/WiredButton';
import { useState } from 'react';
import { Bed, ArrowUp, ArrowDown, MapPin } from 'lucide-react';
import { useI18n } from '../hooks/useI18n';

interface BedSelectionStepProps {
  onNext: (selectedBeds: number[]) => void;
  onBack: () => void;
}

const getBunkInfo = (bedNumber: number) => {
  const isBottom = bedNumber % 2 === 1;
  const bunkNumber = Math.ceil(bedNumber / 2);
  const dormNumber = bedNumber <= 12 ? 1 : 2;
  const bunkNumberInDorm = bedNumber <= 12 ? bunkNumber : bunkNumber - 6;

  return { isBottom, bunkNumber: bunkNumberInDorm, dormNumber };
};

function BedInfoCard({ bedNumber, isEs }: { bedNumber: number; isEs: boolean }) {
  const info = getBunkInfo(bedNumber);

  return (
    <motion.div
      initial={{ scale: 0, rotate: -10, y: 20 }}
      animate={{ scale: 1, rotate: 0, y: 0 }}
      exit={{ scale: 0, rotate: 10, y: -20 }}
      transition={{ type: 'spring', stiffness: 300, damping: 20 }}
      className="relative"
    >
      <svg
        className="absolute inset-0 w-full h-full pointer-events-none"
        style={{ filter: 'drop-shadow(4px 6px 8px rgba(0,0,0,0.2))' }}
      >
        <rect
          x="4"
          y="4"
          width="calc(100% - 8px)"
          height="calc(100% - 8px)"
          fill="white"
          stroke="#0071BC"
          strokeWidth="4"
          rx="20"
        />
      </svg>

      <div className="relative z-10 p-6 min-w-[280px]">
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ delay: 0.1, type: 'spring', stiffness: 400 }}
          className="text-center mb-4"
        >
          <div className="inline-flex items-center gap-3 bg-[#0071BC]/10 px-6 py-3 rounded-2xl">
            <motion.div
              animate={{ rotate: [0, -10, 10, -10, 0], scale: [1, 1.1, 1.1, 1.1, 1] }}
              transition={{ duration: 0.6, delay: 0.2 }}
            >
              <Bed className="w-8 h-8 text-[#0071BC]" strokeWidth={2.5} />
            </motion.div>
            <span className="text-4xl sketch-title text-[#0071BC]">
              {isEs ? 'Cama' : 'Bed'} #{bedNumber}
            </span>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.2 }}
          className="flex items-center justify-center gap-4 mb-4"
        >
          <div className="relative w-16 h-24">
            <motion.div
              initial={{ opacity: 0.3 }}
              animate={{
                opacity: info.isBottom ? 0.3 : 1,
                scale: info.isBottom ? 0.9 : 1,
                y: info.isBottom ? 0 : [0, -2, 0],
              }}
              transition={{
                opacity: { duration: 0.3, delay: 0.3 },
                scale: { duration: 0.3, delay: 0.3 },
                y: { duration: 1, repeat: Infinity, ease: 'easeInOut' },
              }}
              className={`absolute top-0 left-0 w-full h-8 rounded-lg border-3 ${
                info.isBottom ? 'bg-gray-200 border-gray-400' : 'bg-[#2196F3] border-[#1565C0]'
              } flex items-center justify-center`}
            >
              {!info.isBottom && (
                <motion.div
                  animate={{ scale: [1, 1.2, 1] }}
                  transition={{ duration: 0.5, repeat: Infinity, delay: 0.5 }}
                >
                  <ArrowUp className="w-4 h-4 text-white" strokeWidth={3} />
                </motion.div>
              )}
            </motion.div>

            <motion.div
              initial={{ opacity: 0.3 }}
              animate={{
                opacity: info.isBottom ? 1 : 0.3,
                scale: info.isBottom ? 1 : 0.9,
                y: info.isBottom ? [0, -2, 0] : 0,
              }}
              transition={{
                opacity: { duration: 0.3, delay: 0.3 },
                scale: { duration: 0.3, delay: 0.3 },
                y: { duration: 1, repeat: Infinity, ease: 'easeInOut' },
              }}
              className={`absolute bottom-0 left-0 w-full h-8 rounded-lg border-3 ${
                info.isBottom ? 'bg-[#2196F3] border-[#1565C0]' : 'bg-gray-200 border-gray-400'
              } flex items-center justify-center`}
            >
              {info.isBottom && (
                <motion.div
                  animate={{ scale: [1, 1.2, 1] }}
                  transition={{ duration: 0.5, repeat: Infinity, delay: 0.5 }}
                >
                  <ArrowDown className="w-4 h-4 text-white" strokeWidth={3} />
                </motion.div>
              )}
            </motion.div>

            <div className="absolute left-0 top-0 bottom-0 w-1 bg-gray-600 rounded" />
            <div className="absolute right-0 top-0 bottom-0 w-1 bg-gray-600 rounded" />
          </div>

          <div className="text-left">
            <motion.p
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.35 }}
              className="text-2xl sketch-title text-[#5D4E37]"
            >
              {info.isBottom
                ? isEs
                  ? 'Litera Inferior'
                  : 'Bottom Bunk'
                : isEs
                  ? 'Litera Superior'
                  : 'Top Bunk'}
            </motion.p>
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.4 }}
              className="text-sm text-gray-600 hand-drawn"
            >
              {isEs ? 'Litera' : 'Bunk'} #{info.bunkNumber}
            </motion.p>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.45 }}
          className="text-center pt-3 border-t-2 border-dashed border-gray-300"
        >
          <p className="text-sm text-gray-600 hand-drawn">
            🏠 {isEs ? 'Dormitorio' : 'Dormitory'} {info.dormNumber}
          </p>
        </motion.div>

        <motion.div
          initial={{ scale: 0, rotate: -180 }}
          animate={{ scale: 1, rotate: 0 }}
          transition={{ delay: 0.5, type: 'spring', stiffness: 200 }}
          className="absolute -top-3 -right-3 w-10 h-10 bg-[#00AB39] rounded-full flex items-center justify-center text-white text-2xl"
          style={{ boxShadow: '0 4px 8px rgba(0,171,57,0.4)' }}
        >
          ✓
        </motion.div>
      </div>
    </motion.div>
  );
}

function IsometricBed({
  bedNumber,
  status,
  onClick,
}: {
  bedNumber: number;
  status: 'available' | 'selected' | 'occupied';
  onClick: () => void;
}) {
  const colors = {
    available: { top: '#A5D6A7', side: '#66BB6A', front: '#4CAF50', stroke: '#2E7D32' },
    selected: { top: '#64B5F6', side: '#42A5F5', front: '#2196F3', stroke: '#1565C0' },
    occupied: { top: '#EF9A9A', side: '#E57373', front: '#F44336', stroke: '#C62828' },
  };

  const color = colors[status];
  const isDisabled = status === 'occupied';

  return (
    <motion.button
      onClick={onClick}
      disabled={isDisabled}
      whileHover={!isDisabled ? { scale: 1.1, y: -5 } : {}}
      whileTap={!isDisabled ? { scale: 0.95 } : {}}
      transition={{ type: 'spring', stiffness: 300 }}
      className={`relative ${isDisabled ? 'cursor-not-allowed opacity-60' : 'cursor-pointer'}`}
      style={{ width: '100%', height: '120px' }}
    >
      <svg
        viewBox="0 0 120 120"
        className="w-full h-full"
        style={{ filter: 'drop-shadow(3px 4px 4px rgba(0,0,0,0.2))' }}
      >
        <path
          d="M30,50 L70,30 L110,50 L70,70 Z"
          fill={color.top}
          stroke={color.stroke}
          strokeWidth="2"
          strokeLinejoin="round"
        />
        <path
          d="M70,30 L110,50 L110,75 L70,95 Z"
          fill={color.side}
          stroke={color.stroke}
          strokeWidth="2"
          strokeLinejoin="round"
        />
        <path
          d="M30,50 L70,70 L70,95 L30,75 Z"
          fill={color.front}
          stroke={color.stroke}
          strokeWidth="2"
          strokeLinejoin="round"
        />
        <ellipse
          cx="50"
          cy="47"
          rx="15"
          ry="8"
          fill="white"
          stroke={color.stroke}
          strokeWidth="1.5"
          opacity="0.9"
        />
        <path
          d="M25,40 L25,60 L30,58 L30,38 Z"
          fill={color.side}
          stroke={color.stroke}
          strokeWidth="2"
        />
        <text
          x="70"
          y="85"
          textAnchor="middle"
          fill="white"
          fontSize="18"
          fontFamily="Cabin Sketch, cursive"
          fontWeight="bold"
          stroke={color.stroke}
          strokeWidth="0.5"
        >
          {bedNumber}
        </text>
        {status === 'selected' && (
          <g>
            <circle cx="95" cy="40" r="8" fill="white" opacity="0.95" />
            <path
              d="M92,40 L94,42 L98,38"
              stroke={color.stroke}
              strokeWidth="2.5"
              fill="none"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </g>
        )}
        {status === 'occupied' && (
          <g>
            <circle cx="95" cy="40" r="8" fill="white" opacity="0.95" />
            <path
              d="M91,36 L99,44 M91,44 L99,36"
              stroke={color.stroke}
              strokeWidth="2.5"
              strokeLinecap="round"
            />
          </g>
        )}
      </svg>
    </motion.button>
  );
}

export function BedSelectionStep({ onNext, onBack }: BedSelectionStepProps) {
  const { locale } = useI18n();
  const isEs = locale !== 'en';

  const [dorm1Beds, setDorm1Beds] = useState<('available' | 'selected' | 'occupied')[]>(
    Array.from({ length: 12 }, (_, i) => (i === 4 || i === 8 ? 'occupied' : 'available'))
  );
  const [dorm2Beds, setDorm2Beds] = useState<('available' | 'selected' | 'occupied')[]>(
    Array.from({ length: 12 }, (_, i) => (i === 2 || i === 10 ? 'occupied' : 'available'))
  );
  const [error, setError] = useState('');

  const handleBedClick = (dorm: 1 | 2, index: number) => {
    setError('');
    if (dorm === 1) {
      setDorm1Beds((prev) => {
        const newBeds = [...prev];
        if (newBeds[index] === 'available') {
          setDorm2Beds(
            Array.from({ length: 12 }, (_, i) =>
              dorm2Beds[i] === 'occupied' ? 'occupied' : 'available'
            )
          );
          return newBeds.map((status, i) =>
            status === 'occupied' ? 'occupied' : i === index ? 'selected' : 'available'
          );
        } else if (newBeds[index] === 'selected') {
          newBeds[index] = 'available';
        }
        return newBeds;
      });
    } else {
      setDorm2Beds((prev) => {
        const newBeds = [...prev];
        if (newBeds[index] === 'available') {
          setDorm1Beds(
            Array.from({ length: 12 }, (_, i) =>
              dorm1Beds[i] === 'occupied' ? 'occupied' : 'available'
            )
          );
          return newBeds.map((status, i) =>
            status === 'occupied' ? 'occupied' : i === index ? 'selected' : 'available'
          );
        } else if (newBeds[index] === 'selected') {
          newBeds[index] = 'available';
        }
        return newBeds;
      });
    }
  };

  const selectedBedNumbers = [
    ...dorm1Beds.map((status, i) => (status === 'selected' ? i + 1 : null)).filter(Boolean),
    ...dorm2Beds.map((status, i) => (status === 'selected' ? i + 13 : null)).filter(Boolean),
  ].filter((n) => n !== null) as number[];

  const handleContinue = () => {
    if (selectedBedNumbers.length === 0) {
      setError(isEs ? 'Selecciona al menos una cama' : 'Please select at least one bed');
      return;
    }
    onNext(selectedBedNumbers);
  };

  return (
    <div className="max-w-6xl mx-auto">
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
            <Bed className="w-20 h-20 text-[#00AB39] mx-auto" strokeWidth={2} />
          </motion.div>
          <h1 className="text-4xl md:text-5xl sketch-title text-[#5D4E37] mb-3">
            {isEs ? 'Elige tu cama' : 'Select Your Bed'}
          </h1>
          <p className="text-lg text-gray-600 hand-drawn">
            {isEs
              ? 'Elige entre nuestros cómodos dormitorios'
              : 'Choose from our comfortable dormitories'}
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

        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="flex flex-wrap justify-center gap-6 mb-12"
        >
          {[
            { status: isEs ? 'Disponible' : 'Available', color: '#4CAF50' },
            { status: isEs ? 'Seleccionada' : 'Selected', color: '#2196F3' },
            { status: isEs ? 'Ocupada' : 'Occupied', color: '#F44336' },
          ].map((item) => (
            <div key={item.status} className="flex items-center gap-2">
              <div
                className="w-6 h-6 rounded doodle-border"
                style={{ backgroundColor: item.color }}
              />
              <span className="text-[#5D4E37] font-medium">{item.status}</span>
            </div>
          ))}
        </motion.div>

        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.4 }}
          className="mb-12 relative"
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

          <div className="relative z-10 p-8">
            <h2 className="text-3xl sketch-title text-[#00AB39] mb-6 flex items-center gap-3">
              <MapPin className="w-7 h-7" strokeWidth={2.5} />
              {isEs ? 'Dormitorio 1' : 'Dormitory 1'}
              <span className="text-lg text-gray-600 hand-drawn">
                {isEs ? '(Camas 1-12)' : '(Beds 1-12)'}
              </span>
            </h2>
            <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 gap-6">
              {dorm1Beds.map((status, index) => (
                <motion.div
                  key={`dorm1-${index}`}
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.5 + index * 0.03 }}
                >
                  <IsometricBed
                    bedNumber={index + 1}
                    status={status}
                    onClick={() => handleBedClick(1, index)}
                  />
                </motion.div>
              ))}
            </div>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.6 }}
          className="mb-12 relative"
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
              stroke="#D4A574"
              strokeWidth="3.5"
              rx="24"
            />
          </svg>

          <div className="relative z-10 p-8">
            <h2 className="text-3xl sketch-title text-[#D4A574] mb-6 flex items-center gap-3">
              <span>🏠</span> {isEs ? 'Dormitorio 2' : 'Dormitory 2'}{' '}
              <span className="text-lg text-gray-600 hand-drawn">
                {isEs ? '(Camas 13-24)' : '(Beds 13-24)'}
              </span>
            </h2>
            <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 gap-6">
              {dorm2Beds.map((status, index) => (
                <motion.div
                  key={`dorm2-${index}`}
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.7 + index * 0.03 }}
                >
                  <IsometricBed
                    bedNumber={index + 13}
                    status={status}
                    onClick={() => handleBedClick(2, index)}
                  />
                </motion.div>
              ))}
            </div>
          </div>
        </motion.div>

        {selectedBedNumbers.length > 0 && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="mb-8 flex flex-col lg:flex-row gap-6 items-center justify-center"
          >
            <BedInfoCard bedNumber={selectedBedNumbers[0]} isEs={isEs} />

            <div className="relative">
              <svg className="absolute inset-0 w-full h-full pointer-events-none">
                <rect
                  x="4"
                  y="4"
                  width="calc(100% - 8px)"
                  height="calc(100% - 8px)"
                  fill="#E8F5E9"
                  stroke="#00AB39"
                  strokeWidth="3"
                  rx="16"
                />
              </svg>
              <div className="relative z-10 p-6 text-center min-w-[200px]">
                <p className="text-2xl sketch-title text-[#00AB39]">
                  ✨ {isEs ? '¡Listo!' : 'Ready!'}
                </p>
                <p className="text-gray-600 mt-2 hand-drawn">
                  {isEs ? 'Tu cama está reservada' : 'Your bed is reserved'}
                </p>
              </div>
            </div>
          </motion.div>
        )}

        {error && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-8 relative"
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

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8 }}
          className="flex gap-4 justify-between"
        >
          <WiredButton variant="outline" size="lg" onClick={onBack}>
            ← {isEs ? 'Volver al Formulario' : 'Back to Form'}
          </WiredButton>

          <WiredButton variant="primary" size="lg" onClick={handleContinue}>
            {isEs ? 'Continuar al Pago' : 'Continue to Payment'} →
          </WiredButton>
        </motion.div>
      </motion.div>
    </div>
  );
}
