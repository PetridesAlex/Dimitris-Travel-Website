import { Hero } from '@/components/marketing/hero';
import { LazySection } from '@/components/motion/fade-in';
import { SectionHeading } from '@/components/marketing/sections';
import { EnquiryForm } from '@/components/forms/enquiry-form';
export const metadata = { title: 'Plan Your Journey' };
export default async function PlanPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  return (
    <>
      <Hero eyebrow="Plan Your Journey" title="Tell us where you dream of going" description="Share a few details and a journey designer will craft a personal proposal." image="https://images.unsplash.com/photo-1587595431973-160d0d94add1?w=1600&q=80" tall={false} />
      <LazySection className="bg-[var(--color-charcoal)] px-6 py-20 lg:px-8">
        <div className="mx-auto max-w-3xl">
          <SectionHeading eyebrow="Enquiry" title="Your tailor-made brief" light />
          <EnquiryForm locale={locale} />
        </div>
      </LazySection>
    </>
  );
}
