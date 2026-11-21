// server/app.ts
import "dotenv/config";
import express from "express";

// src/data/catalog.ts
var DESTINATIONS = [
  {
    id: "bali",
    slug: "bali",
    name: "Bali",
    country: "Indonesia",
    region: "Southeast Asia",
    tagline: "Emerald rice terraces, quiet cliffside coves, and warm island hospitality.",
    description: "From misty Ubud highlands and artisan coffee roasteries to limestone cliffs above Uluwatu, Bali rewards unhurried travellers seeking peaceful nature, temple culture, and coastal warmth.",
    mediaKey: "bali",
    bestSeason: "April \u2013 October & December dry mornings",
    recommendedDays: 5,
    dailyBudgetInr: { budget: 4800, balanced: 8500, luxury: 18500 },
    currencyCode: "IDR",
    currencySymbol: "Rp",
    languageName: "Indonesian & Balinese",
    localTransportSummary: "Private day-charter drivers, metered Bluebird taxis, and scooter rentals for quiet rural roads.",
    culturalTips: [
      "Wear a sarong and sash when entering Hindu temple courtyards.",
      "Use your right hand when passing items or offering payment.",
      "Respect quiet temple ceremonies and local Nyepi observances."
    ],
    safetyNotes: [
      "Carry bottled water and confirm reef-safe conditions before swimming on southern beaches.",
      "Use licensed metered taxis or verified app-based ride pickups from Ngurah Rai Airport."
    ],
    weatherSummary: {
      tempRangeC: "24\xB0C \u2013 31\xB0C",
      condition: "Warm tropical sun with brief late-afternoon coastal breezes",
      humidity: "74%",
      advisory: "Seasonal indicative range; verify 7-day forecast prior to departure."
    },
    coordinates: { lat: -8.4095, lng: 115.1889 },
    tags: ["Beaches", "Cafes", "Peaceful Places", "Wellness", "Nature"],
    places: [
      {
        id: "bali-airport",
        name: "Ngurah Rai International Airport (DPS)",
        type: "Airport",
        description: "Primary international gateway south of Denpasar.",
        bestTime: "Arrival & Departure",
        lat: -8.7482,
        lng: 115.1672,
        estimatedEntryInr: 0,
        crowdLevel: "Moderate"
      },
      {
        id: "bali-sanur",
        name: "Sanur Sunrise Promenade",
        type: "Attraction",
        description: "Calm reef-protected shoreline ideal for unhurried morning walks.",
        bestTime: "06:30 \u2013 09:00",
        lat: -8.6938,
        lng: 115.2633,
        estimatedEntryInr: 0,
        crowdLevel: "Quiet"
      },
      {
        id: "bali-sidemen",
        name: "Sidemen Valley Terraces",
        type: "Hidden Gem",
        description: "Serene east-Bali rice valley overlooking Mount Agung far from crowds.",
        bestTime: "08:00 \u2013 11:30",
        lat: -8.4819,
        lng: 115.4426,
        estimatedEntryInr: 350,
        crowdLevel: "Quiet"
      },
      {
        id: "bali-seniman",
        name: "Ubud Artisan Roastery Quarter",
        type: "Cafe & Food",
        description: "Single-origin Kintamani coffee bars and tranquil garden kitchens.",
        bestTime: "10:30 \u2013 14:00",
        lat: -8.5069,
        lng: 115.2625,
        estimatedEntryInr: 1100,
        crowdLevel: "Moderate"
      },
      {
        id: "bali-thomas",
        name: "Padang & Thomas Cove",
        type: "Hidden Gem",
        description: "Quiet limestone cliff staircase leading to clear turquoise surf.",
        bestTime: "15:30 \u2013 18:15",
        lat: -8.8149,
        lng: 115.1039,
        estimatedEntryInr: 250,
        crowdLevel: "Quiet"
      }
    ],
    phrases: [
      { english: "Hello", local: "Halo", pronunciation: "ha-lo", context: "Greeting" },
      { english: "Thank you", local: "Terima kasih", pronunciation: "te-ree-ma ka-see", context: "Greeting" },
      { english: "How much is this?", local: "Berapa harganya?", pronunciation: "be-ra-pa har-ga-nya", context: "Transit" },
      { english: "Vegetarian food, please", local: "Saya makan vegetarian", pronunciation: "sa-ya ma-kan ve-ge-ta-ri-an", context: "Dining" },
      { english: "Please take me to the hotel", local: "Tolong antar ke hotel", pronunciation: "to-long an-tar ke ho-tel", context: "Transit" },
      { english: "I need medical help", local: "Saya butuh bantuan medis", pronunciation: "sa-ya bu-tuh ban-tu-an me-dis", context: "Emergency" }
    ]
  },
  {
    id: "nepal",
    slug: "nepal",
    name: "Nepal",
    country: "Nepal",
    region: "South Asia",
    tagline: "Himalayan ridges, serene lakeside mornings in Pokhara, and timeless heritage.",
    description: "Nepal blends high-altitude Himalayan panoramas with tranquil lakeside retreats in Pokhara and ancient brick courtyards across the Kathmandu Valley.",
    mediaKey: "nepal",
    bestSeason: "October \u2013 December & March \u2013 May",
    recommendedDays: 6,
    dailyBudgetInr: { budget: 3500, balanced: 6800, luxury: 15e3 },
    currencyCode: "NPR",
    currencySymbol: "\u0930\u0942",
    languageName: "Nepali",
    localTransportSummary: "Domestic scenic flights between Kathmandu and Pokhara, tourist coaches, and private mountain SUVs.",
    culturalTips: [
      "Walk clockwise around Buddhist stupas and prayer wheels.",
      "Ask before photographing local monks or private rituals."
    ],
    safetyNotes: [
      "Allow gradual acclimatization above 2,500m and pack layered thermal windbreakers.",
      "Carry offline maps when venturing into valley trails."
    ],
    weatherSummary: {
      tempRangeC: "8\xB0C \u2013 21\xB0C",
      condition: "Crisp clear alpine skies with cool evenings",
      humidity: "52%",
      advisory: "Mountain visibility changes rapidly; verify morning flight windows."
    },
    coordinates: { lat: 28.2096, lng: 83.9856 },
    tags: ["Mountains", "Lakes", "Adventure", "Culture", "Peaceful Places"],
    places: [
      {
        id: "nepal-ktm",
        name: "Tribhuvan International Airport (KTM)",
        type: "Airport",
        description: "Valley gateway connecting directly to Pokhara.",
        bestTime: "Arrival & Departure",
        lat: 27.6966,
        lng: 85.3591,
        estimatedEntryInr: 0,
        crowdLevel: "Moderate"
      },
      {
        id: "nepal-phewa",
        name: "Phewa Lake & Barahi Shore",
        type: "Attraction",
        description: "Mirror-still reflections of Machhapuchhre and the Annapurna range.",
        bestTime: "06:00 \u2013 08:30",
        lat: 28.2116,
        lng: 83.9537,
        estimatedEntryInr: 450,
        crowdLevel: "Quiet"
      },
      {
        id: "nepal-sarangkot",
        name: "Sarangkot Dawn Ridge",
        type: "Attraction",
        description: "Panoramic Himalayan sunrise terrace overlooking Dhaulagiri and Annapurna.",
        bestTime: "05:45 \u2013 07:30",
        lat: 28.2439,
        lng: 83.9486,
        estimatedEntryInr: 150,
        crowdLevel: "Popular"
      },
      {
        id: "nepal-bandipur",
        name: "Bandipur Heritage Ridge",
        type: "Hidden Gem",
        description: "Car-free Newari hilltop town preserving 18th-century timber facades.",
        bestTime: "11:00 \u2013 16:00",
        lat: 27.9377,
        lng: 84.4063,
        estimatedEntryInr: 0,
        crowdLevel: "Quiet"
      }
    ],
    phrases: [
      { english: "Hello / Greetings", local: "Namaste", pronunciation: "na-mas-te", context: "Greeting" },
      { english: "Thank you", local: "Dhanyabad", pronunciation: "dhan-ya-baad", context: "Greeting" },
      { english: "How much?", local: "Kati ho?", pronunciation: "ka-ti ho", context: "Transit" },
      { english: "Delicious food", local: "Khana mitho chha", pronunciation: "kha-na mi-tho chha", context: "Dining" },
      { english: "Please help", local: "Kripaya madat garnuhos", pronunciation: "kri-pa-ya ma-dat gar-nu-hos", context: "Emergency" }
    ]
  },
  {
    id: "switzerland",
    slug: "switzerland",
    name: "Switzerland",
    country: "Switzerland",
    region: "Europe",
    tagline: "Glacial lakes, scenic alpine rail passes, and quiet mountain chalets.",
    description: "Switzerland pairs punctual panoramic rail corridors with crisp alpine meadows, emerald lakes in Lucerne and Interlaken, and car-free mountain villages like Zermatt.",
    mediaKey: "switzerland",
    bestSeason: "June \u2013 September & December \u2013 February",
    recommendedDays: 6,
    dailyBudgetInr: { budget: 15e3, balanced: 24e3, luxury: 45e3 },
    currencyCode: "CHF",
    currencySymbol: "CHF",
    languageName: "German, French & Italian",
    localTransportSummary: "Swiss Travel Pass covering SBB intercity trains, cogwheel mountain railways, and lake steamers.",
    culturalTips: [
      "Quiet hours are respected on scenic train carriages and alpine villages after 22:00.",
      "Tap water from public alpine fountains is safe and crisp unless marked otherwise."
    ],
    safetyNotes: [
      "Check gondola operating schedules during seasonal shoulder maintenance weeks."
    ],
    weatherSummary: {
      tempRangeC: "4\xB0C \u2013 19\xB0C",
      condition: "Crisp mountain air with bright alpine light",
      humidity: "58%",
      advisory: "High-altitude passes remain cool even in summer months."
    },
    coordinates: { lat: 46.0207, lng: 7.7491 },
    tags: ["Mountains", "Rail", "Lakes", "Luxury", "Peaceful Places"],
    places: [
      {
        id: "ch-zurich",
        name: "Zurich Airport Rail Hub (ZRH)",
        type: "Airport",
        description: "Direct underground rail terminal connecting to Lucerne and Zermatt.",
        bestTime: "Arrival & Departure",
        lat: 47.4582,
        lng: 8.5555,
        estimatedEntryInr: 0,
        crowdLevel: "Moderate"
      },
      {
        id: "ch-zermatt",
        name: "Riffelsee Alpine Mirror Trail",
        type: "Attraction",
        description: "Calm glacial tarn reflecting the eastern face of the Matterhorn.",
        bestTime: "08:00 \u2013 11:00",
        lat: 45.9839,
        lng: 7.7618,
        estimatedEntryInr: 4200,
        crowdLevel: "Moderate"
      },
      {
        id: "ch-appenzell",
        name: "Seealpsee Valley Path",
        type: "Hidden Gem",
        description: "Secluded pine-rimmed alpine lake reached on foot above Wasserauen.",
        bestTime: "09:30 \u2013 13:30",
        lat: 47.2686,
        lng: 9.4008,
        estimatedEntryInr: 0,
        crowdLevel: "Quiet"
      }
    ],
    phrases: [
      { english: "Hello", local: "Gr\xFCezi", pronunciation: "groo-et-si", context: "Greeting" },
      { english: "Thank you", local: "Merci / Danke", pronunciation: "mer-si / dan-ke", context: "Greeting" },
      { english: "Where is the train platform?", local: "Wo ist das Gleis?", pronunciation: "vo ist das glais", context: "Transit" },
      { english: "Water, please", local: "Ein Wasser, bitte", pronunciation: "ain vas-ser bit-te", context: "Dining" }
    ]
  },
  {
    id: "japan",
    slug: "japan",
    name: "Japan",
    country: "Japan",
    region: "East Asia",
    tagline: "Cedar temple sanctuaries, Shinkansen precision, and Kyoto tea alleys.",
    description: "Discover serene mossy gardens in Kyoto, cedar mountain shrines in Hakone, and neighborhood kissaten coffee houses connected by effortless high-speed rail.",
    mediaKey: "japan",
    bestSeason: "March \u2013 May & October \u2013 November",
    recommendedDays: 7,
    dailyBudgetInr: { budget: 9500, balanced: 16500, luxury: 34e3 },
    currencyCode: "JPY",
    currencySymbol: "\xA5",
    languageName: "Japanese",
    localTransportSummary: "ICOCA/Suica transit cards for metros and buses, plus Shinkansen bullet trains between cities.",
    culturalTips: [
      "Remove shoes when stepping onto tatami mats inside ryokans and traditional tea rooms.",
      "Carry a small coin pouch for rural shrine donations and neighborhood bakeries."
    ],
    safetyNotes: [
      "Download offline rail transfer routes and keep luggage dimensions within Shinkansen seat rules."
    ],
    weatherSummary: {
      tempRangeC: "11\xB0C \u2013 22\xB0C",
      condition: "Mild seasonal clarity with crisp mornings",
      humidity: "60%",
      advisory: "Confirm regional foliage or blossom windows two weeks before travel."
    },
    coordinates: { lat: 35.0116, lng: 135.7681 },
    tags: ["Culture", "Cafes", "Rail", "Peaceful Places", "Heritage"],
    places: [
      {
        id: "jp-hnd",
        name: "Tokyo Haneda International Airport (HND)",
        type: "Airport",
        description: "High-speed gateway into central Tokyo and direct Shinkansen bullet train connections across Japan.",
        bestTime: "Arrival & Departure",
        lat: 35.5494,
        lng: 139.7798,
        estimatedEntryInr: 0,
        crowdLevel: "Moderate"
      },
      {
        id: "jp-sensoji",
        name: "Senso-ji Temple & Asakusa Heritage Quarter (Tokyo)",
        type: "Attraction",
        description: "Tokyo\u2019s oldest, most revered Buddhist temple featuring the giant red Kaminarimon lantern and traditional artisan market street.",
        bestTime: "07:00 \u2013 10:00",
        lat: 35.7148,
        lng: 139.7967,
        estimatedEntryInr: 0,
        crowdLevel: "Popular"
      },
      {
        id: "jp-shibuya",
        name: "Shibuya Crossing, Hachiko & Meiji Jingu Forest (Tokyo)",
        type: "Attraction",
        description: "World-famous pedestrian scramble crossing and Hachiko statue, paired with the serene 170-acre evergreen cedar forest of Meiji Shrine.",
        bestTime: "09:00 \u2013 13:00",
        lat: 35.6595,
        lng: 139.7005,
        estimatedEntryInr: 0,
        crowdLevel: "Popular"
      },
      {
        id: "jp-shinjuku",
        name: "Shinjuku Gyoen National Garden & Skyline (Tokyo)",
        type: "Attraction",
        description: "Sprawling 144-acre imperial garden showcasing cherry blossoms in spring, vibrant autumn maples, and tranquil Japanese landscape ponds.",
        bestTime: "09:30 \u2013 12:30",
        lat: 35.6852,
        lng: 139.7101,
        estimatedEntryInr: 320,
        crowdLevel: "Moderate"
      },
      {
        id: "jp-fuji",
        name: "Mount Fuji & Lake Ashi Torii Gate (Hakone)",
        type: "Attraction",
        description: "Iconic snow-capped sacred volcano views from the pirate boat cruise across Lake Ashi and floating red Torii gate of Hakone Shrine.",
        bestTime: "09:00 \u2013 15:00",
        lat: 35.2045,
        lng: 139.0253,
        estimatedEntryInr: 1200,
        crowdLevel: "Popular"
      },
      {
        id: "jp-fushimi",
        name: "Fushimi Inari Taisha Thousand Torii Gates (Kyoto)",
        type: "Attraction",
        description: "Spectacular mountain trail shaded by over 10,000 vibrant vermilion Torii gates winding through sacred cedar woodlands.",
        bestTime: "06:30 \u2013 09:00",
        lat: 34.9671,
        lng: 135.7727,
        estimatedEntryInr: 0,
        crowdLevel: "Popular"
      },
      {
        id: "jp-kinkakuji",
        name: "Kinkaku-ji Golden Pavilion & Zen Gardens (Kyoto)",
        type: "Attraction",
        description: "Breathtaking Zen Buddhist temple covered in shimmering gold leaf, reflecting across the tranquil Mirror Pond surrounded by pine islands.",
        bestTime: "09:00 \u2013 11:30",
        lat: 35.0394,
        lng: 135.7292,
        estimatedEntryInr: 450,
        crowdLevel: "Popular"
      },
      {
        id: "jp-arashiyama",
        name: "Arashiyama Soaring Bamboo Grove & Tenryu-ji (Kyoto)",
        type: "Attraction",
        description: "Towering emerald green bamboo stalks swaying with wind chimes, beside a 14th-century UNESCO World Heritage Zen pond garden.",
        bestTime: "07:30 \u2013 10:00",
        lat: 35.0169,
        lng: 135.6713,
        estimatedEntryInr: 350,
        crowdLevel: "Popular"
      },
      {
        id: "jp-gion",
        name: "Gion Historic Geisha District & Kiyomizu-dera (Kyoto)",
        type: "Hidden Gem",
        description: "Atmospheric cobblestone alleys lined with wooden 17th-century machiya townhouses, leading to the dramatic wooden cliff stage of Kiyomizu-dera.",
        bestTime: "16:00 \u2013 20:00",
        lat: 34.9984,
        lng: 135.785,
        estimatedEntryInr: 400,
        crowdLevel: "Moderate"
      },
      {
        id: "jp-dotonbori",
        name: "Dotonbori Culinary Canal & Osaka Castle (Osaka)",
        type: "Cafe & Food",
        description: "Vibrant neon food street famous for crispy Takoyaki and Okonomiyaki, combined with the towering 16th-century samurai fortress of Osaka Castle.",
        bestTime: "17:00 \u2013 21:30",
        lat: 34.6687,
        lng: 135.5013,
        estimatedEntryInr: 600,
        crowdLevel: "Popular"
      },
      {
        id: "jp-ohara",
        name: "Ohara Sanzen-in Cedar Sanctuary",
        type: "Hidden Gem",
        description: "Moss gardens and quiet mountain temple north of central Kyoto.",
        bestTime: "08:30 \u2013 11:00",
        lat: 35.1197,
        lng: 135.8344,
        estimatedEntryInr: 450,
        crowdLevel: "Quiet"
      },
      {
        id: "jp-uji",
        name: "Uji Riverside Matcha Houses",
        type: "Cafe & Food",
        description: "Centuries-old tea estates and stone-milled Uji matcha parlors.",
        bestTime: "13:00 \u2013 16:00",
        lat: 34.8893,
        lng: 135.8077,
        estimatedEntryInr: 950,
        crowdLevel: "Quiet"
      }
    ],
    phrases: [
      { english: "Excuse me / Hello", local: "Sumimasen / Konnichiwa", pronunciation: "su-mi-ma-sen", context: "Greeting" },
      { english: "Thank you", local: "Arigat\u014D gozaimasu", pronunciation: "a-ri-ga-to go-zai-mas", context: "Greeting" },
      { english: "How much is this?", local: "Ikura desu ka?", pronunciation: "i-ku-ra des ka", context: "Transit" },
      { english: "Menu, please", local: "Meny\u016B o onegaishimasu", pronunciation: "men-yuu o o-ne-gai-shi-mas", context: "Dining" }
    ]
  },
  {
    id: "italy",
    slug: "italy",
    name: "Italy",
    country: "Italy",
    region: "Europe",
    tagline: "Sunlit cliffside villages, coastal ferries, and slow Mediterranean evenings.",
    description: "From terraced lemon groves above Amalfi and Ravello to historic Tuscan lanes and coastal paths, Italy rewards unhurried mornings and local trattoria dinners.",
    mediaKey: "italy",
    bestSeason: "May \u2013 June & September \u2013 October",
    recommendedDays: 6,
    dailyBudgetInr: { budget: 11e3, balanced: 18500, luxury: 36e3 },
    currencyCode: "EUR",
    currencySymbol: "\u20AC",
    languageName: "Italian",
    localTransportSummary: "High-speed Frecciarossa rail to Naples/Salerno paired with scenic coastal ferries.",
    culturalTips: [
      "Espresso at the caf\xE9 counter is brisk and priced differently from seated terrace service.",
      "Modest shoulder coverings are appreciated inside historic cathedrals."
    ],
    safetyNotes: [
      "Coastal ferry schedules depend on sea swell; keep flexible afternoon buffers."
    ],
    weatherSummary: {
      tempRangeC: "17\xB0C \u2013 26\xB0C",
      condition: "Clear Mediterranean sunshine with warm sea breeze",
      humidity: "55%",
      advisory: "Book coastal ferry crossings a day ahead during peak summer."
    },
    coordinates: { lat: 40.6333, lng: 14.6029 },
    tags: ["Coastline", "Cafes", "Culture", "Romantic", "Food"],
    places: [
      {
        id: "it-fco",
        name: "Rome Leonardo da Vinci\u2013Fiumicino Airport (FCO)",
        type: "Airport",
        description: "Primary international hub with Leonardo Express train into central Rome and Frecciarossa high-speed rail across Italy.",
        bestTime: "Arrival & Departure",
        lat: 41.8003,
        lng: 12.2389,
        estimatedEntryInr: 0,
        crowdLevel: "Moderate"
      },
      {
        id: "it-colosseum",
        name: "Colosseum & Roman Forum Archeological Park (Rome)",
        type: "Attraction",
        description: "Monumental 2,000-year-old amphitheater of gladiators and the political center of the Roman Empire.",
        bestTime: "08:30 \u2013 11:30",
        lat: 41.8902,
        lng: 12.4922,
        estimatedEntryInr: 2100,
        crowdLevel: "Popular"
      },
      {
        id: "it-vatican",
        name: "Vatican City, St. Peter\u2019s Basilica & Sistine Chapel",
        type: "Attraction",
        description: "Michelangelo\u2019s legendary frescoes in the Sistine Chapel and the grandeur of St. Peter\u2019s Square.",
        bestTime: "08:00 \u2013 12:00",
        lat: 41.9029,
        lng: 12.4534,
        estimatedEntryInr: 2400,
        crowdLevel: "Popular"
      },
      {
        id: "it-trevi",
        name: "Trevi Fountain & The Pantheon Marble Dome (Rome)",
        type: "Attraction",
        description: "Baroque masterpiece fountain where tossing a coin guarantees your return to Rome, and the intact 2nd-century open-oculus temple.",
        bestTime: "07:30 \u2013 10:00",
        lat: 41.9009,
        lng: 12.4833,
        estimatedEntryInr: 500,
        crowdLevel: "Popular"
      },
      {
        id: "it-florence",
        name: "Florence Duomo (Santa Maria del Fiore) & Ponte Vecchio",
        type: "Attraction",
        description: "Brunelleschi\u2019s terracotta dome rising above Renaissance marble streets, and the historic gold-artisan bridge over the Arno River.",
        bestTime: "09:00 \u2013 12:30",
        lat: 43.7731,
        lng: 11.256,
        estimatedEntryInr: 1800,
        crowdLevel: "Popular"
      },
      {
        id: "it-venice",
        name: "Venice St. Mark\u2019s Square & Grand Canal Gondola Walk",
        type: "Attraction",
        description: "Floating city of canals, Byzantine golden mosaics in St. Mark\u2019s Basilica, and historic gondola docks.",
        bestTime: "08:30 \u2013 12:00",
        lat: 45.4342,
        lng: 12.3385,
        estimatedEntryInr: 1200,
        crowdLevel: "Popular"
      },
      {
        id: "it-positano",
        name: "Positano Pastel Cliffside & Amalfi Coast Panorama",
        type: "Attraction",
        description: "Pastel houses cascading vertically down limestone cliffs to sapphire Mediterranean waters and lemon grove terraces.",
        bestTime: "10:00 \u2013 14:00",
        lat: 40.6281,
        lng: 14.485,
        estimatedEntryInr: 0,
        crowdLevel: "Popular"
      },
      {
        id: "it-ravello",
        name: "Ravello Villa Cimbrone Cliffside Gardens",
        type: "Hidden Gem",
        description: "Elevated medieval hilltop village with infinity balconies high above the coastal traffic.",
        bestTime: "09:00 \u2013 12:00",
        lat: 40.6489,
        lng: 14.6128,
        estimatedEntryInr: 850,
        crowdLevel: "Quiet"
      },
      {
        id: "it-cetara",
        name: "Cetara Harbor Trattorias",
        type: "Cafe & Food",
        description: "Authentic fishing cove famous for lemon groves and quiet seaside tables.",
        bestTime: "18:30 \u2013 21:00",
        lat: 40.6475,
        lng: 14.7014,
        estimatedEntryInr: 2200,
        crowdLevel: "Quiet"
      }
    ],
    phrases: [
      { english: "Good morning", local: "Buongiorno", pronunciation: "bwon-jor-no", context: "Greeting" },
      { english: "Thank you", local: "Grazie", pronunciation: "grat-zye", context: "Greeting" },
      { english: "The bill, please", local: "Il conto, per favore", pronunciation: "il kon-to per fa-vo-re", context: "Dining" },
      { english: "Where is the ferry?", local: "Dov\u2019\xE8 il traghetto?", pronunciation: "do-ve il tra-get-to", context: "Transit" }
    ]
  },
  {
    id: "ladakh",
    slug: "ladakh",
    name: "Ladakh",
    country: "India",
    region: "South Asia",
    tagline: "High-altitude turquoise lakes, sunlit monasteries, and silent Himalayan valleys.",
    description: "Set above 3,500 meters in the trans-Himalayas, Ladakh pairs whitewashed Buddhist gompas and Nubra sand dunes with crisp starry nights and slow mountain hospitality.",
    mediaKey: "nepal",
    bestSeason: "May \u2013 September",
    recommendedDays: 6,
    dailyBudgetInr: { budget: 4200, balanced: 7800, luxury: 16500 },
    currencyCode: "INR",
    currencySymbol: "\u20B9",
    languageName: "Ladakhi & Hindi",
    localTransportSummary: "Private Innova/Xylo mountain SUVs with experienced pass drivers and local Leh town e-rickshaws.",
    culturalTips: [
      "Acclimatize gently in Leh for the first 36 hours before crossing Khardung La.",
      "Dress modestly inside active monastery prayer halls and avoid flash photography."
    ],
    safetyNotes: [
      "Carry hydration electrolytes and thermal layers even during sunny July afternoons."
    ],
    weatherSummary: {
      tempRangeC: "6\xB0C \u2013 22\xB0C",
      condition: "Brilliantly clear high-altitude sun with brisk evenings",
      humidity: "32%",
      advisory: "High UV index at altitude; pack SPF 50+ and sunglasses."
    },
    coordinates: { lat: 34.1526, lng: 77.5771 },
    tags: ["Mountains", "Lakes", "Adventure", "Peaceful Places", "Culture"],
    places: [
      {
        id: "ladakh-ixl",
        name: "Kushok Bakula Rimpochee Airport (IXL)",
        type: "Airport",
        description: "Scenic Himalayan landing strip opening into the Indus Valley.",
        bestTime: "Arrival & Departure",
        lat: 34.1359,
        lng: 77.5465,
        estimatedEntryInr: 0,
        crowdLevel: "Moderate"
      },
      {
        id: "ladakh-thiksey",
        name: "Thiksey Monastery Dawn Courtyard",
        type: "Attraction",
        description: "Twelve-story hillside monastery overlooking emerald Indus pastures.",
        bestTime: "06:30 \u2013 09:00",
        lat: 34.0563,
        lng: 77.6669,
        estimatedEntryInr: 50,
        crowdLevel: "Quiet"
      },
      {
        id: "ladakh-pangong",
        name: "Pangong Tso Merak Shore",
        type: "Hidden Gem",
        description: "Tranquil southern lakeshore far quieter than the main arrival pier.",
        bestTime: "08:00 \u2013 12:00",
        lat: 33.7888,
        lng: 78.6079,
        estimatedEntryInr: 400,
        crowdLevel: "Quiet"
      },
      {
        id: "ladakh-cafe",
        name: "Leh Old Town Apricot Roastery",
        type: "Cafe & Food",
        description: "Warm mud-brick courtyard serving butter tea and slow-drip coffee.",
        bestTime: "14:00 \u2013 17:00",
        lat: 34.1651,
        lng: 77.5868,
        estimatedEntryInr: 550,
        crowdLevel: "Quiet"
      }
    ],
    phrases: [
      { english: "Hello / Blessings", local: "Julley", pronunciation: "joo-lay", context: "Greeting" },
      { english: "Thank you", local: "Thukje-che", pronunciation: "thook-jay-chay", context: "Greeting" },
      { english: "Hot water, please", local: "Chhu tshanmo nang", pronunciation: "choo tsan-mo nang", context: "Dining" }
    ]
  },
  {
    id: "kerala",
    slug: "kerala",
    name: "Kerala",
    country: "India",
    region: "South Asia",
    tagline: "Emerald backwater canals, misty Munnar tea ridges, and palm-fringed coves.",
    description: "Glide through palm-shaded lagoons in Alleppey, walk aromatic cardamom trails in Munnar, and unwind in heritage spice bungalows overlooking the Arabian Sea.",
    mediaKey: "bali",
    bestSeason: "October \u2013 March",
    recommendedDays: 5,
    dailyBudgetInr: { budget: 3900, balanced: 7400, luxury: 16e3 },
    currencyCode: "INR",
    currencySymbol: "\u20B9",
    languageName: "Malayalam",
    localTransportSummary: "Private AC sedans for hill climbs, traditional kettuvallam houseboats, and coastal rail.",
    culturalTips: [
      "Remove footwear before entering heritage homes and temple precincts.",
      "Sample traditional sadya meals served on fresh banana leaves."
    ],
    safetyNotes: [
      "Pack light rain protection for misty Munnar ridges even in shoulder months."
    ],
    weatherSummary: {
      tempRangeC: "19\xB0C \u2013 29\xB0C",
      condition: "Misty highland mornings and warm coastal breezes",
      humidity: "78%",
      advisory: "Munnar stays cool at dusk while Alleppey stays tropical."
    },
    coordinates: { lat: 9.4981, lng: 76.3388 },
    tags: ["Beaches", "Nature", "Wellness", "Peaceful Places", "Cafes"],
    places: [
      {
        id: "kl-cok",
        name: "Cochin International Airport (COK)",
        type: "Airport",
        description: "Solar-powered coastal hub serving Fort Kochi, Munnar, and Alleppey.",
        bestTime: "Arrival & Departure",
        lat: 10.1518,
        lng: 76.393,
        estimatedEntryInr: 0,
        crowdLevel: "Moderate"
      },
      {
        id: "kl-munnar",
        name: "Kolukkumalai Tea Estate Ridge",
        type: "Hidden Gem",
        description: "World-highest organic tea slopes above drifting morning clouds.",
        bestTime: "06:00 \u2013 09:30",
        lat: 10.0793,
        lng: 77.2206,
        estimatedEntryInr: 600,
        crowdLevel: "Quiet"
      },
      {
        id: "kl-fortkochi",
        name: "Fort Kochi Pepper Courtyard Caf\xE9s",
        type: "Cafe & Food",
        description: "Restored colonial spice warehouses housing artisanal caf\xE9s and galleries.",
        bestTime: "15:30 \u2013 18:30",
        lat: 9.9658,
        lng: 76.2421,
        estimatedEntryInr: 800,
        crowdLevel: "Moderate"
      }
    ],
    phrases: [
      { english: "Hello", local: "Namaskaram", pronunciation: "na-mas-kaa-ram", context: "Greeting" },
      { english: "Thank you", local: "Nanni", pronunciation: "nan-ni", context: "Greeting" },
      { english: "How much?", local: "Ethra roopa aayi?", pronunciation: "eth-ra roo-pa aa-yi", context: "Transit" }
    ]
  },
  {
    id: "greece",
    slug: "greece",
    name: "Santorini",
    country: "Greece",
    region: "Europe",
    tagline: "Whitewashed caldera terraces, volcanic coves, and Aegean golden hours.",
    description: "Beyond the busy sunset corners of Oia, Santorini and neighboring Crete hide quiet Cycladic footpaths, family vineyards, and calm cobalt bays.",
    mediaKey: "italy",
    bestSeason: "May \u2013 June & September \u2013 October",
    recommendedDays: 5,
    dailyBudgetInr: { budget: 12e3, balanced: 21e3, luxury: 42e3 },
    currencyCode: "EUR",
    currencySymbol: "\u20AC",
    languageName: "Greek",
    localTransportSummary: "High-speed Aegean ferries, island KTEL buses, and private caldera transfers.",
    culturalTips: [
      "Greet locals with Kalimera in the morning and Kalispera in the evening.",
      "Enjoy slow taverna dinners starting after 20:00."
    ],
    safetyNotes: [
      "Wear gripped walking shoes on polished marble cliff paths between Fira and Oia."
    ],
    weatherSummary: {
      tempRangeC: "20\xB0C \u2013 28\xB0C",
      condition: "Sun-drenched Aegean skies with refreshing meltemi breeze",
      humidity: "54%",
      advisory: "Shoulder months offer warm seas without peak cruise congestion."
    },
    coordinates: { lat: 36.3932, lng: 25.4615 },
    tags: ["Beaches", "Coastline", "Romantic", "Cafes", "Culture"],
    places: [
      {
        id: "gr-jtr",
        name: "Santorini Thira Airport (JTR)",
        type: "Airport",
        description: "Eastern island runway 15 minutes from Pyrgos and Fira.",
        bestTime: "Arrival & Departure",
        lat: 36.3992,
        lng: 25.4793,
        estimatedEntryInr: 0,
        crowdLevel: "Moderate"
      },
      {
        id: "gr-pyrgos",
        name: "Pyrgos Medieval Hilltop Lanes",
        type: "Hidden Gem",
        description: "Car-free Cycladic village with 360-degree island views and quiet caf\xE9s.",
        bestTime: "08:30 \u2013 11:30",
        lat: 36.3833,
        lng: 25.4488,
        estimatedEntryInr: 0,
        crowdLevel: "Quiet"
      },
      {
        id: "gr-ammoudi",
        name: "Ammoudi Bay Cliff Path",
        type: "Attraction",
        description: "Red volcanic rock harbor below Oia with crystal swimming coves.",
        bestTime: "16:30 \u2013 19:00",
        lat: 36.4606,
        lng: 25.3712,
        estimatedEntryInr: 0,
        crowdLevel: "Popular"
      }
    ],
    phrases: [
      { english: "Good morning", local: "Kalimera", pronunciation: "ka-lee-me-ra", context: "Greeting" },
      { english: "Thank you", local: "Efharisto", pronunciation: "ef-ha-ree-sto", context: "Greeting" },
      { english: "Bill, please", local: "Ton logariasmo, parakalo", pronunciation: "ton lo-ga-ryas-mo", context: "Dining" }
    ]
  },
  {
    id: "turkey",
    slug: "turkey",
    name: "Cappadocia",
    country: "Turkey",
    region: "Eurasia",
    tagline: "Dawn hot-air balloons over tuff canyons, cave suites, and Bosphorus tea.",
    description: "Drift above rose-tinted valleys in G\xF6reme, sleep inside sculpted stone cave sanctuaries in U\xE7hisar, and linger over Turkish coffee beside historic Silk Road caravanserais.",
    mediaKey: "hero_alpine",
    bestSeason: "April \u2013 June & September \u2013 November",
    recommendedDays: 6,
    dailyBudgetInr: { budget: 6500, balanced: 12500, luxury: 26e3 },
    currencyCode: "TRY",
    currencySymbol: "\u20BA",
    languageName: "Turkish",
    localTransportSummary: "Short domestic flights from Istanbul to Kayseri/Nev\u015Fehir paired with valley shuttles.",
    culturalTips: [
      "Accept offered apple or black tea in artisan ceramic workshops as a warm gesture.",
      "Dress modestly when visiting historic mosques in Istanbul."
    ],
    safetyNotes: [
      "Balloon flights depend on dawn wind speeds; schedule at least two mornings in G\xF6reme."
    ],
    weatherSummary: {
      tempRangeC: "10\xB0C \u2013 24\xB0C",
      condition: "Crisp Anatolian plateau mornings and golden afternoon light",
      humidity: "45%",
      advisory: "Carry a windproof jacket for pre-dawn valley viewpoints."
    },
    coordinates: { lat: 38.6431, lng: 34.8289 },
    tags: ["Adventure", "Mountains", "Culture", "Peaceful Places", "Cafes"],
    places: [
      {
        id: "tr-nav",
        name: "Nev\u015Fehir Kapadokya Airport (NAV)",
        type: "Airport",
        description: "Quiet regional terminal 40 minutes from U\xE7hisar and G\xF6reme.",
        bestTime: "Arrival & Departure",
        lat: 38.7719,
        lng: 34.5344,
        estimatedEntryInr: 0,
        crowdLevel: "Quiet"
      },
      {
        id: "tr-rose",
        name: "Rose & Red Valley Trail",
        type: "Hidden Gem",
        description: "Sculpted volcanic ridges glowing copper-pink before dusk.",
        bestTime: "16:30 \u2013 18:45",
        lat: 38.6542,
        lng: 34.8551,
        estimatedEntryInr: 450,
        crowdLevel: "Quiet"
      },
      {
        id: "tr-uchisar",
        name: "U\xE7hisar Stone Castle Terrace",
        type: "Attraction",
        description: "Highest carved rock citadel overlooking pigeon valleys.",
        bestTime: "06:00 \u2013 08:30",
        lat: 38.6309,
        lng: 34.8054,
        estimatedEntryInr: 700,
        crowdLevel: "Moderate"
      }
    ],
    phrases: [
      { english: "Hello", local: "Merhaba", pronunciation: "mer-ha-ba", context: "Greeting" },
      { english: "Thank you", local: "Te\u015Fekk\xFCr ederim", pronunciation: "te-shek-kur e-de-rim", context: "Greeting" },
      { english: "How much is this?", local: "Ne kadar?", pronunciation: "ne ka-dar", context: "Transit" }
    ]
  },
  {
    id: "iceland",
    slug: "iceland",
    name: "Iceland",
    country: "Iceland",
    region: "Europe",
    tagline: "Basalt waterfalls, steaming geothermal lagoons, and midnight coastal drives.",
    description: "Trace Iceland\u2019s glacial south coast past thundering cascades, quiet turf-roofed villages, and black volcanic sands with crisp Arctic clarity.",
    mediaKey: "switzerland",
    bestSeason: "June \u2013 September & November \u2013 March",
    recommendedDays: 6,
    dailyBudgetInr: { budget: 16500, balanced: 27e3, luxury: 49e3 },
    currencyCode: "ISK",
    currencySymbol: "kr",
    languageName: "Icelandic",
    localTransportSummary: "Ring Road 4x4 rentals, Flybus airport express, and guided highland super-jeep tours.",
    culturalTips: [
      "Shower thoroughly without swimwear before entering every public geothermal lagoon.",
      "Stay strictly on marked moss trails\u2014Arctic flora takes decades to recover."
    ],
    safetyNotes: [
      "Monitor Vedur.is wind and road alerts daily before coastal drives."
    ],
    weatherSummary: {
      tempRangeC: "2\xB0C \u2013 13\xB0C",
      condition: "Crisp Atlantic air with dramatic shifting light",
      humidity: "72%",
      advisory: "Waterproof outer shell and wind layers are essential year-round."
    },
    coordinates: { lat: 64.1466, lng: -21.9426 },
    tags: ["Nature", "Mountains", "Adventure", "Peaceful Places", "Lakes"],
    places: [
      {
        id: "is-kef",
        name: "Keflav\xEDk International Airport (KEF)",
        type: "Airport",
        description: "Reykjanes Peninsula gateway 45 minutes from Reykjavik.",
        bestTime: "Arrival & Departure",
        lat: 63.985,
        lng: -22.6056,
        estimatedEntryInr: 0,
        crowdLevel: "Moderate"
      },
      {
        id: "is-skoga",
        name: "Sk\xF3gafoss & Kvernufoss Gorge",
        type: "Hidden Gem",
        description: "Tucked canyon waterfall beside Sk\xF3gar far quieter than the main falls.",
        bestTime: "08:00 \u2013 10:30",
        lat: 63.5284,
        lng: -19.4803,
        estimatedEntryInr: 800,
        crowdLevel: "Quiet"
      },
      {
        id: "is-vik",
        name: "V\xEDk Basalt & Reynisfjara Coast",
        type: "Attraction",
        description: "Hexagonal black basalt columns framed by Atlantic surf.",
        bestTime: "15:00 \u2013 17:30",
        lat: 63.404,
        lng: -19.045,
        estimatedEntryInr: 0,
        crowdLevel: "Moderate"
      }
    ],
    phrases: [
      { english: "Hello", local: "Hall\xF3 / G\xF3\xF0an daginn", pronunciation: "go-than da-yin", context: "Greeting" },
      { english: "Thank you", local: "Takk fyrir", pronunciation: "tahk fee-rir", context: "Greeting" }
    ]
  },
  {
    id: "morocco",
    slug: "morocco",
    name: "Marrakech",
    country: "Morocco",
    region: "North Africa",
    tagline: "Cedar courtyard riads, High Atlas cedar trails, and mint tea rooftops.",
    description: "Step behind carved cedar doors into serene tiled courtyard riads in Marrakech, then climb into the crisp walnut valleys of Imlil beneath Mount Toubkal.",
    mediaKey: "boutique_villa",
    bestSeason: "March \u2013 May & September \u2013 November",
    recommendedDays: 5,
    dailyBudgetInr: { budget: 5500, balanced: 10500, luxury: 23e3 },
    currencyCode: "MAD",
    currencySymbol: "MAD",
    languageName: "Arabic & French",
    localTransportSummary: "ONCF Al Boraq high-speed trains, licensed petit taxis, and Atlas private drivers.",
    culturalTips: [
      "Agree on petit-taxi meter use or fare before stepping in.",
      "Ask kindly before taking close-up portraits in artisan souks."
    ],
    safetyNotes: [
      "Download offline Medina lane maps; GPS can drift inside narrow covered alleys."
    ],
    weatherSummary: {
      tempRangeC: "15\xB0C \u2013 27\xB0C",
      condition: "Warm ochre sunshine with cool Atlas mountain breezes",
      humidity: "42%",
      advisory: "Carry a light scarf for sun and breezy rooftop evenings."
    },
    coordinates: { lat: 31.6295, lng: -7.9811 },
    tags: ["Culture", "Mountains", "Cafes", "Peaceful Places", "Wellness"],
    places: [
      {
        id: "ma-rak",
        name: "Marrakech Menara Airport (RAK)",
        type: "Airport",
        description: "Just 20 minutes from the Medina walls and Palmeraie gardens.",
        bestTime: "Arrival & Departure",
        lat: 31.6069,
        lng: -8.0363,
        estimatedEntryInr: 0,
        crowdLevel: "Moderate"
      },
      {
        id: "ma-imlil",
        name: "Imlil Atlas Walnut Trails",
        type: "Hidden Gem",
        description: "Peaceful Amazigh stone villages terraced below snowy Atlas peaks.",
        bestTime: "08:30 \u2013 13:30",
        lat: 31.1356,
        lng: -7.919,
        estimatedEntryInr: 0,
        crowdLevel: "Quiet"
      },
      {
        id: "ma-majorelle",
        name: "Gueliz Botanical & Caf\xE9 Quarter",
        type: "Cafe & Food",
        description: "Cobalt-blue gardens and shaded courtyard espresso terraces.",
        bestTime: "09:00 \u2013 11:30",
        lat: 31.6415,
        lng: -8.0033,
        estimatedEntryInr: 1400,
        crowdLevel: "Moderate"
      }
    ],
    phrases: [
      { english: "Peace / Hello", local: "Salam Alaikum", pronunciation: "sa-lam a-lay-kum", context: "Greeting" },
      { english: "Thank you", local: "Shukran", pronunciation: "shook-ran", context: "Greeting" },
      { english: "Mint tea, please", local: "Atay, afak", pronunciation: "a-tai a-fak", context: "Dining" }
    ]
  },
  {
    id: "thailand",
    slug: "thailand",
    name: "Chiang Mai & Krabi",
    country: "Thailand",
    region: "Southeast Asia",
    tagline: "Misty Lanna temple hills paired with emerald Andaman limestone bays.",
    description: "Start with slow pour-over coffee in leafy Nimman and bamboo forest temples in Chiang Mai before flying south to Railay\u2019s tranquil limestone coves in Krabi.",
    mediaKey: "bali",
    bestSeason: "November \u2013 March",
    recommendedDays: 6,
    dailyBudgetInr: { budget: 4400, balanced: 8200, luxury: 18e3 },
    currencyCode: "THB",
    currencySymbol: "\u0E3F",
    languageName: "Thai",
    localTransportSummary: "Songthaew red trucks, Grab rides, regional flights (CNX \u2192 KBV), and longtail boats.",
    culturalTips: [
      "Dress with covered shoulders and knees inside golden Lanna temple halls.",
      "Speak gently and offer a polite wai greeting."
    ],
    safetyNotes: [
      "Use official pier ticket booths for Krabi island longtail transfers."
    ],
    weatherSummary: {
      tempRangeC: "22\xB0C \u2013 31\xB0C",
      condition: "Cool northern mornings and warm turquoise coastal sunshine",
      humidity: "68%",
      advisory: "Dry cool-season breeze makes November\u2013February ideal."
    },
    coordinates: { lat: 18.7883, lng: 98.9853 },
    tags: ["Beaches", "Cafes", "Culture", "Peaceful Places", "Nature"],
    places: [
      {
        id: "th-cnx",
        name: "Chiang Mai International Airport (CNX)",
        type: "Airport",
        description: "12 minutes from Old City moat and Nimman caf\xE9 alleys.",
        bestTime: "Arrival & Departure",
        lat: 18.7668,
        lng: 98.9626,
        estimatedEntryInr: 0,
        crowdLevel: "Moderate"
      },
      {
        id: "th-pha-lat",
        name: "Wat Pha Lat Jungle Monastery",
        type: "Hidden Gem",
        description: "Moss-covered stone shrines tucked beside a quiet forest waterfall.",
        bestTime: "07:30 \u2013 10:00",
        lat: 18.7997,
        lng: 98.9347,
        estimatedEntryInr: 0,
        crowdLevel: "Quiet"
      },
      {
        id: "th-railay",
        name: "Phra Nang & Tonsai Limestone Cove",
        type: "Attraction",
        description: "Towering karst cliffs and calm morning emerald lagoons in Krabi.",
        bestTime: "08:00 \u2013 11:30",
        lat: 8.0056,
        lng: 98.8396,
        estimatedEntryInr: 450,
        crowdLevel: "Moderate"
      }
    ],
    phrases: [
      { english: "Hello", local: "Sawasdee", pronunciation: "sa-wat-dee", context: "Greeting" },
      { english: "Thank you", local: "Khop khun", pronunciation: "kop-koon", context: "Greeting" },
      { english: "Not spicy, please", local: "Mai phet", pronunciation: "mai pet", context: "Dining" }
    ]
  },
  {
    id: "london",
    slug: "london",
    name: "London",
    country: "United Kingdom",
    region: "Western Europe",
    tagline: "Historic mews, royal parks, quiet Thameside paths, and world-class culture.",
    description: "Beyond the crowded avenues lies the real London: unhurried morning strolls through Hampstead Heath, quiet artisan coffee houses in Bloomsbury, secret courtyards behind St. Paul\u2019s, and sunset walks along the South Bank.",
    mediaKey: "boutique_villa",
    bestSeason: "May \u2013 October & festive December",
    recommendedDays: 5,
    dailyBudgetInr: { budget: 7500, balanced: 14500, luxury: 29e3 },
    currencyCode: "GBP",
    currencySymbol: "\xA3",
    languageName: "English",
    localTransportSummary: "London Underground (Tube), Elizabeth Line, red double-decker buses, and Thames Clipper river boats.",
    culturalTips: [
      "Stand on the right on Tube escalators to let commuters pass.",
      "Say please and thank you; queuing patiently is deeply ingrained.",
      "Tipping around 10\u201312.5% in sit-down restaurants is customary (often included as a service charge)."
    ],
    safetyNotes: [
      "Be alert to pickpockets in crowded tourist spots like Westminster and Oxford Street.",
      "Look both ways and check traffic direction before crossing (vehicles drive on the left)."
    ],
    weatherSummary: {
      tempRangeC: "11\xB0C \u2013 22\xB0C",
      condition: "Pleasantly temperate with occasional light rain and fresh breezes",
      humidity: "68%",
      advisory: "Carry a compact umbrella or lightweight layer year-round."
    },
    coordinates: { lat: 51.5074, lng: -0.1278 },
    tags: ["Culture", "Cafes", "Peaceful Places", "Nature", "Historic"],
    places: [
      {
        id: "london-lhr",
        name: "Heathrow International Airport (LHR)",
        type: "Airport",
        description: "Primary international airport with Elizabeth Line and Heathrow Express links.",
        bestTime: "Arrival & Departure",
        lat: 51.47,
        lng: -0.4543,
        estimatedEntryInr: 0,
        crowdLevel: "Moderate"
      },
      {
        id: "london-westminster",
        name: "Big Ben, Westminster Abbey & Parliament Square",
        type: "Attraction",
        description: "London\u2019s defining Gothic landmarks along the Thames, Royal coronation church, and iconic Elizabeth Tower clock face.",
        bestTime: "08:30 \u2013 11:30",
        lat: 51.4994,
        lng: -0.1273,
        estimatedEntryInr: 2400,
        crowdLevel: "Popular"
      },
      {
        id: "london-towerbridge",
        name: "Tower of London & Tower Bridge Promenade",
        type: "Attraction",
        description: "Nearly 1,000 years of royal history, Crown Jewels exhibition, and iconic Victorian suspension bridge crossing.",
        bestTime: "09:00 \u2013 12:30",
        lat: 51.5081,
        lng: -0.0759,
        estimatedEntryInr: 3200,
        crowdLevel: "Popular"
      },
      {
        id: "london-hampstead",
        name: "Hampstead Heath & Parliament Hill Viewpoint",
        type: "Attraction",
        description: "Vast ancient parkland with stunning skyline views and quiet bathing ponds.",
        bestTime: "08:00 \u2013 11:30",
        lat: 51.5608,
        lng: -0.1631,
        estimatedEntryInr: 0,
        crowdLevel: "Quiet"
      },
      {
        id: "london-bloomsbury",
        name: "Bloomsbury Literary Quarter & British Museum",
        type: "Attraction",
        description: "Georgian squares, antiquarian bookshops, and quiet garden benches.",
        bestTime: "10:00 \u2013 13:00",
        lat: 51.5194,
        lng: -0.127,
        estimatedEntryInr: 0,
        crowdLevel: "Moderate"
      },
      {
        id: "london-southbank",
        name: "South Bank Riverside Walk & Borough Market",
        type: "Cafe & Food",
        description: "Scenic Thames footpath past Shakespeare\u2019s Globe and artisanal food stalls.",
        bestTime: "12:00 \u2013 15:00",
        lat: 51.5055,
        lng: -0.091,
        estimatedEntryInr: 800,
        crowdLevel: "Moderate"
      },
      {
        id: "london-kensington",
        name: "Kensington Gardens & Notting Hill Quiet Mews",
        type: "Attraction",
        description: "Pastel mews houses, royal tree-lined paths, and independent coffee roasters.",
        bestTime: "09:00 \u2013 12:00",
        lat: 51.507,
        lng: -0.1877,
        estimatedEntryInr: 0,
        crowdLevel: "Quiet"
      },
      {
        id: "london-greenwich",
        name: "Greenwich Maritime Park & Royal Observatory",
        type: "Hidden Gem",
        description: "Prime Meridian line, sweeping Canary Wharf vistas, and quiet covered market.",
        bestTime: "14:00 \u2013 17:30",
        lat: 51.4769,
        lng: -5e-4,
        estimatedEntryInr: 1800,
        crowdLevel: "Quiet"
      },
      {
        id: "london-nealsyard",
        name: "Neal\u2019s Yard & Seven Dials Hidden Courtyard",
        type: "Cafe & Food",
        description: "Vibrant, colorful hidden alley with organic bakeries and micro-roasteries.",
        bestTime: "11:00 \u2013 14:00",
        lat: 51.514,
        lng: -0.126,
        estimatedEntryInr: 650,
        crowdLevel: "Quiet"
      }
    ],
    phrases: [
      { english: "Hello / Good morning", local: "Cheers / Good morning", pronunciation: "cheerz", context: "Greeting" },
      { english: "Thank you very much", local: "Cheers mate / Thank you", pronunciation: "cheerz mayt", context: "Greeting" },
      { english: "Where is the nearest Tube station?", local: "Excuse me, where is the nearest Underground?", pronunciation: "un-der-grownd", context: "Transit" }
    ]
  },
  {
    id: "paris",
    slug: "paris",
    name: "Paris",
    country: "France",
    region: "Western Europe",
    tagline: "Tree-lined boulevards, quiet Seine riverside bookstalls, and neighborhood bistros.",
    description: "Experience the authentic romantic rhythm of Paris: unhurried mornings in Canal Saint-Martin, hidden courtyards of Le Marais, sunset picnics in Luxembourg Gardens, and quiet art ateliers.",
    mediaKey: "boutique_villa",
    bestSeason: "April \u2013 June & September \u2013 November",
    recommendedDays: 5,
    dailyBudgetInr: { budget: 7200, balanced: 13800, luxury: 27500 },
    currencyCode: "EUR",
    currencySymbol: "\u20AC",
    languageName: "French",
    localTransportSummary: "Paris M\xE9tro, RER trains, V\xE9lib bike share, and scenic walking boulevards.",
    culturalTips: [
      'Always say "Bonjour Madame/Monsieur" when entering any shop or caf\xE9.',
      "Keep your voice at a moderate, respectful level in public transit and dining rooms.",
      "Round up the bill or leave 5\u201310% for attentive dining service."
    ],
    safetyNotes: [
      "Watch your pockets around Gare du Nord and the Eiffel Tower lawns.",
      "Validate your M\xE9tro ticket and keep it until you exit the station."
    ],
    weatherSummary: {
      tempRangeC: "12\xB0C \u2013 24\xB0C",
      condition: "Mild and pleasant with golden afternoon light",
      humidity: "65%",
      advisory: "Comfortable walking shoes are essential for Parisian cobblestones."
    },
    coordinates: { lat: 48.8566, lng: 2.3522 },
    tags: ["Culture", "Cafes", "Peaceful Places", "Historic"],
    places: [
      {
        id: "paris-cdg",
        name: "Charles de Gaulle Airport (CDG)",
        type: "Airport",
        description: "Main international airport with RER B train into central Paris.",
        bestTime: "Arrival & Departure",
        lat: 49.0097,
        lng: 2.5479,
        estimatedEntryInr: 0,
        crowdLevel: "Moderate"
      },
      {
        id: "paris-eiffel",
        name: "Eiffel Tower & Champ de Mars Promenade",
        type: "Attraction",
        description: "The monumental iron icon of Paris with breathtaking panoramic vistas over the Seine and sunset light-ups.",
        bestTime: "09:00 \u2013 12:00",
        lat: 48.8584,
        lng: 2.2945,
        estimatedEntryInr: 2800,
        crowdLevel: "Popular"
      },
      {
        id: "paris-louvre",
        name: "Mus\xE9e du Louvre & Tuileries Gardens",
        type: "Attraction",
        description: "World\u2019s greatest art museum home to the Mona Lisa and Venus de Milo, framed by the glass pyramid and royal sculpture gardens.",
        bestTime: "09:00 \u2013 13:00",
        lat: 48.8606,
        lng: 2.3376,
        estimatedEntryInr: 2200,
        crowdLevel: "Popular"
      },
      {
        id: "paris-montmartre",
        name: "Sacr\xE9-C\u0153ur Basilica & Montmartre Artists\u2019 Square",
        type: "Attraction",
        description: "Hilltop white dome cathedral overlooking the entire Paris basin, surrounded by Bohemian painting squares and historic windmills.",
        bestTime: "08:30 \u2013 11:30",
        lat: 48.8867,
        lng: 2.3431,
        estimatedEntryInr: 0,
        crowdLevel: "Popular"
      },
      {
        id: "paris-notredame",
        name: "Notre-Dame Cathedral & \xCEle de la Cit\xE9",
        type: "Attraction",
        description: "Gothic jewel on the Seine river island, surrounded by riverside bouquiniste bookstalls and medieval stone bridges.",
        bestTime: "10:00 \u2013 13:00",
        lat: 48.853,
        lng: 2.3499,
        estimatedEntryInr: 0,
        crowdLevel: "Popular"
      },
      {
        id: "paris-marais",
        name: "Place des Vosges & Le Marais Historic Mansions",
        type: "Attraction",
        description: "Oldest planned square in Paris with arched arcades and quiet art galleries.",
        bestTime: "09:30 \u2013 12:30",
        lat: 48.8555,
        lng: 2.3655,
        estimatedEntryInr: 0,
        crowdLevel: "Quiet"
      },
      {
        id: "paris-canal",
        name: "Canal Saint-Martin Shaded Footbridges",
        type: "Hidden Gem",
        description: "Locals gathering along tree-shaded locks, specialty bakeries, and calm wine bars.",
        bestTime: "15:00 \u2013 18:30",
        lat: 48.8715,
        lng: 2.366,
        estimatedEntryInr: 0,
        crowdLevel: "Quiet"
      },
      {
        id: "paris-luxembourg",
        name: "Jardin du Luxembourg & Medici Fountain",
        type: "Attraction",
        description: "Green metal chairs, chestnut tree groves, and quiet reflection pools.",
        bestTime: "08:30 \u2013 11:00",
        lat: 48.8462,
        lng: 2.3372,
        estimatedEntryInr: 0,
        crowdLevel: "Moderate"
      }
    ],
    phrases: [
      { english: "Hello / Good day", local: "Bonjour", pronunciation: "bohn-zhoor", context: "Greeting" },
      { english: "Thank you very much", local: "Merci beaucoup", pronunciation: "mair-see boh-koo", context: "Greeting" },
      { english: "A coffee, please", local: "Un caf\xE9, s\u2019il vous pla\xEEt", pronunciation: "uhn kah-fay seel voo play", context: "Dining" }
    ]
  },
  {
    id: "tokyo",
    slug: "tokyo",
    name: "Tokyo",
    country: "Japan",
    region: "East Asia",
    tagline: "Quiet alleyway izakayas, serene moss gardens, and seamless urban harmony.",
    description: "Discover Tokyo\u2019s tranquil side: early mornings in Yanaka\u2019s historic craft district, peaceful temple courtyards in Asakusa, scenic walks in Shinjuku Gyoen, and meticulous neighborhood ramen counters.",
    mediaKey: "japan",
    bestSeason: "March \u2013 May (Cherry Blossom) & October \u2013 November (Autumn Foliage)",
    recommendedDays: 6,
    dailyBudgetInr: { budget: 6200, balanced: 11500, luxury: 24e3 },
    currencyCode: "JPY",
    currencySymbol: "\xA5",
    languageName: "Japanese",
    localTransportSummary: "Tokyo Metro, JR Yamanote Line, Suica/Pasmo IC cards, and high-speed Shinkansen.",
    culturalTips: [
      "Bow gently when greeting or thanking hosts.",
      "Do not eat or drink while walking on busy streets; consume at the stall or bench.",
      "Tipping is not customary in Japan and can cause polite embarrassment."
    ],
    safetyNotes: [
      "Tokyo is exceptionally safe at all hours.",
      "Keep your IC card tapped or phone loaded for seamless gate passage."
    ],
    weatherSummary: {
      tempRangeC: "14\xB0C \u2013 23\xB0C",
      condition: "Crisp clear skies with gentle seasonal breezes",
      humidity: "62%",
      advisory: "Ideal walking weather across autumn and spring."
    },
    coordinates: { lat: 35.6762, lng: 139.6503 },
    tags: ["Culture", "Cafes", "Peaceful Places", "Historic"],
    places: [
      {
        id: "tokyo-hnd",
        name: "Haneda International Airport (HND)",
        type: "Airport",
        description: "Direct Monorail and Keikyu Line links into central Tokyo stations.",
        bestTime: "Arrival & Departure",
        lat: 35.5494,
        lng: 139.7798,
        estimatedEntryInr: 0,
        crowdLevel: "Moderate"
      },
      {
        id: "tokyo-sensoji",
        name: "Senso-ji Temple & Asakusa Heritage Quarter",
        type: "Attraction",
        description: "Tokyo\u2019s oldest, most iconic Buddhist temple with the giant red Kaminarimon lantern and traditional artisan crafts.",
        bestTime: "07:30 \u2013 10:30",
        lat: 35.7148,
        lng: 139.7967,
        estimatedEntryInr: 0,
        crowdLevel: "Popular"
      },
      {
        id: "tokyo-shibuya",
        name: "Shibuya Crossing, Hachiko & Shibuya Sky",
        type: "Attraction",
        description: "World-famous pedestrian scramble crossing and open-air rooftop observation deck with panoramic views of Tokyo and Mt. Fuji.",
        bestTime: "10:00 \u2013 14:00",
        lat: 35.6595,
        lng: 139.7005,
        estimatedEntryInr: 1200,
        crowdLevel: "Popular"
      },
      {
        id: "tokyo-meiji",
        name: "Meiji Jingu Sacred Forest Shrine & Harajuku",
        type: "Attraction",
        description: "Tranquil 170-acre evergreen forest shrine honoring Emperor Meiji, right beside the tree-lined avenues of Omotesando.",
        bestTime: "08:00 \u2013 11:00",
        lat: 35.6764,
        lng: 139.6993,
        estimatedEntryInr: 0,
        crowdLevel: "Moderate"
      },
      {
        id: "tokyo-shinjuku-gyoen",
        name: "Shinjuku Gyoen National Garden & Greenhouses",
        type: "Attraction",
        description: "Imperial landscape park blending traditional Japanese, English, and French gardens with prime spring cherry blossoms and autumn maples.",
        bestTime: "09:30 \u2013 12:30",
        lat: 35.6852,
        lng: 139.7101,
        estimatedEntryInr: 320,
        crowdLevel: "Moderate"
      },
      {
        id: "tokyo-tsukiji",
        name: "Tsukiji Outer Market & Ginza Artisanal Quarter",
        type: "Cafe & Food",
        description: "Bustling seafood stalls offering fresh sushi, tamagoyaki, wagyu skewers, and nearby luxury Ginza shopping boulevards.",
        bestTime: "08:30 \u2013 12:00",
        lat: 35.6655,
        lng: 139.7708,
        estimatedEntryInr: 1400,
        crowdLevel: "Popular"
      },
      {
        id: "tokyo-skytree",
        name: "Tokyo Skytree & Sumida River Promenade",
        type: "Attraction",
        description: "Towering 634-meter transmission tower offering 360-degree metropolitan vistas and scenic riverside walks.",
        bestTime: "15:30 \u2013 19:00",
        lat: 35.71,
        lng: 139.8107,
        estimatedEntryInr: 1800,
        crowdLevel: "Popular"
      },
      {
        id: "tokyo-yanaka",
        name: "Yanaka Old Town Heritage District",
        type: "Hidden Gem",
        description: "Edo-period wooden houses, quiet artisan sweet shops, traditional craft studios, and tranquil temple cemeteries.",
        bestTime: "09:00 \u2013 12:00",
        lat: 35.7275,
        lng: 139.769,
        estimatedEntryInr: 0,
        crowdLevel: "Quiet"
      }
    ],
    phrases: [
      { english: "Hello", local: "Konnichiwa", pronunciation: "kohn-nee-chee-wah", context: "Greeting" },
      { english: "Thank you very much", local: "Arigatou gozaimasu", pronunciation: "ah-ree-gah-toh goh-zah-ee-mahs", context: "Greeting" },
      { english: "Excuse me", local: "Sumimasen", pronunciation: "soo-mee-mah-sen", context: "Transit" }
    ]
  },
  {
    id: "newyork",
    slug: "newyork",
    name: "New York City",
    country: "United States",
    region: "North America",
    tagline: "Quiet brownstone lanes, skyline waterfront paths, and iconic cultural energy.",
    description: "Experience New York beyond the rush: morning strolls through the West Village, quiet reading lawns in Central Park Conservatory, walking the elevated High Line at sunrise, and neighborhood bakeries in Brooklyn.",
    mediaKey: "boutique_villa",
    bestSeason: "May \u2013 June & September \u2013 November (Crisp Autumn)",
    recommendedDays: 5,
    dailyBudgetInr: { budget: 8500, balanced: 16500, luxury: 34e3 },
    currencyCode: "USD",
    currencySymbol: "$",
    languageName: "English",
    localTransportSummary: "NYC Subway (OMNY contactless tap-and-go), NYC Ferry, and Citi Bike share.",
    culturalTips: [
      "Walk briskly and step aside to check maps or phones on busy sidewalks.",
      "Standard tip for restaurant service is 18\u201320%."
    ],
    safetyNotes: [
      "Keep bags zipped on crowded subway trains.",
      "Use official yellow cabs or rideshare apps from airport taxi dispatch lines."
    ],
    weatherSummary: {
      tempRangeC: "15\xB0C \u2013 26\xB0C",
      condition: "Bright clear skies and energetic coastal light",
      humidity: "58%",
      advisory: "Sensible walking sneakers are indispensable."
    },
    coordinates: { lat: 40.7128, lng: -74.006 },
    tags: ["Culture", "Cafes", "Historic"],
    places: [
      {
        id: "nyc-jfk",
        name: "John F. Kennedy International Airport (JFK)",
        type: "Airport",
        description: "JFK AirTrain connects directly to Long Island Rail Road and Subway A/E trains.",
        bestTime: "Arrival & Departure",
        lat: 40.6413,
        lng: -73.7781,
        estimatedEntryInr: 0,
        crowdLevel: "Moderate"
      },
      {
        id: "nyc-centralpark",
        name: "Central Park Bow Bridge, Bethesda Terrace & The Ramble",
        type: "Attraction",
        description: "843 acres of peaceful lakes, historic stone bridges, Victorian carriage paths, and lush maple groves in the heart of Manhattan.",
        bestTime: "08:00 \u2013 11:30",
        lat: 40.7829,
        lng: -73.9654,
        estimatedEntryInr: 0,
        crowdLevel: "Moderate"
      },
      {
        id: "nyc-timessquare",
        name: "Times Square & Broadway Theater District",
        type: "Attraction",
        description: "The electrifying crossroads of the world with towering digital marquees, street performers, and world-renowned Broadway shows.",
        bestTime: "17:00 \u2013 22:00",
        lat: 40.758,
        lng: -73.9855,
        estimatedEntryInr: 0,
        crowdLevel: "Popular"
      },
      {
        id: "nyc-brooklynbridge",
        name: "Brooklyn Bridge Pedestrian Boardwalk & DUMBO",
        type: "Attraction",
        description: "Walk above the East River along the historic 1883 suspension bridge with soaring Gothic arches and iconic lower Manhattan skyline vistas.",
        bestTime: "07:30 \u2013 10:30",
        lat: 40.7061,
        lng: -73.9969,
        estimatedEntryInr: 0,
        crowdLevel: "Popular"
      },
      {
        id: "nyc-statue",
        name: "Statue of Liberty & Ellis Island National Monument",
        type: "Attraction",
        description: "The copper monument of freedom in New York Harbor, reached via scenic ferry with views of the Financial District skyline.",
        bestTime: "09:00 \u2013 13:00",
        lat: 40.6892,
        lng: -74.0445,
        estimatedEntryInr: 2100,
        crowdLevel: "Popular"
      },
      {
        id: "nyc-met",
        name: "The Metropolitan Museum of Art (The Met) & Rooftop",
        type: "Attraction",
        description: "Over 5,000 years of global art, Egyptian Temple of Dendur, European masterpieces, and panoramic Central Park rooftop garden.",
        bestTime: "10:00 \u2013 14:00",
        lat: 40.7794,
        lng: -73.9632,
        estimatedEntryInr: 2500,
        crowdLevel: "Popular"
      },
      {
        id: "nyc-highline",
        name: "The High Line & Chelsea Waterside Park",
        type: "Attraction",
        description: "Elevated railway park with lush wildflowers, Hudson River views, and modern sculpture.",
        bestTime: "07:30 \u2013 10:00",
        lat: 40.748,
        lng: -74.0048,
        estimatedEntryInr: 0,
        crowdLevel: "Moderate"
      },
      {
        id: "nyc-westvillage",
        name: "West Village Brownstones & Quiet Courtyards",
        type: "Hidden Gem",
        description: "Winding historic cobblestone streets, leafy townhouse gardens, and specialty coffee shops.",
        bestTime: "10:00 \u2013 13:00",
        lat: 40.7358,
        lng: -74.0036,
        estimatedEntryInr: 0,
        crowdLevel: "Quiet"
      }
    ],
    phrases: [
      { english: "Hello", local: "Hi / How\u2019s it going?", pronunciation: "hahy", context: "Greeting" },
      { english: "Thank you", local: "Thanks a lot", pronunciation: "thangks", context: "Greeting" }
    ]
  }
];
var HOTELS = [
  {
    id: "ht-alaska-chena",
    name: "Chena Hot Springs Aurora Resort & Yurts",
    destinationId: "alaska",
    area: "Chena Hot Springs, Fairbanks North Star Borough",
    rating: 4.9,
    reviewCount: 420,
    pricePerNightInr: 18500,
    tier: "boutique",
    roomTypes: ["Thermal Springs Lodge Room", "Aurora Moose Cabin"],
    distanceToCenterKm: 1,
    amenities: ["Natural 40\xB0C mineral hot springs", "Aurora Ice Museum entry", "Nightly aurora wake-up calls", "Geothermal greenhouse dining"],
    cancellationPolicy: "Free cancellation up to 72 hours prior",
    provider: "Unseen Stays Catalog",
    availabilityStatus: "Simulated Demo Inventory",
    provenance: "demo_adapter",
    lat: 65.0531,
    lng: -146.0567,
    mediaKey: "boutique_villa",
    recommendationReason: "Direct thermal soaking in natural outdoor hot springs surrounded by snow under dancing Northern Lights.",
    matchScore: 98
  },
  {
    id: "ht-alaska-borealis",
    name: "Borealis Basecamp Geodesic Domes",
    destinationId: "alaska",
    area: "Wickersham Dome, Fairbanks",
    rating: 4.9,
    reviewCount: 310,
    pricePerNightInr: 28e3,
    tier: "luxury",
    roomTypes: ["Clear-Roof Aurora Dome", "Boreal Forest Cube"],
    distanceToCenterKm: 18,
    amenities: ["16-foot curved transparent ceiling", "Heated polar beds", "Private dog mushing trails", "Chef-prepared Alaskan tasting menu"],
    cancellationPolicy: "Free cancellation up to 7 days prior",
    provider: "Unseen Stays Catalog",
    availabilityStatus: "Simulated Demo Inventory",
    provenance: "demo_adapter",
    lat: 65.1782,
    lng: -147.8542,
    mediaKey: "hero_alpine",
    recommendationReason: "Sleep under panoramic glass ceilings watching emerald aurora ribbons from bed without stepping out into sub-zero weather.",
    matchScore: 99
  },
  {
    id: "ht-alaska-alyeska",
    name: "Alyeska Nordic Spa & Glacial Retreat",
    destinationId: "alaska",
    area: "Girdwood, Chugach Valley",
    rating: 4.8,
    reviewCount: 512,
    pricePerNightInr: 22500,
    tier: "luxury",
    roomTypes: ["Mountain View Deluxe Room", "Glacier Valley Suite"],
    distanceToCenterKm: 2.5,
    amenities: ["Outdoor Nordic hydrotherapy circuit", "Mountain aerial tramway", "Seven Glaciers fine dining", "Forest hot tubs"],
    cancellationPolicy: "Free cancellation up to 48 hours prior",
    provider: "Unseen Stays Catalog",
    availabilityStatus: "Simulated Demo Inventory",
    provenance: "demo_adapter",
    lat: 60.9705,
    lng: -149.0982,
    mediaKey: "boutique_villa",
    recommendationReason: "Alpine hydrotherapy pools and aerial tram surrounded by seven hanging glaciers and snow-capped peaks.",
    matchScore: 95
  },
  {
    id: "ht-alaska-denali",
    name: "Denali Backcountry Wilderness Lodge",
    destinationId: "alaska",
    area: "Kantishna, Deep Denali Wilderness",
    rating: 4.7,
    reviewCount: 185,
    pricePerNightInr: 12500,
    tier: "budget",
    roomTypes: ["Riverside Cedar Cabin", "Tundra Queen Room"],
    distanceToCenterKm: 4,
    amenities: ["Complimentary naturalist guided hikes", "Moose Pond canoeing", "Hearty sourdough breakfasts", "Wood-burning stoves"],
    cancellationPolicy: "Free cancellation up to 5 days prior",
    provider: "Unseen Stays Catalog",
    availabilityStatus: "Simulated Demo Inventory",
    provenance: "demo_adapter",
    lat: 63.5281,
    lng: -150.9632,
    mediaKey: "hero_alpine",
    recommendationReason: "Peaceful off-grid cedar cabins deep within Denali with zero light pollution for pristine night skies.",
    matchScore: 94
  },
  {
    id: "ht-london-bloomsbury",
    name: "The Bloomsbury Townhouse",
    destinationId: "london",
    area: "Bloomsbury, Central London",
    rating: 4.8,
    reviewCount: 312,
    pricePerNightInr: 14500,
    tier: "boutique",
    roomTypes: ["Georgian Deluxe Room", "Garden Mews Suite"],
    distanceToCenterKm: 1.2,
    amenities: ["Artisan breakfast lounge", "Library fireplace", "Complimentary afternoon tea", "Oyster transit card service"],
    cancellationPolicy: "Free cancellation up to 48 hours prior",
    provider: "Unseen Stays Catalog",
    availabilityStatus: "Simulated Demo Inventory",
    provenance: "demo_adapter",
    lat: 51.5182,
    lng: -0.1284,
    mediaKey: "boutique_villa",
    recommendationReason: "Quiet Georgian residential street 5 minutes walk from the British Museum and Russell Square Tube.",
    matchScore: 96
  },
  {
    id: "ht-london-kensington",
    name: "Kensington Mews Residence",
    destinationId: "london",
    area: "South Kensington, London",
    rating: 4.7,
    reviewCount: 228,
    pricePerNightInr: 16800,
    tier: "boutique",
    roomTypes: ["Courtyard King Room", "Mews Balcony Studio"],
    distanceToCenterKm: 3.1,
    amenities: ["Victorian garden patio", "Complimentary bicycle hire", "Curated neighborhood walking maps", "Espresso bar"],
    cancellationPolicy: "Free cancellation up to 72 hours prior",
    provider: "Unseen Stays Catalog",
    availabilityStatus: "Simulated Demo Inventory",
    provenance: "demo_adapter",
    lat: 51.4984,
    lng: -0.1742,
    mediaKey: "boutique_villa",
    recommendationReason: "Peaceful cobbled mews tucked away from tourist crowds, minutes from Hyde Park.",
    matchScore: 93
  },
  {
    id: "ht-london-paddington",
    name: "The Canal Basin Lodge",
    destinationId: "london",
    area: "Paddington & Little Venice",
    rating: 4.4,
    reviewCount: 415,
    pricePerNightInr: 7900,
    tier: "budget",
    roomTypes: ["Standard Double", "Canal View Pod"],
    distanceToCenterKm: 2.8,
    amenities: ["Direct Elizabeth Line access to Heathrow", "24h self check-in", "Shared work kitchen", "Luggage storage"],
    cancellationPolicy: "Free cancellation up to 24 hours prior",
    provider: "Unseen Stays Catalog",
    availabilityStatus: "Simulated Demo Inventory",
    provenance: "demo_adapter",
    lat: 51.519,
    lng: -0.176,
    mediaKey: "boutique_villa",
    recommendationReason: "Exceptional budget-conscious base with direct 15-minute Heathrow Express & Elizabeth Line connection.",
    matchScore: 89
  },
  {
    id: "ht-london-covent",
    name: "Covent Garden Quiet Sanctuary",
    destinationId: "london",
    area: "Seven Dials, Central London",
    rating: 4.9,
    reviewCount: 184,
    pricePerNightInr: 27500,
    tier: "luxury",
    roomTypes: ["Heritage Suite", "Rooftop Terrace Penthouse"],
    distanceToCenterKm: 0.5,
    amenities: ["Private sommelier", "Soundproof historic sash windows", "Chauffeur booking desk", "Spa & soaking tub"],
    cancellationPolicy: "Free cancellation up to 7 days prior",
    provider: "Unseen Stays Catalog",
    availabilityStatus: "Simulated Demo Inventory",
    provenance: "demo_adapter",
    lat: 51.5135,
    lng: -0.1272,
    mediaKey: "boutique_villa",
    recommendationReason: "Ultra-luxurious historic haven hidden inside quiet Seven Dials with private rooftop courtyard.",
    matchScore: 98
  },
  {
    id: "ht-paris-marais",
    name: "Maison Saint-Gilles Marais",
    destinationId: "paris",
    area: "Le Marais, Paris",
    rating: 4.8,
    reviewCount: 265,
    pricePerNightInr: 15200,
    tier: "boutique",
    roomTypes: ["Courtyard Atelier Room", "Haussmann Balcony Suite"],
    distanceToCenterKm: 1.5,
    amenities: ["Fresh morning croissants & bakery basket", "Private stone courtyard", "Espresso machine", "Artisan toiletries"],
    cancellationPolicy: "Free cancellation up to 48 hours prior",
    provider: "Unseen Stays Catalog",
    availabilityStatus: "Simulated Demo Inventory",
    provenance: "demo_adapter",
    lat: 48.857,
    lng: 2.366,
    mediaKey: "boutique_villa",
    recommendationReason: "Historic 17th-century courtyard stay steps away from Place des Vosges and quiet bakeries.",
    matchScore: 97
  },
  {
    id: "ht-paris-latin",
    name: "H\xF4tel Jardin des Plantes",
    destinationId: "paris",
    area: "5th Arrondissement, Latin Quarter",
    rating: 4.5,
    reviewCount: 380,
    pricePerNightInr: 8800,
    tier: "budget",
    roomTypes: ["Classic Double", "Rooftop Mansard Room"],
    distanceToCenterKm: 2.1,
    amenities: ["Terrace overlooking botanical gardens", "Bicycle storage", "Caf\xE9 bar", "Luggage locker"],
    cancellationPolicy: "Free cancellation up to 48 hours prior",
    provider: "Unseen Stays Catalog",
    availabilityStatus: "Simulated Demo Inventory",
    provenance: "demo_adapter",
    lat: 48.8432,
    lng: 2.3565,
    mediaKey: "boutique_villa",
    recommendationReason: "Charming leafy retreat near botanical gardens with swift M\xE9tro links.",
    matchScore: 91
  },
  {
    id: "ht-tokyo-yanaka",
    name: "Yanaka Machiya Heritage Inn",
    destinationId: "tokyo",
    area: "Yanaka Old Town, Tokyo",
    rating: 4.9,
    reviewCount: 198,
    pricePerNightInr: 12800,
    tier: "boutique",
    roomTypes: ["Tatami Garden Suite", "Cypress Wood Room"],
    distanceToCenterKm: 3.8,
    amenities: ["Hinoki cypress soaking bath", "Traditional morning matcha & breakfast", "Quiet garden view", "Kimono loan"],
    cancellationPolicy: "Free cancellation up to 72 hours prior",
    provider: "Unseen Stays Catalog",
    availabilityStatus: "Simulated Demo Inventory",
    provenance: "demo_adapter",
    lat: 35.727,
    lng: 139.7685,
    mediaKey: "japan",
    recommendationReason: "Authentic restored wooden machiya surrounded by quiet temple pathways and artisan shops.",
    matchScore: 98
  },
  {
    id: "ht-nyc-westvillage",
    name: "The Greenwich Mews Townhouse",
    destinationId: "newyork",
    area: "West Village, Manhattan",
    rating: 4.8,
    reviewCount: 240,
    pricePerNightInr: 18500,
    tier: "boutique",
    roomTypes: ["Brownstone King Room", "Garden Terrace Studio"],
    distanceToCenterKm: 2.2,
    amenities: ["Private courtyard garden", "Artisan espresso lounge", "Evening wine hour", "OMNY subway pass service"],
    cancellationPolicy: "Free cancellation up to 72 hours prior",
    provider: "Unseen Stays Catalog",
    availabilityStatus: "Simulated Demo Inventory",
    provenance: "demo_adapter",
    lat: 40.735,
    lng: -74.004,
    mediaKey: "boutique_villa",
    recommendationReason: "Tucked into the quietest brownstone lane in Manhattan, steps away from legendary jazz and bookstores.",
    matchScore: 96
  },
  {
    id: "ht-bali-ubud-sanctuary",
    name: "Kajane Quiet Ridge Sanctuary",
    destinationId: "bali",
    area: "Ubud & Sidemen Edge",
    rating: 4.8,
    reviewCount: 412,
    pricePerNightInr: 6800,
    tier: "boutique",
    roomTypes: ["Garden Courtyard Suite", "Rice Terrace Veranda"],
    distanceToCenterKm: 1.4,
    amenities: ["Breakfast included", "Quiet garden pool", "Artisan cafe", "Airport transfer"],
    cancellationPolicy: "Free cancellation up to 72 hours before check-in",
    provider: "Unseen Stays Catalog",
    availabilityStatus: "Simulated Demo Inventory",
    provenance: "demo_adapter",
    lat: -8.504,
    lng: 115.261,
    mediaKey: "boutique_villa"
  },
  {
    id: "ht-bali-sanur-cove",
    name: "Pantai Calm Boutique Residence",
    destinationId: "bali",
    area: "Sanur Beachfront",
    rating: 4.6,
    reviewCount: 289,
    pricePerNightInr: 4900,
    tier: "budget",
    roomTypes: ["Coastal Balcony Room", "Breeze Patio Twin"],
    distanceToCenterKm: 0.6,
    amenities: ["Beachfront boardwalk", "Bicycle loan", "Cafe terrace", "Wi-Fi"],
    cancellationPolicy: "Free cancellation up to 48 hours before check-in",
    provider: "Unseen Stays Catalog",
    availabilityStatus: "Simulated Demo Inventory",
    provenance: "demo_adapter",
    lat: -8.694,
    lng: 115.262,
    mediaKey: "bali"
  },
  {
    id: "ht-bali-uluwatu-cliff",
    name: "Alila Limestone Horizon Suites",
    destinationId: "bali",
    area: "Uluwatu Cliffside",
    rating: 4.9,
    reviewCount: 530,
    pricePerNightInr: 14500,
    tier: "luxury",
    roomTypes: ["Ocean Cliff Pool Villa", "Horizon Loft"],
    distanceToCenterKm: 2.1,
    amenities: ["Infinity sea pool", "Private yoga deck", "Sunset lounge", "Chauffeur"],
    cancellationPolicy: "Refundable deposit up to 7 days prior",
    provider: "Unseen Stays Catalog",
    availabilityStatus: "Simulated Demo Inventory",
    provenance: "demo_adapter",
    lat: -8.821,
    lng: 115.106,
    mediaKey: "boutique_villa"
  },
  {
    id: "ht-nepal-pokhara-lake",
    name: "Phewa Horizon Lodge",
    destinationId: "nepal",
    area: "Lakeside North, Pokhara",
    rating: 4.8,
    reviewCount: 345,
    pricePerNightInr: 5200,
    tier: "boutique",
    roomTypes: ["Annapurna Balcony Suite", "Lakeside Timber Room"],
    distanceToCenterKm: 0.9,
    amenities: ["Mountain view deck", "Organic breakfast", "Boat pier access", "Heated rooms"],
    cancellationPolicy: "Free cancellation up to 48 hours before arrival",
    provider: "Unseen Stays Catalog",
    availabilityStatus: "Simulated Demo Inventory",
    provenance: "demo_adapter",
    lat: 28.213,
    lng: 83.956,
    mediaKey: "nepal"
  },
  {
    id: "ht-nepal-pavilion",
    name: "Himalayan Timber Pavilion",
    destinationId: "nepal",
    area: "Sarangkot Foothills",
    rating: 4.9,
    reviewCount: 198,
    pricePerNightInr: 11800,
    tier: "luxury",
    roomTypes: ["Panoramic Ridge Villa", "Stone Fireplace Suite"],
    distanceToCenterKm: 3.8,
    amenities: ["Infinity reflection pool", "Guided sunrise walk", "Hearth lounge", "Spa"],
    cancellationPolicy: "Free cancellation up to 5 days prior",
    provider: "Unseen Stays Catalog",
    availabilityStatus: "Simulated Demo Inventory",
    provenance: "demo_adapter",
    lat: 28.241,
    lng: 83.949,
    mediaKey: "boutique_villa"
  },
  {
    id: "ht-swiss-zermatt",
    name: "Matterhorn Timber Chalet",
    destinationId: "switzerland",
    area: "Zermatt Quiet Quarter",
    rating: 4.9,
    reviewCount: 410,
    pricePerNightInr: 19500,
    tier: "boutique",
    roomTypes: ["Alpine Balcony Studio", "Glacier View Loft"],
    distanceToCenterKm: 0.7,
    amenities: ["Station shuttle", "Alpine breakfast", "Cedar sauna", "Gear storage"],
    cancellationPolicy: "Free cancellation up to 7 days prior",
    provider: "Unseen Stays Catalog",
    availabilityStatus: "Simulated Demo Inventory",
    provenance: "demo_adapter",
    lat: 46.019,
    lng: 7.747,
    mediaKey: "switzerland"
  },
  {
    id: "ht-japan-kyoto",
    name: "Kamo Cedar Ryokan & Tea House",
    destinationId: "japan",
    area: "Higashiyama North, Kyoto",
    rating: 4.8,
    reviewCount: 376,
    pricePerNightInr: 12400,
    tier: "boutique",
    roomTypes: ["Tatami Garden Room", "Cypress Bath Suite"],
    distanceToCenterKm: 1.2,
    amenities: ["Cedar soaking tub", "Matcha welcome", "Quiet courtyard", "Luggage forwarding"],
    cancellationPolicy: "Free cancellation up to 72 hours prior",
    provider: "Unseen Stays Catalog",
    availabilityStatus: "Simulated Demo Inventory",
    provenance: "demo_adapter",
    lat: 35.021,
    lng: 135.785,
    mediaKey: "japan"
  },
  {
    id: "ht-italy-ravello",
    name: "Limonaia Terrace Villa",
    destinationId: "italy",
    area: "Ravello Overlook",
    rating: 4.9,
    reviewCount: 264,
    pricePerNightInr: 15800,
    tier: "boutique",
    roomTypes: ["Sea Terrace Double", "Lemon Grove Suite"],
    distanceToCenterKm: 0.5,
    amenities: ["Cliffside breakfast", "Ferry transfer help", "Concierge", "Terrace"],
    cancellationPolicy: "Free cancellation up to 5 days prior",
    provider: "Unseen Stays Catalog",
    availabilityStatus: "Simulated Demo Inventory",
    provenance: "demo_adapter",
    lat: 40.649,
    lng: 14.611,
    mediaKey: "italy"
  },
  {
    id: "ht-ladakh-nimmu",
    name: "Nimmu Heritage Orchard House",
    destinationId: "ladakh",
    area: "Indus Quiet Valley, Ladakh",
    rating: 4.9,
    reviewCount: 184,
    pricePerNightInr: 7200,
    tier: "boutique",
    roomTypes: ["Apricot Orchard Suite", "Mud-Brick Mountain Room"],
    distanceToCenterKm: 2.4,
    amenities: ["Solar heated floors", "Organic farm meals", "Stargazing deck", "Oxygen support"],
    cancellationPolicy: "Free cancellation up to 5 days prior",
    provider: "Unseen Stays Catalog",
    availabilityStatus: "Simulated Demo Inventory",
    provenance: "demo_adapter",
    lat: 34.185,
    lng: 77.339,
    mediaKey: "nepal"
  },
  {
    id: "ht-kerala-munnar",
    name: "Kannan Devan Mist Tea Bungalow",
    destinationId: "kerala",
    area: "Chinnakanal Quiet Ridge, Munnar",
    rating: 4.8,
    reviewCount: 241,
    pricePerNightInr: 6400,
    tier: "boutique",
    roomTypes: ["Tea Plantation Veranda", "Cardamom Estate Loft"],
    distanceToCenterKm: 2.2,
    amenities: ["Estate breakfast", "Guided spice walk", "Veranda tea service", "Wi-Fi"],
    cancellationPolicy: "Free cancellation up to 72 hours prior",
    provider: "Unseen Stays Catalog",
    availabilityStatus: "Simulated Demo Inventory",
    provenance: "demo_adapter",
    lat: 10.032,
    lng: 77.185,
    mediaKey: "bali"
  },
  {
    id: "ht-greece-pyrgos",
    name: "Kasteli Calm Caldera Suites",
    destinationId: "greece",
    area: "Pyrgos Quiet Village, Santorini",
    rating: 4.9,
    reviewCount: 312,
    pricePerNightInr: 17400,
    tier: "boutique",
    roomTypes: ["Whitewashed Cave Terrace", "Aegean Sunrise Suite"],
    distanceToCenterKm: 1.1,
    amenities: ["Private plunge terrace", "Greek breakfast", "Port shuttle", "Vineyard access"],
    cancellationPolicy: "Free cancellation up to 7 days prior",
    provider: "Unseen Stays Catalog",
    availabilityStatus: "Simulated Demo Inventory",
    provenance: "demo_adapter",
    lat: 36.384,
    lng: 25.449,
    mediaKey: "italy"
  },
  {
    id: "ht-turkey-uchisar",
    name: "Ta\u015Fkonak Quiet Stone Cave Lodge",
    destinationId: "turkey",
    area: "U\xE7hisar Valley Rim, Cappadocia",
    rating: 4.8,
    reviewCount: 278,
    pricePerNightInr: 9800,
    tier: "boutique",
    roomTypes: ["Carved Tuff Cave Room", "Balloon View Terrace"],
    distanceToCenterKm: 0.9,
    amenities: ["Sunrise terrace", "Anatolian breakfast", "Airport transfer", "Hearth"],
    cancellationPolicy: "Free cancellation up to 72 hours prior",
    provider: "Unseen Stays Catalog",
    availabilityStatus: "Simulated Demo Inventory",
    provenance: "demo_adapter",
    lat: 38.631,
    lng: 34.806,
    mediaKey: "hero_alpine"
  },
  {
    id: "ht-iceland-vik",
    name: "Kr\xEDa Quiet Basalt Highland Cabins",
    destinationId: "iceland",
    area: "V\xEDk Coastal Meadow, Iceland",
    rating: 4.8,
    reviewCount: 229,
    pricePerNightInr: 19800,
    tier: "boutique",
    roomTypes: ["Northern Lights Glass Cabin", "Nordic Timber Studio"],
    distanceToCenterKm: 1.5,
    amenities: ["Geothermal floor heat", "Aurora wake-up alert", "Nordic breakfast", "EV charger"],
    cancellationPolicy: "Free cancellation up to 5 days prior",
    provider: "Unseen Stays Catalog",
    availabilityStatus: "Simulated Demo Inventory",
    provenance: "demo_adapter",
    lat: 63.418,
    lng: -19.006,
    mediaKey: "switzerland"
  },
  {
    id: "ht-morocco-riad",
    name: "Riad Zitoun Quiet Cedar Sanctuary",
    destinationId: "morocco",
    area: "Kasbah Quiet Alley, Marrakech",
    rating: 4.9,
    reviewCount: 356,
    pricePerNightInr: 8600,
    tier: "boutique",
    roomTypes: ["Orange Blossom Courtyard", "Atlas Rooftop Suite"],
    distanceToCenterKm: 0.8,
    amenities: ["Courtyard plunge pool", "Mint tea welcome", "Rooftop breakfast", "Hammam"],
    cancellationPolicy: "Free cancellation up to 48 hours prior",
    provider: "Unseen Stays Catalog",
    availabilityStatus: "Simulated Demo Inventory",
    provenance: "demo_adapter",
    lat: 31.617,
    lng: -7.986,
    mediaKey: "boutique_villa"
  },
  {
    id: "ht-thailand-nimman",
    name: "Lanna Quiet Courtyard Residence",
    destinationId: "thailand",
    area: "Nimman Quiet Lane, Chiang Mai",
    rating: 4.8,
    reviewCount: 294,
    pricePerNightInr: 5600,
    tier: "boutique",
    roomTypes: ["Teak Garden Studio", "Courtyard Balcony Room"],
    distanceToCenterKm: 1,
    amenities: ["Saltwater garden pool", "Specialty coffee bar", "Bicycle loan", "Airport pickup"],
    cancellationPolicy: "Free cancellation up to 48 hours prior",
    provider: "Unseen Stays Catalog",
    availabilityStatus: "Simulated Demo Inventory",
    provenance: "demo_adapter",
    lat: 18.798,
    lng: 98.967,
    mediaKey: "bali"
  }
];
function getFlightsForRoute(origin, destinationName) {
  const dest = destinationName.toLowerCase();
  const cleanOrigin = origin.trim() || "Kolkata";
  const googleFlightsUrl = `https://www.google.com/travel/flights?q=${encodeURIComponent(`Flights from ${cleanOrigin} to ${destinationName}`)}`;
  const routeProfile = (() => {
    if (dest.includes("london") || dest.includes("heathrow") || dest.includes("gatwick") || dest.includes("uk") || dest.includes("england") || dest.includes("britain")) {
      return { base: 49500, carrier1: "British Airways", carrier2: "Air India / Emirates", code1: "BA-118", code2: "AI-161", code3: "EK-001", dur1: "9h 55m", dur2: "9h 15m", dur3: "12h 40m", dep1: "06:10", arr1: "11:45", dep2: "08:30", arr2: "13:50", stops2: 0 };
    }
    if (dest.includes("paris") || dest.includes("france") || dest.includes("cdg")) {
      return { base: 48e3, carrier1: "Air France", carrier2: "Lufthansa / Swiss", code1: "AF-217", code2: "LH-763", code3: "EK-073", dur1: "9h 45m", dur2: "10h 10m", dur3: "12h 50m", dep1: "05:40", arr1: "11:20", dep2: "07:15", arr2: "14:25", stops2: 0 };
    }
    if (dest.includes("new york") || dest.includes("nyc") || dest.includes("jfk") || dest.includes("usa") || dest.includes("america")) {
      return { base: 68e3, carrier1: "Air India / United", carrier2: "Emirates", code1: "AI-101", code2: "EK-201", code3: "QR-701", dur1: "15h 40m", dur2: "16h 20m", dur3: "18h 10m", dep1: "02:20", arr1: "07:30", dep2: "09:45", arr2: "19:15", stops2: 1 };
    }
    if (dest.includes("ladakh") || dest.includes("leh")) {
      return { base: 11500, carrier1: "IndiGo", carrier2: "Air India", code1: "6E-209", code2: "AI-445", code3: "SG-121", dur1: "4h 10m", dur2: "2h 55m", dur3: "5h 20m", dep1: "06:20", arr1: "10:30", dep2: "09:40", arr2: "12:35", stops2: 0 };
    }
    if (dest.includes("kerala") || dest.includes("kochi") || dest.includes("munnar")) {
      return { base: 9200, carrier1: "IndiGo", carrier2: "Air India Express", code1: "6E-631", code2: "IX-884", code3: "6E-419", dur1: "2h 50m", dur2: "3h 05m", dur3: "4h 40m", dep1: "07:10", arr1: "10:00", dep2: "13:15", arr2: "16:20", stops2: 0 };
    }
    if (dest.includes("nepal") || dest.includes("kathmandu") || dest.includes("pokhara")) {
      return { base: 13800, carrier1: "Buddha Air / IndiGo", carrier2: "Air India", code1: "6E-1803", code2: "AI-247", code3: "U4-162", dur1: "1h 35m", dur2: "3h 20m", dur3: "2h 10m", dep1: "08:45", arr1: "10:35", dep2: "12:15", arr2: "15:50", stops2: 0 };
    }
    if (dest.includes("thailand") || dest.includes("chiang") || dest.includes("krabi") || dest.includes("bangkok")) {
      return { base: 19800, carrier1: "Thai AirAsia", carrier2: "Thai Airways", code1: "FD-121", code2: "TG-314", code3: "6E-1053", dur1: "4h 15m", dur2: "2h 40m", dur3: "5h 30m", dep1: "01:40", arr1: "07:25", dep2: "11:20", arr2: "15:30", stops2: 0 };
    }
    if (dest.includes("bali") || dest.includes("denpasar")) {
      return { base: 27500, carrier1: "Malaysia Airlines", carrier2: "Singapore Airlines", code1: "MH-185", code2: "SQ-517", code3: "AK-062", dur1: "7h 50m", dur2: "7h 10m", dur3: "8h 45m", dep1: "00:25", arr1: "10:45", dep2: "23:50", arr2: "09:30+1", stops2: 1 };
    }
    if (dest.includes("turkey") || dest.includes("cappadocia") || dest.includes("istanbul")) {
      return { base: 38500, carrier1: "IndiGo / Turkish", carrier2: "Turkish Airlines", code1: "6E-11", code2: "TK-721", code3: "EK-573", dur1: "9h 40m", dur2: "8h 55m", dur3: "11h 10m", dep1: "04:15", arr1: "11:25", dep2: "06:50", arr2: "13:15", stops2: 1 };
    }
    if (dest.includes("morocco") || dest.includes("marrakech")) {
      return { base: 42e3, carrier1: "Qatar Airways", carrier2: "Emirates / Royal Air Maroc", code1: "QR-541", code2: "EK-571", code3: "EY-223", dur1: "12h 50m", dur2: "12h 15m", dur3: "13h 40m", dep1: "03:20", arr1: "11:40", dep2: "09:45", arr2: "17:30", stops2: 1 };
    }
    if (dest.includes("japan") || dest.includes("kyoto") || dest.includes("tokyo")) {
      return { base: 45500, carrier1: "ANA / Singapore Air", carrier2: "Japan Airlines", code1: "SQ-517", code2: "JL-030", code3: "TG-314", dur1: "10h 30m", dur2: "9h 45m", dur3: "11h 50m", dep1: "23:50", arr1: "13:50+1", dep2: "02:30", arr2: "15:45", stops2: 1 };
    }
    if (dest.includes("italy") || dest.includes("amalfi") || dest.includes("rome") || dest.includes("greece") || dest.includes("santorini")) {
      return { base: 51500, carrier1: "Qatar Airways", carrier2: "Emirates", code1: "QR-541", code2: "EK-573", code3: "EY-255", dur1: "11h 45m", dur2: "11h 10m", dur3: "12h 30m", dep1: "03:20", arr1: "11:35", dep2: "20:45", arr2: "04:25+1", stops2: 1 };
    }
    if (dest.includes("iceland") || dest.includes("reykjavik")) {
      return { base: 64e3, carrier1: "Lufthansa / Icelandair", carrier2: "British Airways / Icelandair", code1: "LH-763", code2: "BA-142", code3: "KL-872", dur1: "14h 50m", dur2: "14h 15m", dur3: "15h 40m", dep1: "01:55", arr1: "12:15", dep2: "07:10", arr2: "16:55", stops2: 2 };
    }
    return { base: 53e3, carrier1: "Swiss / Lufthansa", carrier2: "Emirates", code1: "LX-147", code2: "EK-571", code3: "QR-541", dur1: "11h 50m", dur2: "11h 20m", dur3: "12h 40m", dep1: "02:05", arr1: "09:25", dep2: "09:45", arr2: "16:35", stops2: 1 };
  })();
  return [
    {
      id: `fl-${dest}-1`,
      origin: cleanOrigin,
      destination: destinationName,
      airline: routeProfile.carrier1,
      flightNumber: routeProfile.code1,
      departureTime: routeProfile.dep1,
      arrivalTime: routeProfile.arr1,
      durationLabel: routeProfile.dur1,
      stops: routeProfile.stops2 === 0 ? 0 : 1,
      baggage: "25kg Checked + 7kg Cabin",
      priceInr: routeProfile.base,
      cabinClass: "Economy Saver",
      provider: "Indicative Route Benchmark",
      provenance: "indicative_estimate",
      providerUrl: googleFlightsUrl
    },
    {
      id: `fl-${dest}-2`,
      origin: cleanOrigin,
      destination: destinationName,
      airline: routeProfile.carrier2,
      flightNumber: routeProfile.code2,
      departureTime: routeProfile.dep2,
      arrivalTime: routeProfile.arr2,
      durationLabel: routeProfile.dur2,
      stops: routeProfile.stops2,
      baggage: "30kg Checked + 7kg Cabin",
      priceInr: Math.round(routeProfile.base * 1.18),
      cabinClass: "Economy Flex",
      provider: "Indicative Route Benchmark",
      provenance: "indicative_estimate",
      providerUrl: googleFlightsUrl
    },
    {
      id: `fl-${dest}-3`,
      origin: cleanOrigin,
      destination: destinationName,
      airline: `${routeProfile.carrier1} Value`,
      flightNumber: routeProfile.code3,
      departureTime: "21:40",
      arrivalTime: "06:15+1",
      durationLabel: routeProfile.dur3,
      stops: 1,
      baggage: "20kg Checked + 7kg Cabin",
      priceInr: Math.round(routeProfile.base * 0.92),
      cabinClass: "Night Value",
      provider: "Indicative Route Benchmark",
      provenance: "indicative_estimate",
      providerUrl: googleFlightsUrl
    }
  ];
}
function getTransportOptions(destinationId) {
  const map = {
    bali: [
      {
        id: "tr-bali-airport",
        mode: "Airport Transfer",
        route: "Ngurah Rai (DPS) \u2192 Ubud / Sanur Hotel",
        durationMinutes: 65,
        distanceKm: 34,
        estimatedFareInr: 1450,
        provider: "Indicative Charter Desk",
        availabilityStatus: "Indicative Estimate (Confirm locally)",
        provenance: "indicative_estimate",
        bookingUrl: "https://www.klook.com"
      },
      {
        id: "tr-bali-cab",
        mode: "Cab",
        route: "Full-Day Private Island Driver (8 hrs)",
        durationMinutes: 480,
        distanceKm: 95,
        estimatedFareInr: 2600,
        provider: "Demo Mobility Adapter",
        availabilityStatus: "Simulated Demo Rate",
        provenance: "demo_adapter",
        bookingUrl: "https://www.bluebirdgroup.com"
      },
      {
        id: "tr-bali-walk",
        mode: "Walking",
        route: "Sanur Sunrise Boardwalk & Cafe Trail",
        durationMinutes: 45,
        distanceKm: 3.2,
        estimatedFareInr: 0,
        provider: "Self-guided route",
        availabilityStatus: "Open public path",
        provenance: "indicative_estimate",
        bookingUrl: "https://maps.google.com"
      }
    ],
    nepal: [
      {
        id: "tr-np-air",
        mode: "Flight",
        route: "Kathmandu (KTM) \u2192 Pokhara (PKR) Scenic Hop",
        durationMinutes: 25,
        distanceKm: 200,
        estimatedFareInr: 4900,
        provider: "Demo Regional Air Adapter",
        availabilityStatus: "Simulated Demo Fare",
        provenance: "demo_adapter",
        bookingUrl: "https://www.buddhaair.com"
      },
      {
        id: "tr-np-cab",
        mode: "Cab",
        route: "Pokhara Airport \u2192 Lakeside & Sarangkot",
        durationMinutes: 35,
        distanceKm: 14,
        estimatedFareInr: 950,
        provider: "Indicative Local Taxi",
        availabilityStatus: "Indicative Estimate",
        provenance: "indicative_estimate",
        bookingUrl: "https://maps.google.com"
      }
    ],
    switzerland: [
      {
        id: "tr-ch-train",
        mode: "Train",
        route: "Zurich Airport \u2192 Zermatt (SBB Alpine Rail)",
        durationMinutes: 205,
        distanceKm: 250,
        estimatedFareInr: 8900,
        provider: "SBB Indicative Schedule",
        availabilityStatus: "Indicative Rail Fare",
        provenance: "indicative_estimate",
        bookingUrl: "https://www.sbb.ch"
      },
      {
        id: "tr-ch-shuttle",
        mode: "Cab",
        route: "Zermatt Electric Station Shuttle",
        durationMinutes: 10,
        distanceKm: 1.8,
        estimatedFareInr: 1200,
        provider: "Local Car-Free Fleet",
        availabilityStatus: "Hotel / Station Pickup",
        provenance: "demo_adapter",
        bookingUrl: "https://www.zermatt.ch"
      }
    ],
    japan: [
      {
        id: "tr-jp-train",
        mode: "Train",
        route: "Kansai Airport \u2192 Kyoto Station (Haruka Express)",
        durationMinutes: 75,
        distanceKm: 98,
        estimatedFareInr: 1950,
        provider: "JR West Indicative Fare",
        availabilityStatus: "Indicative Rail Schedule",
        provenance: "indicative_estimate",
        bookingUrl: "https://www.westjr.co.jp"
      },
      {
        id: "tr-jp-bus",
        mode: "Bus",
        route: "Kyoto Station \u2192 Ohara Mountain Sanctuary",
        durationMinutes: 55,
        distanceKm: 22,
        estimatedFareInr: 380,
        provider: "Kyoto Bus Line 17",
        availabilityStatus: "Public Transit Route",
        provenance: "indicative_estimate",
        bookingUrl: "https://maps.google.com"
      }
    ],
    italy: [
      {
        id: "tr-it-ferry",
        mode: "Bus",
        route: "Salerno / Naples \u2192 Amalfi & Ravello Coastal Shuttle",
        durationMinutes: 60,
        distanceKm: 32,
        estimatedFareInr: 1400,
        provider: "Travelmar / SITA Indicative",
        availabilityStatus: "Seasonal Ferry & Bus",
        provenance: "indicative_estimate",
        bookingUrl: "https://www.travelmar.it"
      }
    ],
    ladakh: [
      {
        id: "tr-la-suv",
        mode: "Cab",
        route: "Leh \u2192 Nubra Valley & Pangong Private Mountain SUV",
        durationMinutes: 270,
        distanceKm: 160,
        estimatedFareInr: 5800,
        provider: "Ladakh Taxi Union Indicative",
        availabilityStatus: "Union Fixed Tariff",
        provenance: "indicative_estimate",
        bookingUrl: "https://maps.google.com"
      }
    ],
    kerala: [
      {
        id: "tr-kl-sedan",
        mode: "Cab",
        route: "Kochi Airport \u2192 Munnar Tea Ridges & Alleppey",
        durationMinutes: 210,
        distanceKm: 130,
        estimatedFareInr: 3600,
        provider: "Kerala Charter Mobility",
        availabilityStatus: "Indicative Private Transfer",
        provenance: "indicative_estimate",
        bookingUrl: "https://maps.google.com"
      }
    ],
    greece: [
      {
        id: "tr-gr-ferry",
        mode: "Bus",
        route: "Athinios Port / Airport \u2192 Pyrgos & Oia Coastal Bus",
        durationMinutes: 35,
        distanceKm: 14,
        estimatedFareInr: 220,
        provider: "KTEL Santorini",
        availabilityStatus: "Public Island Transit",
        provenance: "indicative_estimate",
        bookingUrl: "https://www.ktel-santorini.gr"
      }
    ],
    turkey: [
      {
        id: "tr-tr-shuttle",
        mode: "Airport Transfer",
        route: "Nev\u015Fehir / Kayseri Airport \u2192 G\xF6reme & U\xE7hisar",
        durationMinutes: 45,
        distanceKm: 42,
        estimatedFareInr: 1100,
        provider: "Cappadocia Shared Shuttle",
        availabilityStatus: "Flight-Synced Transfer",
        provenance: "indicative_estimate",
        bookingUrl: "https://maps.google.com"
      }
    ],
    iceland: [
      {
        id: "tr-is-flybus",
        mode: "Bus",
        route: "Keflav\xEDk Airport \u2192 Reykjavik & South Coast Ring",
        durationMinutes: 45,
        distanceKm: 50,
        estimatedFareInr: 3100,
        provider: "Reykjavik Excursions Flybus",
        availabilityStatus: "Synced with Arrivals",
        provenance: "indicative_estimate",
        bookingUrl: "https://www.re.is"
      }
    ],
    morocco: [
      {
        id: "tr-ma-atlas",
        mode: "Cab",
        route: "Marrakech Medina \u2192 Imlil High Atlas Valley",
        durationMinutes: 90,
        distanceKm: 64,
        estimatedFareInr: 2400,
        provider: "Grand Taxi / Riad Charter",
        availabilityStatus: "Indicative Day Transfer",
        provenance: "indicative_estimate",
        bookingUrl: "https://maps.google.com"
      }
    ],
    london: [
      {
        id: "tr-lon-hex",
        mode: "Train",
        route: "Heathrow Airport \u2192 Paddington / Central London (Elizabeth Line / Heathrow Express)",
        durationMinutes: 20,
        distanceKm: 24,
        estimatedFareInr: 1650,
        provider: "TfL Rail & Elizabeth Line",
        availabilityStatus: "Every 5\u201315 mins",
        provenance: "indicative_estimate",
        bookingUrl: "https://tfl.gov.uk"
      },
      {
        id: "tr-lon-tube",
        mode: "Train",
        route: "London Underground (Tube) & Bus All-Day Contactless Fare Cap",
        durationMinutes: 45,
        distanceKm: 18,
        estimatedFareInr: 950,
        provider: "Transport for London (TfL)",
        availabilityStatus: "Unlimited daily transit",
        provenance: "indicative_estimate",
        bookingUrl: "https://tfl.gov.uk"
      },
      {
        id: "tr-lon-boat",
        mode: "Bus",
        route: "Uber Boat by Thames Clipper Scenic River Route (Westminster \u2192 Greenwich)",
        durationMinutes: 40,
        distanceKm: 12,
        estimatedFareInr: 900,
        provider: "Thames Clippers",
        availabilityStatus: "Every 20 mins",
        provenance: "indicative_estimate",
        bookingUrl: "https://www.thamesclippers.com"
      },
      {
        id: "tr-lon-cab",
        mode: "Cab",
        route: "Iconic London Black Cab / Private City Transfer",
        durationMinutes: 45,
        distanceKm: 15,
        estimatedFareInr: 3800,
        provider: "Licensed London Taxis",
        availabilityStatus: "Available across all ranks",
        provenance: "indicative_estimate",
        bookingUrl: "https://tfl.gov.uk"
      }
    ],
    paris: [
      {
        id: "tr-par-rer",
        mode: "Train",
        route: "Charles de Gaulle Airport (CDG) \u2192 Ch\xE2telet-Les Halles (RER B)",
        durationMinutes: 38,
        distanceKm: 31,
        estimatedFareInr: 1250,
        provider: "RATP / \xCEle-de-France Mobilit\xE9s",
        availabilityStatus: "Every 10\u201315 mins",
        provenance: "indicative_estimate",
        bookingUrl: "https://www.ratp.fr"
      },
      {
        id: "tr-par-metro",
        mode: "Train",
        route: "Paris M\xE9tro Navigo Easy Day Pass",
        durationMinutes: 30,
        distanceKm: 12,
        estimatedFareInr: 850,
        provider: "RATP M\xE9tro",
        availabilityStatus: "Unlimited daily rides",
        provenance: "indicative_estimate",
        bookingUrl: "https://www.ratp.fr"
      }
    ],
    thailand: [
      {
        id: "tr-th-rail",
        mode: "Flight",
        route: "Chiang Mai (CNX) \u2192 Krabi (KBV) Coastal Hop + Pier Boat",
        durationMinutes: 115,
        distanceKm: 1280,
        estimatedFareInr: 4800,
        provider: "Regional Air + Ao Nang Pier",
        availabilityStatus: "Indicative Domestic Link",
        provenance: "indicative_estimate",
        bookingUrl: "https://www.google.com/travel/flights"
      }
    ]
  };
  if (map[destinationId]) {
    return map[destinationId];
  }
  const cleanName = destinationId.split("-").map((w) => w.charAt(0).toUpperCase() + w.slice(1)).join(" ");
  return [
    {
      id: `tr-${destinationId}-airport`,
      mode: "Airport Transfer",
      route: `${cleanName} International Gateway \u2192 City Center Rail/Shuttle`,
      durationMinutes: 35,
      distanceKm: 22,
      estimatedFareInr: 1400,
      provider: "Local Rail & Transit Hub",
      availabilityStatus: "Scheduled service",
      provenance: "indicative_estimate",
      bookingUrl: "https://maps.google.com"
    },
    {
      id: `tr-${destinationId}-transit`,
      mode: "Train",
      route: `${cleanName} Central Metro / Urban Transit Day Network`,
      durationMinutes: 30,
      distanceKm: 15,
      estimatedFareInr: 650,
      provider: "City Metro & Transit Network",
      availabilityStatus: "Full day transit coverage",
      provenance: "indicative_estimate",
      bookingUrl: "https://maps.google.com"
    },
    {
      id: `tr-${destinationId}-cab`,
      mode: "Cab",
      route: `${cleanName} Private Day Driver & Sightseeing Car`,
      durationMinutes: 240,
      distanceKm: 50,
      estimatedFareInr: 3200,
      provider: "Verified Local Dispatch",
      availabilityStatus: "On-demand or scheduled",
      provenance: "indicative_estimate",
      bookingUrl: "https://maps.google.com"
    },
    {
      id: `tr-${destinationId}-walk`,
      mode: "Walking",
      route: `${cleanName} Historic Quarter & Waterfront Footpath`,
      durationMinutes: 45,
      distanceKm: 3.5,
      estimatedFareInr: 0,
      provider: "Self-guided scenic route",
      availabilityStatus: "Open public walkway",
      provenance: "indicative_estimate",
      bookingUrl: "https://maps.google.com"
    }
  ];
}
var INDICATIVE_CURRENCY_RATES_FROM_INR = {
  INR: { rate: 1, symbol: "\u20B9", name: "Indian Rupee" },
  GBP: { rate: 94e-4, symbol: "\xA3", name: "British Pound" },
  USD: { rate: 0.0119, symbol: "$", name: "US Dollar" },
  EUR: { rate: 0.011, symbol: "\u20AC", name: "Euro" },
  CHF: { rate: 0.0104, symbol: "CHF", name: "Swiss Franc" },
  IDR: { rate: 187.5, symbol: "Rp", name: "Indonesian Rupiah" },
  NPR: { rate: 1.6, symbol: "\u0930\u0942", name: "Nepalese Rupee" },
  JPY: { rate: 1.82, symbol: "\xA5", name: "Japanese Yen" },
  TRY: { rate: 0.41, symbol: "\u20BA", name: "Turkish Lira" },
  ISK: { rate: 1.65, symbol: "kr", name: "Icelandic Kr\xF3na" },
  MAD: { rate: 0.12, symbol: "MAD", name: "Moroccan Dirham" },
  THB: { rate: 0.41, symbol: "\u0E3F", name: "Thai Baht" },
  AED: { rate: 0.0437, symbol: "AED", name: "UAE Dirham" },
  SGD: { rate: 0.016, symbol: "S$", name: "Singapore Dollar" },
  AUD: { rate: 0.018, symbol: "A$", name: "Australian Dollar" },
  CAD: { rate: 0.016, symbol: "C$", name: "Canadian Dollar" }
};

