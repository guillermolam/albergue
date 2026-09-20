import { useEffect, useRef, useState } from 'react';
import { useI18n } from '../hooks/useI18n';
import { CompassIcon, LoaderIcon } from '../doodle/DoodleIcons';
import { getSmplrConfig } from './config';
import { SmplrEngine } from './smplr/SmplrEngine';
import { BUILDING_LABELS } from './domain/labels';
import type { BuildingCode } from './domain/types';
import type { SpatialEngineHandle } from './SpatialEngine';

const engine = new SmplrEngine();

const COPY = {
  es: {
    notConfigured: 'Plano interactivo próximamente',
    notConfiguredHint:
      'Estamos preparando el plano 3D real de este edificio. Vuelve pronto para explorarlo.',
    loading: 'Cargando plano interactivo...',
    error: 'No se pudo cargar el plano interactivo.',
  },
  en: {
    notConfigured: 'Interactive floor plan coming soon',
    notConfiguredHint:
      "We're preparing this building's real 3D floor plan. Check back soon to explore it.",
    loading: 'Loading interactive floor plan...',
    error: 'Could not load the interactive floor plan.',
  },
} as const;

interface SpaceViewerProps {
  building: BuildingCode;
  className?: string;
}

export function SpaceViewer({ building, className = '' }: Readonly<SpaceViewerProps>) {
  const { locale } = useI18n();
  const isEs = locale !== 'en';
  const t = isEs ? COPY.es : COPY.en;
  const label = isEs ? BUILDING_LABELS[building].es : BUILDING_LABELS[building].en;

  const containerRef = useRef<HTMLDivElement>(null);
  const [handle, setHandle] = useState<SpatialEngineHandle | null>(null);

  const config = getSmplrConfig(building);

  useEffect(() => {
    if (!config || !containerRef.current) return;
    let cancelled = false;
    let mountedHandle: SpatialEngineHandle | null = null;

    // Clear any handle from a previous building before mounting the new
    // one, otherwise a stale "ready"/"error" handle stays truthy while
    // this mount is pending, hiding the loading overlay for the new
    // container and showing the old building's lifecycle state.
    setHandle(null);

    engine.mount(containerRef.current, config).then((result) => {
      if (cancelled) {
        result.destroy();
        return;
      }
      mountedHandle = result;
      setHandle(result);
    });

    return () => {
      cancelled = true;
      mountedHandle?.destroy();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [building]);

  if (!config) {
    return (
      <div
        className={`flex flex-col items-center justify-center gap-3 rounded-xl border-2 border-dashed border-[#5D4E37]/25 bg-[#FFFFFF] p-10 text-center paper-texture ${className}`}
      >
        <CompassIcon className="h-10 w-10 text-[#00AB39]/60" />
        <h3 className="text-base font-bold text-[#5D4E37] font-sketch">{t.notConfigured}</h3>
        <p className="max-w-sm text-sm text-[#5D4E37]/70 font-handwritten">{t.notConfiguredHint}</p>
        <p className="text-xs text-[#5D4E37]/40">{label}</p>
      </div>
    );
  }

  return (
    <div
      className={`relative overflow-hidden rounded-xl border-2 border-[#5D4E37]/20 ${className}`}
    >
      <div ref={containerRef} className="h-[420px] w-full bg-[#FFFFFF]" />
      {!handle && (
        <div className="absolute inset-0 flex flex-col items-center justify-center gap-2 bg-[#FFFFFF]">
          <LoaderIcon className="h-8 w-8 animate-spin text-[#00AB39]" />
          <p className="text-sm text-[#5D4E37]/70">{t.loading}</p>
        </div>
      )}
      {handle?.status === 'error' && (
        <div className="absolute inset-0 flex flex-col items-center justify-center gap-2 bg-[#FFFFFF] p-6 text-center">
          <p className="text-sm font-semibold text-red-600">{t.error}</p>
          {handle.error && <p className="text-xs text-[#5D4E37]/50">{handle.error}</p>}
        </div>
      )}
    </div>
  );
}
