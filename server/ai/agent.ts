import {
  Type,
  type Content,
  type FunctionDeclaration,
  type GenerateContentResponse,
} from '@google/genai';
import { DESTINATIONS, HOTELS, getFlightsForRoute, getTransportOptions } from '../../src/data/catalog';
import {
  buildDeterministicItinerary,
  convertCurrency,
  extractRequirementsFromText,
  optimizeItineraryForBudget,
  rankHotels,
} from '../../src/lib/travelEngine';
import {
  getSeasonalProfile,
  resolveSeason,
  type Season,
  type SeasonalProfile,
} from '../../src/lib/seasonalIntelligence';
import { resolveOrSynthesizeDestination } from '../../src/lib/worldwideDestinations';
import type {
  ChatMessage,
  HotelOption,
  Itinerary,
  ResearchSource,
  UserPreferences,
} from '../../src/types/travel';
import {
  GEMINI_MODEL,
  getGeminiClient,
  hasConfiguredGeminiKey,
  isGeminiTemporarilyExhausted,
  markGeminiQuotaExhausted,
} from './gemini';
import {
  buildTavilyChatReply,
  cleanChatReply,
  cleanPlaceTitle,
  cleanWebSnippet,
  extractPriceHint,
  getSourceDomain,
  hasConfiguredTavilyKey,
  isGeminiQuotaError,
  searchTavily,
  tavilyResultsToSources,
} from './tavilyFallback';

export interface LiveWebHighlight {
  name: string;
  detail: string;
  indicativePrice: string;
  subtitle?: string;
  url?: string;
}

const travelToolDeclarations: FunctionDeclaration[] = [
  {
    name: 'search_destinations',
    description: 'Search curated travel destinations by name, region, or travel interests.',
    parameters: {
      type: Type.OBJECT,
      properties: {
        query: { type: Type.STRING, description: 'Destination name, country, or interest keyword.' },
      },
      required: ['query'],
    },
  },
  {
    name: 'search_hotels',
    description: 'Find and rank boutique, budget, or luxury stays using live web search and curated catalog.',
    parameters: {
      type: Type.OBJECT,
      properties: {
        destinationId: { type: Type.STRING, description: 'Destination name or id anywhere worldwide (e.g. London, Paris, Tokyo, Bali, New York, Rome, Barcelona, etc.).' },
        maxNightlyInr: { type: Type.NUMBER, description: 'Maximum nightly budget in INR.' },
        preferredTier: { type: Type.STRING, description: 'Stay tier: budget, boutique, or luxury.' },
        avoidCrowds: { type: Type.BOOLEAN, description: 'Prefer quieter neighborhoods.' },
      },
      required: ['destinationId'],
    },
  },
  {
    name: 'search_flights',
    description: 'Search live flight routes, airlines, layover hubs, and typical fare ranges from origin to destination via web search.',
    parameters: {
      type: Type.OBJECT,
      properties: {
        origin: { type: Type.STRING, description: 'Departure city.' },
        destination: { type: Type.STRING, description: 'Arrival destination name.' },
      },
      required: ['origin', 'destination'],
    },
  },
  {
    name: 'search_transport',
    description: 'Retrieve local airport transfers, cabs, trains, and ferries using live web search and local mobility estimates.',
    parameters: {
      type: Type.OBJECT,
      properties: {
        destinationId: { type: Type.STRING, description: 'Destination name or id.' },
      },
      required: ['destinationId'],
    },
  },
  {
    name: 'get_currency_exchange',
    description: 'Convert an amount between currencies using indicative travel exchange rates.',
    parameters: {
      type: Type.OBJECT,
      properties: {
        amount: { type: Type.NUMBER, description: 'Numeric amount to convert.' },
        from: { type: Type.STRING, description: 'Source currency code, e.g. INR or USD.' },
        to: { type: Type.STRING, description: 'Target currency code, e.g. IDR, NPR, CHF, JPY, EUR.' },
      },
      required: ['amount', 'from', 'to'],
    },
  },
  {
    name: 'generate_itinerary',
    description: 'Construct or update a complete structured day-by-day trip itinerary with budget breakdown.',
    parameters: {
      type: Type.OBJECT,
      properties: {
        origin: { type: Type.STRING },
        destination: { type: Type.STRING },
        durationDays: { type: Type.INTEGER },
        travellers: { type: Type.INTEGER },
        budget: { type: Type.NUMBER },
        currency: { type: Type.STRING },
        travelMonth: { type: Type.STRING },
        avoidCrowds: { type: Type.BOOLEAN },
        hotelTier: { type: Type.STRING },
        interests: { type: Type.ARRAY, items: { type: Type.STRING } },
      },
      required: ['origin', 'destination', 'durationDays', 'travellers', 'budget'],
    },
  },
  {
    name: 'modify_itinerary',
    description: 'Re-optimize the current itinerary when the traveller changes budget or asks to make it cheaper.',
    parameters: {
      type: Type.OBJECT,
      properties: {
        newBudget: { type: Type.NUMBER, description: 'Revised total budget target.' },
      },
      required: ['newBudget'],
    },
  },
];

export interface AgentRunInput {
  message: string;
  history: Array<{ role: 'user' | 'assistant'; content: string }>;
  currentItinerary?: Itinerary | null;
  preferences?: UserPreferences;
}

export interface AgentRunResult {
  reply: string;
  itinerary?: Itinerary;
  hotels?: HotelOption[];
  toolsUsed: string[];
  followUpQuestions: string[];
  sources?: ResearchSource[];
  bookingLinks?: Array<{ label: string; url: string; kind: 'flights' | 'hotels' | 'transit' | 'maps' }>;
  usedLiveGemini: boolean;
  usedLiveTavily?: boolean;
  providerLabel?: string;
  warning?: string;
}

function buildDirectBookingLinks(origin: string, destination: string) {
  const o = encodeURIComponent(origin || 'Kolkata');
  const d = encodeURIComponent(destination || 'Bali');
  return [
    {
      label: `Search Flights (${origin} → ${destination})`,
      url: `https://www.google.com/travel/flights?q=Flights%20from%20${o}%20to%20${d}`,
      kind: 'flights' as const,
    },
    {
      label: `Book Stays in ${destination}`,
      url: `https://www.booking.com/searchresults.html?ss=${d}`,
      kind: 'hotels' as const,
    },
    {
      label: `Trains, Ferries & Transfers`,
      url: `https://www.rome2rio.com/s/${o}/${d}`,
      kind: 'transit' as const,
    },
    {
      label: `Explore ${destination} on Google Maps`,
      url: `https://www.google.com/maps/search/?api=1&query=${d}`,
      kind: 'maps' as const,
    },
  ];
}

