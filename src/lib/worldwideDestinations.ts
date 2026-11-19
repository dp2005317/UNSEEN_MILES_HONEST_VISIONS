import { DESTINATIONS } from '../data/catalog';
import type {
  Destination,
  DestinationPlace,
  HotelOption,
  LanguagePhrase,
  MediaKey,
} from '../types/travel';

interface CitySeed {
  name: string;
  country: string;
  region: string;
  tagline: string;
  description: string;
  mediaKey: MediaKey;
  currencyCode: string;
  currencySymbol: string;
  languageName: string;
  bestSeason: string;
  recommendedDays: number;
  dailyBudgetInr: { budget: number; balanced: number; luxury: number };
  coordinates: { lat: number; lng: number };
  tags: string[];
  airport: { name: string; lat: number; lng: number };
  places: Array<{
    name: string;
    type: 'Attraction' | 'Hidden Gem' | 'Cafe & Food';
    description: string;
    bestTime: string;
    lat: number;
    lng: number;
    estimatedEntryInr: number;
    crowdLevel: 'Quiet' | 'Moderate' | 'Popular';
  }>;
}

const KNOWN_WORLD_CITIES: Record<string, CitySeed> = {
  london: {
    name: 'London',
    country: 'United Kingdom',
    region: 'Western Europe',
    tagline: 'Historic mews, royal parks, quiet Thameside paths, and world-class culture.',
    description:
      'Explore London’s peaceful side: morning walks across Hampstead Heath, quiet artisan coffee houses in Bloomsbury, secret courtyards behind St. Paul’s, and sunset walks along the South Bank.',
    mediaKey: 'boutique_villa',
    currencyCode: 'GBP',
    currencySymbol: '£',
    languageName: 'English',
    bestSeason: 'May – October & festive December',
    recommendedDays: 5,
    dailyBudgetInr: { budget: 7500, balanced: 14500, luxury: 29000 },
    coordinates: { lat: 51.5074, lng: -0.1278 },
    tags: ['Culture', 'Cafes', 'Peaceful Places', 'Historic'],
    airport: { name: 'Heathrow International Airport (LHR)', lat: 51.4700, lng: -0.4543 },
    places: [
      {
        name: 'Hampstead Heath & Parliament Hill',
        type: 'Attraction',
        description: 'Vast ancient parkland with stunning skyline views and quiet bathing ponds.',
        bestTime: '08:00 – 11:30',
        lat: 51.5608,
        lng: -0.1631,
        estimatedEntryInr: 0,
        crowdLevel: 'Quiet',
      },
      {
        name: 'Bloomsbury Literary Quarter & British Museum',
        type: 'Attraction',
        description: 'Georgian squares, antiquarian bookshops, and quiet garden benches.',
        bestTime: '10:00 – 13:00',
        lat: 51.5194,
        lng: -0.1270,
        estimatedEntryInr: 0,
        crowdLevel: 'Moderate',
      },
      {
        name: 'South Bank Riverside Walk & Borough Market',
        type: 'Cafe & Food',
        description: 'Scenic Thames footpath past Shakespeare’s Globe and artisanal food stalls.',
        bestTime: '12:00 – 15:00',
        lat: 51.5055,
        lng: -0.0910,
        estimatedEntryInr: 800,
        crowdLevel: 'Moderate',
      },
      {
        name: 'Kensington Gardens & Notting Hill Quiet Mews',
        type: 'Hidden Gem',
        description: 'Pastel mews houses, royal tree-lined paths, and independent coffee roasters.',
        bestTime: '09:00 – 12:00',
        lat: 51.5070,
        lng: -0.1877,
        estimatedEntryInr: 0,
        crowdLevel: 'Quiet',
      },
      {
        name: 'Greenwich Maritime Park & Royal Observatory',
        type: 'Hidden Gem',
        description: 'Prime Meridian line, sweeping Canary Wharf vistas, and quiet covered market.',
        bestTime: '14:00 – 17:30',
        lat: 51.4769,
        lng: -0.0005,
        estimatedEntryInr: 1800,
        crowdLevel: 'Quiet',
      },
    ],
  },
  paris: {
    name: 'Paris',
    country: 'France',
    region: 'Western Europe',
    tagline: 'Tree-lined boulevards, quiet Seine riverside bookstalls, and neighborhood bistros.',
    description:
      'Experience authentic Parisian rhythm: unhurried mornings along Canal Saint-Martin, hidden courtyards of Le Marais, and sunset picnics in Luxembourg Gardens.',
    mediaKey: 'boutique_villa',
    currencyCode: 'EUR',
    currencySymbol: '€',
    languageName: 'French',
    bestSeason: 'April – June & September – November',
    recommendedDays: 5,
    dailyBudgetInr: { budget: 7200, balanced: 13800, luxury: 27500 },
    coordinates: { lat: 48.8566, lng: 2.3522 },
    tags: ['Culture', 'Cafes', 'Peaceful Places', 'Historic'],
    airport: { name: 'Charles de Gaulle Airport (CDG)', lat: 49.0097, lng: 2.5479 },
    places: [
      {
        name: 'Place des Vosges & Le Marais Historic Mansions',
        type: 'Attraction',
        description: 'Oldest planned square in Paris with arched arcades and quiet art galleries.',
        bestTime: '09:30 – 12:30',
        lat: 48.8555,
        lng: 2.3655,
        estimatedEntryInr: 0,
        crowdLevel: 'Quiet',
      },
      {
        name: 'Canal Saint-Martin Shaded Footbridges',
        type: 'Hidden Gem',
        description: 'Locals gathering along tree-shaded locks, specialty bakeries, and calm wine bars.',
        bestTime: '15:00 – 18:30',
        lat: 48.8715,
        lng: 2.3660,
        estimatedEntryInr: 0,
        crowdLevel: 'Quiet',
      },
      {
        name: 'Jardin du Luxembourg & Medici Fountain',
        type: 'Attraction',
        description: 'Green metal chairs, chestnut tree groves, and quiet reflection pools.',
        bestTime: '08:30 – 11:00',
        lat: 48.8462,
        lng: 2.3372,
        estimatedEntryInr: 0,
        crowdLevel: 'Moderate',
      },
    ],
  },
  tokyo: {
    name: 'Tokyo',
    country: 'Japan',
    region: 'East Asia',
    tagline: 'Quiet alleyway izakayas, serene moss gardens, and seamless urban harmony.',
    description:
      'Discover Tokyo’s tranquil side: early mornings in Yanaka’s historic craft district, peaceful temple courtyards in Asakusa, and quiet garden walks in Shinjuku Gyoen.',
    mediaKey: 'japan',
    currencyCode: 'JPY',
    currencySymbol: '¥',
    languageName: 'Japanese',
    bestSeason: 'March – May & October – November',
    recommendedDays: 6,
    dailyBudgetInr: { budget: 6200, balanced: 11500, luxury: 24000 },
    coordinates: { lat: 35.6762, lng: 139.6503 },
    tags: ['Culture', 'Cafes', 'Peaceful Places', 'Historic'],
    airport: { name: 'Haneda International Airport (HND)', lat: 35.5494, lng: 139.7798 },
    places: [
      {
        name: 'Yanaka Old Town Heritage District',
        type: 'Hidden Gem',
        description: 'Edo-period wooden houses, quiet artisan sweet shops, and traditional craft studios.',
        bestTime: '09:00 – 12:00',
        lat: 35.7275,
        lng: 139.7690,
        estimatedEntryInr: 0,
        crowdLevel: 'Quiet',
      },
      {
        name: 'Shinjuku Gyoen National Garden',
        type: 'Attraction',
        description: 'Tranquil landscape blending Japanese, English, and French gardens.',
        bestTime: '09:30 – 12:00',
        lat: 35.6852,
        lng: 139.7101,
        estimatedEntryInr: 320,
        crowdLevel: 'Moderate',
      },
    ],
  },
  newyork: {
    name: 'New York City',
    country: 'United States',
    region: 'North America',
    tagline: 'Quiet brownstone lanes, skyline waterfront paths, and iconic cultural energy.',
    description:
      'Experience New York beyond the rush: morning strolls through the West Village, quiet reading lawns in Central Park Conservatory, and elevated walks on the High Line.',
    mediaKey: 'boutique_villa',
    currencyCode: 'USD',
    currencySymbol: '$',
    languageName: 'English',
    bestSeason: 'May – June & September – November',
    recommendedDays: 5,
    dailyBudgetInr: { budget: 8500, balanced: 16500, luxury: 34000 },
    coordinates: { lat: 40.7128, lng: -74.0060 },
    tags: ['Culture', 'Cafes', 'Historic'],
    airport: { name: 'John F. Kennedy International Airport (JFK)', lat: 40.6413, lng: -73.7781 },
    places: [
      {
        name: 'The High Line & Chelsea Waterside Park',
        type: 'Attraction',
        description: 'Elevated railway park with lush wildflowers and Hudson River views.',
        bestTime: '07:30 – 10:00',
        lat: 40.7480,
        lng: -74.0048,
        estimatedEntryInr: 0,
        crowdLevel: 'Moderate',
      },
      {
        name: 'West Village Brownstones & Quiet Courtyards',
        type: 'Hidden Gem',
        description: 'Winding historic cobblestone streets, leafy townhouse gardens, and coffee roasters.',
        bestTime: '10:00 – 13:00',
        lat: 40.7358,
        lng: -74.0036,
        estimatedEntryInr: 0,
        crowdLevel: 'Quiet',
      },
    ],
  },
  rome: {
    name: 'Rome',
    country: 'Italy',
    region: 'Southern Europe',
    tagline: 'Cobblestone piazzas, golden afternoon light, and timeless open-air monuments.',
    description:
      'Wander through ivy-draped alleyways of Trastevere, savor morning espresso beside silent fountains, and marvel at millennia of architectural grandeur.',
    mediaKey: 'italy',
    currencyCode: 'EUR',
    currencySymbol: '€',
    languageName: 'Italian',
    bestSeason: 'April – June & September – October',
    recommendedDays: 5,
    dailyBudgetInr: { budget: 6800, balanced: 13200, luxury: 26000 },
    coordinates: { lat: 41.9028, lng: 12.4964 },
    tags: ['Culture', 'Historic', 'Cafes', 'Peaceful Places'],
    airport: { name: 'Leonardo da Vinci–Fiumicino Airport (FCO)', lat: 41.7999, lng: 12.2462 },
    places: [
      {
        name: 'Trastevere Quiet Alleyways & Santa Maria Piazza',
        type: 'Hidden Gem',
        description: 'Ochre-colored cobblestone passages with family trattorias and quiet courtyards.',
        bestTime: '09:00 – 11:30',
        lat: 41.8894,
        lng: 12.4700,
        estimatedEntryInr: 0,
        crowdLevel: 'Quiet',
      },
      {
        name: 'Villa Borghese Gardens & Pincio Terrace',
        type: 'Attraction',
        description: 'Panoramic hilltop terrace overlooking Piazza del Popolo and shaded pine groves.',
        bestTime: '16:00 – 19:00',
        lat: 41.9115,
        lng: 12.4795,
        estimatedEntryInr: 0,
        crowdLevel: 'Moderate',
      },
    ],
  },
  barcelona: {
    name: 'Barcelona',
    country: 'Spain',
    region: 'Southern Europe',
    tagline: 'Gothic quarters, sun-drenched Mediterranean beaches, and modernist architecture.',
    description:
      'Stroll through pedestrian alleys of El Born, discover quiet courtyards in Gràcia, and enjoy fresh tapas along the Mediterranean shoreline.',
    mediaKey: 'boutique_villa',
    currencyCode: 'EUR',
    currencySymbol: '€',
    languageName: 'Spanish & Catalan',
    bestSeason: 'May – June & September – October',
    recommendedDays: 5,
    dailyBudgetInr: { budget: 6400, balanced: 12500, luxury: 25000 },
    coordinates: { lat: 41.3851, lng: 2.1734 },
    tags: ['Culture', 'Beaches', 'Cafes', 'Historic'],
    airport: { name: 'Josep Tarradellas Barcelona-El Prat Airport (BCN)', lat: 41.2974, lng: 2.0833 },
    places: [
      {
        name: 'El Born Medieval Alleys & Santa Maria del Mar',
        type: 'Attraction',
        description: 'Artisan boutiques, quiet stone arches, and historic tapas cellars.',
        bestTime: '10:00 – 13:00',
        lat: 41.3837,
        lng: 2.1818,
        estimatedEntryInr: 0,
        crowdLevel: 'Quiet',
      },
      {
        name: 'Parc de la Ciutadella & Waterfront Footpath',
        type: 'Attraction',
        description: 'Ornate monumental fountain, boating lake, and shaded palms.',
        bestTime: '15:30 – 18:30',
        lat: 41.3883,
        lng: 2.1874,
        estimatedEntryInr: 0,
        crowdLevel: 'Moderate',
      },
    ],
  },
  amsterdam: {
    name: 'Amsterdam',
    country: 'Netherlands',
    region: 'Western Europe',
    tagline: 'Tranquil canal rings, historic houseboats, and charming bicycle lanes.',
    description:
      'Glide through Jordaan’s quiet canals, visit world-class Dutch master museums, and relax in serene parkside cafes.',
    mediaKey: 'boutique_villa',
    currencyCode: 'EUR',
    currencySymbol: '€',
    languageName: 'Dutch & English',
    bestSeason: 'April – October',
    recommendedDays: 4,
    dailyBudgetInr: { budget: 7000, balanced: 13500, luxury: 27000 },
    coordinates: { lat: 52.3676, lng: 4.9041 },
    tags: ['Culture', 'Cafes', 'Peaceful Places', 'Historic'],
    airport: { name: 'Amsterdam Airport Schiphol (AMS)', lat: 52.3105, lng: 4.7683 },
    places: [
      {
        name: 'Jordaan Canal Footbridges & Hidden Courtyards (Hofjes)',
        type: 'Hidden Gem',
        description: 'Flower-draped bridges, indie bookshops, and silent historic residential gardens.',
        bestTime: '08:30 – 11:30',
        lat: 52.3735,
        lng: 4.8814,
        estimatedEntryInr: 0,
        crowdLevel: 'Quiet',
      },
      {
        name: 'Vondelpark & Rose Garden Promenade',
        type: 'Attraction',
        description: 'Expansive historic park with ponds, open-air pavilions, and bike paths.',
        bestTime: '14:00 – 17:00',
        lat: 52.3580,
        lng: 4.8686,
        estimatedEntryInr: 0,
        crowdLevel: 'Moderate',
      },
    ],
  },
  dubai: {
    name: 'Dubai',
    country: 'United Arab Emirates',
    region: 'Middle East',
    tagline: 'Futuristic skylines, desert tranquility, and traditional creek abra boats.',
    description:
      'Contrast modern architectural wonders with peaceful traditional heritage in Al Fahidi and serene desert sunset reserves.',
    mediaKey: 'boutique_villa',
    currencyCode: 'AED',
    currencySymbol: 'AED',
    languageName: 'Arabic & English',
    bestSeason: 'November – March (Comfortable Winter Sun)',
    recommendedDays: 4,
    dailyBudgetInr: { budget: 7800, balanced: 15500, luxury: 32000 },
    coordinates: { lat: 25.2048, lng: 55.2708 },
    tags: ['Culture', 'Beaches', 'Luxury', 'Adventure'],
    airport: { name: 'Dubai International Airport (DXB)', lat: 25.2532, lng: 55.3657 },
    places: [
      {
        name: 'Al Fahidi Historical Quarter & Dubai Creek Abra',
        type: 'Attraction',
        description: 'Traditional wind-tower architecture, art cafes, and scenic 1-dirham wooden boat rides.',
        bestTime: '16:00 – 19:30',
        lat: 25.2631,
        lng: 55.2972,
        estimatedEntryInr: 50,
        crowdLevel: 'Quiet',
      },
    ],
  },
  singapore: {
    name: 'Singapore',
    country: 'Singapore',
    region: 'Southeast Asia',
    tagline: 'Lush garden city, multicultural culinary heritage, and sleek modern architecture.',
    description:
      'Wander through tranquil heritage shop-houses in Kampong Glam, explore the futuristic flora of Gardens by the Bay, and savor Michelin-recognized street food.',
    mediaKey: 'boutique_villa',
    currencyCode: 'SGD',
    currencySymbol: 'S$',
    languageName: 'English, Malay, Mandarin & Tamil',
    bestSeason: 'Year-round tropical (pleasant evenings)',
    recommendedDays: 4,
    dailyBudgetInr: { budget: 6800, balanced: 13000, luxury: 27000 },
    coordinates: { lat: 1.3521, lng: 103.8198 },
    tags: ['Culture', 'Cafes', 'Nature', 'Modern'],
    airport: { name: 'Singapore Changi Airport (SIN)', lat: 1.3644, lng: 103.9915 },
    places: [
      {
        name: 'Singapore Botanic Gardens & Rainforest Trail',
        type: 'Attraction',
        description: 'UNESCO World Heritage tropical gardens with tranquil lakes and heritage trees.',
        bestTime: '07:30 – 10:30',
        lat: 1.3138,
        lng: 103.8159,
        estimatedEntryInr: 0,
        crowdLevel: 'Quiet',
      },
    ],
  },
  sydney: {
    name: 'Sydney',
    country: 'Australia',
    region: 'Oceania',
    tagline: 'Glistening harbor waters, golden surf beaches, and coastal cliff walks.',
    description:
      'Walk the scenic coastal trail from Bondi to Coogee, explore historic cobblestones in The Rocks, and enjoy fresh Pacific dining on the harbor.',
    mediaKey: 'bali',
    currencyCode: 'AUD',
    currencySymbol: 'A$',
    languageName: 'English',
    bestSeason: 'September – November & March – May',
    recommendedDays: 5,
    dailyBudgetInr: { budget: 7500, balanced: 14800, luxury: 31000 },
    coordinates: { lat: -33.8688, lng: 151.2093 },
    tags: ['Beaches', 'Culture', 'Nature', 'Cafes'],
    airport: { name: 'Sydney Kingsford Smith Airport (SYD)', lat: -33.9399, lng: 151.1753 },
    places: [
      {
        name: 'The Rocks Historic Precinct & Campbells Cove',
        type: 'Attraction',
        description: 'Sandstone colonial passageways with harbour bridge views and craft weekend stalls.',
        bestTime: '10:00 – 13:00',
        lat: -33.8590,
        lng: 151.2090,
        estimatedEntryInr: 0,
        crowdLevel: 'Moderate',
      },
    ],
  },
  goa: {
    name: 'Goa',
    country: 'India',
    region: 'South Asia',
    tagline: 'Quiet coconut groves, Portuguese heritage villas, and tranquil southern coves.',
    description:
      'Experience South Goa’s peaceful coastal rhythm: pastel Latin quarter villas in Fontainhas, calm swimming beaches in Palolem, and authentic Goan fish curry houses.',
    mediaKey: 'bali',
    currencyCode: 'INR',
    currencySymbol: '₹',
    languageName: 'Konkani & English',
    bestSeason: 'November – March',
    recommendedDays: 4,
    dailyBudgetInr: { budget: 2800, balanced: 5500, luxury: 12500 },
    coordinates: { lat: 15.2993, lng: 74.1240 },
    tags: ['Beaches', 'Cafes', 'Peaceful Places', 'Nature'],
    airport: { name: 'Dabolim Airport / Mopa Goa (GOI/GOX)', lat: 15.3808, lng: 73.8314 },
    places: [
      {
        name: 'Fontainhas Heritage Latin Quarter',
        type: 'Attraction',
        description: 'Portuguese colonial architecture, colorful tiled facades, and quiet bakeries.',
        bestTime: '08:30 – 11:00',
        lat: 15.4989,
        lng: 73.8315,
        estimatedEntryInr: 0,
        crowdLevel: 'Quiet',
      },
    ],
  },
};

