import { useEffect, useState } from 'react';
import { ExternalLink, TrainFront } from 'lucide-react';
import { DESTINATIONS } from '../data/catalog';
import type { TransportLeg } from '../types/travel';
import { Navbar } from '../components/layout/Navbar';
import { Footer } from '../components/layout/Footer';
import { LiveWebSearchPanel } from '../components/search/LiveWebSearchPanel';

export function TransportPage() {
  const [destinationId, setDestinationId] = useState('bali');
  const [options, setOptions] = useState<TransportLeg[]>([]);
  const [provenance, setProvenance] = useState('');

  useEffect(() => {
    fetch(`/api/transport?destinationId=${destinationId}`)
      .then((r) => r.json())
      .then((d) => {
        setOptions(d.options || []);
        setProvenance(d.provenance || '');
      })
      .catch(() => {});
  }, [destinationId]);

  const activeDest = DESTINATIONS.find((d) => d.id === destinationId) || DESTINATIONS[0];

  return (
    <div className="min-h-screen flex flex-col text-slate-900">
      <Navbar />

      <main className="flex-1 pt-24 pb-20 max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 w-full space-y-8">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
          <div className="space-y-2 max-w-2xl">
            <p className="text-xs font-semibold tracking-wider text-blue-700">Local Mobility</p>
            <h1 className="text-3xl sm:text-4xl font-bold tracking-tight text-slate-950">
              Airport transfers,{' '}
              <span className="font-serif italic font-medium">scenic rail</span> & local transit
            </h1>
            <p className="text-xs text-slate-600">
              {provenance || 'AI web search for local transit combined with indicative fare benchmarks.'}
            </p>
          </div>

          <div className="w-full md:w-72">
            <label htmlFor="tr-dest" className="block text-xs font-semibold text-slate-700 mb-1.5">
              Select Destination
            </label>
            <select
              id="tr-dest"
              value={destinationId}
              onChange={(e) => setDestinationId(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-xl border border-white/85 text-sm bg-white/80 font-medium"
            >
              {DESTINATIONS.map((d) => (
                <option key={d.id} value={d.id}>
                  {d.name}, {d.country}
                </option>
              ))}
            </select>
          </div>
        </div>

        <LiveWebSearchPanel
          category="transport"
          destination={activeDest.name}
          autoTrigger
        />

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {options.map((opt) => (
            <article
              key={opt.id}
              className="rounded-3xl liquid-glass p-6 flex flex-col justify-between space-y-4"
            >
              <div className="space-y-2">
                <div className="flex items-center justify-between gap-2">
                  <span className="inline-flex items-center gap-1.5 text-xs font-semibold text-blue-700">
                    <TrainFront className="w-4 h-4" aria-hidden="true" />
                    {opt.mode}
                  </span>
                  <span className="text-xs text-slate-500">{opt.availabilityStatus}</span>
                </div>
                <h2 className="text-lg font-bold text-slate-950">{opt.route}</h2>
                <p className="text-xs text-slate-600 tabular-nums">
                  Duration: {opt.durationMinutes} min · Distance: {opt.distanceKm} km · Provider: {opt.provider}
                </p>
              </div>

              <div className="pt-3 border-t border-white/70 flex items-center justify-between gap-3">
                <span className="text-base font-bold tabular-nums tracking-tight text-slate-950">
                  {opt.estimatedFareInr === 0 ? 'Free Path' : `~₹${opt.estimatedFareInr.toLocaleString()}`}
                </span>
                <a
                  href={opt.bookingUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center gap-1.5 px-4 py-2 rounded-full bg-slate-950 text-white text-xs font-semibold hover:bg-slate-800"
                >
                  <span>Book / Route Info</span>
                  <ExternalLink className="w-3.5 h-3.5" aria-hidden="true" />
                </a>
              </div>
            </article>
          ))}
        </div>
      </main>

      <Footer />
    </div>
  );
}
