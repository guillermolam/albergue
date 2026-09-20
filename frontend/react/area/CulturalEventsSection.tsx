import { useMemo, useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { useI18n } from '../hooks/useI18n';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '../ui/dialog';
import { ExternalLinkIcon, MapPinIcon } from '../doodle/DoodleIcons';
import { SectionDecor } from '../shared/SectionDecor';

export interface CulturalEvent {
  id: number;
  title: string;
  url: string;
  imageUrl: string | null;
  startDate: string;
  endDate: string;
  allDay: boolean;
  cost: string | null;
  venueName: string | null;
  venueAddress: string | null;
  categories: string[];
}

const DAYS_AHEAD = 14;

const COPY = {
  es: {
    eyebrow: 'Agenda Cultural',
    title: 'Qué hacer estos días en Mérida',
    subtitle: 'Teatro, música y actividades culturales, a un paseo de El Carrascalejo.',
    source: 'Datos: Ayuntamiento de Mérida',
    empty: 'No hay eventos programados para este día.',
    emptyAll: 'La agenda de Mérida no está disponible ahora mismo.',
    free: 'Gratuito',
    viewDetails: 'Ver en la agenda de Mérida',
    allDays: 'Todos',
    weekdays: ['dom', 'lun', 'mar', 'mié', 'jue', 'vie', 'sáb'],
    months: ['ene', 'feb', 'mar', 'abr', 'may', 'jun', 'jul', 'ago', 'sep', 'oct', 'nov', 'dic'],
  },
  en: {
    eyebrow: 'Cultural Agenda',
    title: "What's on in Mérida these days",
    subtitle: 'Theatre, music, and cultural activities, a short trip from El Carrascalejo.',
    source: 'Data: Ayuntamiento de Mérida',
    empty: 'No events scheduled for this day.',
    emptyAll: "Mérida's agenda isn't available right now.",
    free: 'Free',
    viewDetails: "View on Mérida's agenda",
    allDays: 'All',
    weekdays: ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'],
    months: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
  },
} as const;

function dateKey(d: Date): string {
  return d.toISOString().split('T')[0];
}

function eventDateKey(event: CulturalEvent): string {
  return event.startDate.split(' ')[0];
}

interface EventDetailModalProps {
  event: CulturalEvent | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  t: (typeof COPY)['es'];
}

function EventDetailModal({ event, open, onOpenChange, t }: Readonly<EventDetailModalProps>) {
  if (!event) return null;
  const start = new Date(event.startDate.replace(' ', 'T'));

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-h-[85vh] overflow-y-auto p-0">
        {event.imageUrl && (
          <img
            src={event.imageUrl}
            alt=""
            className="h-48 w-full rounded-t-lg object-cover"
            loading="lazy"
          />
        )}
        <div className="p-6">
          <DialogHeader>
            <DialogTitle className="font-sketch">{event.title}</DialogTitle>
          </DialogHeader>

          <div className="mt-3 flex flex-wrap gap-2">
            <span className="rounded-full bg-[#E8F5E9] px-3 py-1 text-xs font-semibold text-[#00AB39]">
              {t.months[start.getMonth()]} {start.getDate()} ·{' '}
              {start.toLocaleTimeString(undefined, { hour: '2-digit', minute: '2-digit' })}
            </span>
            <span className="rounded-full bg-[#FFF3E0] px-3 py-1 text-xs font-semibold text-[#8B6914]">
              {event.cost && event.cost.trim() ? `${event.cost}€` : t.free}
            </span>
            {event.categories.map((cat) => (
              <span
                key={cat}
                className="rounded-full bg-[#5D4E37]/10 px-3 py-1 text-xs font-semibold text-[#5D4E37]"
              >
                {cat}
              </span>
            ))}
          </div>

          {event.venueName && (
            <div className="mt-4 flex items-start gap-2 text-sm text-[#5D4E37]/80">
              <MapPinIcon className="mt-0.5 h-4 w-4 shrink-0 text-[#00AB39]" />
              <div>
                <div className="font-semibold text-[#5D4E37]">{event.venueName}</div>
                {event.venueAddress && <div className="text-xs">{event.venueAddress}</div>}
              </div>
            </div>
          )}

          <a
            href={event.url}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-5 flex items-center justify-center gap-2 rounded-lg border-2 border-[#00AB39] py-2 text-sm font-semibold text-[#00AB39] hover:bg-[#E8F5E9]"
          >
            {t.viewDetails} <ExternalLinkIcon className="h-4 w-4" />
          </a>
        </div>
      </DialogContent>
    </Dialog>
  );
}

export function CulturalEventsSection({ events }: Readonly<{ events: CulturalEvent[] }>) {
  const { locale } = useI18n();
  const isEs = locale !== 'en';
  const t = isEs ? COPY.es : COPY.en;

  const [selectedDay, setSelectedDay] = useState<string | null>(null);
  const [selectedEvent, setSelectedEvent] = useState<CulturalEvent | null>(null);
  const [modalOpen, setModalOpen] = useState(false);

  const days = useMemo(() => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const eventDates = new Set(events.map(eventDateKey));
    return Array.from({ length: DAYS_AHEAD }, (_, i) => {
      const d = new Date(today);
      d.setDate(d.getDate() + i);
      const key = dateKey(d);
      return { key, date: d, hasEvents: eventDates.has(key) };
    });
  }, [events]);

  const filteredEvents = useMemo(() => {
    const list = selectedDay ? events.filter((e) => eventDateKey(e) === selectedDay) : events;
    return [...list].sort((a, b) => a.startDate.localeCompare(b.startDate));
  }, [events, selectedDay]);

  function openEvent(event: CulturalEvent) {
    setSelectedEvent(event);
    setModalOpen(true);
  }

  return (
    <section className="relative isolate py-10 bg-[#FFFFFF]">
      <SectionDecor preset="journey" delayOffset={1.0} />
      <div className="container mx-auto max-w-6xl px-4">
        <div className="mb-5 flex items-start gap-3">
          <img src="/png/interface/calendar.png" alt="" className="h-9 w-9 shrink-0" />
          <div>
            <p className="text-xs font-bold uppercase tracking-wide text-[#00AB39]">{t.eyebrow}</p>
            <h2 className="text-2xl font-bold text-[#5D4E37] font-sketch">{t.title}</h2>
            <p className="text-sm text-[#5D4E37]/70 font-handwritten">{t.subtitle}</p>
          </div>
        </div>

        {/* Day strip */}
        <div className="mb-5 flex gap-2 overflow-x-auto pb-2">
          <button
            type="button"
            onClick={() => setSelectedDay(null)}
            className={`shrink-0 rounded-xl border-2 px-4 py-2 text-sm font-semibold transition-colors ${
              selectedDay === null
                ? 'border-[#00AB39] bg-[#00AB39] text-white'
                : 'border-[#5D4E37]/20 bg-white text-[#5D4E37] hover:border-[#00AB39]/50'
            }`}
          >
            {t.allDays}
          </button>
          {days.map(({ key, date, hasEvents }) => (
            <button
              key={key}
              type="button"
              onClick={() => setSelectedDay(key)}
              className={`relative flex shrink-0 flex-col items-center rounded-xl border-2 px-3 py-2 transition-colors ${
                selectedDay === key
                  ? 'border-[#00AB39] bg-[#00AB39] text-white'
                  : 'border-[#5D4E37]/20 bg-white text-[#5D4E37] hover:border-[#00AB39]/50'
              }`}
            >
              <span className="text-[10px] uppercase opacity-70">{t.weekdays[date.getDay()]}</span>
              <span className="text-lg font-bold font-sketch">{date.getDate()}</span>
              {hasEvents && (
                <span
                  className={`absolute bottom-1 h-1.5 w-1.5 rounded-full ${selectedDay === key ? 'bg-white' : 'bg-[#00AB39]'}`}
                />
              )}
            </button>
          ))}
        </div>

        {/* Event cards */}
        {filteredEvents.length === 0 ? (
          <p className="rounded-xl border-2 border-dashed border-[#5D4E37]/20 p-8 text-center text-sm text-[#5D4E37]/60">
            {events.length === 0 ? t.emptyAll : t.empty}
          </p>
        ) : (
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {filteredEvents.map((event, i) => {
              const start = new Date(event.startDate.replace(' ', 'T'));
              return (
                <motion.button
                  key={event.id}
                  type="button"
                  onClick={() => openEvent(event)}
                  initial={{ opacity: 0, y: 12 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: '-40px' }}
                  transition={{ duration: 0.3, delay: (i % 6) * 0.05 }}
                  whileHover={{ y: -3 }}
                  className="flex flex-col overflow-hidden rounded-xl border-2 border-[#5D4E37]/20 bg-white text-left doodle-shadow paper-texture focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#00AB39]"
                >
                  {event.imageUrl ? (
                    <img
                      src={event.imageUrl}
                      alt=""
                      className="h-32 w-full object-cover"
                      loading="lazy"
                    />
                  ) : (
                    <div className="flex h-32 w-full items-center justify-center bg-[#E8F5E9]">
                      <img
                        src="/png/interface/calendar.png"
                        alt=""
                        className="h-10 w-10 opacity-50"
                      />
                    </div>
                  )}
                  <div className="flex flex-1 flex-col p-4">
                    <div className="mb-2 flex items-center gap-2 text-xs font-bold text-[#00AB39]">
                      <span className="rounded-full bg-[#E8F5E9] px-2 py-0.5">
                        {t.months[start.getMonth()]} {start.getDate()}
                      </span>
                      <span className="text-[#5D4E37]/50">
                        {start.toLocaleTimeString(undefined, {
                          hour: '2-digit',
                          minute: '2-digit',
                        })}
                      </span>
                    </div>
                    <h3 className="mb-1 text-sm font-bold text-[#5D4E37] font-sketch">
                      {event.title}
                    </h3>
                    {event.venueName && (
                      <p className="mt-auto flex items-center gap-1 pt-2 text-xs text-[#5D4E37]/60">
                        <MapPinIcon className="h-3.5 w-3.5 shrink-0" /> {event.venueName}
                      </p>
                    )}
                  </div>
                </motion.button>
              );
            })}
          </div>
        )}

        <p className="mt-4 text-xs text-[#5D4E37]/50">{t.source}</p>

        <AnimatePresence>
          {modalOpen && (
            <EventDetailModal
              event={selectedEvent}
              open={modalOpen}
              onOpenChange={setModalOpen}
              t={t}
            />
          )}
        </AnimatePresence>
      </div>
    </section>
  );
}
