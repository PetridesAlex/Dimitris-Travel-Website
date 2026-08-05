import type { ExperienceCategory } from '@luxury-travel/shared';
import { destinationCities } from '@/data/destination-cities';

export type DemoDestination = {
  id: string;
  type: 'continent' | 'country' | 'city';
  parentId: string | null;
  slug: string;
  slugPath: string;
  name: string;
  tagline: string;
  overview: string;
  image: string;
  featured: boolean;
  bestTimeToVisit: string;
  currency: string;
  languages: string;
  timezone: string;
  visaInfo: string;
  weather: string;
  highlights: string[];
};

export type DemoHotel = {
  id: string;
  slug: string;
  name: string;
  locationLabel: string;
  description: string;
  starRating: number;
  image: string;
  destinationId: string;
  amenities: string[];
};

export type DemoExperience = {
  id: string;
  slug: string;
  name: string;
  tagline: string;
  description: string;
  category: ExperienceCategory;
  image: string;
};

export type DemoItineraryPlace = {
  number: string;
  title: string;
  subtitle: string;
  description: string;
  highlights: string[];
  image: string;
  nights?: string;
};

export type DemoItineraryExtension = {
  title: string;
  nights: string;
  description: string;
  image: string;
};

export type DemoItineraryGlanceStop = {
  label: string;
  detail: string;
  icon: 'city' | 'mountain' | 'temple' | 'nature' | 'port' | 'desert' | 'coast';
};

export type DemoItinerary = {
  id: string;
  slug: string;
  title: string;
  summary: string;
  citiesLabel: string;
  countryName: string;
  durationDays: number;
  priceFrom: number;
  currency: string;
  image: string;
  destinationIds: string[];
  placesLabel: string;
  glanceStops: DemoItineraryGlanceStop[];
  places: DemoItineraryPlace[];
  days: { day: number; title: string; body: string }[];
  included: string[];
  excluded: string[];
  flights: string[];
  departureDates: string[];
  terms: string[];
  extensions: DemoItineraryExtension[];
};

export type DemoCollection = {
  id: string;
  slug: string;
  name: string;
  tagline: string;
  description: string;
  image: string;
};

export type DemoBlogPost = {
  id: string;
  slug: string;
  title: string;
  excerpt: string;
  body: string;
  image: string;
  category: string;
  author: string;
  publishedAt: string;
};

export type DemoTestimonial = {
  id: string;
  authorName: string;
  authorLocation: string;
  quote: string;
  tripLabel: string;
  rating: number;
};

export type DemoEnquiry = {
  id: string;
  fullName: string;
  email: string;
  phone: string;
  destination: string;
  travelDate: string;
  budget: string;
  adults: number;
  children: number;
  travelStyle: string;
  notes: string;
  status: 'new' | 'contacted' | 'qualified' | 'won' | 'lost';
  createdAt: string;
};

const img = {
  machu:
    'https://images.unsplash.com/photo-1587595431973-160d0d94add1?w=1600&q=80',
  japan:
    'https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e?w=1600&q=80',
  morocco:
    'https://images.unsplash.com/photo-1489749798305-4fea3ae63d43?w=1600&q=80',
  rio: 'https://images.unsplash.com/photo-1483729558449-99ef09a8c325?w=1200&q=80',
  amalfi:
    'https://images.unsplash.com/photo-1534113414509-0eec2bfb493f?w=1200&q=80',
  fuji: 'https://images.unsplash.com/photo-1528164344705-47542687000d?w=1200&q=80',
  africa:
    'https://images.unsplash.com/photo-1516426122078-c23e76319801?w=1200&q=80',
  oceania:
    'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=1200&q=80',
  tokyo:
    'https://images.unsplash.com/photo-1540959733332-eab4deabeeaf?w=1200&q=80',
  kyoto:
    'https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e?w=1200&q=80',
  marrakech:
    'https://images.unsplash.com/photo-1539020140153-e479b8c22e70?w=1200&q=80',
  hotel:
    'https://images.unsplash.com/photo-1566073771259-6a8506099945?w=1200&q=80',
  safari:
    'https://images.unsplash.com/photo-1516426122078-c23e76319801?w=1200&q=80',
  cruise:
    'https://images.unsplash.com/photo-1548574505-5e239809ee19?w=1200&q=80',
  train:
    'https://images.unsplash.com/photo-1474487548417-781cb71495f3?w=1200&q=80',
  wellness:
    'https://images.unsplash.com/photo-1540555700478-4be289fbecef?w=1200&q=80',
  blog: 'https://images.unsplash.com/photo-1488646953014-85cb44e25828?w=1200&q=80',
  nyc: 'https://images.unsplash.com/photo-1496442226666-8d4d0e62e6e9?w=1200&q=80',
  canada:
    'https://images.unsplash.com/photo-1503614472-8c93d56e92ce?w=1200&q=80',
  mexico:
    'https://images.unsplash.com/photo-1518638150340-f706e86654de?w=1200&q=80',
  peru: 'https://images.unsplash.com/photo-1526392060635-9d6019884377?w=1200&q=80',
  dubai:
    'https://images.unsplash.com/photo-1512453979798-5ea266f8880c?w=1200&q=80',
  maldives:
    'https://images.unsplash.com/photo-1514282401047-d79a71a590e8?w=1200&q=80',
  greece:
    'https://images.unsplash.com/photo-1613395877344-13d4a8e0d49e?w=1200&q=80',
  iceland:
    'https://images.unsplash.com/photo-1483347756197-71ef80e95f73?w=1200&q=80',
  swiss:
    'https://images.unsplash.com/photo-1527668752968-14dc70a27c95?w=1200&q=80',
  thailand:
    'https://images.unsplash.com/photo-1552465011-b4e21bf6e79a?w=1200&q=80',
  bali: 'https://images.unsplash.com/photo-1537996194471-e657df975ab4?w=1200&q=80',
  egypt:
    'https://images.unsplash.com/photo-1568322445389-f64ac2515020?w=1200&q=80',
  australia:
    'https://images.unsplash.com/photo-1549180030-48bf079fb38a?w=1200&q=80',
  nz: 'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?w=1200&q=80',
  polynesia:
    'https://images.unsplash.com/photo-1544551763-46a013bb70d5?w=1200&q=80',
  france:
    'https://images.unsplash.com/photo-1502602898657-3e91760cbb34?w=1200&q=80',
  spain:
    'https://images.unsplash.com/photo-1583422409516-2895a77efded?w=1200&q=80',
  portugal:
    'https://images.unsplash.com/photo-1555881400-74d7acaacd8b?w=1200&q=80',
  norway:
    'https://images.unsplash.com/photo-1501785888041-af3ef285b470?w=1200&q=80',
  finland:
    'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=1200&q=80',
  austria:
    'https://images.unsplash.com/photo-1516550893923-42d28e5677af?w=1200&q=80',
  colombia:
    'https://images.unsplash.com/photo-1552074284-5e88ef1aef18?w=1200&q=80',
  argentina:
    'https://images.unsplash.com/photo-1483729558449-99ef09a8c325?w=1200&q=80',
  costaRica:
    'https://images.unsplash.com/photo-1518509562904-e7ef99cdcc86?w=1200&q=80',
  vietnam:
    'https://images.unsplash.com/photo-1528127269322-539801943592?w=1200&q=80',
  rome: 'https://images.unsplash.com/photo-1552832230-c0197dd311b5?w=1200&q=80',
};

function country(opts: {
  id: string;
  continentId: string;
  continentSlug: string;
  slug: string;
  name: string;
  tagline: string;
  overview: string;
  image: string;
  featured?: boolean;
  bestTimeToVisit?: string;
  currency?: string;
  languages?: string;
  timezone?: string;
  visaInfo?: string;
  weather?: string;
  highlights?: string[];
}): DemoDestination {
  return {
    id: opts.id,
    type: 'country',
    parentId: opts.continentId,
    slug: opts.slug,
    slugPath: `${opts.continentSlug}/${opts.slug}`,
    name: opts.name,
    tagline: opts.tagline,
    overview: opts.overview,
    image: opts.image,
    featured: opts.featured ?? true,
    bestTimeToVisit: opts.bestTimeToVisit ?? 'Seasonal — ask our designers',
    currency: opts.currency ?? 'Local currency',
    languages: opts.languages ?? 'Local languages',
    timezone: opts.timezone ?? 'Varies',
    visaInfo: opts.visaInfo ?? 'Requirements vary by nationality.',
    weather: opts.weather ?? 'Regional climate variations apply.',
    highlights: opts.highlights ?? [],
  };
}

