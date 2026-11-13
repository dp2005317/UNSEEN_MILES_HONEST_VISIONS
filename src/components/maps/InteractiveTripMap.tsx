import { useCallback, useEffect, useMemo, useState } from 'react';
import {
  APIProvider,
  APILoadingStatus,
  AdvancedMarker,
  InfoWindow,
  Map as GoogleMap,
  Pin,
  useApiLoadingStatus,
  useMap,
} from '@vis.gl/react-google-maps';
import { ExternalLink, MapPin, Navigation } from 'lucide-react';
import type { Activity } from '../../types/travel';

export interface MapPoint {
  id: string;
  label: string;
  subtitle?: string;
  lat: number;
  lng: number;
  category?: string;
}

interface InteractiveTripMapProps {
  title: string;
  points: MapPoint[];
  activePointId?: string;
  onSelectPoint?: (id: string) => void;
}

export function activitiesToMapPoints(activities: Activity[]): MapPoint[] {
  const seen: Record<string, boolean> = {};
  const points: MapPoint[] = [];
  for (const act of activities) {
    const coordKey = `${act.lat.toFixed(2)}-${act.lng.toFixed(2)}`;
    const nameKey = act.location.trim().toLowerCase();
    if (seen[coordKey] || seen[nameKey]) continue;
    seen[coordKey] = true;
    seen[nameKey] = true;
    points.push({
      id: act.id,
      label: act.location,
      subtitle: `${act.timeOfDay} · ${act.durationHours}h`,
      lat: act.lat,
      lng: act.lng,
      category: act.category,
    });
  }
  return points;
}

function RoutePolylineAndBounds({
  points,
  activePoint,
}: {
  points: Array<MapPoint & { index: number }>;
  activePoint?: MapPoint & { index: number };
}) {
  const map = useMap();

  // Fit bounds when points list changes
  useEffect(() => {
    const gMaps = (window as unknown as { google?: { maps?: any } }).google?.maps;
    if (!map || points.length === 0 || !gMaps) return;
    if (points.length === 1) {
      map.setCenter({ lat: points[0].lat, lng: points[0].lng });
      map.setZoom(12);
      return;
    }
    const bounds = new gMaps.LatLngBounds();
    for (const pt of points) {
      bounds.extend({ lat: pt.lat, lng: pt.lng });
    }
    map.fitBounds(bounds, { top: 48, right: 48, bottom: 72, left: 48 });
  }, [map, points]);

  // Smoothly pan to active stop when changed
  useEffect(() => {
    if (!map || !activePoint) return;
    map.panTo({ lat: activePoint.lat, lng: activePoint.lng });
  }, [map, activePoint]);

  // Draw connecting route polyline using Google Maps SDK
  useEffect(() => {
    const gMaps = (window as unknown as { google?: { maps?: any } }).google?.maps;
    if (!map || points.length < 2 || !gMaps) return;
    const polyline = new gMaps.Polyline({
      path: points.map((p) => ({ lat: p.lat, lng: p.lng })),
      geodesic: true,
      strokeColor: '#2563EB',
      strokeOpacity: 0.78,
      strokeWeight: 3,
      map,
    });
    return () => {
      polyline.setMap(null);
    };
  }, [map, points]);

  return null;
}

