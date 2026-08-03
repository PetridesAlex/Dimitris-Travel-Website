import Link from 'next/link';
import { AdminPageHeader, DataTable, StatusBadge } from '@/components/admin/page-header';
import { Badge } from '@/components/ui/badge';
import { destinationQueries } from '@/features/catalog/queries';

export default function AdminDestinationsPage() {
  const items = destinationQueries.getAll();
  return (
    <div>
      <AdminPageHeader
        title="Destinations"
        description="Manage continents, countries, and cities as a hierarchy."
        action={{ label: 'New destination', href: '#' }}
      />
      <div className="mb-6 rounded-lg border border-[var(--admin-border)] bg-white p-4 text-sm text-[var(--admin-muted)]">
        Tree: Continent → Country → City. Use slug paths for public URLs (e.g. asia/japan/tokyo).
      </div>
      <DataTable
        columns={['Name', 'Type', 'Path', 'Featured', 'Status', '']}
        rows={items.map((d) => [
          <span key="n" className="font-medium">{d.name}</span>,
          <Badge key="t">{d.type}</Badge>,
          <code key="p" className="text-xs">{d.slugPath}</code>,
          d.featured ? 'Yes' : 'No',
          <StatusBadge key="s" status="published" />,
          <Link key="l" className="text-[var(--color-gold-dark)]" href={`/${'en'}/destinations/${d.slugPath}`}>
            View
          </Link>,
        ])}
      />
    </div>
  );
}