const continents: DemoDestination[] = [
  {
    id: 'cont-americas',
    type: 'continent',
    parentId: null,
    slug: 'americas',
    slugPath: 'americas',
    name: 'Americas',
    tagline: 'From city lights to sacred mountains',
    overview:
      'Dramatic landscapes, vibrant cities, and cultural depth across North and South America.',
    image: img.rio,
    featured: true,
    bestTimeToVisit: 'Year-round depending on region',
    currency: 'USD / CAD / MXN / BRL / ARS',
    languages: 'English, Spanish, Portuguese',
    timezone: 'UTC-8 to UTC-3',
    visaInfo: 'Varies by country.',
    weather: 'Highly regional.',
    highlights: ['United States', 'Peru', 'Brazil', 'Costa Rica'],
  },
  {
    id: 'cont-asia',
    type: 'continent',
    parentId: null,
    slug: 'asia',
    slugPath: 'asia',
    name: 'Asia & Middle East',
    tagline: 'Where ancient rituals meet cities of tomorrow',
    overview:
      'From Japanese ryokan and Thai islands to desert luxury in the Emirates — Asia & the Middle East offer extraordinary contrast.',
    image: img.fuji,
    featured: true,
    bestTimeToVisit: 'March – May, September – November',
    currency: 'Varies by country',
    languages: 'Multiple',
    timezone: 'UTC+3 to UTC+9',
    visaInfo: 'Country-specific; eVisas widely available.',
    weather: 'Monsoon and dry seasons vary by region.',
    highlights: ['Japan', 'Maldives', 'UAE', 'Thailand'],
  },
  {
    id: 'cont-africa',
    type: 'continent',
    parentId: null,
    slug: 'africa',
    slugPath: 'africa',
    name: 'Africa',
    tagline: 'Where tradition meets adventure',
    overview:
      'Safari plains, imperial cities, and island shores — Africa is a continent of profound contrast and wonder.',
    image: img.africa,
    featured: true,
    bestTimeToVisit: 'May – October (safari); March – May (North Africa)',
    currency: 'Varies by country',
    languages: 'Multiple',
    timezone: 'UTC to UTC+3',
    visaInfo: 'Varies; many countries offer visas on arrival.',
    weather: 'Dry and wet seasons define safari timing.',
    highlights: ['Kenya', 'Morocco', 'South Africa', 'Seychelles'],
  },
  {
    id: 'cont-europe',
    type: 'continent',
    parentId: null,
    slug: 'europe',
    slugPath: 'europe',
    name: 'Europe',
    tagline: 'Timeless elegance across the old world',
    overview:
      'From Mediterranean coastlines to Alpine peaks, Europe offers refined culture, cuisine, and countryside escapes.',
    image: img.amalfi,
    featured: true,
    bestTimeToVisit: 'April – October',
    currency: 'EUR / CHF / ISK / NOK',
    languages: 'Multiple',
    timezone: 'CET / GMT / EET',
    visaInfo: 'Schengen rules apply for many nationalities.',
    weather: 'Temperate with distinct seasons.',
    highlights: ['Italy', 'Greece', 'Switzerland', 'Iceland'],
  },
  {
    id: 'cont-oceania',
    type: 'continent',
    parentId: null,
    slug: 'oceania',
    slugPath: 'oceania',
    name: 'Oceania & Pacific',
    tagline: 'Islands, reefs, and endless horizons',
    overview:
      'Overwater sanctuaries, reef systems, and wilderness journeys across Australia, New Zealand, and the Pacific.',
    image: img.oceania,
    featured: true,
    bestTimeToVisit: 'May – October',
    currency: 'AUD / NZD / XPF / FJD',
    languages: 'English and local languages',
    timezone: 'UTC+8 to UTC+14',
    visaInfo: 'ETA systems for Australia and New Zealand.',
    weather: 'Tropical and temperate zones.',
    highlights: ['French Polynesia', 'New Zealand', 'Australia', 'Fiji'],
  },
];

