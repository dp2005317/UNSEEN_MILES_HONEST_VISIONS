import {
  DESTINATIONS,
  HOTELS,
  INDICATIVE_CURRENCY_RATES_FROM_INR,
  getFlightsForRoute,
  getTransportOptions,
} from '../data/catalog';
import {
  findKnownCity,
  resolveOrSynthesizeDestination,
  synthesizeHotelsForDestination,
} from './worldwideDestinations';
import { getSeasonalProfile, resolveSeason } from './seasonalIntelligence';
import {
  ItinerarySchema,
  type BudgetBreakdown,
  type Destination,
  type ExtractedRequirements,
  type HotelOption,
  type Itinerary,
  type TripDay,
} from '../types/travel';

export function resolveCatalogDestination(query: string): Destination | undefined {
  const lower = query
    .trim()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase();
  if (!lower) return undefined;

  const direct =
    DESTINATIONS.find((d) => d.id === lower || d.name.toLowerCase() === lower || d.country.toLowerCase() === lower) ||
    DESTINATIONS.find((d) => lower.includes(d.name.toLowerCase()) || lower.includes(d.country.toLowerCase()));
  if (direct) return direct;

  const aliases: Array<[string[], string]> = [
    [['pokhara', 'kathmandu', 'sarangkot', 'everest', 'annapurna'], 'nepal'],
    [['kyoto', 'uji', 'osaka', 'nara', 'arashiyama', 'hakone'], 'japan'],
    [['amalfi', 'ravello', 'sorrento', 'positano', 'capri'], 'italy'],
    [['zermatt', 'lucerne', 'interlaken', 'zurich', 'geneva', 'grindelwald'], 'switzerland'],
    [['ubud', 'sanur', 'uluwatu', 'sidemen', 'seminyak', 'canggu', 'nusa'], 'bali'],
    [['leh', 'pangong', 'nubra', 'ladakh', 'khardung'], 'ladakh'],
    [['munnar', 'alleppey', 'kochi', 'kerala', 'backwaters', 'varkala', 'thekkady'], 'kerala'],
    [['santorini', 'crete', 'oia', 'fira', 'cyclades'], 'greece'],
    [['cappadocia', 'goreme', 'uchisar'], 'turkey'],
    [['reykjavik', 'vik', 'iceland', 'akureyri', 'golden circle'], 'iceland'],
    [['marrakech', 'atlas', 'imlil', 'morocco', 'essaouira', 'fes'], 'morocco'],
    [['chiang mai', 'krabi', 'phuket', 'ao nang'], 'thailand'],
  ];

  for (const [terms, id] of aliases) {
    if (terms.some((t) => lower.includes(t))) {
      const found = DESTINATIONS.find((d) => d.id === id);
      if (found) return found;
    }
  }
  return undefined;
}

