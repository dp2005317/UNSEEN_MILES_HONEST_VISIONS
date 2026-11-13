import { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import {
  AlertTriangle,
  CalendarDays,
  CheckCircle2,
  ExternalLink,
  MessageSquare,
  Plus,
  Send,
  ShieldAlert,
} from 'lucide-react';
import { DESTINATIONS } from '../data/catalog';
import type { BookingRecord, Itinerary } from '../types/travel';
import { Navbar } from '../components/layout/Navbar';
import { Footer } from '../components/layout/Footer';
import { BudgetPanel } from '../components/budget/BudgetPanel';
import { InteractiveTripMap, activitiesToMapPoints } from '../components/maps/InteractiveTripMap';
import { CurrencyLanguageTools } from '../components/currency/CurrencyLanguageTools';

export function TripDashboardPage() {
  const { tripId } = useParams<{ tripId: string }>();
  const [trip, setTrip] = useState<Itinerary | null>(null);
  const [bookings, setBookings] = useState<BookingRecord[]>([]);
  const [activeTab, setActiveTab] = useState<'itinerary' | 'budget' | 'bookings' | 'essentials' | 'assistant'>(
    'itinerary'
  );
  const [selectedActivityId, setSelectedActivityId] = useState<string | undefined>();
  const [optimizing, setOptimizing] = useState(false);
  const [optChanges, setOptChanges] = useState<string[]>([]);

  const [pendingAction, setPendingAction] = useState<{
    booking: BookingRecord;
    targetStatus: BookingRecord['status'];
  } | null>(null);
  const [actionNotice, setActionNotice] = useState<string | null>(null);

  const [newBookingTitle, setNewBookingTitle] = useState('');
  const [newBookingType, setNewBookingType] = useState<BookingRecord['type']>('Transport');
  const [newBookingRef, setNewBookingRef] = useState('');

  const [assistInput, setAssistInput] = useState('');
  const [assistReply, setAssistReply] = useState<string | null>(null);
  const [assistLoading, setAssistLoading] = useState(false);

  useEffect(() => {
    const id = tripId || 'bali-december-escape';
    fetch(`/api/trips/${id}`)
      .then((r) => (r.ok ? r.json() : null))
      .then((data) => {
        if (data?.trip) setTrip(data.trip);
      })
      .catch(() => {});

    fetch(`/api/bookings?tripId=${id}`)
      .then((r) => r.json())
      .then((data) => setBookings(data.bookings || []))
      .catch(() => {});
  }, [tripId]);

  const handleOptimizeBudget = async (newBudget: number) => {
    if (!trip) return;
    setOptimizing(true);
    try {
      const resp = await fetch('/api/ai/optimize-budget', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ itinerary: trip, newBudget }),
      });
      const data = await resp.json();
      if (resp.ok && data.updated) {
        setTrip(data.updated);
        setOptChanges(data.changes || []);
      }
    } finally {
      setOptimizing(false);
    }
  };

  const handleAddBooking = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!trip || !newBookingTitle.trim()) return;
    const resp = await fetch('/api/bookings', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        tripId: trip.id,
        type: newBookingType,
        title: newBookingTitle.trim(),
        referenceCode: newBookingRef.trim() || undefined,
        currency: trip.currency,
      }),
    });
    const data = await resp.json();
    if (resp.ok && data.booking) {
      setBookings((prev) => [data.booking, ...prev]);
      setNewBookingTitle('');
      setNewBookingRef('');
      setActionNotice(`Added "${data.booking.title}" to your trip organizer.`);
    }
  };

  const confirmPostBookingAction = async () => {
    if (!pendingAction) return;
    const resp = await fetch(`/api/bookings/${pendingAction.booking.id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status: pendingAction.targetStatus, confirmed: true }),
    });
    const data = await resp.json();
    if (resp.ok && data.booking) {
      setBookings((prev) => prev.map((b) => (b.id === data.booking.id ? data.booking : b)));
      setActionNotice(data.note);
    }
    setPendingAction(null);
  };

  const handleAskTripAssistant = async (promptText?: string) => {
    const q = (promptText ?? assistInput).trim();
    if (!q || !trip) return;
    setAssistLoading(true);
    try {
      const resp = await fetch('/api/ai/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: q,
          history: [],
          currentItinerary: trip,
        }),
      });
      const data = await resp.json();
      setAssistReply(
        (data.reply || 'Here is a contextual recommendation for your active trip.').replace(/\*\*/g, '')
      );
      if (!promptText) setAssistInput('');
    } finally {
      setAssistLoading(false);
    }
  };

  if (!trip) {
    return (
      <div className="min-h-screen flex flex-col">
        <Navbar />
        <main className="flex-1 pt-28 max-w-3xl mx-auto px-4 text-center space-y-4">
          <h1 className="text-2xl font-bold text-slate-900">Loading trip dashboard…</h1>
          <p className="text-sm text-slate-600">
            If this trip was not saved yet, generate a journey in the AI Planner.
          </p>
          <Link
            to="/plan"
            className="inline-flex items-center px-5 py-2.5 rounded-full bg-slate-950 text-white text-xs font-semibold"
          >
            Open AI Planner
          </Link>
        </main>
        <Footer />
      </div>
    );
  }

  const destinationObj = DESTINATIONS.find((d) => d.id === trip.destinationId) || DESTINATIONS[0];
  const allActivities = trip.days.flatMap((d) => d.activities);
  const mapPoints = activitiesToMapPoints(allActivities);

  return (
    <div className="min-h-screen flex flex-col text-slate-900">
      <Navbar />

      <main className="flex-1 pt-24 pb-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full space-y-8">
        {/* Light Liquid Glass Trip Overview Header */}
        <section className="rounded-3xl liquid-glass p-6 sm:p-8 space-y-6">
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
            <div className="space-y-1.5">
              <p className="text-xs font-semibold text-blue-700">
                {trip.origin} → {trip.destination} · {trip.travelMonth || destinationObj.bestSeason}
              </p>
              <h1 className="text-3xl sm:text-4xl font-bold tracking-tight text-slate-950">
                {trip.tripName}
              </h1>
              <p className="text-xs text-slate-500">{trip.provenanceNote}</p>
            </div>

            <div className="grid grid-cols-3 gap-4 sm:gap-6 shrink-0">
              <div className="rounded-2xl liquid-glass-subtle px-4 py-3">
                <p className="text-xs text-slate-500">Duration</p>
                <p className="text-xl font-bold tabular-nums tracking-tight text-slate-950 mt-0.5">
                  {trip.durationDays} Days
                </p>
              </div>
              <div className="rounded-2xl liquid-glass-subtle px-4 py-3">
                <p className="text-xs text-slate-500">Travellers</p>
                <p className="text-xl font-bold tabular-nums tracking-tight text-slate-950 mt-0.5">
                  {trip.travellers}
                </p>
              </div>
              <div className="rounded-2xl bg-blue-50/85 border border-blue-200/70 px-4 py-3">
                <p className="text-xs text-blue-700 font-medium">Est. Total</p>
                <p className="text-xl font-bold tabular-nums tracking-tight text-blue-950 mt-0.5">
                  {trip.currency} {trip.estimatedTotal.toLocaleString()}
                </p>
              </div>
            </div>
          </div>

          {/* Dashboard Tabs */}
          <div className="flex items-center gap-2 overflow-x-auto pt-3 border-t border-white/75">
            {(
              [
                ['itinerary', 'Daily Itinerary & Map'],
                ['budget', 'Smart Budget'],
                ['bookings', 'Bookings & Support'],
                ['essentials', 'Currency, Language & Essentials'],
                ['assistant', 'Trip Assistant'],
              ] as const
            ).map(([key, label]) => (
              <button
                key={key}
                type="button"
                onClick={() => setActiveTab(key)}
                className={`px-4 py-2 rounded-full text-xs font-semibold whitespace-nowrap shrink-0 transition-colors cursor-pointer ${
                  activeTab === key
                    ? 'bg-blue-600 text-white shadow-xs'
                    : 'liquid-glass-chip text-slate-700 hover:text-slate-950'
                }`}
              >
                {label}
              </button>
            ))}
          </div>
        </section>

        {actionNotice && (
          <div className="rounded-2xl bg-blue-50/90 border border-blue-200 px-4 py-3 text-xs font-medium text-blue-900 flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-blue-600 shrink-0" />
            <span>{actionNotice}</span>
          </div>
        )}

        {/* Tab 1: Daily Itinerary + Interactive Map */}
        {activeTab === 'itinerary' && (
          <div className="space-y-8">
            <InteractiveTripMap
              title={`${trip.destination} Day-by-Day Route`}
              points={mapPoints}
              activePointId={selectedActivityId}
              onSelectPoint={setSelectedActivityId}
            />

            <div className="space-y-5">
              {trip.days.map((day) => (
                <article
                  key={day.day}
                  className="rounded-3xl liquid-glass p-6 space-y-4"
                >
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-white/75">
                    <div>
                      <p className="text-xs font-bold text-blue-700 tabular-nums">
                        Day {String(day.day).padStart(2, '0')} · Stay: {day.hotelName}
                      </p>
                      <h2 className="text-lg font-bold text-slate-950 mt-0.5">{day.title}</h2>
                    </div>
                    <span className="text-sm font-bold text-slate-900 tabular-nums">
                      Est. {trip.currency} {day.estimatedCost.toLocaleString()}
                    </span>
                  </div>

                  <p className="text-sm text-slate-600">{day.summary}</p>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    {day.activities.map((act) => (
                      <button
                        key={act.id}
                        type="button"
                        onClick={() => setSelectedActivityId(act.id)}
                        className={`text-left rounded-2xl p-4 border transition-colors cursor-pointer ${
                          selectedActivityId === act.id
                            ? 'bg-blue-50/85 border-blue-400'
                            : 'liquid-glass-subtle hover:border-blue-300'
                        }`}
                      >
                        <p className="text-xs font-semibold text-blue-700 tabular-nums">
                          {act.timeOfDay} · {act.durationHours}h · {act.crowdLevel}
                        </p>
                        <h3 className="text-sm font-semibold text-slate-900 mt-1">{act.title}</h3>
                        <p className="text-xs text-slate-600 mt-1 leading-relaxed">{act.description}</p>
                        <p className="text-xs font-semibold text-slate-700 mt-2 tabular-nums">
                          {act.estimatedCost === 0
                            ? 'Included / Free entry'
                            : `Est. ${trip.currency} ${act.estimatedCost.toLocaleString()}`}
                        </p>
                      </button>
                    ))}
                  </div>
                </article>
              ))}
            </div>
          </div>
        )}

        {/* Tab 2: Smart Budget */}
        {activeTab === 'budget' && (
          <BudgetPanel
            itinerary={trip}
            onOptimizeBudget={handleOptimizeBudget}
            optimizing={optimizing}
            lastChanges={optChanges}
          />
        )}

        {/* Tab 3: Booking Organizer & Post-Booking Support */}
        {activeTab === 'bookings' && (
          <div className="space-y-6">
            <div className="rounded-3xl liquid-glass p-6 space-y-5">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div>
                  <h2 className="text-lg font-bold text-slate-950">Booking Organizer & Post-Booking Support</h2>
                  <p className="text-xs text-slate-500">
                    Store confirmation references and review cancellation policies before requesting any change.
                  </p>
                </div>
              </div>

              <form onSubmit={handleAddBooking} className="grid grid-cols-1 sm:grid-cols-4 gap-3 pt-2">
                <select
                  aria-label="Booking type"
                  value={newBookingType}
                  onChange={(e) => setNewBookingType(e.target.value as BookingRecord['type'])}
                  className="px-3.5 py-2.5 rounded-xl border border-white/85 text-sm bg-white/80"
                >
                  <option value="Flight">Flight</option>
                  <option value="Hotel">Hotel</option>
                  <option value="Transport">Cab / Transfer</option>
                  <option value="Activity">Activity</option>
                </select>
                <input
                  type="text"
                  required
                  value={newBookingTitle}
                  onChange={(e) => setNewBookingTitle(e.target.value)}
                  placeholder="Reservation title or voucher…"
                  className="sm:col-span-2 px-3.5 py-2.5 rounded-xl border border-white/85 bg-white/80 text-sm"
                />
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={newBookingRef}
                    onChange={(e) => setNewBookingRef(e.target.value)}
                    placeholder="Ref #"
                    className="w-24 px-3 py-2.5 rounded-xl border border-white/85 bg-white/80 text-sm tabular-nums"
                  />
                  <button
                    type="submit"
                    className="flex-1 inline-flex items-center justify-center gap-1 px-4 py-2.5 rounded-xl bg-slate-950 text-white text-xs font-semibold hover:bg-slate-800 cursor-pointer"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>Add</span>
                  </button>
                </div>
              </form>

              <div className="space-y-3 pt-2">
                {bookings.map((bk) => (
                  <div
                    key={bk.id}
                    className="rounded-2xl liquid-glass-subtle p-4 flex flex-col lg:flex-row lg:items-center justify-between gap-4"
                  >
                    <div className="space-y-1">
                      <p className="text-xs font-semibold text-blue-700 tabular-nums">
                        {bk.type} · Ref {bk.referenceCode} · {bk.status}
                      </p>
                      <h3 className="text-sm font-semibold text-slate-900">{bk.title}</h3>
                      <p className="text-xs text-slate-600">
                        {bk.provider} · {bk.dateLabel} · {bk.cancellationPolicy}
                      </p>
                    </div>

                    <div className="flex flex-wrap items-center gap-2 shrink-0">
                      <a
                        href={bk.providerUrl}
                        target="_blank"
                        rel="noreferrer"
                        className="inline-flex items-center gap-1 px-3 py-2 rounded-xl liquid-glass-chip text-xs font-semibold text-slate-700 hover:text-blue-700"
                      >
                        <span>Provider Portal</span>
                        <ExternalLink className="w-3 h-3" />
                      </a>
                      <button
                        type="button"
                        onClick={() =>
                          setPendingAction({ booking: bk, targetStatus: 'Pending Modification' })
                        }
                        className="px-3 py-2 rounded-xl liquid-glass-chip text-xs font-semibold text-slate-800 hover:text-blue-700 cursor-pointer"
                      >
                        Prepare Change
                      </button>
                      <button
                        type="button"
                        onClick={() =>
                          setPendingAction({ booking: bk, targetStatus: 'Cancelled Record' })
                        }
                        className="px-3 py-2 rounded-xl bg-white/80 border border-red-200 text-xs font-semibold text-red-700 hover:bg-red-50 cursor-pointer"
                      >
                        Mark Cancelled
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Tab 4: Essentials, Currency & Language */}
        {activeTab === 'essentials' && (
          <div className="space-y-6">
            <CurrencyLanguageTools
              homeCurrency={trip.currency}
              destinationCurrency={destinationObj.currencyCode}
              languageName={destinationObj.languageName}
              phrases={destinationObj.phrases}
              estimatedTotalHome={trip.estimatedTotal}
            />

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="rounded-3xl liquid-glass p-6 space-y-2">
                <CalendarDays className="w-5 h-5 text-blue-600" aria-hidden="true" />
                <h3 className="text-base font-semibold text-slate-900">Passport & Visa Check</h3>
                <p className="text-xs text-slate-600 leading-relaxed">
                  Ensure at least 6 months passport validity from your return date and check official embassy e-visa portals for {trip.destination}.
                </p>
              </div>
              <div className="rounded-3xl liquid-glass p-6 space-y-2">
                <ShieldAlert className="w-5 h-5 text-blue-600" aria-hidden="true" />
                <h3 className="text-base font-semibold text-slate-900">Safety & Insurance</h3>
                <p className="text-xs text-slate-600 leading-relaxed">
                  {destinationObj.safetyNotes[0] || 'Keep digital copies of travel insurance and emergency contacts.'}
                </p>
              </div>
              <div className="rounded-3xl liquid-glass p-6 space-y-2">
                <AlertTriangle className="w-5 h-5 text-blue-600" aria-hidden="true" />
                <h3 className="text-base font-semibold text-slate-900">Cultural Etiquette</h3>
                <p className="text-xs text-slate-600 leading-relaxed">
                  {destinationObj.culturalTips[0]}
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Tab 5: Contextual Trip Assistant */}
        {activeTab === 'assistant' && (
          <div className="rounded-3xl liquid-glass p-6 space-y-5">
            <div className="flex items-center gap-2.5">
              <MessageSquare className="w-5 h-5 text-blue-600" aria-hidden="true" />
              <div>
                <h2 className="text-lg font-bold text-slate-950">Contextual Trip Assistant</h2>
                <p className="text-xs text-slate-500">
                  Answers using your saved {trip.destination} itinerary, hotel location, and budget.
                </p>
              </div>
            </div>

            <div className="flex flex-wrap gap-2">
              {[
                'Find a quiet nearby café near my hotel',
                'How do I reach the airport smoothly on departure day?',
                'Make this trip 15% cheaper',
              ].map((q) => (
                <button
                  key={q}
                  type="button"
                  onClick={() => handleAskTripAssistant(q)}
                  className="px-3.5 py-2 rounded-full liquid-glass-chip text-xs font-medium text-slate-700 hover:text-blue-700 cursor-pointer"
                >
                  {q}
                </button>
              ))}
            </div>

            <form
              onSubmit={(e) => {
                e.preventDefault();
                void handleAskTripAssistant();
              }}
              className="flex gap-2"
            >
              <input
                type="text"
                value={assistInput}
                onChange={(e) => setAssistInput(e.target.value)}
                placeholder={`Ask anything about your ${trip.destination} trip…`}
                className="flex-1 px-4 py-2.5 rounded-full border border-white/85 bg-white/80 text-sm"
              />
              <button
                type="submit"
                disabled={assistLoading || !assistInput.trim()}
                className="inline-flex items-center gap-1.5 px-5 py-2.5 rounded-full bg-slate-950 text-white text-xs font-semibold hover:bg-slate-800 disabled:opacity-50 cursor-pointer"
              >
                <Send className="w-3.5 h-3.5" />
                <span>{assistLoading ? 'Thinking…' : 'Ask'}</span>
              </button>
            </form>

            {assistReply && (
              <div className="rounded-2xl liquid-glass-subtle p-4 text-sm text-slate-800 whitespace-pre-line leading-relaxed">
                {assistReply}
              </div>
            )}
          </div>
        )}
      </main>

      {/* Post-Booking Explicit Confirmation Modal */}
      {pendingAction && (
        <div
          role="dialog"
          aria-modal="true"
          aria-labelledby="confirm-booking-title"
          className="fixed inset-0 z-50 bg-slate-950/50 backdrop-blur-xs flex items-center justify-center p-4"
        >
          <div className="bg-white/95 backdrop-blur-2xl rounded-3xl max-w-md w-full p-6 space-y-4 shadow-2xl border border-white">
            <h3 id="confirm-booking-title" className="text-lg font-bold text-slate-950">
              Confirm Booking Organizer Update
            </h3>
            <p className="text-sm text-slate-600 leading-relaxed">
              You are marking <strong>{pendingAction.booking.title}</strong> as{' '}
              <strong>{pendingAction.targetStatus}</strong> in your local trip organizer.
            </p>
            <div className="rounded-2xl liquid-glass-subtle p-3.5 text-xs text-slate-600 space-y-1">
              <p className="font-semibold text-slate-800">Policy & Live Provider Note</p>
              <p>{pendingAction.booking.cancellationPolicy}</p>
              <p>
                Because live airline/hotel booking APIs are not connected, this updates your organizer record only—complete official partner changes on the provider portal.
              </p>
            </div>
            <div className="flex items-center justify-end gap-3 pt-2">
              <button
                type="button"
                onClick={() => setPendingAction(null)}
                className="px-4 py-2 rounded-full bg-slate-100 text-slate-800 text-xs font-semibold hover:bg-slate-200 cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={confirmPostBookingAction}
                className="px-4 py-2 rounded-full bg-blue-600 text-white text-xs font-semibold hover:bg-blue-700 cursor-pointer"
              >
                Confirm Update
              </button>
            </div>
          </div>
        </div>
      )}

      <Footer />
    </div>
  );
}
