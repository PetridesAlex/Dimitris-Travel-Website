/* eslint-disable @typescript-eslint/no-explicit-any */
import { notFound } from 'next/navigation';
import { LazySection, RevealImage } from '@/components/motion/fade-in';
import Link from 'next/link';
import Image from 'next/image';
import { Hero } from '@/components/marketing/hero';
import {
  Breadcrumbs,
  DestinationSubnav,
  SectionHeading,
  CtaBand,
  ItineraryCard,
  HotelCard,
} from '@/components/marketing/sections';
import { DestinationCard } from '@/components/marketing/destination-card';
import { OverviewPanel } from '@/components/marketing/overview-panel';
import { Button } from '@/components/ui/button';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';
import { EnquiryForm } from '@/components/forms/enquiry-form';
import {
  destinationQueries,
  experienceQueries,
  hotelQueries,
  itineraryQueries,
  faqQueries,
} from '@/features/catalog/queries';
import { resolveDestinationImage } from '@/lib/destination-images';

type Props = {
  params: Promise<{ locale: string; continent: string; country: string }>;
};

export async function generateStaticParams() {
  const countries = await destinationQueries.getCountries();
  return countries
    .map((c) => {
      const [continent, country] = c.slugPath.split('/');
      return { continent, country };
    })
    .filter((p) => p.continent && p.country);
}

export async function generateMetadata({ params }: Props) {
  const { continent, country } = await params;
  const dest = await destinationQueries.getBySlugPath(`${continent}/${country}`);
  if (!dest) return {};
  return {
    title: dest.name,
    description: dest.overview,
    openGraph: { images: [dest.image] },
  };
}

