import { useCallback, useEffect, useRef, useState } from 'react';
import { ExternalLink, Globe, Loader2, RefreshCw } from 'lucide-react';
import type { ResearchSource } from '../../types/travel';

interface LiveWebSearchPanelProps {
  category: 'hotels' | 'flights' | 'transport';
  destination: string;
  origin?: string;
  preferencesNote?: string;
  autoTrigger?: boolean;
}

interface LiveSearchResponse {
  summary: string;
  highlights: Array<{
    name: string;
    subtitle?: string;
    detail: string;
    indicativePrice: string;
    url?: string;
  }>;
  sources: ResearchSource[];
  providerLabel: string;
  bookingLinks?: Array<{ label: string; url: string }>;
}

export function LiveWebSearchPanel({
  category,
  destination,
  origin,
  preferencesNote,
  autoTrigger = false,
}: LiveWebSearchPanelProps) {
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<LiveSearchResponse | null>(null);
  const [error, setError] = useState<string | null>(null);
  const abortRef = useRef<AbortController | null>(null);

  const labelMap = {
    hotels: 'Refresh Live Stays',
    flights: 'Refresh Live Flights',
    transport: 'Refresh Live Transit',
  };

  const titleMap = {
    hotels: 'AI Live Hotel & Neighborhood Search',
    flights: 'AI Live Flight Routes & Airlines',
    transport: 'AI Live Local Transit & Transfers',
  };

  const runSearch = useCallback(async () => {
    if (!destination.trim()) return;
    abortRef.current?.abort();
    const controller = new AbortController();
    abortRef.current = controller;

    setLoading(true);
    setError(null);
    try {
      const resp = await fetch('/api/search/web', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        signal: controller.signal,
        body: JSON.stringify({
          category,
          destination: destination.trim(),
          origin: origin?.trim() || undefined,
          preferencesNote,
        }),
      });
      const data = await resp.json();
      if (!resp.ok) {
        setError(data.error || 'Unable to perform web search right now.');
      } else {
        setResult(data);
      }
    } catch (err) {
      if ((err as { name?: string })?.name !== 'AbortError') {
        setError('Network error reaching live web search endpoint.');
      }
    } finally {
      if (!controller.signal.aborted) {
        setLoading(false);
      }
    }
  }, [category, destination, origin, preferencesNote]);

  const firstMountRef = useRef(true);

  useEffect(() => {
    if (!autoTrigger) return;
    if (firstMountRef.current) {
      firstMountRef.current = false;
      void runSearch();
      return () => {
        abortRef.current?.abort();
      };
    }
    const timer = setTimeout(() => {
      void runSearch();
    }, 300);
    return () => {
      clearTimeout(timer);
      abortRef.current?.abort();
    };
  }, [autoTrigger, runSearch]);

  return (
    <section className="rounded-3xl liquid-glass p-5 sm:p-6 space-y-4">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="space-y-1">
          <div className="flex items-center gap-2 text-xs font-semibold text-blue-700">
            <Globe className="w-4 h-4" aria-hidden="true" />
            <span>{titleMap[category]}</span>
          </div>
          <p className="text-xs text-slate-600">
            Real-time web intelligence, typical fares, and direct booking links for{' '}
            <span className="font-semibold text-slate-900">
              {origin ? `${origin} → ${destination}` : destination}
            </span>
            .
          </p>
        </div>

        <button
          type="button"
          onClick={() => void runSearch()}
          disabled={loading}
          className="inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-full bg-blue-600 text-white text-xs font-semibold hover:bg-blue-700 disabled:opacity-60 whitespace-nowrap shrink-0 shadow-sm cursor-pointer transition-colors"
        >
          {loading ? (
            <Loader2 className="w-3.5 h-3.5 animate-spin" aria-hidden="true" />
          ) : (
            <RefreshCw className="w-3.5 h-3.5" aria-hidden="true" />
          )}
          <span>{loading ? 'Searching Web…' : labelMap[category]}</span>
        </button>
      </div>

      {error && (
        <p className="text-xs text-red-700 bg-red-50/90 border border-red-200 rounded-xl px-3.5 py-2.5">
          {error}
        </p>
      )}

      {loading && !result && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3 pt-2">
          {[0, 1, 2].map((i) => (
            <div
              key={i}
              className="rounded-2xl liquid-glass-subtle p-4 space-y-2.5 animate-pulse"
            >
              <div className="h-4 bg-slate-200/80 rounded-lg w-2/3" />
              <div className="h-3 bg-slate-200/70 rounded-lg w-full" />
              <div className="h-3 bg-slate-200/60 rounded-lg w-1/2" />
            </div>
          ))}
        </div>
      )}

      {result && (
        <div className="pt-3 border-t border-white/70 space-y-4">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <span className="text-xs font-semibold text-blue-700">{result.providerLabel}</span>
            <span className="text-xs text-slate-500">Live web-grounded travel intelligence</span>
          </div>

          <p className="text-sm text-slate-700 leading-relaxed">{result.summary}</p>

          {result.highlights.length > 0 && (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3.5">
              {result.highlights.map((item, idx) => (
                <div
                  key={idx}
                  className="rounded-2xl liquid-glass-subtle p-4 flex flex-col justify-between gap-2.5"
                >
                  <div className="space-y-1.5">
                    {item.subtitle && (
                      <p className="text-xs font-medium text-blue-700">{item.subtitle}</p>
                    )}
                    <p className="text-sm font-semibold text-slate-900 leading-snug">{item.name}</p>
                    <p className="text-xs text-slate-600 leading-relaxed">{item.detail}</p>
                  </div>
                  {item.url ? (
                    <a
                      href={item.url}
                      target="_blank"
                      rel="noreferrer"
                      className="inline-flex items-center gap-1.5 text-xs font-semibold text-blue-700 hover:underline pt-1 tabular-nums"
                    >
                      <span>{item.indicativePrice}</span>
                      <ExternalLink className="w-3 h-3 shrink-0" aria-hidden="true" />
                    </a>
                  ) : (
                    <p className="text-xs font-semibold text-blue-700 pt-1 tabular-nums">
                      {item.indicativePrice}
                    </p>
                  )}
                </div>
              ))}
            </div>
          )}

          {result.bookingLinks && result.bookingLinks.length > 0 && (
            <div className="flex flex-wrap items-center gap-2.5 pt-1">
              <span className="text-xs font-semibold text-slate-500">Book Directly:</span>
              {result.bookingLinks.map((link) => (
                <a
                  key={link.url}
                  href={link.url}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full liquid-glass-chip text-xs font-semibold text-slate-900 hover:text-blue-700 transition-colors"
                >
                  <span>{link.label}</span>
                  <ExternalLink className="w-3 h-3 text-blue-600" aria-hidden="true" />
                </a>
              ))}
            </div>
          )}

          {result.sources.length > 0 && (
            <div className="flex flex-wrap items-center gap-3 pt-1">
              <span className="text-xs font-semibold text-slate-500">Sources:</span>
              {result.sources.map((src, i) => (
                <a
                  key={i}
                  href={src.url}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center gap-1 text-xs font-medium text-blue-700 hover:underline"
                >
                  <span>{src.title}</span>
                  <ExternalLink className="w-3 h-3" aria-hidden="true" />
                </a>
              ))}
            </div>
          )}
        </div>
      )}
    </section>
  );
}
