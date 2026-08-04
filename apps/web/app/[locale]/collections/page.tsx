import { SectionHeading, ExperienceCard } from '@/components/marketing/sections';
import { LazySection } from '@/components/motion/fade-in';
import { collectionQueries } from '@/features/catalog/queries';

export const metadata = { title: 'Special Collections' };

export default async function CollectionsPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  const items = await collectionQueries.getAll();
  return (
    <div className="bg-[var(--color-ink)] pt-28">
      <LazySection className="mx-auto max-w-7xl px-6 py-16 lg:px-8">
        <SectionHeading eyebrow="Special Collections" title="Curated ways to travel" light align="left" />
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {items.map((c) => (
            <ExperienceCard key={c.id} href={`/${locale}/collections/${c.slug}`} name={c.name} tagline={c.tagline} image={c.image} />
          ))}
        </div>
      </LazySection>
    </div>
  );
}