// src/lib/worldwideDestinations.ts
var KNOWN_WORLD_CITIES = {
  alaska: {
    name: "Alaska",
    country: "United States",
    region: "North America / Arctic",
    tagline: "Dancing Aurora Borealis, wild glacial fjords, towering peaks, and pristine wilderness.",
    description: "Immerse in the untamed grandeur of Alaska: world-class Northern Lights viewing in Fairbanks and Chena Hot Springs, scenic glacier cruises through Kenai Fjords, dog sledding through snowbound boreal forests, and the towering silhouette of Mount Denali.",
    mediaKey: "hero_alpine",
    currencyCode: "USD",
    currencySymbol: "$",
    languageName: "English & Native Alaskan Languages",
    bestSeason: "September \u2013 April (Northern Lights Season) & June \u2013 August (Midnight Sun)",
    recommendedDays: 7,
    dailyBudgetInr: { budget: 11e3, balanced: 21e3, luxury: 42e3 },
    coordinates: { lat: 64.8378, lng: -147.7164 },
    tags: ["Nature", "Peaceful Places", "Adventure", "Scenic Viewpoints"],
    airport: { name: "Fairbanks International Airport (FAI) / Ted Stevens Anchorage (ANC)", lat: 64.8151, lng: -147.8597 },
    places: [
      {
        name: "Fairbanks Aurora Sky Dome & Night Watch",
        type: "Attraction",
        description: "World-renowned aurora viewing vantage directly under the auroral oval with 360-degree dark sky vistas.",
        bestTime: "22:00 \u2013 03:00",
        lat: 64.8378,
        lng: -147.7164,
        estimatedEntryInr: 0,
        crowdLevel: "Quiet"
      },
      {
        name: "Chena Hot Springs Geothermal Pools",
        type: "Hidden Gem",
        description: "Natural 40\xB0C outdoor rock pools surrounded by snowdrifts, ideal for soaking under dancing northern lights.",
        bestTime: "20:00 \u2013 01:00",
        lat: 65.0531,
        lng: -146.0567,
        estimatedEntryInr: 1600,
        crowdLevel: "Quiet"
      },
      {
        name: "Denali National Park & Mount Denali Vista",
        type: "Attraction",
        description: "Six million acres of wild tundra crowned by North America\u2019s tallest peak (20,310 ft) and roaming wildlife.",
        bestTime: "08:00 \u2013 14:00",
        lat: 63.1148,
        lng: -151.1926,
        estimatedEntryInr: 1250,
        crowdLevel: "Quiet"
      },
      {
        name: "Kenai Fjords & Resurrection Bay Glacial Cruise",
        type: "Attraction",
        description: "Catamaran cruise past calving tidewater glaciers, sea otters, puffins, harbor seals, and orcas.",
        bestTime: "09:30 \u2013 15:30",
        lat: 60.1042,
        lng: -149.4422,
        estimatedEntryInr: 14500,
        crowdLevel: "Moderate"
      },
      {
        name: "Castner Glacier Ice Cave & Delta Junction",
        type: "Hidden Gem",
        description: "Mesmerizing cathedral of blue glacial ice and frozen meltwater streams reachable by winter snowshoeing.",
        bestTime: "10:00 \u2013 13:30",
        lat: 63.4011,
        lng: -145.7322,
        estimatedEntryInr: 0,
        crowdLevel: "Quiet"
      },
      {
        name: "Talkeetna Historic Pioneer Town & Sourdough Bakeries",
        type: "Cafe & Food",
        description: "Quirky mountaineer outpost with artisanal sourdough bakeries, craft breweries, and Denali flightseeing.",
        bestTime: "11:00 \u2013 15:00",
        lat: 62.3209,
        lng: -150.1097,
        estimatedEntryInr: 900,
        crowdLevel: "Quiet"
      },
      {
        name: "Tony Knowles Coastal Trail & Chugach Mountains",
        type: "Hidden Gem",
        description: "Pristine 11-mile coastal pathway overlooking Cook Inlet with frequent moose sightings and alpine backdrops.",
        bestTime: "08:30 \u2013 11:30",
        lat: 61.2181,
        lng: -149.9003,
        estimatedEntryInr: 0,
        crowdLevel: "Quiet"
      }
    ]
  },
  london: {
    name: "London",
    country: "United Kingdom",
    region: "Western Europe",
    tagline: "Historic mews, royal parks, quiet Thameside paths, and world-class culture.",
    description: "Explore London\u2019s peaceful side: morning walks across Hampstead Heath, quiet artisan coffee houses in Bloomsbury, secret courtyards behind St. Paul\u2019s, and sunset walks along the South Bank.",
    mediaKey: "boutique_villa",
    currencyCode: "GBP",
    currencySymbol: "\xA3",
    languageName: "English",
    bestSeason: "May \u2013 October & festive December",
    recommendedDays: 5,
    dailyBudgetInr: { budget: 7500, balanced: 14500, luxury: 29e3 },
    coordinates: { lat: 51.5074, lng: -0.1278 },
    tags: ["Culture", "Cafes", "Peaceful Places", "Historic"],
    airport: { name: "Heathrow International Airport (LHR)", lat: 51.47, lng: -0.4543 },
    places: [
      {
        name: "Hampstead Heath & Parliament Hill",
        type: "Attraction",
        description: "Vast ancient parkland with stunning skyline views and quiet bathing ponds.",
        bestTime: "08:00 \u2013 11:30",
        lat: 51.5608,
        lng: -0.1631,
        estimatedEntryInr: 0,
        crowdLevel: "Quiet"
      },
      {
        name: "Bloomsbury Literary Quarter & British Museum",
        type: "Attraction",
        description: "Georgian squares, antiquarian bookshops, and quiet garden benches.",
        bestTime: "10:00 \u2013 13:00",
        lat: 51.5194,
        lng: -0.127,
        estimatedEntryInr: 0,
        crowdLevel: "Moderate"
      },
      {
        name: "South Bank Riverside Walk & Borough Market",
        type: "Cafe & Food",
        description: "Scenic Thames footpath past Shakespeare\u2019s Globe and artisanal food stalls.",
        bestTime: "12:00 \u2013 15:00",
        lat: 51.5055,
        lng: -0.091,
        estimatedEntryInr: 800,
        crowdLevel: "Moderate"
      },
      {
        name: "Kensington Gardens & Notting Hill Quiet Mews",
        type: "Hidden Gem",
        description: "Pastel mews houses, royal tree-lined paths, and independent coffee roasters.",
        bestTime: "09:00 \u2013 12:00",
        lat: 51.507,
        lng: -0.1877,
        estimatedEntryInr: 0,
        crowdLevel: "Quiet"
      },
      {
        name: "Greenwich Maritime Park & Royal Observatory",
        type: "Hidden Gem",
        description: "Prime Meridian line, sweeping Canary Wharf vistas, and quiet covered market.",
        bestTime: "14:00 \u2013 17:30",
        lat: 51.4769,
        lng: -5e-4,
        estimatedEntryInr: 1800,
        crowdLevel: "Quiet"
      }
    ]
  },
  paris: {
    name: "Paris",
    country: "France",
    region: "Western Europe",
    tagline: "Tree-lined boulevards, quiet Seine riverside bookstalls, and neighborhood bistros.",
    description: "Experience authentic Parisian rhythm: unhurried mornings along Canal Saint-Martin, hidden courtyards of Le Marais, and sunset picnics in Luxembourg Gardens.",
    mediaKey: "boutique_villa",
    currencyCode: "EUR",
    currencySymbol: "\u20AC",
    languageName: "French",
    bestSeason: "April \u2013 June & September \u2013 November",
    recommendedDays: 5,
    dailyBudgetInr: { budget: 7200, balanced: 13800, luxury: 27500 },
    coordinates: { lat: 48.8566, lng: 2.3522 },
    tags: ["Culture", "Cafes", "Peaceful Places", "Historic"],
    airport: { name: "Charles de Gaulle Airport (CDG)", lat: 49.0097, lng: 2.5479 },
    places: [
      {
        name: "Place des Vosges & Le Marais Historic Mansions",
        type: "Attraction",
        description: "Oldest planned square in Paris with arched arcades and quiet art galleries.",
        bestTime: "09:30 \u2013 12:30",
        lat: 48.8555,
        lng: 2.3655,
        estimatedEntryInr: 0,
        crowdLevel: "Quiet"
      },
      {
        name: "Canal Saint-Martin Shaded Footbridges",
        type: "Hidden Gem",
        description: "Locals gathering along tree-shaded locks, specialty bakeries, and calm wine bars.",
        bestTime: "15:00 \u2013 18:30",
        lat: 48.8715,
        lng: 2.366,
        estimatedEntryInr: 0,
        crowdLevel: "Quiet"
      },
      {
        name: "Jardin du Luxembourg & Medici Fountain",
        type: "Attraction",
        description: "Green metal chairs, chestnut tree groves, and quiet reflection pools.",
        bestTime: "08:30 \u2013 11:00",
        lat: 48.8462,
        lng: 2.3372,
        estimatedEntryInr: 0,
        crowdLevel: "Moderate"
      }
    ]
  },
  tokyo: {
    name: "Tokyo",
    country: "Japan",
    region: "East Asia",
    tagline: "Neon skylines, ancient cedar shrines, world-class gastronomy, and serene gardens.",
    description: "From the iconic buzz of Shibuya Crossing and the timeless incense of Senso-ji to serene dawn walks through Meiji Shrine\u2019s forest and meticulous neighborhood ramen counters, Tokyo balances cutting-edge wonder with profound peace.",
    mediaKey: "japan",
    currencyCode: "JPY",
    currencySymbol: "\xA5",
    languageName: "Japanese",
    bestSeason: "March \u2013 May (Cherry Blossom) & October \u2013 November (Autumn Foliage)",
    recommendedDays: 6,
    dailyBudgetInr: { budget: 6200, balanced: 11500, luxury: 24e3 },
    coordinates: { lat: 35.6762, lng: 139.6503 },
    tags: ["Culture", "Cafes", "Peaceful Places", "Historic"],
    airport: { name: "Haneda International Airport (HND)", lat: 35.5494, lng: 139.7798 },
    places: [
      {
        name: "Senso-ji Temple & Asakusa Heritage Quarter",
        type: "Attraction",
        description: "Tokyo\u2019s oldest, most iconic Buddhist temple with the giant red Kaminarimon lantern and traditional artisan crafts.",
        bestTime: "07:30 \u2013 10:30",
        lat: 35.7148,
        lng: 139.7967,
        estimatedEntryInr: 0,
        crowdLevel: "Popular"
      },
      {
        name: "Shibuya Crossing, Hachiko Memorial & Shibuya Sky",
        type: "Attraction",
        description: "World-famous pedestrian scramble crossing and open-air rooftop observation deck with panoramic views of Tokyo and Mt. Fuji.",
        bestTime: "10:00 \u2013 14:00",
        lat: 35.6595,
        lng: 139.7005,
        estimatedEntryInr: 1200,
        crowdLevel: "Popular"
      },
      {
        name: "Meiji Jingu Sacred Forest Shrine & Harajuku",
        type: "Attraction",
        description: "Tranquil 170-acre evergreen forest shrine honoring Emperor Meiji, right beside tree-lined Omotesando avenues.",
        bestTime: "08:00 \u2013 11:00",
        lat: 35.6764,
        lng: 139.6993,
        estimatedEntryInr: 0,
        crowdLevel: "Moderate"
      },
      {
        name: "Shinjuku Gyoen National Garden & Greenhouses",
        type: "Attraction",
        description: "Imperial landscape park blending traditional Japanese, English, and French gardens with prime spring cherry blossoms and autumn maples.",
        bestTime: "09:30 \u2013 12:30",
        lat: 35.6852,
        lng: 139.7101,
        estimatedEntryInr: 320,
        crowdLevel: "Moderate"
      },
      {
        name: "Tsukiji Outer Market & Ginza Artisanal Stalls",
        type: "Cafe & Food",
        description: "Bustling seafood stalls offering fresh sushi, tamagoyaki, wagyu skewers, and nearby luxury Ginza shopping boulevards.",
        bestTime: "08:30 \u2013 12:00",
        lat: 35.6655,
        lng: 139.7708,
        estimatedEntryInr: 1400,
        crowdLevel: "Popular"
      },
      {
        name: "Tokyo Skytree & Sumida River Promenade",
        type: "Attraction",
        description: "Towering 634-meter transmission tower offering 360-degree metropolitan vistas and scenic riverside walks.",
        bestTime: "15:30 \u2013 19:00",
        lat: 35.71,
        lng: 139.8107,
        estimatedEntryInr: 1800,
        crowdLevel: "Popular"
      },
      {
        name: "Yanaka Old Town Heritage District",
        type: "Hidden Gem",
        description: "Edo-period wooden houses, quiet artisan sweet shops, traditional craft studios, and tranquil temple cemeteries.",
        bestTime: "09:00 \u2013 12:00",
        lat: 35.7275,
        lng: 139.769,
        estimatedEntryInr: 0,
        crowdLevel: "Quiet"
      }
    ]
  },
  newyork: {
    name: "New York City",
    country: "United States",
    region: "North America",
    tagline: "Iconic skylines, world-class museums, Broadway stages, and lush urban parks.",
    description: "From the towering drama of Times Square and the Statue of Liberty to unhurried mornings beneath Central Park\u2019s weeping willows and sunset strolls across Brooklyn Bridge, NYC offers legendary sights at every turn.",
    mediaKey: "boutique_villa",
    currencyCode: "USD",
    currencySymbol: "$",
    languageName: "English",
    bestSeason: "May \u2013 June & September \u2013 November",
    recommendedDays: 5,
    dailyBudgetInr: { budget: 8500, balanced: 16500, luxury: 34e3 },
    coordinates: { lat: 40.7128, lng: -74.006 },
    tags: ["Culture", "Cafes", "Historic"],
    airport: { name: "John F. Kennedy International Airport (JFK)", lat: 40.6413, lng: -73.7781 },
    places: [
      {
        name: "Central Park Bow Bridge, Bethesda Terrace & The Ramble",
        type: "Attraction",
        description: "843 acres of peaceful lakes, historic stone bridges, Victorian carriage paths, and lush maple groves in the heart of Manhattan.",
        bestTime: "08:00 \u2013 11:30",
        lat: 40.7829,
        lng: -73.9654,
        estimatedEntryInr: 0,
        crowdLevel: "Moderate"
      },
      {
        name: "Times Square & Broadway Theater District",
        type: "Attraction",
        description: "The electrifying crossroads of the world with towering digital marquees, street performers, and world-renowned Broadway shows.",
        bestTime: "17:00 \u2013 22:00",
        lat: 40.758,
        lng: -73.9855,
        estimatedEntryInr: 0,
        crowdLevel: "Popular"
      },
      {
        name: "Brooklyn Bridge Pedestrian Boardwalk & DUMBO",
        type: "Attraction",
        description: "Walk above the East River along the historic 1883 suspension bridge with soaring Gothic arches and iconic lower Manhattan skyline vistas.",
        bestTime: "07:30 \u2013 10:30",
        lat: 40.7061,
        lng: -73.9969,
        estimatedEntryInr: 0,
        crowdLevel: "Popular"
      },
      {
        name: "Statue of Liberty & Ellis Island National Monument",
        type: "Attraction",
        description: "The copper monument of freedom in New York Harbor, reached via scenic ferry with views of the Financial District skyline.",
        bestTime: "09:00 \u2013 13:00",
        lat: 40.6892,
        lng: -74.0445,
        estimatedEntryInr: 2100,
        crowdLevel: "Popular"
      },
      {
        name: "The Metropolitan Museum of Art (The Met) & Fifth Avenue",
        type: "Attraction",
        description: "Over 5,000 years of global art, Egyptian Temple of Dendur, European masterpieces, and panoramic Central Park rooftop garden.",
        bestTime: "10:00 \u2013 14:00",
        lat: 40.7794,
        lng: -73.9632,
        estimatedEntryInr: 2500,
        crowdLevel: "Popular"
      },
      {
        name: "The High Line & Chelsea Waterside Park",
        type: "Attraction",
        description: "Elevated railway park with lush wildflowers, Hudson River views, and modern sculpture.",
        bestTime: "07:30 \u2013 10:00",
        lat: 40.748,
        lng: -74.0048,
        estimatedEntryInr: 0,
        crowdLevel: "Moderate"
      },
      {
        name: "West Village Brownstones & Quiet Courtyards",
        type: "Hidden Gem",
        description: "Winding historic cobblestone streets, leafy townhouse gardens, and coffee roasters.",
        bestTime: "10:00 \u2013 13:00",
        lat: 40.7358,
        lng: -74.0036,
        estimatedEntryInr: 0,
        crowdLevel: "Quiet"
      }
    ]
  },
  rome: {
    name: "Rome",
    country: "Italy",
    region: "Southern Europe",
    tagline: "Ancient imperial monuments, Baroque fountains, and cobblestone piazza trattorias.",
    description: "Walk where gladiators battled at the Colosseum, toss a coin in the Trevi Fountain, marvel at Michelangelo\u2019s Sistine Chapel ceiling, and savor cacio e pepe in sun-drenched Trastevere squares.",
    mediaKey: "italy",
    currencyCode: "EUR",
    currencySymbol: "\u20AC",
    languageName: "Italian",
    bestSeason: "April \u2013 June & September \u2013 October",
    recommendedDays: 5,
    dailyBudgetInr: { budget: 6800, balanced: 13200, luxury: 26e3 },
    coordinates: { lat: 41.9028, lng: 12.4964 },
    tags: ["Culture", "Historic", "Cafes", "Peaceful Places"],
    airport: { name: "Leonardo da Vinci\u2013Fiumicino Airport (FCO)", lat: 41.7999, lng: 12.2462 },
    places: [
      {
        name: "Colosseum & Roman Forum Archeological Park",
        type: "Attraction",
        description: "Monumental 2,000-year-old amphitheater of gladiators and the political center of the ancient Roman Empire.",
        bestTime: "08:30 \u2013 11:30",
        lat: 41.8902,
        lng: 12.4922,
        estimatedEntryInr: 2100,
        crowdLevel: "Popular"
      },
      {
        name: "Vatican City, St. Peter\u2019s Basilica & Sistine Chapel",
        type: "Attraction",
        description: "Michelangelo\u2019s legendary frescoes in the Sistine Chapel and the immense marble grandeur of St. Peter\u2019s Square.",
        bestTime: "08:00 \u2013 12:00",
        lat: 41.9029,
        lng: 12.4534,
        estimatedEntryInr: 2400,
        crowdLevel: "Popular"
      },
      {
        name: "Trevi Fountain & The Pantheon Marble Dome",
        type: "Attraction",
        description: "Baroque masterpiece fountain where tossing a coin guarantees your return, and the intact 2nd-century open-oculus temple.",
        bestTime: "07:30 \u2013 10:00",
        lat: 41.9009,
        lng: 12.4833,
        estimatedEntryInr: 500,
        crowdLevel: "Popular"
      },
      {
        name: "Piazza Navona & Spanish Steps Promenade",
        type: "Attraction",
        description: "Bernini\u2019s Fountain of the Four Rivers, bustling painter squares, and the monumental 135-step baroque staircase.",
        bestTime: "15:00 \u2013 18:30",
        lat: 41.8992,
        lng: 12.4731,
        estimatedEntryInr: 0,
        crowdLevel: "Popular"
      },
      {
        name: "Trastevere Quiet Alleyways & Santa Maria Piazza",
        type: "Hidden Gem",
        description: "Ochre-colored cobblestone passages with family trattorias, hanging ivy, and quiet historic courtyards.",
        bestTime: "09:00 \u2013 11:30",
        lat: 41.8894,
        lng: 12.47,
        estimatedEntryInr: 0,
        crowdLevel: "Quiet"
      },
      {
        name: "Villa Borghese Gardens & Pincio Terrace",
        type: "Attraction",
        description: "Panoramic hilltop terrace overlooking Piazza del Popolo and shaded Roman umbrella pine groves.",
        bestTime: "16:00 \u2013 19:00",
        lat: 41.9115,
        lng: 12.4795,
        estimatedEntryInr: 0,
        crowdLevel: "Moderate"
      }
    ]
  },
  barcelona: {
    name: "Barcelona",
    country: "Spain",
    region: "Southern Europe",
    tagline: "Gaud\xED masterpieces, Gothic quarters, golden Mediterranean beaches, and tapas.",
    description: "Gaze up at the dreamlike spires of Sagrada Fam\xEDlia, wander mosaic terraces at Park G\xFCell, lose yourself in Gothic Quarter stone alleys, and enjoy fresh paella by the Mediterranean.",
    mediaKey: "boutique_villa",
    currencyCode: "EUR",
    currencySymbol: "\u20AC",
    languageName: "Spanish & Catalan",
    bestSeason: "May \u2013 June & September \u2013 October",
    recommendedDays: 5,
    dailyBudgetInr: { budget: 6400, balanced: 12500, luxury: 25e3 },
    coordinates: { lat: 41.3851, lng: 2.1734 },
    tags: ["Culture", "Beaches", "Cafes", "Historic"],
    airport: { name: "Josep Tarradellas Barcelona-El Prat Airport (BCN)", lat: 41.2974, lng: 2.0833 },
    places: [
      {
        name: "Bas\xEDlica de la Sagrada Fam\xEDlia (Gaud\xED Masterpiece)",
        type: "Attraction",
        description: "Antoni Gaud\xED\u2019s awe-inspiring modernist basilica with soaring organic towers and stained glass that bathes the nave in rainbow light.",
        bestTime: "09:00 \u2013 12:30",
        lat: 41.4036,
        lng: 2.1744,
        estimatedEntryInr: 2600,
        crowdLevel: "Popular"
      },
      {
        name: "Park G\xFCell Mosaic Serpent Terrace & Fairy Gate",
        type: "Attraction",
        description: "Gaud\xED\u2019s colorful mosaic park perched on Carmel Hill offering sweeping views across Barcelona to the Mediterranean Sea.",
        bestTime: "08:30 \u2013 11:00",
        lat: 41.4145,
        lng: 2.1527,
        estimatedEntryInr: 1200,
        crowdLevel: "Popular"
      },
      {
        name: "Gothic Quarter (Barri G\xF2tic) & Barcelona Cathedral",
        type: "Attraction",
        description: "14th-century medieval labyrinth of stone alleyways, hidden plazas, and the grand Gothic Cathedral of Santa Eulalia.",
        bestTime: "10:00 \u2013 13:30",
        lat: 41.3839,
        lng: 2.1762,
        estimatedEntryInr: 0,
        crowdLevel: "Popular"
      },
      {
        name: "Casa Batll\xF3 & Passeig de Gr\xE0cia Modernist Mansions",
        type: "Attraction",
        description: "Gaud\xED\u2019s dragon-roofed iridescent masterpiece on Barcelona\u2019s most prestigious architectural avenue.",
        bestTime: "13:30 \u2013 16:30",
        lat: 41.3916,
        lng: 2.1648,
        estimatedEntryInr: 2900,
        crowdLevel: "Popular"
      },
      {
        name: "El Born Medieval Alleys & Santa Maria del Mar",
        type: "Attraction",
        description: "Artisan boutiques, quiet stone arches, and historic tapas cellars.",
        bestTime: "10:00 \u2013 13:00",
        lat: 41.3837,
        lng: 2.1818,
        estimatedEntryInr: 0,
        crowdLevel: "Quiet"
      },
      {
        name: "Barceloneta Beach Promenade & Seafood Tapas",
        type: "Cafe & Food",
        description: "Golden sandy Mediterranean boardwalk lined with open-air chiringuito bars and fresh seafood paella restaurants.",
        bestTime: "17:00 \u2013 21:00",
        lat: 41.3784,
        lng: 2.1895,
        estimatedEntryInr: 1600,
        crowdLevel: "Moderate"
      }
    ]
  },
  amsterdam: {
    name: "Amsterdam",
    country: "Netherlands",
    region: "Western Europe",
    tagline: "Gabled canal houses, Dutch master art, flower markets, and peaceful bridges.",
    description: "Glide through UNESCO-listed canal rings, explore world-famous Rembrandt and Van Gogh galleries, and discover secret blooming courtyard gardens in Jordaan.",
    mediaKey: "boutique_villa",
    currencyCode: "EUR",
    currencySymbol: "\u20AC",
    languageName: "Dutch & English",
    bestSeason: "April \u2013 October",
    recommendedDays: 4,
    dailyBudgetInr: { budget: 7e3, balanced: 13500, luxury: 27e3 },
    coordinates: { lat: 52.3676, lng: 4.9041 },
    tags: ["Culture", "Cafes", "Peaceful Places", "Historic"],
    airport: { name: "Amsterdam Airport Schiphol (AMS)", lat: 52.3105, lng: 4.7683 },
    places: [
      {
        name: "Rijksmuseum & Museumplein Masterpieces",
        type: "Attraction",
        description: "The monumental Dutch national museum housing Rembrandt\u2019s The Night Watch and Vermeer\u2019s The Milkmaid.",
        bestTime: "09:00 \u2013 12:30",
        lat: 52.3599,
        lng: 4.8852,
        estimatedEntryInr: 2250,
        crowdLevel: "Popular"
      },
      {
        name: "Anne Frank House & Western Canal Ring",
        type: "Attraction",
        description: "Historic canal house and secret annex museum on Prinsengracht, surrounded by 17th-century merchant houses.",
        bestTime: "09:30 \u2013 12:00",
        lat: 52.3752,
        lng: 4.884,
        estimatedEntryInr: 1600,
        crowdLevel: "Popular"
      },
      {
        name: "Van Gogh Museum & Sunflower Galleries",
        type: "Attraction",
        description: "The world\u2019s largest collection of Vincent van Gogh paintings, drawings, and personal letters.",
        bestTime: "13:00 \u2013 16:00",
        lat: 52.3584,
        lng: 4.8811,
        estimatedEntryInr: 2200,
        crowdLevel: "Popular"
      },
      {
        name: "Jordaan Canal Footbridges & Hidden Courtyards (Hofjes)",
        type: "Hidden Gem",
        description: "Flower-draped bridges, indie bookshops, and silent historic residential gardens.",
        bestTime: "08:30 \u2013 11:30",
        lat: 52.3735,
        lng: 4.8814,
        estimatedEntryInr: 0,
        crowdLevel: "Quiet"
      },
      {
        name: "Vondelpark & Rose Garden Promenade",
        type: "Attraction",
        description: "Expansive historic park with ponds, open-air pavilions, and bike paths.",
        bestTime: "14:00 \u2013 17:00",
        lat: 52.358,
        lng: 4.8686,
        estimatedEntryInr: 0,
        crowdLevel: "Moderate"
      }
    ]
  },
  dubai: {
    name: "Dubai",
    country: "United Arab Emirates",
    region: "Middle East",
    tagline: "Futuristic record-breaking architecture, luxury marina promenades, and desert sunsets.",
    description: "Gaze from the heights of the world\u2019s tallest tower, cruise the dazzling Dubai Marina, and explore atmospheric spice and gold souks along Dubai Creek.",
    mediaKey: "boutique_villa",
    currencyCode: "AED",
    currencySymbol: "AED",
    languageName: "Arabic & English",
    bestSeason: "November \u2013 March (Comfortable Winter Sun)",
    recommendedDays: 4,
    dailyBudgetInr: { budget: 7800, balanced: 15500, luxury: 32e3 },
    coordinates: { lat: 25.2048, lng: 55.2708 },
    tags: ["Culture", "Beaches", "Luxury", "Adventure"],
    airport: { name: "Dubai International Airport (DXB)", lat: 25.2532, lng: 55.3657 },
    places: [
      {
        name: "Burj Khalifa Observation Deck & Dubai Fountain",
        type: "Attraction",
        description: "World\u2019s tallest building rising 828 meters into the sky, overlooking the dancing fountain lake spectacle.",
        bestTime: "16:30 \u2013 19:30",
        lat: 25.1972,
        lng: 55.2744,
        estimatedEntryInr: 4200,
        crowdLevel: "Popular"
      },
      {
        name: "Palm Jumeirah & Dubai Marina Waterfront Walk",
        type: "Attraction",
        description: "Iconic palm-shaped archipelago, luxury superyacht marina, and illuminated evening beach promenades.",
        bestTime: "17:00 \u2013 21:00",
        lat: 25.1124,
        lng: 55.139,
        estimatedEntryInr: 0,
        crowdLevel: "Popular"
      },
      {
        name: "Al Fahidi Historical Quarter & Dubai Creek Abra",
        type: "Attraction",
        description: "Traditional wind-tower architecture, art cafes, and scenic 1-dirham wooden boat rides across the historic trade creek.",
        bestTime: "08:30 \u2013 11:30",
        lat: 25.2631,
        lng: 55.2972,
        estimatedEntryInr: 50,
        crowdLevel: "Quiet"
      }
    ]
  },
  singapore: {
    name: "Singapore",
    country: "Singapore",
    region: "Southeast Asia",
    tagline: "Lush garden city, futuristic supertrees, vibrant hawker food, and marina skylines.",
    description: "Wander beneath colossal vertical gardens at Gardens by the Bay, admire the skyline from Marina Bay Sands, and savor world-famous hawker stall delicacies.",
    mediaKey: "boutique_villa",
    currencyCode: "SGD",
    currencySymbol: "S$",
    languageName: "English, Malay, Mandarin & Tamil",
    bestSeason: "Year-round tropical (pleasant evenings)",
    recommendedDays: 4,
    dailyBudgetInr: { budget: 6800, balanced: 13e3, luxury: 27e3 },
    coordinates: { lat: 1.3521, lng: 103.8198 },
    tags: ["Culture", "Cafes", "Nature", "Modern"],
    airport: { name: "Singapore Changi Airport (SIN)", lat: 1.3644, lng: 103.9915 },
    places: [
      {
        name: "Gardens by the Bay Supertrees & Cloud Forest Dome",
        type: "Attraction",
        description: "Futuristic 50-meter vertical plant towers and the world\u2019s largest glass greenhouse with an indoor mountain waterfall.",
        bestTime: "16:00 \u2013 20:00",
        lat: 1.2816,
        lng: 103.8636,
        estimatedEntryInr: 2200,
        crowdLevel: "Popular"
      },
      {
        name: "Marina Bay Sands SkyPark & Waterfront Promenade",
        type: "Attraction",
        description: "Iconic cantilevered rooftop sky deck offering 360-degree views over the Singapore Strait and evening light shows.",
        bestTime: "17:30 \u2013 20:30",
        lat: 1.2838,
        lng: 103.8591,
        estimatedEntryInr: 1800,
        crowdLevel: "Popular"
      },
      {
        name: "Chinatown & Buddha Tooth Relic Temple",
        type: "Attraction",
        description: "Tang-style religious monument housing sacred relics, surrounded by lively heritage shop-houses and Michelin hawker stalls.",
        bestTime: "09:00 \u2013 12:00",
        lat: 1.2814,
        lng: 103.8443,
        estimatedEntryInr: 0,
        crowdLevel: "Moderate"
      },
      {
        name: "Singapore Botanic Gardens & National Orchid Garden",
        type: "Attraction",
        description: "UNESCO World Heritage tropical gardens with over 60,000 orchids and tranquil swan lakes.",
        bestTime: "07:30 \u2013 10:30",
        lat: 1.3138,
        lng: 103.8159,
        estimatedEntryInr: 350,
        crowdLevel: "Quiet"
      }
    ]
  },
  sydney: {
    name: "Sydney",
    country: "Australia",
    region: "Oceania",
    tagline: "Iconic sailhouse architecture, golden surf beaches, and coastal cliff trails.",
    description: "Gaze at the architectural genius of the Sydney Opera House, walk across the Sydney Harbour Bridge, surf at Bondi Beach, and explore the sandstone colonial lanes of The Rocks.",
    mediaKey: "bali",
    currencyCode: "AUD",
    currencySymbol: "A$",
    languageName: "English",
    bestSeason: "September \u2013 November & March \u2013 May",
    recommendedDays: 5,
    dailyBudgetInr: { budget: 7500, balanced: 14800, luxury: 31e3 },
    coordinates: { lat: -33.8688, lng: 151.2093 },
    tags: ["Beaches", "Culture", "Nature", "Cafes"],
    airport: { name: "Sydney Kingsford Smith Airport (SYD)", lat: -33.9399, lng: 151.1753 },
    places: [
      {
        name: "Sydney Opera House & Circular Quay Promenade",
        type: "Attraction",
        description: "World-famous shell-tiled architectural icon jutting into the glistening harbor, with harborfront open-air bars.",
        bestTime: "09:00 \u2013 12:00",
        lat: -33.8568,
        lng: 151.2153,
        estimatedEntryInr: 2400,
        crowdLevel: "Popular"
      },
      {
        name: "Sydney Harbour Bridge Pylon Lookout & Walkway",
        type: "Attraction",
        description: 'Walk across the iconic "Coathanger" arch bridge with panoramic vistas over the harbor, ferries, and skyline.',
        bestTime: "10:00 \u2013 13:00",
        lat: -33.8523,
        lng: 151.2108,
        estimatedEntryInr: 0,
        crowdLevel: "Popular"
      },
      {
        name: "Bondi to Coogee Coastal Cliff Boardwalk",
        type: "Attraction",
        description: "6-kilometer clifftop walk passing turquoise ocean waves, dramatic sandstone sculptures, and ocean rockpools.",
        bestTime: "07:30 \u2013 10:30",
        lat: -33.8915,
        lng: 151.2767,
        estimatedEntryInr: 0,
        crowdLevel: "Popular"
      },
      {
        name: "The Rocks Historic Precinct & Campbells Cove",
        type: "Attraction",
        description: "Sandstone colonial passageways with harbour bridge views, weekend artisan markets, and historic pubs.",
        bestTime: "14:00 \u2013 17:30",
        lat: -33.859,
        lng: 151.209,
        estimatedEntryInr: 0,
        crowdLevel: "Moderate"
      }
    ]
  },
  goa: {
    name: "Goa",
    country: "India",
    region: "South Asia",
    tagline: "Quiet coconut groves, Portuguese heritage villas, and tranquil southern coves.",
    description: "Experience South Goa\u2019s peaceful coastal rhythm: pastel Latin quarter villas in Fontainhas, calm swimming beaches in Palolem, and authentic Goan fish curry houses.",
    mediaKey: "bali",
    currencyCode: "INR",
    currencySymbol: "\u20B9",
    languageName: "Konkani & English",
    bestSeason: "November \u2013 March",
    recommendedDays: 4,
    dailyBudgetInr: { budget: 2800, balanced: 5500, luxury: 12500 },
    coordinates: { lat: 15.2993, lng: 74.124 },
    tags: ["Beaches", "Cafes", "Peaceful Places", "Nature"],
    airport: { name: "Dabolim Airport / Mopa Goa (GOI/GOX)", lat: 15.3808, lng: 73.8314 },
    places: [
      {
        name: "Fontainhas Heritage Latin Quarter",
        type: "Attraction",
        description: "Portuguese colonial architecture, colorful tiled facades, and quiet bakeries.",
        bestTime: "08:30 \u2013 11:00",
        lat: 15.4989,
        lng: 73.8315,
        estimatedEntryInr: 0,
        crowdLevel: "Quiet"
      }
    ]
  }
};
function normalizeString(val) {
  return val.trim().normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase();
}
function findKnownCity(query) {
  const norm = normalizeString(query);
  if (!norm) return void 0;
  for (const [key, city] of Object.entries(KNOWN_WORLD_CITIES)) {
    if (key === norm || normalizeString(city.name) === norm || norm.includes(normalizeString(city.name)) || norm.includes(key)) {
      return city;
    }
  }
  return void 0;
}
function synthesizeCustomDestination(query) {
  const raw = query.trim();
  const parts = raw.split(/[,–-]/).map((p) => p.trim()).filter(Boolean);
  const cityName = (parts[0] || "Worldwide").charAt(0).toUpperCase() + (parts[0] || "Worldwide").slice(1);
  const countryName = parts.length > 1 ? parts[parts.length - 1] : "Global";
  const slug = normalizeString(cityName).replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "") || "dest";
  let hash = 0;
  for (let i = 0; i < raw.length; i++) {
    hash = (hash << 5) - hash + raw.charCodeAt(i);
    hash |= 0;
  }
  const latOffset = (Math.abs(hash) % 500 - 250) / 100;
  const lngOffset = (Math.abs(hash >> 3) % 500 - 250) / 100;
  const baseLat = 45 + latOffset;
  const baseLng = 10 + lngOffset;
  const places = [
    {
      id: `${slug}-airport`,
      name: `${cityName} International Gateway`,
      type: "Airport",
      description: `Primary air gateway serving ${cityName} and the surrounding region.`,
      bestTime: "Arrival & Departure",
      lat: baseLat + 0.12,
      lng: baseLng - 0.15,
      estimatedEntryInr: 0,
      crowdLevel: "Moderate"
    },
    {
      id: `${slug}-old-quarter`,
      name: `${cityName} Historic Old Quarter & Heritage Square`,
      type: "Attraction",
      description: `Atmospheric pedestrian streets, artisan workshops, and centuries of architecture in ${cityName}.`,
      bestTime: "09:00 \u2013 12:00",
      lat: baseLat,
      lng: baseLng,
      estimatedEntryInr: 0,
      crowdLevel: "Quiet"
    },
    {
      id: `${slug}-scenic-promenade`,
      name: `${cityName} Scenic Riverside & Panoramic Promenade`,
      type: "Attraction",
      description: `Peaceful waterfront pathway with iconic vista viewpoints and coffee kiosks.`,
      bestTime: "15:30 \u2013 18:30",
      lat: baseLat + 0.015,
      lng: baseLng + 0.02,
      estimatedEntryInr: 0,
      crowdLevel: "Quiet"
    },
    {
      id: `${slug}-artisan-market`,
      name: `${cityName} Local Artisan Food Market`,
      type: "Cafe & Food",
      description: `Vibrant regional produce, bakeries, specialty roasters, and culinary stalls.`,
      bestTime: "11:30 \u2013 14:00",
      lat: baseLat - 0.01,
      lng: baseLng + 0.012,
      estimatedEntryInr: 600,
      crowdLevel: "Moderate"
    },
    {
      id: `${slug}-gardens`,
      name: `${cityName} Botanical Gardens & Quiet Courtyards`,
      type: "Attraction",
      description: `Tranquil green sanctuary with shaded benches, fountains, and native flora.`,
      bestTime: "08:00 \u2013 10:30",
      lat: baseLat - 0.02,
      lng: baseLng - 0.015,
      estimatedEntryInr: 250,
      crowdLevel: "Quiet"
    },
    {
      id: `${slug}-sunset-view`,
      name: `${cityName} Hilltop Sunset Lookout & Dining Quarter`,
      type: "Hidden Gem",
      description: `Quiet evening gathering spot offering panoramic sunset vistas over the city skyline.`,
      bestTime: "17:30 \u2013 20:30",
      lat: baseLat + 0.035,
      lng: baseLng - 0.025,
      estimatedEntryInr: 0,
      crowdLevel: "Quiet"
    }
  ];
  return {
    id: slug,
    slug,
    name: cityName,
    country: countryName,
    region: "Worldwide",
    tagline: `Historic squares, scenic viewpoints, and unhurried local culture in ${cityName}.`,
    description: `Discover ${cityName} beyond tourist crowds: tranquil morning neighborhood strolls, local artisan bakeries, scenic nature lookouts, and authentic regional hospitality.`,
    mediaKey: "boutique_villa",
    bestSeason: "Spring (April \u2013 June) & Autumn (September \u2013 November)",
    recommendedDays: 5,
    dailyBudgetInr: { budget: 5500, balanced: 10500, luxury: 22e3 },
    currencyCode: "USD",
    currencySymbol: "$",
    languageName: "Local Regional Language & English",
    localTransportSummary: `Local city metro, regional rail links, metered rideshares, and scenic walking trails.`,
    culturalTips: [
      `Greet shopkeepers and caf\xE9 hosts politely before ordering.`,
      `Carry local currency notes for smaller neighborhood markets and transit booths.`,
      `Respect quiet morning hours in residential and heritage quarters.`
    ],
    safetyNotes: [
      `Keep personal belongings secure in central transit hubs.`,
      `Verify licensed taxi fares or use verified ride-hailing apps from transit stations.`
    ],
    weatherSummary: {
      tempRangeC: "14\xB0C \u2013 25\xB0C",
      condition: "Pleasant temperate days with gentle seasonal breezes",
      humidity: "60%",
      advisory: "Verify 5-day live forecast before departure."
    },
    coordinates: { lat: baseLat, lng: baseLng },
    tags: ["Culture", "Cafes", "Peaceful Places", "Historic"],
    places,
    phrases: [
      { english: "Hello / Good morning", local: "Hello", pronunciation: "hel-loh", context: "Greeting" },
      { english: "Thank you very much", local: "Thank you", pronunciation: "thangk yoo", context: "Greeting" },
      { english: "Where is the station?", local: "Where is the station?", pronunciation: "stay-shun", context: "Transit" }
    ]
  };
}
function resolveOrSynthesizeDestination(query) {
  const clean = query.trim();
  if (!clean) return DESTINATIONS[0];
  const norm = normalizeString(clean);
  const catalogMatch = DESTINATIONS.find(
    (d) => normalizeString(d.id) === norm || normalizeString(d.slug) === norm || normalizeString(d.name) === norm || norm.includes(normalizeString(d.name))
  );
  if (catalogMatch) return catalogMatch;
  const known = findKnownCity(clean);
  if (known) {
    const slug = normalizeString(known.name).replace(/[^a-z0-9]+/g, "-");
    const allPlaces = [
      {
        id: `${slug}-airport`,
        name: known.airport.name,
        type: "Airport",
        description: `Primary gateway into ${known.name}.`,
        bestTime: "Arrival & Departure",
        lat: known.airport.lat,
        lng: known.airport.lng,
        estimatedEntryInr: 0,
        crowdLevel: "Moderate"
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
        crowdLevel: p.crowdLevel
      }))
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
        `Keep digital payment cards or small cash ready for transit.`
      ],
      safetyNotes: [
        `Watch personal items in busy transit terminals.`,
        `Use official marked taxis or rideshare apps.`
      ],
      weatherSummary: {
        tempRangeC: "12\xB0C \u2013 23\xB0C",
        condition: "Temperate with pleasant seasonal breezes",
        humidity: "65%",
        advisory: "Check 5-day live forecast before departure."
      },
      coordinates: known.coordinates,
      tags: known.tags,
      places: allPlaces,
      phrases: [
        { english: "Hello", local: "Hello", pronunciation: "hel-loh", context: "Greeting" },
        { english: "Thank you", local: "Thank you", pronunciation: "thangk yoo", context: "Greeting" },
        { english: "Where is the station?", local: "Station", pronunciation: "stay-shun", context: "Transit" }
      ]
    };
  }
  return synthesizeCustomDestination(clean);
}
function synthesizeHotelsForDestination(dest) {
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
      tier: "boutique",
      roomTypes: ["Courtyard Deluxe Room", "Historic Balcony Suite"],
      distanceToCenterKm: 1.1,
      amenities: ["Artisan organic breakfast", "Courtyard terrace", "Espresso bar", "Curated walking maps"],
      cancellationPolicy: "Free cancellation up to 48 hours prior",
      provider: "Unseen Stays Catalog",
      availabilityStatus: "Simulated Demo Inventory",
      provenance: "demo_adapter",
      lat: dest.coordinates.lat + 5e-3,
      lng: dest.coordinates.lng - 4e-3,
      mediaKey: "boutique_villa",
      recommendationReason: `Quiet residential location within 10 minutes walk of ${dest.places[1]?.name || dest.name + " center"}.`,
      matchScore: 96
    },
    {
      id: `ht-${dest.id}-quiet-residence`,
      name: `${dest.name} Leafy Garden Residence`,
      destinationId: dest.id,
      area: `${dest.name} Residential Garden Quarter`,
      rating: 4.7,
      reviewCount: 192,
      pricePerNightInr: Math.max(3200, Math.round(basePrice * 0.9)),
      tier: "boutique",
      roomTypes: ["Garden King Room", "Quiet Studio with Balcony"],
      distanceToCenterKm: 2.3,
      amenities: ["Private courtyard garden", "Bicycle loan", "Quiet reading library", "Breakfast included"],
      cancellationPolicy: "Free cancellation up to 72 hours prior",
      provider: "Unseen Stays Catalog",
      availabilityStatus: "Simulated Demo Inventory",
      provenance: "demo_adapter",
      lat: dest.coordinates.lat - 8e-3,
      lng: dest.coordinates.lng + 6e-3,
      mediaKey: "boutique_villa",
      recommendationReason: `Peaceful neighborhood away from tourist bustle, surrounded by local bakeries.`,
      matchScore: 93
    },
    {
      id: `ht-${dest.id}-budget-lodge`,
      name: `The ${dest.name} Central Express Lodge`,
      destinationId: dest.id,
      area: `${dest.name} Transit & Station Quarter`,
      rating: 4.4,
      reviewCount: 380,
      pricePerNightInr: Math.max(2200, Math.round(dest.dailyBudgetInr.budget * 0.8)),
      tier: "budget",
      roomTypes: ["Standard Double", "Compact City Pod"],
      distanceToCenterKm: 1.8,
      amenities: ["Direct airport transit connection", "24h self check-in", "Shared kitchen", "Luggage storage"],
      cancellationPolicy: "Free cancellation up to 24 hours prior",
      provider: "Unseen Stays Catalog",
      availabilityStatus: "Simulated Demo Inventory",
      provenance: "demo_adapter",
      lat: dest.coordinates.lat + 0.012,
      lng: dest.coordinates.lng + 0.015,
      mediaKey: "boutique_villa",
      recommendationReason: `High-value budget stay offering swift transit access across the city.`,
      matchScore: 88
    },
    {
      id: `ht-${dest.id}-luxury-haven`,
      name: `${dest.name} Horizon Luxury Sanctuary`,
      destinationId: dest.id,
      area: `${dest.name} Panoramic Skyline Promenade`,
      rating: 4.9,
      reviewCount: 154,
      pricePerNightInr: Math.max(8500, Math.round(dest.dailyBudgetInr.luxury * 0.85)),
      tier: "luxury",
      roomTypes: ["Panoramic River Suite", "Penthouse Terrace with Soaking Tub"],
      distanceToCenterKm: 0.8,
      amenities: ["Fine dining restaurant", "Spa & wellness center", "Chauffeur booking desk", "Concierge tour service"],
      cancellationPolicy: "Free cancellation up to 7 days prior",
      provider: "Unseen Stays Catalog",
      availabilityStatus: "Simulated Demo Inventory",
      provenance: "demo_adapter",
      lat: dest.coordinates.lat - 3e-3,
      lng: dest.coordinates.lng - 2e-3,
      mediaKey: "boutique_villa",
      recommendationReason: `Unrivaled luxury haven with panoramic vistas and private bespoke concierge service.`,
      matchScore: 98
    }
  ];
}