const countries: DemoDestination[] = [
  // Americas
  country({
    id: 'country-united-states',
    continentId: 'cont-americas',
    continentSlug: 'americas',
    slug: 'united-states',
    name: 'United States',
    tagline: 'Iconic cities and vast wilderness',
    overview:
      'From Manhattan skylines to national parks and coastal highways — the United States rewards travellers who want scale, variety, and exceptional hospitality.',
    image: img.nyc,
    currency: 'US Dollar (USD)',
    languages: 'English',
    timezone: 'Multiple time zones',
    highlights: ['New York', 'California', 'National Parks', 'Hawaii'],
  }),
  country({
    id: 'country-canada',
    continentId: 'cont-americas',
    continentSlug: 'americas',
    slug: 'canada',
    name: 'Canada',
    tagline: 'Wilderness, cities, and pure air',
    overview:
      'Rocky Mountain lodges, polished cities, and vast northern landscapes — Canada is refined adventure at its finest.',
    image: img.canada,
    currency: 'Canadian Dollar (CAD)',
    languages: 'English, French',
    highlights: ['Banff', 'Vancouver', 'Montreal', 'Niagara'],
  }),
  country({
    id: 'country-mexico',
    continentId: 'cont-americas',
    continentSlug: 'americas',
    slug: 'mexico',
    name: 'Mexico',
    tagline: 'Colour, cuisine, and coastal calm',
    overview:
      'Colonial towns, Yucatán ruins, and Pacific beaches — Mexico blends culture and coast with effortless warmth.',
    image: img.mexico,
    currency: 'Mexican Peso (MXN)',
    languages: 'Spanish',
    highlights: ['Oaxaca', 'Riviera Maya', 'Mexico City', 'Los Cabos'],
  }),
  country({
    id: 'country-brazil',
    continentId: 'cont-americas',
    continentSlug: 'americas',
    slug: 'brazil',
    name: 'Brazil',
    tagline: 'Rhythm, rainforest, and coastline',
    overview:
      'Rio’s drama, Amazon immersion, and Bahian beaches — Brazil is vibrant, sensual, and endlessly photogenic.',
    image: img.rio,
    currency: 'Brazilian Real (BRL)',
    languages: 'Portuguese',
    highlights: ['Rio de Janeiro', 'Amazon', 'Fernando de Noronha'],
  }),
  country({
    id: 'country-peru',
    continentId: 'cont-americas',
    continentSlug: 'americas',
    slug: 'peru',
    name: 'Peru',
    tagline: 'Inca trails and Andean soul',
    overview:
      'Machu Picchu, Sacred Valley lodges, and Lima’s culinary scene — Peru is a journey of altitude, history, and flavour.',
    image: img.peru,
    currency: 'Peruvian Sol (PEN)',
    languages: 'Spanish, Quechua',
    highlights: ['Machu Picchu', 'Cusco', 'Sacred Valley', 'Lima'],
  }),
  country({
    id: 'country-colombia',
    continentId: 'cont-americas',
    continentSlug: 'americas',
    slug: 'colombia',
    name: 'Colombia',
    tagline: 'Coffee hills and Caribbean colour',
    overview:
      'Cartagena’s walls, Medellín’s energy, and coffee-region estates — Colombia is vibrant and newly essential.',
    image: img.colombia,
    languages: 'Spanish',
    highlights: ['Cartagena', 'Medellín', 'Coffee Triangle'],
  }),
  country({
    id: 'country-argentina',
    continentId: 'cont-americas',
    continentSlug: 'americas',
    slug: 'argentina',
    name: 'Argentina',
    tagline: 'Tango, wine, and Patagonia',
    overview:
      'Buenos Aires evenings, Mendoza vineyards, and glacier landscapes — Argentina is passionate and grand.',
    image: img.argentina,
    languages: 'Spanish',
    highlights: ['Buenos Aires', 'Mendoza', 'Patagonia', 'Iguazú'],
  }),
  country({
    id: 'country-costa-rica',
    continentId: 'cont-americas',
    continentSlug: 'americas',
    slug: 'costa-rica',
    name: 'Costa Rica',
    tagline: 'Rainforest luxury and pura vida',
    overview:
      'Eco-lodges, Pacific surf coasts, and cloud-forest wildlife — Costa Rica is nature, elevated.',
    image: img.costaRica,
    languages: 'Spanish',
    highlights: ['Arenal', 'Manuel Antonio', 'Peninsula Papagayo'],
  }),

  // Asia & Middle East
  country({
    id: 'country-japan',
    continentId: 'cont-asia',
    continentSlug: 'asia',
    slug: 'japan',
    name: 'Japan',
    tagline: 'Where ancient rituals meet the cities of tomorrow.',
    overview:
      'Discover the magic of Japan — from neon-lit Tokyo to temple gardens in Kyoto, onsen towns in Hakone, and the quiet grace of rural ryokan stays.',
    image: img.japan,
    bestTimeToVisit: 'March – May, October – November',
    currency: 'Japanese Yen (JPY)',
    languages: 'Japanese',
    timezone: 'JST (UTC+9)',
    visaInfo: 'Many nationalities are visa-exempt for short stays.',
    weather: 'Four distinct seasons; cherry blossom and autumn foliage peak.',
    highlights: [
      'Private tea ceremonies',
      'Bullet train journeys',
      'Ryokan with kaiseki dining',
      'Mt Fuji views',
    ],
  }),
  country({
    id: 'country-thailand',
    continentId: 'cont-asia',
    continentSlug: 'asia',
    slug: 'thailand',
    name: 'Thailand',
    tagline: 'Temples, islands, and quiet luxury',
    overview:
      'Bangkok’s pulse, Chiang Mai’s temples, and Andaman island hideaways — Thailand remains endlessly beguiling.',
    image: img.thailand,
    currency: 'Thai Baht (THB)',
    languages: 'Thai',
    highlights: ['Bangkok', 'Chiang Mai', 'Phuket', 'Koh Samui'],
  }),
  country({
    id: 'country-indonesia',
    continentId: 'cont-asia',
    continentSlug: 'asia',
    slug: 'indonesia',
    name: 'Indonesia',
    tagline: 'Bali and beyond',
    overview:
      'Villa living in Bali, Komodo adventures, and Java’s cultural depth — Indonesia is an archipelago of dreams.',
    image: img.bali,
    currency: 'Indonesian Rupiah (IDR)',
    languages: 'Indonesian',
    highlights: ['Bali', 'Ubud', 'Komodo', 'Jakarta'],
  }),
  country({
    id: 'country-philippines',
    continentId: 'cont-asia',
    continentSlug: 'asia',
    slug: 'philippines',
    name: 'Philippines',
    tagline: 'Island chains and turquoise seas',
    overview:
      'Palawan lagoons, private island resorts, and warm hospitality — the Philippines is a tropical revelation.',
    image: img.maldives,
    currency: 'Philippine Peso (PHP)',
    languages: 'Filipino, English',
    highlights: ['Palawan', 'Cebu', 'Boracay'],
  }),
  country({
    id: 'country-vietnam',
    continentId: 'cont-asia',
    continentSlug: 'asia',
    slug: 'vietnam',
    name: 'Vietnam',
    tagline: 'From Ha Long to Hoi An',
    overview:
      'French-colonial elegance, lantern-lit towns, and dramatic coastline — Vietnam is a sensory journey.',
    image: img.vietnam,
    currency: 'Vietnamese Dong (VND)',
    languages: 'Vietnamese',
    highlights: ['Hanoi', 'Ha Long Bay', 'Hoi An', 'Saigon'],
  }),
  country({
    id: 'country-south-korea',
    continentId: 'cont-asia',
    continentSlug: 'asia',
    slug: 'south-korea',
    name: 'South Korea',
    tagline: 'Seoul energy and temple calm',
    overview:
      'Design-forward Seoul, Jeju’s coasts, and palace culture — South Korea balances tradition and tomorrow.',
    image: img.tokyo,
    currency: 'South Korean Won (KRW)',
    languages: 'Korean',
    highlights: ['Seoul', 'Busan', 'Jeju'],
  }),
  country({
    id: 'country-china',
    continentId: 'cont-asia',
    continentSlug: 'asia',
    slug: 'china',
    name: 'China',
    tagline: 'Imperial cities and dramatic landscapes',
    overview:
      'Beijing’s Forbidden City, Shanghai’s skyline, and Guilin’s karst peaks — China rewards ambitious journeys.',
    image: img.fuji,
    currency: 'Chinese Yuan (CNY)',
    languages: 'Mandarin',
    highlights: ['Beijing', 'Shanghai', 'Guilin', 'Chengdu'],
  }),
  country({
    id: 'country-maldives',
    continentId: 'cont-asia',
    continentSlug: 'asia',
    slug: 'maldives',
    name: 'Maldives',
    tagline: 'Overwater serenity',
    overview:
      'Private-island resorts, lagoon villas, and reef diving — the Maldives is the ultimate ocean escape.',
    image: img.maldives,
    currency: 'Maldivian Rufiyaa (MVR)',
    languages: 'Dhivehi, English',
    highlights: ['Private islands', 'Overwater villas', 'House reefs'],
  }),
  country({
    id: 'country-india',
    continentId: 'cont-asia',
    continentSlug: 'asia',
    slug: 'india',
    name: 'India',
    tagline: 'Palaces, wildlife, and living culture',
    overview:
      'Rajasthan’s forts, Kerala’s backwaters, and tiger reserves — India is immersive, layered, and unforgettable.',
    image: img.machu,
    currency: 'Indian Rupee (INR)',
    languages: 'Hindi, English, and more',
    highlights: ['Rajasthan', 'Kerala', 'Agra', 'Goa'],
  }),
  country({
    id: 'country-nepal',
    continentId: 'cont-asia',
    continentSlug: 'asia',
    slug: 'nepal',
    name: 'Nepal',
    tagline: 'Himalayan grandeur',
    overview:
      'Kathmandu’s temples, Himalayan lodges, and mountain light — Nepal is spiritual and spectacular.',
    image: img.swiss,
    currency: 'Nepalese Rupee (NPR)',
    languages: 'Nepali',
    highlights: ['Kathmandu', 'Pokhara', 'Everest region'],
  }),
  country({
    id: 'country-sri-lanka',
    continentId: 'cont-asia',
    continentSlug: 'asia',
    slug: 'sri-lanka',
    name: 'Sri Lanka',
    tagline: 'Tea country and wild coasts',
    overview:
      'Colonial tea estates, leopard safaris, and Indian Ocean beaches — Sri Lanka is compact and captivating.',
    image: img.thailand,
    currency: 'Sri Lankan Rupee (LKR)',
    languages: 'Sinhala, Tamil, English',
    highlights: ['Galle', 'Hill Country', 'Yala', 'Sigiriya'],
  }),
  country({
    id: 'country-uae',
    continentId: 'cont-asia',
    continentSlug: 'asia',
    slug: 'united-arab-emirates',
    name: 'United Arab Emirates',
    tagline: 'Desert luxury and futuristic cities',
    overview:
      'Dubai’s skyline, Abu Dhabi’s culture, and desert resorts — the UAE is ultra-contemporary luxury.',
    image: img.dubai,
    currency: 'UAE Dirham (AED)',
    languages: 'Arabic, English',
    highlights: ['Dubai', 'Abu Dhabi', 'Desert resorts'],
  }),
  country({
    id: 'country-jordan',
    continentId: 'cont-asia',
    continentSlug: 'asia',
    slug: 'jordan',
    name: 'Jordan',
    tagline: 'Petra and the desert rose',
    overview:
      'Petra at dawn, Wadi Rum camps, and Dead Sea stillness — Jordan is ancient and awe-inspiring.',
    image: img.egypt,
    currency: 'Jordanian Dinar (JOD)',
    languages: 'Arabic, English',
    highlights: ['Petra', 'Wadi Rum', 'Amman', 'Dead Sea'],
  }),

  // Africa
  country({
    id: 'country-kenya',
    continentId: 'cont-africa',
    continentSlug: 'africa',
    slug: 'kenya',
    name: 'Kenya',
    tagline: 'The classic safari',
    overview:
      'Maasai Mara migrations, private conservancies, and Indian Ocean coast — Kenya is Africa at its most iconic.',
    image: img.safari,
    currency: 'Kenyan Shilling (KES)',
    languages: 'English, Swahili',
    highlights: ['Maasai Mara', 'Amboseli', 'Laikipia'],
  }),
  country({
    id: 'country-tanzania',
    continentId: 'cont-africa',
    continentSlug: 'africa',
    slug: 'tanzania',
    name: 'Tanzania',
    tagline: 'Serengeti and spice islands',
    overview:
      'Serengeti plains, Ngorongoro crater, and Zanzibar’s shores — Tanzania is the ultimate East African journey.',
    image: img.africa,
    currency: 'Tanzanian Shilling (TZS)',
    languages: 'English, Swahili',
    highlights: ['Serengeti', 'Ngorongoro', 'Zanzibar'],
  }),
  country({
    id: 'country-south-africa',
    continentId: 'cont-africa',
    continentSlug: 'africa',
    slug: 'south-africa',
    name: 'South Africa',
    tagline: 'Safari, wine, and Cape drama',
    overview:
      'Cape Town’s mountain-meets-ocean beauty, winelands, and Big Five reserves — South Africa is wonderfully diverse.',
    image: img.safari,
    currency: 'South African Rand (ZAR)',
    languages: 'English, Afrikaans, and more',
    highlights: ['Cape Town', 'Kruger', 'Winelands'],
  }),
  country({
    id: 'country-morocco',
    continentId: 'cont-africa',
    continentSlug: 'africa',
    slug: 'morocco',
    name: 'Morocco',
    tagline: 'Where tradition meets adventure',
    overview:
      'Discover the soul of Morocco — labyrinthine medinas, Atlas mountain passes, desert camps under endless stars, and riads of quiet luxury.',
    image: img.morocco,
    bestTimeToVisit: 'March – May, September – November',
    currency: 'Moroccan Dirham (MAD)',
    languages: 'Arabic, French',
    timezone: 'GMT+1',
    visaInfo: 'Many nationalities visa-free for up to 90 days.',
    weather: 'Warm days, cool nights inland; mild coastal climate.',
    highlights: [
      'Marrakech medina',
      'Sahara camel treks',
      'Fes artisan souks',
      'Chefchaouen blue streets',
    ],
  }),
  country({
    id: 'country-egypt',
    continentId: 'cont-africa',
    continentSlug: 'africa',
    slug: 'egypt',
    name: 'Egypt',
    tagline: 'Nile legends and Red Sea light',
    overview:
      'Luxor temples, Nile cruises, and Cairo’s museums — Egypt is history lived at monumental scale.',
    image: img.egypt,
    currency: 'Egyptian Pound (EGP)',
    languages: 'Arabic',
    highlights: ['Cairo', 'Luxor', 'Aswan', 'Red Sea'],
  }),
  country({
    id: 'country-mauritius',
    continentId: 'cont-africa',
    continentSlug: 'africa',
    slug: 'mauritius',
    name: 'Mauritius',
    tagline: 'Lagoon living, refined',
    overview:
      'Powder beaches, luxury resorts, and gentle island rhythm — Mauritius is the Indian Ocean’s polished escape.',
    image: img.maldives,
    currency: 'Mauritian Rupee (MUR)',
    languages: 'English, French, Creole',
    highlights: ['West coast resorts', 'Le Morne', 'Port Louis'],
  }),
  country({
    id: 'country-seychelles',
    continentId: 'cont-africa',
    continentSlug: 'africa',
    slug: 'seychelles',
    name: 'Seychelles',
    tagline: 'Granite islands and private beaches',
    overview:
      'Palm-framed coves, villa resorts, and rare wildlife — Seychelles is quiet ultra-luxury.',
    image: img.oceania,
    currency: 'Seychellois Rupee (SCR)',
    languages: 'English, French, Creole',
    highlights: ['Mahé', 'Praslin', 'La Digue'],
  }),

  // Europe
  country({
    id: 'country-italy',
    continentId: 'cont-europe',
    continentSlug: 'europe',
    slug: 'italy',
    name: 'Italy',
    tagline: 'La dolce vita, perfected',
    overview:
      'Art, cuisine, and coastline — Italy remains the ultimate European escape for discerning travellers.',
    image: img.amalfi,
    bestTimeToVisit: 'April – June, September – October',
    currency: 'Euro (EUR)',
    languages: 'Italian',
    timezone: 'CET (UTC+1)',
    visaInfo: 'Schengen visa rules apply.',
    weather: 'Mediterranean climate; hot summers in the south.',
    highlights: ['Amalfi Coast', 'Tuscany', 'Venice', 'Rome'],
  }),
  country({
    id: 'country-switzerland',
    continentId: 'cont-europe',
    continentSlug: 'europe',
    slug: 'switzerland',
    name: 'Switzerland',
    tagline: 'Alpine precision and lake light',
    overview:
      'Mountain trains, lakeside towns, and chalet winters — Switzerland is elegant nature, perfectly arranged.',
    image: img.swiss,
    currency: 'Swiss Franc (CHF)',
    languages: 'German, French, Italian',
    highlights: ['Zermatt', 'Lucerne', 'Interlaken', 'Lake Geneva'],
  }),
  country({
    id: 'country-iceland',
    continentId: 'cont-europe',
    continentSlug: 'europe',
    slug: 'iceland',
    name: 'Iceland',
    tagline: 'Fire, ice, and northern skies',
    overview:
      'Glaciers, geothermal lagoons, and otherworldly landscapes — Iceland is elemental luxury.',
    image: img.iceland,
    currency: 'Icelandic Króna (ISK)',
    languages: 'Icelandic, English',
    highlights: ['Reykjavík', 'Golden Circle', 'South Coast', 'Blue Lagoon'],
  }),
  country({
    id: 'country-norway',
    continentId: 'cont-europe',
    continentSlug: 'europe',
    slug: 'norway',
    name: 'Norway',
    tagline: 'Fjords and Arctic light',
    overview:
      'Dramatic fjords, design hotels, and northern lights — Norway is Scandinavian wilderness refined.',
    image: img.norway,
    languages: 'Norwegian, English',
    highlights: ['Bergen', 'Fjords', 'Lofoten', 'Oslo'],
  }),
  country({
    id: 'country-finland',
    continentId: 'cont-europe',
    continentSlug: 'europe',
    slug: 'finland',
    name: 'Finland',
    tagline: 'Sauna, silence, and aurora',
    overview:
      'Glass igloos, lakeland calm, and design-led Helsinki — Finland is Nordic serenity.',
    image: img.finland,
    highlights: ['Lapland', 'Helsinki', 'Lakeland'],
  }),
  country({
    id: 'country-greece',
    continentId: 'cont-europe',
    continentSlug: 'europe',
    slug: 'greece',
    name: 'Greece',
    tagline: 'Islands, light, and myth',
    overview:
      'Cycladic whites, private yacht days, and mainland history — Greece is Mediterranean magic.',
    image: img.greece,
    currency: 'Euro (EUR)',
    languages: 'Greek',
    highlights: ['Santorini', 'Mykonos', 'Athens', 'Crete'],
  }),
  country({
    id: 'country-spain',
    continentId: 'cont-europe',
    continentSlug: 'europe',
    slug: 'spain',
    name: 'Spain',
    tagline: 'Architecture, wine, and late nights',
    overview:
      'Barcelona’s design, Andalusian soul, and Rioja vineyards — Spain is culture with warmth.',
    image: img.spain,
  }),
  country({
    id: 'country-portugal',
    continentId: 'cont-europe',
    continentSlug: 'europe',
    slug: 'portugal',
    name: 'Portugal',
    tagline: 'Atlantic light and tiled cities',
    overview:
      'Lisbon hills, Algarve cliffs, and Douro wine estates — Portugal is quietly irresistible.',
    image: img.portugal,
  }),
  country({
    id: 'country-france',
    continentId: 'cont-europe',
    continentSlug: 'europe',
    slug: 'france',
    name: 'France',
    tagline: 'The art of living well',
    overview:
      'Parisian elegance, Provençal light, and Alpine chalets — France remains the benchmark of refined travel.',
    image: img.france,
  }),
  country({
    id: 'country-austria',
    continentId: 'cont-europe',
    continentSlug: 'europe',
    slug: 'austria',
    name: 'Austria',
    tagline: 'Imperial cities and Alpine air',
    overview:
      'Vienna’s grandeur, Salzburg’s charm, and mountain resorts — Austria is cultured and crisp.',
    image: img.austria,
    currency: 'Euro (EUR)',
    languages: 'German',
    highlights: ['Vienna', 'Salzburg', 'Tyrol'],
  }),

  // Oceania & Pacific
  country({
    id: 'country-australia',
    continentId: 'cont-oceania',
    continentSlug: 'oceania',
    slug: 'australia',
    name: 'Australia',
    tagline: 'Coast, outback, and city polish',
    overview:
      'Sydney Harbour, Great Barrier Reef, and vineyard country — Australia is vast and brilliantly liveable.',
    image: img.australia,
    currency: 'Australian Dollar (AUD)',
    languages: 'English',
    highlights: ['Sydney', 'Melbourne', 'Great Barrier Reef', 'Uluru'],
  }),
  country({
    id: 'country-new-zealand',
    continentId: 'cont-oceania',
    continentSlug: 'oceania',
    slug: 'new-zealand',
    name: 'New Zealand',
    tagline: 'Landscapes that steal the scene',
    overview:
      'Fiordland drama, vineyard lodges, and Māori culture — New Zealand is nature’s masterpiece.',
    image: img.nz,
    currency: 'New Zealand Dollar (NZD)',
    languages: 'English, Māori',
    highlights: ['Queenstown', 'Milford Sound', 'Auckland', 'Bay of Islands'],
  }),
  country({
    id: 'country-french-polynesia',
    continentId: 'cont-oceania',
    continentSlug: 'oceania',
    slug: 'french-polynesia',
    name: 'French Polynesia',
    tagline: 'Overwater romance in the South Pacific',
    overview:
      'Bora Bora lagoons, private motu picnics, and pearl-blue water — French Polynesia is pure escape.',
    image: img.polynesia,
    currency: 'CFP Franc (XPF)',
    languages: 'French, Tahitian',
    highlights: ['Bora Bora', 'Tahiti', 'Moorea'],
  }),
  country({
    id: 'country-fiji',
    continentId: 'cont-oceania',
    continentSlug: 'oceania',
    slug: 'fiji',
    name: 'Fiji',
    tagline: 'Warm seas and island welcome',
    overview:
      'Private island resorts, coral reefs, and legendary hospitality — Fiji is Pacific joy.',
    image: img.oceania,
    currency: 'Fijian Dollar (FJD)',
    languages: 'English, Fijian',
    highlights: ['Mamanuca Islands', 'Yasawa', 'Coral Coast'],
  }),
];