export async function runTravelAgent(input: AgentRunInput): Promise<AgentRunResult> {
  const toolsUsed: string[] = [];
  let generatedItinerary: Itinerary | undefined = input.currentItinerary || undefined;
  let recommendedHotels: HotelOption[] | undefined;
  let collectedSources: ResearchSource[] = [];

  const defaults: Partial<ReturnType<typeof extractRequirementsFromText>> | undefined = input.preferences
    ? {
        origin: input.preferences.homeCity,
        currency: input.preferences.preferredCurrency,
        pace: input.preferences.travelStyle,
        hotelTier: input.preferences.hotelPreference,
        interests: input.preferences.interests,
        avoidCrowds: input.preferences.avoidCrowds,
      }
    : undefined;

  const executeTool = async (name: string, args: Record<string, unknown>) => {
    toolsUsed.push(name);
    switch (name) {
      case 'search_destinations': {
        const q = String(args.query || '').toLowerCase().trim();
        const matches = DESTINATIONS.filter(
          (d) =>
            d.name.toLowerCase().includes(q) ||
            d.country.toLowerCase().includes(q) ||
            d.tags.some((t) => t.toLowerCase().includes(q))
        );
        const resolvedList = matches.length > 0 ? matches : (q ? [resolveOrSynthesizeDestination(q)] : DESTINATIONS);
        return {
          destinations: resolvedList.map((d) => ({
            id: d.id,
            name: d.name,
            country: d.country,
            bestSeason: d.bestSeason,
            recommendedDays: d.recommendedDays,
            dailyBudgetInr: d.dailyBudgetInr,
            localTransportSummary: d.localTransportSummary,
          })),
        };
      }
      case 'search_hotels': {
        const destInput = String(args.destinationId || 'london');
        const destObj = resolveOrSynthesizeDestination(destInput);
        const tier =
          args.preferredTier === 'budget' || args.preferredTier === 'luxury'
            ? args.preferredTier
            : 'boutique';
        const ranked = rankHotels(HOTELS, {
          destinationId: destObj.id,
          maxNightlyInr: typeof args.maxNightlyInr === 'number' ? args.maxNightlyInr : undefined,
          preferredTier: tier,
          avoidCrowds: Boolean(args.avoidCrowds),
        });
        recommendedHotels = ranked.slice(0, 3);

        const webHotels = await runLiveTravelWebSearch({
          category: 'hotels',
          destination: destObj.name,
          preferencesNote: `${tier} style${args.maxNightlyInr ? `, under ₹${args.maxNightlyInr}/night` : ''}${args.avoidCrowds ? ', quiet area' : ''}`,
        });
        if (webHotels.sources.length > 0) {
          collectedSources = [...collectedSources, ...webHotels.sources].slice(0, 6);
        }

        return {
          webSearchSummary: webHotels.summary,
          webDiscoveredStays: webHotels.highlights,
          catalogStays: recommendedHotels.map((h) => ({
            id: h.id,
            name: h.name,
            area: h.area,
            pricePerNightInr: h.pricePerNightInr,
            rating: h.rating,
            tier: h.tier,
            recommendationReason: h.recommendationReason,
          })),
        };
      }
      case 'search_flights': {
        const origin = String(args.origin || 'Kolkata');
        const destination = String(args.destination || 'London');
        const [demoFlights, webFlights] = await Promise.all([
          Promise.resolve(getFlightsForRoute(origin, destination)),
          runLiveTravelWebSearch({ category: 'flights', origin, destination }),
        ]);
        if (webFlights.sources.length > 0) {
          collectedSources = [...collectedSources, ...webFlights.sources].slice(0, 6);
        }
        return {
          webSearchSummary: webFlights.summary,
          liveRouteHighlights: webFlights.highlights,
          indicativeBenchmarks: demoFlights,
          directBookingUrl: `https://www.google.com/travel/flights?q=Flights%20from%20${encodeURIComponent(origin)}%20to%20${encodeURIComponent(destination)}`,
        };
      }
      case 'search_transport': {
        const destInput = String(args.destinationId || 'london');
        const destObj = resolveOrSynthesizeDestination(destInput);
        const webTransit = await runLiveTravelWebSearch({
          category: 'transport',
          destination: destObj.name,
        });
        if (webTransit.sources.length > 0) {
          collectedSources = [...collectedSources, ...webTransit.sources].slice(0, 6);
        }
        return {
          webSearchSummary: webTransit.summary,
          liveTransitHighlights: webTransit.highlights,
          indicativeOptions: getTransportOptions(destObj.id),
        };
      }
      case 'get_currency_exchange': {
        const amount = Number(args.amount || 1000);
        const from = String(args.from || 'INR');
        const to = String(args.to || 'IDR');
        return {
          amount,
          from,
          to,
          converted: convertCurrency(amount, from, to),
          note: 'Indicative rate only; bank transaction spreads vary.',
        };
      }
      case 'generate_itinerary': {
        const extracted = extractRequirementsFromText(input.message, defaults);
        const itinerary = buildDeterministicItinerary({
          ...extracted,
          origin: String(args.origin || extracted.origin),
          destination: String(args.destination || extracted.destination),
          durationDays: Number(args.durationDays || extracted.durationDays),
          travellers: Number(args.travellers || extracted.travellers),
          budget: Number(args.budget || extracted.budget),
          currency: String(args.currency || extracted.currency),
          travelMonth: args.travelMonth ? String(args.travelMonth) : extracted.travelMonth,
          avoidCrowds: args.avoidCrowds !== undefined ? Boolean(args.avoidCrowds) : extracted.avoidCrowds,
          hotelTier:
            args.hotelTier === 'budget' || args.hotelTier === 'luxury'
              ? args.hotelTier
              : extracted.hotelTier,
          interests: Array.isArray(args.interests)
            ? args.interests.map(String)
            : extracted.interests,
        });
        generatedItinerary = itinerary;
        if (!recommendedHotels) {
          recommendedHotels = rankHotels(HOTELS, {
            destinationId: itinerary.destinationId,
            preferredTier: extracted.hotelTier,
            avoidCrowds: extracted.avoidCrowds,
          }).slice(0, 3);
        }
        if (collectedSources.length === 0) {
          const webHotels = await runLiveTravelWebSearch({
            category: 'hotels',
            destination: itinerary.destination,
            preferencesNote: `${extracted.hotelTier} stays`,
          });
          collectedSources = webHotels.sources.slice(0, 5);
        }
        return {
          status: 'generated',
          tripName: itinerary.tripName,
          season: itinerary.season,
          seasonalHighlights: itinerary.seasonalHighlights,
          signatureFoods: itinerary.signatureFoods,
          packingAdvice: itinerary.packingAdvice,
          famousPlacesIncluded: Array.from(new Set(itinerary.days.flatMap((d) => d.activities.map((a) => a.title)))).slice(0, 10),
          estimatedTotal: itinerary.estimatedTotal,
          currency: itinerary.currency,
          selectedHotel: itinerary.selectedHotel?.name,
          daysCount: itinerary.days.length,
        };
      }
      case 'modify_itinerary': {
        if (!generatedItinerary) {
          const fallbackReq = extractRequirementsFromText(input.message, defaults);
          generatedItinerary = buildDeterministicItinerary(fallbackReq);
        }
        const newBudget = Number(args.newBudget || Math.round(generatedItinerary.targetBudget * 0.78));
        const res = optimizeItineraryForBudget(generatedItinerary, newBudget);
        generatedItinerary = res.updated;
        return {
          status: 'optimized',
          newTotal: res.updated.estimatedTotal,
          selectedHotel: res.updated.selectedHotel?.name,
          changes: res.changes,
        };
      }
      default:
        return { error: `Unknown tool: ${name}` };
    }
  };

  if (!hasConfiguredGeminiKey() || isGeminiTemporarilyExhausted()) {
    return runTavilyConciergeFallback(input, defaults);
  }

  try {
    const ai = getGeminiClient();
    const extractedPre = extractRequirementsFromText(input.message, {
      ...defaults,
      origin: input.currentItinerary?.origin || defaults?.origin,
      destination: input.currentItinerary?.destination || defaults?.destination,
      durationDays: input.currentItinerary?.durationDays || defaults?.durationDays,
      travellers: input.currentItinerary?.travellers || defaults?.travellers,
    });
    const targetDest = extractedPre.destination || input.currentItinerary?.destination || 'Japan';
    const destContext = resolveOrSynthesizeDestination(targetDest);
    const targetSeason = resolveSeason(extractedPre.travelMonth || input.message, destContext.coordinates.lat);
    const seasonalContext = getSeasonalProfile(destContext.name, targetSeason);

    const systemInstruction = `You are Unseen Miles, an attentive, seasoned, and deeply knowledgeable private travel concierge.
Tagline: "Every mile planned, even the unseen ones."
Traveller saved preferences: ${JSON.stringify(input.preferences || {})}
Current active itinerary summary: ${
      generatedItinerary
        ? `${generatedItinerary.tripName} (${generatedItinerary.origin} -> ${generatedItinerary.destination}, ${generatedItinerary.durationDays} days, ${generatedItinerary.currency} ${generatedItinerary.estimatedTotal})`
        : 'None yet'
    }

Target Destination: ${destContext.name} (${destContext.country})
Detected Season & Travel Timing: ${seasonalContext.season} (${seasonalContext.label})
Weather & Climate: ${seasonalContext.weatherOverview} (Typical: ${seasonalContext.tempRange})
Seasonal Highlights: ${seasonalContext.seasonalHighlights.join('; ')}
Signature Seasonal Cuisine: ${seasonalContext.signatureFoods.join(', ')}
Packing & Attire: ${seasonalContext.packingAdvice.join('; ')}
Cultural & Practical Advisory: ${seasonalContext.culturalAdvisory}
Key Sights & Landmarks in ${destContext.name}: ${destContext.places.slice(0, 10).map((p) => `${p.name} (${p.description})`).join('; ')}

Rules & Guidelines:
1. Universal Worldwide Coverage: You support ANY destination or city worldwide (e.g. London, Paris, Tokyo, Kyoto, New York, Rome, Bali, or anywhere globally). Never restrict the user to preset locations. Always generate plans and search stays for the exact destination requested.
2. Rich, Comprehensive & Seasonal Intelligence: The user expects thorough, high-value, and seasonal advice. Provide 220–340 words of rich, beautifully structured intelligence covering:
   • Seasonal Climate & Character: Explain what makes ${seasonalContext.season} special in ${destContext.name}, temperature (${seasonalContext.tempRange}), and seasonal highlights (e.g. cherry blossom hanami, autumn koyo foliage, winter onsens & illuminations, or summer festivals).
   • Must-See Iconic Landmarks & Hidden Gems: Always highlight famous must-see landmarks (e.g. for Japan, highlight both Tokyo's iconic hubs like Senso-ji, Shibuya Crossing, and Shinjuku, and Kyoto's Fushimi Inari and Arashiyama; for London, Big Ben, Tower Bridge, and British Museum; for Paris, Eiffel Tower and Louvre). Balance iconic landmarks with mindful, uncrowded moments.
   • Seasonal Cuisine & Dining: Mention signature seasonal dishes and culinary experiences to savor during this time of year (e.g. ${seasonalContext.signatureFoods.slice(0, 3).join(', ')}).
   • Smart Transit & Packing Essentials: Provide practical transit tips (e.g. Suica/Pasmo/JR Pass in Japan, Oyster card in London) and essential seasonal attire (${seasonalContext.packingAdvice.slice(0, 2).join(', ')}).
3. Tools: Call the tools to search destinations, find real hotels and flight routes via live web search, and call generate_itinerary or modify_itinerary when the user asks to plan or adjust a trip.
4. Transparency: Never fabricate confirmed airline seat inventory or live hotel availability; clearly note when prices are indicative ranges or catalog estimates.
5. Formatting: Write clean, polished plain prose with short crisp paragraphs or clean bullet lines (•). NEVER output raw markdown formatting tokens like **bold**, *italic*, ### headers, or markdown tables because the UI renders structured itinerary, stay, budget, map, and direct booking link cards immediately below your reply.
6. Closing: End with 1–2 thoughtful follow-up questions tailored to their season, pace, and interests.`;

    const contents: Content[] = [
      ...input.history.slice(-8).map((m) => ({
        role: m.role === 'assistant' ? ('model' as const) : ('user' as const),
        parts: [{ text: m.content }],
      })),
      { role: 'user', parts: [{ text: input.message }] },
    ];

    let response: GenerateContentResponse = await ai.models.generateContent({
      model: GEMINI_MODEL,
      contents,
      config: {
        systemInstruction,
        tools: [{ functionDeclarations: travelToolDeclarations }],
      },
    });

    for (let step = 0; step < 2; step++) {
      const calls = response.functionCalls;
      if (!calls || calls.length === 0) break;

      const previousContent = response.candidates?.[0]?.content;
      if (!previousContent) break;

      contents.push(previousContent);

      const responseParts = await Promise.all(
        calls.map(async (call) => {
          const result = await executeTool(call.name || '', (call.args as Record<string, unknown>) || {});
          return {
            functionResponse: {
              id: call.id,
              name: call.name || '',
              response: result,
            },
          };
        })
      );

      contents.push({ role: 'user', parts: responseParts });

      response = await ai.models.generateContent({
        model: GEMINI_MODEL,
        contents,
        config: {
          systemInstruction,
          tools: [{ functionDeclarations: travelToolDeclarations }],
        },
      });
    }

    const rawReply =
      response.text?.trim() ||
      'I have crafted an updated travel plan with curated stays, route timing, and live booking links below.';
    const replyText = cleanChatReply(rawReply, 3800);

    if (!generatedItinerary && /\b(plan|trip|days|itinerary|budget|travel|cheaper|crowd)\b/i.test(input.message)) {
      const extracted = extractRequirementsFromText(input.message, defaults);
      generatedItinerary = buildDeterministicItinerary(extracted);
      toolsUsed.push('generate_itinerary');
    }

    const activeOrigin = generatedItinerary?.origin || defaults?.origin || 'Kolkata';
    const activeDest =
      generatedItinerary?.destination ||
      extractRequirementsFromText(input.message, defaults).destination ||
      'Bali';

    // Ensure unique sources
    const uniqueSources: ResearchSource[] = [];
    const seenUrls = new Set<string>();
    for (const s of collectedSources) {
      if (s.url && !seenUrls.has(s.url)) {
        seenUrls.add(s.url);
        uniqueSources.push(s);
      }
    }

    return {
      reply: replyText,
      itinerary: generatedItinerary,
      hotels: recommendedHotels,
      toolsUsed: Array.from(new Set(toolsUsed)),
      sources: uniqueSources.slice(0, 5),
      bookingLinks: buildDirectBookingLinks(activeOrigin, activeDest),
      followUpQuestions: buildFollowUps(input.message, generatedItinerary),
      usedLiveGemini: true,
      usedLiveTavily: collectedSources.length > 0,
      providerLabel: 'Gemini AI Concierge · Live Web Grounding',
    };
  } catch (err) {
    if (isGeminiQuotaError(err)) {
      markGeminiQuotaExhausted();
    }
    const tavilyResult = await runTavilyConciergeFallback(input, defaults);
    if (tavilyResult.usedLiveTavily) {
      return tavilyResult;
    }
    const errMsg = err instanceof Error ? err.message : 'Gemini request failed';
    return {
      ...tavilyResult,
      warning: `Live AI services are temporarily unavailable (${errMsg}). Showing curated plan — verify your API keys in Settings > Secrets.`,
    };
  }
}

