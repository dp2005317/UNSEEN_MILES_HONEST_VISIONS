import { useEffect, useRef, useState } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import {
  ArrowRight,
  BookmarkCheck,
  ExternalLink,
  Mic,
  MicOff,
  Plus,
  Send,
  SlidersHorizontal,
  Sparkles,
} from 'lucide-react';
import { getMediaUrl } from '../data/media';
import type { ChatMessage, Itinerary } from '../types/travel';
import { Navbar } from '../components/layout/Navbar';
import { BudgetPanel } from '../components/budget/BudgetPanel';
import { InteractiveTripMap, activitiesToMapPoints } from '../components/maps/InteractiveTripMap';

const INITIAL_ASSISTANT_MESSAGE: ChatMessage = {
  id: 'welcome-msg',
  role: 'assistant',
  timestamp: new Date().toISOString(),
  content:
    "Hey traveller! I'm your personal travel concierge.\n\nTell me where you want to go, where you're starting from, your budget, and the experience you're dreaming of.\n\nI'll craft the itinerary, search live flights & stays, map every stop, and provide direct booking links.",
  followUpQuestions: [
    'Plan a 5-day trip to London for 2 with historic walks and boutique stays',
    'Kolkata to Bali for 5 days in December, ₹80,000 for 2 people, peaceful beaches and cafés',
    '6 days in Tokyo & Kyoto Japan with quiet temple visits and ramen counters',
  ],
};