function normalizeString(val: string): string {
  return val
    .trim()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase();
}

export function findKnownCity(query: string): CitySeed | undefined {
  const norm = normalizeString(query);
  if (!norm) return undefined;

  for (const [key, city] of Object.entries(KNOWN_WORLD_CITIES)) {
    if (
      key === norm ||
      normalizeString(city.name) === norm ||
      norm.includes(normalizeString(city.name)) ||
      norm.includes(key)
    ) {
      return city;
    }
  }
  return undefined;
}

export function synthesizeCustomDestination(query: string): Destination {
  const raw = query.trim();
  const parts = raw.split(/[,–-]/).map((p) => p.trim()).filter(Boolean);
  const cityName = (parts[0] || 'Worldwide').charAt(0).toUpperCase() + (parts[0] || 'Worldwide').slice(1);
  const countryName = parts.length > 1 ? parts[parts.length - 1] : 'Global';
  const slug = normalizeString(cityName).replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '') || 'dest';

  // Deterministic approximate coordinates from name hash
  let hash = 0;
  for (let i = 0; i < raw.length; i++) {
    hash = (hash << 5) - hash + raw.charCodeAt(i);
    hash |= 0;
  }
  const latOffset = ((Math.abs(hash) % 500) - 250) / 100;
  const lngOffset = ((Math.abs(hash >> 3) % 500) - 250) / 100;
  const baseLat = 45.0 + latOffset;
  const baseLng = 10.0 + lngOffset;

  const places: DestinationPlace[] = [
    {
      id: `${slug}-airport`,
      name: `${cityName} International Gateway`,
      type: 'Airport',
      description: `Primary air gateway serving ${cityName} and the surrounding region.`,
      bestTime: 'Arrival & Departure',
      lat: baseLat + 0.12,
      lng: baseLng - 0.15,
      estimatedEntryInr: 0,
      crowdLevel: 'Moderate',
    },
    {
      id: `${slug}-old-quarter`,
      name: `${cityName} Historic Old Quarter & Heritage Square`,
      type: 'Attraction',
      description: `Atmospheric pedestrian streets, artisan workshops, and centuries of architecture in ${cityName}.`,
      bestTime: '09:00 – 12:00',
      lat: baseLat,
      lng: baseLng,
      estimatedEntryInr: 0,
      crowdLevel: 'Quiet',
    },
    {
      id: `${slug}-scenic-promenade`,
      name: `${cityName} Scenic Riverside & Panoramic Promenade`,
      type: 'Attraction',
      description: `Peaceful waterfront pathway with iconic vista viewpoints and coffee kiosks.`,
      bestTime: '15:30 – 18:30',
      lat: baseLat + 0.015,
      lng: baseLng + 0.02,
      estimatedEntryInr: 0,
      crowdLevel: 'Quiet',
    },
    {
      id: `${slug}-artisan-market`,
      name: `${cityName} Local Artisan Food Market`,
      type: 'Cafe & Food',
      description: `Vibrant regional produce, bakeries, specialty roasters, and culinary stalls.`,
      bestTime: '11:30 – 14:00',
      lat: baseLat - 0.01,
      lng: baseLng + 0.012,
      estimatedEntryInr: 600,
      crowdLevel: 'Moderate',
    },
    {
      id: `${slug}-gardens`,
      name: `${cityName} Botanical Gardens & Quiet Courtyards`,
      type: 'Attraction',
      description: `Tranquil green sanctuary with shaded benches, fountains, and native flora.`,
      bestTime: '08:00 – 10:30',
      lat: baseLat - 0.02,
      lng: baseLng - 0.015,
      estimatedEntryInr: 250,
      crowdLevel: 'Quiet',
    },
    {
      id: `${slug}-sunset-view`,
      name: `${cityName} Hilltop Sunset Lookout & Dining Quarter`,
      type: 'Hidden Gem',
      description: `Quiet evening gathering spot offering panoramic sunset vistas over the city skyline.`,
      bestTime: '17:30 – 20:30',
      lat: baseLat + 0.035,
      lng: baseLng - 0.025,
      estimatedEntryInr: 0,
      crowdLevel: 'Quiet',
    },
  ];

  return {
    id: slug,
    slug,
    name: cityName,
    country: countryName,
    region: 'Worldwide',
    tagline: `Historic squares, scenic viewpoints, and unhurried local culture in ${cityName}.`,
    description: `Discover ${cityName} beyond tourist crowds: tranquil morning neighborhood strolls, local artisan bakeries, scenic nature lookouts, and authentic regional hospitality.`,
    mediaKey: 'boutique_villa',
    bestSeason: 'Spring (April – June) & Autumn (September – November)',
    recommendedDays: 5,
    dailyBudgetInr: { budget: 5500, balanced: 10500, luxury: 22000 },
    currencyCode: 'USD',
    currencySymbol: '$',
    languageName: 'Local Regional Language & English',
    localTransportSummary: `Local city metro, regional rail links, metered rideshares, and scenic walking trails.`,
    culturalTips: [
      `Greet shopkeepers and café hosts politely before ordering.`,
      `Carry local currency notes for smaller neighborhood markets and transit booths.`,
      `Respect quiet morning hours in residential and heritage quarters.`,
    ],
    safetyNotes: [
      `Keep personal belongings secure in central transit hubs.`,
      `Verify licensed taxi fares or use verified ride-hailing apps from transit stations.`,
    ],
    weatherSummary: {
      tempRangeC: '14°C – 25°C',
      condition: 'Pleasant temperate days with gentle seasonal breezes',
      humidity: '60%',
      advisory: 'Verify 5-day live forecast before departure.',
    },
    coordinates: { lat: baseLat, lng: baseLng },
    tags: ['Culture', 'Cafes', 'Peaceful Places', 'Historic'],
    places,
    phrases: [
      { english: 'Hello / Good morning', local: 'Hello', pronunciation: 'hel-loh', context: 'Greeting' },
      { english: 'Thank you very much', local: 'Thank you', pronunciation: 'thangk yoo', context: 'Greeting' },
      { english: 'Where is the station?', local: 'Where is the station?', pronunciation: 'stay-shun', context: 'Transit' },
    ],
  };
}

