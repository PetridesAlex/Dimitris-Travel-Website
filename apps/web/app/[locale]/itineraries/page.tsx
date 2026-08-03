import { SectionHeading, ItineraryCard } from '@/components/marketing/sections';
import { LazySection } from '@/components/motion/fade-in';
import { itineraryQueries } from '@/features/catalog/queries';
export const metadata = { title: 'Itineraries' };
export default async function ItinerariesPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  const items = itineraryQueries.getAll();
  return (
    <div className="bg-[var(--color-ink)] pt-28">
      <LazySection className="mx-auto max-w-7xl px-6 py-16 lg:px-8">
        <SectionHeading eyebrow="Itineraries" title="Journeys curated by Uncharted" light align="left" />
        <div className="grid gap-6 lg:grid-cols-3">
          {items.map((itin) => (
            <ItineraryCard key={itin.id} href={`/${locale}/itineraries/${itin.slug}`} title={itin.title} citiesLabel={itin.citiesLabel} durationDays={itin.durationDays} priceFrom={itin.priceFrom} currency={itin.currency} image={itin.image} summary={itin.summary} />
          ))}
        </div>
      </LazySection>
    </div>
  );
}
