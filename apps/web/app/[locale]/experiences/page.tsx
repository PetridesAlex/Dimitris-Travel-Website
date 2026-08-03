import { SectionHeading, ExperienceCard } from '@/components/marketing/sections';
import { LazySection } from '@/components/motion/fade-in';
import { experienceQueries } from '@/features/catalog/queries';

export const metadata = { title: 'Experiences', description: 'Luxury travel experiences curated by Uncharted Journeys.' };

export default async function ExperiencesPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  const items = experienceQueries.getAll();
  return (
    <div className="bg-[var(--color-ink)] pt-28">
      <LazySection className="mx-auto max-w-7xl px-6 py-16 lg:px-8">
        <SectionHeading eyebrow="Experiences" title="Handpicked experiences just for you" light align="left" />
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {items.map((e) => (
            <ExperienceCard key={e.id} href={`/${locale}/experiences/${e.slug}`} name={e.name} tagline={e.tagline} image={e.image} />
          ))}
        </div>
      </LazySection>
    </div>
  );
}
