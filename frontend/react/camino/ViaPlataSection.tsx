import { useEffect, useState } from 'react';
import { useI18n } from '../hooks/useI18n';
import { PageHero } from '../shared/PageHero';
import { SectionDecor } from '../shared/SectionDecor';
import { FancyCard } from '../shared/FancyCard';
import { MapLibreMap, type MapLibreMarkerData } from '../shared/MapLibreMap';
import { WiredButton } from '../doodle/WiredButton';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '../ui/dialog';
import {
  CompassIcon,
  MapPinIcon,
  ClockIcon,
  BedIcon,
  StarIcon,
  ExternalLinkIcon,
} from '../doodle/DoodleIcons';
import {
  VIA_PLATA_STAGES,
  VIA_PLATA_ROUTE_STATS,
  EL_CARRASCALEJO_COORDS,
  EXTERNAL_RESOURCES,
  APP_LINKS,
  type ViaPlataStage,
} from './viaPlataData';

const SEMTAYR_BASE = 'https://www.semtayr.es/en/';

const COPY = {
  es: {
    eyebrow: 'Vía de la Plata',
    title: 'La ruta que pasa por nuestra puerta',
    subtitle:
      'Desde Sevilla hasta Granja de Moreruela, 24 etapas del Camino de Santiago más antiguo de la Península -- y la etapa 11 pasa directamente por El Carrascalejo.',
    statStages: 'etapas',
    statKm: 'km',
    statVillages: 'localidades',
    mapTitle: 'Mapa de etapas',
    mapHint: 'Toca un punto del mapa o una etapa para ver el detalle.',
    stagesTitle: 'Las 24 etapas',
    ourStage: 'Nuestra etapa',
    stage: 'Etapa',
    km: 'km',
    villages: 'localidades',
    hosting: 'alojamientos',
    fullGuide: 'Ver guía completa en semtayr.es',
    resourcesTitle: 'Más información y recursos',
    appTitle: 'Lleva la ruta en el móvil',
    appSubtitle:
      'La app oficial de la Ruta Vía de la Plata, con mapas offline y las etapas siempre a mano.',
    appAndroid: 'Descargar para Android',
    appIos: 'Descargar para iPhone',
  },
  en: {
    eyebrow: 'Vía de la Plata',
    title: 'The route that passes by our door',
    subtitle:
      'From Sevilla to Granja de Moreruela, 24 stages of the oldest Camino de Santiago on the Peninsula -- and stage 11 passes directly through El Carrascalejo.',
    statStages: 'stages',
    statKm: 'km',
    statVillages: 'villages',
    mapTitle: 'Stage map',
    mapHint: 'Tap a map point or a stage card to see the detail.',
    stagesTitle: 'The 24 stages',
    ourStage: 'Our stage',
    stage: 'Stage',
    km: 'km',
    villages: 'villages',
    hosting: 'lodging options',
    fullGuide: 'View full guide on semtayr.es',
    resourcesTitle: 'More information and resources',
    appTitle: 'Take the route on your phone',
    appSubtitle:
      'The official Vía de la Plata route app, with offline maps and every stage on hand.',
    appAndroid: 'Download for Android',
    appIos: 'Download for iPhone',
  },
} as const;

function useDetectedOS(): 'ios' | 'android' | 'other' {
  const [os, setOs] = useState<'ios' | 'android' | 'other'>('other');
  useEffect(() => {
    const ua = typeof navigator !== 'undefined' ? navigator.userAgent : '';
    if (/iPhone|iPad|iPod/i.test(ua)) setOs('ios');
    else if (/Android/i.test(ua)) setOs('android');
  }, []);
  return os;
}

/** Downloads the route app -- shows only the matching store badge on a
 * detected phone, both badges otherwise (desktop, or an OS we can't tell
 * apart), since we can't know which platform a desktop visitor carries. */
