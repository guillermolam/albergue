import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { useI18n } from '../hooks/useI18n';
import { WiredButton } from '../doodle/WiredButton';
import { CompassIcon, CheckCircleIcon, LoaderIcon } from '../doodle/DoodleIcons';

const QUICK_STEPS = [5, 10, 15, 20, 25];
const RING_RADIUS = 46;
const RING_CIRCUMFERENCE = 2 * Math.PI * RING_RADIUS;

const COPY = {
  es: {
    title: 'Registrar Km de Hoy',
    subtitle: 'de tu meta diaria',
    placeholder: 'Km',
    submit: 'Guardar',
    saving: 'Guardando...',
    success: (km: number) => `¡${km} km guardados! Sigue así.`,
    error: 'No se pudo guardar. Inténtalo de nuevo.',
    connError: 'Error de conexión. Inténtalo de nuevo.',
    invalid: 'Introduce un número de km válido.',
    today: (d: Date) =>
      new Intl.DateTimeFormat('es-ES', { weekday: 'long', day: 'numeric', month: 'long' }).format(
        d
      ),
  },
  en: {
    title: "Log Today's Km",
    subtitle: 'of your daily goal',
    placeholder: 'Km',
    submit: 'Save',
    saving: 'Saving...',
    success: (km: number) => `${km} km saved! Keep it up.`,
    error: 'Could not save. Please try again.',
    connError: 'Connection error. Please try again.',
    invalid: 'Enter a valid number of km.',
    today: (d: Date) =>
      new Intl.DateTimeFormat('en-GB', { weekday: 'long', day: 'numeric', month: 'long' }).format(
        d
      ),
  },
} as const;

interface DailyKmLoggerCardProps {
  initialKm?: number;
  dailyGoalKm?: number;
  onSubmitUrl?: string;
}

type Status = 'idle' | 'loading' | 'success' | 'error';

