import Link from 'next/link';
import { AdminPageHeader, DataTable, StatusBadge } from '@/components/admin/page-header';
import { experienceQueries } from '@/features/catalog/queries';

export default async function AdminExperiencesPage() {
  const items = await experienceQueries.getAll();
  return (
    <div>
      <AdminPageHeader
        title="Experiences"
        description="Safari, cruises, wellness, and more."
        action={{ label: 'New experience', href: '/admin/experiences/new' }}
      />
      <DataTable
        columns={['Name', 'Category', 'Status', '']}
        rows={items.map((e) => [
          <span key="n" className="font-medium">{e.name}</span>,
          e.category,
          <StatusBadge key="s" status={(e as { status?: string }).status || 'published'} />,
          <span key="l" className="flex gap-3">
            <Link className="text-[var(--color-gold-dark)]" href={`/admin/experiences/${e.id}`}>
              Edit
            </Link>
            <Link className="text-[var(--admin-muted)]" href={`/en/experiences/${e.slug}`}>
              View
            </Link>
          </span>,
        ])}
      />
    </div>
  );
}
