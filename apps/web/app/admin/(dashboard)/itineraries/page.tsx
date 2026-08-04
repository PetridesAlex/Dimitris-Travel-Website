import Link from 'next/link';
import { AdminPageHeader, DataTable, StatusBadge } from '@/components/admin/page-header';
import { formatCurrency } from '@/lib/utils';
import { itineraryQueries } from '@/features/catalog/queries';

export default async function AdminItinerariesPage() {
  const items = await itineraryQueries.adminGetAll();
  return (
    <div>
      <AdminPageHeader
        title="Itineraries"
        description="Day-by-day signature journeys."
        action={{ label: 'New itinerary', href: '/admin/itineraries/new' }}
      />
      <DataTable
        columns={['Title', 'Duration', 'From', 'Status', '']}
        rows={items.map((i) => [
          <span key="n" className="font-medium">{i.title}</span>,
          `${i.durationDays} days`,
          formatCurrency(i.priceFrom, i.currency),
          <StatusBadge key="s" status={(i as { status?: string }).status || 'published'} />,
          <span key="l" className="flex gap-3">
            <Link className="text-[var(--color-gold-dark)]" href={`/admin/itineraries/${i.id}`}>
              Edit
            </Link>
            <Link className="text-[var(--admin-muted)]" href={`/en/itineraries/${i.slug}`}>
              View
            </Link>
          </span>,
        ])}
      />
    </div>
  );
}
