import { useCallback, useEffect, useRef, useState, type ReactNode } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { useI18n } from '../hooks/useI18n';
import {
  ChatIcon,
  StarIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
  ExternalLinkIcon,
} from '../doodle/DoodleIcons';
import { BOOKING_AGGREGATE, REVIEWS, type Review } from './reviewsData';

const AUTO_ADVANCE_MS = 6000;

const COPY = {
  es: {
    eyebrow: 'Lo que dicen nuestros huéspedes',
    title: 'Reseñas reales de peregrinos',
    aggregate: (score: number, count: number, label: string) =>
      `${score.toFixed(1)}/10 · ${label} · ${count} reseñas en Booking.com`,
    seeAll: 'Ver todas en Booking.com',
    sourceLabel: { booking: 'Booking.com', tripadvisor: 'TripAdvisor' },
    prev: 'Reseña anterior',
    next: 'Reseña siguiente',
    goTo: (n: number) => `Ir a la reseña ${n}`,
  },
  en: {
    eyebrow: 'What our guests say',
    title: 'Real reviews from pilgrims',
    aggregate: (score: number, count: number, label: string) =>
      `${score.toFixed(1)}/10 · ${label} · ${count} reviews on Booking.com`,
    seeAll: 'See all on Booking.com',
    sourceLabel: { booking: 'Booking.com', tripadvisor: 'TripAdvisor' },
    prev: 'Previous review',
    next: 'Next review',
    goTo: (n: number) => `Go to review ${n}`,
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
}: Readonly<{ onClick: () => void; label: string; icon: ReactNode }>) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-label={label}
      className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full border-2 border-[#00AB39]/40 text-[#00AB39] hover:bg-[#E8F5E9] focus-visible:outline focus-visible:outline-2 focus-visible:outline-[#00AB39]"
    >
      {icon}
    </button>
  );
}

function ReviewCard({ review, t }: Readonly<{ review: Review; t: (typeof COPY)['es'] }>) {
  return (
    <div className="mx-auto flex max-w-xl flex-col items-center rounded-xl border-2 border-[#5D4E37]/20 bg-[#FFFFFF] p-6 text-center doodle-shadow paper-texture sm:p-8">
      <ChatIcon className="mb-3 h-9 w-9 text-[#00AB39]" />

      {review.rating && (
        <div className="mb-2 flex gap-0.5">
          {Array.from({ length: 5 }, (_, i) => (
            <StarIcon
              key={i}
              className={`h-4 w-4 ${i < review.rating! ? 'text-[#EAC102]' : 'text-[#5D4E37]/20'}`}
              animate={false}
            />
          ))}
        </div>
      )}

      <p className="mb-4 text-base text-[#5D4E37]/90 font-handwritten sm:text-lg">
        &ldquo;{review.quote}&rdquo;
      </p>

      <div className="flex items-center gap-2 text-sm font-bold text-[#5D4E37] font-sketch">
        {review.author}
        <span className="font-normal text-[#5D4E37]/50">· {review.country}</span>
      </div>
      <span
        className="mt-1 rounded-full px-2.5 py-0.5 text-[10px] font-bold text-white"
        style={{ backgroundColor: SOURCE_COLOR[review.source] }}
      >
        {t.sourceLabel[review.source]}
      </span>
    </div>
  );
}

export function ReviewsCarousel() {
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
      className="py-12 bg-white"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
    >
      <div className="container mx-auto max-w-3xl px-4">
        <div className="mb-6 text-center">
          <p className="text-xs font-bold uppercase tracking-wide text-[#00AB39]">{t.eyebrow}</p>
          <h2 className="text-2xl font-bold text-[#5D4E37] font-sketch">{t.title}</h2>
          <a
            href={BOOKING_AGGREGATE.sourceUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-2 inline-flex items-center gap-1.5 text-sm text-[#5D4E37]/70 hover:text-[#00AB39]"
          >
            {t.aggregate(
              BOOKING_AGGREGATE.score,
              BOOKING_AGGREGATE.reviewCount,
              BOOKING_AGGREGATE.label
            )}
            <ExternalLinkIcon className="h-3.5 w-3.5" />
          </a>
        </div>

        <div className="relative flex items-center gap-2 sm:gap-4">
          <NavButton
            onClick={() => goTo(index - 1)}
            label={t.prev}
            icon={<ChevronLeftIcon className="h-5 w-5" animate={false} />}
          />

          <div className="min-h-[260px] flex-1 overflow-hidden">
            <AnimatePresence mode="wait" custom={direction}>
              <motion.div
                key={review.id}
                custom={direction}
                initial={{ opacity: 0, x: direction * 40 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: direction * -40 }}
                transition={{ duration: 0.35, ease: 'easeInOut' }}
              >
                <ReviewCard review={review} t={t} />
              </motion.div>
            </AnimatePresence>
          </div>

          <NavButton
            onClick={() => goTo(index + 1)}
            label={t.next}
            icon={<ChevronRightIcon className="h-5 w-5" animate={false} />}
          />
        </div>

        <div className="mt-5 flex justify-center gap-1.5">
          {REVIEWS.map((r, i) => (
            <button
              key={r.id}
              type="button"
              onClick={() => goTo(i)}
              aria-label={t.goTo(i + 1)}
              aria-current={i === index}
              className={`h-2 rounded-full transition-all ${
                i === index ? 'w-6 bg-[#00AB39]' : 'w-2 bg-[#5D4E37]/20 hover:bg-[#5D4E37]/40'
              }`}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
