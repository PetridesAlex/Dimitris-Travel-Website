import Link from 'next/link';
import {
  AdminPageHeader,
  AdminStatCards,
  DataTable,
  StatusBadge,
} from '@/components/admin/page-header';
import { Button } from '@/components/ui/button';
import {
  enquiryQueries,
  blogQueries,
  destinationQueries,
  itineraryQueries,
  hotelQueries,
} from '@/features/catalog/queries';
import { ArrowUpRight, Globe2, Hotel, Inbox, Route } from 'lucide-react';

export default async function AdminDashboardPage() {
  const [enquiries, today, destinations, posts, itineraries, hotels] = await Promise.all([
    enquiryQueries.getAll(),
    enquiryQueries.getToday(),
    destinationQueries.getAll(),
    blogQueries.getAll(),
    itineraryQueries.getAll(),
    hotelQueries.getAll(),
  ]);

  const openEnquiries = enquiries.filter(
    (e) => e.status === 'new' || e.status === 'contacted',
  ).length;

  return (
    <div>
      <AdminPageHeader
        eyebrow="Overview"
        title="Dashboard"
        description="A live pulse of enquiries, catalogue depth, and content ready to publish."
      />

      <AdminStatCards
        stats={[
          {
            label: "Today's enquiries",
            value: String(today.length || enquiries.filter((e) => e.status === 'new').length),
            hint: 'New leads awaiting a designer',
          },
          {
            label: 'Open pipeline',
            value: String(openEnquiries),
            hint: 'New + contacted',
          },
          {
            label: 'Destinations',
            value: String(destinations.length),
            hint: `${destinations.filter((d) => d.type === 'country').length} countries live`,
          },
          {
            label: 'Journeys & stays',
            value: String(itineraries.length + hotels.length),
            hint: `${itineraries.length} itineraries · ${hotels.length} hotels`,
          },
        ]}
      />

      <div className="mb-8 grid gap-4 lg:grid-cols-[1.4fr_1fr]">
        <div className="admin-panel p-5">
          <div className="mb-4 flex items-center justify-between">
            <h2 className="admin-display text-2xl text-[var(--admin-text)]">Quick actions</h2>
            <span className="text-[11px] tracking-[0.16em] text-[var(--admin-muted)] uppercase">
              Atelier tools
            </span>
          </div>
          <div className="grid gap-3 sm:grid-cols-2">
            {[
              {
                href: '/admin/destinations/new',
                label: 'New destination',
                icon: Globe2,
                detail: 'Continent, country or city',
              },
              {
                href: '/admin/hotels/new',
                label: 'New hotel',
                icon: Hotel,
                detail: 'Property with gallery',
              },
              {
                href: '/admin/itineraries/new',
                label: 'New itinerary',
                icon: Route,
                detail: 'Multi-day journey',
              },
              {
                href: '/admin/enquiries',
                label: 'Review enquiries',
                icon: Inbox,
                detail: `${openEnquiries} open in pipeline`,
              },
            ].map((a) => {
              const Icon = a.icon;
              return (
                <Link
                  key={a.href}
                  href={a.href}
                  className="group flex items-start gap-3 border border-[var(--admin-border)] bg-[#fffcf7] p-4 transition hover:border-[#c5a059]/55 hover:bg-[#c5a059]/08"
                >
                  <span className="flex h-9 w-9 items-center justify-center border border-[#c5a059]/35 bg-[#c5a059]/10 text-[#a8863f] transition group-hover:border-[#c5a059]">
                    <Icon className="h-4 w-4" strokeWidth={1.6} />
                  </span>
                  <span>
                    <span className="flex items-center gap-1.5 text-sm font-semibold text-[var(--admin-text)]">
                      {a.label}
                      <ArrowUpRight className="h-3.5 w-3.5 opacity-0 transition group-hover:opacity-100" />
                    </span>
                    <span className="mt-0.5 block text-xs text-[var(--admin-muted)]">
                      {a.detail}
                    </span>
                  </span>
                </Link>
              );
            })}
          </div>
        </div>

        <div className="admin-panel p-5">
          <h2 className="admin-display text-2xl text-[var(--admin-text)]">Publishing</h2>
          <p className="mt-2 text-sm text-[var(--admin-muted)]">
            {posts.length} blog posts · keep editorial cadence weekly.
          </p>
          <div className="mt-6 space-y-3">
            <Button asChild variant="admin" className="h-11 w-full tracking-[0.08em] uppercase">
              <Link href="/admin/blog/new">Write article</Link>
            </Button>
            <Button
              asChild
              variant="adminOutline"
              className="h-11 w-full tracking-[0.08em] uppercase"
            >
              <Link href="/admin/media">Open media library</Link>
            </Button>
            <Button
              asChild
              variant="adminOutline"
              className="h-11 w-full tracking-[0.08em] uppercase"
            >
              <Link href="/admin/homepage">Edit homepage</Link>
            </Button>
          </div>
        </div>
      </div>

      <div className="mb-4 flex items-end justify-between gap-3">
        <h2 className="admin-display text-2xl text-[var(--admin-text)]">Recent enquiries</h2>
        <Link
          href="/admin/enquiries"
          className="text-[11px] font-semibold tracking-[0.16em] text-[#a8863f] uppercase hover:underline"
        >
          View all
        </Link>
      </div>
      <DataTable
        columns={['Guest', 'Destination', 'Status', 'Date', '']}
        rows={enquiries.slice(0, 8).map((e) => [
          <div key="n">
            <div className="font-medium text-[var(--admin-text)]">{e.fullName}</div>
            <div className="text-xs text-[var(--admin-muted)]">{e.email}</div>
          </div>,
          e.destination || '—',
          <StatusBadge key="s" status={e.status} />,
          new Date(e.createdAt).toLocaleDateString(),
          <Link
            key="l"
            href={`/admin/enquiries/${e.id}`}
            className="text-[12px] font-semibold tracking-wide text-[#a8863f] uppercase hover:underline"
          >
            Open
          </Link>,
        ])}
      />
    </div>
  );
}
