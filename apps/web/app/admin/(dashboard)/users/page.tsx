import { AdminPageHeader, DataTable, StatusBadge } from '@/components/admin/page-header';
import { Badge } from '@/components/ui/badge';
import { CmsForm, Select, TextInput } from '@/components/admin/cms-form';
import { inviteUserAction, listProfiles } from '@/features/cms/actions';

const ROLE_OPTIONS = [
  { value: 'super_admin', label: 'Super Admin' },
  { value: 'admin', label: 'Admin' },
  { value: 'editor', label: 'Editor' },
  { value: 'content_writer', label: 'Content Writer' },
  { value: 'marketing', label: 'Marketing' },
];

export default async function AdminUsersPage() {
  const users = await listProfiles();

  return (
    <div>
      <AdminPageHeader
        title="Users"
        description="Roles: Super Admin, Admin, Editor, Content Writer, Marketing."
      />

      <div className="mb-8 max-w-xl rounded-lg border border-[var(--admin-border)] bg-white p-6">
        <h2 className="mb-4 text-base font-semibold">Invite user</h2>
        <CmsForm action={inviteUserAction} submitLabel="Send invite">
          <TextInput name="email" label="Email" type="email" required />
          <Select
            name="role"
            label="Role"
            defaultValue="content_writer"
            options={ROLE_OPTIONS}
          />
        </CmsForm>
      </div>

      <DataTable
        columns={['Name', 'Email', 'Role', 'Status']}
        rows={
          users.length
            ? users.map((u) => [
                <span key="n" className="font-medium">
                  {u.full_name || '—'}
                </span>,
                u.email || '—',
                <Badge key="r">{u.role}</Badge>,
                <StatusBadge key="s" status={u.is_active ? 'published' : 'archived'} />,
              ])
            : [['No profiles found', '', '', '']]
        }
      />
    </div>
  );
}