export const destinations: DemoDestination[] = [
  ...continents,
  ...countries,
  ...(destinationCities as DemoDestination[]),
];

export const hotels: DemoHotel[] = [
  {
    id: 'hotel-aman-tokyo',
    slug: 'aman-tokyo',
    name: 'Aman Tokyo',
    locationLabel: 'Otemachi, Tokyo',
    description:
      'A sanctuary above the city — serene design, exceptional service, and a spa dedicated to Japanese rituals.',
    starRating: 5,
    image: img.hotel,
    destinationId: 'city-tokyo',
    amenities: ['Spa', 'Michelin dining', 'City views', 'Concierge'],
  },
  {
    id: 'hotel-aman-kyoto',
    slug: 'aman-kyoto',
    name: 'Aman Kyoto',
    locationLabel: 'Hidden garden, Kyoto',
    description:
      'Nestled in a secret garden, Aman Kyoto offers pavilion living among ancient woodland.',
    starRating: 5,
    image: img.hotel,
    destinationId: 'city-kyoto',
    amenities: ['Onsen', 'Forest walks', 'Kaiseki', 'Spa'],
  },
  {
    id: 'hotel-royal-mansour',
    slug: 'royal-mansour-marrakech',
    name: 'Royal Mansour Marrakech',
    locationLabel: 'Marrakech Medina',
    description:
      'Private riads, extraordinary craftsmanship, and hospitality at the highest level.',
    starRating: 5,
    image: img.hotel,
    destinationId: 'city-marrakech',
    amenities: ['Private riads', 'Spa', 'Fine dining', 'Butler service'],
  },
];

