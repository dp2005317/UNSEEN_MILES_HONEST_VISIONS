import { useEffect, useState } from 'react';
import { Bookmark, Check, ExternalLink, Scale } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { DESTINATIONS } from '../data/catalog';
import { getMediaUrl } from '../data/media';
import type { HotelOption } from '../types/travel';
import { Navbar } from '../components/layout/Navbar';
import { Footer } from '../components/layout/Footer';
import { LiveWebSearchPanel } from '../components/search/LiveWebSearchPanel';

export function StaysPage() {
  const [destinationId, setDestinationId] = useState('all');
  const [tier, setTier] = useState<'all' | 'budget' | 'boutique' | 'luxury'>('all');
  const [maxNightly, setMaxNightly] = useState(25000);
  const [avoidCrowds, setAvoidCrowds] = useState(false);
  const [hotels, setHotels] = useState<HotelOption[]>([]);
  const [savedIds, setSavedIds] = useState<string[]>([]);
  const [compareIds, setCompareIds] = useState<string[]>([]);
  const [provenance, setProvenance] = useState('');

  useEffect(() => {
    const params = new URLSearchParams({
      destinationId,
      maxNightly: String(maxNightly),
      avoidCrowds: String(avoidCrowds),
    });
    if (tier !== 'all') params.set('tier', tier);

    fetch(`/api/hotels?${params.toString()}`)
      .then((r) => r.json())
      .then((d) => {
        setHotels(d.hotels || []);
        setProvenance(d.provenance || '');
      })
      .catch(() => {});
  }, [destinationId, tier, maxNightly, avoidCrowds]);

  useEffect(() => {
    fetch('/api/saved')
      .then((r) => r.json())
      .then((d) => setSavedIds(d.hotelIds || []))
      .catch(() => {});
  }, []);

  const toggleSave = async (id: string) => {
    const r = await fetch(`/api/saved/hotel/${id}`, { method: 'POST' });
    const d = await r.json();
    if (Array.isArray(d.hotelIds)) setSavedIds(d.hotelIds);
  };

  const toggleCompare = (id: string) => {
    setCompareIds((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : prev.length < 3 ? [...prev, id] : [...prev.slice(1), id]
    );
  };

  const comparedHotels = hotels.filter((h) => compareIds.includes(h.id));
  const selectedDestName =
    destinationId === 'all'
      ? 'Bali'
      : DESTINATIONS.find((d) => d.id === destinationId)?.name || 'Bali';

  return (
    <div className="min-h-screen flex flex-col text-slate-900">
      <Navbar />

      <main className="flex-1 pt-24 pb-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full space-y-8">
        <div className="space-y-2 max-w-3xl">
          <p className="text-xs font-semibold tracking-wider text-blue-700">AI Stay Discovery & Ranking</p>
          <h1 className="text-3xl sm:text-4xl font-bold tracking-tight text-slate-950">
            Compare{' '}
            <span className="font-serif italic font-medium">ranked stays</span> by quietness, budget & access
          </h1>
          <p className="text-xs text-slate-600">
            {provenance || 'AI web search findings paired with curated boutique stays — confirm live availability via partner links.'}
          </p>
        </div>

        {/* Filters */}
        <div className="rounded-3xl liquid-glass p-5 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 items-end">
          <div>
            <label htmlFor="stays-dest" className="block text-xs font-semibold text-slate-700 mb-1.5">
              Destination
            </label>
            <select
              id="stays-dest"
              value={destinationId}
              onChange={(e) => setDestinationId(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-xl border border-white/85 text-sm bg-white/80 font-medium"
            >
              <option value="all">All 12 Destinations</option>
              {DESTINATIONS.map((d) => (
                <option key={d.id} value={d.id}>
                  {d.name}, {d.country}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label htmlFor="stays-tier" className="block text-xs font-semibold text-slate-700 mb-1.5">
              Stay Style
            </label>
            <select
              id="stays-tier"
              value={tier}
              onChange={(e) => setTier(e.target.value as typeof tier)}
              className="w-full px-3.5 py-2.5 rounded-xl border border-white/85 text-sm bg-white/80 font-medium"
            >
              <option value="all">All Tiers</option>
              <option value="budget">Budget Friendly</option>
              <option value="boutique">Boutique</option>
              <option value="luxury">Luxury Sanctuary</option>
            </select>
          </div>

          <div>
            <label htmlFor="stays-price" className="block text-xs font-semibold text-slate-700 mb-1.5 tabular-nums">
              Target Max Nightly (₹{maxNightly.toLocaleString()})
            </label>
            <input
              id="stays-price"
              type="range"
              min={4000}
              max={25000}
              step={1000}
              value={maxNightly}
              onChange={(e) => setMaxNightly(Number(e.target.value))}
              className="w-full accent-blue-600"
            />
          </div>

          <label className="flex items-center gap-2.5 px-3.5 py-2.5 rounded-xl border border-white/85 bg-white/75 text-xs font-semibold text-slate-800 cursor-pointer">
            <input
              type="checkbox"
              checked={avoidCrowds}
              onChange={(e) => setAvoidCrowds(e.target.checked)}
              className="rounded accent-blue-600"
            />
            <span>Prefer Quiet Neighborhoods</span>
          </label>
        </div>

        <LiveWebSearchPanel
          category="hotels"
          destination={selectedDestName}
          preferencesNote={`Budget up to ₹${maxNightly.toLocaleString()}/night${tier !== 'all' ? `, ${tier} style` : ''}${avoidCrowds ? ', quiet neighborhood' : ''}.`}
          autoTrigger
        />

        {/* Liquid Glass Comparison Tray */}
        <AnimatePresence>
          {comparedHotels.length > 0 && (
            <motion.section
              initial={{ opacity: 0, y: -12, scale: 0.98 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -8, scale: 0.98 }}
              transition={{ duration: 0.28, ease: [0.23, 1, 0.32, 1] }}
              className="rounded-3xl liquid-glass border-blue-200/80 p-6 space-y-4"
            >
              <div className="flex items-center justify-between gap-4">
                <div className="flex items-center gap-2">
                  <Scale className="w-4 h-4 text-blue-600" aria-hidden="true" />
                  <h2 className="text-base font-semibold text-slate-950">
                    Side-by-Side Comparison ({comparedHotels.length}/3)
                  </h2>
                </div>
                <button
                  type="button"
                  onClick={() => setCompareIds([])}
                  className="text-xs font-semibold text-slate-600 hover:text-slate-950 cursor-pointer pressable"
                >
                  Clear Comparison
                </button>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {comparedHotels.map((h) => (
                  <div key={h.id} className="rounded-2xl liquid-glass-subtle p-4 space-y-2 text-xs card-interactive">
                    <p className="font-semibold text-sm text-slate-950">{h.name}</p>
                    <p className="text-blue-700 font-semibold tabular-nums">
                      ₹{h.pricePerNightInr.toLocaleString()}/night · {h.rating}★ ({h.reviewCount})
                    </p>
                    <p className="text-slate-700 tabular-nums">
                      Distance to center: {h.distanceToCenterKm} km
                    </p>
                    <p className="text-slate-500">{h.cancellationPolicy}</p>
                  </div>
                ))}
              </div>
            </motion.section>
          )}
        </AnimatePresence>

        {/* Stay Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {hotels.map((hotel) => {
            const isSaved = savedIds.includes(hotel.id);
            const isCompared = compareIds.includes(hotel.id);
            const bookingHref = `https://www.booking.com/searchresults.html?ss=${encodeURIComponent(
              `${hotel.name} ${hotel.area}`
            )}`;
            return (
              <article
                key={hotel.id}
                className="rounded-[26px] liquid-glass overflow-hidden flex flex-col justify-between card-interactive group"
              >
                <div>
                  <div className="relative h-52 bg-slate-200 overflow-hidden">
                    <img
                      src={getMediaUrl(hotel.mediaKey)}
                      alt={hotel.name}
                      referrerPolicy="no-referrer"
                      className="w-full h-full object-cover img-zoom"
                    />
                    <span className="absolute top-3 left-3 px-3 py-1 rounded-full liquid-glass-chip text-xs font-semibold text-slate-900 capitalize">
                      {hotel.tier}
                    </span>
                    <button
                      type="button"
                      onClick={() => toggleSave(hotel.id)}
                      aria-label={isSaved ? `Unsave ${hotel.name}` : `Save ${hotel.name}`}
                      className={`absolute top-3 right-3 w-10 h-10 rounded-full inline-flex items-center justify-center border cursor-pointer backdrop-blur-md pressable ${
                        isSaved
                          ? 'bg-blue-600 text-white border-blue-500 shadow-sm'
                          : 'bg-white/85 text-slate-800 border-white/80 hover:bg-white'
                      }`}
                    >
                      <Bookmark className="w-4 h-4" />
                    </button>
                  </div>

                  <div className="p-5 space-y-2.5">
                    <p className="text-xs text-slate-500 tabular-nums">
                      {hotel.area} · {hotel.distanceToCenterKm} km from center
                    </p>
                    <h2 className="text-lg font-bold text-slate-950">{hotel.name}</h2>
                    <p className="text-xs text-slate-600 leading-relaxed">
                      {hotel.recommendationReason}
                    </p>
                    <p className="text-xs text-slate-500">
                      {hotel.amenities.slice(0, 3).join(' · ')}
                    </p>
                    <p className="text-xs text-slate-500">
                      {hotel.cancellationPolicy} · {hotel.availabilityStatus}
                    </p>
                  </div>
                </div>

                <div className="px-5 pb-5 pt-3 border-t border-white/70 flex items-center justify-between gap-2">
                  <div>
                    <p className="text-base font-bold tabular-nums tracking-tight text-slate-950">
                      ₹{hotel.pricePerNightInr.toLocaleString()}
                      <span className="text-xs font-normal text-slate-500">/night</span>
                    </p>
                    <p className="text-xs text-slate-500 tabular-nums">
                      {hotel.rating}★ ({hotel.reviewCount} reviews)
                    </p>
                  </div>

                  <div className="flex items-center gap-2">
                    <a
                      href={bookingHref}
                      target="_blank"
                      rel="noreferrer"
                      aria-label={`Check live rates for ${hotel.name}`}
                      className="inline-flex items-center gap-1 px-3 py-2 rounded-full liquid-glass-chip text-xs font-semibold text-blue-700 hover:text-blue-800 pressable"
                    >
                      <span>Rates</span>
                      <ExternalLink className="w-3 h-3" />
                    </a>
                    <button
                      type="button"
                      onClick={() => toggleCompare(hotel.id)}
                      className={`inline-flex items-center gap-1.5 px-3.5 py-2 rounded-full text-xs font-semibold cursor-pointer pressable ${
                        isCompared
                          ? 'bg-blue-600 text-white'
                          : 'bg-slate-950 text-white hover:bg-slate-800'
                      }`}
                    >
                      {isCompared && <Check className="w-3.5 h-3.5" />}
                      <span>{isCompared ? 'Comparing' : 'Compare'}</span>
                    </button>
                  </div>
                </div>
              </article>
            );
          })}
        </div>
      </main>

      <Footer />
    </div>
  );
}