// src/lib/seasonalIntelligence.ts
function resolveSeason(input, lat = 35) {
  const clean = (input || "").toLowerCase();
  let northernSeason = "Spring";
  if (/\b(december|january|february|winter|snow|festive|christmas|cold|northern lights|aurora|auroral|borealis)\b/i.test(clean)) {
    northernSeason = "Winter";
  } else if (/\b(march|april|may|spring|sakura|blossom|bloom)\b/i.test(clean)) {
    northernSeason = "Spring";
  } else if (/\b(june|july|august|summer|beach|monsoon|sun)\b/i.test(clean)) {
    northernSeason = "Summer";
  } else if (/\b(september|october|november|autumn|fall|foliage|koyo|leaves)\b/i.test(clean)) {
    northernSeason = "Autumn";
  } else {
    const month = (/* @__PURE__ */ new Date()).getMonth();
    if (month >= 2 && month <= 4) northernSeason = "Spring";
    else if (month >= 5 && month <= 7) northernSeason = "Summer";
    else if (month >= 8 && month <= 10) northernSeason = "Autumn";
    else northernSeason = "Winter";
  }
  if (lat < -5) {
    switch (northernSeason) {
      case "Winter":
        return "Summer";
      case "Summer":
        return "Winter";
      case "Spring":
        return "Autumn";
      case "Autumn":
        return "Spring";
    }
  }
  return northernSeason;
}
function getSeasonalProfile(destinationName, season) {
  const destLower = destinationName.toLowerCase();
  if (destLower.includes("japan") || destLower.includes("tokyo") || destLower.includes("kyoto") || destLower.includes("osaka")) {
    switch (season) {
      case "Spring":
        return {
          season: "Spring",
          label: "Cherry Blossom & Sakura Bloom Season",
          weatherOverview: "Crisp pleasant days (12\xB0C \u2013 20\xB0C) with pale pink canopies across parks and shrine canals.",
          tempRange: "12\xB0C \u2013 20\xB0C",
          seasonalHighlights: [
            "Hanami picnics under blooming cherry blossoms in Shinjuku Gyoen and Ueno Park",
            "Evening light-ups at Meguro River and Chidorigafuchi Moat",
            "Spring tea ceremonies with seasonal sakura matcha mochi in Kyoto"
          ],
          signatureFoods: ["Sakura Mochi", "Takenoko (Fresh Bamboo Shoot rice)", "Tai (Spring Sea Bream)", "Matcha Soft Cream"],
          packingAdvice: ["Light layers with a comfortable denim or trench coat", "Comfortable slip-on walking shoes for temple visits", "Small umbrella for gentle spring showers"],
          culturalAdvisory: "Peak season for domestic and international travel; reserve Shinkansen seats and popular restaurants 3\u20134 weeks in advance.",
          suggestedActivity: {
            title: "Early Morning Sakura Stroll & Hanami Walk",
            description: "Wander beneath ancient cherry blossom boughs before midday crowds gather, with fresh morning matcha.",
            category: "nature",
            timeOfDay: "Morning"
          }
        };
      case "Autumn":
        return {
          season: "Autumn",
          label: "Momiji & Fiery Autumn Foliage Season",
          weatherOverview: "Clear, crisp blue skies with stunning scarlet maple and golden ginkgo canopies (13\xB0C \u2013 21\xB0C).",
          tempRange: "13\xB0C \u2013 21\xB0C",
          seasonalHighlights: [
            "Night illuminations of fiery maple trees at Kiyomizu-dera and Eikando in Kyoto",
            "Golden ginkgo tree avenues along Meiji Jingu Gaien in Tokyo",
            "Crisp clear vistas of snow-capped Mount Fuji from Lake Kawaguchiko"
          ],
          signatureFoods: ["Roasted Kuri (Sweet Chestnuts)", "Matsutake Mushroom Broth", "Sanma (Pacific Saury)", "Warm Sweet Potato (Yaki-imo)"],
          packingAdvice: ["Merino wool sweaters or light jackets for breezy evenings", "Warm scarf for scenic dusk walks", "Comfortable footwear for stone stairways"],
          culturalAdvisory: "Autumn foliage moves from north to south; November is prime time for Tokyo, Kyoto, and central Honshu.",
          suggestedActivity: {
            title: "Temple Maple Garden & Golden Ginkgo Promenade",
            description: "Marvel at vibrant autumn colors reflecting across serene koi ponds and historic temple moss gardens.",
            category: "nature",
            timeOfDay: "Morning"
          }
        };
      case "Winter":
        return {
          season: "Winter",
          label: "Winter Illuminations & Serene Onsen Season",
          weatherOverview: "Crisp sunny days with chilly evenings (3\xB0C \u2013 11\xB0C), snow-capped peaks, and sparkling holiday lights.",
          tempRange: "3\xB0C \u2013 11\xB0C",
          seasonalHighlights: [
            "Rejuvenating natural hot spring (onsen) baths in Hakone or Arashiyama with Mt. Fuji views",
            "Spectacular winter illuminations across Roppongi Hills, Shibuya Blue Cave, and Marunouchi",
            "Peaceful, uncrowded mornings at Senso-ji and Fushimi Inari with crisp mountain air"
          ],
          signatureFoods: ["Steaming Tonkotsu Ramen", "Nabe Hot Pots & Sukiyaki", "Fresh Winter Oysters", "Warm Sake & Oden"],
          packingAdvice: ["Warm thermal base layer (Uniqlo Heattech)", "Insulated winter down coat or overcoat", "Gloves, knit beanie, and lip balm"],
          culturalAdvisory: "Winter offers the clearest views of Mount Fuji and significantly smaller tourist crowds at major cultural shrines.",
          suggestedActivity: {
            title: "Traditional Thermal Onsen Soak & Winter Illuminations",
            description: "Warm up in mineral-rich hot spring waters followed by an evening stroll through mesmerizing urban light displays.",
            category: "culture",
            timeOfDay: "Evening"
          }
        };
      case "Summer":
        return {
          season: "Summer",
          label: "Matsuri Festivals & Vibrant Fireworks Season",
          weatherOverview: "Warm, lush, and humid (24\xB0C \u2013 32\xB0C) with vibrant street festivals, river breezes, and lantern nights.",
          tempRange: "24\xB0C \u2013 32\xB0C",
          seasonalHighlights: [
            "Traditional Yukata street festivals (Matsuri) with taiko drumming and food stalls",
            "Kyoto Kamogawa riverside dining platforms (Kawadoko) cooled by evening waters",
            "Scenic morning climbs and cool bamboo forest breezes in Arashiyama"
          ],
          signatureFoods: ["Kakigori (Fluffy Shaved Ice)", "Chilled Zaru Soba", "Yakitori & Cold Asahi", "Hiyashi Chuka (Cold Ramen)"],
          packingAdvice: ["Lightweight breathable cotton or linen clothing", "UV protection umbrella or sun hat", "Handheld portable fan and electrolyte hydration"],
          culturalAdvisory: "Schedule temple walks for 07:00\u201310:00 to avoid midday humidity; spend early afternoons in air-conditioned art museums.",
          suggestedActivity: {
            title: "Riverside Kawadoko Dining & Lantern Festival Walk",
            description: "Dine on elevated wooden platforms above cooling river waters while listening to cicadas and temple bells.",
            category: "food",
            timeOfDay: "Evening"
          }
        };
    }
  }
  if (destLower.includes("london") || destLower.includes("paris") || destLower.includes("italy") || destLower.includes("rome") || destLower.includes("france") || destLower.includes("switzerland") || destLower.includes("amsterdam")) {
    switch (season) {
      case "Winter":
        return {
          season: "Winter",
          label: "Festive Holiday Lights & Historic Hearth Season",
          weatherOverview: "Brisk, atmospheric days (2\xB0C \u2013 9\xB0C) with glowing Christmas markets, ice rinks, and cozy fireside bistros.",
          tempRange: "2\xB0C \u2013 9\xB0C",
          seasonalHighlights: [
            "Festive holiday lights along Regent Street, Covent Garden, and Champs-\xC9lys\xE9es",
            "Open-air ice skating at Somerset House or festive European city squares",
            "World-class art galleries, museums, and theater shows without peak summer queues"
          ],
          signatureFoods: ["Hot Spiced Mulled Wine / Vin Chaud", "Traditional Sunday Roast or Beef Bourguignon", "Swiss Cheese Fondue & Raclette", "Warm Sticky Toffee Pudding"],
          packingAdvice: ["Heavy wool coat or insulated parka", "Warm cashmere scarf, leather gloves, and waterproof boots", "Compact travel umbrella"],
          culturalAdvisory: "Sun sets early around 16:00\u201316:30, making afternoons perfect for illuminated walking tours and warm pub hearths.",
          suggestedActivity: {
            title: "Festive City Lights & Cozy Fireside Tavern Evening",
            description: "Stroll past world-famous illuminated facades followed by artisanal hot chocolate or spiced cider in a historic tavern.",
            category: "culture",
            timeOfDay: "Evening"
          }
        };
      case "Spring":
        return {
          season: "Spring",
          label: "Royal Park Blooms & Sidewalk Caf\xE9 Season",
          weatherOverview: "Pleasant fresh breezes (11\xB0C \u2013 19\xB0C) with daffodil lawns, magnolia trees, and open-air caf\xE9 terraces.",
          tempRange: "11\xB0C \u2013 19\xB0C",
          seasonalHighlights: [
            "Magnolias and wisteria draped across residential mews in Kensington and Le Marais",
            "Picnics on the manicured lawns of Jardin du Luxembourg or Hampstead Heath",
            "Pleasant sightseeing temperatures for exploring monuments on foot"
          ],
          signatureFoods: ["Fresh Butter Croissants & Caf\xE9 au Lait", "Spring Asparagus Risotto", "Artisanal Gelato", "Afternoon Clotted Cream Tea"],
          packingAdvice: ["Layerable trench coat or casual blazer", "Comfortable leather walking shoes", "Light scarf for breezy morning strolls"],
          culturalAdvisory: "April and May offer optimal conditions: long daylight hours, vibrant blossoms, and moderate crowds.",
          suggestedActivity: {
            title: "Royal Garden Magnolia Stroll & Artisan Caf\xE9 Terrace",
            description: "Enjoy morning pastries at a sidewalk bistro before exploring botanical paths in bloom.",
            category: "nature",
            timeOfDay: "Morning"
          }
        };
      case "Summer":
        return {
          season: "Summer",
          label: "Golden Hour Sunsets & Riverfront Promenade Season",
          weatherOverview: "Sun-drenched days (18\xB0C \u2013 28\xB0C) with daylight extending past 21:00 and vibrant outdoor terraces.",
          tempRange: "18\xB0C \u2013 28\xB0C",
          seasonalHighlights: [
            "Sunset cruises along the Thames, Seine, or Mediterranean Amalfi coast",
            "Lively open-air cinema, rooftop cocktail terraces, and food markets",
            "Swimming in crystal clear coastal coves or scenic alpine lakes"
          ],
          signatureFoods: ["Chilled Crisp Ros\xE9 Wine", "Fresh Seafood Ceviche & Grilled Fish", "Caprese Salad with Buffalo Mozzarella", "Artisanal Gelato"],
          packingAdvice: ["Lightweight linen shirts and dresses", "Polarized sunglasses and broad-spectrum sunscreen", "Comfortable sandals and walking trainers"],
          culturalAdvisory: "Book tickets for top landmarks (Eiffel Tower, Colosseum, Tower of London) at least 3 weeks ahead.",
          suggestedActivity: {
            title: "Sunset Riverboat Promenade & Alfresco Terrace Dining",
            description: "Glide along historic waterways at golden hour as monuments light up against twilight skies.",
            category: "sightseeing",
            timeOfDay: "Evening"
          }
        };
      case "Autumn":
        return {
          season: "Autumn",
          label: "Golden Parks, Grape Harvest & Cultural Season",
          weatherOverview: "Crisp romantic days (10\xB0C \u2013 17\xB0C) with golden amber leaves carpeting historic cobblestones.",
          tempRange: "10\xB0C \u2013 17\xB0C",
          seasonalHighlights: [
            "Golden tree avenues in Richmond Park, Central Rome villas, and Tuileries Gardens",
            "New wine harvest celebrations and seasonal truffle festivals",
            "Atmospheric, uncrowded exploration of historic squares and ancient ruins"
          ],
          signatureFoods: ["Wild Mushroom & Truffle Tagliatelle", "Roasted Chestnut Cones", "Cozy French Onion Soup", "Apple Crumble with Clotted Cream"],
          packingAdvice: ["Tailored wool coat or warm jacket", "Waterproof ankle boots", "Warm knitwear and versatile scarves"],
          culturalAdvisory: "September and October feature pleasant weather with far fewer crowds than July and August.",
          suggestedActivity: {
            title: "Golden Parkland Stroll & Truffle Culinary Tasting",
            description: "Walk through rustling golden leaves before settling into an intimate wine bar for autumn tasting plates.",
            category: "food",
            timeOfDay: "Afternoon"
          }
        };
    }
  }
  if (destLower.includes("bali") || destLower.includes("thailand") || destLower.includes("phuket")) {
    const isDry = season === "Summer" || season === "Spring";
    return {
      season: isDry ? "Spring" : "Winter",
      label: isDry ? "Dry Sunny Season & Calmer Waters" : "Tropical Green Season & Warm Breezes",
      weatherOverview: isDry ? "Sunny skies with gentle sea breezes (24\xB0C \u2013 30\xB0C) and crystal-clear swimming waters." : "Warm tropical climate (25\xB0C \u2013 31\xB0C) with emerald-green rice terraces and afternoon rain showers.",
      tempRange: "25\xB0C \u2013 31\xB0C",
      seasonalHighlights: [
        "Sunrise volcano treks to Mount Batur with clear panoramic island views",
        "Sunset Kecak fire dance overlooking the dramatic ocean cliffs of Uluwatu",
        "Emerald green rice terraces in Tegallalang at their most lush and photographic"
      ],
      signatureFoods: ["Nasi Campur Bali", "Fresh Coconuts & Dragonfruit Smoothie Bowls", "Babi Guling & Sate Lilit", "Iced Palm Sugar Kopi"],
      packingAdvice: ["Breathable linen attire and swimwear", "Waterproof pouch and light rain poncho", "Eco-friendly reef-safe sunscreen"],
      culturalAdvisory: "Carry a sarong for temple visits; during rainy season, mornings are sunny while showers typically happen in late afternoon.",
      suggestedActivity: {
        title: "Dawn Rice Terrace Walk & Sacred Cliffside Sunset",
        description: "Explore misty green terraces in early morning tranquility followed by sunset prayers overlooking crashing waves.",
        category: "nature",
        timeOfDay: "Morning"
      }
    };
  }
  if (destLower.includes("alaska") || destLower.includes("fairbanks") || destLower.includes("anchorage") || destLower.includes("northern lights") || destLower.includes("aurora")) {
    const isSummer = season === "Summer";
    if (isSummer) {
      return {
        season: "Summer",
        label: "Midnight Sun & Coastal Fjords Wilderness Season",
        weatherOverview: "Mild endless daylight (13\xB0C \u2013 23\xB0C) with 20+ hours of sun for glacier cruising, alpine hiking, and wildlife viewing.",
        tempRange: "13\xB0C \u2013 23\xB0C",
        seasonalHighlights: [
          "Catamaran glacier cruises through Kenai Fjords past breaching humpback whales and calving ice walls",
          "Wildlife safaris in Denali National Park spotting wild grizzly bears, moose, and caribou",
          "Midnight Sun strolls along the Anchorage coastal trail with 22:00 sunset golden hour"
        ],
        signatureFoods: ["Wild Copper River King Salmon", "Fresh Alaskan King Crab Legs", "Smoked Halibut Chowder", "Wild Blueberry Sourdough Pancakes"],
        packingAdvice: ["Layerable fleece and waterproof rain shell", "Insect repellent and headnet for tundra trails", "Eye mask for sleeping under the midnight sun"],
        culturalAdvisory: "Peak season for national park shuttles and marine cruises; reserve boat trips and Denali bus passes well in advance.",
        suggestedActivity: {
          title: "Kenai Fjords Wildlife & Tidewater Glacier Cruise",
          description: "Sail through protected glacial waterways past seabird rookeries and thunderous calving ice.",
          category: "nature",
          timeOfDay: "Morning"
        }
      };
    }
    return {
      season: "Winter",
      label: "Aurora Borealis & Arctic Wilderness Season",
      weatherOverview: "Crisp, sub-zero arctic air (-18\xB0C to -4\xB0C) under crystal-clear dark skies perfectly positioned under the auroral oval.",
      tempRange: "-18\xB0C \u2013 -2\xB0C (Fairbanks / Interior)",
      seasonalHighlights: [
        "Vivid emerald, violet, and ruby Aurora Borealis ribbons dancing across the dark night sky in Fairbanks",
        "Soaking in 40\xB0C mineral-rich natural geothermal waters surrounded by snow at Chena Hot Springs",
        "Dog sledding (mushing) through snow-draped boreal forests and over frozen river trails",
        "Scenic winter journey on the Alaska Railroad Aurora Winter Train through dramatic snowy passes"
      ],
      signatureFoods: ["Steaming Halibut Chowder in Sourdough Bread Bowls", "Reindeer Sausage Breakfast Hash", "Wild Smoked Salmon Chowder", "Warm Berry Cobbler with Vanilla Cream"],
      packingAdvice: ["Heavy thermal Merino base layers (top & bottom)", "Insulated sub-zero winter parka (-20\xB0C rated)", "Arctic winter snow boots (Sorel/Baffin)", "Chemical hand & toe warmers, balaclava, and windproof mittens"],
      culturalAdvisory: "Prime aurora viewing window is 22:00\u201303:00 on clear dark nights; Fairbanks has over an 80% success rate across 3+ night stays.",
      suggestedActivity: {
        title: "Midnight Aurora Borealis Watch & Chena Geothermal Soak",
        description: "Soak in natural steaming mineral rock pools while watching brilliant celestial aurora displays overhead.",
        category: "nature",
        timeOfDay: "Evening"
      }
    };
  }
  return {
    season,
    label: `${season} Seasonal Journey`,
    weatherOverview: `Comfortable seasonal conditions tailored for walking, sightseeing, and dining.`,
    tempRange: "14\xB0C \u2013 24\xB0C",
    seasonalHighlights: [
      `Iconic landmark discovery during optimal seasonal daylight`,
      `Local seasonal cuisine and farm-to-table culinary tastings`,
      `Scenic walking routes through historic quarters and panoramic viewpoints`
    ],
    signatureFoods: ["Regional farm-to-table dishes", "Artisanal local roaster coffee", "Seasonal pastries and desserts"],
    packingAdvice: ["Versatile seasonal layers", "Comfortable broken-in walking shoes", "Weather-appropriate outer layer"],
    culturalAdvisory: "Check 5-day local weather forecasts before departure to optimize morning and afternoon outdoor timings.",
    suggestedActivity: {
      title: `${season} Landmark & Cultural Stroll`,
      description: `Discover premier historic sites during the most comfortable daylight hours with local caf\xE9 stops.`,
      category: "sightseeing",
      timeOfDay: "Morning"
    }
  };
}