function InteractiveGoogleMapCanvas({
  points,
  activePoint,
  onSelect,
}: {
  points: Array<MapPoint & { index: number }>;
  activePoint?: MapPoint & { index: number };
  onSelect: (id: string) => void;
}) {
  const status = useApiLoadingStatus();
  const [infoOpen, setInfoOpen] = useState(false);

  useEffect(() => {
    if (status === APILoadingStatus.AUTH_FAILURE || status === APILoadingStatus.FAILED) {
      window.dispatchEvent(new CustomEvent('gmp-quota-exceeded'));
    }
  }, [status]);

  if (status === APILoadingStatus.AUTH_FAILURE || status === APILoadingStatus.FAILED) {
    return (
      <div className="h-[340px] sm:h-[400px] flex flex-col items-center justify-center p-6 text-center bg-slate-100/80 text-slate-700 space-y-2">
        <MapPin className="w-7 h-7 text-blue-600" aria-hidden="true" />
        <p className="text-sm font-semibold text-slate-900">Unable to load live Google Map tiles</p>
        <p className="text-xs text-slate-600 max-w-sm">
          Select any waypoint on the right or open directions directly in Google Maps.
        </p>
      </div>
    );
  }

  const center = activePoint
    ? { lat: activePoint.lat, lng: activePoint.lng }
    : points[0]
    ? { lat: points[0].lat, lng: points[0].lng }
    : { lat: 28.2096, lng: 83.9856 };

  return (
    <div className="relative w-full h-[340px] sm:h-[400px]">
      <GoogleMap
        mapId="DEMO_MAP_ID"
        defaultCenter={center}
        defaultZoom={11}
        gestureHandling="greedy"
        mapTypeControl={false}
        streetViewControl={false}
        fullscreenControl={true}
        internalUsageAttributionIds={['gmp_mcp_codeassist_v1_aistudio']}
        style={{ width: '100%', height: '100%' }}
      >
        <RoutePolylineAndBounds points={points} activePoint={activePoint} />

        {points.map((pt) => {
          const isSelected = pt.id === activePoint?.id;
          return (
            <AdvancedMarker
              key={pt.id}
              position={{ lat: pt.lat, lng: pt.lng }}
              title={pt.label}
              zIndex={isSelected ? 50 : pt.index}
              onClick={() => {
                onSelect(pt.id);
                setInfoOpen(true);
              }}
            >
              <Pin
                background={isSelected ? '#2563EB' : '#0F172A'}
                borderColor="#FFFFFF"
                glyphColor="#FFFFFF"
                glyphText={String(pt.index)}
                scale={isSelected ? 1.18 : 0.96}
              />
            </AdvancedMarker>
          );
        })}

        {infoOpen && activePoint && (
          <InfoWindow
            position={{ lat: activePoint.lat, lng: activePoint.lng }}
            onCloseClick={() => setInfoOpen(false)}
            maxWidth={260}
          >
            <div className="p-1 space-y-1 text-slate-900">
              <p className="text-[11px] font-semibold text-blue-700 tabular-nums">
                Stop 0{activePoint.index}
              </p>
              <p className="text-sm font-bold leading-snug">{activePoint.label}</p>
              {activePoint.subtitle && (
                <p className="text-xs text-slate-600">{activePoint.subtitle}</p>
              )}
            </div>
          </InfoWindow>
        )}
      </GoogleMap>

      {activePoint && (
        <div className="pointer-events-none absolute bottom-3 left-3 right-3 sm:right-auto sm:max-w-sm">
          <div className="pointer-events-auto liquid-glass rounded-2xl p-3.5 text-slate-900">
            <div className="flex items-start justify-between gap-3">
              <div className="min-w-0">
                <p className="text-xs font-semibold text-blue-700 tabular-nums">
                  Stop 0{activePoint.index} · {activePoint.lat.toFixed(4)}, {activePoint.lng.toFixed(4)}
                </p>
                <p className="text-sm font-bold truncate mt-0.5">{activePoint.label}</p>
                {activePoint.subtitle && (
                  <p className="text-xs text-slate-600 mt-0.5">{activePoint.subtitle}</p>
                )}
              </div>
              <Navigation className="w-4 h-4 text-blue-600 shrink-0 mt-0.5" aria-hidden="true" />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export function InteractiveTripMap({
  title,
  points,
  activePointId,
  onSelectPoint,
}: InteractiveTripMapProps) {
  const [internalActive, setInternalActive] = useState<string | undefined>(points[0]?.id);
  const [apiKey, setApiKey] = useState<string>(
    () => (import.meta.env.VITE_GOOGLE_MAPS_API_KEY as string | undefined)?.trim() || ''
  );
  const [keyChecked, setKeyChecked] = useState<boolean>(Boolean(apiKey));

  useEffect(() => {
    if (apiKey) return;
    fetch('/api/maps/config')
      .then((r) => r.json())
      .then((d: { apiKey?: string }) => {
        if (d.apiKey) setApiKey(d.apiKey);
      })
      .catch(() => {})
      .finally(() => setKeyChecked(true));
  }, [apiKey]);

  const indexedPoints = useMemo(
    () => points.map((p, idx) => ({ ...p, index: idx + 1 })),
    [points]
  );

  const selectedId = activePointId || internalActive || indexedPoints[0]?.id;
  const activePoint = indexedPoints.find((p) => p.id === selectedId) || indexedPoints[0];

  const handleSelect = useCallback(
    (id: string) => {
      setInternalActive(id);
      onSelectPoint?.(id);
    },
    [onSelectPoint]
  );

  const googleMapsUrl = activePoint
    ? `https://www.google.com/maps/search/?api=1&query=${activePoint.lat},${activePoint.lng}`
    : 'https://maps.google.com';

  return (
    <div className="liquid-glass rounded-3xl overflow-hidden">
      <div className="px-5 py-4 border-b border-white/70 flex flex-wrap items-center justify-between gap-3">
        <div>
          <h3 className="text-sm font-bold text-slate-950">{title}</h3>
          <p className="text-xs text-slate-600">
            {indexedPoints.length} verified stops · Interactive Google Map
          </p>
        </div>
        <a
          href={googleMapsUrl}
          target="_blank"
          rel="noreferrer"
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-blue-700 hover:text-blue-800 whitespace-nowrap shrink-0"
        >
          <span>Open in Google Maps</span>
          <ExternalLink className="w-3.5 h-3.5" aria-hidden="true" />
        </a>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12">
        <div className="lg:col-span-8 relative bg-slate-100 min-h-[340px] sm:min-h-[400px]">
          {apiKey ? (
            <APIProvider apiKey={apiKey} libraries={['marker']} language="en" region="US">
              <InteractiveGoogleMapCanvas
                points={indexedPoints}
                activePoint={activePoint}
                onSelect={handleSelect}
              />
            </APIProvider>
          ) : (
            <div className="h-[340px] sm:h-[400px] flex flex-col items-center justify-center p-6 text-center space-y-2.5 bg-slate-100/75">
              <MapPin className="w-7 h-7 text-blue-600" aria-hidden="true" />
              <p className="text-sm font-semibold text-slate-900">
                {keyChecked ? 'Google Maps display ready once API key loads' : 'Initializing Google Maps…'}
              </p>
              {activePoint && (
                <p className="text-xs font-medium text-slate-600 tabular-nums">
                  Active Stop: {activePoint.label} ({activePoint.lat.toFixed(4)}, {activePoint.lng.toFixed(4)})
                </p>
              )}
              <a
                href={googleMapsUrl}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-1.5 px-4 py-2 rounded-full bg-blue-600 text-white text-xs font-semibold hover:bg-blue-700"
              >
                <span>View Pin on Google Maps</span>
                <ExternalLink className="w-3.5 h-3.5" aria-hidden="true" />
              </a>
            </div>
          )}
        </div>

        <div className="lg:col-span-4 border-t lg:border-t-0 lg:border-l border-white/70 divide-y divide-slate-200/60 max-h-[400px] overflow-y-auto bg-white/55">
          {indexedPoints.map((pt) => {
            const isSelected = pt.id === activePoint?.id;
            return (
              <button
                key={pt.id}
                type="button"
                onClick={() => handleSelect(pt.id)}
                className={`w-full text-left px-4 py-3 flex items-start gap-3 transition-colors cursor-pointer ${
                  isSelected ? 'bg-blue-50/85' : 'hover:bg-white/80'
                }`}
              >
                <span
                  className={`w-6 h-6 rounded-full text-xs font-semibold inline-flex items-center justify-center shrink-0 mt-0.5 tabular-nums ${
                    isSelected ? 'bg-blue-600 text-white' : 'bg-slate-200/80 text-slate-700'
                  }`}
                >
                  {pt.index}
                </span>
                <div className="min-w-0">
                  <p className="text-sm font-semibold text-slate-900 truncate">{pt.label}</p>
                  <p className="text-xs text-slate-500 truncate mt-0.5">
                    {pt.subtitle || pt.category || 'Route waypoint'}
                  </p>
                </div>
                <MapPin className="w-4 h-4 text-slate-400 shrink-0 ml-auto mt-1" aria-hidden="true" />
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}