export function DailyKmLoggerCard({
  initialKm = 0,
  dailyGoalKm = 25,
  onSubmitUrl = '/api/camino/log-km',
}: Readonly<DailyKmLoggerCardProps>) {
  const { locale } = useI18n();
  const isEs = locale !== 'en';
  const t = isEs ? COPY.es : COPY.en;

  const [km, setKm] = useState(initialKm);
  const [status, setStatus] = useState<Status>('idle');
  const [message, setMessage] = useState('');

  const pct = Math.min(Math.max(km / dailyGoalKm, 0), 1);
  const dashOffset = RING_CIRCUMFERENCE * (1 - pct);

  function adjust(delta: number) {
    setKm((prev) => Math.max(0, Math.round((prev + delta) * 10) / 10));
  }

  async function handleSubmit() {
    if (isNaN(km) || km < 0) {
      setStatus('error');
      setMessage(t.invalid);
      return;
    }

    setStatus('loading');
    try {
      const res = await fetch(onSubmitUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'X-Requested-With': 'XMLHttpRequest' },
        body: JSON.stringify({ km, date: new Date().toISOString().split('T')[0] }),
      });
      const data = await res.json();
      if (data.success) {
        setStatus('success');
        setMessage(t.success(km));
      } else {
        setStatus('error');
        setMessage(data.error || t.error);
      }
    } catch {
      setStatus('error');
      setMessage(t.connError);
    }
  }

  return (
    <div className="rounded-xl border-2 border-[#00AB39]/40 bg-linear-to-br from-[#E8F5E9] to-[#FFF9F0] p-5 doodle-shadow paper-texture">
      <div className="flex items-center gap-2 mb-1">
        <CompassIcon className="h-6 w-6 text-[#00AB39]" />
        <h3 className="text-base font-bold text-[#5D4E37] font-sketch">{t.title}</h3>
      </div>
      <p className="mb-4 text-xs capitalize text-[#5D4E37]/60 font-handwritten">
        {t.today(new Date())} · {dailyGoalKm} km {t.subtitle}
      </p>

      {/* Not a <form>: this page runs swup with `forms: true`, which
       * intercepts native submit events as full-page transitions before
       * React's handler can stop it. Plain click/Enter handling avoids the
       * native submit event entirely. */}
      <div className="flex flex-col items-center gap-4 sm:flex-row sm:items-start">
        {/* Progress ring */}
        <div className="relative shrink-0">
          <svg width="112" height="112" viewBox="0 0 112 112" className="-rotate-90">
            <circle cx="56" cy="56" r={RING_RADIUS} fill="none" stroke="#E8F5E9" strokeWidth="10" />
            <motion.circle
              cx="56"
              cy="56"
              r={RING_RADIUS}
              fill="none"
              stroke="#00AB39"
              strokeWidth="10"
              strokeLinecap="round"
              strokeDasharray={RING_CIRCUMFERENCE}
              initial={false}
              animate={{ strokeDashoffset: dashOffset }}
              transition={{ type: 'spring', stiffness: 120, damping: 20 }}
            />
          </svg>
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <span className="text-xl font-bold text-[#5D4E37] font-sketch">{km}</span>
            <span className="text-[10px] text-[#5D4E37]/60">/ {dailyGoalKm} km</span>
          </div>
        </div>

        <div className="flex-1 w-full">
          <div className="mb-3 flex flex-wrap gap-1.5">
            {QUICK_STEPS.map((step) => (
              <button
                key={step}
                type="button"
                onClick={() => setKm(step)}
                className={`rounded-full border px-2.5 py-1 text-xs font-semibold transition-colors ${
                  km === step
                    ? 'border-[#00AB39] bg-[#00AB39] text-white'
                    : 'border-[#00AB39]/30 bg-white text-[#5D4E37] hover:border-[#00AB39]/60'
                }`}
              >
                {step} km
              </button>
            ))}
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => adjust(-0.5)}
              aria-label="-0.5 km"
              className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full border-2 border-[#00AB39]/40 text-lg font-bold text-[#00AB39] hover:bg-[#E8F5E9]"
            >
              −
            </button>
            <input
              type="number"
              min="0"
              step="0.1"
              value={km}
              onChange={(e) => setKm(parseFloat(e.target.value) || 0)}
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  e.preventDefault();
                  handleSubmit();
                }
              }}
              placeholder={t.placeholder}
              aria-label="Kilómetros recorridos hoy"
              className="w-20 rounded-lg border-2 border-[#00AB39]/30 bg-white px-2 py-1.5 text-center text-lg font-bold text-[#5D4E37] focus-visible:outline focus-visible:outline-2 focus-visible:outline-[#00AB39]"
            />
            <button
              type="button"
              onClick={() => adjust(0.5)}
              aria-label="+0.5 km"
              className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full border-2 border-[#00AB39]/40 text-lg font-bold text-[#00AB39] hover:bg-[#E8F5E9]"
            >
              +
            </button>
            <WiredButton
              type="button"
              onClick={handleSubmit}
              variant="primary"
              size="sm"
              disabled={status === 'loading'}
            >
              {status === 'loading' ? (
                <span className="flex items-center gap-1.5">
                  <LoaderIcon className="h-4 w-4 animate-spin" /> {t.saving}
                </span>
              ) : (
                t.submit
              )}
            </WiredButton>
          </div>

          <AnimatePresence mode="wait">
            {status !== 'idle' && status !== 'loading' && (
              <motion.p
                key={status + message}
                initial={{ opacity: 0, y: -4 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                className={`mt-2 flex items-center gap-1.5 text-sm font-semibold ${
                  status === 'success' ? 'text-[#00AB39]' : 'text-red-600'
                }`}
                role="status"
                aria-live="polite"
              >
                {status === 'success' && <CheckCircleIcon className="h-4 w-4" />}
                {message}
              </motion.p>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}