// src/types/travel.ts
import { z } from "zod";
var ActivitySchema = z.object({
  id: z.string(),
  timeOfDay: z.enum(["Morning", "Afternoon", "Late Afternoon", "Evening"]),
  title: z.string(),
  description: z.string(),
  location: z.string(),
  lat: z.number(),
  lng: z.number(),
  estimatedCost: z.number().nonnegative(),
  durationHours: z.number().positive(),
  category: z.enum(["sightseeing", "food", "culture", "nature", "wellness", "adventure", "transit"]),
  crowdLevel: z.enum(["Quiet", "Moderate", "Popular"]).default("Moderate")
});
var HotelOptionSchema = z.object({
  id: z.string(),
  name: z.string(),
  destinationId: z.string(),
  area: z.string(),
  rating: z.number().min(1).max(5),
  reviewCount: z.number().int().nonnegative(),
  pricePerNightInr: z.number().positive(),
  tier: z.enum(["budget", "boutique", "luxury"]),
  roomTypes: z.array(z.string()),
  distanceToCenterKm: z.number().nonnegative(),
  amenities: z.array(z.string()),
  cancellationPolicy: z.string(),
  provider: z.string(),
  availabilityStatus: z.string(),
  provenance: z.enum(["verified_live", "cached_research", "indicative_estimate", "demo_adapter"]),
  lat: z.number(),
  lng: z.number(),
  mediaKey: z.string(),
  recommendationReason: z.string().optional(),
  matchScore: z.number().optional()
});
var TransportLegSchema = z.object({
  id: z.string(),
  mode: z.enum(["Flight", "Airport Transfer", "Cab", "Train", "Bus", "Rental Car", "Walking"]),
  route: z.string(),
  durationMinutes: z.number().positive(),
  distanceKm: z.number().nonnegative(),
  estimatedFareInr: z.number().nonnegative(),
  provider: z.string(),
  availabilityStatus: z.string(),
  provenance: z.enum(["verified_live", "cached_research", "indicative_estimate", "demo_adapter"]),
  bookingUrl: z.string()
});
var TripDaySchema = z.object({
  day: z.number().int().positive(),
  title: z.string(),
  summary: z.string(),
  activities: z.array(ActivitySchema),
  hotelName: z.string(),
  transport: z.array(TransportLegSchema),
  estimatedCost: z.number().nonnegative()
});
var BudgetBreakdownSchema = z.object({
  flights: z.number().nonnegative(),
  hotels: z.number().nonnegative(),
  localTransport: z.number().nonnegative(),
  food: z.number().nonnegative(),
  sightseeing: z.number().nonnegative(),
  shopping: z.number().nonnegative(),
  activities: z.number().nonnegative(),
  emergencyReserve: z.number().nonnegative()
});
var ItinerarySchema = z.object({
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
  pace: z.enum(["relaxed", "balanced", "active"]).default("balanced"),
  interests: z.array(z.string()),
  days: z.array(TripDaySchema),
  selectedHotel: HotelOptionSchema.optional(),
  recommendations: z.array(z.string()),
  travelTips: z.array(z.string()),
  budgetBreakdown: BudgetBreakdownSchema,
  provenanceNote: z.string(),
  createdAt: z.string(),
  updatedAt: z.string()
});

