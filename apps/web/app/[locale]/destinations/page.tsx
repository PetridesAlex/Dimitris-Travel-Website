import Link from 'next/link';
import { LazySection } from '@/components/motion/fade-in';
import { Button } from '@/components/ui/button';
import { DestinationCard } from '@/components/marketing/destination-card';
import { SectionHeading } from '@/components/marketing/sections';
import { destinationQueries } from '@/features/catalog/queries';

export const metadata = {
  title: 'Destinations',
  description: 'Explore luxury travel destinations by continent, country, and city.',
};

export default async function DestinationsIndexPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const continents = destinationQueries.getContinents();

  return (
    <div className="bg-[var(--color-ink)] pt-28">
      <LazySection className="mx-auto max-w-7xl px-6 py-16 lg:px-8">
        <SectionHeading
          eyebrow="Destinations"
          title="Explore the world with us"
          description="From continent to city — every journey begins with a place that moves you."
          light
          align="left"
        />
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-5">
          {continents.map((c) => (
            <DestinationCard
              key={c.id}
              href={`/${locale}/destinations/${c.slug}`}
              name={c.name}
              description={c.tagline}
              image={c.image}
            />
          ))}
        </div>
        <div className="mt-12">
          <Button asChild>
            <Link href={`/${locale}/plan-your-journey`}>Plan Your Journey</Link>
          </Button>
        </div>
      </LazySection>
    </div>
  );
}