async function runTavilyConciergeFallback(
  input: AgentRunInput,
  defaults?: Partial<ReturnType<typeof extractRequirementsFromText>>
): Promise<AgentRunResult> {
  const lower = input.message.toLowerCase();
  const extracted = extractRequirementsFromText(input.message, {
    ...defaults,
    origin: input.currentItinerary?.origin || defaults?.origin,
    destination: input.currentItinerary?.destination || defaults?.destination,
    durationDays: input.currentItinerary?.durationDays || defaults?.durationDays,
    travellers: input.currentItinerary?.travellers || defaults?.travellers,
  });

  let activeItinerary: Itinerary;
  let recommendedHotels: HotelOption[];
  let budgetChanges: string[] | undefined;
  let isBudgetRevision = false;

  if (input.currentItinerary && /cheaper|lower|reduce|save|under\s*\d/i.test(lower)) {
    isBudgetRevision = true;
    const targetBudget =
      extracted.budget !== 80000 && extracted.budget < input.currentItinerary.targetBudget
        ? extracted.budget
        : Math.round(input.currentItinerary.targetBudget * 0.75);
    const res = optimizeItineraryForBudget(input.currentItinerary, targetBudget);
    activeItinerary = res.updated;
    budgetChanges = res.changes;
    recommendedHotels = rankHotels(HOTELS, {
      destinationId: activeItinerary.destinationId,
      preferredTier: 'budget',
    }).slice(0, 3);
  } else {
    activeItinerary = buildDeterministicItinerary(extracted);
    recommendedHotels = rankHotels(HOTELS, {
      destinationId: activeItinerary.destinationId,
      preferredTier: extracted.hotelTier,
      avoidCrowds: extracted.avoidCrowds,
    }).slice(0, 3);
  }

  const bookingLinks = buildDirectBookingLinks(activeItinerary.origin, activeItinerary.destination);
  const tavilyQuery = `${input.message.trim()} ${activeItinerary.origin} to ${activeItinerary.destination} travel guide flights boutique hotels local transport`;
  const tavilyData = hasConfiguredTavilyKey()
    ? await searchTavily(tavilyQuery, { maxResults: 5 })
    : null;

  if (tavilyData && ((tavilyData.results && tavilyData.results.length > 0) || tavilyData.answer)) {
    const sources = tavilyResultsToSources(tavilyData.results, bookingLinks[0].url, 5);
    return {
      reply: buildTavilyChatReply({
        tavilyData,
        itinerary: activeItinerary,
        isBudgetRevision,
        budgetChanges,
      }),
      itinerary: activeItinerary,
      hotels: recommendedHotels,
      toolsUsed: isBudgetRevision
        ? ['tavily_live_search', 'modify_itinerary', 'search_hotels']
        : ['tavily_live_search', 'search_flights', 'search_hotels', 'generate_itinerary'],
      sources,
      bookingLinks,
      followUpQuestions: buildFollowUps(input.message, activeItinerary),
      usedLiveGemini: false,
      usedLiveTavily: true,
      providerLabel: 'Tavily Live Web Search',
    };
  }

  return runDeterministicFallback(input, defaults, activeItinerary, recommendedHotels, isBudgetRevision, budgetChanges);
}

