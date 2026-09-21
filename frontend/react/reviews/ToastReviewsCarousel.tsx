import { useCallback, useEffect, useRef, useState, type ReactNode } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { useI18n } from '../hooks/useI18n';
import { ChatIcon, StarIcon, ExternalLinkIcon } from '../doodle/DoodleIcons';
import { REVIEWS, type Review } from './reviewsData';

const AUTO_ADVANCE_MS = 4500;
const FADE_DURATION = 0.4;

const COPY = {
  es: {
    eyebrow: 'Lo que dicen',
    title: 'Reseñas',
    sourceLabel: { booking: 'Booking.com', tripadvisor: 'TripAdvisor' },
  },
  en: {
    eyebrow: 'What they say',
    title: 'Reviews',
    sourceLabel: { booking: 'Booking.com', tripadvisor: 'TripAdvisor' },
  },
} as const;

const SOURCE_COLOR: Record<Review['source'], string> = {
  booking: '#003580',
  tripadvisor: '#00AA6C',
};

function NavButton({
  onClick,
  label,
  icon,
  disabled,
}: Readonly<{ onClick: () => void; label: string; icon: ReactNode; disabled?: boolean }>) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      aria-label={label}
      className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-full border-2 border-[#00AB39]/40 text-[#00AB39] hover:bg-[#E8F5E9] focus-visible:outline focus-visible:outline-2 focus-visible:outline-[#00AB39] transition-colors ${
        disabled ? 'opacity-30 cursor-not-allowed' : ''
      }`}
    >
      {icon}
    </button>
  );
}

function ReviewToast({
  review,
  t,
  index,
}: Readonly<{ review: Review; t: (typeof COPY)['es']; index: number }>) {
  return (
    <motion.div
      key={review.id}
      initial={{ opacity: 0, y: 20, scale: 0.95 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: -20, scale: 0.95 }}
      transition={{ duration: FADE_DURATION, ease: 'easeInOut' }}
      className="flex max-w-sm flex-col items-center rounded-xl border-2 border-[#5D4E37]/20 bg-[#FFFFFF] p-4 text-center doodle-shadow paper-texture sm:p-5"
      style={{ boxShadow: '0 8px 32px rgba(93,78,55,0.12)' }}
    >
      <ChatIcon className="mb-2 h-7 w-7 text-[#00AB39]" />

      {review.rating && (
        <div className="mb-1.5 flex gap-0.5">
          {Array.from({ length: 5 }, (_, i) => (
            <StarIcon
              key={i}
              className={`h-3.5 w-3.5 ${i < review.rating! ? 'text-[#EAC102]' : 'text-[#5D4E37]/20'}`}
              animate={false}
            />
          ))}
        </div>
      )}

      <p className="mb-3 text-sm text-[#5D4E37]/90 font-handwritten leading-relaxed">
        &ldquo;{review.quote}&rdquo;
      </p>

      <div className="flex flex-col items-center gap-1 text-xs font-bold text-[#5D4E37] font-sketch">
        <span>{review.author}</span>
        <span className="font-normal text-[#5D4E37]/50">{review.country}</span>
        <span
          className="rounded-full px-2 py-0.5 text-[9px] font-bold text-white"
          style={{ backgroundColor: SOURCE_COLOR[review.source] }}
        >
          {t.sourceLabel[review.source]}
        </span>
      </div>
    </motion.div>
  );
}

export function ToastReviewsCarousel() {
  const { locale } = useI18n();
  const isEs = locale !== 'en';
  const t = isEs ? COPY.es : COPY.en;

  const [index, setIndex] = useState(0);
  const [direction, setDirection] = useState(1);
  const [paused, setPaused] = useState(false);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const goTo = useCallback(
    (next: number) => {
      setDirection(next > index ? 1 : -1);
      setIndex((next + REVIEWS.length) % REVIEWS.length);
    },
    [index]
  );

  useEffect(() => {
    if (paused) return;
    timerRef.current = setInterval(() => {
      setDirection(1);
      setIndex((i) => (i + 1) % REVIEWS.length);
    }, AUTO_ADVANCE_MS);
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [paused]);

  const review = REVIEWS[index];

  return (
    <section
      className="relative py-8"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
      aria-label={isEs ? 'Reseñas de clientes' : 'Customer reviews'}
    >
      <div className="container mx-auto max-w-md px-4">
        <div className="mb-4 text-center">
          <p className="text-xs font-bold uppercase tracking-wide text-[#00AB39]">{t.eyebrow}</p>
          <h3 className="text-xl font-bold text-[#5D4E37] font-sketch">{t.title}</h3>
        </div>

        <div className="relative flex flex-col items-center gap-3">
          <NavButton
            onClick={() => goTo(index - 1)}
            label={isEs ? 'Anterior' : 'Previous'}
            icon={
              <svg
                className="h-5 w-5"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2.5"
              >
                <path d="M15 18l-6-6 6-6" />
              </svg>
            }
            disabled={false}
          />

          <div className="w-full min-h-[160px]">
            <AnimatePresence mode="wait" custom={direction}>
              <ReviewToast review={review} t={t} index={index} />
            </AnimatePresence>
          </div>

          <NavButton
            onClick={() => goTo(index + 1)}
            label={isEs ? 'Siguiente' : 'Next'}
            icon={
              <svg
                className="h-5 w-5"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2.5"
              >
                <path d="M9 18l6-6-6-6" />
              </svg>
            }
            disabled={false}
          />
        </div>

        <div className="mt-3 flex justify-center gap-1">
          {REVIEWS.map((_r, i) => (
            <button
              key={i}
              type="button"
              onClick={() => goTo(i)}
              aria-label={isEs ? `Reseña ${i + 1}` : `Review ${i + 1}`}
              aria-current={i === index}
              className={`h-1.5 rounded-full transition-all ${
                i === index ? 'w-5 bg-[#00AB39]' : 'w-1.5 bg-[#5D4E37]/20 hover:bg-[#5D4E37]/40'
              }`}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
