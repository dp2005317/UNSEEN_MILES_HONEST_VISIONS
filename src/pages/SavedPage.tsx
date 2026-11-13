import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Trash2 } from 'lucide-react';
import { DESTINATIONS, HOTELS } from '../data/catalog';
import { getMediaUrl } from '../data/media';
import type { Itinerary } from '../types/travel';
import { Navbar } from '../components/layout/Navbar';
import { Footer } from '../components/layout/Footer';

export function SavedPage() {
  const [trips, setTrips] = useState<Itinerary[]>([]);
  const [savedDestIds, setSavedDestIds] = useState<string[]>([]);
  const [savedHotelIds, setSavedHotelIds] = useState<string[]>([]);

  useEffect(() => {
    fetch('/api/trips')
      .then((r) => r.json())
      .then((d) => setTrips(d.trips || []))
      .catch(() => {});
    fetch('/api/saved')
      .then((r) => r.json())
      .then((d) => {
        setSavedDestIds(d.destinationIds || []);
        setSavedHotelIds(d.hotelIds || []);
      })
      .catch(() => {});
  }, []);

  const handleDeleteTrip = async (id: string) => {
    await fetch(`/api/trips/${id}`, { method: 'DELETE' });
    setTrips((prev) => prev.filter((t) => t.id !== id));
  };

  const savedDestinations = DESTINATIONS.filter((d) => savedDestIds.includes(d.id));
  const savedHotels = HOTELS.filter((h) => savedHotelIds.includes(h.id));

  return (
    <div className="min-h-screen flex flex-col text-slate-900">
      <Navbar />

      <main className="flex-1 pt-24 pb-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full space-y-12">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
          <div>
            <p className="text-xs font-semibold tracking-wider text-blue-700">Traveller Library</p>
            <h1 className="text-3xl sm:text-4xl font-bold tracking-tight text-slate-950 mt-1">
              Saved Journeys & Bookmarks
            </h1>
          </div>
          <Link
            to="/plan"
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-slate-950 text-white text-xs font-semibold hover:bg-slate-800 whitespace-nowrap"
          >
            <span>Plan Another Journey</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        {/* Saved Trips */}
        <section className="space-y-4">
          <h2 className="text-xl font-bold text-slate-950 tabular-nums">Saved Itineraries ({trips.length})</h2>
          {trips.length === 0 ? (
            <div className="rounded-3xl liquid-glass p-8 text-center space-y-3">
              <p className="text-sm text-slate-600">No saved trips yet.</p>
              <Link to="/plan" className="text-xs font-semibold text-blue-700">
                Open AI Planner to create your first journey
              </Link>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {trips.map((t) => (
                <article
                  key={t.id}
                  className="rounded-3xl liquid-glass p-6 flex flex-col justify-between space-y-4"
                >
                  <div className="space-y-2">
                    <p className="text-xs font-semibold text-blue-700 tabular-nums">
                      {t.origin} → {t.destination} · {t.durationDays} days
                    </p>
                    <h3 className="text-lg font-bold text-slate-950">{t.tripName}</h3>
                    <p className="text-xs text-slate-600 tabular-nums">
                      {t.travellers} travellers · Est. {t.currency} {t.estimatedTotal.toLocaleString()}
                    </p>
                  </div>
                  <div className="pt-3 border-t border-white/75 flex items-center justify-between gap-3">
                    <Link
                      to={`/trip/${t.id}`}
                      className="inline-flex items-center gap-1.5 text-xs font-semibold text-blue-700 hover:text-blue-800"
                    >
                      <span>Open Dashboard</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </Link>
                    <button
                      type="button"
                      onClick={() => handleDeleteTrip(t.id)}
                      aria-label={`Delete ${t.tripName}`}
                      className="p-2 rounded-full text-slate-400 hover:text-red-600 hover:bg-red-50 cursor-pointer"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </article>
              ))}
            </div>
          )}
        </section>

        {/* Saved Destinations */}
        <section className="space-y-4">
          <h2 className="text-xl font-bold text-slate-950 tabular-nums">
            Bookmarked Destinations ({savedDestinations.length})
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {savedDestinations.map((d) => (
              <Link
                key={d.id}
                to={`/explore/${d.slug}`}
                className="rounded-3xl liquid-glass overflow-hidden hover:shadow-lg transition-all hover:-translate-y-0.5"
              >
                <img
                  src={getMediaUrl(d.mediaKey)}
                  alt={d.name}
                  referrerPolicy="no-referrer"
                  className="w-full h-44 object-cover"
                />
                <div className="p-5">
                  <p className="text-xs text-slate-500">{d.country}</p>
                  <h3 className="text-lg font-bold text-slate-950 mt-0.5">{d.name}</h3>
                </div>
              </Link>
            ))}
          </div>
        </section>

        {/* Saved Stays */}
        <section className="space-y-4">
          <h2 className="text-xl font-bold text-slate-950 tabular-nums">Saved Stays ({savedHotels.length})</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {savedHotels.map((h) => (
              <div key={h.id} className="rounded-3xl liquid-glass p-5 space-y-2">
                <p className="text-xs text-slate-500">
                  {h.area} · {h.tier}
                </p>
                <h3 className="text-base font-bold text-slate-950">{h.name}</h3>
                <p className="text-xs font-bold text-blue-700 tabular-nums">
                  ₹{h.pricePerNightInr.toLocaleString()}/night · {h.rating}★
                </p>
              </div>
            ))}
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