export function extractRequirementsFromText(
  input: string,
  defaults?: Partial<ExtractedRequirements>
): ExtractedRequirements {
  const text = input.trim();
  const lower = text
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase();

  // Origin detection: "from <City>"
  const fromMatch = text.match(/\bfrom\s+([A-Za-z\s]{2,28}?)(?=\s+(?:to|for|in|with|on|,|\.)|$)/i);
  const origin = fromMatch?.[1]?.trim() || defaults?.origin || 'Kolkata';

  // Destination detection: prioritize exact world city matches, then catalog destinations, then regex
  const knownCity = findKnownCity(lower);
  const matchedDest = resolveCatalogDestination(lower);

  const toMatch = text.match(/\b(?:to|visit|in|exploring|explore)\s+([A-Za-z\s]{2,28}?)(?=\s+(?:for|in|with|on|from|,|\.)|$)/i);

  let rawDest = knownCity?.name || matchedDest?.name || toMatch?.[1]?.trim();

  // If still not found and input is concise or specifies a direct place name
  if (!rawDest) {
    const stripped = text
      .replace(/\b(?:plan|a|trip|itinerary|travel|vacation|holiday|days?|nights?|for|with|couple|solo|family|\d+)\b/gi, '')
      .replace(/[,\.?!]/g, '')
      .trim();
    if (stripped.length >= 3 && stripped.length <= 40) {
      rawDest = stripped;
    }
  }

  const destination = rawDest || defaults?.destination || 'London';

  // Duration days
  const daysMatch = text.match(/(\d{1,2})\s*[-–]?\s*(?:days?|nights?)/i);
  const durationDays = daysMatch ? Math.min(21, Math.max(1, Number(daysMatch[1]))) : defaults?.durationDays || 5;

  // Travellers
  let travellers = defaults?.travellers || 2;
  const travNumMatch = text.match(/(\d{1,2})\s*(?:people|persons|travellers|travelers|guests|adults)/i);
  if (travNumMatch) {
    travellers = Math.min(12, Math.max(1, Number(travNumMatch[1])));
  } else if (/\b(?:two|couple|2)\b/i.test(lower)) {
    travellers = 2;
  } else if (/\bsolo\b|\balone\b|\b1 person\b/i.test(lower)) {
    travellers = 1;
  } else if (/\bfamily\b|\bfour\b/i.test(lower)) {
    travellers = 4;
  }

  // Currency & Budget
  let currency = defaults?.currency || 'INR';
  if (/\$|usd|dollars?/i.test(lower)) currency = 'USD';
  else if (/€|eur|euros?/i.test(lower)) currency = 'EUR';
  else if (/₹|rs\.?|inr|rupees?/i.test(lower)) currency = 'INR';

  const budgetMatch = text.match(/(?:₹|\$|€|inr|usd|eur|rs\.?)?\s*([\d,]{3,9})(?:\s*(?:k|thousand))?/i);
  let budget = defaults?.budget || 80000;
  // Avoid matching day count or traveller count as budget
  const explicitBudgetMatch = text.match(
    /(?:budget(?:\s+is|\s+of)?|around|under|max|for)\s*(?:₹|\$|€|inr|usd|eur|rs\.?)?\s*([\d,]{2,9})(\s*k)?|(?:₹|\$|€)\s*([\d,]{2,9})(\s*k)?/i
  );
  if (explicitBudgetMatch) {
    const raw = (explicitBudgetMatch[1] || explicitBudgetMatch[3] || '').replace(/,/g, '');
    const hasK = Boolean(explicitBudgetMatch[2] || explicitBudgetMatch[4]);
    const parsed = Number(raw);
    if (!Number.isNaN(parsed) && parsed > 0) {
      budget = hasK ? parsed * 1000 : parsed;
    }
  } else if (budgetMatch) {
    const raw = Number(budgetMatch[1].replace(/,/g, ''));
    if (raw >= 500) {
      budget = /k\b/i.test(budgetMatch[0]) ? raw * 1000 : raw;
    }
  }

  // Month
  const monthMatch = text.match(
    /\b(january|february|march|april|may|june|july|august|september|october|november|december)\b/i
  );
  const travelMonth = monthMatch ? monthMatch[1][0].toUpperCase() + monthMatch[1].slice(1).toLowerCase() : defaults?.travelMonth;

  // Interests
  const keywordInterests: Array<[RegExp, string]> = [
    [/beach|coast|sea|ocean|island/i, 'Beaches'],
    [/cafe|coffee|bakery|food|dining|restaurant/i, 'Cafes'],
    [/peaceful|quiet|calm|serene|relax|crowd/i, 'Peaceful Places'],
    [/mountain|hike|trek|alpine|ridge/i, 'Mountains'],
    [/temple|culture|history|heritage|museum/i, 'Culture'],
    [/adventure|surf|raft|climb/i, 'Adventure'],
    [/wellness|spa|yoga/i, 'Wellness'],
  ];
  const interests = keywordInterests.filter(([rx]) => rx.test(lower)).map(([, label]) => label);

  const avoidCrowds = /no crowd|not crowded|quiet|peaceful|hidden|less crowded/i.test(lower) || Boolean(defaults?.avoidCrowds);
  const pace: 'relaxed' | 'balanced' | 'active' =
    /relax|slow|peaceful|chill/i.test(lower)
      ? 'relaxed'
      : /pack|adventure|active|fast/i.test(lower)
      ? 'active'
      : defaults?.pace || 'balanced';

  const hotelTier: 'budget' | 'boutique' | 'luxury' =
    /cheap|budget|affordable|cheaper|save/i.test(lower)
      ? 'budget'
      : /luxury|5 star|five star|villa|resort/i.test(lower)
      ? 'luxury'
      : defaults?.hotelTier || 'boutique';

  return {
    origin,
    destination,
    durationDays,
    travellers,
    budget,
    currency,
    interests: interests.length > 0 ? interests : defaults?.interests || ['Nature', 'Cafes'],
    travelMonth,
    pace,
    hotelTier,
    avoidCrowds,
  };
}

