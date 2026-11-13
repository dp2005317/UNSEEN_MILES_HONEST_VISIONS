import { useEffect, useRef, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { ArrowRight, Bookmark, CloudSun, ExternalLink, Loader2, MapPin, Search, Sparkles } from 'lucide-react';
import { DESTINATIONS } from '../data/catalog';
import { getMediaUrl } from '../data/media';
import type { Destination, HotelOption, ResearchSource, TransportLeg } from '../types/travel';
import { Navbar } from '../components/layout/Navbar';
import { Footer } from '../components/layout/Footer';
import { InteractiveTripMap } from '../components/maps/InteractiveTripMap';
import { CurrencyLanguageTools } from '../components/currency/CurrencyLanguageTools';

interface AiSuggestedPlace {
  name: string;
  countryOrRegion: string;
  tagline: string;
  highlights: string[];
  bestSeason: string;
  indicativeDailyBudget: string;
  mapsUrl: string;
}

const AI_PLACE_PROMPTS = [
  'Quiet alpine lake villages in Europe',
  'Misty tea hills & serene cafés in Asia',
  'Peaceful coastal islands without crowds',
  'Historic cedar alleys & mountain retreats',
];

export function ExplorePage() {
  const { slug } = useParams<{ slug?: string }>();
  const [query, setQuery] = useState('');
  const [selectedTag, setSelectedTag] = useState('All');
  const [savedIds, setSavedIds] = useState<string[]>([]);
  const [aiLoading, setAiLoading] = useState(false);
  const [aiPlaces, setAiPlaces] = useState<{
    summary: string;
    places: AiSuggestedPlace[];
    sources: ResearchSource[];
    providerLabel: string;
  } | null>(null);

  useEffect(() => {
    fetch('/api/saved')
      .then((r) => r.json())
      .then((d) => setSavedIds(d.destinationIds || []))
      .catch(() => {});
  }, []);

  const lastAiQueryRef = useRef('');

  const runAiPlaceSearch = async (searchQuery: string) => {
    const clean = searchQuery.trim();
    if (!clean) return;
    lastAiQueryRef.current = clean;
    setAiLoading(true);
    try {
      const resp = await fetch('/api/ai/suggest-places', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ query: clean }),
      });
      if (resp.ok) {
        const data = await resp.json();
        setAiPlaces(data);
      }
    } finally {
      setAiLoading(false);
    }
  };

  useEffect(() => {
    const clean = query.trim();
    if (!clean || clean.length < 3 || clean === lastAiQueryRef.current) return;
    const timer = setTimeout(() => {
      void runAiPlaceSearch(clean);
    }, 750);
    return () => clearTimeout(timer);
  }, [query]);

  const toggleSave = async (id: string) => {
    const resp = await fetch(`/api/saved/destination/${id}`, { method: 'POST' });
    const data = await resp.json();
    if (Array.isArray(data.destinationIds)) setSavedIds(data.destinationIds);
  };

  if (slug) {
    return <DestinationDetailView slug={slug} savedIds={savedIds} onToggleSave={toggleSave} />;
  }

  const tags = ['All', 'Beaches', 'Mountains', 'Cafes', 'Culture', 'Peaceful Places', 'Nature'];
  const filtered = DESTINATIONS.filter((d) => {
    const matchesQ =
      !query.trim() ||
      d.name.toLowerCase().includes(query.toLowerCase()) ||
      d.country.toLowerCase().includes(query.toLowerCase()) ||
      d.region.toLowerCase().includes(query.toLowerCase()) ||
      d.tagline.toLowerCase().includes(query.toLowerCase());
    const matchesTag =
      selectedTag === 'All' || d.tags.some((t) => t.toLowerCase() === selectedTag.toLowerCase());
    return matchesQ && matchesTag;
  });

  return (
    <div className="min-h-screen flex flex-col text-slate-900">
      <Navbar />
      <main className="flex-1 pt-24 pb-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full space-y-10">
        <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6">
          <div className="space-y-2 max-w-2xl">
            <p className="text-xs font-semibold tracking-wider text-blue-700">
              AI Destination Discovery · {DESTINATIONS.length} Curated Regions + Worldwide Search
            </p>
            <h1 className="text-3xl sm:text-4xl font-bold tracking-tight text-slate-950">
              Explore{' '}
              <span className="font-serif italic font-medium">curated regions</span> or search anywhere with AI
            </h1>
            <p className="text-sm sm:text-base text-slate-600">
              Filter our 12 global escapes or describe any place, climate, or vibe below for live AI-suggested destinations and hidden gems.
            </p>
          </div>

          <form
            onSubmit={(e) => {
              e.preventDefault();
              void runAiPlaceSearch(query);
            }}
            className="flex items-center gap-2 w-full lg:w-[440px]"
          >
            <div className="relative flex-1">
              <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" aria-hidden="true" />
              <label htmlFor="explore-search" className="sr-only">
                Search places or ask AI for destination suggestions
              </label>
              <input
                id="explore-search"
                type="search"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search Santorini, Iceland, quiet tea hills…"
                className="w-full pl-10 pr-4 py-2.5 rounded-full liquid-glass text-sm text-slate-900 placeholder:text-slate-400"
              />
            </div>
            <button
              type="submit"
              disabled={aiLoading || !query.trim()}
              className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-full bg-blue-600 text-white text-xs font-semibold hover:bg-blue-700 disabled:opacity-50 whitespace-nowrap shrink-0 cursor-pointer shadow-xs"
            >
              {aiLoading ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Sparkles className="w-3.5 h-3.5" />}
              <span>AI Suggest</span>
            </button>
          </form>
        </div>

        {/* AI Suggestion Discovery Bar */}
        <section className="rounded-3xl liquid-glass p-5 space-y-4">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div className="flex items-center gap-2 text-xs font-semibold text-blue-700">
              <Sparkles className="w-4 h-4" aria-hidden="true" />
              <span>AI Place Suggestion Search</span>
            </div>
            <div className="flex flex-wrap items-center gap-2">
              {AI_PLACE_PROMPTS.map((prompt) => (
                <button
                  key={prompt}
                  type="button"
                  onClick={() => {
                    setQuery(prompt);
                    void runAiPlaceSearch(prompt);
                  }}
                  className="px-3 py-1.5 rounded-full liquid-glass-chip text-xs font-medium text-slate-700 hover:text-blue-700 cursor-pointer"
                >
                  {prompt}
                </button>
              ))}
            </div>
          </div>

          {aiLoading && (
            <div className="flex items-center gap-2.5 text-xs font-medium text-blue-700 pt-1">
              <Loader2 className="w-4 h-4 animate-spin" />
              <span>Searching the web & curating place suggestions for "{query}"…</span>
            </div>
          )}

          {aiPlaces && (
            <div className="pt-3 border-t border-white/75 space-y-4">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <span className="text-xs font-semibold text-blue-700">{aiPlaces.providerLabel}</span>
                <button
                  type="button"
                  onClick={() => setAiPlaces(null)}
                  className="text-xs font-medium text-slate-500 hover:text-slate-900 cursor-pointer"
                >
                  Clear AI Results
                </button>
              </div>
              <p className="text-sm text-slate-700 leading-relaxed">{aiPlaces.summary}</p>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {aiPlaces.places.map((p, idx) => (
                  <div
                    key={idx}
                    className="rounded-2xl liquid-glass-subtle p-4 flex flex-col justify-between gap-3"
                  >
                    <div className="space-y-1.5">
                      <p className="text-xs font-medium text-blue-700">
                        {p.countryOrRegion} · {p.bestSeason}
                      </p>
                      <h3 className="text-base font-bold text-slate-950">{p.name}</h3>
                      <p className="text-xs text-slate-600 leading-relaxed">{p.tagline}</p>
                      {p.highlights.length > 0 && (
                        <p className="text-xs text-slate-700 pt-1">
                          <span className="font-semibold">Spots:</span> {p.highlights.join(' · ')}
                        </p>
                      )}
                    </div>
                    <div className="pt-2 border-t border-white/70 flex items-center justify-between gap-2">
                      <span className="text-xs font-semibold text-slate-900 tabular-nums">
                        {p.indicativeDailyBudget}
                      </span>
                      <div className="flex items-center gap-2">
                        <a
                          href={p.mapsUrl}
                          target="_blank"
                          rel="noreferrer"
                          className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-full liquid-glass-chip text-xs font-semibold text-slate-700 hover:text-blue-700"
                        >
                          <MapPin className="w-3 h-3" />
                          <span>Map</span>
                        </a>
                        <Link
                          to={`/plan?destination=${encodeURIComponent(p.name)}`}
                          className="inline-flex items-center gap-1 px-3 py-1.5 rounded-full bg-slate-950 text-white text-xs font-semibold hover:bg-slate-800"
                        >
                          <span>Plan</span>
                          <ArrowRight className="w-3 h-3" />
                        </Link>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </section>

        {/* Segmented Filter Tabs */}
        <div className="flex items-center gap-2 overflow-x-auto pb-1">
          {tags.map((tag) => (
            <button
              key={tag}
              type="button"
              onClick={() => setSelectedTag(tag)}
              className={`px-4 py-2 rounded-full text-xs font-semibold whitespace-nowrap shrink-0 transition-all cursor-pointer ${
                selectedTag === tag
                  ? 'bg-slate-950 text-white shadow-xs'
                  : 'liquid-glass-chip text-slate-700 hover:text-slate-950'
              }`}
            >
              {tag}
            </button>
          ))}
        </div>

        {filtered.length === 0 ? (
          <div className="rounded-3xl liquid-glass p-10 text-center space-y-3">
            <p className="text-base font-semibold text-slate-900">
              No curated catalog cards matched "{query}" — check the AI Place Suggestions above or plan it directly!
            </p>
            <div className="flex flex-wrap items-center justify-center gap-3">
              <Link
                to={`/plan?destination=${encodeURIComponent(query)}`}
                className="px-5 py-2.5 rounded-full bg-blue-600 text-white text-xs font-semibold hover:bg-blue-700"
              >
                Plan "{query}" with AI
              </Link>
              <button
                type="button"
                onClick={() => {
                  setQuery('');
                  setSelectedTag('All');
                }}
                className="px-4 py-2.5 rounded-full liquid-glass-chip text-slate-800 text-xs font-semibold cursor-pointer"
              >
                Show All 12 Curated Regions
              </button>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filtered.map((dest) => {
              const isSaved = savedIds.includes(dest.id);
              return (
                <article
                  key={dest.id}
                  className="group rounded-[28px] liquid-glass overflow-hidden flex flex-col justify-between transition-all duration-200 hover:-translate-y-1 hover:shadow-xl"
                >
                  <div>
                    <div className="relative h-60 overflow-hidden bg-slate-200">
                      <img
                        src={getMediaUrl(dest.mediaKey)}
                        alt={`${dest.name}, ${dest.country}`}
                        referrerPolicy="no-referrer"
                        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                      />
                      <div
                        aria-hidden="true"
                        className="absolute inset-0 bg-gradient-to-t from-slate-950/65 via-slate-950/15 to-transparent"
                      />
                      <span className="absolute top-3.5 left-3.5 px-3 py-1 rounded-full liquid-glass-chip text-xs font-semibold text-slate-900">
                        {dest.region}
                      </span>
                      <button
                        type="button"
                        onClick={() => toggleSave(dest.id)}
                        aria-label={isSaved ? `Remove ${dest.name} from saved` : `Save ${dest.name}`}
                        className={`absolute top-3.5 right-3.5 w-10 h-10 rounded-full inline-flex items-center justify-center backdrop-blur-md border transition-colors cursor-pointer ${
                          isSaved
                            ? 'bg-blue-600 text-white border-blue-500'
                            : 'bg-white/80 text-slate-800 border-white/80 hover:bg-white'
                        }`}
                      >
                        <Bookmark className="w-4 h-4" />
                      </button>

                      <div className="absolute bottom-3.5 left-4 right-4 flex items-end justify-between text-white">
                        <div>
                          <p className="text-xs font-medium text-blue-100">
                            {dest.country} · {dest.recommendedDays} days
                          </p>
                          <h2 className="text-2xl font-bold tracking-tight">{dest.name}</h2>
                        </div>
                        <span className="px-2.5 py-1 rounded-full bg-white/20 backdrop-blur-md border border-white/30 text-xs font-semibold tabular-nums">
                          {dest.currencyCode}
                        </span>
                      </div>
                    </div>

                    <div className="p-5 space-y-3">
                      <p className="text-sm text-slate-600 leading-relaxed line-clamp-2">{dest.tagline}</p>
                      <p className="text-xs text-slate-500">
                        Best season: <span className="font-medium text-slate-700">{dest.bestSeason}</span>
                      </p>
                    </div>
                  </div>

                  <div className="px-5 pb-5 pt-3 border-t border-white/75 flex items-center justify-between gap-3">
                    <span className="text-xs font-semibold text-slate-900 tabular-nums">
                      From ₹{dest.dailyBudgetInr.balanced.toLocaleString()}/day
                    </span>
                    <Link
                      to={`/explore/${dest.slug}`}
                      className="inline-flex items-center gap-1.5 px-4 py-2 rounded-full bg-slate-950 text-white text-xs font-semibold hover:bg-blue-600 transition-colors whitespace-nowrap"
                    >
                      <span>View Guide</span>
                      <ArrowRight className="w-3.5 h-3.5" aria-hidden="true" />
                    </Link>
                  </div>
                </article>
              );
            })}
          </div>
        )}
      </main>
      <Footer />
    </div>
  );
}

function DestinationDetailView({
  slug,
  savedIds,
  onToggleSave,
}: {
  slug: string;
  savedIds: string[];
  onToggleSave: (id: string) => void;
}) {
  const [dest, setDest] = useState<Destination | null>(
    DESTINATIONS.find((d) => d.slug === slug || d.id === slug) || null
  );
  const [hotels, setHotels] = useState<HotelOption[]>([]);
  const [transport, setTransport] = useState<TransportLeg[]>([]);
  const [weather, setWeather] = useState<{ currentTempC?: number; humidity?: string; provenance?: string } | null>(null);
  const [research, setResearch] = useState<{
    summary: string;
    sources: ResearchSource[];
    providerLabel: string;
  } | null>(null);
  const [loadingResearch, setLoadingResearch] = useState(false);

  useEffect(() => {
    fetch(`/api/destinations/${slug}`)
      .then((r) => (r.ok ? r.json() : null))
      .then((data) => {
        if (data?.destination) {
          setDest(data.destination);
          setHotels(data.hotels || []);
          setTransport(data.transport || []);
        }
      })
      .catch(() => {});

    fetch(`/api/weather?destinationId=${slug}`)
      .then((r) => r.json())
      .then((w) => setWeather(w))
      .catch(() => {});
  }, [slug]);

  const runLiveResearch = async (targetName?: string) => {
    const destName = targetName || dest?.name;
    if (!destName) return;
    setLoadingResearch(true);
    try {
      const resp = await fetch('/api/ai/research', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          destination: destName,
          focus: 'quiet hidden gems, local transport fares, cafés, and traveller safety',
        }),
      });
      const data = await resp.json();
      setResearch(data);
    } finally {
      setLoadingResearch(false);
    }
  };

  useEffect(() => {
    if (dest?.name) {
      void runLiveResearch(dest.name);
    }
  }, [dest?.id]);

  if (!dest) {
    return (
      <div className="min-h-screen flex flex-col">
        <Navbar />
        <main className="flex-1 pt-28 px-4 text-center space-y-4">
          <h1 className="text-2xl font-bold text-slate-900">Destination not found</h1>
          <Link to="/explore" className="text-blue-700 font-semibold text-sm">
            Back to Explore Destinations
          </Link>
        </main>
        <Footer />
      </div>
    );
  }

  const isSaved = savedIds.includes(dest.id);
  const mapPoints = dest.places.map((p) => ({
    id: p.id,
    label: p.name,
    subtitle: `${p.type} · ${p.bestTime}`,
    lat: p.lat,
    lng: p.lng,
    category: p.crowdLevel,
  }));

  return (
    <div className="min-h-screen flex flex-col text-slate-900">
      <Navbar transparentOverHero />

      <main className="flex-1">
        {/* Full-Width Destination Hero */}
        <section className="relative h-[420px] sm:h-[480px] flex items-end bg-slate-950">
          <img
            src={getMediaUrl(dest.mediaKey)}
            alt={dest.name}
            referrerPolicy="no-referrer"
            className="absolute inset-0 w-full h-full object-cover"
          />
          <div
            aria-hidden="true"
            className="absolute inset-0 bg-gradient-to-t from-slate-950/90 via-slate-950/40 to-slate-950/45"
          />
          <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-10 w-full flex flex-col md:flex-row md:items-end justify-between gap-6 text-white">
            <div className="space-y-2 max-w-2xl">
              <p className="text-xs font-medium text-blue-200">
                {dest.country} · {dest.region} · Best {dest.bestSeason}
              </p>
              <h1 className="text-4xl sm:text-5xl font-bold tracking-tight">{dest.name}</h1>
              <p className="text-base text-slate-200">{dest.tagline}</p>
            </div>
            <div className="flex flex-wrap items-center gap-3">
              <button
                type="button"
                onClick={() => onToggleSave(dest.id)}
                className="px-4 py-2.5 rounded-full bg-white/15 backdrop-blur-md border border-white/25 text-xs font-semibold hover:bg-white/25 cursor-pointer"
              >
                {isSaved ? 'Saved Destination' : 'Save Destination'}
              </button>
              <Link
                to={`/plan?origin=Kolkata&destination=${encodeURIComponent(dest.name)}&days=${dest.recommendedDays}&budget=${dest.dailyBudgetInr.balanced * dest.recommendedDays * 2}&travellers=2`}
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-white text-slate-950 text-xs font-semibold hover:bg-slate-100"
              >
                <span>Plan Journey to {dest.name}</span>
                <ArrowRight className="w-4 h-4" aria-hidden="true" />
              </Link>
            </div>
          </div>
        </section>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-12">
          {/* Overview + Weather + Live Research */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            <div className="lg:col-span-8 rounded-3xl liquid-glass p-6 sm:p-8 space-y-5">
              <h2 className="text-xl font-bold text-slate-950">Destination Overview</h2>
              <p className="text-sm sm:text-base text-slate-600 leading-relaxed">{dest.description}</p>

              <div className="pt-4 border-t border-white/75 flex flex-wrap items-center justify-between gap-4">
                <div>
                  <h3 className="text-sm font-semibold text-slate-900">AI Live Web Research Brief</h3>
                  <p className="text-xs text-slate-500">
                    Grounded travel insights, hidden gems, and safety context
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => void runLiveResearch()}
                  disabled={loadingResearch}
                  className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-blue-600 text-white text-xs font-semibold hover:bg-blue-700 disabled:opacity-50 cursor-pointer"
                >
                  <Sparkles className="w-3.5 h-3.5" aria-hidden="true" />
                  <span>{loadingResearch ? 'Researching…' : `Refresh ${dest.name} Brief`}</span>
                </button>
              </div>

              {research && (
                <div className="rounded-2xl liquid-glass-subtle p-4 space-y-3">
                  <p className="text-xs font-semibold text-blue-700">{research.providerLabel}</p>
                  <p className="text-sm text-slate-700 leading-relaxed whitespace-pre-line">
                    {research.summary}
                  </p>
                  {research.sources.length > 0 && (
                    <div className="pt-2 border-t border-white/70 space-y-1.5">
                      <p className="text-xs font-semibold text-slate-600">Sources</p>
                      <div className="flex flex-wrap gap-3">
                        {research.sources.map((src, i) => (
                          <a
                            key={i}
                            href={src.url}
                            target="_blank"
                            rel="noreferrer"
                            className="inline-flex items-center gap-1 text-xs font-medium text-blue-700 hover:underline"
                          >
                            <span>{src.title}</span>
                            <ExternalLink className="w-3 h-3" />
                          </a>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>

            <div className="lg:col-span-4 space-y-6">
              <div className="rounded-3xl liquid-glass p-6 space-y-3">
                <div className="flex items-center justify-between">
                  <h3 className="text-base font-semibold text-slate-900">Weather Snapshot</h3>
                  <CloudSun className="w-5 h-5 text-blue-600" aria-hidden="true" />
                </div>
                {weather?.currentTempC !== undefined ? (
                  <p className="text-3xl font-bold tabular-nums tracking-tight text-slate-950">
                    {weather.currentTempC}°C
                  </p>
                ) : (
                  <p className="text-2xl font-bold tabular-nums tracking-tight text-slate-950">
                    {dest.weatherSummary.tempRangeC}
                  </p>
                )}
                <p className="text-sm text-slate-600">{dest.weatherSummary.condition}</p>
                <p className="text-xs text-slate-500">
                  Humidity: {weather?.humidity || dest.weatherSummary.humidity} · {dest.weatherSummary.advisory}
                </p>
              </div>

              <div className="rounded-3xl liquid-glass p-6 space-y-3">
                <h3 className="text-base font-semibold text-slate-900">Indicative Daily Budget</h3>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-slate-600">Budget style</span>
                    <span className="font-semibold tabular-nums text-slate-950">
                      ₹{dest.dailyBudgetInr.budget.toLocaleString()}/day
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-600">Balanced boutique</span>
                    <span className="font-semibold tabular-nums text-slate-950">
                      ₹{dest.dailyBudgetInr.balanced.toLocaleString()}/day
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-600">Luxury retreat</span>
                    <span className="font-semibold tabular-nums text-slate-950">
                      ₹{dest.dailyBudgetInr.luxury.toLocaleString()}/day
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Interactive Google Map */}
          <InteractiveTripMap title={`${dest.name} Attractions & Hidden Gems`} points={mapPoints} />

          {/* Places & Hidden Gems */}
          <div className="space-y-4">
            <h2 className="text-xl font-bold text-slate-950">Attractions, Hidden Gems & Cafés</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {dest.places.map((p) => (
                <div key={p.id} className="rounded-2xl liquid-glass p-5 space-y-2">
                  <p className="text-xs font-medium text-blue-700">
                    {p.type} · {p.crowdLevel} · {p.bestTime}
                  </p>
                  <h3 className="text-base font-semibold text-slate-900">{p.name}</h3>
                  <p className="text-xs text-slate-600 leading-relaxed">{p.description}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Recommended Stays & Transport */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="rounded-3xl liquid-glass p-6 space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-bold text-slate-950">Recommended Stays</h3>
                <Link to="/stays" className="text-xs font-semibold text-blue-700">
                  Compare All
                </Link>
              </div>
              <div className="space-y-3">
                {hotels.slice(0, 3).map((h) => (
                  <div key={h.id} className="rounded-2xl liquid-glass-subtle p-4 space-y-1.5">
                    <div className="flex items-center justify-between gap-2">
                      <h4 className="text-sm font-semibold text-slate-900">{h.name}</h4>
                      <span className="text-xs font-semibold text-slate-900 tabular-nums">
                        ₹{h.pricePerNightInr.toLocaleString()}/night
                      </span>
                    </div>
                    <p className="text-xs text-slate-500 tabular-nums">
                      {h.area} · {h.rating} ({h.reviewCount} reviews) · {h.availabilityStatus}
                    </p>
                    <p className="text-xs text-slate-600">{h.recommendationReason}</p>
                  </div>
                ))}
              </div>
            </div>

            <div className="rounded-3xl liquid-glass p-6 space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-bold text-slate-950">Local Transport Options</h3>
                <Link to="/transport" className="text-xs font-semibold text-blue-700">
                  All Routes
                </Link>
              </div>
              <div className="space-y-3">
                {transport.map((t) => (
                  <div key={t.id} className="rounded-2xl liquid-glass-subtle p-4 space-y-1">
                    <div className="flex items-center justify-between gap-2">
                      <span className="text-sm font-semibold text-slate-900">{t.mode}</span>
                      <span className="text-xs font-semibold text-slate-900 tabular-nums">
                        {t.estimatedFareInr === 0 ? 'Free' : `~₹${t.estimatedFareInr.toLocaleString()}`}
                      </span>
                    </div>
                    <p className="text-xs text-slate-700">{t.route}</p>
                    <p className="text-xs text-slate-500 tabular-nums">
                      {t.durationMinutes} min · {t.distanceKm} km · {t.availabilityStatus}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Currency & Language Tools */}
          <CurrencyLanguageTools
            destinationCurrency={dest.currencyCode}
            languageName={dest.languageName}
            phrases={dest.phrases}
          />
        </div>
      </main>

      <Footer />
    </div>
  );
}
