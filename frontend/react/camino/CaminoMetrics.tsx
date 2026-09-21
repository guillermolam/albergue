import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { useI18n } from '../hooks/useI18n';
import {
  MapPinIcon,
  StarIcon,
  CalendarIcon,
  TrendingUpIcon,
  CompassIcon,
} from '../doodle/DoodleIcons';
import { WiredButton } from '../doodle/WiredButton';
import { getCached, setCached } from '../../src/utils/cache';

const CACHE_KEY = 'camino-metrics';
const CACHE_TTL = 12 * 60 * 60 * 1000; // 12 hours in ms

interface DailyMetrics {
  km: number;
  date: string;
  goal: number;
  percentage: number;
}

interface WeeklyMetrics {
  totalKm: number;
  days: number;
  averageDaily: number;
  logs: Array<{ km: number; date: string }>;
}

interface HistoricalMetrics {
  totalKm: number;
  totalDays: number;
  averageDaily: number;
  logs: Array<{ km: number; date: string }>;
  bestDay: { km: number; date: string };
  streaks: { current: number; longest: number };
}

interface MetricsData {
  daily: DailyMetrics;
  weekly: WeeklyMetrics;
  historical: HistoricalMetrics;
}

const COPY = {
  es: {
    title: 'Tus Métricas del Camino',
    subtitle: 'Diario · Semanal · Histórico',
    daily: 'Hoy',
    weekly: 'Esta semana',
    historical: 'Todo el camino',
    km: 'km',
    goal: 'Meta',
    avg: 'Promedio',
    total: 'Total',
    days: 'días',
    bestDay: 'Mejor día',
    currentStreak: 'Racha actual',
    longestStreak: 'Mejor racha',
    noData: 'Sin datos aún',
    loading: 'Cargando...',
    error: 'Error al cargar métricas',
    refresh: 'Actualizar',
  },
  en: {
    title: 'Your Camino Metrics',
    subtitle: 'Daily · Weekly · Historical',
    daily: 'Today',
    weekly: 'This week',
    historical: 'All time',
    km: 'km',
    goal: 'Goal',
    avg: 'Avg',
    total: 'Total',
    days: 'days',
    bestDay: 'Best day',
    currentStreak: 'Current streak',
    longestStreak: 'Longest streak',
    noData: 'No data yet',
    loading: 'Loading...',
    error: 'Error loading metrics',
    refresh: 'Refresh',
  },
} as const;

interface CaminoMetricsProps {
  onRefresh?: () => void;
}

export function CaminoMetrics({ onRefresh }: CaminoMetricsProps) {
  const { locale } = useI18n();
  const isEs = locale !== 'en';
  const t = isEs ? COPY.es : COPY.en;

  const [metrics, setMetrics] = useState<MetricsData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<'daily' | 'weekly' | 'historical'>('daily');
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null);

  const fetchMetrics = async (forceRefresh = false) => {
    // Check cache first
    if (!forceRefresh) {
      const cached = getCached<{ data: MetricsData; timestamp: number }>(CACHE_KEY);
      if (cached && cached.timestamp + CACHE_TTL > Date.now()) {
        setMetrics(cached.data);
        setLastUpdated(new Date(cached.timestamp));
        setLoading(false);
        return;
      }
    }

    setLoading(true);
    setError(null);

    try {
      const res = await fetch('/api/camino/metrics', {
        headers: { 'X-Requested-With': 'XMLHttpRequest' },
      });

      if (!res.ok) throw new Error('Failed to fetch');

      const data = await res.json();

      if (data.success && data.data) {
        setMetrics(data.data);
        setLastUpdated(new Date());
        // Cache the data
        setCached(CACHE_KEY, { data: data.data, timestamp: Date.now() }, CACHE_TTL);
      } else {
        throw new Error(data.error || 'Failed to load metrics');
      }
    } catch (err) {
      setError(t.error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMetrics();
  }, []);

  const handleRefresh = () => {
    fetchMetrics(true);
    onRefresh?.();
  };

  const formatNumber = (num: number) => {
    if (num >= 1000) return (num / 1000).toFixed(1) + 'k';
    return num.toFixed(num % 1 === 0 ? 0 : 1);
  };

  if (loading && !metrics) {
    return (
      <div className="flex h-32 items-center justify-center gap-3">
        <CompassIcon className="h-8 w-8 animate-spin text-[#00AB39]" />
        <span className="font-handwritten text-[#1A1A1A]/70">{t.loading}</span>
      </div>
    );
  }

  if (error) {
    return (
      <div className="space-y-3 py-4 text-center">
        <p className="font-handwritten text-[#ED1C24]">{t.error}</p>
        <WiredButton type="button" onClick={handleRefresh} variant="secondary" size="sm">
          {t.refresh}
        </WiredButton>
      </div>
    );
  }

  if (!metrics) return null;

  const { daily, weekly, historical } = metrics;

  return (
    <div className="overflow-hidden">
      <div className="mb-3 flex gap-1">
        {(['daily', 'weekly', 'historical'] as const).map((tab) => (
          <button
            key={tab}
            type="button"
            onClick={() => setActiveTab(tab)}
            className={`flex-1 rounded-lg border-2 border-[#1A1A1A] px-2 py-2 text-center transition-colors ${
              activeTab === tab
                ? 'bg-[#00AB39] text-white shadow-[2px_2px_0_0_#1A1A1A]'
                : 'bg-white text-[#1A1A1A] hover:bg-[#E8F5E9]'
            }`}
            role="tab"
            aria-selected={activeTab === tab}
          >
            <span className="text-[10px] font-black uppercase tracking-wide">
              {tab === 'daily' ? t.daily : tab === 'weekly' ? t.weekly : t.historical}
            </span>
          </button>
        ))}
      </div>

      <AnimatePresence mode="wait">
        <motion.div
          key={activeTab}
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -8 }}
          transition={{ duration: 0.2 }}
        >
          {activeTab === 'daily' && <DailyMetricsView daily={daily} t={t} />}
          {activeTab === 'weekly' && (
            <WeeklyMetricsView weekly={weekly} t={t} formatNumber={formatNumber} locale={locale} />
          )}
          {activeTab === 'historical' && (
            <HistoricalMetricsView
              historical={historical}
              t={t}
              formatNumber={formatNumber}
              locale={locale}
            />
          )}
        </motion.div>
      </AnimatePresence>

      <div className="mt-3 flex items-center justify-between border-t-2 border-[#1A1A1A]/15 pt-2">
        <span className="text-[11px] font-handwritten text-[#1A1A1A]/50">
          {lastUpdated
            ? lastUpdated.toLocaleTimeString(locale !== 'en' ? 'es-ES' : 'en-GB', {
                hour: '2-digit',
                minute: '2-digit',
              })
            : ''}
        </span>
        <button
          type="button"
          onClick={handleRefresh}
          className="flex items-center gap-1.5 text-[11px] font-black text-[#00AB39]"
          aria-label={t.refresh}
        >
          <CompassIcon className="h-4 w-4" />
          {t.refresh}
        </button>
      </div>
    </div>
  );
}

