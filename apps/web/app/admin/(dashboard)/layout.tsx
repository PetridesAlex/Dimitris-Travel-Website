import { Suspense } from 'react';
import { AdminSidebar } from '@/components/admin/sidebar';
import { AdminTopbar } from '@/components/admin/topbar';
import { requireCmsSession } from '@/lib/cms/auth';
import { enquiryQueries } from '@/features/catalog/queries';

export default async function AdminDashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  await requireCmsSession();
  const enquiries = await enquiryQueries.getAll();
  const enquiryCount = enquiries.filter(
    (e) => e.status === 'new' || e.status === 'contacted',
  ).length;

  return (
    <div className="admin-shell flex min-h-screen">
      <AdminSidebar enquiryCount={enquiryCount} />
      <div className="flex min-h-screen min-w-0 flex-1 flex-col">
        <Suspense
          fallback={
            <div className="h-[68px] border-b border-[var(--admin-border)] bg-white/70" />
          }
        >
          <AdminTopbar />
        </Suspense>
        <div className="flex-1 overflow-auto p-6 lg:p-8">{children}</div>
      </div>
    </div>
  );
}
