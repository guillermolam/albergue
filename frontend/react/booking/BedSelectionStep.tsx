import { motion } from 'motion/react';
import { actions } from 'astro:actions';
import { WiredButton } from '../doodle/WiredButton';
import { useEffect, useMemo, useState } from 'react';
import { BedIcon as Bed, MapPinIcon as MapPin } from '../doodle/DoodleIcons';
import { useI18n } from '../hooks/useI18n';

export interface AvailableBed {
  id: number;
  bedNumber: number;
  roomNumber: number;
  roomName: string;
  roomType: string | null;
  pricePerNight: string;
  currency: string | null;
}

interface BedSelectionStepProps {
  checkInDate?: Date;
  checkOutDate?: Date;
  /** Returns true on success (advance) or false on failure (stay, error
   * already surfaced by the parent -- see BookingFlow.tsx's handleBedNext). */
  onNext: (bed: AvailableBed) => Promise<boolean>;
  onBack: () => void;
}

function toIsoDate(date: Date): string {
  return date.toISOString().slice(0, 10);
}

function BedDetailCard({ bed, isEs }: { bed: AvailableBed; isEs: boolean }) {
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

      <div className="relative z-10 p-6 min-w-[280px] text-center">
        <div className="inline-flex items-center gap-3 bg-[#0071BC]/10 px-6 py-3 rounded-2xl mb-4">
          <Bed className="w-8 h-8 text-[#0071BC]" />
          <span className="text-3xl sketch-title text-[#0071BC]">
            {isEs ? 'Cama' : 'Bed'} #{bed.bedNumber}
          </span>
        </div>
        <p className="text-lg text-[#5D4E37] hand-drawn">{bed.roomName}</p>
        <p className="text-2xl sketch-title text-[#00AB39] mt-2">
          €{bed.pricePerNight}{' '}
          <span className="text-sm text-gray-500">/{isEs ? 'noche' : 'night'}</span>
        </p>
      </div>
    </motion.div>
  );
}

function IsometricBed({
  bedNumber,
  selected,
  onClick,
}: {
  bedNumber: number;
  selected: boolean;
  onClick: () => void;
}) {
  const color = selected
    ? { top: '#64B5F6', side: '#42A5F5', front: '#2196F3', stroke: '#1565C0' }
    : { top: '#A5D6A7', side: '#66BB6A', front: '#4CAF50', stroke: '#2E7D32' };

  return (
    <motion.button
      onClick={onClick}
      whileHover={{ scale: 1.1, y: -5 }}
      whileTap={{ scale: 0.95 }}
      transition={{ type: 'spring', stiffness: 300 }}
      className="relative cursor-pointer"
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
        {selected && (
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
      </svg>
    </motion.button>
  );
}

export function BedSelectionStep({
  checkInDate,
  checkOutDate,
  onNext,
  onBack,
}: BedSelectionStepProps) {
  const { locale } = useI18n();
  const isEs = locale !== 'en';

  const [beds, setBeds] = useState<AvailableBed[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState('');
  const [selectedBedId, setSelectedBedId] = useState<number | null>(null);
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (!checkInDate || !checkOutDate) {
      setLoadError(
        isEs ? 'Selecciona primero las fechas de tu estancia' : 'Select your stay dates first'
      );
      setLoading(false);
      return;
    }

    let cancelled = false;
    setLoading(true);
    setLoadError('');

    actions.booking
      .getAvailableBeds({
        checkInDate: toIsoDate(checkInDate),
        checkOutDate: toIsoDate(checkOutDate),
      })
      .then(({ data, error: actionError }) => {
        if (cancelled) return;
        if (actionError) {
          setLoadError(actionError.message);
          return;
        }
        setBeds(data ?? []);
      })
      .catch(() => {
        if (!cancelled) {
          setLoadError(
            isEs ? 'No se pudo cargar la disponibilidad' : 'Could not load availability'
          );
        }
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });

    return () => {
      cancelled = true;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps -- re-fetch only when dates change
  }, [checkInDate?.getTime(), checkOutDate?.getTime()]);

  const bedsByRoom = useMemo(() => {
    const grouped = new Map<number, AvailableBed[]>();
    for (const bed of beds) {
      const list = grouped.get(bed.roomNumber) ?? [];
      list.push(bed);
      grouped.set(bed.roomNumber, list);
    }
    return [...grouped.entries()].sort(([a], [b]) => a - b);
  }, [beds]);

  const selectedBed = beds.find((b) => b.id === selectedBedId) ?? null;

  const handleContinue = async () => {
    if (!selectedBed) {
      setError(isEs ? 'Selecciona una cama' : 'Please select a bed');
      return;
    }
    setError('');
    setSubmitting(true);
    const ok = await onNext(selectedBed);
    setSubmitting(false);
    if (!ok) {
      setError(
        isEs
          ? 'Esa cama ya no está disponible. Elige otra.'
          : 'That bed is no longer available. Please pick another.'
      );
      setSelectedBedId(null);
    }
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
            <Bed className="w-20 h-20 text-[#00AB39] mx-auto" />
          </motion.div>
          <h1 className="text-4xl md:text-5xl sketch-title text-[#5D4E37] mb-3">
            {isEs ? 'Elige tu cama' : 'Select Your Bed'}
          </h1>
          <p className="text-lg text-gray-600 hand-drawn">
            {isEs
              ? 'Elige entre nuestros cómodos dormitorios'
              : 'Choose from our comfortable dormitories'}
          </p>
        </div>

        {loading && (
          <p className="text-center text-gray-500 hand-drawn mb-8">
            {isEs ? 'Cargando disponibilidad...' : 'Loading availability...'}
          </p>
        )}

        {loadError && !loading && (
          <div className="mb-8 relative">
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
              <p className="text-[#ED1C24] font-medium hand-drawn">{loadError}</p>
            </div>
          </div>
        )}

        {!loading && !loadError && beds.length === 0 && (
          <p className="text-center text-gray-500 hand-drawn mb-8">
            {isEs
              ? 'No hay camas disponibles para esas fechas.'
              : 'No beds available for those dates.'}
          </p>
        )}

        {bedsByRoom.map(([roomNumber, roomBeds], roomIndex) => (
          <motion.div
            key={roomNumber}
            initial={{ opacity: 0, x: roomIndex % 2 === 0 ? -20 : 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3 + roomIndex * 0.1 }}
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
                <MapPin className="w-7 h-7" />
                {roomBeds[0].roomName}
              </h2>
              <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 gap-6">
                {roomBeds.map((bed) => (
                  <motion.div
                    key={bed.id}
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                  >
                    <IsometricBed
                      bedNumber={bed.bedNumber}
                      selected={bed.id === selectedBedId}
                      onClick={() => {
                        setError('');
                        setSelectedBedId(bed.id === selectedBedId ? null : bed.id);
                      }}
                    />
                  </motion.div>
                ))}
              </div>
            </div>
          </motion.div>
        ))}

        {selectedBed && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="mb-8 flex justify-center"
          >
            <BedDetailCard bed={selectedBed} isEs={isEs} />
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
          <WiredButton variant="outline" size="lg" onClick={onBack} disabled={submitting}>
            ← {isEs ? 'Volver al Formulario' : 'Back to Form'}
          </WiredButton>

          <WiredButton
            variant="primary"
            size="lg"
            onClick={handleContinue}
            disabled={submitting || loading}
          >
            {submitting
              ? isEs
                ? 'Guardando...'
                : 'Saving...'
              : `${isEs ? 'Continuar al Pago' : 'Continue to Payment'} →`}
          </WiredButton>
        </motion.div>
      </motion.div>
    </div>
  );
}
