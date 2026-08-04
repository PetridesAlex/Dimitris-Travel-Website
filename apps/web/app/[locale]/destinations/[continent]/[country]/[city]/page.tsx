import { notFound } from 'next/navigation';
import { LazySection, RevealImage } from '@/components/motion/fade-in';
import Image from 'next/image';
import { Hero } from '@/components/marketing/hero';
import {
  Breadcrumbs,
  SectionHeading,
  CtaBand,
  HotelCard,
  ItineraryCard,
} from '@/components/marketing/sections';
import { OverviewPanel } from '@/components/marketing/overview-panel';
import { EnquiryForm } from '@/components/forms/enquiry-form';
import {
  destinationQueries,
  hotelQueries,
  itineraryQueries,
} from '@/features/catalog/queries';
import { resolveDestinationImage } from '@/lib/destination-images';

type Props = {
  params: Promise<{
    locale: string;
    continent: string;
    country: string;
    city: string;
  }>;
};

export async function generateStaticParams() {
  const all = await destinationQueries.getAll();
  return all
    .filter((d) => d.type === 'city')
    .map((c) => {
      const [continent, country, city] = c.slugPath.split('/');
      return { continent, country, city };
    })
    .filter((p) => p.continent && p.country && p.city);
}

export async function generateMetadata({ params }: Props) {
  const { continent, country, city } = await params;
  const dest = await destinationQueries.getBySlugPath(
    `${continent}/${country}/${city}`,
  );
  if (!dest) return {};
  return { title: dest.name, description: dest.overview };
}

export default async function CityPage({ params }: Props) {
  const { locale, continent, country, city } = await params;
  const dest = await destinationQueries.getBySlugPath(
    `${continent}/${country}/${city}`,
  );
  if (!dest || dest.type !== 'city') notFound();

  const [countryDest, continentDest, hotels, itineraries] = await Promise.all([
    destinationQueries.getBySlugPath(`${continent}/${country}`),
    destinationQueries.getBySlugPath(continent),
    hotelQueries.getByDestination(dest.id),
    itineraryQueries.getByDestination(dest.id),
  ]);

  return (
    <>
      <Hero
        eyebrow={countryDest?.name}
        title={dest.name}
        subtitle={dest.tagline}
        description={dest.overview}
        image={dest.image}
        imageAlt={dest.slug}
        primaryCta={{ label: 'Plan Your Journey', href: `/${locale}/plan-your-journey` }}
        secondaryCta={{ label: 'Contact Us', href: `/${locale}/contact` }}
        tall={false}
      />
      <Breadcrumbs
        items={[
          { label: 'Home', href: `/${locale}` },
          { label: 'Destinations', href: `/${locale}/destinations` },
          {
            label: continentDest?.name ?? continent,
            href: `/${locale}/destinations/${continent}`,
          },
          {
            label: countryDest?.name ?? country,
            href: `/${locale}/destinations/${continent}/${country}`,
          },
          { label: dest.name },
        ]}
      />

      <LazySection className="bg-[var(--color-cream)] px-6 py-24 lg:px-8">
        <div className="mx-auto grid max-w-7xl items-stretch gap-10 lg:grid-cols-2 lg:gap-14">
          <OverviewPanel
            title={`Discover ${dest.name}`}
            body={dest.overview}
            highlights={dest.highlights}
            facts={[
              { label: 'Best time', value: dest.bestTimeToVisit },
              { label: 'Languages', value: dest.languages },
              { label: 'Currency', value: dest.currency },
              { label: 'Timezone', value: dest.timezone },
            ]}
          />
          <RevealImage className="relative min-h-[420px] rounded-2xl lg:min-h-full">
            <Image
              src={resolveDestinationImage({
                image: dest.image,
                slug: dest.slug,
                slugPath: dest.slugPath,
                name: dest.name,
              })}
              alt={dest.name}
              fill
              className="object-cover"
              sizes="50vw"
              loading="lazy"
            />
          </RevealImage>
        </div>
      </LazySection>

      {hotels.length > 0 ? (
        <LazySection className="bg-[var(--color-ink)] px-6 py-20 lg:px-8">
          <div className="mx-auto max-w-7xl">
            <SectionHeading eyebrow="Stay" title="Luxury hotels" light />
            <div className="grid gap-8 md:grid-cols-3">
              {hotels.map((h) => (
                <HotelCard
                  key={h.id}
                  href={`/${locale}/hotels/${h.slug}`}
                  name={h.name}
                  locationLabel={h.locationLabel}
                  image={h.image}
                  starRating={h.starRating}
                />
              ))}
            </div>
          </div>
        </LazySection>
      ) : null}

      {itineraries.length > 0 ? (
        <LazySection className="bg-[var(--color-charcoal)] px-6 py-20 lg:px-8">
          <div className="mx-auto max-w-7xl">
            <SectionHeading eyebrow="Journeys" title="Suggested itineraries" light />
            <div className="grid gap-6 lg:grid-cols-3">
              {itineraries.map((itin) => (
                <ItineraryCard
                  key={itin.id}
                  href={`/${locale}/itineraries/${itin.slug}`}
                  title={itin.title}
                  citiesLabel={itin.citiesLabel}
                  durationDays={itin.durationDays}
                  priceFrom={itin.priceFrom}
                  currency={itin.currency}
                  image={itin.image}
                  summary={itin.summary}
                />
              ))}
            </div>
          </div>
        </LazySection>
      ) : null}

      <LazySection className="bg-[var(--color-ink)] px-6 py-20 lg:px-8">
        <div className="mx-auto max-w-3xl">
          <SectionHeading eyebrow="Enquire" title={`Visit ${dest.name}`} light />
          <EnquiryForm locale={locale} defaultDestination={dest.name} />
        </div>
      </LazySection>
      <CtaBand locale={locale} title={`Ready for ${dest.name}? Let's design your journey.`} />
    </>
  );
}
