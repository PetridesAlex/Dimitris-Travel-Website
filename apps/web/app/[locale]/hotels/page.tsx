import { SectionHeading, HotelCard } from '@/components/marketing/sections';
import { LazySection } from '@/components/motion/fade-in';
import { hotelQueries } from '@/features/catalog/queries';
export const metadata = { title: 'Hotels' };
export default async function HotelsPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  const items = hotelQueries.getAll();
  return (
    <div className="bg-[var(--color-ink)] pt-28">
      <LazySection className="mx-auto max-w-7xl px-6 py-16 lg:px-8">
        <SectionHeading eyebrow="Hotels" title="Handpicked luxury stays" light align="left" />
        <div className="grid gap-8 md:grid-cols-3">
          {items.map((h) => (
            <HotelCard key={h.id} href={`/${locale}/hotels/${h.slug}`} name={h.name} locationLabel={h.locationLabel} image={h.image} starRating={h.starRating} />
          ))}
        </div>
      </LazySection>
    </div>
  );
}
