import { z } from 'zod';

export type DataProvenance = 'verified_live' | 'cached_research' | 'indicative_estimate' | 'demo_adapter';

export type MediaKey =
  | 'hero_alpine'
  | 'nepal'
  | 'bali'
  | 'switzerland'
  | 'japan'
  | 'italy'
  | 'boutique_villa';

export const ActivitySchema = z.object({
  id: z.string(),
  timeOfDay: z.enum(['Morning', 'Afternoon', 'Late Afternoon', 'Evening']),
  title: z.string(),
  description: z.string(),
  location: z.string(),
  lat: z.number(),
  lng: z.number(),
  estimatedCost: z.number().nonnegative(),
  durationHours: z.number().positive(),
  category: z.enum(['sightseeing', 'food', 'culture', 'nature', 'wellness', 'adventure', 'transit']),
  crowdLevel: z.enum(['Quiet', 'Moderate', 'Popular']).default('Moderate'),
});

export const HotelOptionSchema = z.object({
  id: z.string(),
  name: z.string(),
  destinationId: z.string(),
  area: z.string(),
  rating: z.number().min(1).max(5),
  reviewCount: z.number().int().nonnegative(),
  pricePerNightInr: z.number().positive(),
  tier: z.enum(['budget', 'boutique', 'luxury']),
  roomTypes: z.array(z.string()),
  distanceToCenterKm: z.number().nonnegative(),
  amenities: z.array(z.string()),
  cancellationPolicy: z.string(),
  provider: z.string(),
  availabilityStatus: z.string(),
  provenance: z.enum(['verified_live', 'cached_research', 'indicative_estimate', 'demo_adapter']),
  lat: z.number(),
  lng: z.number(),
  mediaKey: z.string(),
  recommendationReason: z.string().optional(),
  matchScore: z.number().optional(),
});

export const TransportLegSchema = z.object({
  id: z.string(),
  mode: z.enum(['Flight', 'Airport Transfer', 'Cab', 'Train', 'Bus', 'Rental Car', 'Walking']),
  route: z.string(),
  durationMinutes: z.number().positive(),
  distanceKm: z.number().nonnegative(),
  estimatedFareInr: z.number().nonnegative(),
  provider: z.string(),
  availabilityStatus: z.string(),
  provenance: z.enum(['verified_live', 'cached_research', 'indicative_estimate', 'demo_adapter']),
  bookingUrl: z.string(),
});

export const TripDaySchema = z.object({
  day: z.number().int().positive(),
  title: z.string(),
  summary: z.string(),
  activities: z.array(ActivitySchema),
  hotelName: z.string(),
  transport: z.array(TransportLegSchema),
  estimatedCost: z.number().nonnegative(),
});

export const BudgetBreakdownSchema = z.object({
  flights: z.number().nonnegative(),
  hotels: z.number().nonnegative(),
  localTransport: z.number().nonnegative(),
  food: z.number().nonnegative(),
  sightseeing: z.number().nonnegative(),
  shopping: z.number().nonnegative(),
  activities: z.number().nonnegative(),
  emergencyReserve: z.number().nonnegative(),
});

export const ItinerarySchema = z.object({
  id: z.string(),
  tripName: z.string(),
  origin: z.string(),
  destination: z.string(),
  destinationId: z.string(),
  durationDays: z.number().int().min(1).max(30),
  travellers: z.number().int().min(1).max(20),
  currency: z.string(),
  estimatedTotal: z.number().nonnegative(),
  targetBudget: z.number().nonnegative(),
  travelMonth: z.string().optional(),
  season: z.string().optional(),
  seasonalHighlights: z.array(z.string()).optional(),
  signatureFoods: z.array(z.string()).optional(),
  packingAdvice: z.array(z.string()).optional(),
  coordinates: z.object({ lat: z.number(), lng: z.number() }).optional(),
  pace: z.enum(['relaxed', 'balanced', 'active']).default('balanced'),
  interests: z.array(z.string()),
  days: z.array(TripDaySchema),
  selectedHotel: HotelOptionSchema.optional(),
  recommendations: z.array(z.string()),
  travelTips: z.array(z.string()),
  budgetBreakdown: BudgetBreakdownSchema,
  provenanceNote: z.string(),
  createdAt: z.string(),
  updatedAt: z.string(),
});

