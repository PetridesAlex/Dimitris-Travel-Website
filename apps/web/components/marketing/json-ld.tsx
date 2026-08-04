import { getSiteUrl } from '@/lib/site-url';

export function OrganizationJsonLd() {
  const data = {
    '@context': 'https://schema.org',
    '@type': 'TravelAgency',
    name: 'Uncharted Journeys',
    url: getSiteUrl(),
    description:
      'Tailor-made luxury journeys designed around you — cinematic, personal, and effortless.',
    areaServed: 'Worldwide',
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
    />
  );
}
