import { notFound } from 'next/navigation';
import { LazySection } from '@/components/motion/fade-in';
import Image from 'next/image';
import { Hero } from '@/components/marketing/hero';
import { Breadcrumbs, SectionHeading, CtaBand } from '@/components/marketing/sections';
import { hotelQueries } from '@/features/catalog/queries';

type Props = { params: Promise<{ locale: string; slug: string }> };
export async function generateStaticParams() {
  const all = await hotelQueries.getAll();
  return all.map((h) => ({ slug: h.slug }));
}
export default async function HotelDetailPage({ params }: Props) {
  const { locale, slug } = await params;
  const hotel = await hotelQueries.getBySlug(slug);
  if (!hotel) notFound();
  return (
    <>
      <Hero eyebrow={`${hotel.starRating}★ Luxury`} title={hotel.name} subtitle={hotel.locationLabel} description={hotel.description} image={hotel.image} primaryCta={{ label: 'Plan Your Journey', href: `/${locale}/plan-your-journey` }} tall={false} />
      <Breadcrumbs items={[{ label: 'Home', href: `/${locale}` }, { label: 'Hotels', href: `/${locale}/hotels` }, { label: hotel.name }]} />
      <LazySection className="bg-[var(--color-cream)] px-6 py-20 lg:px-8">
        <div className="mx-auto max-w-7xl grid gap-12 lg:grid-cols-2">
          <div>
            <SectionHeading eyebrow="Overview" title={hotel.name} align="left" />
            <p className="text-[var(--color-muted)] leading-relaxed">{hotel.description}</p>
            <h3 className="mt-8 text-sm tracking-widest uppercase text-[var(--color-gold)]">Amenities</h3>
            <ul className="mt-3 grid grid-cols-2 gap-2">
              {hotel.amenities.map((a) => (
                <li key={a} className="text-sm text-[var(--color-ink)]">— {a}</li>
              ))}
            </ul>
          </div>
          <div className="relative min-h-[360px] overflow-hidden rounded-xl">
            <Image src={hotel.image} alt={hotel.name} fill className="object-cover" sizes="50vw" />
          </div>
        </div>
      </LazySection>
      <CtaBand locale={locale} title={`Stay at ${hotel.name} as part of a tailor-made journey.`} />
    </>
  );
}