export function convertCurrency(amount: number, from: string, to: string): number {
  const fromInfo = INDICATIVE_CURRENCY_RATES_FROM_INR[from.toUpperCase()] || INDICATIVE_CURRENCY_RATES_FROM_INR.INR;
  const toInfo = INDICATIVE_CURRENCY_RATES_FROM_INR[to.toUpperCase()] || INDICATIVE_CURRENCY_RATES_FROM_INR.INR;
  const amountInInr = amount / fromInfo.rate;
  return Math.round(amountInInr * toInfo.rate * 100) / 100;
}

export function calculateBudgetBreakdown(
  totalBudget: number,
  hotelCostTotal: number,
  flightCostTotal: number
): BudgetBreakdown {
  const safeTotal = Math.max(1000, totalBudget);
  const flights = Math.min(Math.round(safeTotal * 0.42), Math.max(Math.round(safeTotal * 0.25), flightCostTotal));
  const hotels = Math.min(Math.round(safeTotal * 0.36), Math.max(Math.round(safeTotal * 0.18), hotelCostTotal));
  const remaining = Math.max(0, safeTotal - flights - hotels);

  const localTransport = Math.round(remaining * 0.22);
  const food = Math.round(remaining * 0.32);
  const sightseeing = Math.round(remaining * 0.18);
  const activities = Math.round(remaining * 0.12);
  const shopping = Math.round(remaining * 0.08);
  const allocated = flights + hotels + localTransport + food + sightseeing + activities + shopping;
  const emergencyReserve = Math.max(0, safeTotal - allocated);

  return {
    flights,
    hotels,
    localTransport,
    food,
    sightseeing,
    shopping,
    activities,
    emergencyReserve,
  };
}

export function rankHotels(
  hotels: HotelOption[],
  criteria: {
    destinationId?: string;
    maxNightlyInr?: number;
    preferredTier?: 'budget' | 'boutique' | 'luxury';
    interests?: string[];
    avoidCrowds?: boolean;
  }
): HotelOption[] {
  let pool = hotels;
  if (criteria.destinationId) {
    const matching = hotels.filter((h) => h.destinationId === criteria.destinationId);
    if (matching.length > 0) {
      pool = matching;
    } else {
      // Synthesize realistic local hotels for any worldwide destination
      const dest = resolveOrSynthesizeDestination(criteria.destinationId);
      pool = synthesizeHotelsForDestination(dest);
    }
  }

  return pool
    .map((hotel) => {
      let score = 50;
      const reasons: string[] = [];

      if (criteria.maxNightlyInr) {
        if (hotel.pricePerNightInr <= criteria.maxNightlyInr) {
          score += 22;
          reasons.push('fits comfortably within your nightly budget');
        } else {
          const overRatio = (hotel.pricePerNightInr - criteria.maxNightlyInr) / criteria.maxNightlyInr;
          score -= Math.min(25, Math.round(overRatio * 30));
        }
      }

      if (criteria.preferredTier && hotel.tier === criteria.preferredTier) {
        score += 14;
        reasons.push(`matches your ${criteria.preferredTier} stay style`);
      }

      if (hotel.distanceToCenterKm <= 2.0) {
        score += 10;
        reasons.push('offers easy access to nearby cafés and sightseeing');
      }

      if (hotel.rating >= 4.8) {
        score += 10;
        reasons.push('maintains consistently strong guest reviews');
      }

      if (criteria.avoidCrowds && hotel.area.toLowerCase().includes('quiet')) {
        score += 8;
        reasons.push('sits in a calmer neighborhood away from heavy crowds');
      }

      const reasonText =
        reasons.length > 0
          ? `Recommended because it ${reasons.slice(0, 2).join(' and ')}.`
          : `Recommended for its ${hotel.rating.toFixed(1)} rating and proximity to ${hotel.area}.`;

      return {
        ...hotel,
        matchScore: Math.max(40, Math.min(99, score)),
        recommendationReason: reasonText,
      };
    })
    .sort((a, b) => (b.matchScore || 0) - (a.matchScore || 0));
}

