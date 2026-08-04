import Link from 'next/link';
import { AdminPageHeader, DataTable, StatusBadge } from '@/components/admin/page-header';
import { hotelQueries } from '@/features/catalog/queries';

export default async function AdminHotelsPage() {
  const items = await hotelQueries.adminGetAll();
  return (
    <div>
      <AdminPageHeader
        title="Hotels"
        description="Luxury stays linked to destinations."
        action={{ label: 'New hotel', href: '/admin/hotels/new' }}
      />
      <DataTable
        columns={['Name', 'Location', 'Rating', 'Status', '']}
        rows={items.map((h) => [
          <span key="n" className="font-medium">{h.name}</span>,
          h.locationLabel,
          `${h.starRating}★`,
          <StatusBadge key="s" status={(h as { status?: string }).status || 'published'} />,
          <span key="l" className="flex gap-3">
            <Link className="text-[var(--color-gold-dark)]" href={`/admin/hotels/${h.id}`}>
              Edit
            </Link>
            <Link className="text-[var(--admin-muted)]" href={`/en/hotels/${h.slug}`}>
              View
            </Link>
          </span>,
        ])}
      />
    </div>
  );
}
