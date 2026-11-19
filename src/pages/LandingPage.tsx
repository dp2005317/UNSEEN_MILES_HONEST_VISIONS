import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ArrowLeft, ArrowRight, Compass, MapPin, ShieldCheck, Sparkles, Wallet } from 'lucide-react';
import { DESTINATIONS } from '../data/catalog';
import { getMediaUrl } from '../data/media';
import { Navbar } from '../components/layout/Navbar';
import { Footer } from '../components/layout/Footer';

export function LandingPage() {
  const navigate = useNavigate();
  const [origin, setOrigin] = useState('Kolkata');
  const [destination, setDestination] = useState('Bali');
  const [departDate, setDepartDate] = useState('2026-12-14');
  const [returnDate, setReturnDate] = useState('2026-12-19');
  const [travellers, setTravellers] = useState('2');
  const [budget, setBudget] = useState('80000');
  const [activeSlide, setActiveSlide] = useState(1);

  const handlePlanSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const start = new Date(departDate);
    const end = new Date(returnDate);
    const diffDays =
      !Number.isNaN(start.getTime()) && !Number.isNaN(end.getTime()) && end > start
        ? Math.min(21, Math.max(2, Math.round((end.getTime() - start.getTime()) / 86400000)))
        : 5;

    const params = new URLSearchParams({
      origin: origin.trim() || 'Kolkata',
      destination: destination.trim() || 'Bali',
      days: String(diffDays),
      travellers: travellers || '2',
      budget: budget || '80000',
    });
    navigate(`/plan?${params.toString()}`);
  };

  const prevSlide = () => setActiveSlide((i) => (i - 1 + DESTINATIONS.length) % DESTINATIONS.length);
  const nextSlide = () => setActiveSlide((i) => (i + 1) % DESTINATIONS.length);

  const visibleIndices = [
    (activeSlide - 1 + DESTINATIONS.length) % DESTINATIONS.length,
    activeSlide,
    (activeSlide + 1) % DESTINATIONS.length,
  ];

  return (
    <div className="min-h-screen flex flex-col text-slate-900">
      <Navbar transparentOverHero />

      <main className="flex-1">
        {/* Hero Section */}
        <section className="relative min-h-[680px] lg:min-h-[760px] flex items-center pt-20 pb-12 sm:pt-24 sm:pb-16 overflow-hidden bg-slate-950">
          <img
            src={getMediaUrl('hero_alpine')}
            alt="Sunlit alpine peaks rising above calm valley mist at dawn"
            referrerPolicy="no-referrer"
            className="absolute inset-0 w-full h-full object-cover object-center"
          />
          <div
            aria-hidden="true"
            className="absolute inset-0 bg-gradient-to-b from-slate-950/65 via-slate-900/40 to-slate-950/75"
          />

          <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
            <div className="max-w-3xl mx-auto text-center space-y-3.5 sm:space-y-5">
              <p className="text-xs sm:text-sm font-medium tracking-wide text-blue-100">
                Every mile planned, even the unseen ones
              </p>
              <h1 className="text-3xl sm:text-5xl lg:text-6xl font-bold tracking-tight text-white leading-[1.08]">
                Travel{' '}
                <span className="font-serif italic font-medium text-blue-100">
                  Beyond the Ordinary.
                </span>
              </h1>
              <p className="text-sm sm:text-lg text-slate-100 max-w-2xl mx-auto leading-relaxed">
                Your personal AI travel concierge. From live flight & stay web search to crowd-conscious itineraries, Google Maps routes, and direct booking links.
              </p>
            </div>

            {/* Liquid Glass Trip Planning Card */}
            <form
              onSubmit={handlePlanSubmit}
              className="mt-6 sm:mt-10 max-w-5xl mx-auto rounded-3xl bg-white/84 backdrop-blur-2xl border border-white/90 shadow-2xl p-4 sm:p-6"
            >
              <div className="grid grid-cols-2 lg:grid-cols-6 gap-2.5 sm:gap-3.5">
                <div className="col-span-1">
                  <label htmlFor="hero-origin" className="block text-xs font-semibold text-slate-700 mb-1">
                    Starting from
                  </label>
                  <input
                    id="hero-origin"
                    type="text"
                    required
                    value={origin}
                    onChange={(e) => setOrigin(e.target.value)}
                    placeholder="Kolkata"
                    className="w-full px-3 py-2 sm:px-3.5 sm:py-2.5 rounded-xl bg-white/75 border border-white/90 text-sm text-slate-900 font-medium"
                  />
                </div>

                <div className="col-span-1">
                  <label htmlFor="hero-destination" className="block text-xs font-semibold text-slate-700 mb-1">
                    Destination
                  </label>
                  <input
                    id="hero-destination"
                    type="text"
                    required
                    list="hero-dest-list"
                    value={destination}
                    onChange={(e) => setDestination(e.target.value)}
                    placeholder="London, Bali, Paris, Tokyo, New York…"
                    className="w-full px-3 py-2 sm:px-3.5 sm:py-2.5 rounded-xl bg-white/75 border border-white/90 text-sm text-slate-900 font-medium"
                  />
                  <datalist id="hero-dest-list">
                    {DESTINATIONS.map((d) => (
                      <option key={d.id} value={d.name}>
                        {d.name}, {d.country}
                      </option>
                    ))}
                    <option value="Rome">Rome, Italy</option>
                    <option value="Barcelona">Barcelona, Spain</option>
                    <option value="Amsterdam">Amsterdam, Netherlands</option>
                    <option value="Dubai">Dubai, UAE</option>
                    <option value="Singapore">Singapore</option>
                    <option value="Sydney">Sydney, Australia</option>
                  </datalist>
                </div>

                <div>
                  <label htmlFor="hero-depart" className="block text-xs font-semibold text-slate-700 mb-1">
                    Departure
                  </label>
                  <input
                    id="hero-depart"
                    type="date"
                    value={departDate}
                    onChange={(e) => setDepartDate(e.target.value)}
                    className="w-full px-2.5 py-2 sm:px-3 sm:py-2.5 rounded-xl bg-white/75 border border-white/90 text-xs sm:text-sm text-slate-900 font-sans tabular-nums"
                  />
                </div>

                <div>
                  <label htmlFor="hero-return" className="block text-xs font-semibold text-slate-700 mb-1">
                    Return
                  </label>
                  <input
                    id="hero-return"
                    type="date"
                    value={returnDate}
                    onChange={(e) => setReturnDate(e.target.value)}
                    className="w-full px-2.5 py-2 sm:px-3 sm:py-2.5 rounded-xl bg-white/75 border border-white/90 text-xs sm:text-sm text-slate-900 font-sans tabular-nums"
                  />
                </div>

                <div>
                  <label htmlFor="hero-travellers" className="block text-xs font-semibold text-slate-700 mb-1">
                    Travellers
                  </label>
                  <select
                    id="hero-travellers"
                    value={travellers}
                    onChange={(e) => setTravellers(e.target.value)}
                    className="w-full px-2.5 py-2 sm:px-3 sm:py-2.5 rounded-xl bg-white/75 border border-white/90 text-sm text-slate-900 font-medium"
                  >
                    {[1, 2, 3, 4, 5, 6].map((n) => (
                      <option key={n} value={n}>
                        {n} {n === 1 ? 'Traveller' : 'Travellers'}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label htmlFor="hero-budget" className="block text-xs font-semibold text-slate-700 mb-1">
                    Budget (INR)
                  </label>
                  <input
                    id="hero-budget"
                    type="number"
                    min={15000}
                    step={5000}
                    value={budget}
                    onChange={(e) => setBudget(e.target.value)}
                    className="w-full px-3 py-2 sm:px-3.5 sm:py-2.5 rounded-xl bg-white/75 border border-white/90 text-sm text-slate-900 font-sans tabular-nums font-semibold"
                  />
                </div>
              </div>

              <div className="mt-4 pt-4 border-t border-slate-200/70 flex flex-col sm:flex-row items-center justify-between gap-3">
                <p className="text-xs text-slate-600">
                  Live AI web search · Real Google Maps routes · Direct flight & stay booking links
                </p>
                <div className="flex items-center gap-3 w-full sm:w-auto justify-end">
                  <Link
                    to="/explore"
                    className="px-4 py-2.5 rounded-full text-xs font-semibold text-slate-700 hover:text-blue-700 hover:bg-white/70 transition-colors whitespace-nowrap"
                  >
                    AI Place Search
                  </Link>
                  <button
                    type="submit"
                    className="inline-flex items-center gap-3 pl-5 pr-2 py-2 rounded-full bg-slate-950 text-white text-sm font-semibold hover:bg-slate-800 transition-colors whitespace-nowrap shrink-0 cursor-pointer"
                  >
                    <span>Plan My Journey</span>
                    <span className="w-7 h-7 rounded-full bg-blue-600 text-white inline-flex items-center justify-center">
                      <ArrowRight className="w-4 h-4" aria-hidden="true" />
                    </span>
                  </button>
                </div>
              </div>
            </form>
          </div>
        </section>

        {/* Liquid Glass Destination Showcase */}
        <section className="py-20">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center max-w-2xl mx-auto space-y-3">
              <p className="text-xs font-semibold tracking-wider text-blue-700">
                12 Global Escapes
              </p>
              <h2 className="text-3xl sm:text-4xl font-bold tracking-tight text-slate-950">
                Discover{' '}
                <span className="font-serif italic font-medium text-slate-800">
                  Our Most Popular
                </span>{' '}
                Journeys
              </h2>
              <p className="text-sm sm:text-base text-slate-600">
                Frosted clarity for every destination—seasonal windows, quiet neighborhoods, and transparent daily budgets.
              </p>
            </div>

            {/* Interactive 3-Card Liquid Glass Fanned Carousel */}
            <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-6 items-center">
              {visibleIndices.map((destIdx, pos) => {
                const dest = DESTINATIONS[destIdx];
                const isCenter = pos === 1;
                return (
                  <article
                    key={dest.id}
                    className={`group rounded-[28px] liquid-glass overflow-hidden transition-all duration-300 ${
                      isCenter
                        ? 'shadow-2xl md:scale-[1.03] z-10'
                        : 'hidden md:block opacity-92 hover:opacity-100'
                    }`}
                  >
                    <div className="relative h-64 overflow-hidden bg-slate-200">
                      <img
                        src={getMediaUrl(dest.mediaKey)}
                        alt={`${dest.name}, ${dest.country}`}
                        referrerPolicy="no-referrer"
                        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                      />
                      <div
                        aria-hidden="true"
                        className="absolute inset-0 bg-gradient-to-t from-slate-950/70 via-slate-950/15 to-transparent"
                      />
                      <span className="absolute top-4 left-4 px-3 py-1 rounded-full liquid-glass-chip text-xs font-semibold text-slate-900">
                        {dest.region}
                      </span>
                      <div className="absolute bottom-4 left-5 right-5 text-white">
                        <p className="text-xs text-blue-100 font-medium">
                          {dest.country} · {dest.recommendedDays} days
                        </p>
                        <h3 className="text-2xl font-bold tracking-tight mt-0.5">{dest.name}</h3>
                      </div>
                    </div>

                    <div className="p-5 space-y-4">
                      <p className="text-sm text-slate-600 leading-relaxed line-clamp-2">
                        {dest.tagline}
                      </p>
                      <div className="flex items-center justify-between text-xs text-slate-600 pt-2 border-t border-white/75">
                        <span>Best: {dest.bestSeason.split('&')[0].trim()}</span>
                        <span className="font-sans font-bold text-slate-950 tabular-nums">
                          From ₹{dest.dailyBudgetInr.budget.toLocaleString()}/day
                        </span>
                      </div>
                      <Link
                        to={`/explore/${dest.slug}`}
                        className={`w-full inline-flex items-center justify-center gap-2 py-2.5 px-4 rounded-full text-sm font-semibold transition-colors ${
                          isCenter
                            ? 'bg-slate-950 text-white hover:bg-blue-600'
                            : 'liquid-glass-chip text-slate-900 hover:text-blue-700'
                        }`}
                      >
                        <span>Explore {dest.name}</span>
                        <ArrowRight className="w-4 h-4" aria-hidden="true" />
                      </Link>
                    </div>
                  </article>
                );
              })}
            </div>

            {/* Carousel Controls */}
            <div className="mt-8 flex items-center justify-center gap-6">
              <button
                type="button"
                onClick={prevSlide}
                aria-label="Previous destination"
                className="w-11 h-11 rounded-full liquid-glass text-slate-700 hover:text-blue-700 inline-flex items-center justify-center cursor-pointer"
              >
                <ArrowLeft className="w-4 h-4" />
              </button>
              <Link
                to="/explore"
                className="text-sm font-semibold text-slate-800 hover:text-blue-700 transition-colors"
              >
                View All {DESTINATIONS.length} Destinations & AI Search
              </Link>
              <button
                type="button"
                onClick={nextSlide}
                aria-label="Next destination"
                className="w-11 h-11 rounded-full liquid-glass text-slate-700 hover:text-blue-700 inline-flex items-center justify-center cursor-pointer"
              >
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </section>

        {/* Editorial Split Intro + Light Liquid Glass Bento Grid */}
        <section className="py-20">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-end">
              <div className="lg:col-span-5">
                <p className="text-xs font-semibold tracking-wider text-blue-700">
                  Why Unseen Miles
                </p>
                <h2 className="text-3xl sm:text-4xl font-bold tracking-tight text-slate-950 mt-2">
                  Thoughtful planning for travellers who want{' '}
                  <span className="font-serif italic font-medium">more than a standard trip.</span>
                </h2>
              </div>
              <p className="lg:col-span-7 text-base text-slate-600 leading-relaxed max-w-2xl">
                Instead of juggling ten browser tabs for flights, stays, local transit, currency conversions, and maps, Unseen Miles orchestrates everything in a luminous workspace with live web search and direct partner booking links.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-stretch">
              {/* Card 1: Sapphire Frosted Liquid Glass */}
              <div className="rounded-[28px] bg-gradient-to-br from-blue-600/90 via-indigo-600/88 to-blue-700/92 backdrop-blur-2xl border border-white/40 text-white p-7 flex flex-col justify-between min-h-[300px] shadow-xl">
                <div className="space-y-4">
                  <div className="w-10 h-10 rounded-xl bg-white/15 border border-white/30 inline-flex items-center justify-center text-white">
                    <Compass className="w-5 h-5" aria-hidden="true" />
                  </div>
                  <h3 className="text-xl font-semibold leading-snug">
                    One intelligent concierge. Every detail connected.
                  </h3>
                  <p className="text-sm text-blue-100 leading-relaxed">
                    Ask for coastal serenity, alpine rail loops, or lower hotel tiers—your itinerary, interactive Google Map, budget, and booking links update together.
                  </p>
                </div>
                <Link
                  to="/plan"
                  className="mt-6 inline-flex items-center justify-center gap-2 py-3 px-5 rounded-full bg-white text-slate-950 text-sm font-semibold hover:bg-blue-50 transition-colors"
                >
                  <span>Start Tailored Planning</span>
                  <ArrowRight className="w-4 h-4" aria-hidden="true" />
                </Link>
              </div>

              {/* Card 2: Full-bleed Architectural Stay Card */}
              <div className="relative rounded-[28px] overflow-hidden min-h-[300px] border border-white/85 shadow-lg">
                <img
                  src={getMediaUrl('boutique_villa')}
                  alt="Minimalist luxury mountain lodge terrace at twilight"
                  referrerPolicy="no-referrer"
                  className="absolute inset-0 w-full h-full object-cover"
                />
                <div
                  aria-hidden="true"
                  className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-slate-950/20 to-transparent"
                />
                <div className="relative z-10 h-full p-7 flex flex-col justify-between text-white">
                  <span className="self-start px-3 py-1 rounded-full bg-white/20 backdrop-blur-md border border-white/35 text-xs font-medium">
                    Made for Your Pace
                  </span>
                  <div className="space-y-2">
                    <h3 className="text-xl font-semibold">Ranked Stays with Web Grounding</h3>
                    <p className="text-sm text-slate-200">
                      Every stay recommendation pairs quiet neighborhood scores with live partner rate links.
                    </p>
                  </div>
                </div>
              </div>

              {/* Card 3: Liquid Glass Unified Engine */}
              <div className="rounded-[28px] liquid-glass p-7 flex flex-col justify-between min-h-[300px]">
                <div className="space-y-2">
                  <p className="text-3xl font-bold text-slate-950 font-sans tabular-nums tracking-tight">
                    12 Regions
                  </p>
                  <p className="text-sm font-semibold text-blue-700">Live AI Travel Engine</p>
                  <p className="text-xs text-slate-600 leading-relaxed">
                    Grounded in real geographic coordinates, live web search results, and transparent 8-category budgets.
                  </p>
                </div>

                <div className="space-y-3 pt-4 border-t border-white/75 text-xs">
                  {[
                    { label: 'Live Map Routes', detail: 'Google Maps' },
                    { label: 'Flights & Stays', detail: 'AI Web Search' },
                    { label: 'AI Concierge', detail: 'Direct Booking' },
                  ].map((row) => (
                    <div key={row.label} className="flex items-center justify-between">
                      <span className="font-medium text-slate-700">{row.label}</span>
                      <span className="text-blue-700 font-semibold">{row.detail}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* How Unseen Miles Works + Light Liquid Glass AI Journeys Grid */}
        <section className="py-20">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="rounded-[34px] liquid-glass p-7 sm:p-12 space-y-14">
              {/* Three Steps */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8 pb-12 border-b border-white/80">
                {[
                  {
                    num: '01',
                    title: 'Tell us your dream.',
                    desc: 'Share your starting city, travel dates, budget, and preferred pace in natural conversation.',
                    icon: Compass,
                  },
                  {
                    num: '02',
                    title: 'AI searches live options.',
                    desc: 'Gemini combines live web search, ranked boutique stays, flight benchmarks, and interactive Google Maps.',
                    icon: MapPin,
                  },
                  {
                    num: '03',
                    title: 'Book & travel effortlessly.',
                    desc: 'Jump directly to partner portals, track budget categories, and use offline currency & phrase tools.',
                    icon: ShieldCheck,
                  },
                ].map((step) => {
                  const Icon = step.icon;
                  return (
                    <div key={step.num} className="space-y-3">
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-bold text-blue-700 tabular-nums">{step.num}</span>
                        <Icon className="w-4 h-4 text-blue-600" aria-hidden="true" />
                      </div>
                      <h3 className="text-xl font-semibold text-slate-950">{step.title}</h3>
                      <p className="text-sm text-slate-600 leading-relaxed">{step.desc}</p>
                    </div>
                  );
                })}
              </div>

              {/* Curated Starting Points */}
              <div className="space-y-8">
                <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
                  <div>
                    <p className="text-xs font-semibold tracking-wider text-blue-700">
                      Curated Starting Points
                    </p>
                    <h2 className="text-3xl sm:text-4xl font-bold tracking-tight text-slate-950 mt-1.5">
                      Ready-to-customize{' '}
                      <span className="font-serif italic font-medium text-blue-700">
                        AI journeys
                      </span>
                    </h2>
                  </div>
                  <Link
                    to="/explore"
                    className="inline-flex items-center gap-2 text-sm font-semibold text-blue-700 hover:text-blue-900 whitespace-nowrap"
                  >
                    <Sparkles className="w-4 h-4" aria-hidden="true" />
                    <span>Explore all {DESTINATIONS.length} destinations</span>
                    <ArrowRight className="w-4 h-4" aria-hidden="true" />
                  </Link>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {DESTINATIONS.slice(0, 6).map((dest) => (
                    <div
                      key={dest.id}
                      className="rounded-3xl liquid-glass-subtle p-4 flex flex-col justify-between gap-4 hover:border-blue-300/80 transition-all hover:-translate-y-0.5"
                    >
                      <div className="flex gap-4 items-center">
                        <img
                          src={getMediaUrl(dest.mediaKey)}
                          alt={dest.name}
                          referrerPolicy="no-referrer"
                          className="w-24 h-24 rounded-2xl object-cover shrink-0"
                        />
                        <div className="min-w-0 space-y-1">
                          <p className="text-xs text-blue-700 font-semibold tabular-nums">
                            {dest.country} · {dest.recommendedDays} Days
                          </p>
                          <h3 className="text-lg font-bold text-slate-950 truncate">
                            {dest.name}
                          </h3>
                          <p className="text-xs text-slate-600 line-clamp-2">{dest.tagline}</p>
                        </div>
                      </div>

                      <div className="pt-3 border-t border-white/75 flex items-center justify-between gap-3">
                        <span className="text-xs font-semibold text-slate-700 tabular-nums inline-flex items-center gap-1.5">
                          <Wallet className="w-3.5 h-3.5 text-blue-600" aria-hidden="true" />
                          Est. ₹{dest.dailyBudgetInr.balanced.toLocaleString()}/day
                        </span>
                        <Link
                          to={`/plan?origin=Kolkata&destination=${encodeURIComponent(dest.name)}&days=${dest.recommendedDays}&budget=${dest.dailyBudgetInr.balanced * dest.recommendedDays * 2}&travellers=2`}
                          className="inline-flex items-center gap-1.5 px-4 py-2 rounded-full bg-slate-950 text-white text-xs font-semibold hover:bg-blue-600 whitespace-nowrap shrink-0 transition-colors"
                        >
                          <span>Customize</span>
                          <ArrowRight className="w-3.5 h-3.5" aria-hidden="true" />
                        </Link>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
