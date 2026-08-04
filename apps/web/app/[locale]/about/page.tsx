import Link from 'next/link';
import Image from 'next/image';
import { ArrowRight } from 'lucide-react';
import { Hero } from '@/components/marketing/hero';
import { LazySection, FadeIn } from '@/components/motion/fade-in';
import { SectionHeading, CtaBand } from '@/components/marketing/sections';

export const metadata = { title: 'About Us' };

export default async function AboutPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;

  return (
    <>
      <Hero
        eyebrow="About UNCHARTED"
        title="UNCHARTED"
        description="Created for travellers who want more than a standard holiday."
        image="https://images.unsplash.com/photo-1506929562872-bb421503ef21?w=1800&q=80"
        imageAlt="Extraordinary travel landscape"
        primaryCta={{
          label: 'Plan Your Journey',
          href: `/${locale}/plan-your-journey`,
        }}
        secondaryCta={{ label: 'Contact Us', href: `/${locale}/contact` }}
        tall={false}
      />

      {/* Story */}
      <LazySection className="relative overflow-hidden bg-[var(--color-cream)] px-6 py-20 lg:px-8 lg:py-28">
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,rgba(197,160,89,0.1),transparent_50%)]" />
        <div className="relative mx-auto grid max-w-7xl gap-12 lg:grid-cols-12 lg:gap-16 lg:items-center">
          <div className="lg:col-span-5">
            <FadeIn direction="up" blur>
              <div className="relative aspect-[4/5] overflow-hidden">
                <Image
                  src="https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?w=1200&q=80"
                  alt="A thoughtfully designed journey"
                  fill
                  className="object-cover"
                  sizes="(max-width: 1024px) 100vw, 40vw"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#0c0c0c]/50 via-transparent to-transparent" />
              </div>
            </FadeIn>
          </div>
          <div className="lg:col-span-7">
            <SectionHeading
              eyebrow="About UNCHARTED"
              title="More than a standard holiday."
              align="left"
            />
            <FadeIn delay={0.12} direction="up" className="max-w-2xl space-y-6">
              <p className="text-lg leading-relaxed text-[var(--color-ink)]/75">
                UNCHARTED was created for travellers who want more than a standard holiday.
              </p>
              <p className="text-base leading-relaxed text-[var(--color-ink)]/70">
                We believe that the most memorable journeys are not simply booked — they are
                carefully imagined, thoughtfully designed and shaped around the person
                experiencing them. Every traveller is different, which is why every UNCHARTED
                journey begins with understanding your interests, your travel style and the
                moments you want to remember long after you return home.
              </p>
              <p className="text-base leading-relaxed text-[var(--color-ink)]/70">
                From iconic destinations and extraordinary landscapes to hidden places,
                authentic local experiences and carefully selected stays, we curate every
                element into one seamless journey. We go beyond ready-made packages, creating
                personalised travel experiences that balance discovery, comfort, adventure and
                meaningful connection with each destination.
              </p>
            </FadeIn>
          </div>
        </div>
      </LazySection>

      {/* Role */}
      <LazySection className="relative overflow-hidden bg-[#0c0c0c] px-6 py-20 lg:px-8 lg:py-28">
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_20%_0%,rgba(197,160,89,0.14),transparent_55%)]" />
        <div className="relative mx-auto max-w-4xl">
          <SectionHeading
            eyebrow="Our Role"
            title="From idea to complete travel story."
            light
          />
          <FadeIn delay={0.1} direction="up" className="mx-auto max-w-3xl space-y-6 text-center">
            <p className="text-base leading-relaxed text-white/65 md:text-lg">
              Our role is to transform an idea into a complete travel story. We research,
              design and coordinate each journey with attention to detail, working alongside
              trusted and appropriately licensed travel partners and local experts where
              required.
            </p>
            <div className="mx-auto h-px w-16 bg-[#c5a059]/50" />
            <p className="text-base leading-relaxed text-white/65 md:text-lg">
              Whether you dream of exploring Japan, experiencing an African safari,
              discovering the wild landscapes of Iceland or escaping to a remote tropical
              island, UNCHARTED is here to take you beyond the expected.
            </p>
          </FadeIn>
        </div>
      </LazySection>

      {/* Closing */}
      <LazySection className="relative bg-[var(--color-cream)] px-6 py-20 lg:px-8 lg:py-28">
        <div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-[#c5a059]/40 to-transparent" />
        <div className="relative mx-auto max-w-3xl text-center">
          <FadeIn direction="up" blur className="space-y-8">
            <p className="font-[family-name:var(--font-display)] text-3xl leading-snug text-[var(--color-ink)] md:text-4xl lg:text-5xl">
              Your journey should feel personal.
            </p>
            <p className="font-[family-name:var(--font-display)] text-3xl leading-snug text-[var(--color-ink)] md:text-4xl lg:text-5xl">
              Your experience should feel unforgettable.
            </p>
            <div className="mx-auto h-px w-16 bg-[#c5a059]/45" />
            <p className="font-[family-name:var(--font-display)] text-3xl leading-snug text-[#c5a059] md:text-4xl lg:text-5xl">
              Your story begins with UNCHARTED.
            </p>
          </FadeIn>
          <div className="relative z-10 pt-8">
            <Link
              href={`/${locale}/plan-your-journey`}
              className="group inline-flex items-center gap-2.5 border border-[#c5a059]/50 bg-[#0c0c0c] px-7 py-3.5 text-[13px] font-bold tracking-[0.22em] text-white uppercase shadow-[0_12px_32px_-16px_rgba(12,12,12,0.55)] transition duration-300 hover:border-[#c5a059] hover:bg-[#c5a059] hover:text-[#0c0c0c]"
            >
              Begin your journey
              <ArrowRight
                className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1"
                strokeWidth={2.25}
              />
            </Link>
          </div>
        </div>
      </LazySection>

      <CtaBand locale={locale} title="Let's design your next journey together." />
    </>
  );
}
