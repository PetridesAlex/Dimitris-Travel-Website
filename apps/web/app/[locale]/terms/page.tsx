import Link from 'next/link';
import { Hero } from '@/components/marketing/hero';
import { LazySection } from '@/components/motion/fade-in';
import { CtaBand } from '@/components/marketing/sections';

export const metadata = { title: 'Terms & Conditions' };

export default async function TermsPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;

  const sections = [
    {
      title: 'Our services',
      body: 'Uncharted Journeys designs and arranges tailor-made luxury travel experiences. Itineraries, availability, and pricing are confirmed in writing before booking and may change until final confirmation.',
    },
    {
      title: 'Bookings & payments',
      body: 'A deposit and payment schedule will be outlined in your proposal. Travel documents and supplier terms apply once services are confirmed. Cancellation policies vary by destination, hotel, and experience partner.',
    },
    {
      title: 'Your responsibilities',
      body: 'You are responsible for valid passports, visas, travel insurance, health requirements, and accurate traveller details. We recommend comprehensive travel insurance for every journey.',
    },
    {
      title: 'Website use',
      body: 'Content on this website is for inspiration and information. Images and descriptions may be illustrative. Unauthorised copying, scraping, or commercial reuse of our materials is not permitted.',
    },
    {
      title: 'Liability',
      body: 'We plan with care, but third-party suppliers operate independently. To the fullest extent permitted by law, our liability is limited as set out in your booking confirmation and applicable supplier conditions.',
    },
  ];

  return (
    <>
      <Hero
        eyebrow="Legal"
        title="Terms & Conditions"
        description="Clear terms for a calm, considered journey with Uncharted Journeys."
        image="https://images.unsplash.com/photo-1488646953014-85cb44e25828?w=1600&q=80"
        tall={false}
      />
      <LazySection className="bg-[var(--color-cream)] px-6 py-20 lg:px-8">
        <div className="mx-auto max-w-3xl">
          <p className="text-sm tracking-[0.18em] text-[#c5a059] uppercase">
            Last updated · March 2026
          </p>
          <div className="mt-10 space-y-10">
            {sections.map((section) => (
              <section key={section.title}>
                <h2 className="font-[family-name:var(--font-display)] text-2xl text-[#0c0c0c] md:text-3xl">
                  {section.title}
                </h2>
                <p className="mt-3 text-base leading-relaxed text-[#0c0c0c]/70">
                  {section.body}
                </p>
              </section>
            ))}
          </div>
          <p className="mt-12 border-t border-[#0c0c0c]/10 pt-8 text-sm text-[#0c0c0c]/55">
            Questions?{' '}
            <Link href={`/${locale}/contact`} className="text-[#c5a059] hover:underline">
              Contact our team
            </Link>{' '}
            or review our{' '}
            <Link href={`/${locale}/privacy`} className="text-[#c5a059] hover:underline">
              Privacy Policy
            </Link>
            .
          </p>
        </div>
      </LazySection>
      <CtaBand locale={locale} title="Ready when you are — tell us where you’d like to go." />
    </>
  );
}
