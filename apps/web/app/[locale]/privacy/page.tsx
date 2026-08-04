import Link from 'next/link';
import { Hero } from '@/components/marketing/hero';
import { LazySection } from '@/components/motion/fade-in';
import { CtaBand } from '@/components/marketing/sections';

export const metadata = { title: 'Privacy Policy' };

export default async function PrivacyPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;

  const sections = [
    {
      title: 'What we collect',
      body: 'We may collect contact details, travel preferences, enquiry information, and technical data such as device type, pages visited, and cookie identifiers when you use our website or contact us.',
    },
    {
      title: 'How we use information',
      body: 'We use your information to respond to enquiries, design journeys, improve our website, send optional inspiration when you subscribe, and meet legal or operational requirements.',
    },
    {
      title: 'Cookies',
      body: 'Essential cookies help the site function. Optional analytics cookies help us understand usage. You can accept all cookies or continue with essential cookies only via our consent banner.',
    },
    {
      title: 'Sharing',
      body: 'We share information only with trusted partners needed to deliver your journey (such as hotels or guides), service providers who support our operations, or when required by law.',
    },
    {
      title: 'Your choices',
      body: 'You may request access, correction, or deletion of personal data where applicable, and you can unsubscribe from marketing at any time. Contact us to manage your preferences.',
    },
  ];

  return (
    <>
      <Hero
        eyebrow="Legal"
        title="Privacy Policy"
        description="How Uncharted Journeys protects your information with care and clarity."
        image="https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=1600&q=80"
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
            Need help with privacy?{' '}
            <Link href={`/${locale}/contact`} className="text-[#c5a059] hover:underline">
              Reach our team
            </Link>{' '}
            or read our{' '}
            <Link href={`/${locale}/terms`} className="text-[#c5a059] hover:underline">
              Terms & Conditions
            </Link>
            .
          </p>
        </div>
      </LazySection>
      <CtaBand locale={locale} title="Your journey details stay private — and carefully handled." />
    </>
  );
}
