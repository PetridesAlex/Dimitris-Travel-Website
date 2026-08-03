import Link from 'next/link';
import { AdminPageHeader, DataTable, StatusBadge } from '@/components/admin/page-header';
import { experienceQueries } from '@/features/catalog/queries';

export default function AdminExperiencesPage() {
  const items = experienceQueries.getAll();
  return (
    <div>
      <AdminPageHeader title="Experiences" description="Safari, cruises, wellness, and more." action={{ label: 'New experience', href: '#' }} />
      <DataTable
        columns={['Name', 'Category', 'Status', '']}
        rows={items.map((e) => [
          <span key="n" className="font-medium">{e.name}</span>,
          e.category,
          <StatusBadge key="s" status="published" />,
          <Link key="l" className="text-[var(--color-gold-dark)]" href={`/en/experiences/${e.slug}`}>View</Link>,
        ])}
      />
    </div>
  );
}
