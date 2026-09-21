import { useEffect, useState } from 'react';
import { motion } from 'motion/react';
import { PageHero } from './shared/PageHero';
import { useI18n } from './hooks/useI18n';
import { usePrefersReducedMotion } from './hooks/usePrefersReducedMotion';
import { NEO, NEO_INTERACTIVE } from './contact/neo';
import { CaminoMetrics } from './camino/CaminoMetrics';
import { DailyKmLoggerCard } from './camino/DailyKmLoggerCard';
import { ViaPlataSection } from './camino/ViaPlataSection';
import { CompassIcon, CalendarIcon, MapPinIcon, StarIcon } from './doodle/DoodleIcons';

const COPY = {
  es: {
    eyebrow: 'Vía de la Plata · Extremadura',
    title: 'Mi Camino',
    subtitle: 'Km diarios, etapas y la ruta que pasa por nuestra puerta.',
    stageTitle: 'Etapa actual',
    stageLoading: 'Cargando etapa…',
    stageError: 'Sin datos de etapa',
    book: 'Reservar albergue',
    bookHint: 'Cama en El Carrascalejo',
    tipsTitle: 'En el camino',
    tips: [
      'Descansa cada 5–7 días de marcha seguida.',
      'La etapa 11 pasa por El Carrascalejo.',
      'Meta diaria sugerida: 25 km.',
    ],
  },
  en: {
    eyebrow: 'Vía de la Plata · Extremadura',
    title: 'My Camino',
    subtitle: 'Daily km, stages, and the route past our door.',
    stageTitle: 'Current stage',
    stageLoading: 'Loading stage…',
    stageError: 'No stage data',
    book: 'Book the hostel',
    bookHint: 'A bed in El Carrascalejo',
    tipsTitle: 'On the trail',
    tips: [
      'Rest every 5–7 days of continuous walking.',
      'Stage 11 passes through El Carrascalejo.',
      'Suggested daily goal: 25 km.',
    ],
  },
} as const;

interface StagePayload {
  stageName?: string;
  progressPercent?: number;
  distanceCompleted?: number;
  distanceRemaining?: number;
  nextStage?: string;
  pace?: string;
}

export function CaminoPage() {
  const { locale } = useI18n();
  const isEs = locale !== 'en';
  const t = isEs ? COPY.es : COPY.en;
  const reduceMotion = usePrefersReducedMotion();
  const [stage, setStage] = useState<StagePayload | null>(null);
  const [stageStatus, setStageStatus] = useState<'loading' | 'ok' | 'error'>('loading');

  useEffect(() => {
    let cancelled = false;
    fetch('/api/camino/stage', { headers: { 'X-Requested-With': 'XMLHttpRequest' } })
      .then((r) => (r.ok ? r.json() : Promise.reject()))
      .then((data: StagePayload) => {
        if (cancelled) return;
        setStage(data);
        setStageStatus('ok');
      })
      .catch(() => {
        if (!cancelled) setStageStatus('error');
      });
    return () => {
      cancelled = true;
    };
  }, []);

  const panel = (i: number) =>
    reduceMotion
      ? {}
      : {
          initial: { opacity: 0, y: 16 },
          whileInView: { opacity: 1, y: 0 },
          viewport: { once: true, margin: '-40px' as const },
          transition: { delay: i * 0.05, duration: 0.35 },
        };

  return (
    <>
      <PageHero eyebrow={t.eyebrow} title={t.title} subtitle={t.subtitle} decor="distance" />

      <section className="container mx-auto max-w-5xl px-4 py-8">
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          <motion.div className={`${NEO} rounded-xl bg-white p-4`} {...panel(0)}>
            <CaminoMetrics />
          </motion.div>

          <motion.div className={`${NEO} rounded-xl bg-[#E8F5E9] p-4`} {...panel(1)}>
            <DailyKmLoggerCard />
          </motion.div>

          <motion.div className={`${NEO} rounded-xl bg-[#FFF8E7] p-4`} {...panel(2)}>
            <div className="mb-3 flex items-center gap-2">
              <MapPinIcon className="h-6 w-6 text-[#00AB39]" />
              <h3 className="text-lg font-black font-sketch text-[#1A1A1A]">{t.stageTitle}</h3>
            </div>
            {stageStatus === 'loading' && (
              <p className="text-sm font-semibold text-[#1A1A1A]/60">{t.stageLoading}</p>
            )}
            {stageStatus === 'error' && (
              <p className="text-sm font-semibold text-[#ED1C24]">{t.stageError}</p>
            )}
            {stageStatus === 'ok' && stage && (
              <div className="space-y-3">
                <div className="flex flex-wrap items-center gap-2">
                  <span
                    className={`${NEO} rounded-md bg-[#00AB39] px-3 py-1 text-xs font-black text-white`}
                  >
                    {stage.stageName}
                  </span>
                  <span className={`${NEO} rounded-md bg-white px-3 py-1 text-xs font-black`}>
                    {stage.progressPercent ?? 0}%
                  </span>
                </div>
                <div className="h-3 overflow-hidden rounded-md border-2 border-[#1A1A1A] bg-white">
                  <div
                    className="h-full bg-[#00AB39]"
                    style={{ width: `${Math.min(stage.progressPercent ?? 0, 100)}%` }}
                  />
                </div>
                <div className="grid grid-cols-2 gap-2 text-xs font-semibold text-[#1A1A1A]/80">
                  <div className={`${NEO} rounded-lg bg-white px-3 py-2`}>
                    <CompassIcon className="mb-1 h-4 w-4" />
                    {stage.distanceCompleted ?? 0} km
                  </div>
                  <div className={`${NEO} rounded-lg bg-white px-3 py-2`}>
                    <CalendarIcon className="mb-1 h-4 w-4" />
                    {stage.distanceRemaining ?? 0} km rest.
                  </div>
                  <div className={`${NEO} col-span-2 rounded-lg bg-white px-3 py-2`}>
                    → {stage.nextStage}
                    {stage.pace ? ` · ${stage.pace}` : ''}
                  </div>
                </div>
              </div>
            )}
          </motion.div>

          <motion.div
            className={`${NEO} flex flex-col rounded-xl bg-[#00AB39] p-4 text-white`}
            {...panel(3)}
          >
            <h3 className="mb-3 text-lg font-black font-sketch">{t.tipsTitle}</h3>
            <ul className="mb-4 flex-1 space-y-2">
              {t.tips.map((tip) => (
                <li
                  key={tip}
                  className="flex items-start gap-2 rounded-lg border-2 border-[#1A1A1A] bg-white px-3 py-2 text-sm font-semibold text-[#1A1A1A]"
                >
                  <StarIcon className="mt-0.5 h-4 w-4 shrink-0 text-[#00AB39]" />
                  {tip}
                </li>
              ))}
            </ul>
            <a
              href="/book"
              className={`${NEO_INTERACTIVE} block rounded-xl bg-[#EAC102] px-4 py-3 text-center text-sm font-black text-[#1A1A1A]`}
            >
              {t.book}
              <span className="mt-0.5 block text-[10px] font-semibold uppercase tracking-wide opacity-70">
                {t.bookHint}
              </span>
            </a>
          </motion.div>
        </div>
      </section>

      <ViaPlataSection />
    </>
  );
}
