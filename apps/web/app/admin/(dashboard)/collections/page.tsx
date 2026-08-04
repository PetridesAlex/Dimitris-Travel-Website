import Link from 'next/link';
import { AdminPageHeader, DataTable, StatusBadge } from '@/components/admin/page-header';
import { collectionQueries } from '@/features/catalog/queries';

export default async function AdminCollectionsPage() {
  const items = await collectionQueries.getAll();
  return (
    <div>
      <AdminPageHeader
        title="Collections"
        description="Special curated groupings."
        action={{ label: 'New collection', href: '/admin/collections/new' }}
      />
      <DataTable
        columns={['Name', 'Tagline', 'Status', '']}
        rows={items.map((c) => [
          <span key="n" className="font-medium">{c.name}</span>,
          c.tagline,
          <StatusBadge key="s" status={(c as { status?: string }).status || 'published'} />,
          <span key="l" className="flex gap-3">
            <Link className="text-[var(--color-gold-dark)]" href={`/admin/collections/${c.id}`}>
              Edit
            </Link>
            <Link className="text-[var(--admin-muted)]" href={`/en/collections/${c.slug}`}>
              View
            </Link>
          </span>,
        ])}
      />
    </div>
  );
}
