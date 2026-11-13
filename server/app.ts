import 'dotenv/config';
import express from 'express';
import {
  DESTINATIONS,
  HOTELS,
  INDICATIVE_CURRENCY_RATES_FROM_INR,
  getFlightsForRoute,
  getTransportOptions,
} from '../src/data/catalog';
import {
  buildDeterministicItinerary,
  convertCurrency,
  extractRequirementsFromText,
  optimizeItineraryForBudget,
  rankHotels,
} from '../src/lib/travelEngine';
import { ItinerarySchema, type BookingRecord, type UserPreferences } from '../src/types/travel';
import {
  runDestinationResearch,
  runLiveTravelWebSearch,
  runTravelAgent,
  suggestPlacesWithAI,
  translateTravelPhrase,
} from './ai/agent';
import { hasConfiguredGeminiKey } from './ai/gemini';
import { store } from './store';

export function createApp() {
  const app = express();

  app.use(express.json({ limit: '1mb' }));

  // Normalize path if invoked via serverless rewrite where /api prefix may be stripped
  app.use((req, _res, next) => {
    if (req.url && !req.url.startsWith('/api') && req.url !== '/' && !req.url.startsWith('/?')) {
      req.url = '/api' + req.url;
    }
    next();
  });

  // Integration detection status (never exposes server-side AI secrets)
  app.get('/api/config/status', (_req, res) => {
    const mapsKey =
      process.env.VITE_GOOGLE_MAPS_API_KEY?.trim() ||
      process.env.GOOGLE_MAPS_API_KEY?.trim() ||
      '';
    res.json({
      gemini: hasConfiguredGeminiKey(),
      tavily: Boolean(process.env.TAVILY_API_KEY?.trim()),
      maps: Boolean(mapsKey),
      weather: 'open-meteo-public',
      currency: 'frankfurter-public',
      webSearch: Boolean(process.env.TAVILY_API_KEY?.trim()) || hasConfiguredGeminiKey(),
    });
  });

  // Google Maps browser SDK key config
  app.get('/api/maps/config', (_req, res) => {
    const apiKey =
      process.env.VITE_GOOGLE_MAPS_API_KEY?.trim() ||
      process.env.GOOGLE_MAPS_API_KEY?.trim() ||
      '';
    res.json({ apiKey });
  });

  // Destinations
  app.get('/api/destinations', (req, res) => {
    const q = String(req.query.q || '').toLowerCase().trim();
    const tag = String(req.query.tag || '').toLowerCase().trim();
    const list = DESTINATIONS.filter((d) => {
      const matchesQ =
        !q ||
        d.name.toLowerCase().includes(q) ||
        d.country.toLowerCase().includes(q) ||
        d.tagline.toLowerCase().includes(q);
      const matchesTag = !tag || tag === 'all' || d.tags.some((t) => t.toLowerCase() === tag);
      return matchesQ && matchesTag;
    });
    res.json({ destinations: list });
  });

  app.get('/api/destinations/:slug', (req, res) => {
    const dest = DESTINATIONS.find((d) => d.slug === req.params.slug || d.id === req.params.slug);
    if (!dest) return res.status(404).json({ error: 'Destination not found' });
    const hotels = rankHotels(HOTELS, { destinationId: dest.id });
    const transport = getTransportOptions(dest.id);
    return res.json({ destination: dest, hotels, transport });
  });

  // Hotels
  app.get('/api/hotels', (req, res) => {
    const destinationId = req.query.destinationId ? String(req.query.destinationId) : undefined;
    const maxNightly = req.query.maxNightly ? Number(req.query.maxNightly) : undefined;
    const tier = req.query.tier ? (String(req.query.tier) as 'budget' | 'boutique' | 'luxury') : undefined;
    const avoidCrowds = req.query.avoidCrowds === 'true';

    const ranked = rankHotels(HOTELS, {
      destinationId: destinationId === 'all' ? undefined : destinationId,
      maxNightlyInr: maxNightly,
      preferredTier: tier,
      avoidCrowds,
    });
    res.json({
      hotels: ranked,
      provenance: 'Simulated Demo Stays Catalog — confirm live room availability with partner before booking.',
    });
  });

  // Flights
  app.get('/api/flights', (req, res) => {
    const origin = String(req.query.origin || 'Kolkata');
    const destination = String(req.query.destination || 'Bali');
    const flights = getFlightsForRoute(origin, destination);
    res.json({
      flights,
      provenance: 'Indicative route schedules & fare benchmarks — click Book on Google Flights for live availability.',
    });
  });

  // Local transport
  app.get('/api/transport', (req, res) => {
    const destinationId = String(req.query.destinationId || 'bali');
    res.json({
      options: getTransportOptions(destinationId),
      provenance: 'Indicative local transport estimates and demo mobility adapter.',
    });
  });

  // Live currency (Frankfurter public API with indicative fallback)
  app.get('/api/currency', async (req, res) => {
    const from = String(req.query.from || 'INR').toUpperCase();
    const to = String(req.query.to || 'IDR').toUpperCase();
    const amount = Number(req.query.amount || 1000);

    try {
      const url = `https://api.frankfurter.app/latest?amount=${encodeURIComponent(amount)}&from=${encodeURIComponent(from)}&to=${encodeURIComponent(to)}`;
      const controller = new AbortController();
      const timer = setTimeout(() => controller.abort(), 3000);
      const resp = await fetch(url, { signal: controller.signal });
      clearTimeout(timer);
      if (resp.ok) {
        const data = (await resp.json()) as { date?: string; rates?: Record<string, number> };
        const converted = data.rates?.[to];
        if (typeof converted === 'number') {
          return res.json({
            from,
            to,
            amount,
            converted,
            rate: Number((converted / Math.max(1, amount)).toFixed(6)),
            date: data.date || new Date().toISOString().slice(0, 10),
            provenance: 'verified_live',
            note: 'Indicative mid-market reference rate via Frankfurter.',
          });
        }
      }
    } catch {
      // Fallback to catalog indicative rates
    }

    const converted = convertCurrency(amount, from, to);
    const rate = convertCurrency(1, from, to);
    return res.json({
      from,
      to,
      amount,
      converted,
      rate,
      date: new Date().toISOString().slice(0, 10),
      provenance: 'indicative_estimate',
      note: 'Offline indicative travel conversion rate; verify bank transaction spread.',
      supportedCurrencies: Object.keys(INDICATIVE_CURRENCY_RATES_FROM_INR),
    });
  });

  // Live Weather (Open-Meteo public API with seasonal fallback)
  app.get('/api/weather', async (req, res) => {
    const destinationId = String(req.query.destinationId || 'bali');
    const dest = DESTINATIONS.find((d) => d.id === destinationId) || DESTINATIONS[0];
    try {
      const url = `https://api.open-meteo.com/v1/forecast?latitude=${dest.coordinates.lat}&longitude=${dest.coordinates.lng}&current=temperature_2m,relative_humidity_2m,weather_code&daily=temperature_2m_max,temperature_2m_min&timezone=auto&forecast_days=5`;
      const controller = new AbortController();
      const timer = setTimeout(() => controller.abort(), 3000);
      const resp = await fetch(url, { signal: controller.signal });
      clearTimeout(timer);
      if (resp.ok) {
        const data = (await resp.json()) as {
          current?: { temperature_2m?: number; relative_humidity_2m?: number };
          daily?: { time?: string[]; temperature_2m_max?: number[]; temperature_2m_min?: number[] };
        };
        if (data.current?.temperature_2m !== undefined) {
          return res.json({
            destination: dest.name,
            currentTempC: data.current.temperature_2m,
            humidity: `${data.current.relative_humidity_2m ?? 65}%`,
            daily: data.daily,
            summary: dest.weatherSummary,
            provenance: 'verified_live',
          });
        }
      }
    } catch {
      // Fallback to seasonal profile
    }
    return res.json({
      destination: dest.name,
      summary: dest.weatherSummary,
      provenance: 'indicative_estimate',
    });
  });

  // AI Conversational Travel Planner
  app.post('/api/ai/chat', async (req, res) => {
    try {
      const { message, history = [], currentItinerary = null } = req.body as {
        message?: string;
        history?: Array<{ role: 'user' | 'assistant'; content: string }>;
        currentItinerary?: unknown;
      };
      if (!message || typeof message !== 'string' || !message.trim()) {
        return res.status(400).json({ error: 'Please enter a message for the travel agent.' });
      }
      const parsedItinerary = currentItinerary ? ItinerarySchema.safeParse(currentItinerary) : null;
      const preferences = store.getPreferences();
      const result = await runTravelAgent({
        message: message.trim(),
        history: Array.isArray(history) ? history : [],
        currentItinerary: parsedItinerary?.success ? parsedItinerary.data : null,
        preferences,
      });
      return res.json(result);
    } catch (err) {
      return res.status(500).json({
        error: err instanceof Error ? err.message : 'Unable to process AI request.',
      });
    }
  });

  // AI Quick Build from Search Form
  app.post('/api/ai/plan', (req, res) => {
    const { prompt, origin, destination, durationDays, travellers, budget, currency } = req.body as {
      prompt?: string;
      origin?: string;
      destination?: string;
      durationDays?: number;
      travellers?: number;
      budget?: number;
      currency?: string;
    };
    const prefs = store.getPreferences();
    const extracted = extractRequirementsFromText(prompt || '', {
      origin: origin || prefs.homeCity,
      destination: destination || 'Bali',
      durationDays: durationDays || 5,
      travellers: travellers || 2,
      budget: budget || 80000,
      currency: currency || prefs.preferredCurrency,
      hotelTier: prefs.hotelPreference,
      pace: prefs.travelStyle,
      avoidCrowds: prefs.avoidCrowds,
    });
    const itinerary = buildDeterministicItinerary(extracted);
    return res.json({ itinerary });
  });

  // AI Budget Re-optimization
  app.post('/api/ai/optimize-budget', (req, res) => {
    const { itinerary, newBudget } = req.body as { itinerary?: unknown; newBudget?: number };
    const parsed = ItinerarySchema.safeParse(itinerary);
    if (!parsed.success || typeof newBudget !== 'number' || newBudget <= 0) {
      return res.status(400).json({ error: 'Valid itinerary and positive budget are required.' });
    }
    const result = optimizeItineraryForBudget(parsed.data, newBudget);
    store.saveTrip(result.updated);
    return res.json(result);
  });

  // Destination Web Research
  app.post('/api/ai/research', async (req, res) => {
    const { destination, focus } = req.body as { destination?: string; focus?: string };
    if (!destination) return res.status(400).json({ error: 'Destination is required.' });
    const research = await runDestinationResearch(destination, focus);
    return res.json(research);
  });

  // AI Place & Destination Suggestion Search
  app.post('/api/ai/suggest-places', async (req, res) => {
    const { query } = req.body as { query?: string };
    if (!query || !query.trim()) {
      return res.status(400).json({ error: 'A place or travel interest query is required.' });
    }
    const suggestions = await suggestPlacesWithAI(query);
    return res.json(suggestions);
  });

  // Live Web Search for Hotels, Flights & Local Transport
  app.post('/api/search/web', async (req, res) => {
    const { category, destination, origin, preferencesNote } = req.body as {
      category?: 'hotels' | 'flights' | 'transport';
      destination?: string;
      origin?: string;
      preferencesNote?: string;
    };
    if (!category || !destination) {
      return res.status(400).json({ error: 'Category and destination are required.' });
    }
    const result = await runLiveTravelWebSearch({
      category,
      destination,
      origin,
      preferencesNote,
    });
    return res.json(result);
  });

  // Language Phrase Translator
  app.post('/api/ai/translate', async (req, res) => {
    const { phrase, targetLanguage } = req.body as { phrase?: string; targetLanguage?: string };
    if (!phrase || !targetLanguage) {
      return res.status(400).json({ error: 'Phrase and target language are required.' });
    }
    try {
      const result = await translateTravelPhrase(phrase, targetLanguage);
      return res.json(result);
    } catch (err) {
      return res.status(500).json({ error: err instanceof Error ? err.message : 'Translation failed.' });
    }
  });

  // Trips CRUD
  app.get('/api/trips', (_req, res) => {
    res.json({ trips: store.getTrips() });
  });

  app.get('/api/trips/:id', (req, res) => {
    const trip = store.getTrip(req.params.id);
    if (!trip) return res.status(404).json({ error: 'Trip not found' });
    return res.json({ trip });
  });

  app.post('/api/trips', (req, res) => {
    const parsed = ItinerarySchema.safeParse(req.body);
    if (!parsed.success) {
      return res.status(400).json({ error: 'Invalid itinerary payload', details: parsed.error.issues });
    }
    const saved = store.saveTrip(parsed.data);
    return res.status(201).json({ trip: saved });
  });

  app.delete('/api/trips/:id', (req, res) => {
    const removed = store.deleteTrip(req.params.id);
    return res.json({ removed });
  });

  // Saved Destinations & Hotels
  app.get('/api/saved', (_req, res) => {
    res.json(store.getSaved());
  });

  app.post('/api/saved/destination/:id', (req, res) => {
    res.json({ destinationIds: store.toggleSavedDestination(req.params.id) });
  });

  app.post('/api/saved/hotel/:id', (req, res) => {
    res.json({ hotelIds: store.toggleSavedHotel(req.params.id) });
  });

  // Bookings & Post-Booking Support
  app.get('/api/bookings', (req, res) => {
    const tripId = req.query.tripId ? String(req.query.tripId) : undefined;
    res.json({ bookings: store.getBookings(tripId) });
  });

  app.post('/api/bookings', (req, res) => {
    const body = req.body as Partial<BookingRecord>;
    if (!body.title || !body.tripId || !body.type) {
      return res.status(400).json({ error: 'Booking title, tripId, and type are required.' });
    }
    const record: BookingRecord = {
      id: `bk-${Date.now().toString(36)}`,
      tripId: body.tripId,
      type: body.type,
      title: body.title,
      provider: body.provider || 'Manual Trip Organizer',
      referenceCode: body.referenceCode || `UM-${Math.floor(1000 + Math.random() * 9000)}`,
      dateLabel: body.dateLabel || 'Upcoming Trip',
      status: 'Saved Record',
      amount: Number(body.amount || 0),
      currency: body.currency || 'INR',
      cancellationPolicy: body.cancellationPolicy || 'Verify provider terms before changes.',
      providerUrl: body.providerUrl || 'https://www.google.com/travel',
    };
    return res.status(201).json({ booking: store.addBooking(record) });
  });

  app.patch('/api/bookings/:id', (req, res) => {
    const { status, confirmed } = req.body as { status?: BookingRecord['status']; confirmed?: boolean };
    if (!confirmed) {
      return res.status(400).json({
        error: 'Explicit confirmation required before modifying or cancelling a booking record.',
      });
    }
    if (!status) return res.status(400).json({ error: 'Target status is required.' });
    const updated = store.updateBookingStatus(req.params.id, status);
    if (!updated) return res.status(404).json({ error: 'Booking record not found.' });
    return res.json({
      booking: updated,
      note: 'Local organizer record updated. Complete live provider changes directly via the partner link.',
    });
  });

  // User Preferences
  app.get('/api/preferences', (_req, res) => {
    res.json({ preferences: store.getPreferences() });
  });

  app.put('/api/preferences', (req, res) => {
    const prefs = req.body as UserPreferences;
    if (!prefs || !prefs.preferredCurrency) {
      return res.status(400).json({ error: 'Valid preferences object is required.' });
    }
    return res.json({ preferences: store.updatePreferences(prefs) });
  });

  return app;
}

export const app = createApp();
export default app;
