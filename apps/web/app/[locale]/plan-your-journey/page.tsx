import { Hero } from '@/components/marketing/hero';
import { LazySection, FadeIn } from '@/components/motion/fade-in';
import {
  PlanJourneyForm,
  PlanJourneyTrust,
} from '@/components/forms/plan-journey-form';

export const metadata = { title: 'Plan Your Journey' };

export default async function PlanPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;

  return (
    <>
      <Hero
        eyebrow="Plan Your Journey"
        title="Tell us where you dream of going"
        description="Share a few details and a journey designer will craft a personal proposal."
        image="https://images.unsplash.com/photo-1587595431973-160d0d94add1?w=1600&q=80"
        tall={false}
      />

      <LazySection className="relative overflow-hidden bg-[#0a0a0a] px-6 py-16 lg:px-8 lg:py-20">
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_20%_0%,rgba(197,160,89,0.08),transparent_50%)]" />
        <div className="relative mx-auto max-w-5xl">
          <FadeIn className="mb-10 text-center" blur>
            <p className="text-[11px] font-semibold tracking-[0.3em] text-[#c5a059] uppercase">
              Your tailor-made brief
            </p>
            <h2 className="mt-3 font-[family-name:var(--font-display)] text-3xl text-white md:text-5xl">
              Begin crafting your journey
            </h2>
            <p className="mx-auto mt-4 max-w-2xl text-sm leading-relaxed text-white/50 md:text-base">
              A short, guided conversation across four elegant steps. Your progress is saved as
              you go — there is no obligation, only inspiration.
            </p>
          </FadeIn>

          <FadeIn delay={0.1} className="mb-10">
            <PlanJourneyTrust />
          </FadeIn>

          <FadeIn delay={0.15}>
            <PlanJourneyForm locale={locale} />
          </FadeIn>
        </div>
      </LazySection>
    </>
  );
}
