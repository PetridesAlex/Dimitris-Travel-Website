/* eslint-disable @typescript-eslint/no-explicit-any */
import Link from 'next/link';
import { AdminPageHeader, DataTable, StatusBadge } from '@/components/admin/page-header';
import { faqQueries } from '@/features/catalog/queries';

export default async function AdminFaqsPage() {
  const items = await faqQueries.getAll();
  return (
    <div>
      <AdminPageHeader
        title="FAQs"
        description="Global and entity-scoped frequently asked questions."
        action={{ label: 'New FAQ', href: '/admin/faqs/new' }}
      />
      <DataTable
        columns={['Question', 'Status', '']}
        rows={items.map((f: any) => [
          <span key="q" className="font-medium">{f.question}</span>,
          <StatusBadge key="s" status={(f as { status?: string }).status || 'published'} />,
          <Link key="l" className="text-[var(--color-gold-dark)]" href={`/admin/faqs/${f.id}`}>
            Edit
          </Link>,
        ])}
      />
    </div>
  );
}