export const experiences: DemoExperience[] = [
  {
    id: 'exp-safari',
    slug: 'safari',
    name: 'Safari',
    tagline: 'Wilderness, privately guided',
    description:
      'Exclusive camps, expert naturalists, and golden-hour game drives across Africa’s great reserves.',
    category: 'safari',
    image: img.safari,
  },
  {
    id: 'exp-cruises',
    slug: 'luxury-cruises',
    name: 'Luxury Cruises',
    tagline: 'The ocean, reimagined',
    description:
      'Small-ship voyages and private yacht charters with curated shore experiences.',
    category: 'luxury_cruises',
    image: img.cruise,
  },
  {
    id: 'exp-train',
    slug: 'luxury-train',
    name: 'Luxury Train',
    tagline: 'Travel as the destination',
    description:
      'Iconic rail journeys with suites, fine dining, and panoramic landscapes.',
    category: 'luxury_train',
    image: img.train,
  },
  {
    id: 'exp-wellness',
    slug: 'wellness',
    name: 'Wellness',
    tagline: 'Restore in extraordinary places',
    description:
      'Retreats combining spa rituals, mindfulness, and restorative landscapes.',
    category: 'wellness',
    image: img.wellness,
  },
  {
    id: 'exp-culture',
    slug: 'culture',
    name: 'Culture',
    tagline: 'Access, insight, immersion',
    description:
      'Private openings, artisan workshops, and encounters that reveal a destination’s soul.',
    category: 'culture',
    image: img.japan,
  },
  {
    id: 'exp-food',
    slug: 'food-wine',
    name: 'Food & Wine',
    tagline: 'Tables worth travelling for',
    description:
      'Chef’s tables, vineyard stays, and culinary journeys designed around exceptional producers.',
    category: 'food_wine',
    image: img.amalfi,
  },
];

export const collections: DemoCollection[] = [
  {
    id: 'col-bucket',
    slug: 'bucket-list',
    name: 'Bucket List',
    tagline: 'Once-in-a-lifetime journeys',
    description: 'The trips you have always dreamed of — elevated and effortless.',
    image: img.machu,
  },
  {
    id: 'col-ultra',
    slug: 'ultra-luxury',
    name: 'Ultra Luxury',
    tagline: 'The highest expression of travel',
    description: 'Private jets, iconic hotels, and access without compromise.',
    image: img.hotel,
  },
  {
    id: 'col-family',
    slug: 'family-collection',
    name: 'Family Collection',
    tagline: 'Memorable for every generation',
    description: 'Thoughtful pacing, connecting rooms, and experiences children love.',
    image: img.oceania,
  },
  {
    id: 'col-winter',
    slug: 'winter-escapes',
    name: 'Winter Escapes',
    tagline: 'Firelight, powder, and hush',
    description: 'Alpine chalets, northern lights, and warm-weather winter sun.',
    image: img.fuji,
  },
];

