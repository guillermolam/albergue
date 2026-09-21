import { useEffect, useRef } from 'react';
import { Map as MaplibreMapInstance, Marker, NavigationControl } from 'maplibre-gl';
import 'maplibre-gl/dist/maplibre-gl.css';

/**
 * Raster basemap (Carto Voyager / OSM). OpenFreeMap vector liberty styles
 * load their JSON but never request .pbf tiles under Vite/React remounts
 * (blank canvas + pin only). Raster tiles paint reliably everywhere.
 */
const TILE_STYLE = {
  version: 8 as const,
  sources: {
    carto: {
      type: 'raster' as const,
      tiles: [
        'https://a.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}.png',
        'https://b.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}.png',
        'https://c.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}.png',
      ],
      tileSize: 256,
      attribution: '© OpenStreetMap © CARTO',
    },
  },
  layers: [{ id: 'carto', type: 'raster' as const, source: 'carto' }],
};

export interface MapLibreMarkerData {
  id: string;
  /** [longitude, latitude] — MapLibre / GeoJSON order. */
  coords: [number, number];
  label: string;
  onClick?: () => void;
  active?: boolean;
}

interface MapLibreMapProps {
  /** [longitude, latitude] */
  center: [number, number];
  zoom?: number;
  markers: MapLibreMarkerData[];
  className?: string;
}

function createMarkerElement(label: string, active: boolean, interactive: boolean): HTMLDivElement {
  const el = document.createElement('div');
  el.setAttribute('role', 'button');
  el.setAttribute('aria-label', label);
  el.style.cursor = 'pointer';
  if (interactive) {
    el.setAttribute('tabindex', '0');
  }
  el.innerHTML = `
    <svg width="32" height="40" viewBox="0 0 32 40" style="filter: drop-shadow(1px 2px 2px rgba(0,0,0,0.3))">
      <path
        d="M16 2C8.8 2 3 7.8 3 15c0 9.5 13 21.5 13 21.5S29 24.5 29 15c0-7.2-5.8-13-13-13z"
        fill="${active ? '#EAC102' : '#00AB39'}"
        stroke="#5D4E37"
        stroke-width="2"
      />
      <circle cx="16" cy="15" r="5" fill="#FFFFFF" />
    </svg>
  `;
  return el;
}

function syncMarkers(map: MaplibreMapInstance, markers: MapLibreMarkerData[]): Marker[] {
  return markers.map((markerData) => {
    const el = createMarkerElement(markerData.label, !!markerData.active, !!markerData.onClick);
    if (markerData.onClick) {
      const onClick = markerData.onClick;
      el.addEventListener('click', onClick);
      el.addEventListener('keydown', (event) => {
        const key = (event as KeyboardEvent).key;
        if (key === 'Enter' || key === ' ') {
          event.preventDefault();
          onClick();
        }
      });
    }
    return new Marker({ element: el }).setLngLat(markerData.coords).addTo(map);
  });
}

/** client:only / browser-only WebGL — do not SSR-import callers without a
 * client directive. Init once; jumpTo + ResizeObserver keep tiles alive. */
export function MapLibreMap({
  center,
  zoom = 14,
  markers,
  className = '',
}: Readonly<MapLibreMapProps>) {
  const containerRef = useRef<HTMLDivElement>(null);
  const mapRef = useRef<MaplibreMapInstance | null>(null);
  const markersRef = useRef<Marker[]>([]);
  const markersPropRef = useRef(markers);
  markersPropRef.current = markers;

  // Mount once — never depend on `center` array identity (parent re-renders
  // used to tear down the map before vector/raster tiles could paint).
  useEffect(() => {
    const container = containerRef.current;
    if (!container || mapRef.current) return;

    const map = new MaplibreMapInstance({
      container,
      style: TILE_STYLE,
      center,
      zoom,
      attributionControl: true,
    });
    map.addControl(new NavigationControl({ showCompass: false }), 'top-right');
    mapRef.current = map;

    const paintMarkers = () => {
      markersRef.current.forEach((marker) => marker.remove());
      markersRef.current = syncMarkers(map, markersPropRef.current);
    };

    map.on('load', () => {
      map.resize();
      paintMarkers();
    });

    const ro = new ResizeObserver(() => {
      map.resize();
    });
    ro.observe(container);

    return () => {
      ro.disconnect();
      markersRef.current.forEach((marker) => marker.remove());
      markersRef.current = [];
      map.remove();
      mapRef.current = null;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps -- mount once
  }, []);

  useEffect(() => {
    const map = mapRef.current;
    if (!map) return;
    const current = map.getCenter();
    if (
      Math.abs(current.lng - center[0]) > 1e-6 ||
      Math.abs(current.lat - center[1]) > 1e-6 ||
      Math.abs(map.getZoom() - zoom) > 1e-3
    ) {
      map.jumpTo({ center, zoom });
    }
  }, [center[0], center[1], zoom]);

  useEffect(() => {
    const map = mapRef.current;
    if (!map || !map.isStyleLoaded()) return;
    markersRef.current.forEach((marker) => marker.remove());
    markersRef.current = syncMarkers(map, markers);
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