export function resolveOrSynthesizeDestination(query: string): Destination {
  const clean = query.trim();
  if (!clean) return DESTINATIONS[0];

  const norm = normalizeString(clean);

  // 1. Direct catalog match
  const catalogMatch = DESTINATIONS.find(
    (d) =>
      normalizeString(d.id) === norm ||
      normalizeString(d.slug) === norm ||
      normalizeString(d.name) === norm ||
      norm.includes(normalizeString(d.name))
  );
  if (catalogMatch) return catalogMatch;

  // 2. Known world cities dictionary
  const known = findKnownCity(clean);
  if (known) {
    const slug = normalizeString(known.name).replace(/[^a-z0-9]+/g, '-');
    const allPlaces: DestinationPlace[] = [
      {
        id: `${slug}-airport`,
        name: known.airport.name,
        type: 'Airport',
        description: `Primary gateway into ${known.name}.`,
        bestTime: 'Arrival & Departure',
        lat: known.airport.lat,
        lng: known.airport.lng,
        estimatedEntryInr: 0,
        crowdLevel: 'Moderate',
      },
      ...known.places.map((p, idx) => ({
        id: `${slug}-place-${idx + 1}`,
        name: p.name,
        type: p.type,
        description: p.description,
        bestTime: p.bestTime,
        lat: p.lat,
        lng: p.lng,
        estimatedEntryInr: p.estimatedEntryInr,
        crowdLevel: p.crowdLevel,
      })),
    ];

    return {
      id: slug,
      slug,
      name: known.name,
      country: known.country,
      region: known.region,
      tagline: known.tagline,
      description: known.description,
      mediaKey: known.mediaKey,
      bestSeason: known.bestSeason,
      recommendedDays: known.recommendedDays,
      dailyBudgetInr: known.dailyBudgetInr,
      currencyCode: known.currencyCode,
      currencySymbol: known.currencySymbol,
      languageName: known.languageName,
      localTransportSummary: `Urban metro, airport express rail, metered transit, and scenic walking trails in ${known.name}.`,
      culturalTips: [
        `Greet locals politely in shops and cafes.`,
        `Respect quiet zones on public transit.`,
        `Keep digital payment cards or small cash ready for transit.`,
      ],
      safetyNotes: [
        `Watch personal items in busy transit terminals.`,
        `Use official marked taxis or rideshare apps.`,
      ],
      weatherSummary: {
        tempRangeC: '12°C – 23°C',
        condition: 'Temperate with pleasant seasonal breezes',
        humidity: '65%',
        advisory: 'Check 5-day live forecast before departure.',
      },
      coordinates: known.coordinates,
      tags: known.tags,
      places: allPlaces,
      phrases: [
        { english: 'Hello', local: 'Hello', pronunciation: 'hel-loh', context: 'Greeting' },
        { english: 'Thank you', local: 'Thank you', pronunciation: 'thangk yoo', context: 'Greeting' },
        { english: 'Where is the station?', local: 'Station', pronunciation: 'stay-shun', context: 'Transit' },
      ],
    };
  }

  // 3. Fallback: synthesize custom destination anywhere in the world
  return synthesizeCustomDestination(clean);
}