function DailyMetricsView({ daily, t }: { daily: DailyMetrics; t: typeof COPY.es }) {
  const pct = Math.min(daily.percentage, 100);
  const ringRadius = 50;
  const circumference = 2 * Math.PI * ringRadius;
  const dashOffset = circumference * (1 - pct / 100);

  return (
    <div className="flex flex-col items-center gap-4">
      <div className="relative w-32 h-32">
        <svg width="128" height="128" viewBox="0 0 128 128" className="-rotate-90">
          <circle cx="64" cy="64" r={ringRadius} fill="none" stroke="#E8F5E9" strokeWidth="12" />
          <motion.circle
            cx="64"
            cy="64"
            r={ringRadius}
            fill="none"
            stroke="#00AB39"
            strokeWidth="12"
            strokeLinecap="round"
            strokeDasharray={circumference}
            initial={{ strokeDashoffset: circumference }}
            animate={{ strokeDashoffset: dashOffset }}
            transition={{ type: 'spring', stiffness: 100, damping: 15 }}
          />
        </svg>
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <span className="text-3xl font-bold text-[#5D4E37] font-sketch">{daily.km}</span>
          <span className="text-xs text-[#5D4E37]/50">
            / {daily.goal} {t.km}
          </span>
        </div>
      </div>

      <div className="w-full grid grid-cols-2 gap-3">
        <MetricCard
          icon={<MapPinIcon className="h-5 w-5" />}
          label={t.goal}
          value={`${daily.goal} ${t.km}`}
          color="#00AB39"
        />
        <MetricCard
          icon={<CompassIcon className="h-5 w-5" />}
          label={t.avg}
          value={`${daily.percentage.toFixed(0)}%`}
          color="#5D4E37"
        />
      </div>

      <div className="w-full mt-2 p-3 bg-[#F1F8E9]/50 rounded-xl">
        <p className="text-sm text-[#5D4E37]/70 font-handwritten text-center">
          {daily.km >= daily.goal
            ? '¡Meta alcanzada! 🎉 Sigue así.'
            : `Te faltan ${(daily.goal - daily.km).toFixed(1)} ${t.km} para tu meta diaria.`}
        </p>
      </div>
    </div>
  );
}