// src/lib/travelEngine.ts
function resolveCatalogDestination(query) {
  const lower = query.trim().normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase();
  if (!lower) return void 0;
  const direct = DESTINATIONS.find((d) => d.id === lower || d.name.toLowerCase() === lower || d.country.toLowerCase() === lower) || DESTINATIONS.find((d) => lower.includes(d.name.toLowerCase()) || lower.includes(d.country.toLowerCase()));
  if (direct) return direct;
  const aliases = [
    [["pokhara", "kathmandu", "sarangkot", "everest", "annapurna"], "nepal"],
    [["kyoto", "uji", "osaka", "nara", "arashiyama", "hakone"], "japan"],
    [["amalfi", "ravello", "sorrento", "positano", "capri"], "italy"],
    [["zermatt", "lucerne", "interlaken", "zurich", "geneva", "grindelwald"], "switzerland"],
    [["ubud", "sanur", "uluwatu", "sidemen", "seminyak", "canggu", "nusa"], "bali"],
    [["leh", "pangong", "nubra", "ladakh", "khardung"], "ladakh"],
    [["munnar", "alleppey", "kochi", "kerala", "backwaters", "varkala", "thekkady"], "kerala"],
    [["santorini", "crete", "oia", "fira", "cyclades"], "greece"],
    [["cappadocia", "goreme", "uchisar"], "turkey"],
    [["reykjavik", "vik", "iceland", "akureyri", "golden circle"], "iceland"],
    [["marrakech", "atlas", "imlil", "morocco", "essaouira", "fes"], "morocco"],
    [["chiang mai", "krabi", "phuket", "ao nang"], "thailand"]
  ];
  for (const [terms, id] of aliases) {
    if (terms.some((t) => lower.includes(t))) {
      const found = DESTINATIONS.find((d) => d.id === id);
      if (found) return found;
    }
  }
  return void 0;
}
function cleanDestName(raw) {
  if (!raw) return "";
  const cleaned = raw.replace(/\b(?:northern lights|aurora|tour|trip|vacation|holiday|itinerary|journey|travel|explore|visit|planning|plan)\b/gi, "").replace(/[,\.?!]/g, "").trim();
  if (cleaned.length < 2) return "";
  return cleaned.split(/\s+/).map((w) => w.charAt(0).toUpperCase() + w.slice(1).toLowerCase()).join(" ");
}
function extractRequirementsFromText(input, defaults) {
  const text = input.trim();
  const lower = text.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase();
  const fromMatch = text.match(/\bfrom\s+([A-Za-z\x7f-\xff\s]{2,28}?)(?=\s+(?:to|for|in|with|on|,|\.)|$)/i);
  const origin = fromMatch?.[1]?.trim() || defaults?.origin || "Kolkata";
  const knownCity = findKnownCity(lower);
  const matchedDest = resolveCatalogDestination(lower);
  let rawDest = knownCity?.name || matchedDest?.name;
  if (!rawDest) {
    const fromToMatch = text.match(
      /\bfrom\s+[A-Za-z\x7f-\xff\s]{2,25}?\s+to\s+([A-Za-z\x7f-\xff\s]{2,28}?)(?=\s+(?:to\s+(?:see|view|watch|catch|experience|witness|visit|explore|hike|do)|for|with|in|on|from|like|around|during|budget|\d|,|\.|\?|!|$)|$)/i
    );
    if (fromToMatch?.[1]) {
      const d = cleanDestName(fromToMatch[1]);
      if (d) rawDest = d;
    }
  }
  if (!rawDest) {
    const actionMatch = text.match(
      /\b(?:want to go to|going to|head to|heading to|travel to|fly to|trip to|tour to|take me to|can we go to|plan(?:\s+a)?\s+trip\s+to|planning\s+(?:a\s+trip\s+)?(?:to|for)|visit|visiting|exploring|explore|vacation in|holiday in)\s+([A-Za-z\x7f-\xff\s]{2,28}?)(?=\s+(?:to\s+(?:see|view|watch|catch|experience|witness|visit|explore|hike|do)|for|with|in|on|from|like|around|during|budget|\d|,|\.|\?|!|$)|$)/i
    );
    if (actionMatch?.[1]) {
      const d = cleanDestName(actionMatch[1]);
      if (d) rawDest = d;
    }
  }
  if (!rawDest) {
    const toMatch = text.match(
      /(?<!\b(?:want|like|prefer|hope|wish|need|used)\s+)\bto\s+([A-Za-z\x7f-\xff\s]{2,28}?)(?=\s+(?:to\s+(?:see|view|watch|catch|experience|witness|visit|explore|hike|do)|for|with|in|on|from|like|around|during|budget|\d|,|\.|\?|!|$)|$)/i
    );
    if (toMatch?.[1]) {
      const d = cleanDestName(toMatch[1]);
      if (d) rawDest = d;
    }
  }
  if (!rawDest) {
    const leadMatch = text.match(
      /^([A-Za-z\x7f-\xff\s]{2,28}?)(?=\s+(?:for\s+\d|\d+\s*(?:days?|nights?|weeks?|months?)|trip|tour|holiday|vacation))/i
    );
    if (leadMatch?.[1]) {
      const d = cleanDestName(leadMatch[1]);
      if (d) rawDest = d;
    }
  }
  if (!rawDest) {
    const stripped = text.replace(/\b(?:plan|a|trip|itinerary|travel|vacation|holiday|days?|nights?|weeks?|months?|for|with|couple|solo|family|\d+)\b/gi, "").replace(/[,\.?!]/g, "").trim();
    if (stripped.length >= 2 && stripped.length <= 35) {
      const d = cleanDestName(stripped);
      if (d) rawDest = d;
    }
  }
  const destination = rawDest || defaults?.destination || "Alaska";
  let durationDays = defaults?.durationDays || 5;
  const durationMonthMatch = text.match(/(\d{1,2}|one|two|three)\s*(?:[-–]?\s*months?)/i);
  if (durationMonthMatch) {
    const wordMap = { one: 1, two: 2, three: 3 };
    const num = wordMap[durationMonthMatch[1].toLowerCase()] || Number(durationMonthMatch[1]);
    durationDays = Math.min(30, num * 30);
  } else {
    const weekMatch = text.match(/(\d{1,2}|one|two|three|a)\s*(?:[-–]?\s*weeks?)/i);
    if (weekMatch) {
      const wordMap = { a: 1, one: 1, two: 2, three: 3 };
      const num = wordMap[weekMatch[1].toLowerCase()] || Number(weekMatch[1]);
      durationDays = Math.min(30, num * 7);
    } else {
      const daysMatch = text.match(/(\d{1,2})\s*[-–]?\s*(?:days?|nights?)/i);
      if (daysMatch) {
        durationDays = Math.min(30, Math.max(1, Number(daysMatch[1])));
      }
    }
  }
  let travellers = defaults?.travellers || 2;
  const travNumMatch = text.match(/(\d{1,2})\s*(?:people|persons?|travellers?|travelers?|guests?|adults?)/i);
  if (travNumMatch) {
    travellers = Math.min(12, Math.max(1, Number(travNumMatch[1])));
  } else if (/\b(?:two|couple|2\s*person|2\s*people|me\s+and\s+my\s+(?:wife|husband|partner|friend))\b/i.test(lower)) {
    travellers = 2;
  } else if (/\bsolo\b|\balone\b|\b1\s*(?:person|traveller)\b/i.test(lower)) {
    travellers = 1;
  } else if (/\bfamily\b|\bfour\b/i.test(lower)) {
    travellers = 4;
  }
  let currency = defaults?.currency || "INR";
  if (/\$|usd|dollars?/i.test(lower)) currency = "USD";
  else if (/€|eur|euros?/i.test(lower)) currency = "EUR";
  else if (/₹|rs\.?|inr|rupees?/i.test(lower)) currency = "INR";
  let budget = defaults?.budget || 8e4;
  const lakhMatch = text.match(/([\d\.]+)\s*(?:lakhs?|lacs?|lac|l\b)/i);
  if (lakhMatch) {
    const parsed = parseFloat(lakhMatch[1]);
    if (!Number.isNaN(parsed) && parsed > 0) {
      budget = Math.round(parsed * 1e5);
    }
  } else {
    const crMatch = text.match(/([\d\.]+)\s*(?:crores?|cr\b)/i);
    if (crMatch) {
      const parsed = parseFloat(crMatch[1]);
      if (!Number.isNaN(parsed) && parsed > 0) {
        budget = Math.round(parsed * 1e7);
      }
    } else {
      const explicitBudgetMatch = text.match(
        /(?:budget(?:\s+is|\s+of)?|around|under|max|for)\s*(?:₹|\$|€|inr|usd|eur|rs\.?)?\s*([\d,]{2,9})(\s*k)?|(?:₹|\$|€)\s*([\d,]{2,9})(\s*k)?/i
      );
      if (explicitBudgetMatch) {
        const raw = (explicitBudgetMatch[1] || explicitBudgetMatch[3] || "").replace(/,/g, "");
        const hasK = Boolean(explicitBudgetMatch[2] || explicitBudgetMatch[4]);
        const parsed = Number(raw);
        if (!Number.isNaN(parsed) && parsed > 0) {
          budget = hasK ? parsed * 1e3 : parsed;
        }
      } else {
        const budgetMatch = text.match(/(?:₹|\$|€|inr|usd|eur|rs\.?)?\s*([\d,]{3,9})(?:\s*(?:k|thousand))?/i);
        if (budgetMatch) {
          const raw = Number(budgetMatch[1].replace(/,/g, ""));
          if (raw >= 500) {
            budget = /k\b/i.test(budgetMatch[0]) ? raw * 1e3 : raw;
          }
        }
      }
    }
  }
  const monthMatch = text.match(
    /\b(january|february|march|april|may|june|july|august|september|october|november|december)\b/i
  );
  const travelMonth = monthMatch ? monthMatch[1][0].toUpperCase() + monthMatch[1].slice(1).toLowerCase() : defaults?.travelMonth;
  const keywordInterests = [
    [/northern lights|aurora|auroral|borealis|stargazing/i, "Northern Lights"],
    [/beach|coast|sea|ocean|island/i, "Beaches"],
    [/cafe|coffee|bakery|food|dining|restaurant/i, "Cafes"],
    [/peaceful|quiet|calm|serene|relax|crowd/i, "Peaceful Places"],
    [/mountain|hike|trek|alpine|ridge/i, "Mountains"],
    [/glacier|ice|fjord|wildlife|polar|arctic/i, "Wilderness & Glaciers"],
    [/temple|culture|history|heritage|museum/i, "Culture"],
    [/adventure|surf|raft|climb|mushing|dog sled/i, "Adventure"],
    [/wellness|spa|yoga|hot spring|thermal/i, "Wellness & Hot Springs"]
  ];
  const interests = keywordInterests.filter(([rx]) => rx.test(lower)).map(([, label]) => label);
  const avoidCrowds = /no crowd|not crowded|quiet|peaceful|hidden|less crowded/i.test(lower) || Boolean(defaults?.avoidCrowds);
  const pace = /relax|slow|peaceful|chill/i.test(lower) ? "relaxed" : /pack|adventure|active|fast/i.test(lower) ? "active" : defaults?.pace || "balanced";
  const hotelTier = /cheap|budget|affordable|cheaper|save/i.test(lower) ? "budget" : /luxury|5 star|five star|villa|resort/i.test(lower) ? "luxury" : defaults?.hotelTier || "boutique";
  return {
    origin,
    destination,
    durationDays,
    travellers,
    budget,
    currency,
    interests: interests.length > 0 ? interests : defaults?.interests || ["Nature", "Cafes"],
    travelMonth,
    pace,
    hotelTier,
    avoidCrowds
  };
}
function convertCurrency(amount, from, to) {
  const fromInfo = INDICATIVE_CURRENCY_RATES_FROM_INR[from.toUpperCase()] || INDICATIVE_CURRENCY_RATES_FROM_INR.INR;
  const toInfo = INDICATIVE_CURRENCY_RATES_FROM_INR[to.toUpperCase()] || INDICATIVE_CURRENCY_RATES_FROM_INR.INR;
  const amountInInr = amount / fromInfo.rate;
  return Math.round(amountInInr * toInfo.rate * 100) / 100;
}
function calculateBudgetBreakdown(totalBudget, hotelCostTotal, flightCostTotal) {
  const safeTotal = Math.max(1e3, totalBudget);
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
    emergencyReserve
  };
}
function rankHotels(hotels, criteria) {
  let pool = hotels;
  if (criteria.destinationId) {
    const matching = hotels.filter((h) => h.destinationId === criteria.destinationId);
    if (matching.length > 0) {
      pool = matching;
    } else {
      const dest = resolveOrSynthesizeDestination(criteria.destinationId);
      pool = synthesizeHotelsForDestination(dest);
    }
  }
  return pool.map((hotel) => {
    let score = 50;
    const reasons = [];
    if (criteria.maxNightlyInr) {
      if (hotel.pricePerNightInr <= criteria.maxNightlyInr) {
        score += 22;
        reasons.push("fits comfortably within your nightly budget");
      } else {
        const overRatio = (hotel.pricePerNightInr - criteria.maxNightlyInr) / criteria.maxNightlyInr;
        score -= Math.min(25, Math.round(overRatio * 30));
      }
    }
    if (criteria.preferredTier && hotel.tier === criteria.preferredTier) {
      score += 14;
      reasons.push(`matches your ${criteria.preferredTier} stay style`);
    }
    if (hotel.distanceToCenterKm <= 2) {
      score += 10;
      reasons.push("offers easy access to nearby caf\xE9s and sightseeing");
    }
    if (hotel.rating >= 4.8) {
      score += 10;
      reasons.push("maintains consistently strong guest reviews");
    }
    if (criteria.avoidCrowds && hotel.area.toLowerCase().includes("quiet")) {
      score += 8;
      reasons.push("sits in a calmer neighborhood away from heavy crowds");
    }
    const reasonText = reasons.length > 0 ? `Recommended because it ${reasons.slice(0, 2).join(" and ")}.` : `Recommended for its ${hotel.rating.toFixed(1)} rating and proximity to ${hotel.area}.`;
    return {
      ...hotel,
      matchScore: Math.max(40, Math.min(99, score)),
      recommendationReason: reasonText
    };
  }).sort((a, b) => (b.matchScore || 0) - (a.matchScore || 0));
}
function buildDeterministicItinerary(req, tripId) {
  const dest = resolveOrSynthesizeDestination(req.destination);
  const budgetInInr = req.currency === "INR" ? req.budget : convertCurrency(req.budget, req.currency, "INR");
  const nightlyTargetInr = Math.max(2500, Math.round(budgetInInr * 0.32 / Math.max(1, req.durationDays - 1)));
  const rankedHotels = rankHotels(HOTELS, {
    destinationId: dest.id,
    maxNightlyInr: nightlyTargetInr,
    preferredTier: req.hotelTier,
    interests: req.interests,
    avoidCrowds: req.avoidCrowds
  });
  const selectedHotel = rankedHotels[0];
  const flights = getFlightsForRoute(req.origin, dest.name);
  const flightTotalInr = Math.min(
    Math.round(budgetInInr * 0.42),
    (flights[0]?.priceInr || 22e3) * Math.max(1, Math.min(req.travellers, 2))
  );
  const hotelTotalInr = (selectedHotel?.pricePerNightInr || 6e3) * Math.max(1, req.durationDays - 1);
  const breakdownInr = calculateBudgetBreakdown(budgetInInr, hotelTotalInr, flightTotalInr);
  const toTarget = (valInr) => req.currency === "INR" ? Math.round(valInr) : Math.round(convertCurrency(valInr, "INR", req.currency));
  const budgetBreakdown = {
    flights: toTarget(breakdownInr.flights),
    hotels: toTarget(breakdownInr.hotels),
    localTransport: toTarget(breakdownInr.localTransport),
    food: toTarget(breakdownInr.food),
    sightseeing: toTarget(breakdownInr.sightseeing),
    shopping: toTarget(breakdownInr.shopping),
    activities: toTarget(breakdownInr.activities),
    emergencyReserve: toTarget(breakdownInr.emergencyReserve)
  };
  const season = resolveSeason(req.travelMonth, dest.coordinates.lat);
  const seasonalProfile = getSeasonalProfile(dest.name, season);
  const placesPool = req.avoidCrowds ? [...dest.places].sort((a, b) => a.crowdLevel === "Quiet" ? -1 : b.crowdLevel === "Quiet" ? 1 : 0) : dest.places;
  const nonAirportPlaces = placesPool.filter((p) => p.type !== "Airport");
  const airport = dest.places.find((p) => p.type === "Airport") || dest.places[0];
  const transportCatalog = getTransportOptions(dest.id);
  const days = Array.from({ length: req.durationDays }, (_, idx) => {
    const dayNum = idx + 1;
    const basePlaceIdx = idx * 2;
    const p1 = nonAirportPlaces[basePlaceIdx % nonAirportPlaces.length] || airport;
    const p2 = nonAirportPlaces[(basePlaceIdx + 1) % nonAirportPlaces.length] || airport;
    const p3 = nonAirportPlaces[(basePlaceIdx + 2) % nonAirportPlaces.length] || airport;
    const seasonalFood = seasonalProfile.signatureFoods[idx % seasonalProfile.signatureFoods.length];
    if (dayNum === 1) {
      const day1Activities = [
        {
          id: "d1-a1",
          timeOfDay: "Morning",
          title: `Arrive at ${airport.name}`,
          description: `Smooth airport pickup and luggage drop at ${selectedHotel?.name || "your boutique stay"}.`,
          location: airport.name,
          lat: airport.lat,
          lng: airport.lng,
          estimatedCost: 0,
          durationHours: 2,
          category: "transit",
          crowdLevel: "Moderate"
        },
        {
          id: "d1-a2",
          timeOfDay: "Afternoon",
          title: `Iconic Stroll: ${p1.name}`,
          description: p1.description,
          location: p1.name,
          lat: p1.lat,
          lng: p1.lng,
          estimatedCost: toTarget(p1.estimatedEntryInr || 800),
          durationHours: 2.5,
          category: p1.type === "Cafe & Food" ? "food" : "sightseeing",
          crowdLevel: p1.crowdLevel
        },
        {
          id: "d1-a3",
          timeOfDay: "Evening",
          title: `Welcome Dinner: Savoring ${seasonalFood}`,
          description: `Relaxed regional dinner showcasing authentic ${dest.name} flavors, including seasonal ${seasonalFood}.`,
          location: selectedHotel?.area || dest.name,
          lat: selectedHotel?.lat || dest.coordinates.lat,
          lng: selectedHotel?.lng || dest.coordinates.lng,
          estimatedCost: toTarget(1800),
          durationHours: 2,
          category: "food",
          crowdLevel: "Quiet"
        }
      ];
      return {
        day: 1,
        title: `Arrival in ${dest.name} & Iconic Immersion`,
        summary: `Touch down from ${req.origin}, transfer to ${selectedHotel?.area || dest.name}, and enjoy an unhurried walk near ${p1.name}.`,
        hotelName: selectedHotel?.name || `${dest.name} Sanctuary`,
        transport: [transportCatalog[0]].filter(Boolean),
        estimatedCost: toTarget(2800 + (selectedHotel?.pricePerNightInr || 5e3)),
        activities: day1Activities
      };
    }
    if (dayNum === req.durationDays) {
      return {
        day: dayNum,
        title: `Morning Farewell Reflections & Departure to ${req.origin}`,
        summary: `Slow breakfast, quiet artisan market stop in ${selectedHotel?.area || dest.name}, and stress-free airport transfer.`,
        hotelName: "Departure Day",
        transport: [transportCatalog[0]].filter(Boolean),
        estimatedCost: toTarget(2200),
        activities: [
          {
            id: `d${dayNum}-a1`,
            timeOfDay: "Morning",
            title: `Artisan Souvenirs & Farewell Stroll near ${p1.name}`,
            description: `Pick up authentic handcrafted mementos and enjoy a slow morning coffee in ${selectedHotel?.area || dest.name} before checkout.`,
            location: p1.name,
            lat: p1.lat,
            lng: p1.lng,
            estimatedCost: toTarget(650),
            durationHours: 2,
            category: "wellness",
            crowdLevel: "Quiet"
          },
          {
            id: `d${dayNum}-a2`,
            timeOfDay: "Afternoon",
            title: `Airport Transfer to ${airport.name}`,
            description: `Recommended 3-hour buffer prior to your return flight to ${req.origin}.`,
            location: airport.name,
            lat: airport.lat,
            lng: airport.lng,
            estimatedCost: toTarget(1450),
            durationHours: 2.5,
            category: "transit",
            crowdLevel: "Moderate"
          }
        ]
      };
    }
    return {
      day: dayNum,
      title: `Exploring ${p1.name} & ${p2.name}`,
      summary: req.avoidCrowds ? `Early-morning pacing to experience ${p1.name} before mid-day visitors arrive, followed by ${p2.name}.` : `Balanced full-day discovery combining iconic ${p1.name}, ${p2.name}, and local culinary stops.`,
      hotelName: selectedHotel?.name || `${dest.name} Sanctuary`,
      transport: transportCatalog.slice(1, 2),
      estimatedCost: toTarget((selectedHotel?.pricePerNightInr || 5e3) + 2900),
      activities: [
        {
          id: `d${dayNum}-a1`,
          timeOfDay: "Morning",
          title: p1.name,
          description: p1.description,
          location: p1.name,
          lat: p1.lat,
          lng: p1.lng,
          estimatedCost: toTarget(p1.estimatedEntryInr || 450),
          durationHours: 3,
          category: p1.type === "Cafe & Food" ? "food" : "nature",
          crowdLevel: p1.crowdLevel
        },
        {
          id: `d${dayNum}-a2`,
          timeOfDay: "Afternoon",
          title: p2.name,
          description: p2.description,
          location: p2.name,
          lat: p2.lat,
          lng: p2.lng,
          estimatedCost: toTarget(p2.estimatedEntryInr || 900),
          durationHours: 2.5,
          category: p2.type === "Cafe & Food" ? "food" : "sightseeing",
          crowdLevel: p2.crowdLevel
        },
        {
          id: `d${dayNum}-a3`,
          timeOfDay: "Late Afternoon",
          title: `Scenic Panorama: ${p3.name}`,
          description: p3.description,
          location: p3.name,
          lat: p3.lat,
          lng: p3.lng,
          estimatedCost: toTarget(p3.estimatedEntryInr || 350),
          durationHours: 2,
          category: "nature",
          crowdLevel: p3.crowdLevel
        },
        {
          id: `d${dayNum}-a4`,
          timeOfDay: "Evening",
          title: `Seasonal Dining: ${seasonalFood}`,
          description: `Unwind at a renowned neighborhood dining spot in ${selectedHotel?.area || dest.name} to savor signature ${seasonalFood}.`,
          location: selectedHotel?.area || dest.name,
          lat: (selectedHotel?.lat || dest.coordinates.lat) + 8e-3,
          lng: (selectedHotel?.lng || dest.coordinates.lng) - 6e-3,
          estimatedCost: toTarget(1650),
          durationHours: 2,
          category: "food",
          crowdLevel: req.avoidCrowds ? "Quiet" : "Moderate"
        }
      ]
    };
  });
  const estimatedTotal = Object.values(budgetBreakdown).reduce((acc, v) => acc + v, 0);
  const now = (/* @__PURE__ */ new Date()).toISOString();
  const candidate = {
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
      `Signature Seasonal Cuisine: Don\u2019t miss authentic ${seasonalProfile.signatureFoods.slice(0, 3).join(", ")}.`,
      `Packing Essentials: ${seasonalProfile.packingAdvice.join(". ")}.`,
      selectedHotel?.recommendationReason || `Base yourself at ${selectedHotel?.name} in ${selectedHotel?.area}.`
    ],
    travelTips: [
      seasonalProfile.culturalAdvisory,
      ...dest.culturalTips.slice(0, 2),
      ...dest.safetyNotes.slice(0, 1)
    ],
    budgetBreakdown,
    provenanceNote: "Itinerary budgets and transport fares combine indicative local estimates with simulated demo adapter rates.",
    createdAt: now,
    updatedAt: now
  };
  return ItinerarySchema.parse(candidate);
}
function optimizeItineraryForBudget(itinerary, newBudget) {
  const safeNewBudget = Math.max(15e3, Math.round(newBudget));
  const newBudgetInInr = itinerary.currency === "INR" ? safeNewBudget : convertCurrency(safeNewBudget, itinerary.currency, "INR");
  const nights = Math.max(1, itinerary.durationDays - 1);
  const maxNightlyInr = Math.round(newBudgetInInr * 0.3 / nights);
  const ranked = rankHotels(HOTELS, {
    destinationId: itinerary.destinationId,
    maxNightlyInr,
    preferredTier: safeNewBudget < itinerary.targetBudget ? "budget" : "boutique"
  });
  const nextHotel = ranked[0] || itinerary.selectedHotel;
  const scaleFactor = itinerary.estimatedTotal > 0 ? safeNewBudget / itinerary.estimatedTotal : 1;
  const hotelTotalInr = (nextHotel?.pricePerNightInr || 4500) * nights;
  const flightInr = Math.round(
    (itinerary.currency === "INR" ? itinerary.budgetBreakdown.flights : convertCurrency(itinerary.budgetBreakdown.flights, itinerary.currency, "INR")) * Math.min(1, Math.max(0.72, scaleFactor))
  );
  const breakdownInr = calculateBudgetBreakdown(newBudgetInInr, hotelTotalInr, flightInr);
  const toTarget = (v) => itinerary.currency === "INR" ? Math.round(v) : Math.round(convertCurrency(v, "INR", itinerary.currency));
  const nextBreakdown = {
    flights: toTarget(breakdownInr.flights),
    hotels: toTarget(breakdownInr.hotels),
    localTransport: toTarget(breakdownInr.localTransport),
    food: toTarget(breakdownInr.food),
    sightseeing: toTarget(breakdownInr.sightseeing),
    shopping: toTarget(breakdownInr.shopping),
    activities: toTarget(breakdownInr.activities),
    emergencyReserve: toTarget(breakdownInr.emergencyReserve)
  };
  const updatedDays = itinerary.days.map((d) => ({
    ...d,
    hotelName: d.day === itinerary.durationDays ? d.hotelName : nextHotel?.name || d.hotelName,
    estimatedCost: Math.max(500, Math.round(d.estimatedCost * Math.min(1.15, Math.max(0.65, scaleFactor))))
  }));
  const changes = [];
  if (nextHotel && nextHotel.name !== itinerary.selectedHotel?.name) {
    changes.push(`Switched stay recommendation to ${nextHotel.name} (${nextHotel.tier} tier) to match the revised target.`);
  }
  if (safeNewBudget < itinerary.targetBudget) {
    changes.push("Prioritized public/shared transfers and low-entry coastal or cultural walks.");
    changes.push("Trimmed discretionary shopping and activity allowances while keeping an emergency reserve.");
  } else {
    changes.push("Expanded accommodation and flexible transit comfort across all trip days.");
  }
  const nextTotal = Object.values(nextBreakdown).reduce((a, b) => a + b, 0);
  const updated = ItinerarySchema.parse({
    ...itinerary,
    targetBudget: safeNewBudget,
    estimatedTotal: nextTotal,
    selectedHotel: nextHotel,
    days: updatedDays,
    budgetBreakdown: nextBreakdown,
    updatedAt: (/* @__PURE__ */ new Date()).toISOString()
  });
  return { updated, changes };
}

