import { Hero } from '@/components/marketing/hero';
import { TrustBar } from '@/components/marketing/trust-bar';
import { ContinentCard } from '@/components/marketing/continent-card';
import { WhyChooseUs } from '@/components/marketing/why-choose-us';
import {
  SectionHeading,
  ExperienceCard,
  ItineraryCard,
  BlogCard,
  CtaBand,
} from '@/components/marketing/sections';
import { NewsletterBand } from '@/components/forms/newsletter-form';
import { LazySection } from '@/components/motion/fade-in';
import {
  destinationQueries,
  experienceQueries,
  itineraryQueries,
  blogQueries,
  testimonialQueries,
} from '@/features/catalog/queries';

export default async function HomePage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const [continents, featuredExperiences, itineraries, posts, testimonials] =
    await Promise.all([
      destinationQueries.getContinents(),
      experienceQueries.getFeatured(),
      itineraryQueries.getFeatured(),
      blogQueries.getFeatured(),
      testimonialQueries.getAll(),
    ]);
  const experiences = featuredExperiences.slice(0, 3);

  return (
    <>
      <Hero
        eyebrow="Beyond destinations."
        scriptEyebrow
        title="Into experiences."
        description="We design personalized journeys around the world, just for you."
        image="https://images.unsplash.com/photo-1587595431973-160d0d94add1?w=2000&q=80"
        imageAlt="Machu Picchu at sunset"
        primaryCta={{
          label: 'Start Exploring',
          href: `/${locale}/destinations`,
        }}
      />

      <TrustBar />

      <LazySection className="relative overflow-hidden bg-[var(--color-ink)] px-6 py-28 lg:px-8">
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(197,160,89,0.06),transparent_60%)]" />
        <div className="relative mx-auto max-w-[1400px]">
          <SectionHeading
            eyebrow="Explore by continent"
            title="Where would you like to go?"
            light
          />
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 sm:gap-5 lg:grid-cols-5 lg:items-end lg:gap-4 xl:gap-5">
            {continents.map((c, i) => (
              <ContinentCard
                key={c.id}
                href={`/${locale}/destinations/${c.slug}`}
                name={c.name}
                description={c.tagline}
                image={c.image}
                index={i}
                featured={i === 2}
              />
            ))}
          </div>
        </div>
      </LazySection>

      <LazySection className="bg-[var(--color-cream)] px-6 py-24 lg:px-8">
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

      <LazySection className="bg-[var(--color-ink)] px-6 py-24 lg:px-8">
        <div className="mx-auto max-w-7xl">
          <SectionHeading
            eyebrow="Signature journeys"
            title="Journeys curated by Uncharted"
            light
          />
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

      <LazySection>
        <WhyChooseUs testimonials={testimonials} />
      </LazySection>

      <LazySection className="bg-[var(--color-ink)] px-6 py-24 lg:px-8">
        <div className="mx-auto max-w-7xl">
          <SectionHeading
            eyebrow="Travel inspiration"
            title="Stories from the road"
            light
          />
          <div className="grid gap-8 md:grid-cols-3">
            {posts.map((post) => (
              <BlogCard
                key={post.id}
                href={`/${locale}/blog/${post.slug}`}
                title={post.title}
                excerpt={post.excerpt}
                image={post.image}
                category={post.category}
                date={post.publishedAt}
              />
            ))}
          </div>
        </div>
      </LazySection>

      <LazySection>
        <NewsletterBand locale={locale} />
      </LazySection>

      <CtaBand
        locale={locale}
        title="Ready to explore? Tell us your ideas and we'll design a tailor-made journey just for you."
      />
    </>
  );
}
