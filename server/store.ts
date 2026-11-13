import fs from 'node:fs';
import path from 'node:path';
import { buildDeterministicItinerary, extractRequirementsFromText } from '../src/lib/travelEngine';
import type { BookingRecord, Itinerary, UserPreferences } from '../src/types/travel';

interface PersistedDatabase {
  trips: Itinerary[];
  savedDestinationIds: string[];
  savedHotelIds: string[];
  bookings: BookingRecord[];
  preferences: UserPreferences;
}

const DATA_DIR = path.resolve(process.cwd(), '.data');
const DB_PATH = path.join(DATA_DIR, 'unseen-miles-db.json');

function createInitialDb(): PersistedDatabase {
  const seedTrip = buildDeterministicItinerary(
    extractRequirementsFromText(
      'From Kolkata to Bali for 5 days in December, budget ₹80,000 for 2 people, beaches, cafes, peaceful places'
    ),
    'bali-december-escape'
  );

  const seedBookings: BookingRecord[] = [
    {
      id: 'bk-flight-1',
      tripId: seedTrip.id,
      type: 'Flight',
      title: 'Kolkata (CCU) → Denpasar (DPS) Round-Trip Reference',
      provider: 'Demo Flight Adapter',
      referenceCode: 'UM-FLT-8824',
      dateLabel: '14 Dec – 19 Dec',
      status: 'Saved Record',
      amount: seedTrip.budgetBreakdown.flights,
      currency: seedTrip.currency,
      cancellationPolicy: 'Indicative fare rules: modification fee applies within 72h of departure.',
      providerUrl: 'https://www.google.com/travel/flights',
    },
    {
      id: 'bk-hotel-1',
      tripId: seedTrip.id,
      type: 'Hotel',
      title: seedTrip.selectedHotel?.name || 'Kajane Quiet Ridge Sanctuary',
      provider: 'Unseen Stays Catalog',
      referenceCode: 'UM-STY-4109',
      dateLabel: '14 Dec – 18 Dec (4 nights)',
      status: 'Saved Record',
      amount: seedTrip.budgetBreakdown.hotels,
      currency: seedTrip.currency,
      cancellationPolicy: seedTrip.selectedHotel?.cancellationPolicy || 'Free cancellation up to 72 hours prior.',
      providerUrl: 'https://www.booking.com',
    },
  ];

  return {
    trips: [seedTrip],
    savedDestinationIds: ['bali', 'nepal'],
    savedHotelIds: ['ht-bali-ubud-sanctuary', 'ht-nepal-pokhara-lake'],
    bookings: seedBookings,
    preferences: {
      name: 'Aarav Sen',
      email: 'traveller@unseenmiles.app',
      homeCity: 'Kolkata',
      preferredCurrency: 'INR',
      travelStyle: 'balanced',
      hotelPreference: 'boutique',
      foodPreferences: ['Local Cafés', 'Vegetarian Friendly'],
      interests: ['Beaches', 'Cafes', 'Peaceful Places'],
      preferredTransport: ['Scenic Rail', 'Private Day Transfer'],
      avoidCrowds: true,
    },
  };
}

let inMemoryDb: PersistedDatabase | null = null;
const TMP_DB_PATH = path.join('/tmp', 'unseen-miles-db.json');

function readDb(): PersistedDatabase {
  if (inMemoryDb) {
    return inMemoryDb;
  }
  try {
    if (fs.existsSync(TMP_DB_PATH)) {
      const raw = fs.readFileSync(TMP_DB_PATH, 'utf-8');
      inMemoryDb = JSON.parse(raw) as PersistedDatabase;
      return inMemoryDb;
    }
    if (fs.existsSync(DB_PATH)) {
      const raw = fs.readFileSync(DB_PATH, 'utf-8');
      inMemoryDb = JSON.parse(raw) as PersistedDatabase;
      return inMemoryDb;
    }
    try {
      fs.mkdirSync(DATA_DIR, { recursive: true });
      const initial = createInitialDb();
      fs.writeFileSync(DB_PATH, JSON.stringify(initial, null, 2), 'utf-8');
      inMemoryDb = initial;
      return inMemoryDb;
    } catch {
      const initial = createInitialDb();
      inMemoryDb = initial;
      return inMemoryDb;
    }
  } catch {
    inMemoryDb = createInitialDb();
    return inMemoryDb;
  }
}

function writeDb(data: PersistedDatabase): void {
  inMemoryDb = data;
  try {
    fs.mkdirSync(DATA_DIR, { recursive: true });
    fs.writeFileSync(DB_PATH, JSON.stringify(data, null, 2), 'utf-8');
  } catch {
    try {
      fs.writeFileSync(TMP_DB_PATH, JSON.stringify(data, null, 2), 'utf-8');
    } catch {
      // In-memory fallback is already set
    }
  }
}

export const store = {
  getTrips(): Itinerary[] {
    return readDb().trips;
  },
  getTrip(id: string): Itinerary | undefined {
    return readDb().trips.find((t) => t.id === id);
  },
  saveTrip(trip: Itinerary): Itinerary {
    const db = readDb();
    const idx = db.trips.findIndex((t) => t.id === trip.id);
    if (idx >= 0) {
      db.trips[idx] = trip;
    } else {
      db.trips.unshift(trip);
    }
    writeDb(db);
    return trip;
  },
  deleteTrip(id: string): boolean {
    const db = readDb();
    const prevLen = db.trips.length;
    db.trips = db.trips.filter((t) => t.id !== id);
    writeDb(db);
    return db.trips.length < prevLen;
  },
  getSaved(): { destinationIds: string[]; hotelIds: string[] } {
    const db = readDb();
    return { destinationIds: db.savedDestinationIds, hotelIds: db.savedHotelIds };
  },
  toggleSavedDestination(id: string): string[] {
    const db = readDb();
    if (db.savedDestinationIds.includes(id)) {
      db.savedDestinationIds = db.savedDestinationIds.filter((x) => x !== id);
    } else {
      db.savedDestinationIds.push(id);
    }
    writeDb(db);
    return db.savedDestinationIds;
  },
  toggleSavedHotel(id: string): string[] {
    const db = readDb();
    if (db.savedHotelIds.includes(id)) {
      db.savedHotelIds = db.savedHotelIds.filter((x) => x !== id);
    } else {
      db.savedHotelIds.push(id);
    }
    writeDb(db);
    return db.savedHotelIds;
  },
  getBookings(tripId?: string): BookingRecord[] {
    const bookings = readDb().bookings;
    return tripId ? bookings.filter((b) => b.tripId === tripId) : bookings;
  },
  addBooking(record: BookingRecord): BookingRecord {
    const db = readDb();
    db.bookings.unshift(record);
    writeDb(db);
    return record;
  },
  updateBookingStatus(
    id: string,
    status: BookingRecord['status']
  ): BookingRecord | undefined {
    const db = readDb();
    const item = db.bookings.find((b) => b.id === id);
    if (!item) return undefined;
    item.status = status;
    writeDb(db);
    return item;
  },
  getPreferences(): UserPreferences {
    return readDb().preferences;
  },
  updatePreferences(prefs: UserPreferences): UserPreferences {
    const db = readDb();
    db.preferences = prefs;
    writeDb(db);
    return prefs;
  },
};