function runDeterministicFallback(
  input: AgentRunInput,
  defaults?: Partial<ReturnType<typeof extractRequirementsFromText>>,
  prebuiltItinerary?: Itinerary,
  prebuiltHotels?: HotelOption[],
  isBudgetRevision = false,
  budgetChanges?: string[]
): AgentRunResult {
  const lower = input.message.toLowerCase();
  const extracted = extractRequirementsFromText(input.message, {
    ...defaults,
    origin: input.currentItinerary?.origin || defaults?.origin,
    destination: input.currentItinerary?.destination || defaults?.destination,
    durationDays: input.currentItinerary?.durationDays || defaults?.durationDays,
    travellers: input.currentItinerary?.travellers || defaults?.travellers,
  });

  if (isBudgetRevision && prebuiltItinerary && budgetChanges) {
    return {
      reply: `I recalculated your ${prebuiltItinerary.destination} journey for ${prebuiltItinerary.currency} ${prebuiltItinerary.estimatedTotal.toLocaleString()}:\n\n• ${budgetChanges.join('\n• ')}\n\nNote: Stay and transport figures reflect indicative estimates alongside direct partner booking links below.`,
      itinerary: prebuiltItinerary,
      hotels: prebuiltHotels || [],
      toolsUsed: ['modify_itinerary', 'search_hotels', 'calculate_trip_budget'],
      bookingLinks: buildDirectBookingLinks(prebuiltItinerary.origin, prebuiltItinerary.destination),
      followUpQuestions: [
        'Would you like to swap to public rail/bus transfers where possible?',
        'Should we add another quiet morning café stop?',
      ],
      usedLiveGemini: false,
      usedLiveTavily: false,
      providerLabel: 'Unseen Miles Engine',
    };
  }

  if (input.currentItinerary && /cheaper|lower|reduce|save|under\s*\d/i.test(lower)) {
    const targetBudget =
      extracted.budget !== 80000 && extracted.budget < input.currentItinerary.targetBudget
        ? extracted.budget
        : Math.round(input.currentItinerary.targetBudget * 0.75);
    const { updated, changes } = optimizeItineraryForBudget(input.currentItinerary, targetBudget);
    const hotels = rankHotels(HOTELS, {
      destinationId: updated.destinationId,
      preferredTier: 'budget',
    }).slice(0, 3);

    return {
      reply: `I recalculated your ${updated.destination} journey for ${updated.currency} ${updated.estimatedTotal.toLocaleString()}:\n\n• ${changes.join('\n• ')}\n\nNote: Stay and transport figures reflect indicative estimates alongside direct partner booking links below.`,
      itinerary: updated,
      hotels,
      toolsUsed: ['modify_itinerary', 'search_hotels', 'calculate_trip_budget'],
      bookingLinks: buildDirectBookingLinks(updated.origin, updated.destination),
      followUpQuestions: [
        'Would you like to swap to public rail/bus transfers where possible?',
        'Should we add another quiet morning café stop?',
      ],
      usedLiveGemini: false,
      usedLiveTavily: false,
      providerLabel: 'Unseen Miles Engine',
    };
  }

  const itinerary = prebuiltItinerary || buildDeterministicItinerary(extracted);
  const hotels =
    prebuiltHotels ||
    rankHotels(HOTELS, {
      destinationId: itinerary.destinationId,
      preferredTier: extracted.hotelTier,
      avoidCrowds: extracted.avoidCrowds,
    }).slice(0, 3);

  const season = resolveSeason(extracted.travelMonth || input.message, itinerary.coordinates?.lat || 35);
  const seasonalProfile = getSeasonalProfile(itinerary.destination, season);
  const destObj = resolveOrSynthesizeDestination(itinerary.destination);
  const topLandmarks = destObj.places.slice(0, 6).map((p) => p.name).join(', ');

  const replyLines = [
    `I have prepared a detailed ${itinerary.durationDays}-day ${itinerary.destination} journey from ${itinerary.origin} for ${itinerary.travellers} travellers, crafted specifically for the ${seasonalProfile.label}.`,
    `• Season & Weather (${seasonalProfile.season}): ${seasonalProfile.weatherOverview} Typical daytime temperatures hover around ${seasonalProfile.tempRange}.`,
    `• Iconic Landmarks Featured: ${topLandmarks}.`,
    `• Signature Seasonal Cuisine: Don’t miss authentic ${seasonalProfile.signatureFoods.slice(0, 4).join(', ')}.`,
    `• Selected Stay: ${itinerary.selectedHotel?.name} in ${itinerary.selectedHotel?.area} (${itinerary.currency} ${itinerary.selectedHotel?.pricePerNightInr.toLocaleString()}/night).`,
    `• Estimated Total Budget: ${itinerary.currency} ${itinerary.estimatedTotal.toLocaleString()} across return flights, stays, transit, and curated meals.`,
    `• Smart Essentials & Attire: ${seasonalProfile.packingAdvice.join('; ')}.`,
    `Your complete day-by-day itinerary with morning, afternoon, sunset, and evening experiences, hotel comparisons, and interactive maps is detailed below. Use the direct partner links to check live availability and locked rates.`,
  ];

  return {
    reply: replyLines.join('\n\n'),
    itinerary,
    hotels,
    toolsUsed: ['extract_requirements', 'search_hotels', 'calculate_trip_budget', 'generate_itinerary'],
    bookingLinks: buildDirectBookingLinks(itinerary.origin, itinerary.destination),
    followUpQuestions: buildFollowUps(input.message, itinerary),
    usedLiveGemini: false,
    usedLiveTavily: false,
    providerLabel: 'Unseen Miles Engine',
  };
}

