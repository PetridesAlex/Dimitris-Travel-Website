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
    description: 'Every itinerary crafted around you',
    icon: 'compass',
  },
  {
    title: 'Flights & Routes',
    description: 'Seamless global connections',
    icon: 'plane',
  },
  {
    title: 'Handpicked Stays',
    description: 'The finest hotels & villas',
    icon: 'bed',
  },
  {
    title: 'Private Transfers',
    description: 'Door-to-door comfort',
    icon: 'car',
  },
  {
    title: 'Unique Experiences',
    description: 'Access beyond the ordinary',
    icon: 'camera',
  },
  {
    title: '24/7 Support',
    description: 'Always by your side',
    icon: 'headset',
  },
] as const;
