import Link from 'next/link';
import { AdminPageHeader, DataTable, StatusBadge } from '@/components/admin/page-header';
import { testimonialQueries } from '@/features/catalog/queries';

export default async function AdminTestimonialsPage() {
  const items = await testimonialQueries.getAll();
  return (
    <div>
      <AdminPageHeader
        title="Testimonials"
        description="Guest stories for the homepage and destination pages."
        action={{ label: 'New testimonial', href: '/admin/testimonials/new' }}
      />
      <DataTable
        columns={['Author', 'Trip', 'Rating', 'Status', '']}
        rows={items.map((t) => [
          <div key="n">
            <div className="font-medium">{t.authorName}</div>
            <div className="text-xs text-[var(--admin-muted)]">{t.authorLocation}</div>
          </div>,
          t.tripLabel,
          `${t.rating}★`,
          <StatusBadge key="s" status={(t as { status?: string }).status || 'published'} />,
          <Link key="l" className="text-[var(--color-gold-dark)]" href={`/admin/testimonials/${t.id}`}>
            Edit
          </Link>,
        ])}
      />
    </div>
  );
}
