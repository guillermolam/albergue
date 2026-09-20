import { useEffect, useRef } from 'react';
import { Map as MaplibreMapInstance, Marker, NavigationControl } from 'maplibre-gl';
import 'maplibre-gl/dist/maplibre-gl.css';

const TILE_STYLE = 'https://tiles.openfreemap.org/styles/liberty';

export interface MapLibreMarkerData {
  id: string;
  coords: [number, number];
  label: string;
  onClick?: () => void;
  active?: boolean;
}

interface MapLibreMapProps {
  center: [number, number];
  zoom?: number;
  markers: MapLibreMarkerData[];
  className?: string;
}

function createMarkerElement(label: string, active?: boolean): HTMLDivElement {
  const el = document.createElement('div');
  // A pin the user can click, not a static picture -- "button" describes it
  // more accurately than "img" ever would.
  el.setAttribute('role', 'button');
  el.setAttribute('aria-label', label);
  el.style.cursor = 'pointer';
  el.innerHTML = `
    <svg width="32" height="40" viewBox="0 0 32 40" style="filter: drop-shadow(1px 2px 2px rgba(0,0,0,0.3))">
      <path
        d="M16 2C8.8 2 3 7.8 3 15c0 9.5 13 21.5 13 21.5S29 24.5 29 15c0-7.2-5.8-13-13-13z"
        fill="${active ? '#EAC102' : '#00AB39'}"
        stroke="#5D4E37"
        stroke-width="2"
      />
      <circle cx="16" cy="15" r="5" fill="#FFF9F0" />
    </svg>
  `;
  return el;
}

/** client:only="react" -- genuine browser-only WebGL library, same rationale
 * as HostelScene.tsx for Three.js this session: SSR would crash on import. */
export function MapLibreMap({
  center,
  zoom = 14,
  markers,
  className = '',
}: Readonly<MapLibreMapProps>) {
  const containerRef = useRef<HTMLDivElement>(null);
  const mapRef = useRef<MaplibreMapInstance | null>(null);
  const markersRef = useRef<Marker[]>([]);

  useEffect(() => {
    if (!containerRef.current) return;

    const map = new MaplibreMapInstance({
      container: containerRef.current,
      style: TILE_STYLE,
      center,
      zoom,
    });
    map.addControl(new NavigationControl({ showCompass: false }), 'top-right');
    mapRef.current = map;

    return () => {
      map.remove();
      mapRef.current = null;
    };
  }, [center, zoom]);

  useEffect(() => {
    const map = mapRef.current;
    if (!map) return;

    markersRef.current.forEach((marker) => marker.remove());
    markersRef.current = markers.map((markerData) => {
      const el = createMarkerElement(markerData.label, markerData.active);
      if (markerData.onClick) {
        el.addEventListener('click', markerData.onClick);
      }
      return new Marker({ element: el }).setLngLat(markerData.coords).addTo(map);
    });

    return () => {
      markersRef.current.forEach((marker) => marker.remove());
      markersRef.current = [];
    };
  }, [markers]);

  return (
    <div
      ref={containerRef}
      className={`h-80 w-full overflow-hidden rounded-xl border-2 border-[#5D4E37]/30 doodle-shadow ${className}`}
      role="region"
      aria-label="Mapa interactivo"
    />
  );
}
