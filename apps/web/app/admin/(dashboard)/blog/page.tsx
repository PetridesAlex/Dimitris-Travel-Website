import Link from 'next/link';
import { AdminPageHeader, DataTable, StatusBadge } from '@/components/admin/page-header';
import { blogQueries } from '@/features/catalog/queries';

export default function AdminBlogPage() {
  const items = blogQueries.getAll();
  return (
    <div>
      <AdminPageHeader title="Blog" description="Inspiration articles with SEO fields." action={{ label: 'New post', href: '#' }} />
      <DataTable
        columns={['Title', 'Category', 'Author', 'Published', 'Status', '']}
        rows={items.map((p) => [
          <span key="n" className="font-medium">{p.title}</span>,
          p.category,
          p.author,
          p.publishedAt,
          <StatusBadge key="s" status="published" />,
          <Link key="l" className="text-[var(--color-gold-dark)]" href={`/en/blog/${p.slug}`}>View</Link>,
        ])}
      />
    </div>
  );
}
