'use client';

import { useMemo, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Search, Star } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { StatusBadge } from '@/components/admin/page-header';
import { cn } from '@/lib/utils';

type DestinationRow = {
  id: string;
  name: string;
  type: string;
  slugPath: string;
  featured: boolean;
  image?: string;
  status?: string;
};

export function DestinationsManager({ items }: { items: DestinationRow[] }) {
  const [query, setQuery] = useState('');
  const [type, setType] = useState<'all' | 'continent' | 'country' | 'city'>('all');
  const [featuredOnly, setFeaturedOnly] = useState(false);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return items.filter((d) => {
      if (type !== 'all' && d.type !== type) return false;
      if (featuredOnly && !d.featured) return false;
      if (!q) return true;
      return (
        d.name.toLowerCase().includes(q) ||
        d.slugPath.toLowerCase().includes(q) ||
        d.type.toLowerCase().includes(q)
      );
    });
  }, [items, query, type, featuredOnly]);

  const counts = useMemo(
    () => ({
      all: items.length,
      continent: items.filter((d) => d.type === 'continent').length,
      country: items.filter((d) => d.type === 'country').length,
      city: items.filter((d) => d.type === 'city').length,
      featured: items.filter((d) => d.featured).length,
    }),
    [items],
  );

  const tabs: Array<{ id: typeof type; label: string; count: number }> = [
    { id: 'all', label: 'All', count: counts.all },
    { id: 'continent', label: 'Continents', count: counts.continent },
    { id: 'country', label: 'Countries', count: counts.country },
    { id: 'city', label: 'Cities', count: counts.city },
  ];

  return (
    <div className="space-y-5">
      <div className="admin-panel p-4 md:p-5">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
          <div className="flex flex-wrap gap-2">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                type="button"
                onClick={() => setType(tab.id)}
                className={cn(
                  'border px-3 py-2 text-[12px] tracking-wide transition',
                  type === tab.id
                    ? 'border-[#c5a059] bg-[#c5a059]/12 text-[#8f7132]'
                    : 'border-[var(--admin-border)] bg-white text-[var(--admin-muted)] hover:border-[#c5a059]/40',
                )}
              >
                {tab.label}
                <span className="ml-2 text-[11px] opacity-70">{tab.count}</span>
              </button>
            ))}
            <button
              type="button"
              onClick={() => setFeaturedOnly((v) => !v)}
              className={cn(
                'inline-flex items-center gap-1.5 border px-3 py-2 text-[12px] tracking-wide transition',
                featuredOnly
                  ? 'border-[#c5a059] bg-[#c5a059]/12 text-[#8f7132]'
                  : 'border-[var(--admin-border)] bg-white text-[var(--admin-muted)] hover:border-[#c5a059]/40',
              )}
            >
              <Star className="h-3.5 w-3.5" strokeWidth={1.7} />
              Featured
              <span className="opacity-70">{counts.featured}</span>
            </button>
          </div>

          <div className="relative w-full max-w-sm">
            <Search className="pointer-events-none absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 text-[var(--admin-muted)]" />
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Filter by name or slug path…"
              className="h-10 w-full border border-[var(--admin-border)] bg-white pl-9 pr-3 text-sm outline-none focus:border-[#c5a059]/55"
            />
          </div>
        </div>
        <p className="mt-4 text-xs text-[var(--admin-muted)]">
          Hierarchy: Continent → Country → City · Showing{' '}
          <span className="font-medium text-[var(--admin-text)]">{filtered.length}</span> of{' '}
          {items.length}
        </p>
      </div>

      <div className="admin-panel overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[860px] text-left text-sm">
            <thead>
              <tr className="border-b border-[var(--admin-border)] bg-[linear-gradient(180deg,#faf6ef,#f3eee4)]">
                {['Destination', 'Type', 'Path', 'Featured', 'Status', 'Actions'].map((col) => (
                  <th
                    key={col}
                    className="px-4 py-3.5 text-[10px] font-semibold tracking-[0.16em] text-[var(--admin-muted)] uppercase"
                  >
                    {col}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filtered.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-4 py-12 text-center text-[var(--admin-muted)]">
                    No destinations match your filters.
                  </td>
                </tr>
              ) : (
                filtered.map((d) => (
                  <tr
                    key={d.id}
                    className="border-b border-[var(--admin-border)]/80 transition last:border-0 hover:bg-[#c5a059]/[0.04]"
                  >
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-3">
                        <div className="relative h-11 w-14 overflow-hidden border border-[var(--admin-border)] bg-[#f3eee4]">
                          {d.image ? (
                            <Image
                              src={d.image}
                              alt=""
                              fill
                              className="object-cover"
                              sizes="56px"
                            />
                          ) : null}
                        </div>
                        <span className="font-medium text-[var(--admin-text)]">{d.name}</span>
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <Badge className="rounded-none border-[var(--admin-border)] bg-[#f7f3eb] text-[10px] tracking-[0.12em] uppercase">
                        {d.type}
                      </Badge>
                    </td>
                    <td className="px-4 py-3">
                      <code className="text-[12px] text-[var(--admin-muted)]">{d.slugPath}</code>
                    </td>
                    <td className="px-4 py-3">
                      {d.featured ? (
                        <span className="inline-flex items-center gap-1 text-[#a8863f]">
                          <Star className="h-3.5 w-3.5 fill-current" /> Yes
                        </span>
                      ) : (
                        <span className="text-[var(--admin-muted)]">No</span>
                      )}
                    </td>
                    <td className="px-4 py-3">
                      <StatusBadge status={d.status || 'published'} />
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-3">
                        <Link
                          href={`/admin/destinations/${d.id}`}
                          className="text-[12px] font-semibold tracking-wide text-[#a8863f] uppercase hover:underline"
                        >
                          Edit
                        </Link>
                        <Link
                          href={`/en/destinations/${d.slugPath}`}
                          className="text-[12px] tracking-wide text-[var(--admin-muted)] uppercase hover:text-[var(--admin-text)]"
                          target="_blank"
                        >
                          View
                        </Link>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
