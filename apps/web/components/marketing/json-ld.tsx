export function OrganizationJsonLd() {
  const data = {
    '@context': 'https://schema.org',
    '@type': 'TravelAgency',
    name: 'Uncharted Journeys',
    url: process.env.NEXT_PUBLIC_SITE_URL ?? 'http://localhost:3000',
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
