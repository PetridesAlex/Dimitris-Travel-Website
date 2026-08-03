import Link from 'next/link';
import { AdminPageHeader, DataTable, StatusBadge } from '@/components/admin/page-header';
import { formatCurrency } from '@/lib/utils';
import { itineraryQueries } from '@/features/catalog/queries';

export default function AdminItinerariesPage() {
  const items = itineraryQueries.getAll();
  return (
    <div>
      <AdminPageHeader title="Itineraries" description="Day-by-day signature journeys." action={{ label: 'New itinerary', href: '#' }} />
      <DataTable
        columns={['Title', 'Duration', 'From', 'Status', '']}
        rows={items.map((i) => [
          <span key="n" className="font-medium">{i.title}</span>,
          `${i.durationDays} days`,
          formatCurrency(i.priceFrom, i.currency),
          <StatusBadge key="s" status="published" />,
          <Link key="l" className="text-[var(--color-gold-dark)]" href={`/en/itineraries/${i.slug}`}>View</Link>,
        ])}
      />
    </div>
  );
}