function buildFollowUps(userMsg: string, itinerary?: Itinerary): string[] {
  if (!itinerary) {
    return [
      'Plan a 5-day calm Bali getaway from Kolkata under ₹80,000',
      'Compare peaceful lakeside stays in Pokhara, Nepal',
      'Suggest scenic Swiss Alps rail passes for 6 days',
    ];
  }
  if (/cheap|budget|lower/i.test(userMsg)) {
    return [
      `Switch ${itinerary.destination} stays to a boutique garden tier`,
      'Show direct flight and airport transfer links',
    ];
  }
  return [
    `Make this ${itinerary.destination} trip 20% cheaper`,
    'Find quieter boutique hotels near artisan cafés',
  ];
}

export async function runDestinationResearch(destination: string, focus?: string): Promise<{
  summary: string;
  sources: ResearchSource[];
  providerLabel: string;
}> {
  const tavilyKey = process.env.TAVILY_API_KEY?.trim();
  const query = `${destination} travel guide ${focus || 'best peaceful places, local transport, cafes, safety tips'}`;

  if (tavilyKey) {
    try {
      const resp = await fetch('https://api.tavily.com/search', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          api_key: tavilyKey,
          query,
          search_depth: 'basic',
          max_results: 4,
          include_answer: true,
        }),
      });
      if (resp.ok) {
        const data = (await resp.json()) as {
          answer?: string;
          results?: Array<{ title?: string; url?: string; content?: string }>;
        };
        return {
          summary: cleanWebSnippet(
            data.answer || `Live web research summary for ${destination}.`,
            540
          ),
          sources: (data.results || []).map((r) => ({
            title: cleanWebSnippet(r.title || 'Travel Source', 68),
            url: r.url || 'https://www.google.com/travel',
            snippet: cleanWebSnippet(r.content || '', 160),
          })),
          providerLabel: 'Tavily Live Web Research',
        };
      }
    } catch {
      // Fallback to Gemini Search Grounding
    }
  }

  if (hasConfiguredGeminiKey() && !isGeminiTemporarilyExhausted()) {
    try {
      const ai = getGeminiClient();
      const response = await ai.models.generateContent({
        model: GEMINI_MODEL,
        contents: `Provide a concise, practical travel brief for ${destination} covering ${focus || 'best peaceful spots, cafés, local transport tips, and safety'}.`,
        config: {
          tools: [{ googleSearch: {} }],
        },
      });
      const chunks = response.candidates?.[0]?.groundingMetadata?.groundingChunks || [];
      const sources: ResearchSource[] = chunks
        .filter((c) => c.web?.uri)
        .slice(0, 4)
        .map((c) => ({
          title: cleanWebSnippet(c.web?.title || 'Web Source', 68),
          url: c.web?.uri || '',
          snippet: 'Google Search Grounding citation',
        }));

      return {
        summary: cleanWebSnippet(response.text || `Travel insights for ${destination}.`, 540),
        sources,
        providerLabel: 'Gemini Search Grounding',
      };
    } catch (err) {
      if (isGeminiQuotaError(err)) {
        markGeminiQuotaExhausted();
      }
      // Fall through to catalog research
    }
  }

  const destObj = DESTINATIONS.find(
    (d) => d.name.toLowerCase() === destination.toLowerCase() || d.id === destination.toLowerCase()
  );
  return {
    summary: destObj
      ? `${destObj.description} Local transport: ${destObj.localTransportSummary}`
      : `Curated regional travel guidance for ${destination}.`,
    sources: [],
    providerLabel: 'Curated Regional Profile',
  };
}

