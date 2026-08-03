import {
  destinations,
  hotels,
  experiences,
  itineraries,
  collections,
  blogPosts,
  testimonials,
  faqs,
  enquiries,
  mediaAssets,
  mediaFolders,
  getDestinationBySlugPath,
  getChildren,
  getContinents,
} from '@/data/demo';

export const destinationQueries = {
  getContinents,
  getChildren,
  getBySlugPath: getDestinationBySlugPath,
  getAll: () => destinations,
  getFeatured: () => destinations.filter((d) => d.featured && d.type !== 'city'),
  getCountries: () => destinations.filter((d) => d.type === 'country'),
  getCitiesByCountry: (countryId: string) =>
    destinations.filter((d) => d.parentId === countryId && d.type === 'city'),
};

export const hotelQueries = {
  getAll: () => hotels,
  getBySlug: (slug: string) => hotels.find((h) => h.slug === slug),
  getByDestination: (destinationId: string) =>
    hotels.filter((h) => h.destinationId === destinationId),
};

export const experienceQueries = {
  getAll: () => experiences,
  getBySlug: (slug: string) => experiences.find((e) => e.slug === slug),
  getFeatured: () => experiences.slice(0, 6),
};

export const itineraryQueries = {
  getAll: () => itineraries,
  getBySlug: (slug: string) => itineraries.find((i) => i.slug === slug),
  getFeatured: () => itineraries,
  getByDestination: (destinationId: string) =>
    itineraries.filter((i) => i.destinationIds.includes(destinationId)),
};

export const collectionQueries = {
  getAll: () => collections,
  getBySlug: (slug: string) => collections.find((c) => c.slug === slug),
};

export const blogQueries = {
  getAll: () => blogPosts,
  getBySlug: (slug: string) => blogPosts.find((p) => p.slug === slug),
  getFeatured: () => blogPosts.slice(0, 3),
};

export const testimonialQueries = {
  getAll: () => testimonials,
};

export const faqQueries = {
  getAll: () => faqs,
};

export const enquiryQueries = {
  getAll: () => enquiries,
  getToday: () => {
    const today = new Date().toISOString().slice(0, 10);
    return enquiries.filter((e) => e.createdAt.startsWith(today));
  },
};

export const mediaQueries = {
  getFolders: () => mediaFolders,
  getAssets: () => mediaAssets,
  search: (q: string) =>
    mediaAssets.filter(
      (m) =>
        m.title.toLowerCase().includes(q.toLowerCase()) ||
        m.alt.toLowerCase().includes(q.toLowerCase()),
    ),
};