export default async function CountryPage({ params }: Props) {
  const { locale, continent, country } = await params;
  const dest = await destinationQueries.getBySlugPath(`${continent}/${country}`);
  if (!dest || dest.type !== 'country') notFound();

  const [
    parent,
    cities,
    allHotels,
    itineraries,
    featuredExperiences,
    faqs,
  ] = await Promise.all([
    destinationQueries.getBySlugPath(continent),
    destinationQueries.getCitiesByCountry(dest.id),
    hotelQueries.getAll(),
    itineraryQueries.getByDestination(dest.id),
    experienceQueries.getFeatured(),
    faqQueries.getAll(),
  ]);
  const hotels = allHotels.filter(
    (h) =>
      cities.some((c) => c.id === h.destinationId) || h.destinationId === dest.id,
  );
  const experiences = featuredExperiences.slice(0, 5);
  const journeyItineraries = itineraries.length
    ? itineraries
    : await itineraryQueries.getFeatured();

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'TouristDestination',
    name: dest.name,
    description: dest.overview,
    image: dest.image,
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <Hero
        eyebrow={parent?.name ?? 'Destination'}
        title={dest.name}
        subtitle={dest.tagline}
        description={dest.overview}
        image={dest.image}
        imageAlt={dest.slug}
        primaryCta={{ label: 'Explore the Journey', href: '#overview' }}
        secondaryCta={{ label: 'Contact Us', href: `/${locale}/contact` }}
        tall={false}
      />
      <Breadcrumbs
        items={[
          { label: 'Home', href: `/${locale}` },
          { label: 'Destinations', href: `/${locale}/destinations` },
          {
            label: parent?.name ?? continent,
            href: `/${locale}/destinations/${continent}`,
          },
          { label: dest.name },
        ]}
      />
      <DestinationSubnav
        items={[
          { id: 'overview', label: 'Overview' },
          { id: 'destinations', label: 'Destinations' },
          { id: 'experiences', label: 'Experiences' },
          { id: 'hotels', label: 'Hotels' },
          { id: 'journeys', label: 'Signature Journeys' },
          { id: 'faqs', label: 'Practical Info' },
          { id: 'enquiry', label: 'Gallery' },
        ]}
      />

      <LazySection id="overview" className="bg-[var(--color-cream)] px-6 py-24 lg:px-8">
        <div className="mx-auto grid max-w-7xl items-stretch gap-10 lg:grid-cols-2 lg:gap-14">
          <OverviewPanel
            title={`Discover the magic of ${dest.name}`}
            body={dest.overview}
            highlights={dest.highlights}
            facts={[
              { label: 'Best time to visit', value: dest.bestTimeToVisit },
              { label: 'Time zone', value: dest.timezone },
              { label: 'Language', value: dest.languages },
              { label: 'Visa', value: dest.visaInfo },
              { label: 'Currency', value: dest.currency },
              { label: 'Weather', value: dest.weather },
            ]}
            action={
              <Button asChild size="lg">
                <a href="#faqs">Practical Info</a>
              </Button>
            }
          />
          <RevealImage className="relative min-h-[480px] rounded-2xl lg:min-h-full">
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
            <div className="absolute inset-0 flex items-center justify-center bg-black/35">
              <div className="text-center">
                <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full border border-white/50 bg-white/10 text-white backdrop-blur-sm transition hover:border-[var(--color-gold)] hover:bg-[var(--color-gold)] hover:text-[var(--color-ink)]">
                  ▶
                </div>
                <p className="text-xs tracking-[0.2em] text-white uppercase">
                  Discover {dest.name} — Watch the video
                </p>
              </div>
            </div>
          </RevealImage>
        </div>
      </LazySection>

      <LazySection id="destinations" className="bg-[var(--color-ink)] px-6 py-20 lg:px-8">
        <div className="mx-auto max-w-7xl">
          <SectionHeading
            eyebrow="Top destinations"
            title={`Must-visit places in ${dest.name}`}
            description={
              cities.length
                ? `${cities.length} curated destinations — each chosen for character, access, and extraordinary stays.`
                : undefined
            }
            light
          />
          {cities.length > 0 ? (
            <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
              {cities.map((city, i) => (
                <DestinationCard
                  key={city.id}
                  href={`/${locale}/destinations/${city.slugPath}`}
                  name={city.name}
                  description={city.tagline}
                  image={city.image}
                  index={i}
                  eyebrow="Destination"
                />
              ))}
            </div>
          ) : (
            <p className="mt-8 max-w-xl text-sm leading-relaxed text-white/45">
              Destinations for {dest.name} are being curated. Explore the continent or plan a
              tailor-made journey with our designers.
            </p>
          )}
        </div>
      </LazySection>

      <LazySection id="experiences" className="bg-[var(--color-cream)] px-6 py-20 lg:px-8">
        <div className="mx-auto max-w-7xl">
          <SectionHeading
            eyebrow="Experiences"
            title="Handpicked experiences just for you"
          />
          <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-5">
            {experiences.map((e) => (
              <div key={e.id} className="text-center">
                <div className="mx-auto mb-4 h-12 w-12 rounded-full border border-[var(--color-gold)]/40 text-center leading-[48px] text-[var(--color-gold)]">
                  ✦
                </div>
                <h3 className="text-sm font-semibold tracking-widest text-[var(--color-ink)] uppercase">
                  {e.name}
                </h3>
                <p className="mt-2 text-xs text-[var(--color-muted)]">{e.tagline}</p>
              </div>
            ))}
          </div>
          <div className="mt-10 text-center">
            <Button asChild>
              <Link href={`/${locale}/experiences`}>See All Experiences</Link>
            </Button>
          </div>
        </div>
      </LazySection>

      <LazySection id="hotels" className="bg-[var(--color-ink)] px-6 py-20 lg:px-8">
        <div className="mx-auto max-w-7xl">
          <SectionHeading eyebrow="Stay" title={`Luxury hotels in ${dest.name}`} light />
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

      <LazySection id="journeys" className="bg-[var(--color-charcoal)] px-6 py-20 lg:px-8">
        <div className="mx-auto max-w-7xl">
          <SectionHeading
            eyebrow="Signature journeys"
            title="Journeys curated by Uncharted"
            light
          />
          <div className="grid gap-6 lg:grid-cols-3">
            {journeyItineraries
              .slice(0, 3)
              .map((itin) => (
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
          <div className="mt-10 text-center">
            <Button asChild variant="outline">
              <Link href={`/${locale}/itineraries`}>View More Journeys</Link>
            </Button>
          </div>
        </div>
      </LazySection>

      <LazySection id="faqs" className="bg-[var(--color-ink)] px-6 py-20 lg:px-8">
        <div className="mx-auto max-w-3xl">
          <SectionHeading eyebrow="Practical info" title="Frequently asked questions" light />
          <Accordion type="single" collapsible className="w-full">
            {faqs.map((faq: any) => (
              <AccordionItem key={faq.id} value={faq.id}>
                <AccordionTrigger>{faq.question}</AccordionTrigger>
                <AccordionContent>{faq.answer}</AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </div>
      </LazySection>

      <LazySection id="enquiry" className="bg-[var(--color-cream)] px-6 py-20 lg:px-8">
        <div className="mx-auto max-w-3xl">
          <SectionHeading
            eyebrow="Enquire"
            title={`Ready to explore ${dest.name}?`}
          />
          <div className="rounded-xl bg-[var(--color-ink)] p-2">
            <EnquiryForm locale={locale} defaultDestination={dest.name} />
          </div>
        </div>
      </LazySection>

      <CtaBand
        locale={locale}
        title={`Ready to explore ${dest.name}? Tell us your ideas and we'll design a tailor-made journey just for you.`}
      />
    </>
  );
}
