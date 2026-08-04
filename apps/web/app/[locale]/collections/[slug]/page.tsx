import { notFound } from 'next/navigation';
import { LazySection } from '@/components/motion/fade-in';
import { Hero } from '@/components/marketing/hero';
import { Breadcrumbs, SectionHeading, ItineraryCard, CtaBand } from '@/components/marketing/sections';
import { collectionQueries, itineraryQueries } from '@/features/catalog/queries';

type Props = { params: Promise<{ locale: string; slug: string }> };
export async function generateStaticParams() {
  const all = await collectionQueries.getAll();
  return all.map((c) => ({ slug: c.slug }));
}
export default async function CollectionDetailPage({ params }: Props) {
  const { locale, slug } = await params;
  const col = await collectionQueries.getBySlug(slug);
  if (!col) notFound();
  const itineraries = await itineraryQueries.getFeatured();
  return (
    <>
      <Hero eyebrow="Collection" title={col.name} subtitle={col.tagline} description={col.description} image={col.image} primaryCta={{ label: 'Plan Your Journey', href: `/${locale}/plan-your-journey` }} tall={false} />
      <Breadcrumbs items={[{ label: 'Home', href: `/${locale}` }, { label: 'Collections', href: `/${locale}/collections` }, { label: col.name }]} />
      <LazySection className="bg-[var(--color-ink)] px-6 py-20 lg:px-8">
        <div className="mx-auto max-w-7xl">
          <SectionHeading eyebrow="Journeys" title="Inspired itineraries" light />
          <div className="grid gap-6 lg:grid-cols-3">
            {itineraries.map((itin) => (
              <ItineraryCard key={itin.id} href={`/${locale}/itineraries/${itin.slug}`} title={itin.title} citiesLabel={itin.citiesLabel} durationDays={itin.durationDays} priceFrom={itin.priceFrom} currency={itin.currency} image={itin.image} summary={itin.summary} />
            ))}
          </div>
        </div>
      </LazySection>
      <CtaBand locale={locale} title="Find your place in this collection." />
    </>
  );
}
