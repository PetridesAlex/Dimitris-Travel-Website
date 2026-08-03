import { AdminPageHeader, DataTable } from '@/components/admin/page-header';

const items = [
  { label: 'Home', href: '/', order: 1 },
  { label: 'Destinations', href: '/destinations', order: 2 },
  { label: 'Experiences', href: '/experiences', order: 3 },
  { label: 'Special Collections', href: '/collections', order: 4 },
  { label: 'About Us', href: '/about', order: 5 },
  { label: 'Contact', href: '/contact', order: 6 },
];

export default function AdminNavigationPage() {
  return (
    <div>
      <AdminPageHeader title="Navigation" description="Primary header menu and footer link columns." action={{ label: 'Add item', href: '#' }} />
      <DataTable
        columns={['Order', 'Label', 'Href']}
        rows={items.map((i) => [String(i.order), i.label, i.href])}
      />
    </div>
  );
}
