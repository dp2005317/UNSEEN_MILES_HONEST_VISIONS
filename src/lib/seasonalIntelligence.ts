import type { DestinationPlace } from '../types/travel';

export type Season = 'Spring' | 'Summer' | 'Autumn' | 'Winter';

export interface SeasonalProfile {
  season: Season;
  label: string;
  weatherOverview: string;
  tempRange: string;
  seasonalHighlights: string[];
  signatureFoods: string[];
  packingAdvice: string[];
  culturalAdvisory: string;
  suggestedActivity: {
    title: string;
    description: string;
    category: 'nature' | 'culture' | 'food' | 'sightseeing';
    timeOfDay: 'Morning' | 'Afternoon' | 'Evening';
  };
}

/**
 * Determines season from month or text query.
 * Takes southern hemisphere into account if latitude is negative.
 */
export function resolveSeason(input?: string, lat = 35.0): Season {
  const clean = (input || '').toLowerCase();

  let northernSeason: Season = 'Spring';

  if (/\b(december|january|february|winter|snow|festive|christmas|cold|northern lights|aurora|auroral|borealis)\b/i.test(clean)) {
    northernSeason = 'Winter';
  } else if (/\b(march|april|may|spring|sakura|blossom|bloom)\b/i.test(clean)) {
    northernSeason = 'Spring';
  } else if (/\b(june|july|august|summer|beach|monsoon|sun)\b/i.test(clean)) {
    northernSeason = 'Summer';
  } else if (/\b(september|october|november|autumn|fall|foliage|koyo|leaves)\b/i.test(clean)) {
    northernSeason = 'Autumn';
  } else {
    // Default to current calendar month
    const month = new Date().getMonth(); // 0 = Jan, 11 = Dec
    if (month >= 2 && month <= 4) northernSeason = 'Spring';
    else if (month >= 5 && month <= 7) northernSeason = 'Summer';
    else if (month >= 8 && month <= 10) northernSeason = 'Autumn';
    else northernSeason = 'Winter';
  }

  // If in southern hemisphere, invert the season
  if (lat < -5) {
    switch (northernSeason) {
      case 'Winter':
        return 'Summer';
      case 'Summer':
        return 'Winter';
      case 'Spring':
        return 'Autumn';
      case 'Autumn':
        return 'Spring';
    }
  }

  return northernSeason;
}

