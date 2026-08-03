import { AdminPageHeader, DataTable, StatusBadge } from '@/components/admin/page-header';
import { testimonialQueries } from '@/features/catalog/queries';

export default function AdminTestimonialsPage() {
  const items = testimonialQueries.getAll();
  return (
    <div>
      <AdminPageHeader title="Testimonials" description="Guest stories for the homepage and destination pages." action={{ label: 'New testimonial', href: '#' }} />
      <DataTable
        columns={['Author', 'Trip', 'Rating', 'Status']}
        rows={items.map((t) => [
          <div key="n"><div className="font-medium">{t.authorName}</div><div className="text-xs text-[var(--admin-muted)]">{t.authorLocation}</div></div>,
          t.tripLabel,
          `${t.rating}★`,
          <StatusBadge key="s" status="published" />,
        ])}
      />
    </div>
  );
}