function sanitizeAssistantProse(raw: string): string {
  return raw
    .replace(/\*\*|__|`/g, '')
    .replace(/^\s*[-*]\s+/gm, '• ')
    .trim();
}

export function PlannerPage() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  const [messages, setMessages] = useState<ChatMessage[]>([INITIAL_ASSISTANT_MESSAGE]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [progressStage, setProgressStage] = useState('');
  const [activeItinerary, setActiveItinerary] = useState<Itinerary | null>(null);
  const [savedTrips, setSavedTrips] = useState<Itinerary[]>([]);
  const [savingTrip, setSavingTrip] = useState(false);
  const [savedNotice, setSavedNotice] = useState<string | null>(null);
  const [listening, setListening] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const autoTriggeredRef = useRef(false);
  const endRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    fetch('/api/trips')
      .then((r) => r.json())
      .then((d) => setSavedTrips(d.trips || []))
      .catch(() => {});
  }, []);

  useEffect(() => {
    const dest = searchParams.get('destination');
    if (dest && !autoTriggeredRef.current) {
      autoTriggeredRef.current = true;
      const origin = searchParams.get('origin') || 'Kolkata';
      const days = searchParams.get('days') || '5';
      const travellers = searchParams.get('travellers') || '2';
      const budget = searchParams.get('budget') || '80000';
      const prompt = `Plan a ${days}-day trip from ${origin} to ${dest} for ${travellers} travellers with a total budget of ₹${Number(budget).toLocaleString()}.`;
      void sendMessage(prompt);
    }
  }, [searchParams]);

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, loading]);

  const sendMessage = async (textToSend?: string) => {
    const trimmed = (textToSend ?? input).trim();
    if (!trimmed || loading) return;

    const userMsg: ChatMessage = {
      id: `u-${Date.now()}`,
      role: 'user',
      content: trimmed,
      timestamp: new Date().toISOString(),
    };

    const nextHistory = [...messages, userMsg];
    setMessages(nextHistory);
    if (!textToSend) setInput('');
    setLoading(true);
    setSavedNotice(null);

    const stages = [
      'Understanding your travel preferences…',
      'Searching live flights, quiet stays & hidden spots…',
      'Mapping routes & calculating your budget…',
    ];
    let stageIdx = 0;
    setProgressStage(stages[0]);
    const timer = setInterval(() => {
      stageIdx = (stageIdx + 1) % stages.length;
      setProgressStage(stages[stageIdx]);
    }, 1300);

    try {
      const resp = await fetch('/api/ai/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: trimmed,
          history: nextHistory.map((m) => ({ role: m.role, content: m.content })),
          currentItinerary: activeItinerary,
        }),
      });
      const data = await resp.json();

      if (!resp.ok) {
        setMessages((prev) => [
          ...prev,
          {
            id: `err-${Date.now()}`,
            role: 'assistant',
            content: data.error || 'Something interrupted the planner. Please try again.',
            timestamp: new Date().toISOString(),
          },
        ]);
        return;
      }

      if (data.itinerary) {
        setActiveItinerary(data.itinerary);
      }

      const assistantMsg: ChatMessage = {
        id: `a-${Date.now()}`,
        role: 'assistant',
        content: sanitizeAssistantProse(
          data.warning ? `${data.reply}\n\nNote: ${data.warning}` : data.reply
        ),
        timestamp: new Date().toISOString(),
        toolsUsed: data.toolsUsed,
        itinerary: data.itinerary,
        hotels: data.hotels,
        sources: data.sources,
        bookingLinks: data.bookingLinks,
        followUpQuestions: data.followUpQuestions,
        provenanceBadge: data.usedLiveGemini
          ? 'Gemini AI Concierge · Live Web Grounding'
          : data.usedLiveTavily
            ? 'Tavily Live Web Search · Concierge Mode'
            : data.providerLabel || 'Unseen Miles Engine · Indicative Estimates',
      };
      setMessages((prev) => [...prev, assistantMsg]);
    } catch {
      setMessages((prev) => [
        ...prev,
        {
          id: `err-${Date.now()}`,
          role: 'assistant',
          content: 'Network interruption while reaching the travel planner API. Please retry.',
          timestamp: new Date().toISOString(),
        },
      ]);
    } finally {
      clearInterval(timer);
      setLoading(false);
      setProgressStage('');
    }
  };

  const handleSaveTrip = async (tripToSave: Itinerary) => {
    setSavingTrip(true);
    try {
      const resp = await fetch('/api/trips', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(tripToSave),
      });
      if (resp.ok) {
        const data = await resp.json();
        setSavedTrips((prev) => [data.trip, ...prev.filter((t) => t.id !== data.trip.id)]);
        setSavedNotice(`Saved "${data.trip.tripName}" to your journeys.`);
        navigate(`/trip/${data.trip.id}`);
      }
    } finally {
      setSavingTrip(false);
    }
  };

  const handleVoiceInput = () => {
    const SpeechRecognition =
      (window as unknown as { SpeechRecognition?: new () => unknown; webkitSpeechRecognition?: new () => unknown })
        .SpeechRecognition ||
      (window as unknown as { webkitSpeechRecognition?: new () => unknown }).webkitSpeechRecognition;

    if (!SpeechRecognition) {
      setSavedNotice('Voice input is not supported in this browser.');
      return;
    }

    const recognition = new SpeechRecognition() as {
      lang: string;
      onresult: (e: { results: ArrayLike<ArrayLike<{ transcript: string }>> }) => void;
      onerror: () => void;
      onend: () => void;
      start: () => void;
    };
    recognition.lang = 'en-US';
    setListening(true);
    recognition.onresult = (event) => {
      const transcript = event.results[0]?.[0]?.transcript || '';
      setInput((prev) => (prev ? `${prev} ${transcript}` : transcript));
    };
    recognition.onerror = () => setListening(false);
    recognition.onend = () => setListening(false);
    recognition.start();
  };

  const startNewJourney = () => {
    setMessages([INITIAL_ASSISTANT_MESSAGE]);
    setActiveItinerary(null);
    setSavedNotice(null);
  };

  return (
    <div className="min-h-screen flex flex-col text-slate-900">
      <Navbar />

      <div className="flex-1 pt-16 flex flex-col lg:flex-row max-w-7xl w-full mx-auto">
        {/* Left Sidebar */}
        <aside
          className={`${
            sidebarOpen ? 'block' : 'hidden'
          } lg:block w-full lg:w-72 shrink-0 border-b lg:border-b-0 lg:border-r border-white/80 bg-white/65 backdrop-blur-2xl p-5 space-y-6`}
        >
          <button
            type="button"
            onClick={startNewJourney}
            className="w-full inline-flex items-center justify-center gap-2 py-2.5 px-4 rounded-full bg-slate-950 text-white text-xs font-semibold hover:bg-slate-800 cursor-pointer shadow-xs"
          >
            <Plus className="w-4 h-4" aria-hidden="true" />
            <span>New Journey</span>
          </button>

          <div className="space-y-2">
            <p className="text-xs font-semibold text-slate-500">Saved Journeys</p>
            {savedTrips.length === 0 ? (
              <p className="text-xs text-slate-400">No saved journeys yet.</p>
            ) : (
              <div className="space-y-1.5">
                {savedTrips.slice(0, 5).map((t) => (
                  <Link
                    key={t.id}
                    to={`/trip/${t.id}`}
                    className="block p-3 rounded-2xl liquid-glass-subtle hover:border-blue-300 transition-colors"
                  >
                    <p className="text-xs font-semibold text-slate-900 truncate">{t.tripName}</p>
                    <p className="text-xs text-slate-500 mt-0.5 tabular-nums">
                      {t.origin} → {t.destination} · {t.durationDays}d
                    </p>
                  </Link>
                ))}
              </div>
            )}
          </div>

          <div className="space-y-2 pt-4 border-t border-white/75">
            <p className="text-xs font-semibold text-slate-500">Workspace Links</p>
            <nav className="space-y-1 text-xs font-medium text-slate-700">
              <Link to="/explore" className="block px-3 py-2 rounded-lg hover:bg-white/70">
                Explore Destinations & AI Search
              </Link>
              <Link to="/stays" className="block px-3 py-2 rounded-lg hover:bg-white/70">
                Compare Stays
              </Link>
              <Link to="/flights" className="block px-3 py-2 rounded-lg hover:bg-white/70">
                Flight Discovery
              </Link>
              <Link to="/transport" className="block px-3 py-2 rounded-lg hover:bg-white/70">
                Local Transport
              </Link>
              <Link to="/profile" className="block px-3 py-2 rounded-lg hover:bg-white/70">
                Travel Preferences
              </Link>
            </nav>
          </div>
        </aside>

        {/* Main Conversational Canvas */}
        <main className="flex-1 flex flex-col min-w-0 min-h-[calc(100vh-4rem)]">
          {/* Mobile Workspace Toggle */}
          <div className="lg:hidden px-4 py-2.5 bg-white/75 backdrop-blur-xl border-b border-white/80 flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-700">AI Travel Planner</span>
            <button
              type="button"
              onClick={() => setSidebarOpen((p) => !p)}
              className="inline-flex items-center gap-1.5 text-xs font-semibold text-blue-700"
            >
              <SlidersHorizontal className="w-3.5 h-3.5" />
              <span>{sidebarOpen ? 'Hide Trips' : 'Saved Trips'}</span>
            </button>
          </div>

          <div className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8 space-y-6">
            {savedNotice && (
              <div className="rounded-2xl bg-blue-50/90 border border-blue-200 px-4 py-3 text-xs font-medium text-blue-900">
                {savedNotice}
              </div>
            )}

            {messages.map((msg) => (
              <div
                key={msg.id}
                className={`flex flex-col ${msg.role === 'user' ? 'items-end' : 'items-start'} space-y-3`}
              >
                <div
                  className={`max-w-3xl rounded-3xl px-5 py-4 text-sm leading-relaxed whitespace-pre-line ${
                    msg.role === 'user'
                      ? 'bg-slate-950 text-white shadow-md'
                      : 'liquid-glass text-slate-800'
                  }`}
                >
                  {msg.provenanceBadge && (
                    <p className="text-xs font-semibold text-blue-700 mb-2">{msg.provenanceBadge}</p>
                  )}
                  <p>{msg.content}</p>

                  {/* Direct Partner Booking Links */}
                  {msg.bookingLinks && msg.bookingLinks.length > 0 && (
                    <div className="mt-4 pt-3 border-t border-white/75 space-y-2">
                      <p className="text-xs font-semibold text-slate-500">Direct Partner Booking & Maps</p>
                      <div className="flex flex-wrap gap-2">
                        {msg.bookingLinks.map((link) => (
                          <a
                            key={link.url}
                            href={link.url}
                            target="_blank"
                            rel="noreferrer"
                            className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full liquid-glass-chip text-xs font-semibold text-blue-700 hover:bg-blue-600 hover:text-white transition-colors"
                          >
                            <span>{link.label}</span>
                            <ExternalLink className="w-3 h-3 shrink-0" aria-hidden="true" />
                          </a>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Cited Web Sources */}
                  {msg.sources && msg.sources.length > 0 && (
                    <div className="mt-3 pt-2.5 border-t border-white/70 flex flex-wrap items-center gap-x-3 gap-y-1.5">
                      <span className="text-xs font-semibold text-slate-500">Web Sources:</span>
                      {msg.sources.map((src, i) => (
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

                {/* Inline Hotels Preview */}
                {msg.hotels && msg.hotels.length > 0 && (
                  <div className="w-full max-w-4xl grid grid-cols-1 md:grid-cols-3 gap-4">
                    {msg.hotels.map((hotel) => (
                      <div
                        key={hotel.id}
                        className="rounded-3xl liquid-glass overflow-hidden"
                      >
                        <img
                          src={getMediaUrl(hotel.mediaKey)}
                          alt={hotel.name}
                          referrerPolicy="no-referrer"
                          className="w-full h-32 object-cover"
                        />
                        <div className="p-4 space-y-1.5">
                          <p className="text-xs text-slate-500">
                            {hotel.area} · {hotel.tier}
                          </p>
                          <h4 className="text-sm font-semibold text-slate-900">{hotel.name}</h4>
                          <p className="text-xs font-bold text-blue-700 tabular-nums">
                            ₹{hotel.pricePerNightInr.toLocaleString()}/night · {hotel.rating}★
                          </p>
                          <p className="text-xs text-slate-600 line-clamp-2">
                            {hotel.recommendationReason}
                          </p>
                          <a
                            href={`https://www.booking.com/searchresults.html?ss=${encodeURIComponent(`${hotel.name} ${hotel.area}`)}`}
                            target="_blank"
                            rel="noreferrer"
                            className="inline-flex items-center gap-1 text-xs font-semibold text-blue-700 hover:underline pt-1"
                          >
                            <span>Check live availability</span>
                            <ExternalLink className="w-3 h-3" aria-hidden="true" />
                          </a>
                        </div>
                      </div>
                    ))}
                  </div>
                )}

                {/* Inline Generated Itinerary Preview + Map + Budget */}
                {msg.itinerary && (
                  <div className="w-full max-w-4xl space-y-5">
                    <div className="rounded-3xl liquid-glass p-6 space-y-5">
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-white/75">
                        <div>
                          <p className="text-xs font-semibold text-blue-700 tabular-nums">
                            {msg.itinerary.origin} → {msg.itinerary.destination} · {msg.itinerary.durationDays} days · {msg.itinerary.travellers} travellers
                          </p>
                          <h3 className="text-2xl font-bold text-slate-950 mt-0.5">
                            {msg.itinerary.tripName}
                          </h3>
                        </div>
                        <button
                          type="button"
                          disabled={savingTrip}
                          onClick={() => handleSaveTrip(msg.itinerary!)}
                          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-blue-600 text-white text-xs font-semibold hover:bg-blue-700 disabled:opacity-50 whitespace-nowrap shrink-0 cursor-pointer shadow-xs"
                        >
                          <BookmarkCheck className="w-4 h-4" aria-hidden="true" />
                          <span>{savingTrip ? 'Saving…' : 'Save & Open Trip Dashboard'}</span>
                          <ArrowRight className="w-3.5 h-3.5" aria-hidden="true" />
                        </button>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {msg.itinerary.days.map((day) => (
                          <div
                            key={day.day}
                            className="rounded-2xl liquid-glass-subtle p-4 space-y-2.5"
                          >
                            <div className="flex items-center justify-between gap-2">
                              <span className="text-xs font-bold text-blue-700 tabular-nums">
                                Day {String(day.day).padStart(2, '0')}
                              </span>
                              <span className="text-xs font-semibold text-slate-700 tabular-nums">
                                ~{msg.itinerary!.currency} {day.estimatedCost.toLocaleString()}
                              </span>
                            </div>
                            <h4 className="text-sm font-semibold text-slate-900">{day.title}</h4>
                            <ul className="space-y-1.5 text-xs text-slate-600">
                              {day.activities.map((act) => (
                                <li key={act.id}>
                                  <span className="font-semibold text-slate-800">{act.timeOfDay}:</span>{' '}
                                  {act.title}
                                </li>
                              ))}
                            </ul>
                          </div>
                        ))}
                      </div>
                    </div>

                    <BudgetPanel itinerary={msg.itinerary} />

                    <InteractiveTripMap
                      title={`${msg.itinerary.destination} Planned Route`}
                      points={activitiesToMapPoints(msg.itinerary.days.flatMap((d) => d.activities))}
                    />
                  </div>
                )}

                {/* Suggested Quick Follow-ups */}
                {msg.followUpQuestions && msg.followUpQuestions.length > 0 && (
                  <div className="flex flex-wrap gap-2 max-w-3xl">
                    {msg.followUpQuestions.map((q) => (
                      <button
                        key={q}
                        type="button"
                        onClick={() => sendMessage(q)}
                        className="px-3.5 py-2 rounded-full liquid-glass-chip text-xs font-medium text-slate-700 hover:text-blue-700 transition-colors text-left cursor-pointer"
                      >
                        {q}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            ))}

            {loading && (
              <div className="max-w-md rounded-2xl liquid-glass px-5 py-4 flex items-center gap-3 text-sm text-slate-700">
                <Sparkles className="w-4 h-4 text-blue-600 animate-spin shrink-0" aria-hidden="true" />
                <span>{progressStage || 'Planning your journey…'}</span>
              </div>
            )}

            <div ref={endRef} />
          </div>

          {/* Bottom Composer */}
          <div className="sticky bottom-0 bg-white/65 backdrop-blur-2xl border-t border-white/85 p-4 sm:px-6 lg:px-8">
            <div className="max-w-4xl mx-auto space-y-2.5">
              {activeItinerary && (
                <div className="flex items-center gap-2 overflow-x-auto pb-0.5">
                  {[
                    'Make the trip cheaper',
                    "I don't want crowded places",
                    'Switch to a relaxed pace with more cafés',
                  ].map((chip) => (
                    <button
                      key={chip}
                      type="button"
                      onClick={() => sendMessage(chip)}
                      className="px-3 py-1.5 rounded-full liquid-glass-chip text-xs font-medium text-slate-700 hover:text-blue-700 whitespace-nowrap shrink-0 cursor-pointer"
                    >
                      {chip}
                    </button>
                  ))}
                </div>
              )}

              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  void sendMessage();
                }}
                className="flex items-center gap-2 rounded-full liquid-glass px-3 py-2 focus-within:ring-2 focus-within:ring-blue-500/40"
              >
                <button
                  type="button"
                  onClick={handleVoiceInput}
                  aria-label={listening ? 'Listening for voice input' : 'Use voice input'}
                  className={`w-10 h-10 rounded-full inline-flex items-center justify-center transition-colors shrink-0 cursor-pointer ${
                    listening ? 'bg-blue-600 text-white' : 'text-slate-600 hover:bg-white/70'
                  }`}
                >
                  {listening ? <MicOff className="w-4 h-4" /> : <Mic className="w-4 h-4" />}
                </button>
                <label htmlFor="planner-chat-input" className="sr-only">
                  Describe your dream trip or ask to modify your itinerary
                </label>
                <input
                  id="planner-chat-input"
                  type="text"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  placeholder="Describe your trip, budget, dates, or ask to make it cheaper…"
                  className="flex-1 bg-transparent text-sm text-slate-900 placeholder:text-slate-500 focus:outline-none min-w-0"
                />
                <button
                  type="submit"
                  disabled={loading || !input.trim()}
                  aria-label="Send message"
                  className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-full bg-slate-950 text-white text-xs font-semibold hover:bg-slate-800 disabled:opacity-40 shrink-0 cursor-pointer"
                >
                  <span>Send</span>
                  <Send className="w-3.5 h-3.5" aria-hidden="true" />
                </button>
              </form>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
