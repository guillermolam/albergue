import { SunIcon, CloudIcon, PartlyCloudyIcon, RainIcon } from '../doodle/DoodleIcons';
import { usePrefersReducedMotion } from '../hooks/usePrefersReducedMotion';
import { useI18n } from '../hooks/useI18n';
import type { WeatherForecast, AirQuality } from '../../src/lib/hostelTypes';

interface WeatherWidgetProps {
  forecast: WeatherForecast | null;
  airQuality: AirQuality | null;
}

const AQI_LABELS: Record<AirQuality['aqi'], { es: string; en: string; color: string }> = {
  1: { es: 'Buena', en: 'Good', color: '#00AB39' },
  2: { es: 'Aceptable', en: 'Fair', color: '#33C161' },
  3: { es: 'Moderada', en: 'Moderate', color: '#EAC102' },
  4: { es: 'Mala', en: 'Poor', color: '#D4A574' },
  5: { es: 'Muy mala', en: 'Very Poor', color: '#ED1C24' },
};

/** AEMET's own "estadoCielo" code table has dozens of numeric codes (cloud
 * amount x precipitation type x day/night). For a small subtle badge we
 * don't need pixel-perfect meteorological iconography -- pick a broad sky
 * category from the code's leading digit, then let the already-normalized
 * `precipProbability` (not the code itself) decide whether to show rain,
 * since that's the more reliable signal for "will it actually rain". */
function pickWeatherIcon(skyCode: string, precipProbability: number) {
  if (precipProbability >= 40) return RainIcon;
  if (skyCode.startsWith('1')) return SunIcon;
  if (skyCode.startsWith('2') || skyCode.startsWith('3')) return PartlyCloudyIcon;
  return CloudIcon;
}

/** AEMET's `fecha` is a date without a UTC offset ("YYYY-MM-DD" or
 * "YYYY-MM-DDTHH:mm:ss"). `new Date(dateStr)` parses a bare date-only
 * string as UTC midnight, which renders as the PREVIOUS calendar day
 * in any timezone west of UTC -- Spain itself included, for part of
 * the year. Parsing the y/m/d components explicitly and building the
 * Date via the multi-arg constructor (always local time) avoids that. */
function formatWeekday(dateStr: string, locale: string): string {
  const [datePart] = dateStr.split('T');
  const [year, month, day] = datePart.split('-').map(Number);
  if (!year || !month || !day) return dateStr;
  const date = new Date(year, month - 1, day);
  if (Number.isNaN(date.getTime())) return dateStr;
  return date.toLocaleDateString(locale === 'en' ? 'en-US' : 'es-ES', { weekday: 'short' });
}

export function WeatherWidget({ forecast, airQuality }: Readonly<WeatherWidgetProps>) {
  const { locale } = useI18n();
  const isEs = locale !== 'en';
  const animateIcon = !usePrefersReducedMotion();
  const hasForecast = forecast && forecast.length > 0;

  // AEMET and OpenWeatherMap are configured independently -- one being
  // unavailable must never hide the other (previously an early return
  // on missing `forecast` discarded a perfectly valid `airQuality`).
  return (
    <div className="rounded-lg border border-[#5D4E37]/20 bg-white/60 px-3 py-2">
      {hasForecast ? (
        <div className="flex items-center justify-between gap-3">
          {forecast.map((day) => {
            const Icon = pickWeatherIcon(day.skyCode, day.precipProbability);
            return (
              <div key={day.date} className="flex flex-col items-center gap-0.5">
                <span className="text-[10px] uppercase text-[#5D4E37]/60">
                  {formatWeekday(day.date, locale)}
                </span>
                <Icon className="h-6 w-6 shrink-0" animate={animateIcon} aria-hidden="true" />
                <span className="text-xs font-semibold text-[#5D4E37]">
                  {Math.round(day.tempMax)}°/{Math.round(day.tempMin)}°
                </span>
              </div>
            );
          })}
        </div>
      ) : (
        <div className="flex items-center gap-2 text-xs text-[#5D4E37]/60">
          <CloudIcon className="h-5 w-5 shrink-0" animate={false} aria-hidden="true" />
          <span className="font-handwritten">
            {isEs ? 'Previsión próximamente' : 'Forecast coming soon'}
          </span>
        </div>
      )}

      {airQuality && (
        <div
          className={`flex items-center justify-center gap-1.5 text-[10px] text-[#5D4E37]/70 ${
            hasForecast ? 'mt-1.5 border-t border-[#5D4E37]/10 pt-1.5' : 'mt-1.5'
          }`}
        >
          <span
            className="h-1.5 w-1.5 shrink-0 rounded-full"
            style={{ backgroundColor: AQI_LABELS[airQuality.aqi].color }}
            aria-hidden="true"
          />
          <span>
            {isEs ? 'Calidad del aire' : 'Air quality'}:{' '}
            {isEs ? AQI_LABELS[airQuality.aqi].es : AQI_LABELS[airQuality.aqi].en}
          </span>
        </div>
      )}
    </div>
  );
}