export type Activity = z.infer<typeof ActivitySchema>;
export type HotelOption = z.infer<typeof HotelOptionSchema>;
export type TransportLeg = z.infer<typeof TransportLegSchema>;
export type TripDay = z.infer<typeof TripDaySchema>;
export type BudgetBreakdown = z.infer<typeof BudgetBreakdownSchema>;
export type Itinerary = z.infer<typeof ItinerarySchema>;

export interface FlightOption {
  id: string;
  origin: string;
  destination: string;
  airline: string;
  flightNumber: string;
  departureTime: string;
  arrivalTime: string;
  durationLabel: string;
  stops: number;
  baggage: string;
  priceInr: number;
  cabinClass: string;
  provider: string;
  provenance: DataProvenance;
  providerUrl: string;
}

export interface LanguagePhrase {
  english: string;
  local: string;
  pronunciation: string;
  context: 'Greeting' | 'Dining' | 'Transit' | 'Emergency';
}

export interface DestinationPlace {
  id: string;
  name: string;
  type: 'Attraction' | 'Hidden Gem' | 'Cafe & Food' | 'Airport';
  description: string;
  bestTime: string;
  lat: number;
  lng: number;
  estimatedEntryInr: number;
  crowdLevel: 'Quiet' | 'Moderate' | 'Popular';
}

export interface Destination {
  id: string;
  slug: string;
  name: string;
  country: string;
  region: string;
  tagline: string;
  description: string;
  mediaKey: MediaKey;
  bestSeason: string;
  recommendedDays: number;
  dailyBudgetInr: { budget: number; balanced: number; luxury: number };
  currencyCode: string;
  currencySymbol: string;
  languageName: string;
  localTransportSummary: string;
  culturalTips: string[];
  safetyNotes: string[];
  weatherSummary: {
    tempRangeC: string;
    condition: string;
    humidity: string;
    advisory: string;
  };
  coordinates: { lat: number; lng: number };
  places: DestinationPlace[];
  phrases: LanguagePhrase[];
  tags: string[];
}

export interface ExtractedRequirements {
  origin: string;
  destination: string;
  durationDays: number;
  travellers: number;
  budget: number;
  currency: string;
  interests: string[];
  travelMonth?: string;
  pace: 'relaxed' | 'balanced' | 'active';
  hotelTier: 'budget' | 'boutique' | 'luxury';
  avoidCrowds: boolean;
}

export interface UserPreferences {
  name: string;
  email: string;
  homeCity: string;
  preferredCurrency: string;
  travelStyle: 'relaxed' | 'balanced' | 'active';
  hotelPreference: 'budget' | 'boutique' | 'luxury';
  foodPreferences: string[];
  interests: string[];
  preferredTransport: string[];
  avoidCrowds: boolean;
}

export interface BookingRecord {
  id: string;
  tripId: string;
  type: 'Flight' | 'Hotel' | 'Transport' | 'Activity';
  title: string;
  provider: string;
  referenceCode: string;
  dateLabel: string;
  status: 'Saved Record' | 'Pending Modification' | 'Cancelled Record';
  amount: number;
  currency: string;
  cancellationPolicy: string;
  providerUrl: string;
}

export interface ResearchSource {
  title: string;
  url: string;
  snippet: string;
}

export interface ChatMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: string;
  toolsUsed?: string[];
  itinerary?: Itinerary;
  hotels?: HotelOption[];
  sources?: ResearchSource[];
  bookingLinks?: Array<{ label: string; url: string; kind: 'flights' | 'hotels' | 'transit' | 'maps' }>;
  followUpQuestions?: string[];
  provenanceBadge?: string;
}
