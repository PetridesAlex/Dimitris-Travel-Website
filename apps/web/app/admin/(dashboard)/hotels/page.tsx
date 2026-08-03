import Link from 'next/link';
import { AdminPageHeader, DataTable, StatusBadge } from '@/components/admin/page-header';
import { hotelQueries } from '@/features/catalog/queries';

export default function AdminHotelsPage() {
  const items = hotelQueries.getAll();
  return (
    <div>
      <AdminPageHeader title="Hotels" description="Luxury stays linked to destinations." action={{ label: 'New hotel', href: '#' }} />
      <DataTable
        columns={['Name', 'Location', 'Rating', 'Status', '']}
        rows={items.map((h) => [
          <span key="n" className="font-medium">{h.name}</span>,
          h.locationLabel,
          `${h.starRating}★`,
          <StatusBadge key="s" status="published" />,
          <Link key="l" className="text-[var(--color-gold-dark)]" href={`/en/hotels/${h.slug}`}>View</Link>,
        ])}
      />
    </div>
  );
}