export function synthesizeHotelsForDestination(dest: Destination): HotelOption[] {
  const basePrice = Math.round(dest.dailyBudgetInr.balanced * 0.85);

  return [
    {
      id: `ht-${dest.id}-heritage`,
      name: `The ${dest.name} Heritage Boutique Hotel`,
      destinationId: dest.id,
      area: `${dest.name} Historic Center`,
      rating: 4.8,
      reviewCount: 248,
      pricePerNightInr: Math.max(3800, basePrice),
      tier: 'boutique',
      roomTypes: ['Courtyard Deluxe Room', 'Historic Balcony Suite'],
      distanceToCenterKm: 1.1,
      amenities: ['Artisan organic breakfast', 'Courtyard terrace', 'Espresso bar', 'Curated walking maps'],
      cancellationPolicy: 'Free cancellation up to 48 hours prior',
      provider: 'Unseen Stays Catalog',
      availabilityStatus: 'Simulated Demo Inventory',
      provenance: 'demo_adapter',
      lat: dest.coordinates.lat + 0.005,
      lng: dest.coordinates.lng - 0.004,
      mediaKey: 'boutique_villa',
      recommendationReason: `Quiet residential location within 10 minutes walk of ${dest.places[1]?.name || dest.name + ' center'}.`,
      matchScore: 96,
    },
    {
      id: `ht-${dest.id}-quiet-residence`,
      name: `${dest.name} Leafy Garden Residence`,
      destinationId: dest.id,
      area: `${dest.name} Residential Garden Quarter`,
      rating: 4.7,
      reviewCount: 192,
      pricePerNightInr: Math.max(3200, Math.round(basePrice * 0.9)),
      tier: 'boutique',
      roomTypes: ['Garden King Room', 'Quiet Studio with Balcony'],
      distanceToCenterKm: 2.3,
      amenities: ['Private courtyard garden', 'Bicycle loan', 'Quiet reading library', 'Breakfast included'],
      cancellationPolicy: 'Free cancellation up to 72 hours prior',
      provider: 'Unseen Stays Catalog',
      availabilityStatus: 'Simulated Demo Inventory',
      provenance: 'demo_adapter',
      lat: dest.coordinates.lat - 0.008,
      lng: dest.coordinates.lng + 0.006,
      mediaKey: 'boutique_villa',
      recommendationReason: `Peaceful neighborhood away from tourist bustle, surrounded by local bakeries.`,
      matchScore: 93,
    },
    {
      id: `ht-${dest.id}-budget-lodge`,
      name: `The ${dest.name} Central Express Lodge`,
      destinationId: dest.id,
      area: `${dest.name} Transit & Station Quarter`,
      rating: 4.4,
      reviewCount: 380,
      pricePerNightInr: Math.max(2200, Math.round(dest.dailyBudgetInr.budget * 0.8)),
      tier: 'budget',
      roomTypes: ['Standard Double', 'Compact City Pod'],
      distanceToCenterKm: 1.8,
      amenities: ['Direct airport transit connection', '24h self check-in', 'Shared kitchen', 'Luggage storage'],
      cancellationPolicy: 'Free cancellation up to 24 hours prior',
      provider: 'Unseen Stays Catalog',
      availabilityStatus: 'Simulated Demo Inventory',
      provenance: 'demo_adapter',
      lat: dest.coordinates.lat + 0.012,
      lng: dest.coordinates.lng + 0.015,
      mediaKey: 'boutique_villa',
      recommendationReason: `High-value budget stay offering swift transit access across the city.`,
      matchScore: 88,
    },
    {
      id: `ht-${dest.id}-luxury-haven`,
      name: `${dest.name} Horizon Luxury Sanctuary`,
      destinationId: dest.id,
      area: `${dest.name} Panoramic Skyline Promenade`,
      rating: 4.9,
      reviewCount: 154,
      pricePerNightInr: Math.max(8500, Math.round(dest.dailyBudgetInr.luxury * 0.85)),
      tier: 'luxury',
      roomTypes: ['Panoramic River Suite', 'Penthouse Terrace with Soaking Tub'],
      distanceToCenterKm: 0.8,
      amenities: ['Fine dining restaurant', 'Spa & wellness center', 'Chauffeur booking desk', 'Concierge tour service'],
      cancellationPolicy: 'Free cancellation up to 7 days prior',
      provider: 'Unseen Stays Catalog',
      availabilityStatus: 'Simulated Demo Inventory',
      provenance: 'demo_adapter',
      lat: dest.coordinates.lat - 0.003,
      lng: dest.coordinates.lng - 0.002,
      mediaKey: 'boutique_villa',
      recommendationReason: `Unrivaled luxury haven with panoramic vistas and private bespoke concierge service.`,
      matchScore: 98,
    },
  ];
}