// server/ai/agent.ts
import {
  Type
} from "@google/genai";

// server/ai/gemini.ts
import { GoogleGenAI } from "@google/genai";
var cachedClient = null;
var quotaExhaustedUntil = 0;
function hasConfiguredGeminiKey() {
  const key = process.env.GEMINI_API_KEY?.trim();
  return Boolean(key && key !== "MY_GEMINI_API_KEY" && key.length > 10);
}
function isGeminiTemporarilyExhausted() {
  return Date.now() < quotaExhaustedUntil;
}
function markGeminiQuotaExhausted(cooldownMs = 9e4) {
  quotaExhaustedUntil = Date.now() + cooldownMs;
}
function getGeminiClient() {
  if (!hasConfiguredGeminiKey()) {
    throw new Error("GEMINI_API_KEY is not configured in environment variables.");
  }
  if (!cachedClient) {
    cachedClient = new GoogleGenAI({
      apiKey: process.env.GEMINI_API_KEY,
      httpOptions: {
        apiVersion: "v1beta",
        headers: {
          "User-Agent": "aistudio-build"
        }
      }
    });
  }
  return cachedClient;
}
var GEMINI_MODEL = process.env.GEMINI_MODEL || "gemini-2.5-flash";

// server/ai/tavilyFallback.ts
function isGeminiQuotaError(err) {
  if (!err) return false;
  const status = typeof err === "object" && "status" in err ? Number(err.status) : NaN;
  if (status === 429) return true;
  const msg = (err instanceof Error ? err.message : typeof err === "object" ? JSON.stringify(err) : String(err)).toLowerCase();
  return msg.includes("429") || msg.includes("resource_exhausted") || msg.includes("quota") || msg.includes("rate limit") || msg.includes("too many requests") || msg.includes("exceeded");
}
function cleanWebSnippet(raw, maxLen = 145) {
  const cleaned = raw.replace(/\|+/g, " \xB7 ").replace(/[-_]{3,}/g, " ").replace(/#{1,6}\s*/g, "").replace(/\*\*|__|`/g, "").replace(/\[([^\]]+)\]\([^)]+\)/g, "$1").replace(/\s*·\s*·+\s*/g, " \xB7 ").replace(/\s+/g, " ").replace(/^[·\s]+/, "").trim();
  if (cleaned.length <= maxLen) return cleaned;
  const sliced = cleaned.slice(0, maxLen);
  const lastSpace = sliced.lastIndexOf(" ");
  const trimmed = lastSpace > maxLen * 0.6 ? sliced.slice(0, lastSpace) : sliced;
  return `${trimmed.replace(/[.,;:\-·]+$/, "").trim()}\u2026`;
}
function cleanChatReply(raw, maxLen = 3800) {
  const lines = raw.replace(/\r/g, "").split("\n").map(
    (line) => line.replace(/^#{1,6}\s*/, "").replace(/\*\*|__|`/g, "").replace(/\[([^\]]+)\]\([^)]+\)/g, "$1").replace(/^\s*[-*]\s+/, "\u2022 ").trim()
  );
  const text = lines.join("\n").replace(/\n{3,}/g, "\n\n").trim();
  if (text.length <= maxLen) return text;
  return `${text.slice(0, maxLen).trim()}\u2026`;
}
function cleanPlaceTitle(rawTitle, maxLen = 58) {
  const stripped = rawTitle.replace(/\s+(?:-|\||–|—|:)\s+(?:Tripadvisor|Lonely Planet|Booking\.com|Google|Wikipedia|Reddit|Condé Nast|Conde Nast|Expedia|Kayak|Skyscanner|Nomadic Matt|Culture Trip|Explore|Travel).*$/i, "").replace(/\s*\|\s*[^|]+$/, "").trim();
  return cleanWebSnippet(stripped || rawTitle, maxLen);
}
function extractPriceHint(text, fallback) {
  const inrMatch = text.match(/(?:₹|INR\s?)[\d,]{3,7}(?:\s*[–-]\s*(?:₹|INR\s?)?[\d,]{3,7})?/i);
  if (inrMatch) {
    return cleanWebSnippet(inrMatch[0].replace(/^INR\s?/i, "\u20B9"), 32);
  }
  const usdEurMatch = text.match(/(?:\$|€|USD\s?|EUR\s?)[\d,]{2,5}(?:\s*[–-]\s*(?:\$|€|USD\s?|EUR\s?)?[\d,]{2,5})?(?:\s*\/\s*night)?/i);
  if (usdEurMatch) {
    return cleanWebSnippet(usdEurMatch[0], 32);
  }
  return fallback;
}
function getSourceDomain(url) {
  if (!url) return "Web source";
  try {
    return new URL(url).hostname.replace(/^www\./, "");
  } catch {
    return "Web source";
  }
}
function hasConfiguredTavilyKey() {
  return Boolean(process.env.TAVILY_API_KEY?.trim());
}
async function searchTavily(query, options) {
  const tavilyKey = process.env.TAVILY_API_KEY?.trim();
  if (!tavilyKey) return null;
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), options?.timeoutMs ?? 8e3);
  try {
    const resp = await fetch("https://api.tavily.com/search", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      signal: controller.signal,
      body: JSON.stringify({
        api_key: tavilyKey,
        query,
        search_depth: options?.searchDepth ?? "basic",
        max_results: options?.maxResults ?? 5,
        include_answer: true
      })
    });
    if (!resp.ok) return null;
    return await resp.json();
  } catch {
    return null;
  } finally {
    clearTimeout(timer);
  }
}
function tavilyResultsToSources(results, fallbackUrl = "https://www.google.com/travel", limit = 5) {
  return (results || []).slice(0, limit).map((r) => ({
    title: cleanWebSnippet(r.title || "Travel Source", 68),
    url: r.url || fallbackUrl,
    snippet: cleanWebSnippet(r.content || "", 160)
  }));
}
function buildTavilyChatReply(params) {
  const { tavilyData, itinerary, isBudgetRevision, budgetChanges } = params;
  const answer = tavilyData?.answer ? cleanChatReply(tavilyData.answer, 480) : "";
  const topSnippet = !answer && tavilyData?.results?.[0]?.content ? cleanWebSnippet(tavilyData.results[0].content, 260) : "";
  const liveInsights = answer || topSnippet;
  const bullets = [];
  if (itinerary) {
    if (isBudgetRevision && budgetChanges && budgetChanges.length > 0) {
      bullets.push(...budgetChanges.map((c) => `\u2022 ${c}`));
    } else {
      bullets.push(
        `\u2022 Route & Pace: ${itinerary.durationDays}-day ${itinerary.destination} journey from ${itinerary.origin} for ${itinerary.travellers} travellers (${itinerary.pace} pace).`
      );
      if (itinerary.season || itinerary.travelMonth) {
        bullets.push(
          `\u2022 Seasonal Character: ${itinerary.season || "Current Season"}${itinerary.travelMonth ? ` (${itinerary.travelMonth})` : ""} \xB7 Tailored for optimal seasonal weather and local vibrancy.`
        );
      }
      const landmarkNames = Array.from(
        new Set(
          itinerary.days.flatMap((d) => d.activities).filter((a) => a.category !== "transit" && !a.title.startsWith("Seasonal Dining:")).map((a) => a.title.replace(/^Scenic Panorama:\s*/, ""))
        )
      ).slice(0, 5);
      if (landmarkNames.length > 0) {
        bullets.push(`\u2022 Iconic Sights Featured: ${landmarkNames.join(", ")}.`);
      }
      if (itinerary.signatureFoods && itinerary.signatureFoods.length > 0) {
        bullets.push(`\u2022 Signature Seasonal Cuisine: ${itinerary.signatureFoods.slice(0, 4).join(", ")}.`);
      }
      if (itinerary.selectedHotel) {
        bullets.push(
          `\u2022 Recommended Stay: ${itinerary.selectedHotel.name} (${itinerary.selectedHotel.area}).`
        );
      }
    }
    bullets.push(
      `\u2022 Indicative Budget: ${itinerary.currency} ${itinerary.estimatedTotal.toLocaleString()} total across flights, stays, transit, and dining.`
    );
    if (itinerary.packingAdvice && itinerary.packingAdvice.length > 0) {
      bullets.push(`\u2022 Packing & Transit Essentials: ${itinerary.packingAdvice.slice(0, 2).join("; ")}.`);
    }
  }
  const sections = [];
  if (liveInsights) {
    sections.push(liveInsights);
  } else if (itinerary) {
    sections.push(
      `I have prepared your ${itinerary.durationDays}-day ${itinerary.destination} journey from ${itinerary.origin}.`
    );
  }
  if (bullets.length > 0) {
    sections.push(bullets.join("\n"));
  }
  sections.push(
    "Live route timing, day-by-day experiences, hotel options, and direct partner booking links are ready below."
  );
  return cleanChatReply(sections.join("\n\n"), 2800);
}

