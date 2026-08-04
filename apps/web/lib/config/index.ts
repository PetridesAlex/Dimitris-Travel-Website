export const brand = {
  name: 'Uncharted Journeys',
  shortName: 'Uncharted',
  gold: '#c5a059',
  ink: '#0c0c0c',
  cream: '#f7f3eb',
} as const;

export const navLinks = [
  { href: '/', label: 'Home' },
  { href: '/destinations', label: 'Destinations', hasDropdown: true },
  { href: '/experiences', label: 'Experiences' },
  { href: '/collections', label: 'Special Collections' },
  { href: '/about', label: 'About Us' },
  { href: '/contact', label: 'Contact' },
] as const;

export const trustFeatures = [
  {
    title: 'Tailor-made Journeys',
    description: 'Every itinerary imagined around your pace, preferences, and private moments.',
    icon: 'compass',
  },
  {
    title: 'Flights & Routes',
    description: 'Thoughtful connections that turn the journey itself into part of the story.',
    icon: 'plane',
  },
  {
    title: 'Handpicked Stays',
    description: 'Distinguished hotels and villas chosen for character, quiet luxury, and care.',
    icon: 'bed',
  },
  {
    title: 'Private Transfers',
    description: 'Seamless door-to-door arrivals — composed, discreet, and effortless.',
    icon: 'car',
  },
  {
    title: 'Unique Experiences',
    description: 'Access beyond the ordinary — moments reserved for those who travel well.',
    icon: 'camera',
  },
  {
    title: '24/7 Support',
    description: 'A calm presence beside you, wherever the journey unfolds.',
    icon: 'headset',
  },
] as const;