export function buildDeterministicItinerary(req: ExtractedRequirements, tripId?: string): Itinerary {
  const dest = resolveOrSynthesizeDestination(req.destination);

  const budgetInInr = req.currency === 'INR' ? req.budget : convertCurrency(req.budget, req.currency, 'INR');
  const nightlyTargetInr = Math.max(2500, Math.round((budgetInInr * 0.32) / Math.max(1, req.durationDays - 1)));

  const rankedHotels = rankHotels(HOTELS, {
    destinationId: dest.id,
    maxNightlyInr: nightlyTargetInr,
    preferredTier: req.hotelTier,
    interests: req.interests,
    avoidCrowds: req.avoidCrowds,
  });
  const selectedHotel = rankedHotels[0];

  const flights = getFlightsForRoute(req.origin, dest.name);
  const flightTotalInr = Math.min(
    Math.round(budgetInInr * 0.42),
    (flights[0]?.priceInr || 22000) * Math.max(1, Math.min(req.travellers, 2))
  );
  const hotelTotalInr = (selectedHotel?.pricePerNightInr || 6000) * Math.max(1, req.durationDays - 1);

  const breakdownInr = calculateBudgetBreakdown(budgetInInr, hotelTotalInr, flightTotalInr);
  const toTarget = (valInr: number) =>
    req.currency === 'INR' ? Math.round(valInr) : Math.round(convertCurrency(valInr, 'INR', req.currency));

  const budgetBreakdown: BudgetBreakdown = {
    flights: toTarget(breakdownInr.flights),
    hotels: toTarget(breakdownInr.hotels),
    localTransport: toTarget(breakdownInr.localTransport),
    food: toTarget(breakdownInr.food),
    sightseeing: toTarget(breakdownInr.sightseeing),
    shopping: toTarget(breakdownInr.shopping),
    activities: toTarget(breakdownInr.activities),
    emergencyReserve: toTarget(breakdownInr.emergencyReserve),
  };

  const season = resolveSeason(req.travelMonth, dest.coordinates.lat);
  const seasonalProfile = getSeasonalProfile(dest.name, season);

  const placesPool = req.avoidCrowds
    ? [...dest.places].sort((a, b) => (a.crowdLevel === 'Quiet' ? -1 : b.crowdLevel === 'Quiet' ? 1 : 0))
    : dest.places;
  const nonAirportPlaces = placesPool.filter((p) => p.type !== 'Airport');
  const airport = dest.places.find((p) => p.type === 'Airport') || dest.places[0];
  const transportCatalog = getTransportOptions(dest.id);

  const days: TripDay[] = Array.from({ length: req.durationDays }, (_, idx): TripDay => {
    const dayNum = idx + 1;
    const basePlaceIdx = idx * 2;
    const p1 = nonAirportPlaces[basePlaceIdx % nonAirportPlaces.length] || airport;
    const p2 = nonAirportPlaces[(basePlaceIdx + 1) % nonAirportPlaces.length] || airport;
    const p3 = nonAirportPlaces[(basePlaceIdx + 2) % nonAirportPlaces.length] || airport;
    const seasonalFood = seasonalProfile.signatureFoods[idx % seasonalProfile.signatureFoods.length];

    if (dayNum === 1) {
      const day1Activities: TripDay['activities'] = [
        {
          id: 'd1-a1',
          timeOfDay: 'Morning',
          title: `Arrive at ${airport.name}`,
          description: `Smooth airport pickup and luggage drop at ${selectedHotel?.name || 'your boutique stay'}.`,
          location: airport.name,
          lat: airport.lat,
          lng: airport.lng,
          estimatedCost: 0,
          durationHours: 2,
          category: 'transit',
          crowdLevel: 'Moderate',
        },
        {
          id: 'd1-a2',
          timeOfDay: 'Afternoon',
          title: `Iconic Stroll: ${p1.name}`,
          description: p1.description,
          location: p1.name,
          lat: p1.lat,
          lng: p1.lng,
          estimatedCost: toTarget(p1.estimatedEntryInr || 800),
          durationHours: 2.5,
          category: p1.type === 'Cafe & Food' ? 'food' : 'sightseeing',
          crowdLevel: p1.crowdLevel,
        },
        {
          id: 'd1-a3',
          timeOfDay: 'Evening',
          title: `Welcome Dinner: Savoring ${seasonalFood}`,
          description: `Relaxed regional dinner showcasing authentic ${dest.name} flavors, including seasonal ${seasonalFood}.`,
          location: selectedHotel?.area || dest.name,
          lat: selectedHotel?.lat || dest.coordinates.lat,
          lng: selectedHotel?.lng || dest.coordinates.lng,
          estimatedCost: toTarget(1800),
          durationHours: 2,
          category: 'food',
          crowdLevel: 'Quiet',
        },
      ];
      return {
        day: 1,
        title: `Arrival in ${dest.name} & Iconic Immersion`,
        summary: `Touch down from ${req.origin}, transfer to ${selectedHotel?.area || dest.name}, and enjoy an unhurried walk near ${p1.name}.`,
        hotelName: selectedHotel?.name || `${dest.name} Sanctuary`,
        transport: [transportCatalog[0]].filter(Boolean),
        estimatedCost: toTarget(2800 + (selectedHotel?.pricePerNightInr || 5000)),
        activities: day1Activities,
      };
    }

    if (dayNum === req.durationDays) {
      return {
        day: dayNum,
        title: `Morning Farewell Reflections & Departure to ${req.origin}`,
        summary: `Slow breakfast, quiet artisan market stop in ${selectedHotel?.area || dest.name}, and stress-free airport transfer.`,
        hotelName: 'Departure Day',
        transport: [transportCatalog[0]].filter(Boolean),
        estimatedCost: toTarget(2200),
        activities: [
          {
            id: `d${dayNum}-a1`,
            timeOfDay: 'Morning',
            title: `Artisan Souvenirs & Farewell Stroll near ${p1.name}`,
            description: `Pick up authentic handcrafted mementos and enjoy a slow morning coffee in ${selectedHotel?.area || dest.name} before checkout.`,
            location: p1.name,
            lat: p1.lat,
            lng: p1.lng,
            estimatedCost: toTarget(650),
            durationHours: 2,
            category: 'wellness',
            crowdLevel: 'Quiet',
          },
          {
            id: `d${dayNum}-a2`,
            timeOfDay: 'Afternoon',
            title: `Airport Transfer to ${airport.name}`,
            description: `Recommended 3-hour buffer prior to your return flight to ${req.origin}.`,
            location: airport.name,
            lat: airport.lat,
            lng: airport.lng,
            estimatedCost: toTarget(1450),
            durationHours: 2.5,
            category: 'transit',
            crowdLevel: 'Moderate',
          },
        ],
      };
    }

    return {
      day: dayNum,
      title: `Exploring ${p1.name} & ${p2.name}`,
      summary: req.avoidCrowds
        ? `Early-morning pacing to experience ${p1.name} before mid-day visitors arrive, followed by ${p2.name}.`
        : `Balanced full-day discovery combining iconic ${p1.name}, ${p2.name}, and local culinary stops.`,
      hotelName: selectedHotel?.name || `${dest.name} Sanctuary`,
      transport: transportCatalog.slice(1, 2),
      estimatedCost: toTarget((selectedHotel?.pricePerNightInr || 5000) + 2900),
      activities: [
        {
          id: `d${dayNum}-a1`,
          timeOfDay: 'Morning',
          title: p1.name,
          description: p1.description,
          location: p1.name,
          lat: p1.lat,
          lng: p1.lng,
          estimatedCost: toTarget(p1.estimatedEntryInr || 450),
          durationHours: 3,
          category: p1.type === 'Cafe & Food' ? 'food' : 'nature',
          crowdLevel: p1.crowdLevel,
        },
        {
          id: `d${dayNum}-a2`,
          timeOfDay: 'Afternoon',
          title: p2.name,
          description: p2.description,
          location: p2.name,
          lat: p2.lat,
          lng: p2.lng,
          estimatedCost: toTarget(p2.estimatedEntryInr || 900),
          durationHours: 2.5,
          category: p2.type === 'Cafe & Food' ? 'food' : 'sightseeing',
          crowdLevel: p2.crowdLevel,
        },
        {
          id: `d${dayNum}-a3`,
          timeOfDay: 'Late Afternoon',
          title: `Scenic Panorama: ${p3.name}`,
          description: p3.description,
          location: p3.name,
          lat: p3.lat,
          lng: p3.lng,
          estimatedCost: toTarget(p3.estimatedEntryInr || 350),
          durationHours: 2,
          category: 'nature',
          crowdLevel: p3.crowdLevel,
        },
        {
          id: `d${dayNum}-a4`,
          timeOfDay: 'Evening',
          title: `Seasonal Dining: ${seasonalFood}`,
          description: `Unwind at a renowned neighborhood dining spot in ${selectedHotel?.area || dest.name} to savor signature ${seasonalFood}.`,
          location: selectedHotel?.area || dest.name,
          lat: (selectedHotel?.lat || dest.coordinates.lat) + 0.008,
          lng: (selectedHotel?.lng || dest.coordinates.lng) - 0.006,
          estimatedCost: toTarget(1650),
          durationHours: 2,
          category: 'food',
          crowdLevel: req.avoidCrowds ? 'Quiet' : 'Moderate',
        },
      ],
    };
  });

  const estimatedTotal = Object.values(budgetBreakdown).reduce((acc, v) => acc + v, 0);
  const now = new Date().toISOString();

  const candidate: Itinerary = {
    id: tripId || `trip-${dest.id}-${Date.now().toString(36)}`,
    tripName: `${dest.name} ${seasonalProfile.label} & Iconic Discovery`,
    origin: req.origin,
    destination: dest.name,
    destinationId: dest.id,
    durationDays: req.durationDays,
    travellers: req.travellers,
    currency: req.currency,
    estimatedTotal,
    targetBudget: req.budget,
    travelMonth: req.travelMonth || seasonalProfile.label,
    season: seasonalProfile.season,
    seasonalHighlights: seasonalProfile.seasonalHighlights,
    signatureFoods: seasonalProfile.signatureFoods,
    packingAdvice: seasonalProfile.packingAdvice,
    coordinates: dest.coordinates,
    pace: req.pace,
    interests: req.interests,
    days,
    selectedHotel,
    recommendations: [
      `Seasonal Highlight (${seasonalProfile.label}, ${seasonalProfile.tempRange}): ${seasonalProfile.seasonalHighlights[0]}.`,
      `Signature Seasonal Cuisine: Don’t miss authentic ${seasonalProfile.signatureFoods.slice(0, 3).join(', ')}.`,
      `Packing Essentials: ${seasonalProfile.packingAdvice.join('. ')}.`,
      selectedHotel?.recommendationReason || `Base yourself at ${selectedHotel?.name} in ${selectedHotel?.area}.`,
    ],
    travelTips: [
      seasonalProfile.culturalAdvisory,
      ...dest.culturalTips.slice(0, 2),
      ...dest.safetyNotes.slice(0, 1),
    ],
    budgetBreakdown,
    provenanceNote:
      'Itinerary budgets and transport fares combine indicative local estimates with simulated demo adapter rates.',
    createdAt: now,
    updatedAt: now,
  };

  return ItinerarySchema.parse(candidate);
}

