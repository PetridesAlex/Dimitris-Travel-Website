import { getCmsSession } from '@/lib/cms/auth';
import { isDemoMode } from '@/lib/supabase/server';
import { enquiryQueries } from '@/features/catalog/queries';
import { AdminTopbarClient } from '@/components/admin/topbar-client';

export async function AdminTopbar() {
  const session = await getCmsSession();
  const demo = isDemoMode();
  const enquiries = await enquiryQueries.getAll();
  const enquiryCount = enquiries.filter(
    (e) => e.status === 'new' || e.status === 'contacted',
  ).length;

  const name = session?.name || session?.email || 'Admin';
  const email = session?.email || '';
  const role = session?.role || 'editor';
  const initials =
    name
      .split(/\s|@/)
      .filter(Boolean)
      .slice(0, 2)
      .map((p) => p[0]?.toUpperCase() || '')
      .join('') || 'A';

  return (
    <AdminTopbarClient
      email={email}
      name={name}
      initials={initials}
      role={role}
      demo={demo}
      enquiryCount={enquiryCount}
    />
  );
}