export const itineraries: DemoItinerary[] = [
  {
    id: 'itin-japan-highlights',
    slug: 'japan-highlights',
    title: 'Neon Cities & Ancient Souls',
    summary:
      'A twelve-day signature journey through Japan — from Tokyo’s electric energy to Hakone’s quiet onsen, Kyoto’s temples, Nara’s sacred park, and Osaka’s night-time soul.',
    citiesLabel: 'Tokyo · Hakone · Kyoto · Nara · Osaka',
    countryName: 'Japan',
    durationDays: 12,
    priceFrom: 8900,
    currency: 'EUR',
    image: img.japan,
    destinationIds: ['country-japan', 'city-tokyo', 'city-kyoto'],
    placesLabel: 'Five places. One curated journey.',
    glanceStops: [
      { label: 'Tokyo', detail: '4 nights', icon: 'city' },
      { label: 'Hakone', detail: '1 night', icon: 'mountain' },
      { label: 'Kyoto', detail: '4 nights', icon: 'temple' },
      { label: 'Nara', detail: 'day trip', icon: 'nature' },
      { label: 'Osaka', detail: '2 nights', icon: 'port' },
    ],
    places: [
      {
        number: '01',
        title: 'The Energy — Tokyo',
        subtitle: '4 nights',
        description:
          'Dive into neighbourhoods that never sleep — from quiet shrine paths to neon avenues, private sushi counters, and design-led hotels above the city.',
        highlights: [
          'Private guide through Meiji Shrine & Omotesando',
          'Sushi counter lunch with a local host',
          'Evening in Golden Gai or a jazz bar',
          'Luxury stay in Otemachi / Ginza',
        ],
        image: img.tokyo,
        nights: '4 nights',
      },
      {
        number: '02',
        title: 'The Stillness — Hakone',
        subtitle: '1 night',
        description:
          'Trade the skyline for mountain mist. Lake Ashi views, onsen rituals, and kaiseki dining restore the pace before Kyoto.',
        highlights: [
          'Scenic transfer from Tokyo',
          'Onsen soak with mountain views',
          'Kaiseki dinner at your ryokan',
          'Optional Lake Ashi cruise',
        ],
        image: img.fuji,
        nights: '1 night',
      },
      {
        number: '03',
        title: 'The Soul — Kyoto',
        subtitle: '4 nights',
        description:
          'Temple gardens, tea houses, and lantern-lit alleys. Kyoto is Japan’s cultural heart — paced slowly, with private access where it matters.',
        highlights: [
          'Private tea ceremony',
          'Arashiyama bamboo & temples',
          'Gion evening walk',
          'Kaiseki or chef’s table dining',
        ],
        image: img.kyoto,
        nights: '4 nights',
      },
      {
        number: '04',
        title: 'The Sacred — Nara',
        subtitle: 'Day trip',
        description:
          'A gentle day among deer, great Buddha halls, and parkland calm — the perfect counterpoint to Kyoto’s density.',
        highlights: [
          'Todai-ji & Nara Park',
          'Private guide option',
          'Quiet lunch near the park',
          'Return to Kyoto by early evening',
        ],
        image: img.japan,
        nights: 'Day trip',
      },
      {
        number: '05',
        title: 'The Appetite — Osaka',
        subtitle: '2 nights',
        description:
          'End on a high — street food, river lights, and a city that lives for flavour. Osaka is joyful, generous, and unforgettable.',
        highlights: [
          'Dotonbori night walk',
          'Private food experience',
          'Optional day trip to Himeji',
          'Departure transfer',
        ],
        image: img.tokyo,
        nights: '2 nights',
      },
    ],
    days: [
      {
        day: 1,
        title: 'Arrive Tokyo',
        body: 'Private airport transfer to your hotel. Evening neighbourhood walk and a welcome dinner nearby.',
      },
      {
        day: 2,
        title: 'Tokyo immersion',
        body: 'Private guide through Meiji Shrine, Omotesando, and a sushi counter lunch. Free evening for jazz or Golden Gai.',
      },
      {
        day: 3,
        title: 'Tokyo at your pace',
        body: 'Optional museum morning or shopping. Afternoon reserved for a private experience of your choice.',
      },
      {
        day: 4,
        title: 'Hakone onsen',
        body: 'Journey to Hakone for lake views, onsen rituals, and kaiseki dining at a refined ryokan.',
      },
      {
        day: 5,
        title: 'Kyoto arrival',
        body: 'Travel to Kyoto. Settle into your hotel and evening stroll through Gion or Pontocho.',
      },
      {
        day: 6,
        title: 'Temples & gardens',
        body: 'Early private temple visits before crowds, followed by a tea house pause and free afternoon.',
      },
      {
        day: 7,
        title: 'Kyoto craft & cuisine',
        body: 'Artisan workshop or textile visit, then a curated dinner highlighting Kyoto’s seasonal cuisine.',
      },
      {
        day: 8,
        title: 'Nara day journey',
        body: 'Day trip to Nara’s park and temples, returning to Kyoto for a quiet evening.',
      },
      {
        day: 9,
        title: 'Osaka nights',
        body: 'Transfer to Osaka. Dotonbori night walk and a private food experience.',
      },
      {
        day: 10,
        title: 'Osaka flavours',
        body: 'Morning at leisure or optional Himeji day trip. Farewell dinner in the city.',
      },
      {
        day: 11,
        title: 'Departure',
        body: 'Private transfer to the airport for your onward flight.',
      },
      {
        day: 12,
        title: 'Buffer / depart',
        body: 'Flexible morning for late departures or an optional final experience before flying home.',
      },
    ],
    included: [
      'Handpicked boutique hotels & ryokan',
      'Daily breakfast throughout',
      'Private transfers between cities',
      'Selected private experiences & guides',
      '24/7 journey support',
      'Internal train tickets (where relevant)',
    ],
    excluded: [
      'International flights',
      'Travel insurance',
      'Personal expenses & gratuities',
      'Meals not listed in the program',
      'Optional experiences booked locally',
    ],
    flights: [
      'International flights are not included and can be arranged on request',
      'Arrival into Tokyo (NRT or HND); departure from Osaka (KIX) or Tokyo',
      'All private airport transfers on arrival and departure are included',
      'Internal travel by private car and selected trains is included',
    ],
    departureDates: [
      'Private departures year-round (minimum 2 guests)',
      'Spring blossom window: late March – mid April',
      'Autumn foliage window: late October – mid November',
      'Summer & winter dates available on request',
    ],
    terms: [
      'Prices are per person based on two guests sharing, unless stated otherwise',
      'A deposit is required to confirm; balance due before departure as advised',
      'Itinerary order may flex for seasonal access, weather, or local conditions',
      'Cancellations and amendments follow our booking terms',
      'Travel insurance is strongly recommended for all guests',
    ],
    extensions: [
      {
        title: 'Koyasan Temple Stay',
        nights: '2 nights',
        description:
          'Sleep in a mountain monastery, join morning prayers, and taste shojin ryori cuisine.',
        image: img.kyoto,
      },
      {
        title: 'Hiroshima & Miyajima',
        nights: '2 nights',
        description:
          'Peace Memorial reflections and the floating torii of Itsukushima Shrine.',
        image: img.fuji,
      },
    ],
  },
  {
    id: 'itin-morocco-soul',
    slug: 'morocco-soul',
    title: 'Morocco Soul Journey',
    summary:
      'Medinas, mountains, and the Sahara across nine unforgettable days — riads, desert camps, and Atlas light.',
    citiesLabel: 'Marrakech · Atlas · Sahara · Fes',
    countryName: 'Morocco',
    durationDays: 9,
    priceFrom: 6200,
    currency: 'EUR',
    image: img.morocco,
    destinationIds: ['country-morocco', 'city-marrakech'],
    placesLabel: 'Four chapters. One soulful journey.',
    glanceStops: [
      { label: 'Marrakech', detail: '3 nights', icon: 'city' },
      { label: 'Atlas', detail: '1 night', icon: 'mountain' },
      { label: 'Sahara', detail: '2 nights', icon: 'desert' },
      { label: 'Fes', detail: '2 nights', icon: 'temple' },
    ],
    places: [
      {
        number: '01',
        title: 'The Pulse — Marrakech',
        subtitle: '3 nights',
        description:
          'Souks, palaces, and rooftop evenings in the Red City — settled into a private riad with quiet courtyards.',
        highlights: [
          'Private medina guide',
          'Majorelle Garden visit',
          'Rooftop sunset drinks',
          'Riad with courtyard calm',
        ],
        image: img.marrakech,
      },
      {
        number: '02',
        title: 'The Heights — Atlas',
        subtitle: '1 night',
        description:
          'Mountain passes, Berber villages, and cool air before the desert unfolds.',
        highlights: [
          'Scenic Atlas drive',
          'Village lunch',
          'Mountain lodge stay',
        ],
        image: img.morocco,
      },
      {
        number: '03',
        title: 'The Silence — Sahara',
        subtitle: '2 nights',
        description:
          'Dunes at golden hour, camel trails, and a luxury desert camp under endless stars.',
        highlights: [
          'Camel or 4x4 dune arrival',
          'Desert camp with private tent',
          'Sunrise over the erg',
        ],
        image: img.africa,
      },
      {
        number: '04',
        title: 'The Craft — Fes',
        subtitle: '2 nights',
        description:
          'The world’s great living medieval city — artisans, tanneries, and layered history.',
        highlights: [
          'Private medina walk',
          'Artisan workshops',
          'Departure from Fes or Casablanca',
        ],
        image: img.marrakech,
      },
    ],
    days: [
      {
        day: 1,
        title: 'Marrakech arrival',
        body: 'Private transfer to your riad. Sunset drinks overlooking the medina and a welcome dinner.',
      },
      {
        day: 2,
        title: 'Medina & gardens',
        body: 'Private guide through souks, palaces, and Majorelle Garden. Evening at leisure.',
      },
      {
        day: 3,
        title: 'Marrakech at pace',
        body: 'Optional cooking class or spa morning. Afternoon free for the medina or a quiet courtyard.',
      },
      {
        day: 4,
        title: 'Into the Atlas',
        body: 'Drive into the High Atlas for village walks, mint tea stops, and an overnight mountain lodge.',
      },
      {
        day: 5,
        title: 'Toward the Sahara',
        body: 'Continue toward the dunes. Arrive at camp for sunset, dinner under the stars, and a night in the desert.',
      },
      {
        day: 6,
        title: 'Desert dawn',
        body: 'Sunrise over the dunes, optional camel trek, and a second night at camp or a nearby kasbah.',
      },
      {
        day: 7,
        title: 'Road to Fes',
        body: 'Scenic transfer toward Fes with stops at kasbahs and viewpoints along the way.',
      },
      {
        day: 8,
        title: 'Fes medina',
        body: 'Private medina walk, artisan workshops, and a rooftop dinner above the old city.',
      },
      {
        day: 9,
        title: 'Departure',
        body: 'Private transfer to Fes or Casablanca airport for your flight home.',
      },
    ],
    included: [
      'Handpicked riads & desert camp',
      'Private driver-guide',
      'Selected meals',
      'Desert experience',
      '24/7 journey support',
    ],
    excluded: [
      'International flights',
      'Visa fees',
      'Gratuities',
      'Travel insurance',
      'Meals not listed in the program',
    ],
    flights: [
      'International flights are not included and can be arranged on request',
      'Recommended arrival into Marrakech (RAK); departure from Fes (FEZ) or Casablanca (CMN)',
      'All private airport transfers on arrival and departure are included',
      'Overland travel with a private driver is included throughout',
    ],
    departureDates: [
      'Private departures year-round (minimum 2 guests)',
      'Best season: March – May and September – November',
      'Summer desert dates available with adjusted pacing',
      'Ramadan and local holiday timing shared at booking',
    ],
    terms: [
      'Prices are per person based on two guests sharing, unless stated otherwise',
      'A deposit is required to confirm; balance due before departure as advised',
      'Desert camp and mountain lodges may vary with weather and access',
      'Cancellations and amendments follow our booking terms',
      'Travel insurance is strongly recommended for all guests',
    ],
    extensions: [
      {
        title: 'Essaouira Coast',
        nights: '2 nights',
        description: 'Atlantic breezes, ramparts, and seafood by the harbour.',
        image: img.oceania,
      },
      {
        title: 'Chefchaouen',
        nights: '2 nights',
        description: 'The blue pearl of the Rif — lanes, viewpoints, and slow mornings.',
        image: img.morocco,
      },
    ],
  },
  {
    id: 'itin-italy-coast',
    slug: 'amalfi-tuscany',
    title: 'Amalfi & Tuscany',
    summary:
      'Coastal glamour and countryside calm in one seamless Italian escape — cliffs, vineyards, and long lunches.',
    citiesLabel: 'Amalfi · Rome · Tuscany',
    countryName: 'Italy',
    durationDays: 10,
    priceFrom: 7500,
    currency: 'EUR',
    image: img.amalfi,
    destinationIds: ['country-italy', 'city-rome'],
    placesLabel: 'Three regions. One Italian dream.',
    glanceStops: [
      { label: 'Amalfi', detail: '4 nights', icon: 'coast' },
      { label: 'Rome', detail: '3 nights', icon: 'city' },
      { label: 'Tuscany', detail: '3 nights', icon: 'nature' },
    ],
    places: [
      {
        number: '01',
        title: 'The Coast — Amalfi',
        subtitle: '4 nights',
        description:
          'Cliffside hotels, lemon groves, and boat days along the most glamorous stretch of the Mediterranean.',
        highlights: [
          'Private boat along the coast',
          'Positano & Ravello',
          'Cliffside aperitivo',
        ],
        image: img.amalfi,
      },
      {
        number: '02',
        title: 'The Eternal — Rome',
        subtitle: '3 nights',
        description:
          'Private Vatican access, Trastevere evenings, and rooftop dining above the rooftops.',
        highlights: [
          'Private Vatican / Colosseum options',
          'Trastevere food walk',
          'Boutique stay near the historic centre',
        ],
        image: img.amalfi,
      },
      {
        number: '03',
        title: 'The Hills — Tuscany',
        subtitle: '3 nights',
        description:
          'Vineyard estates, cypress drives, and slow countryside mornings.',
        highlights: [
          'Wine tasting with a producer',
          'Countryside villa or boutique hotel',
          'Florence day option',
        ],
        image: img.greece,
      },
    ],
    days: [
      {
        day: 1,
        title: 'Amalfi arrival',
        body: 'Private transfer to your cliffside hotel. Sunset aperitivo overlooking the coast.',
      },
      {
        day: 2,
        title: 'Coast by boat',
        body: 'Private boat day along the Amalfi Coast with swimming stops and a seaside lunch.',
      },
      {
        day: 3,
        title: 'Positano & Ravello',
        body: 'Explore Positano and Ravello with a private driver, returning for a cliffside evening.',
      },
      {
        day: 4,
        title: 'Amalfi at leisure',
        body: 'Morning free for the beach or spa. Optional village walk before dinner.',
      },
      {
        day: 5,
        title: 'Rome arrival',
        body: 'Transfer to Rome. Boutique hotel check-in and Trastevere evening stroll.',
      },
      {
        day: 6,
        title: 'Rome icons',
        body: 'Private Vatican or Colosseum experience, then free afternoon for piazzas and espresso.',
      },
      {
        day: 7,
        title: 'Rome neighbourhoods',
        body: 'Guided food walk and time to explore at your own pace. Rooftop dinner option.',
      },
      {
        day: 8,
        title: 'Into Tuscany',
        body: 'Drive into the Tuscan hills. Settle into a countryside villa or boutique hotel.',
      },
      {
        day: 9,
        title: 'Wine & villages',
        body: 'Wine tasting with a producer and a leisurely lunch among the vines.',
      },
      {
        day: 10,
        title: 'Departure',
        body: 'Private transfer to Florence or Rome airport for your onward flight.',
      },
    ],
    included: [
      'Boutique hotels',
      'Private transfers',
      'Boat day',
      'Wine tasting',
      '24/7 journey support',
    ],
    excluded: [
      'International flights',
      'Travel insurance',
      'Personal expenses & gratuities',
      'Meals not listed in the program',
    ],
    flights: [
      'International flights are not included and can be arranged on request',
      'Recommended arrival into Naples (NAP) or Rome (FCO); departure from Florence (FLR) or Rome',
      'All private airport and intercity transfers are included',
      'Domestic flights are not required for this itinerary',
    ],
    departureDates: [
      'Private departures year-round (minimum 2 guests)',
      'Peak coast season: May – September',
      'Quieter spring & autumn windows recommended for Amalfi',
      'Christmas and Easter dates on request',
    ],
    terms: [
      'Prices are per person based on two guests sharing, unless stated otherwise',
      'A deposit is required to confirm; balance due before departure as advised',
      'Boat days and coastal transfers may flex with sea conditions',
      'Cancellations and amendments follow our booking terms',
      'Travel insurance is strongly recommended for all guests',
    ],
    extensions: [
      {
        title: 'Venice Interlude',
        nights: '2 nights',
        description: 'Private boat arrival and a quiet palazzo stay.',
        image: img.amalfi,
      },
      {
        title: 'Lake Como',
        nights: '3 nights',
        description: 'Villa gardens and ferry hops between elegant lakeside towns.',
        image: img.swiss,
      },
    ],
  },
];