export function optimizeItineraryForBudget(
  itinerary: Itinerary,
  newBudget: number
): { updated: Itinerary; changes: string[] } {
  const safeNewBudget = Math.max(15000, Math.round(newBudget));
  const newBudgetInInr =
    itinerary.currency === 'INR' ? safeNewBudget : convertCurrency(safeNewBudget, itinerary.currency, 'INR');

  const nights = Math.max(1, itinerary.durationDays - 1);
  const maxNightlyInr = Math.round((newBudgetInInr * 0.3) / nights);
  const ranked = rankHotels(HOTELS, {
    destinationId: itinerary.destinationId,
    maxNightlyInr,
    preferredTier: safeNewBudget < itinerary.targetBudget ? 'budget' : 'boutique',
  });
  const nextHotel = ranked[0] || itinerary.selectedHotel;

  const scaleFactor = itinerary.estimatedTotal > 0 ? safeNewBudget / itinerary.estimatedTotal : 1;
  const hotelTotalInr = (nextHotel?.pricePerNightInr || 4500) * nights;
  const flightInr = Math.round(
    (itinerary.currency === 'INR'
      ? itinerary.budgetBreakdown.flights
      : convertCurrency(itinerary.budgetBreakdown.flights, itinerary.currency, 'INR')) *
      Math.min(1, Math.max(0.72, scaleFactor))
  );

  const breakdownInr = calculateBudgetBreakdown(newBudgetInInr, hotelTotalInr, flightInr);
  const toTarget = (v: number) =>
    itinerary.currency === 'INR' ? Math.round(v) : Math.round(convertCurrency(v, 'INR', itinerary.currency));

  const nextBreakdown: BudgetBreakdown = {
    flights: toTarget(breakdownInr.flights),
    hotels: toTarget(breakdownInr.hotels),
    localTransport: toTarget(breakdownInr.localTransport),
    food: toTarget(breakdownInr.food),
    sightseeing: toTarget(breakdownInr.sightseeing),
    shopping: toTarget(breakdownInr.shopping),
    activities: toTarget(breakdownInr.activities),
    emergencyReserve: toTarget(breakdownInr.emergencyReserve),
  };

  const updatedDays = itinerary.days.map((d) => ({
    ...d,
    hotelName: d.day === itinerary.durationDays ? d.hotelName : nextHotel?.name || d.hotelName,
    estimatedCost: Math.max(500, Math.round(d.estimatedCost * Math.min(1.15, Math.max(0.65, scaleFactor)))),
  }));

  const changes: string[] = [];
  if (nextHotel && nextHotel.name !== itinerary.selectedHotel?.name) {
    changes.push(`Switched stay recommendation to ${nextHotel.name} (${nextHotel.tier} tier) to match the revised target.`);
  }
  if (safeNewBudget < itinerary.targetBudget) {
    changes.push('Prioritized public/shared transfers and low-entry coastal or cultural walks.');
    changes.push('Trimmed discretionary shopping and activity allowances while keeping an emergency reserve.');
  } else {
    changes.push('Expanded accommodation and flexible transit comfort across all trip days.');
  }

  const nextTotal = Object.values(nextBreakdown).reduce((a, b) => a + b, 0);
  const updated: Itinerary = ItinerarySchema.parse({
    ...itinerary,
    targetBudget: safeNewBudget,
    estimatedTotal: nextTotal,
    selectedHotel: nextHotel,
    days: updatedDays,
    budgetBreakdown: nextBreakdown,
    updatedAt: new Date().toISOString(),
  });

  return { updated, changes };
}
