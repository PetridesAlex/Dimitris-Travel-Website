import { AdminPageHeader, DataTable, StatusBadge } from '@/components/admin/page-header';
import { faqQueries } from '@/features/catalog/queries';

export default function AdminFaqsPage() {
  const items = faqQueries.getAll();
  return (
    <div>
      <AdminPageHeader title="FAQs" description="Global and entity-scoped frequently asked questions." action={{ label: 'New FAQ', href: '#' }} />
      <DataTable
        columns={['Question', 'Status']}
        rows={items.map((f) => [
          <span key="q" className="font-medium">{f.question}</span>,
          <StatusBadge key="s" status="published" />,
        ])}
      />
    </div>
  );
}