// server/ai/agent.ts
var travelToolDeclarations = [
  {
    name: "search_destinations",
    description: "Search curated travel destinations by name, region, or travel interests.",
    parameters: {
      type: Type.OBJECT,
      properties: {
        query: { type: Type.STRING, description: "Destination name, country, or interest keyword." }
      },
      required: ["query"]
    }
  },
  {
    name: "search_hotels",
    description: "Find and rank boutique, budget, or luxury stays using live web search and curated catalog.",
    parameters: {
      type: Type.OBJECT,
      properties: {
        destinationId: { type: Type.STRING, description: "Destination name or id anywhere worldwide (e.g. London, Paris, Tokyo, Bali, New York, Rome, Barcelona, etc.)." },
        maxNightlyInr: { type: Type.NUMBER, description: "Maximum nightly budget in INR." },
        preferredTier: { type: Type.STRING, description: "Stay tier: budget, boutique, or luxury." },
        avoidCrowds: { type: Type.BOOLEAN, description: "Prefer quieter neighborhoods." }
      },
      required: ["destinationId"]
    }
  },
  {
    name: "search_flights",
    description: "Search live flight routes, airlines, layover hubs, and typical fare ranges from origin to destination via web search.",
    parameters: {
      type: Type.OBJECT,
      properties: {
        origin: { type: Type.STRING, description: "Departure city." },
        destination: { type: Type.STRING, description: "Arrival destination name." }
      },
      required: ["origin", "destination"]
    }
  },
  {
    name: "search_transport",
    description: "Retrieve local airport transfers, cabs, trains, and ferries using live web search and local mobility estimates.",
    parameters: {
      type: Type.OBJECT,
      properties: {
        destinationId: { type: Type.STRING, description: "Destination name or id." }
      },
      required: ["destinationId"]
    }
  },
  {
    name: "get_currency_exchange",
    description: "Convert an amount between currencies using indicative travel exchange rates.",
    parameters: {
      type: Type.OBJECT,
      properties: {
        amount: { type: Type.NUMBER, description: "Numeric amount to convert." },
        from: { type: Type.STRING, description: "Source currency code, e.g. INR or USD." },
        to: { type: Type.STRING, description: "Target currency code, e.g. IDR, NPR, CHF, JPY, EUR." }
      },
      required: ["amount", "from", "to"]
    }
  },
  {
    name: "generate_itinerary",
    description: "Construct or update a complete structured day-by-day trip itinerary with budget breakdown.",
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
        interests: { type: Type.ARRAY, items: { type: Type.STRING } }
      },
      required: ["origin", "destination", "durationDays", "travellers", "budget"]
    }
  },
  {
    name: "modify_itinerary",
    description: "Re-optimize the current itinerary when the traveller changes budget or asks to make it cheaper.",
    parameters: {
      type: Type.OBJECT,
      properties: {
        newBudget: { type: Type.NUMBER, description: "Revised total budget target." }
      },
      required: ["newBudget"]
    }
  }
];
function buildDirectBookingLinks(origin, destination) {
  const o = encodeURIComponent(origin || "Kolkata");
  const d = encodeURIComponent(destination || "Bali");
  return [
    {
      label: `Search Flights (${origin} \u2192 ${destination})`,
      url: `https://www.google.com/travel/flights?q=Flights%20from%20${o}%20to%20${d}`,
      kind: "flights"
    },
    {
      label: `Book Stays in ${destination}`,
      url: `https://www.booking.com/searchresults.html?ss=${d}`,
      kind: "hotels"
    },
    {
      label: `Trains, Ferries & Transfers`,
      url: `https://www.rome2rio.com/s/${o}/${d}`,
      kind: "transit"
    },
    {
      label: `Explore ${destination} on Google Maps`,
      url: `https://www.google.com/maps/search/?api=1&query=${d}`,
      kind: "maps"
    }
  ];
}
async function runTravelAgent(input) {
  const toolsUsed = [];
  const defaults = input.preferences ? {
    origin: input.preferences.homeCity,
    currency: input.preferences.preferredCurrency,
    pace: input.preferences.travelStyle,
    hotelTier: input.preferences.hotelPreference,
    interests: input.preferences.interests,
    avoidCrowds: input.preferences.avoidCrowds
  } : void 0;
  const freshReq = extractRequirementsFromText(input.message, defaults);
  const isDestShift = Boolean(
    input.currentItinerary && freshReq.destination && freshReq.destination.toLowerCase() !== input.currentItinerary.destination.toLowerCase()
  );
  let generatedItinerary = isDestShift ? void 0 : input.currentItinerary || void 0;
  let recommendedHotels;
  let collectedSources = [];
  const executeTool = async (name, args) => {
    toolsUsed.push(name);
    switch (name) {
      case "search_destinations": {
        const q = String(args.query || "").toLowerCase().trim();
        const matches = DESTINATIONS.filter(
          (d) => d.name.toLowerCase().includes(q) || d.country.toLowerCase().includes(q) || d.tags.some((t) => t.toLowerCase().includes(q))
        );
        const resolvedList = matches.length > 0 ? matches : q ? [resolveOrSynthesizeDestination(q)] : DESTINATIONS;
        return {
          destinations: resolvedList.map((d) => ({
            id: d.id,
            name: d.name,
            country: d.country,
            bestSeason: d.bestSeason,
            recommendedDays: d.recommendedDays,
            dailyBudgetInr: d.dailyBudgetInr,
            localTransportSummary: d.localTransportSummary
          }))
        };
      }
      case "search_hotels": {
        const destInput = String(args.destinationId || "london");
        const destObj = resolveOrSynthesizeDestination(destInput);
        const tier = args.preferredTier === "budget" || args.preferredTier === "luxury" ? args.preferredTier : "boutique";
        const ranked = rankHotels(HOTELS, {
          destinationId: destObj.id,
          maxNightlyInr: typeof args.maxNightlyInr === "number" ? args.maxNightlyInr : void 0,
          preferredTier: tier,
          avoidCrowds: Boolean(args.avoidCrowds)
        });
        recommendedHotels = ranked.slice(0, 3);
        const webHotels = await runLiveTravelWebSearch({
          category: "hotels",
          destination: destObj.name,
          preferencesNote: `${tier} style${args.maxNightlyInr ? `, under \u20B9${args.maxNightlyInr}/night` : ""}${args.avoidCrowds ? ", quiet area" : ""}`
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
            recommendationReason: h.recommendationReason
          }))
        };
      }
      case "search_flights": {
        const origin = String(args.origin || "Kolkata");
        const destination = String(args.destination || "London");
        const [demoFlights, webFlights] = await Promise.all([
          Promise.resolve(getFlightsForRoute(origin, destination)),
          runLiveTravelWebSearch({ category: "flights", origin, destination })
        ]);
        if (webFlights.sources.length > 0) {
          collectedSources = [...collectedSources, ...webFlights.sources].slice(0, 6);
        }
        return {
          webSearchSummary: webFlights.summary,
          liveRouteHighlights: webFlights.highlights,
          indicativeBenchmarks: demoFlights,
          directBookingUrl: `https://www.google.com/travel/flights?q=Flights%20from%20${encodeURIComponent(origin)}%20to%20${encodeURIComponent(destination)}`
        };
      }
      case "search_transport": {
        const destInput = String(args.destinationId || "london");
        const destObj = resolveOrSynthesizeDestination(destInput);
        const webTransit = await runLiveTravelWebSearch({
          category: "transport",
          destination: destObj.name
        });
        if (webTransit.sources.length > 0) {
          collectedSources = [...collectedSources, ...webTransit.sources].slice(0, 6);
        }
        return {
          webSearchSummary: webTransit.summary,
          liveTransitHighlights: webTransit.highlights,
          indicativeOptions: getTransportOptions(destObj.id)
        };
      }
      case "get_currency_exchange": {
        const amount = Number(args.amount || 1e3);
        const from = String(args.from || "INR");
        const to = String(args.to || "IDR");
        return {
          amount,
          from,
          to,
          converted: convertCurrency(amount, from, to),
          note: "Indicative rate only; bank transaction spreads vary."
        };
      }
      case "generate_itinerary": {
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
          avoidCrowds: args.avoidCrowds !== void 0 ? Boolean(args.avoidCrowds) : extracted.avoidCrowds,
          hotelTier: args.hotelTier === "budget" || args.hotelTier === "luxury" ? args.hotelTier : extracted.hotelTier,
          interests: Array.isArray(args.interests) ? args.interests.map(String) : extracted.interests
        });
        generatedItinerary = itinerary;
        if (!recommendedHotels) {
          recommendedHotels = rankHotels(HOTELS, {
            destinationId: itinerary.destinationId,
            preferredTier: extracted.hotelTier,
            avoidCrowds: extracted.avoidCrowds
          }).slice(0, 3);
        }
        if (collectedSources.length === 0) {
          const webHotels = await runLiveTravelWebSearch({
            category: "hotels",
            destination: itinerary.destination,
            preferencesNote: `${extracted.hotelTier} stays`
          });
          collectedSources = webHotels.sources.slice(0, 5);
        }
        return {
          status: "generated",
          tripName: itinerary.tripName,
          season: itinerary.season,
          seasonalHighlights: itinerary.seasonalHighlights,
          signatureFoods: itinerary.signatureFoods,
          packingAdvice: itinerary.packingAdvice,
          famousPlacesIncluded: Array.from(new Set(itinerary.days.flatMap((d) => d.activities.map((a) => a.title)))).slice(0, 10),
          estimatedTotal: itinerary.estimatedTotal,
          currency: itinerary.currency,
          selectedHotel: itinerary.selectedHotel?.name,
          daysCount: itinerary.days.length
        };
      }
      case "modify_itinerary": {
        if (!generatedItinerary) {
          const fallbackReq = extractRequirementsFromText(input.message, defaults);
          generatedItinerary = buildDeterministicItinerary(fallbackReq);
        }
        const newBudget = Number(args.newBudget || Math.round(generatedItinerary.targetBudget * 0.78));
        const res = optimizeItineraryForBudget(generatedItinerary, newBudget);
        generatedItinerary = res.updated;
        return {
          status: "optimized",
          newTotal: res.updated.estimatedTotal,
          selectedHotel: res.updated.selectedHotel?.name,
          changes: res.changes
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
    const extractedPre = isDestShift ? freshReq : extractRequirementsFromText(input.message, {
      ...defaults,
      origin: input.currentItinerary?.origin || defaults?.origin,
      destination: input.currentItinerary?.destination || defaults?.destination,
      durationDays: input.currentItinerary?.durationDays || defaults?.durationDays,
      travellers: input.currentItinerary?.travellers || defaults?.travellers
    });
    const targetDest = extractedPre.destination || (isDestShift ? freshReq.destination : input.currentItinerary?.destination) || "Alaska";
    const destContext = resolveOrSynthesizeDestination(targetDest);
    const targetSeason = resolveSeason(extractedPre.travelMonth || input.message, destContext.coordinates.lat);
    const seasonalContext = getSeasonalProfile(destContext.name, targetSeason);
    const systemInstruction = `You are Unseen Miles, an attentive, seasoned, and deeply knowledgeable private travel concierge.
Tagline: "Every mile planned, even the unseen ones."
Traveller saved preferences: ${JSON.stringify(input.preferences || {})}
Current active itinerary summary: ${generatedItinerary ? `${generatedItinerary.tripName} (${generatedItinerary.origin} -> ${generatedItinerary.destination}, ${generatedItinerary.durationDays} days, ${generatedItinerary.currency} ${generatedItinerary.estimatedTotal})` : "None yet"}

Target Destination: ${destContext.name} (${destContext.country})
Detected Season & Travel Timing: ${seasonalContext.season} (${seasonalContext.label})
Weather & Climate: ${seasonalContext.weatherOverview} (Typical: ${seasonalContext.tempRange})
Seasonal Highlights: ${seasonalContext.seasonalHighlights.join("; ")}
Signature Seasonal Cuisine: ${seasonalContext.signatureFoods.join(", ")}
Packing & Attire: ${seasonalContext.packingAdvice.join("; ")}
Cultural & Practical Advisory: ${seasonalContext.culturalAdvisory}
Key Sights & Landmarks in ${destContext.name}: ${destContext.places.slice(0, 10).map((p) => `${p.name} (${p.description})`).join("; ")}

Rules & Guidelines:
1. Immediate Structured Itinerary Tool Call: Whenever the user mentions or requests a trip to a destination (e.g. "i want to go to alaska to view northern lights", "plan a trip to Tokyo", "visit London"), you MUST call the \`generate_itinerary\` tool immediately with the requested destination (${destContext.name}), duration (${extractedPre.durationDays} days), travellers (${extractedPre.travellers}), and budget. NEVER respond with only clarifying questions without calling \`generate_itinerary\`. The user expects an immediate structured itinerary card for their requested destination. You can still ask any thoughtful follow-up questions in your final conversational response, but the itinerary tool call MUST happen immediately for ${destContext.name}.
2. Universal Worldwide Coverage: You support ANY destination or city worldwide (e.g. Alaska, London, Paris, Tokyo, Kyoto, New York, Rome, Bali, or anywhere globally). Never restrict the user to preset locations. Always generate plans and search stays for the exact destination requested.
3. Rich, Comprehensive & Seasonal Intelligence: The user expects thorough, high-value, and seasonal advice. Provide 220\u2013340 words of rich, beautifully structured intelligence covering:
   \u2022 Seasonal Climate & Character: Explain what makes ${seasonalContext.season} special in ${destContext.name}, temperature (${seasonalContext.tempRange}), and seasonal highlights (e.g. aurora borealis in Alaska, cherry blossoms in Japan, autumn foliage, or summer festivals).
   \u2022 Must-See Iconic Landmarks & Hidden Gems: Always highlight famous must-see landmarks for ${destContext.name}. Balance iconic landmarks with mindful, uncrowded moments.
   \u2022 Seasonal Cuisine & Dining: Mention signature seasonal dishes and culinary experiences to savor during this time of year (e.g. ${seasonalContext.signatureFoods.slice(0, 3).join(", ")}).
   \u2022 Smart Transit & Packing Essentials: Provide practical transit tips and essential seasonal attire (${seasonalContext.packingAdvice.slice(0, 2).join("; ")}).
4. Tools: Call the tools to search destinations, find real hotels and flight routes via live web search, and call generate_itinerary or modify_itinerary when the user asks to plan or adjust a trip.
5. Transparency: Never fabricate confirmed airline seat inventory or live hotel availability; clearly note when prices are indicative ranges or catalog estimates.
6. Formatting: Write clean, polished plain prose with short crisp paragraphs or clean bullet lines (\u2022). NEVER output raw markdown formatting tokens like **bold**, *italic*, ### headers, or markdown tables because the UI renders structured itinerary, stay, budget, map, and direct booking link cards immediately below your reply.
7. Closing: End with 1\u20132 thoughtful follow-up questions tailored to their season, pace, and interests.`;
    const contents = [
      ...input.history.slice(-8).map((m) => ({
        role: m.role === "assistant" ? "model" : "user",
        parts: [{ text: m.content }]
      })),
      { role: "user", parts: [{ text: input.message }] }
    ];
    let response = await ai.models.generateContent({
      model: GEMINI_MODEL,
      contents,
      config: {
        systemInstruction,
        tools: [{ functionDeclarations: travelToolDeclarations }]
      }
    });
    for (let step = 0; step < 2; step++) {
      const calls = response.functionCalls;
      if (!calls || calls.length === 0) break;
      const previousContent = response.candidates?.[0]?.content;
      if (!previousContent) break;
      contents.push(previousContent);
      const responseParts = await Promise.all(
        calls.map(async (call) => {
          const result = await executeTool(call.name || "", call.args || {});
          return {
            functionResponse: {
              id: call.id,
              name: call.name || "",
              response: result
            }
          };
        })
      );
      contents.push({ role: "user", parts: responseParts });
      response = await ai.models.generateContent({
        model: GEMINI_MODEL,
        contents,
        config: {
          systemInstruction,
          tools: [{ functionDeclarations: travelToolDeclarations }]
        }
      });
    }
    const rawReply = response.text?.trim() || "I have crafted an updated travel plan with curated stays, route timing, and live booking links below.";
    const replyText = cleanChatReply(rawReply, 3800);
    const destMismatch = generatedItinerary && freshReq.destination && generatedItinerary.destination.toLowerCase() !== freshReq.destination.toLowerCase() && /\b(want to go to|going to|trip to|tour to|travel to|fly to|visit|explore|vacation in|holiday in|in|to)\b/i.test(input.message);
    if (!generatedItinerary || destMismatch) {
      if (/\b(plan|trip|tour|days|month|weeks?|itinerary|budget|travel|cheaper|crowd|want|go|visit|explore|vacation|holiday|lights|aurora)\b/i.test(input.message)) {
        generatedItinerary = buildDeterministicItinerary(freshReq);
        toolsUsed.push("generate_itinerary");
      }
    }
    const activeOrigin = generatedItinerary?.origin || freshReq.origin || defaults?.origin || "Kolkata";
    const activeDest = generatedItinerary?.destination || freshReq.destination || "Alaska";
    const uniqueSources = [];
    const seenUrls = /* @__PURE__ */ new Set();
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
      providerLabel: "Gemini AI Concierge \xB7 Live Web Grounding"
    };
  } catch (err) {
    if (isGeminiQuotaError(err)) {
      markGeminiQuotaExhausted();
    }
    const tavilyResult = await runTavilyConciergeFallback(input, defaults);
    if (tavilyResult.usedLiveTavily) {
      return tavilyResult;
    }
    const errMsg = err instanceof Error ? err.message : "Gemini request failed";
    return {
      ...tavilyResult,
      warning: `Live AI services are temporarily unavailable (${errMsg}). Showing curated plan \u2014 verify your API keys in Settings > Secrets.`
    };
  }
}
async function runTavilyConciergeFallback(input, defaults) {
  const lower = input.message.toLowerCase();
  const fresh = extractRequirementsFromText(input.message, defaults);
  const isDestShift = Boolean(
    input.currentItinerary && fresh.destination && fresh.destination.toLowerCase() !== input.currentItinerary.destination.toLowerCase()
  );
  const extracted = isDestShift ? fresh : extractRequirementsFromText(input.message, {
    ...defaults,
    origin: input.currentItinerary?.origin || defaults?.origin,
    destination: input.currentItinerary?.destination || defaults?.destination,
    durationDays: input.currentItinerary?.durationDays || defaults?.durationDays,
    travellers: input.currentItinerary?.travellers || defaults?.travellers
  });
  let activeItinerary;
  let recommendedHotels;
  let budgetChanges;
  let isBudgetRevision = false;
  if (!isDestShift && input.currentItinerary && /cheaper|lower|reduce|save|under\s*\d/i.test(lower)) {
    isBudgetRevision = true;
    const targetBudget = extracted.budget !== 8e4 && extracted.budget < input.currentItinerary.targetBudget ? extracted.budget : Math.round(input.currentItinerary.targetBudget * 0.75);
    const res = optimizeItineraryForBudget(input.currentItinerary, targetBudget);
    activeItinerary = res.updated;
    budgetChanges = res.changes;
    recommendedHotels = rankHotels(HOTELS, {
      destinationId: activeItinerary.destinationId,
      preferredTier: "budget"
    }).slice(0, 3);
  } else {
    activeItinerary = buildDeterministicItinerary(extracted);
    recommendedHotels = rankHotels(HOTELS, {
      destinationId: activeItinerary.destinationId,
      preferredTier: extracted.hotelTier,
      avoidCrowds: extracted.avoidCrowds
    }).slice(0, 3);
  }
  const bookingLinks = buildDirectBookingLinks(activeItinerary.origin, activeItinerary.destination);
  const tavilyQuery = `${input.message.trim()} ${activeItinerary.origin} to ${activeItinerary.destination} travel guide flights boutique hotels local transport`;
  const tavilyData = hasConfiguredTavilyKey() ? await searchTavily(tavilyQuery, { maxResults: 5 }) : null;
  if (tavilyData && (tavilyData.results && tavilyData.results.length > 0 || tavilyData.answer)) {
    const sources = tavilyResultsToSources(tavilyData.results, bookingLinks[0].url, 5);
    return {
      reply: buildTavilyChatReply({
        tavilyData,
        itinerary: activeItinerary,
        isBudgetRevision,
        budgetChanges
      }),
      itinerary: activeItinerary,
      hotels: recommendedHotels,
      toolsUsed: isBudgetRevision ? ["tavily_live_search", "modify_itinerary", "search_hotels"] : ["tavily_live_search", "search_flights", "search_hotels", "generate_itinerary"],
      sources,
      bookingLinks,
      followUpQuestions: buildFollowUps(input.message, activeItinerary),
      usedLiveGemini: false,
      usedLiveTavily: true,
      providerLabel: "Tavily Live Web Search"
    };
  }
  return runDeterministicFallback(input, defaults, activeItinerary, recommendedHotels, isBudgetRevision, budgetChanges);
}
function runDeterministicFallback(input, defaults, prebuiltItinerary, prebuiltHotels, isBudgetRevision = false, budgetChanges) {
  const lower = input.message.toLowerCase();
  const fresh = extractRequirementsFromText(input.message, defaults);
  const isDestShift = Boolean(
    input.currentItinerary && fresh.destination && fresh.destination.toLowerCase() !== input.currentItinerary.destination.toLowerCase()
  );
  const extracted = isDestShift ? fresh : extractRequirementsFromText(input.message, {
    ...defaults,
    origin: input.currentItinerary?.origin || defaults?.origin,
    destination: input.currentItinerary?.destination || defaults?.destination,
    durationDays: input.currentItinerary?.durationDays || defaults?.durationDays,
    travellers: input.currentItinerary?.travellers || defaults?.travellers
  });
  if (!isDestShift && isBudgetRevision && prebuiltItinerary && budgetChanges) {
    return {
      reply: `I recalculated your ${prebuiltItinerary.destination} journey for ${prebuiltItinerary.currency} ${prebuiltItinerary.estimatedTotal.toLocaleString()}:

\u2022 ${budgetChanges.join("\n\u2022 ")}

Note: Stay and transport figures reflect indicative estimates alongside direct partner booking links below.`,
      itinerary: prebuiltItinerary,
      hotels: prebuiltHotels || [],
      toolsUsed: ["modify_itinerary", "search_hotels", "calculate_trip_budget"],
      bookingLinks: buildDirectBookingLinks(prebuiltItinerary.origin, prebuiltItinerary.destination),
      followUpQuestions: [
        "Would you like to swap to public rail/bus transfers where possible?",
        "Should we add another quiet morning caf\xE9 stop?"
      ],
      usedLiveGemini: false,
      usedLiveTavily: false,
      providerLabel: "Unseen Miles Engine"
    };
  }
  if (input.currentItinerary && /cheaper|lower|reduce|save|under\s*\d/i.test(lower)) {
    const targetBudget = extracted.budget !== 8e4 && extracted.budget < input.currentItinerary.targetBudget ? extracted.budget : Math.round(input.currentItinerary.targetBudget * 0.75);
    const { updated, changes } = optimizeItineraryForBudget(input.currentItinerary, targetBudget);
    const hotels2 = rankHotels(HOTELS, {
      destinationId: updated.destinationId,
      preferredTier: "budget"
    }).slice(0, 3);
    return {
      reply: `I recalculated your ${updated.destination} journey for ${updated.currency} ${updated.estimatedTotal.toLocaleString()}:

\u2022 ${changes.join("\n\u2022 ")}

Note: Stay and transport figures reflect indicative estimates alongside direct partner booking links below.`,
      itinerary: updated,
      hotels: hotels2,
      toolsUsed: ["modify_itinerary", "search_hotels", "calculate_trip_budget"],
      bookingLinks: buildDirectBookingLinks(updated.origin, updated.destination),
      followUpQuestions: [
        "Would you like to swap to public rail/bus transfers where possible?",
        "Should we add another quiet morning caf\xE9 stop?"
      ],
      usedLiveGemini: false,
      usedLiveTavily: false,
      providerLabel: "Unseen Miles Engine"
    };
  }
  const itinerary = prebuiltItinerary || buildDeterministicItinerary(extracted);
  const hotels = prebuiltHotels || rankHotels(HOTELS, {
    destinationId: itinerary.destinationId,
    preferredTier: extracted.hotelTier,
    avoidCrowds: extracted.avoidCrowds
  }).slice(0, 3);
  const season = resolveSeason(extracted.travelMonth || input.message, itinerary.coordinates?.lat || 35);
  const seasonalProfile = getSeasonalProfile(itinerary.destination, season);
  const destObj = resolveOrSynthesizeDestination(itinerary.destination);
  const topLandmarks = destObj.places.slice(0, 6).map((p) => p.name).join(", ");
  const replyLines = [
    `I have prepared a detailed ${itinerary.durationDays}-day ${itinerary.destination} journey from ${itinerary.origin} for ${itinerary.travellers} travellers, crafted specifically for the ${seasonalProfile.label}.`,
    `\u2022 Season & Weather (${seasonalProfile.season}): ${seasonalProfile.weatherOverview} Typical daytime temperatures hover around ${seasonalProfile.tempRange}.`,
    `\u2022 Iconic Landmarks Featured: ${topLandmarks}.`,
    `\u2022 Signature Seasonal Cuisine: Don\u2019t miss authentic ${seasonalProfile.signatureFoods.slice(0, 4).join(", ")}.`,
    `\u2022 Selected Stay: ${itinerary.selectedHotel?.name} in ${itinerary.selectedHotel?.area} (${itinerary.currency} ${itinerary.selectedHotel?.pricePerNightInr.toLocaleString()}/night).`,
    `\u2022 Estimated Total Budget: ${itinerary.currency} ${itinerary.estimatedTotal.toLocaleString()} across return flights, stays, transit, and curated meals.`,
    `\u2022 Smart Essentials & Attire: ${seasonalProfile.packingAdvice.join("; ")}.`,
    `Your complete day-by-day itinerary with morning, afternoon, sunset, and evening experiences, hotel comparisons, and interactive maps is detailed below. Use the direct partner links to check live availability and locked rates.`
  ];
  return {
    reply: replyLines.join("\n\n"),
    itinerary,
    hotels,
    toolsUsed: ["extract_requirements", "search_hotels", "calculate_trip_budget", "generate_itinerary"],
    bookingLinks: buildDirectBookingLinks(itinerary.origin, itinerary.destination),
    followUpQuestions: buildFollowUps(input.message, itinerary),
    usedLiveGemini: false,
    usedLiveTavily: false,
    providerLabel: "Unseen Miles Engine"
  };
}
function buildFollowUps(userMsg, itinerary) {
  if (!itinerary) {
    return [
      "Plan a 5-day calm Bali getaway from Kolkata under \u20B980,000",
      "Compare peaceful lakeside stays in Pokhara, Nepal",
      "Suggest scenic Swiss Alps rail passes for 6 days"
    ];
  }
  if (/cheap|budget|lower/i.test(userMsg)) {
    return [
      `Switch ${itinerary.destination} stays to a boutique garden tier`,
      "Show direct flight and airport transfer links"
    ];
  }
  return [
    `Make this ${itinerary.destination} trip 20% cheaper`,
    "Find quieter boutique hotels near artisan caf\xE9s"
  ];
}
async function runDestinationResearch(destination, focus) {
  const tavilyKey = process.env.TAVILY_API_KEY?.trim();
  const query = `${destination} travel guide ${focus || "best peaceful places, local transport, cafes, safety tips"}`;
  if (tavilyKey) {
    try {
      const resp = await fetch("https://api.tavily.com/search", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          api_key: tavilyKey,
          query,
          search_depth: "basic",
          max_results: 4,
          include_answer: true
        })
      });
      if (resp.ok) {
        const data = await resp.json();
        return {
          summary: cleanWebSnippet(
            data.answer || `Live web research summary for ${destination}.`,
            540
          ),
          sources: (data.results || []).map((r) => ({
            title: cleanWebSnippet(r.title || "Travel Source", 68),
            url: r.url || "https://www.google.com/travel",
            snippet: cleanWebSnippet(r.content || "", 160)
          })),
          providerLabel: "Tavily Live Web Research"
        };
      }
    } catch {
    }
  }
  if (hasConfiguredGeminiKey() && !isGeminiTemporarilyExhausted()) {
    try {
      const ai = getGeminiClient();
      const response = await ai.models.generateContent({
        model: GEMINI_MODEL,
        contents: `Provide a concise, practical travel brief for ${destination} covering ${focus || "best peaceful spots, caf\xE9s, local transport tips, and safety"}.`,
        config: {
          tools: [{ googleSearch: {} }]
        }
      });
      const chunks = response.candidates?.[0]?.groundingMetadata?.groundingChunks || [];
      const sources = chunks.filter((c) => c.web?.uri).slice(0, 4).map((c) => ({
        title: cleanWebSnippet(c.web?.title || "Web Source", 68),
        url: c.web?.uri || "",
        snippet: "Google Search Grounding citation"
      }));
      return {
        summary: cleanWebSnippet(response.text || `Travel insights for ${destination}.`, 540),
        sources,
        providerLabel: "Gemini Search Grounding"
      };
    } catch (err) {
      if (isGeminiQuotaError(err)) {
        markGeminiQuotaExhausted();
      }
    }
  }
  const destObj = DESTINATIONS.find(
    (d) => d.name.toLowerCase() === destination.toLowerCase() || d.id === destination.toLowerCase()
  );
  return {
    summary: destObj ? `${destObj.description} Local transport: ${destObj.localTransportSummary}` : `Curated regional travel guidance for ${destination}.`,
    sources: [],
    providerLabel: "Curated Regional Profile"
  };
}
async function translateTravelPhrase(phrase, targetLanguage) {
  if (hasConfiguredGeminiKey() && !isGeminiTemporarilyExhausted()) {
    try {
      const ai = getGeminiClient();
      const response = await ai.models.generateContent({
        model: GEMINI_MODEL,
        contents: `Translate this short travel phrase into ${targetLanguage} and provide phonetic pronunciation and a 1-sentence politeness note: "${phrase}"`,
        config: {
          responseMimeType: "application/json",
          responseSchema: {
            type: Type.OBJECT,
            properties: {
              translated: { type: Type.STRING },
              pronunciation: { type: Type.STRING },
              culturalNote: { type: Type.STRING }
            },
            required: ["translated", "pronunciation", "culturalNote"]
          }
        }
      });
      const parsed = JSON.parse((response.text || "{}").trim());
      return {
        translated: parsed.translated || phrase,
        pronunciation: parsed.pronunciation || "",
        culturalNote: parsed.culturalNote || "",
        usedLiveGemini: true,
        providerLabel: "Gemini AI Translator"
      };
    } catch (err) {
      if (isGeminiQuotaError(err)) {
        markGeminiQuotaExhausted();
      }
    }
  }
  if (hasConfiguredTavilyKey()) {
    const tavilyData = await searchTavily(
      `how to say "${phrase}" in ${targetLanguage} translation and pronunciation`,
      { maxResults: 3 }
    );
    if (tavilyData && (tavilyData.answer || tavilyData.results && tavilyData.results.length > 0)) {
      const answerText = cleanWebSnippet(
        tavilyData.answer || tavilyData.results?.[0]?.content || phrase,
        240
      );
      const sourceNote = tavilyData.results?.[0]?.url ? `Live web translation lookup via ${getSourceDomain(tavilyData.results[0].url)}.` : "Live web translation lookup via Tavily.";
      return {
        translated: answerText,
        pronunciation: `Target language: ${targetLanguage}`,
        culturalNote: sourceNote,
        usedLiveGemini: false,
        providerLabel: "Tavily Live Web Search"
      };
    }
  }
  return {
    translated: phrase,
    pronunciation: "Use the curated destination phrasebook above for verified local phrases.",
    culturalNote: "Live phrase translation is temporarily cooling down; verified local expressions remain ready above.",
    usedLiveGemini: false,
    providerLabel: "Curated Phrasebook"
  };
}
function parseOptionHighlights(rawText) {
  const highlights = [];
  for (const line of rawText.split("\n")) {
    const cleaned = line.replace(/^[\d.)\-*•\s]+/, "").replace(/^\*+|\*+$/g, "").trim();
    const optMatch = cleaned.match(/^OPTION:\s*(.+)$/i);
    if (optMatch) {
      const parts = optMatch[1].split("|").map((p) => p.trim());
      if (parts[0]) {
        highlights.push({
          name: cleanWebSnippet(parts[0], 72),
          detail: cleanWebSnippet(parts[1] || "Live web-grounded travel option", 140),
          indicativePrice: cleanWebSnippet(parts[2] || "Check live fare", 40)
        });
      }
    }
  }
  if (highlights.length === 0) {
    for (const line of rawText.split("\n")) {
      const cleaned = line.replace(/^[\d.)\-*•\s]+/, "").trim();
      if (cleaned.includes("|") && cleaned.length > 15 && highlights.length < 3) {
        const parts = cleaned.split("|").map((p) => p.trim());
        if (parts[0]) {
          highlights.push({
            name: cleanWebSnippet(parts[0], 72),
            detail: cleanWebSnippet(parts[1] || "Grounded route option", 140),
            indicativePrice: cleanWebSnippet(parts[2] || "Check live fare", 40)
          });
        }
      }
    }
  }
  const summary = cleanWebSnippet(
    rawText.split("\n").filter((l) => !/OPTION:/i.test(l) && !(highlights.length > 0 && l.includes("|"))).join(" "),
    480
  );
  return { summary, highlights };
}
function buildBookingSearchUrl(category, destination, origin, itemName) {
  const destEnc = encodeURIComponent(destination);
  const origEnc = encodeURIComponent(origin);
  if (category === "flights") {
    return `https://www.google.com/travel/flights?q=Flights%20from%20${origEnc}%20to%20${destEnc}`;
  }
  if (category === "hotels") {
    const query = itemName ? `${itemName} ${destination}` : destination;
    return `https://www.booking.com/searchresults.html?ss=${encodeURIComponent(query)}`;
  }
  return `https://www.rome2rio.com/s/${origEnc}/${destEnc}`;
}
async function runLiveTravelWebSearch(params) {
  const { category, destination, origin = "Kolkata", preferencesNote = "" } = params;
  const queryPrompt = category === "flights" ? `Current airline routes, flight durations, connecting hubs, and typical fare ranges in Indian Rupees (INR) for flights from ${origin} to ${destination}. ${preferencesNote}` : category === "hotels" ? `Best-rated peaceful boutique, budget, and luxury hotels or stays in ${destination} with neighborhood names and typical nightly price ranges in INR or USD. ${preferencesNote}` : `Best local transportation options in ${destination} including airport transfers, metered taxis or ride-hailing apps, trains or ferries, and typical fare ranges in INR or local currency. ${preferencesNote}`;
  const bookingLinks = category === "flights" ? [
    {
      label: `Google Flights (${origin} \u2192 ${destination})`,
      url: `https://www.google.com/travel/flights?q=Flights%20from%20${encodeURIComponent(origin)}%20to%20${encodeURIComponent(destination)}`
    },
    {
      label: `Skyscanner Routes`,
      url: `https://www.skyscanner.co.in/transport/flights-from/${encodeURIComponent(origin.toLowerCase())}/`
    }
  ] : category === "hotels" ? [
    {
      label: `Booking.com (${destination})`,
      url: `https://www.booking.com/searchresults.html?ss=${encodeURIComponent(destination)}`
    },
    {
      label: `Google Hotels (${destination})`,
      url: `https://www.google.com/travel/hotels/${encodeURIComponent(destination)}`
    }
  ] : [
    {
      label: `Rome2Rio Local Routes`,
      url: `https://www.rome2rio.com/s/${encodeURIComponent(origin)}/${encodeURIComponent(destination)}`
    },
    {
      label: `Google Maps Transit (${destination})`,
      url: `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(destination + " airport transfer")}`
    }
  ];
  const tavilyKey = process.env.TAVILY_API_KEY?.trim();
  if (tavilyKey) {
    try {
      const controller = new AbortController();
      const timer = setTimeout(() => controller.abort(), 4e3);
      const resp = await fetch("https://api.tavily.com/search", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        signal: controller.signal,
        body: JSON.stringify({
          api_key: tavilyKey,
          query: queryPrompt,
          search_depth: "basic",
          max_results: 5,
          include_answer: true
        })
      });
      clearTimeout(timer);
      if (resp.ok) {
        const data = await resp.json();
        const rawResults = data.results || [];
        const sources = rawResults.map((r) => ({
          title: cleanWebSnippet(r.title || "Web Source", 68),
          url: r.url || bookingLinks[0].url,
          snippet: cleanWebSnippet(r.content || "", 160)
        }));
        return {
          summary: cleanWebSnippet(
            data.answer || `Live web search findings for ${category} in ${destination}.`,
            480
          ),
          highlights: rawResults.slice(0, 3).map((r) => ({
            name: cleanPlaceTitle(r.title || `${destination} ${category} listing`, 68),
            subtitle: getSourceDomain(r.url),
            detail: cleanWebSnippet(r.content || "Verified web travel guide.", 140),
            indicativePrice: extractPriceHint(r.content || "", getSourceDomain(r.url)),
            url: r.url || bookingLinks[0].url
          })),
          sources,
          providerLabel: "Tavily Live Web Search",
          bookingLinks
        };
      }
    } catch {
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
          tools: [{ googleSearch: {} }]
        }
      });
      const parsed = parseOptionHighlights(response.text || "");
      const chunks = response.candidates?.[0]?.groundingMetadata?.groundingChunks || [];
      const sources = chunks.filter((c) => c.web?.uri).slice(0, 5).map((c) => ({
        title: cleanWebSnippet(c.web?.title || "Web Search Result", 68),
        url: c.web?.uri || "",
        snippet: "Google Search Grounding source"
      }));
      return {
        summary: parsed.summary || `Live web-grounded ${category} research for ${destination}.`,
        highlights: parsed.highlights.map((h) => ({
          ...h,
          url: buildBookingSearchUrl(category, destination, origin, h.name)
        })),
        sources,
        providerLabel: "Gemini Live Web Search Grounding",
        bookingLinks
      };
    } catch (err) {
      if (isGeminiQuotaError(err)) {
        markGeminiQuotaExhausted();
      }
    }
  }
  return {
    summary: `Showing curated benchmarks and direct partner search links for ${category} in ${destination}.`,
    highlights: [],
    sources: [],
    providerLabel: "Curated Benchmarks + Direct Booking Links",
    bookingLinks
  };
}
async function suggestPlacesWithAI(query) {
  const cleanQuery = query.trim();
  const buildMapsUrl = (name, region) => `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(`${name} ${region}`)}`;
  const tavilyKey = process.env.TAVILY_API_KEY?.trim();
  if (tavilyKey) {
    try {
      const resp = await fetch("https://api.tavily.com/search", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          api_key: tavilyKey,
          query: `best travel places destinations hidden gems cafes local guide for ${cleanQuery}`,
          search_depth: "basic",
          max_results: 5,
          include_answer: true
        })
      });
      if (resp.ok) {
        const data = await resp.json();
        const rawResults = data.results || [];
        const sources = rawResults.map((r) => ({
          title: cleanWebSnippet(r.title || "Travel Guide", 68),
          url: r.url || "https://www.google.com/travel",
          snippet: cleanWebSnippet(r.content || "", 150)
        }));
        if (hasConfiguredGeminiKey() && !isGeminiTemporarilyExhausted()) {
          try {
            const ai = getGeminiClient();
            const digest = rawResults.slice(0, 4).map((r, i) => `[${i + 1}] ${r.title}: ${cleanWebSnippet(r.content || "", 260)}`).join("\n");
            const synth = await ai.models.generateContent({
              model: GEMINI_MODEL,
              contents: `A traveller searched for: "${cleanQuery}".
Live web context:
${digest}

Recommend 3 distinct, specific real-world travel places or neighborhoods matching this search. Include best season, 2 specific hidden gems/spots, and indicative daily budget in INR.`,
              config: {
                responseMimeType: "application/json",
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
                          indicativeDailyBudget: { type: Type.STRING }
                        },
                        required: [
                          "name",
                          "countryOrRegion",
                          "tagline",
                          "highlights",
                          "bestSeason",
                          "indicativeDailyBudget"
                        ]
                      }
                    }
                  },
                  required: ["summary", "places"]
                }
              }
            });
            const parsed = JSON.parse((synth.text || "{}").trim());
            if (Array.isArray(parsed.places) && parsed.places.length > 0) {
              return {
                summary: cleanWebSnippet(parsed.summary || data.answer || "", 420),
                places: parsed.places.slice(0, 3).map((p) => ({
                  name: cleanWebSnippet(p.name, 56),
                  countryOrRegion: cleanWebSnippet(p.countryOrRegion, 48),
                  tagline: cleanWebSnippet(p.tagline, 130),
                  highlights: (p.highlights || []).slice(0, 3).map((h) => cleanWebSnippet(h, 64)),
                  bestSeason: cleanWebSnippet(p.bestSeason, 42),
                  indicativeDailyBudget: cleanWebSnippet(p.indicativeDailyBudget, 36),
                  mapsUrl: buildMapsUrl(p.name, p.countryOrRegion)
                })),
                sources,
                providerLabel: "AI Live Place Discovery (Tavily + Gemini)"
              };
            }
          } catch (err) {
            if (isGeminiQuotaError(err)) {
              markGeminiQuotaExhausted();
            }
          }
        }
        if (rawResults.length > 0) {
          return {
            summary: cleanWebSnippet(data.answer || `Live web travel results for "${cleanQuery}".`, 420),
            places: rawResults.slice(0, 3).map((r) => ({
              name: cleanPlaceTitle(r.title || cleanQuery, 56),
              countryOrRegion: getSourceDomain(r.url),
              tagline: cleanWebSnippet(r.content || "Live web travel guide", 130),
              highlights: [getSourceDomain(r.url)],
              bestSeason: "Year-round / Check guide",
              indicativeDailyBudget: extractPriceHint(r.content || "", "View live guide"),
              mapsUrl: buildMapsUrl(cleanPlaceTitle(r.title || cleanQuery, 56), "")
            })),
            sources,
            providerLabel: "Tavily Live Place Search"
          };
        }
      }
    } catch {
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
          responseMimeType: "application/json",
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
                    indicativeDailyBudget: { type: Type.STRING }
                  },
                  required: [
                    "name",
                    "countryOrRegion",
                    "tagline",
                    "highlights",
                    "bestSeason",
                    "indicativeDailyBudget"
                  ]
                }
              }
            },
            required: ["summary", "places"]
          }
        }
      });
      const parsed = JSON.parse((response.text || "{}").trim());
      const chunks = response.candidates?.[0]?.groundingMetadata?.groundingChunks || [];
      const sources = chunks.filter((c) => c.web?.uri).slice(0, 4).map((c) => ({
        title: cleanWebSnippet(c.web?.title || "Travel Guide", 68),
        url: c.web?.uri || "",
        snippet: "Google Search Grounding source"
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
            mapsUrl: buildMapsUrl(p.name, p.countryOrRegion)
          })),
          sources,
          providerLabel: "Gemini AI Search Grounding"
        };
      }
    } catch (err) {
      if (isGeminiQuotaError(err)) {
        markGeminiQuotaExhausted();
      }
    }
  }
  const tokens = cleanQuery.toLowerCase().split(/\s+/).filter(Boolean);
  const matchingCatalog = DESTINATIONS.filter(
    (d) => tokens.some(
      (t) => d.name.toLowerCase().includes(t) || d.country.toLowerCase().includes(t) || d.tags.some((tag) => tag.toLowerCase().includes(t)) || d.tagline.toLowerCase().includes(t)
    )
  ).slice(0, 3);
  const fallbackList = matchingCatalog.length > 0 ? matchingCatalog : DESTINATIONS.slice(0, 3);
  return {
    summary: `Curated matches for "${cleanQuery}" from our verified destination profiles.`,
    places: fallbackList.map((d) => ({
      name: d.name,
      countryOrRegion: `${d.country} \xB7 ${d.region}`,
      tagline: d.tagline,
      highlights: d.places.slice(0, 2).map((p) => p.name),
      bestSeason: d.bestSeason,
      indicativeDailyBudget: `\u20B9${d.dailyBudgetInr.balanced.toLocaleString()}/day`,
      mapsUrl: buildMapsUrl(d.name, d.country)
    })),
    sources: [],
    providerLabel: "Curated Place Suggestions"
  };
}

