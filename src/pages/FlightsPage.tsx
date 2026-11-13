import { useEffect, useState } from 'react';
import { ArrowLeftRight, ExternalLink, Plane, Search } from 'lucide-react';
import { DESTINATIONS } from '../data/catalog';
import type { FlightOption } from '../types/travel';
import { Navbar } from '../components/layout/Navbar';
import { Footer } from '../components/layout/Footer';
import { LiveWebSearchPanel } from '../components/search/LiveWebSearchPanel';

export function FlightsPage() {
  const [originInput, setOriginInput] = useState('Kolkata');
  const [destinationInput, setDestinationInput] = useState('Bali');
  const [activeOrigin, setActiveOrigin] = useState('Kolkata');
  const [activeDestination, setActiveDestination] = useState('Bali');
  const [flights, setFlights] = useState<FlightOption[]>([]);
  const [loading, setLoading] = useState(false);
  const [provenance, setProvenance] = useState('');

  const fetchRouteFlights = (orig: string, dest: string) => {
    const cleanOrig = orig.trim() || 'Kolkata';
    const cleanDest = dest.trim() || 'Bali';
    setLoading(true);
    fetch(`/api/flights?origin=${encodeURIComponent(cleanOrig)}&destination=${encodeURIComponent(cleanDest)}`)
      .then((r) => r.json())
      .then((d) => {
        setFlights(d.flights || []);
        setProvenance(d.provenance || '');
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchRouteFlights(activeOrigin, activeDestination);
  }, [activeOrigin, activeDestination]);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setActiveOrigin(originInput.trim() || 'Kolkata');
    setActiveDestination(destinationInput.trim() || 'Bali');
  };

  const handleQuickSelect = (destName: string) => {
    setDestinationInput(destName);
    setActiveOrigin(originInput.trim() || 'Kolkata');
    setActiveDestination(destName);
  };

  const handleSwap = () => {
    const nextOrigin = destinationInput;
    const nextDest = originInput;
    setOriginInput(nextOrigin);
    setDestinationInput(nextDest);
    setActiveOrigin(nextOrigin.trim() || 'Bali');
    setActiveDestination(nextDest.trim() || 'Kolkata');
  };

  return (
    <div className="min-h-screen flex flex-col text-slate-900">
      <Navbar />

      <main className="flex-1 pt-24 pb-20 max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 w-full space-y-8">
        <div className="space-y-2 max-w-3xl">
          <p className="text-xs font-semibold tracking-wider text-blue-700">Live Flight Intelligence</p>
          <h1 className="text-3xl sm:text-4xl font-bold tracking-tight text-slate-950">
            Search{' '}
            <span className="font-serif italic font-medium">flight routes</span>, fares & direct booking
          </h1>
          <p className="text-xs text-slate-600">
            AI web search pulls live airline routes and partner links alongside calibrated route benchmarks.
          </p>
        </div>

        <form
          onSubmit={handleSearchSubmit}
          className="rounded-3xl liquid-glass p-5 space-y-4"
        >
          <div className="grid grid-cols-1 md:grid-cols-12 gap-3.5 items-end">
            <div className="md:col-span-4">
              <label htmlFor="fl-origin" className="block text-xs font-semibold text-slate-700 mb-1.5">
                Origin City
              </label>
              <input
                id="fl-origin"
                type="text"
                value={originInput}
                onChange={(e) => setOriginInput(e.target.value)}
                placeholder="e.g. Kolkata, Delhi, Mumbai"
                className="w-full px-3.5 py-2.5 rounded-xl border border-white/85 bg-white/80 text-sm text-slate-900 font-medium"
              />
            </div>

            <div className="md:col-span-1 flex justify-center">
              <button
                type="button"
                onClick={handleSwap}
                aria-label="Swap origin and destination"
                className="w-10 h-10 rounded-full liquid-glass-chip inline-flex items-center justify-center text-slate-700 hover:text-blue-700 cursor-pointer"
              >
                <ArrowLeftRight className="w-4 h-4" />
              </button>
            </div>

            <div className="md:col-span-4">
              <label htmlFor="fl-dest" className="block text-xs font-semibold text-slate-700 mb-1.5">
                Destination City or Country
              </label>
              <input
                id="fl-dest"
                type="text"
                list="flight-dest-options"
                value={destinationInput}
                onChange={(e) => setDestinationInput(e.target.value)}
                placeholder="Bali, Tokyo, Santorini, London…"
                className="w-full px-3.5 py-2.5 rounded-xl border border-white/85 bg-white/80 text-sm text-slate-900 font-medium"
              />
              <datalist id="flight-dest-options">
                {DESTINATIONS.map((d) => (
                  <option key={d.id} value={d.name}>
                    {d.name} ({d.country})
                  </option>
                ))}
              </datalist>
            </div>

            <div className="md:col-span-3">
              <button
                type="submit"
                className="w-full inline-flex items-center justify-center gap-2 py-2.5 px-5 rounded-full bg-slate-950 text-white text-sm font-semibold hover:bg-slate-800 cursor-pointer shadow-sm"
              >
                <Search className="w-4 h-4" aria-hidden="true" />
                <span>{loading ? 'Searching…' : 'Search Flights'}</span>
              </button>
            </div>
          </div>

          <div className="flex items-center gap-2 overflow-x-auto pt-1">
            <span className="text-xs font-medium text-slate-500 whitespace-nowrap">Popular:</span>
            {DESTINATIONS.slice(0, 8).map((d) => {
              const selected = activeDestination.toLowerCase() === d.name.toLowerCase();
              return (
                <button
                  key={d.id}
                  type="button"
                  onClick={() => handleQuickSelect(d.name)}
                  className={`px-3 py-1 rounded-full text-xs font-semibold whitespace-nowrap shrink-0 transition-colors cursor-pointer ${
                    selected
                      ? 'bg-blue-600 text-white shadow-xs'
                      : 'liquid-glass-chip text-slate-700 hover:text-blue-700'
                  }`}
                >
                  {d.name}
                </button>
              );
            })}
          </div>
        </form>

        <LiveWebSearchPanel
          category="flights"
          origin={activeOrigin}
          destination={activeDestination}
          autoTrigger
        />

        <div className="space-y-4">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <h2 className="text-lg font-bold text-slate-950">
              Route Schedules & Fare Benchmarks ({activeOrigin} → {activeDestination})
            </h2>
            <p className="text-xs text-slate-500">
              {provenance || 'Indicative route estimates — confirm live seat inventory via partner links.'}
            </p>
          </div>

          {flights.map((f) => (
            <article
              key={f.id}
              className="rounded-3xl liquid-glass p-6 flex flex-col lg:flex-row lg:items-center justify-between gap-6"
            >
              <div className="space-y-1.5">
                <p className="text-xs font-semibold text-blue-700">
                  {f.airline} · {f.flightNumber} · {f.cabinClass} · {f.provider}
                </p>
                <div className="flex items-center gap-3 text-xl font-bold text-slate-950 tabular-nums tracking-tight">
                  <span>{f.departureTime}</span>
                  <Plane className="w-4 h-4 text-blue-600" aria-hidden="true" />
                  <span>{f.arrivalTime}</span>
                </div>
                <p className="text-xs text-slate-600 tabular-nums">
                  {f.origin} → {f.destination} · {f.durationLabel} ·{' '}
                  {f.stops === 0 ? 'Non-stop' : `${f.stops} stop`} · {f.baggage}
                </p>
              </div>

              <div className="flex flex-wrap items-center justify-between lg:justify-end gap-4 pt-3 lg:pt-0 border-t lg:border-t-0 border-white/70">
                <div className="text-left lg:text-right">
                  <p className="text-xs text-slate-500">Indicative Estimate</p>
                  <p className="text-2xl font-bold tabular-nums tracking-tight text-slate-950">
                    ₹{f.priceInr.toLocaleString()}
                  </p>
                </div>
                <a
                  href={f.providerUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center gap-1.5 px-5 py-2.5 rounded-full bg-blue-600 text-white text-xs font-semibold hover:bg-blue-700 whitespace-nowrap shadow-xs"
                >
                  <span>Book on Google Flights</span>
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