function AppDownloadCard() {
  const { locale } = useI18n();
  const isEs = locale !== 'en';
  const t = isEs ? COPY.es : COPY.en;
  const os = useDetectedOS();

  return (
    <div className="rounded-xl border-2 border-[#00AB39]/40 bg-linear-to-br from-[#E8F5E9] to-[#FFFFFF] p-4 doodle-shadow paper-texture">
      <div className="flex flex-col items-center gap-3 text-center sm:flex-row sm:text-left">
        <div className="shrink-0 text-[#00AB39]">
          <CompassIcon className="h-8 w-8" />
        </div>
        <div className="flex-1">
          <h3 className="text-sm font-bold text-[#5D4E37] font-sketch">{t.appTitle}</h3>
          <p className="text-xs text-[#5D4E37]/80 font-handwritten">{t.appSubtitle}</p>
        </div>
        <div className="flex shrink-0 flex-col gap-2 sm:flex-row">
          {os !== 'android' && (
            <WiredButton href={APP_LINKS.ios} variant="primary" size="sm">
              {t.appIos}
            </WiredButton>
          )}
          {os !== 'ios' && (
            <WiredButton href={APP_LINKS.android} variant="outline" size="sm">
              {t.appAndroid}
            </WiredButton>
          )}
        </div>
      </div>
    </div>
  );
}

