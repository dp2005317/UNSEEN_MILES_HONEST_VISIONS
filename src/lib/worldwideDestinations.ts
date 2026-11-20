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
    tagline: 'Neon skylines, ancient cedar shrines, world-class gastronomy, and serene gardens.',
    description:
      'From the iconic buzz of Shibuya Crossing and the timeless incense of Senso-ji to serene dawn walks through Meiji Shrine’s forest and meticulous neighborhood ramen counters, Tokyo balances cutting-edge wonder with profound peace.',
    mediaKey: 'japan',
    currencyCode: 'JPY',
    currencySymbol: '¥',
    languageName: 'Japanese',
    bestSeason: 'March – May (Cherry Blossom) & October – November (Autumn Foliage)',
    recommendedDays: 6,
    dailyBudgetInr: { budget: 6200, balanced: 11500, luxury: 24000 },
    coordinates: { lat: 35.6762, lng: 139.6503 },
    tags: ['Culture', 'Cafes', 'Peaceful Places', 'Historic'],
    airport: { name: 'Haneda International Airport (HND)', lat: 35.5494, lng: 139.7798 },
    places: [
      {
        name: 'Senso-ji Temple & Asakusa Heritage Quarter',
        type: 'Attraction',
        description: 'Tokyo’s oldest, most iconic Buddhist temple with the giant red Kaminarimon lantern and traditional artisan crafts.',
        bestTime: '07:30 – 10:30',
        lat: 35.7148,
        lng: 139.7967,
        estimatedEntryInr: 0,
        crowdLevel: 'Popular',
      },
      {
        name: 'Shibuya Crossing, Hachiko Memorial & Shibuya Sky',
        type: 'Attraction',
        description: 'World-famous pedestrian scramble crossing and open-air rooftop observation deck with panoramic views of Tokyo and Mt. Fuji.',
        bestTime: '10:00 – 14:00',
        lat: 35.6595,
        lng: 139.7005,
        estimatedEntryInr: 1200,
        crowdLevel: 'Popular',
      },
      {
        name: 'Meiji Jingu Sacred Forest Shrine & Harajuku',
        type: 'Attraction',
        description: 'Tranquil 170-acre evergreen forest shrine honoring Emperor Meiji, right beside tree-lined Omotesando avenues.',
        bestTime: '08:00 – 11:00',
        lat: 35.6764,
        lng: 139.6993,
        estimatedEntryInr: 0,
        crowdLevel: 'Moderate',
      },
      {
        name: 'Shinjuku Gyoen National Garden & Greenhouses',
        type: 'Attraction',
        description: 'Imperial landscape park blending traditional Japanese, English, and French gardens with prime spring cherry blossoms and autumn maples.',
        bestTime: '09:30 – 12:30',
        lat: 35.6852,
        lng: 139.7101,
        estimatedEntryInr: 320,
        crowdLevel: 'Moderate',
      },
      {
        name: 'Tsukiji Outer Market & Ginza Artisanal Stalls',
        type: 'Cafe & Food',
        description: 'Bustling seafood stalls offering fresh sushi, tamagoyaki, wagyu skewers, and nearby luxury Ginza shopping boulevards.',
        bestTime: '08:30 – 12:00',
        lat: 35.6655,
        lng: 139.7708,
        estimatedEntryInr: 1400,
        crowdLevel: 'Popular',
      },
      {
        name: 'Tokyo Skytree & Sumida River Promenade',
        type: 'Attraction',
        description: 'Towering 634-meter transmission tower offering 360-degree metropolitan vistas and scenic riverside walks.',
        bestTime: '15:30 – 19:00',
        lat: 35.7100,
        lng: 139.8107,
        estimatedEntryInr: 1800,
        crowdLevel: 'Popular',
      },
      {
        name: 'Yanaka Old Town Heritage District',
        type: 'Hidden Gem',
        description: 'Edo-period wooden houses, quiet artisan sweet shops, traditional craft studios, and tranquil temple cemeteries.',
        bestTime: '09:00 – 12:00',
        lat: 35.7275,
        lng: 139.7690,
        estimatedEntryInr: 0,
        crowdLevel: 'Quiet',
      },
    ],
  },
  newyork: {
    name: 'New York City',
    country: 'United States',
    region: 'North America',
    tagline: 'Iconic skylines, world-class museums, Broadway stages, and lush urban parks.',
    description:
      'From the towering drama of Times Square and the Statue of Liberty to unhurried mornings beneath Central Park’s weeping willows and sunset strolls across Brooklyn Bridge, NYC offers legendary sights at every turn.',
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
        name: 'Central Park Bow Bridge, Bethesda Terrace & The Ramble',
        type: 'Attraction',
        description: '843 acres of peaceful lakes, historic stone bridges, Victorian carriage paths, and lush maple groves in the heart of Manhattan.',
        bestTime: '08:00 – 11:30',
        lat: 40.7829,
        lng: -73.9654,
        estimatedEntryInr: 0,
        crowdLevel: 'Moderate',
      },
      {
        name: 'Times Square & Broadway Theater District',
        type: 'Attraction',
        description: 'The electrifying crossroads of the world with towering digital marquees, street performers, and world-renowned Broadway shows.',
        bestTime: '17:00 – 22:00',
        lat: 40.7580,
        lng: -73.9855,
        estimatedEntryInr: 0,
        crowdLevel: 'Popular',
      },
      {
        name: 'Brooklyn Bridge Pedestrian Boardwalk & DUMBO',
        type: 'Attraction',
        description: 'Walk above the East River along the historic 1883 suspension bridge with soaring Gothic arches and iconic lower Manhattan skyline vistas.',
        bestTime: '07:30 – 10:30',
        lat: 40.7061,
        lng: -73.9969,
        estimatedEntryInr: 0,
        crowdLevel: 'Popular',
      },
      {
        name: 'Statue of Liberty & Ellis Island National Monument',
        type: 'Attraction',
        description: 'The copper monument of freedom in New York Harbor, reached via scenic ferry with views of the Financial District skyline.',
        bestTime: '09:00 – 13:00',
        lat: 40.6892,
        lng: -74.0445,
        estimatedEntryInr: 2100,
        crowdLevel: 'Popular',
      },
      {
        name: 'The Metropolitan Museum of Art (The Met) & Fifth Avenue',
        type: 'Attraction',
        description: 'Over 5,000 years of global art, Egyptian Temple of Dendur, European masterpieces, and panoramic Central Park rooftop garden.',
        bestTime: '10:00 – 14:00',
        lat: 40.7794,
        lng: -73.9632,
        estimatedEntryInr: 2500,
        crowdLevel: 'Popular',
      },
      {
        name: 'The High Line & Chelsea Waterside Park',
        type: 'Attraction',
        description: 'Elevated railway park with lush wildflowers, Hudson River views, and modern sculpture.',
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
    tagline: 'Ancient imperial monuments, Baroque fountains, and cobblestone piazza trattorias.',
    description:
      'Walk where gladiators battled at the Colosseum, toss a coin in the Trevi Fountain, marvel at Michelangelo’s Sistine Chapel ceiling, and savor cacio e pepe in sun-drenched Trastevere squares.',
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
        name: 'Colosseum & Roman Forum Archeological Park',
        type: 'Attraction',
        description: 'Monumental 2,000-year-old amphitheater of gladiators and the political center of the ancient Roman Empire.',
        bestTime: '08:30 – 11:30',
        lat: 41.8902,
        lng: 12.4922,
        estimatedEntryInr: 2100,
        crowdLevel: 'Popular',
      },
      {
        name: 'Vatican City, St. Peter’s Basilica & Sistine Chapel',
        type: 'Attraction',
        description: 'Michelangelo’s legendary frescoes in the Sistine Chapel and the immense marble grandeur of St. Peter’s Square.',
        bestTime: '08:00 – 12:00',
        lat: 41.9029,
        lng: 12.4534,
        estimatedEntryInr: 2400,
        crowdLevel: 'Popular',
      },
      {
        name: 'Trevi Fountain & The Pantheon Marble Dome',
        type: 'Attraction',
        description: 'Baroque masterpiece fountain where tossing a coin guarantees your return, and the intact 2nd-century open-oculus temple.',
        bestTime: '07:30 – 10:00',
        lat: 41.9009,
        lng: 12.4833,
        estimatedEntryInr: 500,
        crowdLevel: 'Popular',
      },
      {
        name: 'Piazza Navona & Spanish Steps Promenade',
        type: 'Attraction',
        description: 'Bernini’s Fountain of the Four Rivers, bustling painter squares, and the monumental 135-step baroque staircase.',
        bestTime: '15:00 – 18:30',
        lat: 41.8992,
        lng: 12.4731,
        estimatedEntryInr: 0,
        crowdLevel: 'Popular',
      },
      {
        name: 'Trastevere Quiet Alleyways & Santa Maria Piazza',
        type: 'Hidden Gem',
        description: 'Ochre-colored cobblestone passages with family trattorias, hanging ivy, and quiet historic courtyards.',
        bestTime: '09:00 – 11:30',
        lat: 41.8894,
        lng: 12.4700,
        estimatedEntryInr: 0,
        crowdLevel: 'Quiet',
      },
      {
        name: 'Villa Borghese Gardens & Pincio Terrace',
        type: 'Attraction',
        description: 'Panoramic hilltop terrace overlooking Piazza del Popolo and shaded Roman umbrella pine groves.',
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
    tagline: 'Gaudí masterpieces, Gothic quarters, golden Mediterranean beaches, and tapas.',
    description:
      'Gaze up at the dreamlike spires of Sagrada Família, wander mosaic terraces at Park Güell, lose yourself in Gothic Quarter stone alleys, and enjoy fresh paella by the Mediterranean.',
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
        name: 'Basílica de la Sagrada Família (Gaudí Masterpiece)',
        type: 'Attraction',
        description: 'Antoni Gaudí’s awe-inspiring modernist basilica with soaring organic towers and stained glass that bathes the nave in rainbow light.',
        bestTime: '09:00 – 12:30',
        lat: 41.4036,
        lng: 2.1744,
        estimatedEntryInr: 2600,
        crowdLevel: 'Popular',
      },
      {
        name: 'Park Güell Mosaic Serpent Terrace & Fairy Gate',
        type: 'Attraction',
        description: 'Gaudí’s colorful mosaic park perched on Carmel Hill offering sweeping views across Barcelona to the Mediterranean Sea.',
        bestTime: '08:30 – 11:00',
        lat: 41.4145,
        lng: 2.1527,
        estimatedEntryInr: 1200,
        crowdLevel: 'Popular',
      },
      {
        name: 'Gothic Quarter (Barri Gòtic) & Barcelona Cathedral',
        type: 'Attraction',
        description: '14th-century medieval labyrinth of stone alleyways, hidden plazas, and the grand Gothic Cathedral of Santa Eulalia.',
        bestTime: '10:00 – 13:30',
        lat: 41.3839,
        lng: 2.1762,
        estimatedEntryInr: 0,
        crowdLevel: 'Popular',
      },
      {
        name: 'Casa Batlló & Passeig de Gràcia Modernist Mansions',
        type: 'Attraction',
        description: 'Gaudí’s dragon-roofed iridescent masterpiece on Barcelona’s most prestigious architectural avenue.',
        bestTime: '13:30 – 16:30',
        lat: 41.3916,
        lng: 2.1648,
        estimatedEntryInr: 2900,
        crowdLevel: 'Popular',
      },
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
        name: 'Barceloneta Beach Promenade & Seafood Tapas',
        type: 'Cafe & Food',
        description: 'Golden sandy Mediterranean boardwalk lined with open-air chiringuito bars and fresh seafood paella restaurants.',
        bestTime: '17:00 – 21:00',
        lat: 41.3784,
        lng: 2.1895,
        estimatedEntryInr: 1600,
        crowdLevel: 'Moderate',
      },
    ],
  },
  amsterdam: {
    name: 'Amsterdam',
    country: 'Netherlands',
    region: 'Western Europe',
    tagline: 'Gabled canal houses, Dutch master art, flower markets, and peaceful bridges.',
    description:
      'Glide through UNESCO-listed canal rings, explore world-famous Rembrandt and Van Gogh galleries, and discover secret blooming courtyard gardens in Jordaan.',
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
        name: 'Rijksmuseum & Museumplein Masterpieces',
        type: 'Attraction',
        description: 'The monumental Dutch national museum housing Rembrandt’s The Night Watch and Vermeer’s The Milkmaid.',
        bestTime: '09:00 – 12:30',
        lat: 52.3599,
        lng: 4.8852,
        estimatedEntryInr: 2250,
        crowdLevel: 'Popular',
      },
      {
        name: 'Anne Frank House & Western Canal Ring',
        type: 'Attraction',
        description: 'Historic canal house and secret annex museum on Prinsengracht, surrounded by 17th-century merchant houses.',
        bestTime: '09:30 – 12:00',
        lat: 52.3752,
        lng: 4.8840,
        estimatedEntryInr: 1600,
        crowdLevel: 'Popular',
      },
      {
        name: 'Van Gogh Museum & Sunflower Galleries',
        type: 'Attraction',
        description: 'The world’s largest collection of Vincent van Gogh paintings, drawings, and personal letters.',
        bestTime: '13:00 – 16:00',
        lat: 52.3584,
        lng: 4.8811,
        estimatedEntryInr: 2200,
        crowdLevel: 'Popular',
      },
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
    tagline: 'Futuristic record-breaking architecture, luxury marina promenades, and desert sunsets.',
    description:
      'Gaze from the heights of the world’s tallest tower, cruise the dazzling Dubai Marina, and explore atmospheric spice and gold souks along Dubai Creek.',
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
        name: 'Burj Khalifa Observation Deck & Dubai Fountain',
        type: 'Attraction',
        description: 'World’s tallest building rising 828 meters into the sky, overlooking the dancing fountain lake spectacle.',
        bestTime: '16:30 – 19:30',
        lat: 25.1972,
        lng: 55.2744,
        estimatedEntryInr: 4200,
        crowdLevel: 'Popular',
      },
      {
        name: 'Palm Jumeirah & Dubai Marina Waterfront Walk',
        type: 'Attraction',
        description: 'Iconic palm-shaped archipelago, luxury superyacht marina, and illuminated evening beach promenades.',
        bestTime: '17:00 – 21:00',
        lat: 25.1124,
        lng: 55.1390,
        estimatedEntryInr: 0,
        crowdLevel: 'Popular',
      },
      {
        name: 'Al Fahidi Historical Quarter & Dubai Creek Abra',
        type: 'Attraction',
        description: 'Traditional wind-tower architecture, art cafes, and scenic 1-dirham wooden boat rides across the historic trade creek.',
        bestTime: '08:30 – 11:30',
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
    tagline: 'Lush garden city, futuristic supertrees, vibrant hawker food, and marina skylines.',
    description:
      'Wander beneath colossal vertical gardens at Gardens by the Bay, admire the skyline from Marina Bay Sands, and savor world-famous hawker stall delicacies.',
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
        name: 'Gardens by the Bay Supertrees & Cloud Forest Dome',
        type: 'Attraction',
        description: 'Futuristic 50-meter vertical plant towers and the world’s largest glass greenhouse with an indoor mountain waterfall.',
        bestTime: '16:00 – 20:00',
        lat: 1.2816,
        lng: 103.8636,
        estimatedEntryInr: 2200,
        crowdLevel: 'Popular',
      },
      {
        name: 'Marina Bay Sands SkyPark & Waterfront Promenade',
        type: 'Attraction',
        description: 'Iconic cantilevered rooftop sky deck offering 360-degree views over the Singapore Strait and evening light shows.',
        bestTime: '17:30 – 20:30',
        lat: 1.2838,
        lng: 103.8591,
        estimatedEntryInr: 1800,
        crowdLevel: 'Popular',
      },
      {
        name: 'Chinatown & Buddha Tooth Relic Temple',
        type: 'Attraction',
        description: 'Tang-style religious monument housing sacred relics, surrounded by lively heritage shop-houses and Michelin hawker stalls.',
        bestTime: '09:00 – 12:00',
        lat: 1.2814,
        lng: 103.8443,
        estimatedEntryInr: 0,
        crowdLevel: 'Moderate',
      },
      {
        name: 'Singapore Botanic Gardens & National Orchid Garden',
        type: 'Attraction',
        description: 'UNESCO World Heritage tropical gardens with over 60,000 orchids and tranquil swan lakes.',
        bestTime: '07:30 – 10:30',
        lat: 1.3138,
        lng: 103.8159,
        estimatedEntryInr: 350,
        crowdLevel: 'Quiet',
      },
    ],
  },
  sydney: {
    name: 'Sydney',
    country: 'Australia',
    region: 'Oceania',
    tagline: 'Iconic sailhouse architecture, golden surf beaches, and coastal cliff trails.',
    description:
      'Gaze at the architectural genius of the Sydney Opera House, walk across the Sydney Harbour Bridge, surf at Bondi Beach, and explore the sandstone colonial lanes of The Rocks.',
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
        name: 'Sydney Opera House & Circular Quay Promenade',
        type: 'Attraction',
        description: 'World-famous shell-tiled architectural icon jutting into the glistening harbor, with harborfront open-air bars.',
        bestTime: '09:00 – 12:00',
        lat: -33.8568,
        lng: 151.2153,
        estimatedEntryInr: 2400,
        crowdLevel: 'Popular',
      },
      {
        name: 'Sydney Harbour Bridge Pylon Lookout & Walkway',
        type: 'Attraction',
        description: 'Walk across the iconic "Coathanger" arch bridge with panoramic vistas over the harbor, ferries, and skyline.',
        bestTime: '10:00 – 13:00',
        lat: -33.8523,
        lng: 151.2108,
        estimatedEntryInr: 0,
        crowdLevel: 'Popular',
      },
      {
        name: 'Bondi to Coogee Coastal Cliff Boardwalk',
        type: 'Attraction',
        description: '6-kilometer clifftop walk passing turquoise ocean waves, dramatic sandstone sculptures, and ocean rockpools.',
        bestTime: '07:30 – 10:30',
        lat: -33.8915,
        lng: 151.2767,
        estimatedEntryInr: 0,
        crowdLevel: 'Popular',
      },
      {
        name: 'The Rocks Historic Precinct & Campbells Cove',
        type: 'Attraction',
        description: 'Sandstone colonial passageways with harbour bridge views, weekend artisan markets, and historic pubs.',
        bestTime: '14:00 – 17:30',
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
