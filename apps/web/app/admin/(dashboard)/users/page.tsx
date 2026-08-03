import { AdminPageHeader, DataTable, StatusBadge } from '@/components/admin/page-header';
import { Badge } from '@/components/ui/badge';

const users = [
  { name: 'Alex Super', email: 'alex@uncharted.example', role: 'super_admin', active: true },
  { name: 'Maya Admin', email: 'maya@uncharted.example', role: 'admin', active: true },
  { name: 'Leo Editor', email: 'leo@uncharted.example', role: 'editor', active: true },
  { name: 'Nina Writer', email: 'nina@uncharted.example', role: 'content_writer', active: true },
  { name: 'Sam Marketing', email: 'sam@uncharted.example', role: 'marketing', active: false },
];

export default function AdminUsersPage() {
  return (
    <div>
      <AdminPageHeader title="Users" description="Roles: Super Admin, Admin, Editor, Content Writer, Marketing." action={{ label: 'Invite user', href: '#' }} />
      <DataTable
        columns={['Name', 'Email', 'Role', 'Status']}
        rows={users.map((u) => [
          <span key="n" className="font-medium">{u.name}</span>,
          u.email,
          <Badge key="r">{u.role}</Badge>,
          <StatusBadge key="s" status={u.active ? 'published' : 'archived'} />,
        ])}
      />
    </div>
  );
}