// server/store.ts
import fs from "node:fs";
import path from "node:path";
var DATA_DIR = path.resolve(process.cwd(), ".data");
var DB_PATH = path.join(DATA_DIR, "unseen-miles-db.json");
function createInitialDb() {
  const seedTrip = buildDeterministicItinerary(
    extractRequirementsFromText(
      "From Kolkata to Bali for 5 days in December, budget \u20B980,000 for 2 people, beaches, cafes, peaceful places"
    ),
    "bali-december-escape"
  );
  const seedBookings = [
    {
      id: "bk-flight-1",
      tripId: seedTrip.id,
      type: "Flight",
      title: "Kolkata (CCU) \u2192 Denpasar (DPS) Round-Trip Reference",
      provider: "Demo Flight Adapter",
      referenceCode: "UM-FLT-8824",
      dateLabel: "14 Dec \u2013 19 Dec",
      status: "Saved Record",
      amount: seedTrip.budgetBreakdown.flights,
      currency: seedTrip.currency,
      cancellationPolicy: "Indicative fare rules: modification fee applies within 72h of departure.",
      providerUrl: "https://www.google.com/travel/flights"
    },
    {
      id: "bk-hotel-1",
      tripId: seedTrip.id,
      type: "Hotel",
      title: seedTrip.selectedHotel?.name || "Kajane Quiet Ridge Sanctuary",
      provider: "Unseen Stays Catalog",
      referenceCode: "UM-STY-4109",
      dateLabel: "14 Dec \u2013 18 Dec (4 nights)",
      status: "Saved Record",
      amount: seedTrip.budgetBreakdown.hotels,
      currency: seedTrip.currency,
      cancellationPolicy: seedTrip.selectedHotel?.cancellationPolicy || "Free cancellation up to 72 hours prior.",
      providerUrl: "https://www.booking.com"
    }
  ];
  return {
    trips: [seedTrip],
    savedDestinationIds: ["bali", "nepal"],
    savedHotelIds: ["ht-bali-ubud-sanctuary", "ht-nepal-pokhara-lake"],
    bookings: seedBookings,
    preferences: {
      name: "Aarav Sen",
      email: "traveller@unseenmiles.app",
      homeCity: "Kolkata",
      preferredCurrency: "INR",
      travelStyle: "balanced",
      hotelPreference: "boutique",
      foodPreferences: ["Local Caf\xE9s", "Vegetarian Friendly"],
      interests: ["Beaches", "Cafes", "Peaceful Places"],
      preferredTransport: ["Scenic Rail", "Private Day Transfer"],
      avoidCrowds: true
    }
  };
}
var inMemoryDb = null;
var TMP_DB_PATH = path.join("/tmp", "unseen-miles-db.json");
function readDb() {
  if (inMemoryDb) {
    return inMemoryDb;
  }
  try {
    if (fs.existsSync(TMP_DB_PATH)) {
      const raw = fs.readFileSync(TMP_DB_PATH, "utf-8");
      inMemoryDb = JSON.parse(raw);
      return inMemoryDb;
    }
    if (fs.existsSync(DB_PATH)) {
      const raw = fs.readFileSync(DB_PATH, "utf-8");
      inMemoryDb = JSON.parse(raw);
      return inMemoryDb;
    }
    try {
      fs.mkdirSync(DATA_DIR, { recursive: true });
      const initial = createInitialDb();
      fs.writeFileSync(DB_PATH, JSON.stringify(initial, null, 2), "utf-8");
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
function writeDb(data) {
  inMemoryDb = data;
  try {
    fs.mkdirSync(DATA_DIR, { recursive: true });
    fs.writeFileSync(DB_PATH, JSON.stringify(data, null, 2), "utf-8");
  } catch {
    try {
      fs.writeFileSync(TMP_DB_PATH, JSON.stringify(data, null, 2), "utf-8");
    } catch {
    }
  }
}
var store = {
  getTrips() {
    return readDb().trips;
  },
  getTrip(id) {
    return readDb().trips.find((t) => t.id === id);
  },
  saveTrip(trip) {
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
  deleteTrip(id) {
    const db = readDb();
    const prevLen = db.trips.length;
    db.trips = db.trips.filter((t) => t.id !== id);
    writeDb(db);
    return db.trips.length < prevLen;
  },
  getSaved() {
    const db = readDb();
    return { destinationIds: db.savedDestinationIds, hotelIds: db.savedHotelIds };
  },
  toggleSavedDestination(id) {
    const db = readDb();
    if (db.savedDestinationIds.includes(id)) {
      db.savedDestinationIds = db.savedDestinationIds.filter((x) => x !== id);
    } else {
      db.savedDestinationIds.push(id);
    }
    writeDb(db);
    return db.savedDestinationIds;
  },
  toggleSavedHotel(id) {
    const db = readDb();
    if (db.savedHotelIds.includes(id)) {
      db.savedHotelIds = db.savedHotelIds.filter((x) => x !== id);
    } else {
      db.savedHotelIds.push(id);
    }
    writeDb(db);
    return db.savedHotelIds;
  },
  getBookings(tripId) {
    const bookings = readDb().bookings;
    return tripId ? bookings.filter((b) => b.tripId === tripId) : bookings;
  },
  addBooking(record) {
    const db = readDb();
    db.bookings.unshift(record);
    writeDb(db);
    return record;
  },
  updateBookingStatus(id, status) {
    const db = readDb();
    const item = db.bookings.find((b) => b.id === id);
    if (!item) return void 0;
    item.status = status;
    writeDb(db);
    return item;
  },
  getPreferences() {
    return readDb().preferences;
  },
  updatePreferences(prefs) {
    const db = readDb();
    db.preferences = prefs;
    writeDb(db);
    return prefs;
  }
};

// server/app.ts
function createApp() {
  const app2 = express();
  app2.use(express.json({ limit: "1mb" }));
  app2.use((req, _res, next) => {
    if (req.url && !req.url.startsWith("/api") && req.url !== "/" && !req.url.startsWith("/?")) {
      req.url = "/api" + req.url;
    }
    next();
  });
  app2.get("/api/config/status", (_req, res) => {
    const mapsKey = process.env.VITE_GOOGLE_MAPS_API_KEY?.trim() || process.env.GOOGLE_MAPS_API_KEY?.trim() || "";
    res.json({
      gemini: hasConfiguredGeminiKey(),
      tavily: Boolean(process.env.TAVILY_API_KEY?.trim()),
      maps: Boolean(mapsKey),
      weather: "open-meteo-public",
      currency: "frankfurter-public",
      webSearch: Boolean(process.env.TAVILY_API_KEY?.trim()) || hasConfiguredGeminiKey()
    });
  });
  app2.get("/api/maps/config", (_req, res) => {
    const apiKey = process.env.VITE_GOOGLE_MAPS_API_KEY?.trim() || process.env.GOOGLE_MAPS_API_KEY?.trim() || "";
    res.json({ apiKey });
  });
  app2.get("/api/destinations", (req, res) => {
    const q = String(req.query.q || "").toLowerCase().trim();
    const tag = String(req.query.tag || "").toLowerCase().trim();
    let list = DESTINATIONS.filter((d) => {
      const matchesQ = !q || d.name.toLowerCase().includes(q) || d.country.toLowerCase().includes(q) || d.tagline.toLowerCase().includes(q);
      const matchesTag = !tag || tag === "all" || d.tags.some((t) => t.toLowerCase() === tag);
      return matchesQ && matchesTag;
    });
    if (q && list.length === 0) {
      list = [resolveOrSynthesizeDestination(q)];
    }
    res.json({ destinations: list });
  });
  app2.get("/api/destinations/:slug", (req, res) => {
    const slug = req.params.slug;
    const dest = DESTINATIONS.find((d) => d.slug === slug || d.id === slug) || resolveOrSynthesizeDestination(slug);
    const hotels = rankHotels(HOTELS, { destinationId: dest.id });
    const transport = getTransportOptions(dest.id);
    return res.json({ destination: dest, hotels, transport });
  });
  app2.get("/api/hotels", (req, res) => {
    const destinationId = req.query.destinationId ? String(req.query.destinationId) : void 0;
    const maxNightly = req.query.maxNightly ? Number(req.query.maxNightly) : void 0;
    const tier = req.query.tier ? String(req.query.tier) : void 0;
    const avoidCrowds = req.query.avoidCrowds === "true";
    const ranked = rankHotels(HOTELS, {
      destinationId: destinationId === "all" ? void 0 : destinationId,
      maxNightlyInr: maxNightly,
      preferredTier: tier,
      avoidCrowds
    });
    res.json({
      hotels: ranked,
      provenance: "Simulated Demo Stays Catalog \u2014 confirm live room availability with partner before booking."
    });
  });
  app2.get("/api/flights", (req, res) => {
    const origin = String(req.query.origin || "Kolkata");
    const destination = String(req.query.destination || "Bali");
    const flights = getFlightsForRoute(origin, destination);
    res.json({
      flights,
      provenance: "Indicative route schedules & fare benchmarks \u2014 click Book on Google Flights for live availability."
    });
  });
  app2.get("/api/transport", (req, res) => {
    const destinationId = String(req.query.destinationId || "bali");
    res.json({
      options: getTransportOptions(destinationId),
      provenance: "Indicative local transport estimates and demo mobility adapter."
    });
  });
  app2.get("/api/currency", async (req, res) => {
    const from = String(req.query.from || "INR").toUpperCase();
    const to = String(req.query.to || "IDR").toUpperCase();
    const amount = Number(req.query.amount || 1e3);
    try {
      const url = `https://api.frankfurter.app/latest?amount=${encodeURIComponent(amount)}&from=${encodeURIComponent(from)}&to=${encodeURIComponent(to)}`;
      const controller = new AbortController();
      const timer = setTimeout(() => controller.abort(), 3e3);
      const resp = await fetch(url, { signal: controller.signal });
      clearTimeout(timer);
      if (resp.ok) {
        const data = await resp.json();
        const converted2 = data.rates?.[to];
        if (typeof converted2 === "number") {
          return res.json({
            from,
            to,
            amount,
            converted: converted2,
            rate: Number((converted2 / Math.max(1, amount)).toFixed(6)),
            date: data.date || (/* @__PURE__ */ new Date()).toISOString().slice(0, 10),
            provenance: "verified_live",
            note: "Indicative mid-market reference rate via Frankfurter."
          });
        }
      }
    } catch {
    }
    const converted = convertCurrency(amount, from, to);
    const rate = convertCurrency(1, from, to);
    return res.json({
      from,
      to,
      amount,
      converted,
      rate,
      date: (/* @__PURE__ */ new Date()).toISOString().slice(0, 10),
      provenance: "indicative_estimate",
      note: "Offline indicative travel conversion rate; verify bank transaction spread.",
      supportedCurrencies: Object.keys(INDICATIVE_CURRENCY_RATES_FROM_INR)
    });
  });
  app2.get("/api/weather", async (req, res) => {
    const destinationId = String(req.query.destinationId || "london");
    const dest = resolveOrSynthesizeDestination(destinationId);
    try {
      const url = `https://api.open-meteo.com/v1/forecast?latitude=${dest.coordinates.lat}&longitude=${dest.coordinates.lng}&current=temperature_2m,relative_humidity_2m,weather_code&daily=temperature_2m_max,temperature_2m_min&timezone=auto&forecast_days=5`;
      const controller = new AbortController();
      const timer = setTimeout(() => controller.abort(), 3e3);
      const resp = await fetch(url, { signal: controller.signal });
      clearTimeout(timer);
      if (resp.ok) {
        const data = await resp.json();
        if (data.current?.temperature_2m !== void 0) {
          return res.json({
            destination: dest.name,
            currentTempC: data.current.temperature_2m,
            humidity: `${data.current.relative_humidity_2m ?? 65}%`,
            daily: data.daily,
            summary: dest.weatherSummary,
            provenance: "verified_live"
          });
        }
      }
    } catch {
    }
    return res.json({
      destination: dest.name,
      summary: dest.weatherSummary,
      provenance: "indicative_estimate"
    });
  });
  app2.post("/api/ai/chat", async (req, res) => {
    try {
      const { message, history = [], currentItinerary = null } = req.body;
      if (!message || typeof message !== "string" || !message.trim()) {
        return res.status(400).json({ error: "Please enter a message for the travel agent." });
      }
      const parsedItinerary = currentItinerary ? ItinerarySchema.safeParse(currentItinerary) : null;
      const preferences = store.getPreferences();
      const result = await runTravelAgent({
        message: message.trim(),
        history: Array.isArray(history) ? history : [],
        currentItinerary: parsedItinerary?.success ? parsedItinerary.data : null,
        preferences
      });
      return res.json(result);
    } catch (err) {
      return res.status(500).json({
        error: err instanceof Error ? err.message : "Unable to process AI request."
      });
    }
  });
  app2.post("/api/ai/plan", (req, res) => {
    const { prompt, origin, destination, durationDays, travellers, budget, currency } = req.body;
    const prefs = store.getPreferences();
    const extracted = extractRequirementsFromText(prompt || "", {
      origin: origin || prefs.homeCity,
      destination: destination || "Bali",
      durationDays: durationDays || 5,
      travellers: travellers || 2,
      budget: budget || 8e4,
      currency: currency || prefs.preferredCurrency,
      hotelTier: prefs.hotelPreference,
      pace: prefs.travelStyle,
      avoidCrowds: prefs.avoidCrowds
    });
    const itinerary = buildDeterministicItinerary(extracted);
    return res.json({ itinerary });
  });
  app2.post("/api/ai/optimize-budget", (req, res) => {
    const { itinerary, newBudget } = req.body;
    const parsed = ItinerarySchema.safeParse(itinerary);
    if (!parsed.success || typeof newBudget !== "number" || newBudget <= 0) {
      return res.status(400).json({ error: "Valid itinerary and positive budget are required." });
    }
    const result = optimizeItineraryForBudget(parsed.data, newBudget);
    store.saveTrip(result.updated);
    return res.json(result);
  });
  app2.post("/api/ai/research", async (req, res) => {
    const { destination, focus } = req.body;
    if (!destination) return res.status(400).json({ error: "Destination is required." });
    const research = await runDestinationResearch(destination, focus);
    return res.json(research);
  });
  app2.post("/api/ai/suggest-places", async (req, res) => {
    const { query } = req.body;
    if (!query || !query.trim()) {
      return res.status(400).json({ error: "A place or travel interest query is required." });
    }
    const suggestions = await suggestPlacesWithAI(query);
    return res.json(suggestions);
  });
  app2.post("/api/search/web", async (req, res) => {
    const { category, destination, origin, preferencesNote } = req.body;
    if (!category || !destination) {
      return res.status(400).json({ error: "Category and destination are required." });
    }
    const result = await runLiveTravelWebSearch({
      category,
      destination,
      origin,
      preferencesNote
    });
    return res.json(result);
  });
  app2.post("/api/ai/translate", async (req, res) => {
    const { phrase, targetLanguage } = req.body;
    if (!phrase || !targetLanguage) {
      return res.status(400).json({ error: "Phrase and target language are required." });
    }
    try {
      const result = await translateTravelPhrase(phrase, targetLanguage);
      return res.json(result);
    } catch (err) {
      return res.status(500).json({ error: err instanceof Error ? err.message : "Translation failed." });
    }
  });
  app2.get("/api/trips", (_req, res) => {
    res.json({ trips: store.getTrips() });
  });
  app2.get("/api/trips/:id", (req, res) => {
    const trip = store.getTrip(req.params.id);
    if (!trip) return res.status(404).json({ error: "Trip not found" });
    return res.json({ trip });
  });
  app2.post("/api/trips", (req, res) => {
    const parsed = ItinerarySchema.safeParse(req.body);
    if (!parsed.success) {
      return res.status(400).json({ error: "Invalid itinerary payload", details: parsed.error.issues });
    }
    const saved = store.saveTrip(parsed.data);
    return res.status(201).json({ trip: saved });
  });
  app2.delete("/api/trips/:id", (req, res) => {
    const removed = store.deleteTrip(req.params.id);
    return res.json({ removed });
  });
  app2.get("/api/saved", (_req, res) => {
    res.json(store.getSaved());
  });
  app2.post("/api/saved/destination/:id", (req, res) => {
    res.json({ destinationIds: store.toggleSavedDestination(req.params.id) });
  });
  app2.post("/api/saved/hotel/:id", (req, res) => {
    res.json({ hotelIds: store.toggleSavedHotel(req.params.id) });
  });
  app2.get("/api/bookings", (req, res) => {
    const tripId = req.query.tripId ? String(req.query.tripId) : void 0;
    res.json({ bookings: store.getBookings(tripId) });
  });
  app2.post("/api/bookings", (req, res) => {
    const body = req.body;
    if (!body.title || !body.tripId || !body.type) {
      return res.status(400).json({ error: "Booking title, tripId, and type are required." });
    }
    const record = {
      id: `bk-${Date.now().toString(36)}`,
      tripId: body.tripId,
      type: body.type,
      title: body.title,
      provider: body.provider || "Manual Trip Organizer",
      referenceCode: body.referenceCode || `UM-${Math.floor(1e3 + Math.random() * 9e3)}`,
      dateLabel: body.dateLabel || "Upcoming Trip",
      status: "Saved Record",
      amount: Number(body.amount || 0),
      currency: body.currency || "INR",
      cancellationPolicy: body.cancellationPolicy || "Verify provider terms before changes.",
      providerUrl: body.providerUrl || "https://www.google.com/travel"
    };
    return res.status(201).json({ booking: store.addBooking(record) });
  });
  app2.patch("/api/bookings/:id", (req, res) => {
    const { status, confirmed } = req.body;
    if (!confirmed) {
      return res.status(400).json({
        error: "Explicit confirmation required before modifying or cancelling a booking record."
      });
    }
    if (!status) return res.status(400).json({ error: "Target status is required." });
    const updated = store.updateBookingStatus(req.params.id, status);
    if (!updated) return res.status(404).json({ error: "Booking record not found." });
    return res.json({
      booking: updated,
      note: "Local organizer record updated. Complete live provider changes directly via the partner link."
    });
  });
  app2.get("/api/preferences", (_req, res) => {
    res.json({ preferences: store.getPreferences() });
  });
  app2.put("/api/preferences", (req, res) => {
    const prefs = req.body;
    if (!prefs || !prefs.preferredCurrency) {
      return res.status(400).json({ error: "Valid preferences object is required." });
    }
    return res.json({ preferences: store.updatePreferences(prefs) });
  });
  return app2;
}
var app = createApp();
var app_default = app;
export {
  app,
  createApp,
  app_default as default
};
