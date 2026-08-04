import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import { ExperienceCard } from '@/components/marketing/sections';
import { LazySection, FadeIn } from '@/components/motion/fade-in';
import { experienceQueries } from '@/features/catalog/queries';

export const metadata = {
  title: 'Experiences',
  description: 'Luxury travel experiences curated by Uncharted Journeys.',
};

export default async function ExperiencesPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const items = await experienceQueries.getAll();
  const featured = items.slice(0, 2);
  const rest = items.slice(2);

  return (
    <div className="relative min-h-screen overflow-hidden bg-[#0c0c0c] pt-28">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_top,rgba(197,160,89,0.12),transparent_50%)]" />

      <LazySection className="relative mx-auto max-w-[1600px] px-5 py-16 sm:px-6 lg:px-10 lg:py-24">
        <div className="mb-12 max-w-4xl md:mb-16 lg:mb-20">
          <FadeIn direction="up" blur>
            <p className="text-[11px] font-semibold tracking-[0.28em] text-[#c5a059] uppercase">
              Experiences
            </p>
            <h1 className="mt-4 font-[family-name:var(--font-display)] text-4xl leading-[1.05] text-white sm:text-5xl md:text-6xl lg:text-7xl">
              Handpicked experiences
              <span className="block text-[#c5a059]">just for you.</span>
            </h1>
            <p className="mt-6 max-w-2xl text-base leading-relaxed text-white/60 md:text-lg">
              Safari, cruises, trains, wellness and more — curated moments that shape the
              character of every Uncharted journey.
            </p>
          </FadeIn>
        </div>

        <div className="grid gap-4 md:grid-cols-2 md:gap-5 lg:gap-6">
          {featured.map((e, i) => (
            <ExperienceCard
              key={e.id}
              href={`/${locale}/experiences/${e.slug}`}
              name={e.name}
              tagline={e.tagline}
              image={e.image}
              index={i}
              size="large"
            />
          ))}
        </div>

        {rest.length > 0 ? (
          <div className="mt-4 grid gap-4 sm:grid-cols-2 md:mt-5 lg:mt-6 lg:grid-cols-3 lg:gap-6">
            {rest.map((e, i) => (
              <ExperienceCard
                key={e.id}
                href={`/${locale}/experiences/${e.slug}`}
                name={e.name}
                tagline={e.tagline}
                image={e.image}
                index={i + featured.length}
                size="default"
              />
            ))}
          </div>
        ) : null}

        <FadeIn delay={0.2} direction="up" className="mt-14 md:mt-16">
          <Link
            href={`/${locale}/plan-your-journey`}
            className="group inline-flex items-center gap-2.5 border border-[#c5a059]/45 bg-white/5 px-7 py-3.5 text-[12px] font-bold tracking-[0.2em] text-white uppercase transition duration-300 hover:border-[#c5a059] hover:bg-[#c5a059] hover:text-[#0c0c0c]"
          >
            Plan Your Journey
            <ArrowRight
              className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1"
              strokeWidth={2}
            />
          </Link>
        </FadeIn>
      </LazySection>
    </div>
  );
}
