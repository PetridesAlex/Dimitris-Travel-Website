import { notFound } from 'next/navigation';
import { LazySection } from '@/components/motion/fade-in';
import { Hero } from '@/components/marketing/hero';
import { Breadcrumbs, SectionHeading, CtaBand } from '@/components/marketing/sections';
import { EnquiryForm } from '@/components/forms/enquiry-form';
import { experienceQueries } from '@/features/catalog/queries';

type Props = { params: Promise<{ locale: string; slug: string }> };

export async function generateStaticParams() {
  return experienceQueries.getAll().map((e) => ({ slug: e.slug }));
}

export async function generateMetadata({ params }: Props) {
  const { slug } = await params;
  const exp = experienceQueries.getBySlug(slug);
  if (!exp) return {};
  return { title: exp.name, description: exp.description };
}

export default async function ExperienceDetailPage({ params }: Props) {
  const { locale, slug } = await params;
  const exp = experienceQueries.getBySlug(slug);
  if (!exp) notFound();
  return (
    <>
      <Hero eyebrow="Experience" title={exp.name} subtitle={exp.tagline} description={exp.description} image={exp.image} primaryCta={{ label: 'Plan Your Journey', href: `/${locale}/plan-your-journey` }} secondaryCta={{ label: 'Contact Us', href: `/${locale}/contact` }} tall={false} />
      <Breadcrumbs items={[{ label: 'Home', href: `/${locale}` }, { label: 'Experiences', href: `/${locale}/experiences` }, { label: exp.name }]} />
      <LazySection className="bg-[var(--color-cream)] px-6 py-20 lg:px-8">
        <div className="mx-auto max-w-3xl">
          <SectionHeading eyebrow={exp.category.replaceAll('_', ' ')} title={exp.name} align="left" />
          <p className="text-lg leading-relaxed text-[var(--color-muted)]">{exp.description}</p>
        </div>
      </LazySection>
      <LazySection className="bg-[var(--color-ink)] px-6 py-20 lg:px-8">
        <div className="mx-auto max-w-3xl">
          <SectionHeading eyebrow="Enquire" title="Design this experience around you" light />
          <EnquiryForm locale={locale} defaultDestination={exp.name} />
        </div>
      </LazySection>
      <CtaBand locale={locale} title="Ready to begin? We'll craft every detail." />
    </>
  );
}