export const blogPosts: DemoBlogPost[] = [
  {
    id: 'blog-1',
    slug: 'first-timers-japan',
    title: 'How to plan your first luxury journey to Japan',
    excerpt:
      'Pacing, seasons, and the stays that transform a first visit into something unforgettable.',
    body: '',
    image: img.blog,
    category: 'Inspiration',
    author: 'Elena Marquez',
    publishedAt: '2026-03-01',
  },
  {
    id: 'blog-2',
    slug: 'morocco-in-spring',
    title: 'Morocco in spring: the perfect shoulder season',
    excerpt:
      'Mild days, blooming valleys, and desert nights — why spring is our favourite time to go.',
    body: '',
    image: img.morocco,
    category: 'Destinations',
    author: 'James Okonkwo',
    publishedAt: '2026-02-18',
  },
  {
    id: 'blog-3',
    slug: 'private-villas-mediterranean',
    title: 'Private villas along the Mediterranean',
    excerpt: 'Staffed villas with chefs, boats, and absolute privacy for multi-generational travel.',
    body: '',
    image: img.amalfi,
    category: 'Stays',
    author: 'Sofia Rossi',
    publishedAt: '2026-02-05',
  },
];

export const testimonials: DemoTestimonial[] = [
  {
    id: 't1',
    authorName: 'Charlotte & Mark',
    authorLocation: 'London',
    quote:
      'Every detail felt intentional. Japan unfolded like a film — private, beautiful, and completely ours.',
    tripLabel: 'Japan Highlights',
    rating: 5,
  },
  {
    id: 't2',
    authorName: 'Amira H.',
    authorLocation: 'Dubai',
    quote:
      'The desert camp in Morocco was magical. We never once felt like we were managing logistics.',
    tripLabel: 'Morocco Soul Journey',
    rating: 5,
  },
  {
    id: 't3',
    authorName: 'The Patel Family',
    authorLocation: 'Singapore',
    quote:
      'A family trip that delighted both teenagers and grandparents. Rare and wonderfully done.',
    tripLabel: 'Family Collection · Italy',
    rating: 5,
  },
  {
    id: 't4',
    authorName: 'James R.',
    authorLocation: 'New York',
    quote:
      'From the first call to the final transfer, everything felt seamless. Our guide in Kyoto was exceptional.',
    tripLabel: 'Neon Cities & Ancient Souls',
    rating: 5,
  },
  {
    id: 't5',
    authorName: 'Sofia & Luca',
    authorLocation: 'Milan',
    quote:
      'The Amalfi boat day and Tuscan vineyard stay were highlights. Felt exclusive without being stuffy.',
    tripLabel: 'Amalfi & Tuscany',
    rating: 5,
  },
  {
    id: 't6',
    authorName: 'Elena V.',
    authorLocation: 'Paris',
    quote:
      'Support was calm and instant when our flight shifted. That alone made the journey feel truly private.',
    tripLabel: 'Morocco Soul Journey',
    rating: 5,
  },
];

