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
  ExperienceCard,
  ItineraryCard,
} from '@/components/marketing/sections';
import { OverviewPanel } from '@/components/marketing/overview-panel';
import { DestinationCard } from '@/components/marketing/destination-card';
import { Button } from '@/components/ui/button';
import { EnquiryForm } from '@/components/forms/enquiry-form';
import {
  destinationQueries,
  experienceQueries,
  itineraryQueries,
} from '@/features/catalog/queries';
import { resolveDestinationImage } from '@/lib/destination-images';

type Props = {
  params: Promise<{ locale: string; continent: string }>;
};

export async function generateStaticParams() {
  const continents = await destinationQueries.getContinents();
  return continents.map((c) => ({ continent: c.slug }));
}

export async function generateMetadata({ params }: Props) {
  const { continent } = await params;
  const dest = await destinationQueries.getBySlugPath(continent);
  if (!dest) return {};
  return {
    title: dest.name,
    description: dest.overview,
    openGraph: { images: [dest.image] },
  };
}

export default async function ContinentPage({ params }: Props) {
  const { locale, continent } = await params;
  const dest = await destinationQueries.getBySlugPath(continent);
  if (!dest || dest.type !== 'continent') notFound();

  const [children, featuredExperiences, featuredItineraries] = await Promise.all([
    destinationQueries.getChildren(dest.id),
    experienceQueries.getFeatured(),
    itineraryQueries.getFeatured(),
  ]);
  const experiences = featuredExperiences.slice(0, 3);
  const itineraries = featuredItineraries.slice(0, 3);

  return (
    <>
      <Hero
        eyebrow={dest.type === 'continent' ? 'Continent' : dest.name}
        title={dest.name}
        subtitle={dest.tagline}
        description={dest.overview}
        image={dest.image}
        imageAlt={dest.slug}
        primaryCta={{
          label: 'Explore the Journey',
          href: `#overview`,
        }}
        secondaryCta={{
          label: 'Contact Us',
          href: `/${locale}/contact`,
        }}
        tall={false}
      />
      <Breadcrumbs
        items={[
          { label: 'Home', href: `/${locale}` },
          { label: 'Destinations', href: `/${locale}/destinations` },
          { label: dest.name },
        ]}
      />
      <DestinationSubnav
        items={[
          { id: 'overview', label: 'Overview' },
          { id: 'destinations', label: 'Destinations' },
          { id: 'experiences', label: 'Experiences' },
          { id: 'journeys', label: 'Signature Journeys' },
          { id: 'enquiry', label: 'Plan Your Journey' },
        ]}
      />

      <LazySection id="overview" className="bg-[var(--color-cream)] px-6 py-24 lg:px-8">
        <div className="mx-auto grid max-w-7xl items-stretch gap-10 lg:grid-cols-2 lg:gap-14">
          <OverviewPanel
            title={`Discover ${dest.name}`}
            body={dest.overview}
            highlights={dest.highlights}
            facts={[
              { label: 'Best time to visit', value: dest.bestTimeToVisit },
              { label: 'Languages', value: dest.languages },
              { label: 'Currency', value: dest.currency },
              { label: 'Time zone', value: dest.timezone },
              { label: 'Visa', value: dest.visaInfo },
            ]}
            action={
              <Button asChild size="lg">
                <Link href={`/${locale}/plan-your-journey`}>Practical Info</Link>
              </Button>
            }
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
              loading="lazy"
              className="object-cover"
              sizes="(max-width:1024px) 100vw, 50vw"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/15 to-transparent" />
            <div className="absolute inset-x-0 bottom-0 p-8">
              <p className="text-[11px] tracking-[0.22em] text-[var(--color-gold)] uppercase">
                Cinematic film
              </p>
              <p className="mt-2 font-[family-name:var(--font-display)] text-2xl text-white md:text-3xl">
                Discover {dest.name}
              </p>
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
              children.length
                ? `${children.length} destinations across ${dest.name} — curated for travellers who expect more.`
                : undefined
            }
            light
          />
          {children.length > 0 ? (
            <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
              {children.map((child, i) => (
                <DestinationCard
                  key={child.id}
                  href={`/${locale}/destinations/${child.slugPath}`}
                  name={child.name}
                  description={child.tagline}
                  image={child.image}
                  index={i}
                  eyebrow={child.type === 'city' ? 'Destination' : 'Country'}
                />
              ))}
            </div>
          ) : (
            <p className="mt-8 max-w-xl text-sm leading-relaxed text-white/45">
              Destinations for {dest.name} are being curated. Explore other regions or plan a
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
          <div className="grid gap-6 md:grid-cols-3">
            {experiences.map((e) => (
              <ExperienceCard
                key={e.id}
                href={`/${locale}/experiences/${e.slug}`}
                name={e.name}
                tagline={e.tagline}
                image={e.image}
              />
            ))}
          </div>
        </div>
      </LazySection>

      <LazySection id="journeys" className="bg-[var(--color-ink)] px-6 py-20 lg:px-8">
        <div className="mx-auto max-w-7xl">
          <SectionHeading
            eyebrow="Itinerary ideas"
            title="Sample journeys to inspire you"
            light
          />
          <div className="grid gap-6 lg:grid-cols-3">
            {itineraries.map((itin) => (
              <ItineraryCard
                key={itin.id}
                href={`/${locale}/itineraries/${itin.slug}`}
                {...itin}
                title={itin.title}
              />
            ))}
          </div>
        </div>
      </LazySection>

      <LazySection id="enquiry" className="bg-[var(--color-charcoal)] px-6 py-20 lg:px-8">
        <div className="mx-auto max-w-3xl">
          <SectionHeading
            eyebrow="Enquire"
            title={`Ready to explore ${dest.name}?`}
            light
          />
          <EnquiryForm locale={locale} defaultDestination={dest.name} />
        </div>
      </LazySection>

      <CtaBand
        locale={locale}
        title={`Ready to explore ${dest.name}? Tell us your ideas and we'll design a tailor-made journey just for you.`}
      />
    </>
  );
}
