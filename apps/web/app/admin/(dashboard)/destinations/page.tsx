import Link from 'next/link';
import { AdminPageHeader } from '@/components/admin/page-header';
import { DestinationsManager } from '@/components/admin/destinations-manager';
import { destinationQueries } from '@/features/catalog/queries';

export default async function AdminDestinationsPage() {
  const items = await destinationQueries.adminGetAll();

  return (
    <div>
      <AdminPageHeader
        eyebrow="Catalogue"
        title="Destinations"
        description="Manage continents, countries, and cities as a curated hierarchy for the public site."
        action={{ label: 'New destination', href: '/admin/destinations/new' }}
        actions={
          <Link
            href="/en/destinations"
            target="_blank"
            className="inline-flex h-11 items-center border border-[var(--admin-border)] bg-white px-4 text-[11px] font-semibold tracking-[0.14em] text-[var(--admin-muted)] uppercase transition hover:border-[#c5a059]/50 hover:text-[#a8863f]"
          >
            Preview public
          </Link>
        }
      />
      <DestinationsManager
        items={items.map((d) => ({
          id: d.id,
          name: d.name,
          type: d.type,
          slugPath: d.slugPath,
          featured: d.featured,
          image: d.image,
          status: (d as { status?: string }).status || 'published',
        }))}
      />
    </div>
  );
}