export const enquiries: DemoEnquiry[] = [
  {
    id: 'enq-1',
    fullName: 'Oliver Bennett',
    email: 'oliver@example.com',
    phone: '+44 7700 900123',
    destination: 'Japan',
    travelDate: '2026-10-12',
    budget: '€15,000 – €20,000',
    adults: 2,
    children: 0,
    travelStyle: 'Ultra luxury',
    notes: 'Interested in cherry blossom alternative — autumn foliage.',
    status: 'new',
    createdAt: '2026-03-03T09:12:00Z',
  },
  {
    id: 'enq-2',
    fullName: 'Sara Klein',
    email: 'sara@example.com',
    phone: '+49 151 234567',
    destination: 'Morocco',
    travelDate: '2026-09-01',
    budget: '€8,000 – €12,000',
    adults: 2,
    children: 1,
    travelStyle: 'Family',
    notes: 'Need connecting rooms in Marrakech.',
    status: 'contacted',
    createdAt: '2026-03-02T14:40:00Z',
  },
  {
    id: 'enq-3',
    fullName: 'Nicolas Dupont',
    email: 'nicolas@example.com',
    phone: '+33 6 12 34 56 78',
    destination: 'Italy',
    travelDate: '2026-06-20',
    budget: '€10,000+',
    adults: 4,
    children: 0,
    travelStyle: 'Food & wine',
    notes: 'Anniversary trip with friends.',
    status: 'qualified',
    createdAt: '2026-03-01T11:05:00Z',
  },
];

export const faqs = [
  {
    id: 'faq-1',
    question: 'Are your journeys fully tailor-made?',
    answer:
      'Yes. Every itinerary is designed around your dates, interests, pace, and preferred style of travel.',
  },
  {
    id: 'faq-2',
    question: 'Do you arrange flights?',
    answer:
      'We can advise on the best routes and arrange flights where preferred, including private aviation.',
  },
  {
    id: 'faq-3',
    question: 'When should I start planning?',
    answer:
      'For peak seasons and ultra-luxury stays, we recommend 6–12 months ahead. Shorter timelines are often possible.',
  },
];

export const mediaFolders = [
  { id: 'folder-destinations', name: 'Destinations', slug: 'destinations' },
  { id: 'folder-hotels', name: 'Hotels', slug: 'hotels' },
  { id: 'folder-experiences', name: 'Experiences', slug: 'experiences' },
  { id: 'folder-heroes', name: 'Hero Images', slug: 'heroes' },
  { id: 'folder-blog', name: 'Blog', slug: 'blog' },
];

export const mediaAssets = [
  {
    id: 'media-1',
    folderId: 'folder-heroes',
    url: img.machu,
    alt: 'Machu Picchu at sunset',
    title: 'Hero Machu Picchu',
    mimeType: 'image/jpeg',
  },
  {
    id: 'media-2',
    folderId: 'folder-destinations',
    url: img.japan,
    alt: 'Mount Fuji and pagoda',
    title: 'Japan hero',
    mimeType: 'image/jpeg',
  },
  {
    id: 'media-3',
    folderId: 'folder-destinations',
    url: img.morocco,
    alt: 'Moroccan cityscape at sunset',
    title: 'Morocco hero',
    mimeType: 'image/jpeg',
  },
];

export const siteSettings = {
  brandName: 'Uncharted Journeys',
  phone: '+44 20 7946 0100',
  email: 'journeys@uncharted.example',
  address: 'Mayfair, London',
  socials: {
    instagram: 'https://instagram.com',
    facebook: 'https://facebook.com',
    linkedin: 'https://linkedin.com',
    telegram: 'https://t.me/',
    whatsapp: 'https://wa.me/442079460100',
  },
};

export function getDestinationBySlugPath(slugPath: string) {
  return destinations.find((d) => d.slugPath === slugPath);
}

export function getChildren(parentId: string) {
  return destinations.filter((d) => d.parentId === parentId);
}

export function getContinents() {
  return destinations.filter((d) => d.type === 'continent');
}