function WeeklyMetricsView({
  weekly,
  t,
  formatNumber,
  locale,
}: {
  weekly: WeeklyMetrics;
  t: typeof COPY.es;
  formatNumber: (n: number) => string;
  locale: string;
}) {
  return (
    <div className="space-y-4">
      <div className="grid grid-cols-3 gap-3">
        <MetricCard
          icon={<MapPinIcon className="h-5 w-5" />}
          label={t.total}
          value={`${formatNumber(weekly.totalKm)} ${t.km}`}
          color="#00AB39"
        />
        <MetricCard
          icon={<CalendarIcon className="h-5 w-5" />}
          label={t.days}
          value={weekly.days.toString()}
          color="#5D4E37"
        />
        <MetricCard
          icon={<TrendingUpIcon className="h-5 w-5" />}
          label={t.avg}
          value={`${weekly.averageDaily.toFixed(1)} ${t.km}`}
          color="#F59E0B"
        />
      </div>

      {weekly.logs.length > 0 && (
        <div className="space-y-2 max-h-64 overflow-y-auto">
          <h4 className="text-xs font-bold text-[#5D4E37]/60 uppercase tracking-wide">{t.days}:</h4>
          {weekly.logs
            .slice()
            .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
            .map((log) => (
              <div
                key={log.date}
                className="flex items-center justify-between py-2 px-3 bg-white/50 rounded-xl border border-[#00AB39]/10"
              >
                <span className="text-sm text-[#5D4E37] font-handwritten">
                  {new Date(log.date).toLocaleDateString(locale !== 'en' ? 'es-ES' : 'en-GB', {
                    weekday: 'short',
                    day: 'numeric',
                    month: 'short',
                  })}
                </span>
                <div className="flex items-center gap-2">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: Math.min((log.km / 25) * 100, 100) }}
                    className="h-2 w-24 bg-[#E8F5E9] rounded-full overflow-hidden"
                  >
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: Math.min((log.km / 25) * 100, 100) }}
                      className="h-full bg-[#00AB39] rounded-full transition-all duration-500"
                    />
                  </motion.div>
                  <span className="text-sm font-bold text-[#5D4E37] font-sketch w-12 text-right">
                    {log.km} {t.km}
                  </span>
                </div>
              </div>
            ))}
        </div>
      )}

      {weekly.logs.length === 0 && (
        <p className="text-center text-[#5D4E37]/50 font-handwritten py-8">{t.noData}</p>
      )}
    </div>
  );
}

function HistoricalMetricsView({
  historical,
  t,
  formatNumber,
  locale,
}: {
  historical: HistoricalMetrics;
  t: typeof COPY.es;
  formatNumber: (n: number) => string;
  locale: string;
}) {
  return (
    <div className="space-y-4">
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        <MetricCard
          icon={<MapPinIcon className="h-5 w-5" />}
          label={t.total}
          value={`${formatNumber(historical.totalKm)} ${t.km}`}
          color="#00AB39"
        />
        <MetricCard
          icon={<CalendarIcon className="h-5 w-5" />}
          label={t.days}
          value={historical.totalDays.toString()}
          color="#5D4E37"
        />
        <MetricCard
          icon={<TrendingUpIcon className="h-5 w-5" />}
          label={t.avg}
          value={`${historical.averageDaily.toFixed(1)} ${t.km}`}
          color="#F59E0B"
        />
        <MetricCard
          icon={<StarIcon className="h-5 w-5" />}
          label={t.bestDay}
          value={`${historical.bestDay.km} ${t.km}`}
          color="#EF4444"
        />
      </div>

      <div className="grid grid-cols-2 gap-3">
        <MetricCard
          icon={<CompassIcon className="h-5 w-5" />}
          label={t.currentStreak}
          value={`${historical.streaks.current} ${t.days}`}
          color="#8B5CF6"
        />
        <MetricCard
          icon={<StarIcon className="h-5 w-5" />}
          label={t.longestStreak}
          value={`${historical.streaks.longest} ${t.days}`}
          color="#EC4899"
        />
      </div>

      {historical.logs.length > 0 && (
        <div className="space-y-2 max-h-64 overflow-y-auto">
          <h4 className="text-xs font-bold text-[#5D4E37]/60 uppercase tracking-wide">
            Últimos registros:
          </h4>
          {historical.logs
            .slice()
            .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
            .slice(0, 10)
            .map((log) => (
              <div
                key={log.date}
                className="flex items-center justify-between py-2 px-3 bg-white/50 rounded-xl border border-[#00AB39]/10"
              >
                <span className="text-sm text-[#5D4E37] font-handwritten">
                  {new Date(log.date).toLocaleDateString(locale !== 'en' ? 'es-ES' : 'en-GB', {
                    weekday: 'short',
                    day: 'numeric',
                    month: 'short',
                  })}
                </span>
                <span className="text-sm font-bold text-[#5D4E37] font-sketch">
                  {log.km} {t.km}
                </span>
              </div>
            ))}
        </div>
      )}

      {historical.logs.length === 0 && (
        <p className="text-center text-[#5D4E37]/50 font-handwritten py-8">{t.noData}</p>
      )}
    </div>
  );
}

function MetricCard({
  icon,
  label,
  value,
  color,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
  color: string;
}) {
  return (
    <div className="bg-white/50 rounded-xl border border-[#00AB39]/10 p-3 text-center">
      <div className="flex justify-center mb-1" style={{ color }}>
        {icon}
      </div>
      <div className="text-lg font-bold text-[#5D4E37] font-sketch">{value}</div>
      <div className="text-[10px] text-[#5D4E37]/50 uppercase tracking-wide">{label}</div>
    </div>
  );
}
