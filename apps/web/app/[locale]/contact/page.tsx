import { Hero } from '@/components/marketing/hero';
import { LazySection } from '@/components/motion/fade-in';
import { SectionHeading } from '@/components/marketing/sections';
import { EnquiryForm } from '@/components/forms/enquiry-form';
import { siteSettings } from '@/data/demo';
export const metadata = { title: 'Contact' };
export default async function ContactPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  return (
    <>
      <Hero eyebrow="Contact" title="Let's begin the conversation" description="Share your ideas — a destination, a season, a celebration — and we'll take it from there." image="https://images.unsplash.com/photo-1489749798305-4fea3ae63d43?w=1600&q=80" tall={false} />
      <LazySection className="bg-[var(--color-ink)] px-6 py-20 lg:px-8">
        <div className="mx-auto grid max-w-7xl gap-12 lg:grid-cols-2">
          <div>
            <SectionHeading eyebrow="Get in touch" title="We're here to help" light align="left" />
            <ul className="space-y-4 text-white/70">
              <li>{siteSettings.phone}</li>
              <li>{siteSettings.email}</li>
              <li>{siteSettings.address}</li>
            </ul>
            <div className="mt-8 aspect-video overflow-hidden rounded-xl bg-white/5 flex items-center justify-center text-white/40 text-sm">
              Google Maps embed placeholder
            </div>
          </div>
          <EnquiryForm locale={locale} />
        </div>
      </LazySection>
    </>
  );
}
