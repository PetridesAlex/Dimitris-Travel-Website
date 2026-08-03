import Link from 'next/link';
import {
  AdminPageHeader,
  DataTable,
  StatusBadge,
} from '@/components/admin/page-header';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import {
  enquiryQueries,
  blogQueries,
  destinationQueries,
} from '@/features/catalog/queries';

export default function AdminDashboardPage() {
  const enquiries = enquiryQueries.getAll();
  const today = enquiryQueries.getToday();
  const drafts = destinationQueries.getAll().length;
  const posts = blogQueries.getAll();

  return (
    <div>
      <AdminPageHeader
        title="Dashboard"
        description="Today's pulse across enquiries, content, and quick actions."
      />

      <div className="mb-8 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {[
          { label: "Today's enquiries", value: String(today.length || enquiries.filter(e => e.status === 'new').length) },
          { label: 'Open enquiries', value: String(enquiries.filter((e) => e.status === 'new' || e.status === 'contacted').length) },
          { label: 'Destinations', value: String(drafts) },
          { label: 'Blog posts', value: String(posts.length) },
        ].map((stat) => (
          <Card key={stat.label}>
            <CardHeader>
              <CardTitle className="text-sm font-medium text-[var(--admin-muted)]">
                {stat.label}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-semibold">{stat.value}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="mb-8 flex flex-wrap gap-3">
        {[
          { href: '/admin/destinations', label: 'Create Destination' },
          { href: '/admin/hotels', label: 'Create Hotel' },
          { href: '/admin/experiences', label: 'Create Experience' },
          { href: '/admin/media', label: 'Upload Media' },
        ].map((a) => (
          <Button key={a.href} asChild variant="admin">
            <Link href={a.href}>{a.label}</Link>
          </Button>
        ))}
      </div>

      <h2 className="mb-4 text-lg font-semibold">Recent enquiries</h2>
      <DataTable
        columns={['Name', 'Destination', 'Status', 'Date', '']}
        rows={enquiries.map((e) => [
          <div key="n">
            <div className="font-medium">{e.fullName}</div>
            <div className="text-xs text-[var(--admin-muted)]">{e.email}</div>
          </div>,
          e.destination,
          <StatusBadge key="s" status={e.status} />,
          new Date(e.createdAt).toLocaleDateString(),
          <Link key="l" href="/admin/enquiries" className="text-[var(--color-gold-dark)]">
            View
          </Link>,
        ])}
      />
    </div>
  );
}
