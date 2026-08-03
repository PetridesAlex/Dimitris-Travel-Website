import { Hero } from '@/components/marketing/hero';
import { LazySection } from '@/components/motion/fade-in';
import { SectionHeading, CtaBand } from '@/components/marketing/sections';
export const metadata = { title: 'About Us' };
export default async function AboutPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  return (
    <>
      <Hero eyebrow="About Us" title="Designed for travellers who expect more" description="Uncharted Journeys crafts tailor-made luxury travel with cinematic attention to detail." image="https://images.unsplash.com/photo-1488646953014-85cb44e25828?w=1600&q=80" tall={false} />
      <LazySection className="bg-[var(--color-cream)] px-6 py-20 lg:px-8">
        <div className="mx-auto max-w-3xl">
          <SectionHeading eyebrow="Our approach" title="Quiet luxury. Deep access." align="left" />
          <p className="text-lg leading-relaxed text-[var(--color-muted)]">
            We are a team of journey designers who believe travel should feel personal, polished, and profoundly memorable. From the first conversation to the final transfer, we orchestrate every detail — hotels, experiences, logistics, and the moments in between.
          </p>
        </div>
      </LazySection>
      <CtaBand locale={locale} title="Let's design your next journey together." />
    </>
  );
}
