import Link from 'next/link';
import { AdminPageHeader, DataTable, StatusBadge } from '@/components/admin/page-header';
import { Button } from '@/components/ui/button';
import { enquiryQueries } from '@/features/catalog/queries';

export default function AdminEnquiriesPage() {
  const items = enquiryQueries.getAll();
  return (
    <div>
      <div className="mb-4 flex justify-end">
        <Button asChild variant="adminOutline">
          <Link href="/api/enquiries/export">Export CSV</Link>
        </Button>
      </div>
      <AdminPageHeader
        title="Enquiries"
        description="Leads from Plan Your Journey and destination forms. Assign, update status, export."
      />
      <DataTable
        columns={['Guest', 'Destination', 'Travel date', 'Party', 'Budget', 'Status', 'Received']}
        rows={items.map((e) => [
          <div key="n">
            <div className="font-medium">{e.fullName}</div>
            <div className="text-xs text-[var(--admin-muted)]">{e.email} · {e.phone}</div>
          </div>,
          e.destination,
          e.travelDate,
          `${e.adults} adults${e.children ? `, ${e.children} children` : ''}`,
          e.budget,
          <StatusBadge key="s" status={e.status} />,
          new Date(e.createdAt).toLocaleString(),
        ])}
      />
    </div>
  );
}