export async function translateTravelPhrase(phrase: string, targetLanguage: string): Promise<{
  translated: string;
  pronunciation: string;
  culturalNote: string;
  usedLiveGemini: boolean;
  providerLabel?: string;
}> {
  if (hasConfiguredGeminiKey() && !isGeminiTemporarilyExhausted()) {
    try {
      const ai = getGeminiClient();
      const response = await ai.models.generateContent({
        model: GEMINI_MODEL,
        contents: `Translate this short travel phrase into ${targetLanguage} and provide phonetic pronunciation and a 1-sentence politeness note: "${phrase}"`,
        config: {
          responseMimeType: 'application/json',
          responseSchema: {
            type: Type.OBJECT,
            properties: {
              translated: { type: Type.STRING },
              pronunciation: { type: Type.STRING },
              culturalNote: { type: Type.STRING },
            },
            required: ['translated', 'pronunciation', 'culturalNote'],
          },
        },
      });

      const parsed = JSON.parse((response.text || '{}').trim()) as {
        translated?: string;
        pronunciation?: string;
        culturalNote?: string;
      };
      return {
        translated: parsed.translated || phrase,
        pronunciation: parsed.pronunciation || '',
        culturalNote: parsed.culturalNote || '',
        usedLiveGemini: true,
        providerLabel: 'Gemini AI Translator',
      };
    } catch (err) {
      if (isGeminiQuotaError(err)) {
        markGeminiQuotaExhausted();
      }
      // Fall through to Tavily translation lookup below
    }
  }

  if (hasConfiguredTavilyKey()) {
    const tavilyData = await searchTavily(
      `how to say "${phrase}" in ${targetLanguage} translation and pronunciation`,
      { maxResults: 3 }
    );
    if (tavilyData && (tavilyData.answer || (tavilyData.results && tavilyData.results.length > 0))) {
      const answerText = cleanWebSnippet(
        tavilyData.answer || tavilyData.results?.[0]?.content || phrase,
        240
      );
      const sourceNote = tavilyData.results?.[0]?.url
        ? `Live web translation lookup via ${getSourceDomain(tavilyData.results[0].url)}.`
        : 'Live web translation lookup via Tavily.';
      return {
        translated: answerText,
        pronunciation: `Target language: ${targetLanguage}`,
        culturalNote: sourceNote,
        usedLiveGemini: false,
        providerLabel: 'Tavily Live Web Search',
      };
    }
  }

  return {
    translated: phrase,
    pronunciation: 'Use the curated destination phrasebook above for verified local phrases.',
    culturalNote: 'Live phrase translation is temporarily cooling down; verified local expressions remain ready above.',
    usedLiveGemini: false,
    providerLabel: 'Curated Phrasebook',
  };
}

function parseOptionHighlights(rawText: string): {
  summary: string;
  highlights: LiveWebHighlight[];
} {
  const highlights: LiveWebHighlight[] = [];
  for (const line of rawText.split('\n')) {
    const cleaned = line
      .replace(/^[\d.)\-*•\s]+/, '')
      .replace(/^\*+|\*+$/g, '')
      .trim();
    const optMatch = cleaned.match(/^OPTION:\s*(.+)$/i);
    if (optMatch) {
      const parts = optMatch[1].split('|').map((p) => p.trim());
      if (parts[0]) {
        highlights.push({
          name: cleanWebSnippet(parts[0], 72),
          detail: cleanWebSnippet(parts[1] || 'Live web-grounded travel option', 140),
          indicativePrice: cleanWebSnippet(parts[2] || 'Check live fare', 40),
        });
      }
    }
  }

  // Secondary fallback: if model used "|" or " — " bullets without "OPTION:", still build clean cards
  if (highlights.length === 0) {
    for (const line of rawText.split('\n')) {
      const cleaned = line.replace(/^[\d.)\-*•\s]+/, '').trim();
      if (cleaned.includes('|') && cleaned.length > 15 && highlights.length < 3) {
        const parts = cleaned.split('|').map((p) => p.trim());
        if (parts[0]) {
          highlights.push({
            name: cleanWebSnippet(parts[0], 72),
            detail: cleanWebSnippet(parts[1] || 'Grounded route option', 140),
            indicativePrice: cleanWebSnippet(parts[2] || 'Check live fare', 40),
          });
        }
      }
    }
  }

  const summary = cleanWebSnippet(
    rawText
      .split('\n')
      .filter((l) => !/OPTION:/i.test(l) && !(highlights.length > 0 && l.includes('|')))
      .join(' '),
    480
  );

  return { summary, highlights };
}

function buildBookingSearchUrl(
  category: 'hotels' | 'flights' | 'transport',
  destination: string,
  origin: string,
  itemName?: string
): string {
  const destEnc = encodeURIComponent(destination);
  const origEnc = encodeURIComponent(origin);
  if (category === 'flights') {
    return `https://www.google.com/travel/flights?q=Flights%20from%20${origEnc}%20to%20${destEnc}`;
  }
  if (category === 'hotels') {
    const query = itemName ? `${itemName} ${destination}` : destination;
    return `https://www.booking.com/searchresults.html?ss=${encodeURIComponent(query)}`;
  }
  return `https://www.rome2rio.com/s/${origEnc}/${destEnc}`;
}

