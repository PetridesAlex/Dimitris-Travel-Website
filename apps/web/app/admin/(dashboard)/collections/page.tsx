import Link from 'next/link';
import { AdminPageHeader, DataTable, StatusBadge } from '@/components/admin/page-header';
import { collectionQueries } from '@/features/catalog/queries';

export default function AdminCollectionsPage() {
  const items = collectionQueries.getAll();
  return (
    <div>
      <AdminPageHeader title="Collections" description="Special curated groupings." action={{ label: 'New collection', href: '#' }} />
      <DataTable
        columns={['Name', 'Tagline', 'Status', '']}
        rows={items.map((c) => [
          <span key="n" className="font-medium">{c.name}</span>,
          c.tagline,
          <StatusBadge key="s" status="published" />,
          <Link key="l" className="text-[var(--color-gold-dark)]" href={`/en/collections/${c.slug}`}>View</Link>,
        ])}
      />
    </div>
  );
}
