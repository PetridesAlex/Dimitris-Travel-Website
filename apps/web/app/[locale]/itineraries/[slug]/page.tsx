import { notFound } from 'next/navigation';
import {
  ItineraryHero,
  JourneyAtAGlance,
  ItineraryPlaces,
  IncludedExtensions,
  ItineraryEnquiry,
} from '@/components/itinerary/itinerary-detail';
import { itineraryQueries } from '@/features/catalog/queries';

type Props = { params: Promise<{ locale: string; slug: string }> };

export async function generateStaticParams() {
  const all = await itineraryQueries.getAll();
  return all.map((i) => ({ slug: i.slug }));
}

export async function generateMetadata({ params }: Props) {
  const { slug } = await params;
  const itin = await itineraryQueries.getBySlug(slug);
  if (!itin) return {};
  return { title: itin.title, description: itin.summary };
}

export default async function ItineraryDetailPage({ params }: Props) {
  const { locale, slug } = await params;
  const itin = await itineraryQueries.getBySlug(slug);
  if (!itin) notFound();

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'TouristTrip',
    name: itin.title,
    description: itin.summary,
    touristType: 'Luxury',
    offers: {
      '@type': 'Offer',
      price: itin.priceFrom,
      priceCurrency: itin.currency,
    },
  };

  return (
    <div className="bg-[var(--color-cream)]">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <ItineraryHero itinerary={itin} locale={locale} />
      <JourneyAtAGlance stops={itin.glanceStops} countryName={itin.countryName} />
      <ItineraryPlaces label={itin.placesLabel} places={itin.places} />
      <IncludedExtensions
        included={itin.included}
        extensions={itin.extensions}
        image={itin.image}
      />
      <ItineraryEnquiry
        locale={locale}
        title={itin.title}
        countryName={itin.countryName}
      />
    </div>
  );
}