export async function runLiveTravelWebSearch(params: {
  category: 'hotels' | 'flights' | 'transport';
  destination: string;
  origin?: string;
  preferencesNote?: string;
}): Promise<{
  summary: string;
  highlights: LiveWebHighlight[];
  sources: ResearchSource[];
  providerLabel: string;
  bookingLinks: Array<{ label: string; url: string }>;
}> {
  const { category, destination, origin = 'Kolkata', preferencesNote = '' } = params;
  const queryPrompt =
    category === 'flights'
      ? `Current airline routes, flight durations, connecting hubs, and typical fare ranges in Indian Rupees (INR) for flights from ${origin} to ${destination}. ${preferencesNote}`
      : category === 'hotels'
      ? `Best-rated peaceful boutique, budget, and luxury hotels or stays in ${destination} with neighborhood names and typical nightly price ranges in INR or USD. ${preferencesNote}`
      : `Best local transportation options in ${destination} including airport transfers, metered taxis or ride-hailing apps, trains or ferries, and typical fare ranges in INR or local currency. ${preferencesNote}`;

  const bookingLinks =
    category === 'flights'
      ? [
          {
            label: `Google Flights (${origin} → ${destination})`,
            url: `https://www.google.com/travel/flights?q=Flights%20from%20${encodeURIComponent(origin)}%20to%20${encodeURIComponent(destination)}`,
          },
          {
            label: `Skyscanner Routes`,
            url: `https://www.skyscanner.co.in/transport/flights-from/${encodeURIComponent(origin.toLowerCase())}/`,
          },
        ]
      : category === 'hotels'
      ? [
          {
            label: `Booking.com (${destination})`,
            url: `https://www.booking.com/searchresults.html?ss=${encodeURIComponent(destination)}`,
          },
          {
            label: `Google Hotels (${destination})`,
            url: `https://www.google.com/travel/hotels/${encodeURIComponent(destination)}`,
          },
        ]
      : [
          {
            label: `Rome2Rio Local Routes`,
            url: `https://www.rome2rio.com/s/${encodeURIComponent(origin)}/${encodeURIComponent(destination)}`,
          },
          {
            label: `Google Maps Transit (${destination})`,
            url: `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(destination + ' airport transfer')}`,
          },
        ];

  const tavilyKey = process.env.TAVILY_API_KEY?.trim();
  if (tavilyKey) {
    try {
      const controller = new AbortController();
      const timer = setTimeout(() => controller.abort(), 4000);
      const resp = await fetch('https://api.tavily.com/search', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        signal: controller.signal,
        body: JSON.stringify({
          api_key: tavilyKey,
          query: queryPrompt,
          search_depth: 'basic',
          max_results: 5,
          include_answer: true,
        }),
      });
      clearTimeout(timer);
      if (resp.ok) {
        const data = (await resp.json()) as {
          answer?: string;
          results?: Array<{ title?: string; url?: string; content?: string }>;
        };
        const rawResults = data.results || [];
        const sources: ResearchSource[] = rawResults.map((r) => ({
          title: cleanWebSnippet(r.title || 'Web Source', 68),
          url: r.url || bookingLinks[0].url,
          snippet: cleanWebSnippet(r.content || '', 160),
        }));

        return {
          summary: cleanWebSnippet(
            data.answer || `Live web search findings for ${category} in ${destination}.`,
            480
          ),
          highlights: rawResults.slice(0, 3).map((r) => ({
            name: cleanPlaceTitle(r.title || `${destination} ${category} listing`, 68),
            subtitle: getSourceDomain(r.url),
            detail: cleanWebSnippet(r.content || 'Verified web travel guide.', 140),
            indicativePrice: extractPriceHint(r.content || '', getSourceDomain(r.url)),
            url: r.url || bookingLinks[0].url,
          })),
          sources,
          providerLabel: 'Tavily Live Web Search',
          bookingLinks,
        };
      }
    } catch {
      // Fall through to Gemini Search Grounding
    }
  }

  if (hasConfiguredGeminiKey() && !isGeminiTemporarilyExhausted()) {
    try {
      const ai = getGeminiClient();
      const response = await ai.models.generateContent({
        model: GEMINI_MODEL,
        contents: `${queryPrompt}

Respond clearly in plain text with:
1. A brief 2-sentence overview noting that live inventory/pricing varies by travel date.
2. Three concrete options formatted as:
OPTION: <Name or Route> | <Key detail, neighborhood or duration> | <Typical indicative price range>`,
        config: {
          tools: [{ googleSearch: {} }],
        },
      });

      const parsed = parseOptionHighlights(response.text || '');
      const chunks = response.candidates?.[0]?.groundingMetadata?.groundingChunks || [];
      const sources: ResearchSource[] = chunks
        .filter((c) => c.web?.uri)
        .slice(0, 5)
        .map((c) => ({
          title: cleanWebSnippet(c.web?.title || 'Web Search Result', 68),
          url: c.web?.uri || '',
          snippet: 'Google Search Grounding source',
        }));

      return {
        summary: parsed.summary || `Live web-grounded ${category} research for ${destination}.`,
        highlights: parsed.highlights.map((h) => ({
          ...h,
          url: buildBookingSearchUrl(category, destination, origin, h.name),
        })),
        sources,
        providerLabel: 'Gemini Live Web Search Grounding',
        bookingLinks,
      };
    } catch (err) {
      if (isGeminiQuotaError(err)) {
        markGeminiQuotaExhausted();
      }
      // Fall through to Meta / curated fallback
    }
  }

  return {
    summary: `Showing curated benchmarks and direct partner search links for ${category} in ${destination}.`,
    highlights: [],
    sources: [],
    providerLabel: 'Curated Benchmarks + Direct Booking Links',
    bookingLinks,
  };
}

export interface SuggestedPlaceCard {
  name: string;
  countryOrRegion: string;
  tagline: string;
  highlights: string[];
  bestSeason: string;
  indicativeDailyBudget: string;
  mapsUrl: string;
}