function StageDetailModal({
  stage,
  open,
  onOpenChange,
  t,
}: Readonly<{
  stage: ViaPlataStage | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  t: (typeof COPY)['es'];
}>) {
  if (!stage) return null;
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-h-[85vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="font-sketch">
            {t.stage} {stage.stage}: {stage.from} → {stage.to}
            {stage.passesCarrascalejo && (
              <span className="ml-2 inline-flex items-center gap-1 rounded-full bg-[#EAC102]/20 px-2 py-0.5 text-xs font-semibold text-[#8B6914]">
                <StarIcon className="h-3 w-3" /> {t.ourStage}
              </span>
            )}
          </DialogTitle>
          {stage.summary && (
            <DialogDescription className="font-handwritten text-[#5D4E37]/90">
              {stage.summary}
            </DialogDescription>
          )}
        </DialogHeader>

        <div className="grid grid-cols-3 gap-3 text-center">
          <div className="rounded-lg bg-[#E8F5E9] p-3">
            <MapPinIcon className="mx-auto mb-1 h-5 w-5 text-[#00AB39]" />
            <div className="text-lg font-bold text-[#5D4E37]">{stage.km}</div>
            <div className="text-xs text-[#5D4E37]/70">{t.km}</div>
          </div>
          <div className="rounded-lg bg-[#E8F5E9] p-3">
            <ClockIcon className="mx-auto mb-1 h-5 w-5 text-[#00AB39]" />
            <div className="text-lg font-bold text-[#5D4E37]">{stage.villages}</div>
            <div className="text-xs text-[#5D4E37]/70">{t.villages}</div>
          </div>
          <div className="rounded-lg bg-[#E8F5E9] p-3">
            <BedIcon className="mx-auto mb-1 h-5 w-5 text-[#00AB39]" />
            <div className="text-lg font-bold text-[#5D4E37]">{stage.hosting}</div>
            <div className="text-xs text-[#5D4E37]/70">{t.hosting}</div>
          </div>
        </div>

        <a
          href={`${SEMTAYR_BASE}${stage.slug}`}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center justify-center gap-2 text-sm font-semibold text-[#00AB39] hover:underline"
        >
          {t.fullGuide} <ExternalLinkIcon className="h-4 w-4" />
        </a>
      </DialogContent>
    </Dialog>
  );
}

export function ViaPlataSection() {
  const { locale } = useI18n();
  const isEs = locale !== 'en';
  const t = isEs ? COPY.es : COPY.en;

  const [selectedStage, setSelectedStage] = useState<ViaPlataStage | null>(null);
  const [modalOpen, setModalOpen] = useState(false);

  const mainStages = VIA_PLATA_STAGES.filter((s) => !s.isVariant);

  function openStage(stage: ViaPlataStage) {
    setSelectedStage(stage);
    setModalOpen(true);
  }

  const markers: MapLibreMarkerData[] = [
    ...mainStages.map((stage) => ({
      id: stage.slug,
      coords: stage.toCoords,
      label: `${t.stage} ${stage.stage}: ${stage.to}`,
      onClick: () => openStage(stage),
      active: !!stage.passesCarrascalejo,
    })),
    {
      id: 'el-carrascalejo',
      coords: EL_CARRASCALEJO_COORDS,
      label: 'El Carrascalejo',
      active: true,
      onClick: () => {
        const stage11 = mainStages.find((s) => s.passesCarrascalejo);
        if (stage11) openStage(stage11);
      },
    },
  ];

  return (
    <section className="relative isolate py-8 bg-white">
      <SectionDecor preset="distance" />
      <div className="container mx-auto max-w-6xl px-4">
        <PageHero eyebrow={t.eyebrow} title={t.title} subtitle={t.subtitle} />

        <div className="mb-4 grid grid-cols-3 gap-4 text-center">
          <div>
            <div className="text-2xl font-bold text-[#00AB39] font-sketch">
              {VIA_PLATA_ROUTE_STATS.stages}
            </div>
            <div className="text-xs text-[#5D4E37]/70">{t.statStages}</div>
          </div>
          <div>
            <div className="text-2xl font-bold text-[#00AB39] font-sketch">
              {VIA_PLATA_ROUTE_STATS.distanceKm}
            </div>
            <div className="text-xs text-[#5D4E37]/70">{t.statKm}</div>
          </div>
          <div>
            <div className="text-2xl font-bold text-[#00AB39] font-sketch">
              {VIA_PLATA_ROUTE_STATS.villages}
            </div>
            <div className="text-xs text-[#5D4E37]/70">{t.statVillages}</div>
          </div>
        </div>

        <h3 className="mb-1 text-base font-bold text-[#5D4E37] font-sketch">{t.mapTitle}</h3>
        <p className="mb-2 text-xs text-[#5D4E37]/70 font-handwritten">{t.mapHint}</p>
        <MapLibreMap center={[-6.15, 39.3]} zoom={7} markers={markers} className="mb-6 h-64" />

        <h3 className="mb-2 text-base font-bold text-[#5D4E37] font-sketch">{t.stagesTitle}</h3>
        <div className="mb-6 grid grid-cols-1 gap-1.5 sm:grid-cols-2 lg:grid-cols-3">
          {mainStages.map((stage) => (
            <button
              key={stage.slug}
              type="button"
              onClick={() => openStage(stage)}
              className={`flex items-center gap-2 rounded-lg border px-3 py-2 text-left transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#00AB39] ${
                stage.passesCarrascalejo
                  ? 'border-[#00AB39] bg-[#E8F5E9]'
                  : 'border-[#5D4E37]/20 bg-[#FFFFFF] hover:border-[#00AB39]/50 hover:bg-[#E8F5E9]/60'
              }`}
            >
              <span className="flex h-6 w-6 shrink-0 items-center justify-center text-[#00AB39]">
                {stage.passesCarrascalejo ? (
                  <StarIcon className="h-4 w-4" />
                ) : (
                  <span className="text-xs font-bold">{stage.stage}</span>
                )}
              </span>
              <span className="min-w-0 flex-1 truncate text-sm font-semibold text-[#5D4E37]">
                {stage.from} → {stage.to}
              </span>
              <span className="shrink-0 text-xs text-[#5D4E37]/60">
                {stage.km} {t.km}
              </span>
            </button>
          ))}
        </div>

        <AppDownloadCard />

        <h3 className="mt-6 mb-2 text-base font-bold text-[#5D4E37] font-sketch">
          {t.resourcesTitle}
        </h3>
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
          {EXTERNAL_RESOURCES.map((resource) => (
            <FancyCard
              key={resource.url}
              title={resource.title}
              description={resource.description}
              icon={<ExternalLinkIcon className="h-6 w-6" />}
              cta={{ label: resource.domain, href: resource.url }}
              className="text-sm"
            />
          ))}
        </div>

        <StageDetailModal
          stage={selectedStage}
          open={modalOpen}
          onOpenChange={setModalOpen}
          t={t}
        />
      </div>
    </section>
  );
}
