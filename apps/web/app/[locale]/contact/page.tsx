import { Hero } from '@/components/marketing/hero';
import { LazySection } from '@/components/motion/fade-in';
import { ContactPanel } from '@/components/marketing/contact-panel';
import { EnquiryForm } from '@/components/forms/enquiry-form';

export const metadata = { title: 'Contact' };

export default async function ContactPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  return (
    <>
      <Hero
        eyebrow="Contact"
        title="Let's begin the conversation"
        description="Share your ideas — a destination, a season, a celebration — and we'll take it from there."
        image="https://images.unsplash.com/photo-1489749798305-4fea3ae63d43?w=1600&q=80"
        tall={false}
      />
      <LazySection className="bg-[var(--color-ink)] px-6 py-20 lg:px-8">
        <div className="mx-auto grid max-w-7xl gap-12 lg:grid-cols-2 lg:gap-16 lg:items-start">
          <ContactPanel />
          <EnquiryForm locale={locale} />
        </div>
      </LazySection>
    </>
  );
}
