export const contactMethods = ['Email', 'Phone', 'WhatsApp'] as const;

export const durations = [
  'Weekend',
  '7 Days',
  '10 Days',
  '2 Weeks',
  'Custom',
] as const;

export const flexibilityOptions = [
  'Exact dates',
  '±3 days',
  '±1 week',
] as const;

export const occasions = [
  'Honeymoon',
  'Anniversary',
  'Birthday',
  'Family Holiday',
  'Friends Escape',
  'Solo Journey',
  'Corporate',
  'Wellness Retreat',
  'Adventure',
  'Luxury Cruise',
  'Safari',
  'Celebration',
  'Proposal',
  'Other',
] as const;

export const travelStyles = [
  'Luxury Hotels',
  'Boutique Hotels',
  'Villas',
  'Private Islands',
  'Safari Lodges',
  'Cruises',
  'City Break',
  'Beach Escape',
  'Adventure',
  'Culture',
  'Food & Wine',
  'Wellness',
  'Shopping',
  'Nature',
] as const;

export const budgets = [
  '€5,000–€10,000',
  '€10,000–€20,000',
  '€20,000–€35,000',
  '€35,000+',
  'No fixed budget',
] as const;

export const accommodations = [
  '5★ Luxury',
  'Boutique',
  'Adults Only',
  'Family Friendly',
  'Private Villa',
  'Overwater Villa',
  'Safari Camp',
  'Yacht',
] as const;

export const cabinClasses = [
  'Economy',
  'Premium Economy',
  'Business',
  'First Class',
] as const;

export const flightExtras = [
  'Direct flights only',
  'Lounge access',
  'Flexible schedule',
] as const;

export const experiences = [
  'Private Guide',
  'Michelin Restaurants',
  'Wine Tasting',
  'Yacht Charter',
  'Helicopter Tour',
  'Hot Air Balloon',
  'Cooking Classes',
  'Hiking',
  'Diving',
  'Spa',
  'Golf',
  'Skiing',
  'Wildlife',
  'Local Experiences',
] as const;

export const transportOptions = [
  'Private Driver',
  'Luxury Transfers',
  'Chauffeur',
  'Rental Car',
  'Train',
  'Domestic Flights',
  'Private Jet',
] as const;

export const trustPoints = [
  { title: '100% Tailor-Made', detail: 'Every itinerary designed around you' },
  { title: 'Personal Journey Designer', detail: 'A dedicated specialist for your brief' },
  { title: 'Response within 24 hours', detail: 'We begin crafting promptly' },
  { title: 'No obligation quotation', detail: 'Explore freely before you commit' },
] as const;

export const stepMeta = [
  { id: 1, label: 'About you', title: 'Personal & journey details' },
  { id: 2, label: 'Travellers', title: 'Who is travelling' },
  { id: 3, label: 'Preferences', title: 'Style, stays & experiences' },
  { id: 4, label: 'Review', title: 'Confirm your brief' },
] as const;