export function getSeasonalProfile(destinationName: string, season: Season): SeasonalProfile {
  const destLower = destinationName.toLowerCase();

  if (destLower.includes('japan') || destLower.includes('tokyo') || destLower.includes('kyoto') || destLower.includes('osaka')) {
    switch (season) {
      case 'Spring':
        return {
          season: 'Spring',
          label: 'Cherry Blossom & Sakura Bloom Season',
          weatherOverview: 'Crisp pleasant days (12°C – 20°C) with pale pink canopies across parks and shrine canals.',
          tempRange: '12°C – 20°C',
          seasonalHighlights: [
            'Hanami picnics under blooming cherry blossoms in Shinjuku Gyoen and Ueno Park',
            'Evening light-ups at Meguro River and Chidorigafuchi Moat',
            'Spring tea ceremonies with seasonal sakura matcha mochi in Kyoto',
          ],
          signatureFoods: ['Sakura Mochi', 'Takenoko (Fresh Bamboo Shoot rice)', 'Tai (Spring Sea Bream)', 'Matcha Soft Cream'],
          packingAdvice: ['Light layers with a comfortable denim or trench coat', 'Comfortable slip-on walking shoes for temple visits', 'Small umbrella for gentle spring showers'],
          culturalAdvisory: 'Peak season for domestic and international travel; reserve Shinkansen seats and popular restaurants 3–4 weeks in advance.',
          suggestedActivity: {
            title: 'Early Morning Sakura Stroll & Hanami Walk',
            description: 'Wander beneath ancient cherry blossom boughs before midday crowds gather, with fresh morning matcha.',
            category: 'nature',
            timeOfDay: 'Morning',
          },
        };
      case 'Autumn':
        return {
          season: 'Autumn',
          label: 'Momiji & Fiery Autumn Foliage Season',
          weatherOverview: 'Clear, crisp blue skies with stunning scarlet maple and golden ginkgo canopies (13°C – 21°C).',
          tempRange: '13°C – 21°C',
          seasonalHighlights: [
            'Night illuminations of fiery maple trees at Kiyomizu-dera and Eikando in Kyoto',
            'Golden ginkgo tree avenues along Meiji Jingu Gaien in Tokyo',
            'Crisp clear vistas of snow-capped Mount Fuji from Lake Kawaguchiko',
          ],
          signatureFoods: ['Roasted Kuri (Sweet Chestnuts)', 'Matsutake Mushroom Broth', 'Sanma (Pacific Saury)', 'Warm Sweet Potato (Yaki-imo)'],
          packingAdvice: ['Merino wool sweaters or light jackets for breezy evenings', 'Warm scarf for scenic dusk walks', 'Comfortable footwear for stone stairways'],
          culturalAdvisory: 'Autumn foliage moves from north to south; November is prime time for Tokyo, Kyoto, and central Honshu.',
          suggestedActivity: {
            title: 'Temple Maple Garden & Golden Ginkgo Promenade',
            description: 'Marvel at vibrant autumn colors reflecting across serene koi ponds and historic temple moss gardens.',
            category: 'nature',
            timeOfDay: 'Morning',
          },
        };
      case 'Winter':
        return {
          season: 'Winter',
          label: 'Winter Illuminations & Serene Onsen Season',
          weatherOverview: 'Crisp sunny days with chilly evenings (3°C – 11°C), snow-capped peaks, and sparkling holiday lights.',
          tempRange: '3°C – 11°C',
          seasonalHighlights: [
            'Rejuvenating natural hot spring (onsen) baths in Hakone or Arashiyama with Mt. Fuji views',
            'Spectacular winter illuminations across Roppongi Hills, Shibuya Blue Cave, and Marunouchi',
            'Peaceful, uncrowded mornings at Senso-ji and Fushimi Inari with crisp mountain air',
          ],
          signatureFoods: ['Steaming Tonkotsu Ramen', 'Nabe Hot Pots & Sukiyaki', 'Fresh Winter Oysters', 'Warm Sake & Oden'],
          packingAdvice: ['Warm thermal base layer (Uniqlo Heattech)', 'Insulated winter down coat or overcoat', 'Gloves, knit beanie, and lip balm'],
          culturalAdvisory: 'Winter offers the clearest views of Mount Fuji and significantly smaller tourist crowds at major cultural shrines.',
          suggestedActivity: {
            title: 'Traditional Thermal Onsen Soak & Winter Illuminations',
            description: 'Warm up in mineral-rich hot spring waters followed by an evening stroll through mesmerizing urban light displays.',
            category: 'culture',
            timeOfDay: 'Evening',
          },
        };
      case 'Summer':
        return {
          season: 'Summer',
          label: 'Matsuri Festivals & Vibrant Fireworks Season',
          weatherOverview: 'Warm, lush, and humid (24°C – 32°C) with vibrant street festivals, river breezes, and lantern nights.',
          tempRange: '24°C – 32°C',
          seasonalHighlights: [
            'Traditional Yukata street festivals (Matsuri) with taiko drumming and food stalls',
            'Kyoto Kamogawa riverside dining platforms (Kawadoko) cooled by evening waters',
            'Scenic morning climbs and cool bamboo forest breezes in Arashiyama',
          ],
          signatureFoods: ['Kakigori (Fluffy Shaved Ice)', 'Chilled Zaru Soba', 'Yakitori & Cold Asahi', 'Hiyashi Chuka (Cold Ramen)'],
          packingAdvice: ['Lightweight breathable cotton or linen clothing', 'UV protection umbrella or sun hat', 'Handheld portable fan and electrolyte hydration'],
          culturalAdvisory: 'Schedule temple walks for 07:00–10:00 to avoid midday humidity; spend early afternoons in air-conditioned art museums.',
          suggestedActivity: {
            title: 'Riverside Kawadoko Dining & Lantern Festival Walk',
            description: 'Dine on elevated wooden platforms above cooling river waters while listening to cicadas and temple bells.',
            category: 'food',
            timeOfDay: 'Evening',
          },
        };
    }
  }

  // European Destinations (London, Paris, Italy, Switzerland)
  if (
    destLower.includes('london') ||
    destLower.includes('paris') ||
    destLower.includes('italy') ||
    destLower.includes('rome') ||
    destLower.includes('france') ||
    destLower.includes('switzerland') ||
    destLower.includes('amsterdam')
  ) {
    switch (season) {
      case 'Winter':
        return {
          season: 'Winter',
          label: 'Festive Holiday Lights & Historic Hearth Season',
          weatherOverview: 'Brisk, atmospheric days (2°C – 9°C) with glowing Christmas markets, ice rinks, and cozy fireside bistros.',
          tempRange: '2°C – 9°C',
          seasonalHighlights: [
            'Festive holiday lights along Regent Street, Covent Garden, and Champs-Élysées',
            'Open-air ice skating at Somerset House or festive European city squares',
            'World-class art galleries, museums, and theater shows without peak summer queues',
          ],
          signatureFoods: ['Hot Spiced Mulled Wine / Vin Chaud', 'Traditional Sunday Roast or Beef Bourguignon', 'Swiss Cheese Fondue & Raclette', 'Warm Sticky Toffee Pudding'],
          packingAdvice: ['Heavy wool coat or insulated parka', 'Warm cashmere scarf, leather gloves, and waterproof boots', 'Compact travel umbrella'],
          culturalAdvisory: 'Sun sets early around 16:00–16:30, making afternoons perfect for illuminated walking tours and warm pub hearths.',
          suggestedActivity: {
            title: 'Festive City Lights & Cozy Fireside Tavern Evening',
            description: 'Stroll past world-famous illuminated facades followed by artisanal hot chocolate or spiced cider in a historic tavern.',
            category: 'culture',
            timeOfDay: 'Evening',
          },
        };
      case 'Spring':
        return {
          season: 'Spring',
          label: 'Royal Park Blooms & Sidewalk Café Season',
          weatherOverview: 'Pleasant fresh breezes (11°C – 19°C) with daffodil lawns, magnolia trees, and open-air café terraces.',
          tempRange: '11°C – 19°C',
          seasonalHighlights: [
            'Magnolias and wisteria draped across residential mews in Kensington and Le Marais',
            'Picnics on the manicured lawns of Jardin du Luxembourg or Hampstead Heath',
            'Pleasant sightseeing temperatures for exploring monuments on foot',
          ],
          signatureFoods: ['Fresh Butter Croissants & Café au Lait', 'Spring Asparagus Risotto', 'Artisanal Gelato', 'Afternoon Clotted Cream Tea'],
          packingAdvice: ['Layerable trench coat or casual blazer', 'Comfortable leather walking shoes', 'Light scarf for breezy morning strolls'],
          culturalAdvisory: 'April and May offer optimal conditions: long daylight hours, vibrant blossoms, and moderate crowds.',
          suggestedActivity: {
            title: 'Royal Garden Magnolia Stroll & Artisan Café Terrace',
            description: 'Enjoy morning pastries at a sidewalk bistro before exploring botanical paths in bloom.',
            category: 'nature',
            timeOfDay: 'Morning',
          },
        };
      case 'Summer':
        return {
          season: 'Summer',
          label: 'Golden Hour Sunsets & Riverfront Promenade Season',
          weatherOverview: 'Sun-drenched days (18°C – 28°C) with daylight extending past 21:00 and vibrant outdoor terraces.',
          tempRange: '18°C – 28°C',
          seasonalHighlights: [
            'Sunset cruises along the Thames, Seine, or Mediterranean Amalfi coast',
            'Lively open-air cinema, rooftop cocktail terraces, and food markets',
            'Swimming in crystal clear coastal coves or scenic alpine lakes',
          ],
          signatureFoods: ['Chilled Crisp Rosé Wine', 'Fresh Seafood Ceviche & Grilled Fish', 'Caprese Salad with Buffalo Mozzarella', 'Artisanal Gelato'],
          packingAdvice: ['Lightweight linen shirts and dresses', 'Polarized sunglasses and broad-spectrum sunscreen', 'Comfortable sandals and walking trainers'],
          culturalAdvisory: 'Book tickets for top landmarks (Eiffel Tower, Colosseum, Tower of London) at least 3 weeks ahead.',
          suggestedActivity: {
            title: 'Sunset Riverboat Promenade & Alfresco Terrace Dining',
            description: 'Glide along historic waterways at golden hour as monuments light up against twilight skies.',
            category: 'sightseeing',
            timeOfDay: 'Evening',
          },
        };
      case 'Autumn':
        return {
          season: 'Autumn',
          label: 'Golden Parks, Grape Harvest & Cultural Season',
          weatherOverview: 'Crisp romantic days (10°C – 17°C) with golden amber leaves carpeting historic cobblestones.',
          tempRange: '10°C – 17°C',
          seasonalHighlights: [
            'Golden tree avenues in Richmond Park, Central Rome villas, and Tuileries Gardens',
            'New wine harvest celebrations and seasonal truffle festivals',
            'Atmospheric, uncrowded exploration of historic squares and ancient ruins',
          ],
          signatureFoods: ['Wild Mushroom & Truffle Tagliatelle', 'Roasted Chestnut Cones', 'Cozy French Onion Soup', 'Apple Crumble with Clotted Cream'],
          packingAdvice: ['Tailored wool coat or warm jacket', 'Waterproof ankle boots', 'Warm knitwear and versatile scarves'],
          culturalAdvisory: 'September and October feature pleasant weather with far fewer crowds than July and August.',
          suggestedActivity: {
            title: 'Golden Parkland Stroll & Truffle Culinary Tasting',
            description: 'Walk through rustling golden leaves before settling into an intimate wine bar for autumn tasting plates.',
            category: 'food',
            timeOfDay: 'Afternoon',
          },
        };
    }
  }

  // Tropical / Island Destinations (Bali, Thailand, etc.)
  if (destLower.includes('bali') || destLower.includes('thailand') || destLower.includes('phuket')) {
    const isDry = season === 'Summer' || season === 'Spring';
    return {
      season: isDry ? 'Spring' : 'Winter',
      label: isDry ? 'Dry Sunny Season & Calmer Waters' : 'Tropical Green Season & Warm Breezes',
      weatherOverview: isDry
        ? 'Sunny skies with gentle sea breezes (24°C – 30°C) and crystal-clear swimming waters.'
        : 'Warm tropical climate (25°C – 31°C) with emerald-green rice terraces and afternoon rain showers.',
      tempRange: '25°C – 31°C',
      seasonalHighlights: [
        'Sunrise volcano treks to Mount Batur with clear panoramic island views',
        'Sunset Kecak fire dance overlooking the dramatic ocean cliffs of Uluwatu',
        'Emerald green rice terraces in Tegallalang at their most lush and photographic',
      ],
      signatureFoods: ['Nasi Campur Bali', 'Fresh Coconuts & Dragonfruit Smoothie Bowls', 'Babi Guling & Sate Lilit', 'Iced Palm Sugar Kopi'],
      packingAdvice: ['Breathable linen attire and swimwear', 'Waterproof pouch and light rain poncho', 'Eco-friendly reef-safe sunscreen'],
      culturalAdvisory: 'Carry a sarong for temple visits; during rainy season, mornings are sunny while showers typically happen in late afternoon.',
      suggestedActivity: {
        title: 'Dawn Rice Terrace Walk & Sacred Cliffside Sunset',
        description: 'Explore misty green terraces in early morning tranquility followed by sunset prayers overlooking crashing waves.',
        category: 'nature',
        timeOfDay: 'Morning',
      },
    };
  }

  // Arctic & Aurora Destinations (Alaska, Iceland, Northern Lights)
  if (
    destLower.includes('alaska') ||
    destLower.includes('fairbanks') ||
    destLower.includes('anchorage') ||
    destLower.includes('northern lights') ||
    destLower.includes('aurora')
  ) {
    const isSummer = season === 'Summer';
    if (isSummer) {
      return {
        season: 'Summer',
        label: 'Midnight Sun & Coastal Fjords Wilderness Season',
        weatherOverview: 'Mild endless daylight (13°C – 23°C) with 20+ hours of sun for glacier cruising, alpine hiking, and wildlife viewing.',
        tempRange: '13°C – 23°C',
        seasonalHighlights: [
          'Catamaran glacier cruises through Kenai Fjords past breaching humpback whales and calving ice walls',
          'Wildlife safaris in Denali National Park spotting wild grizzly bears, moose, and caribou',
          'Midnight Sun strolls along the Anchorage coastal trail with 22:00 sunset golden hour',
        ],
        signatureFoods: ['Wild Copper River King Salmon', 'Fresh Alaskan King Crab Legs', 'Smoked Halibut Chowder', 'Wild Blueberry Sourdough Pancakes'],
        packingAdvice: ['Layerable fleece and waterproof rain shell', 'Insect repellent and headnet for tundra trails', 'Eye mask for sleeping under the midnight sun'],
        culturalAdvisory: 'Peak season for national park shuttles and marine cruises; reserve boat trips and Denali bus passes well in advance.',
        suggestedActivity: {
          title: 'Kenai Fjords Wildlife & Tidewater Glacier Cruise',
          description: 'Sail through protected glacial waterways past seabird rookeries and thunderous calving ice.',
          category: 'nature',
          timeOfDay: 'Morning',
        },
      };
    }
    return {
      season: 'Winter',
      label: 'Aurora Borealis & Arctic Wilderness Season',
      weatherOverview: 'Crisp, sub-zero arctic air (-18°C to -4°C) under crystal-clear dark skies perfectly positioned under the auroral oval.',
      tempRange: '-18°C – -2°C (Fairbanks / Interior)',
      seasonalHighlights: [
        'Vivid emerald, violet, and ruby Aurora Borealis ribbons dancing across the dark night sky in Fairbanks',
        'Soaking in 40°C mineral-rich natural geothermal waters surrounded by snow at Chena Hot Springs',
        'Dog sledding (mushing) through snow-draped boreal forests and over frozen river trails',
        'Scenic winter journey on the Alaska Railroad Aurora Winter Train through dramatic snowy passes',
      ],
      signatureFoods: ['Steaming Halibut Chowder in Sourdough Bread Bowls', 'Reindeer Sausage Breakfast Hash', 'Wild Smoked Salmon Chowder', 'Warm Berry Cobbler with Vanilla Cream'],
      packingAdvice: ['Heavy thermal Merino base layers (top & bottom)', 'Insulated sub-zero winter parka (-20°C rated)', 'Arctic winter snow boots (Sorel/Baffin)', 'Chemical hand & toe warmers, balaclava, and windproof mittens'],
      culturalAdvisory: 'Prime aurora viewing window is 22:00–03:00 on clear dark nights; Fairbanks has over an 80% success rate across 3+ night stays.',
      suggestedActivity: {
        title: 'Midnight Aurora Borealis Watch & Chena Geothermal Soak',
        description: 'Soak in natural steaming mineral rock pools while watching brilliant celestial aurora displays overhead.',
        category: 'nature',
        timeOfDay: 'Evening',
      },
    };
  }

  // Generic Worldwide Fallback
  return {
    season,
    label: `${season} Seasonal Journey`,
    weatherOverview: `Comfortable seasonal conditions tailored for walking, sightseeing, and dining.`,
    tempRange: '14°C – 24°C',
    seasonalHighlights: [
      `Iconic landmark discovery during optimal seasonal daylight`,
      `Local seasonal cuisine and farm-to-table culinary tastings`,
      `Scenic walking routes through historic quarters and panoramic viewpoints`,
    ],
    signatureFoods: ['Regional farm-to-table dishes', 'Artisanal local roaster coffee', 'Seasonal pastries and desserts'],
    packingAdvice: ['Versatile seasonal layers', 'Comfortable broken-in walking shoes', 'Weather-appropriate outer layer'],
    culturalAdvisory: 'Check 5-day local weather forecasts before departure to optimize morning and afternoon outdoor timings.',
    suggestedActivity: {
      title: `${season} Landmark & Cultural Stroll`,
      description: `Discover premier historic sites during the most comfortable daylight hours with local café stops.`,
      category: 'sightseeing',
      timeOfDay: 'Morning',
    },
  };
}