export async function suggestPlacesWithAI(query: string): Promise<{
  summary: string;
  places: SuggestedPlaceCard[];
  sources: ResearchSource[];
  providerLabel: string;
}> {
  const cleanQuery = query.trim();
  const buildMapsUrl = (name: string, region: string) =>
    `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(`${name} ${region}`)}`;

  const tavilyKey = process.env.TAVILY_API_KEY?.trim();
  if (tavilyKey) {
    try {
      const resp = await fetch('https://api.tavily.com/search', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          api_key: tavilyKey,
          query: `best travel places destinations hidden gems cafes local guide for ${cleanQuery}`,
          search_depth: 'basic',
          max_results: 5,
          include_answer: true,
        }),
      });
      if (resp.ok) {
        const data = (await resp.json()) as {
          answer?: string;
          results?: Array<{ title?: string; url?: string; content?: string }>;
        };
        const rawResults = data.results || [];
        const sources: ResearchSource[] = rawResults.map((r) => ({
          title: cleanWebSnippet(r.title || 'Travel Guide', 68),
          url: r.url || 'https://www.google.com/travel',
          snippet: cleanWebSnippet(r.content || '', 150),
        }));

        if (hasConfiguredGeminiKey() && !isGeminiTemporarilyExhausted()) {
          try {
            const ai = getGeminiClient();
            const digest = rawResults
              .slice(0, 4)
              .map((r, i) => `[${i + 1}] ${r.title}: ${cleanWebSnippet(r.content || '', 260)}`)
              .join('\n');
            const synth = await ai.models.generateContent({
              model: GEMINI_MODEL,
              contents: `A traveller searched for: "${cleanQuery}".
Live web context:
${digest}

Recommend 3 distinct, specific real-world travel places or neighborhoods matching this search. Include best season, 2 specific hidden gems/spots, and indicative daily budget in INR.`,
              config: {
                responseMimeType: 'application/json',
                responseSchema: {
                  type: Type.OBJECT,
                  properties: {
                    summary: { type: Type.STRING },
                    places: {
                      type: Type.ARRAY,
                      items: {
                        type: Type.OBJECT,
                        properties: {
                          name: { type: Type.STRING },
                          countryOrRegion: { type: Type.STRING },
                          tagline: { type: Type.STRING },
                          highlights: { type: Type.ARRAY, items: { type: Type.STRING } },
                          bestSeason: { type: Type.STRING },
                          indicativeDailyBudget: { type: Type.STRING },
                        },
                        required: [
                          'name',
                          'countryOrRegion',
                          'tagline',
                          'highlights',
                          'bestSeason',
                          'indicativeDailyBudget',
                        ],
                      },
                    },
                  },
                  required: ['summary', 'places'],
                },
              },
            });
            const parsed = JSON.parse((synth.text || '{}').trim()) as {
              summary?: string;
              places?: Array<{
                name: string;
                countryOrRegion: string;
                tagline: string;
                highlights: string[];
                bestSeason: string;
                indicativeDailyBudget: string;
              }>;
            };
            if (Array.isArray(parsed.places) && parsed.places.length > 0) {
              return {
                summary: cleanWebSnippet(parsed.summary || data.answer || '', 420),
                places: parsed.places.slice(0, 3).map((p) => ({
                  name: cleanWebSnippet(p.name, 56),
                  countryOrRegion: cleanWebSnippet(p.countryOrRegion, 48),
                  tagline: cleanWebSnippet(p.tagline, 130),
                  highlights: (p.highlights || []).slice(0, 3).map((h) => cleanWebSnippet(h, 64)),
                  bestSeason: cleanWebSnippet(p.bestSeason, 42),
                  indicativeDailyBudget: cleanWebSnippet(p.indicativeDailyBudget, 36),
                  mapsUrl: buildMapsUrl(p.name, p.countryOrRegion),
                })),
                sources,
                providerLabel: 'AI Live Place Discovery (Tavily + Gemini)',
              };
            }
          } catch (err) {
            if (isGeminiQuotaError(err)) {
              markGeminiQuotaExhausted();
            }
            // Fall through to Tavily raw live web results below
          }
        }

        if (rawResults.length > 0) {
          return {
            summary: cleanWebSnippet(data.answer || `Live web travel results for "${cleanQuery}".`, 420),
            places: rawResults.slice(0, 3).map((r) => ({
              name: cleanPlaceTitle(r.title || cleanQuery, 56),
              countryOrRegion: getSourceDomain(r.url),
              tagline: cleanWebSnippet(r.content || 'Live web travel guide', 130),
              highlights: [getSourceDomain(r.url)],
              bestSeason: 'Year-round / Check guide',
              indicativeDailyBudget: extractPriceHint(r.content || '', 'View live guide'),
              mapsUrl: buildMapsUrl(cleanPlaceTitle(r.title || cleanQuery, 56), ''),
            })),
            sources,
            providerLabel: 'Tavily Live Place Search',
          };
        }
      }
    } catch {
      // Fall through to Gemini Search Grounding
    }
  }

  if (hasConfiguredGeminiKey() && !isGeminiTemporarilyExhausted()) {
    try {
      const ai = getGeminiClient();
      const response = await ai.models.generateContent({
        model: GEMINI_MODEL,
        contents: `A traveller searched for places: "${cleanQuery}".
Suggest 3 specific, calm, high-craft travel destinations or neighborhoods anywhere in the world matching this query, with hidden gems, best season, and realistic daily budget in INR.`,
        config: {
          tools: [{ googleSearch: {} }],
          responseMimeType: 'application/json',
          responseSchema: {
            type: Type.OBJECT,
            properties: {
              summary: { type: Type.STRING },
              places: {
                type: Type.ARRAY,
                items: {
                  type: Type.OBJECT,
                  properties: {
                    name: { type: Type.STRING },
                    countryOrRegion: { type: Type.STRING },
                    tagline: { type: Type.STRING },
                    highlights: { type: Type.ARRAY, items: { type: Type.STRING } },
                    bestSeason: { type: Type.STRING },
                    indicativeDailyBudget: { type: Type.STRING },
                  },
                  required: [
                    'name',
                    'countryOrRegion',
                    'tagline',
                    'highlights',
                    'bestSeason',
                    'indicativeDailyBudget',
                  ],
                },
              },
            },
            required: ['summary', 'places'],
          },
        },
      });
      const parsed = JSON.parse((response.text || '{}').trim()) as {
        summary?: string;
        places?: Array<{
          name: string;
          countryOrRegion: string;
          tagline: string;
          highlights: string[];
          bestSeason: string;
          indicativeDailyBudget: string;
        }>;
      };
      const chunks = response.candidates?.[0]?.groundingMetadata?.groundingChunks || [];
      const sources: ResearchSource[] = chunks
        .filter((c) => c.web?.uri)
        .slice(0, 4)
        .map((c) => ({
          title: cleanWebSnippet(c.web?.title || 'Travel Guide', 68),
          url: c.web?.uri || '',
          snippet: 'Google Search Grounding source',
        }));

      if (Array.isArray(parsed.places) && parsed.places.length > 0) {
        return {
          summary: cleanWebSnippet(parsed.summary || `AI place suggestions for "${cleanQuery}".`, 420),
          places: parsed.places.slice(0, 3).map((p) => ({
            name: cleanWebSnippet(p.name, 56),
            countryOrRegion: cleanWebSnippet(p.countryOrRegion, 48),
            tagline: cleanWebSnippet(p.tagline, 130),
            highlights: (p.highlights || []).slice(0, 3).map((h) => cleanWebSnippet(h, 64)),
            bestSeason: cleanWebSnippet(p.bestSeason, 42),
            indicativeDailyBudget: cleanWebSnippet(p.indicativeDailyBudget, 36),
            mapsUrl: buildMapsUrl(p.name, p.countryOrRegion),
          })),
          sources,
          providerLabel: 'Gemini AI Search Grounding',
        };
      }
    } catch (err) {
      if (isGeminiQuotaError(err)) {
        markGeminiQuotaExhausted();
      }
      // Fall through to curated matching
    }
  }

  const tokens = cleanQuery.toLowerCase().split(/\s+/).filter(Boolean);
  const matchingCatalog = DESTINATIONS.filter((d) =>
    tokens.some(
      (t) =>
        d.name.toLowerCase().includes(t) ||
        d.country.toLowerCase().includes(t) ||
        d.tags.some((tag) => tag.toLowerCase().includes(t)) ||
        d.tagline.toLowerCase().includes(t)
    )
  ).slice(0, 3);

  const fallbackList = matchingCatalog.length > 0 ? matchingCatalog : DESTINATIONS.slice(0, 3);
  return {
    summary: `Curated matches for "${cleanQuery}" from our verified destination profiles.`,
    places: fallbackList.map((d) => ({
      name: d.name,
      countryOrRegion: `${d.country} · ${d.region}`,
      tagline: d.tagline,
      highlights: d.places.slice(0, 2).map((p) => p.name),
      bestSeason: d.bestSeason,
      indicativeDailyBudget: `₹${d.dailyBudgetInr.balanced.toLocaleString()}/day`,
      mapsUrl: buildMapsUrl(d.name, d.country),
    })),
    sources: [],
    providerLabel: 'Curated Place Suggestions',
  };
}
