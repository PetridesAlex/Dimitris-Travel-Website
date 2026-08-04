'use client';

import { useMemo, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Search, CalendarDays, UserRound } from 'lucide-react';
import { StatusBadge } from '@/components/admin/page-header';
import { cn } from '@/lib/utils';

export type BlogRow = {
  id: string;
  slug: string;
  title: string;
  excerpt?: string;
  category: string;
  author: string;
  publishedAt: string;
  image?: string;
  status?: string;
};

function formatDate(value: string) {
  if (!value) return '—';
  const d = new Date(value);
  if (Number.isNaN(d.getTime())) return value;
  return d.toLocaleDateString('en-GB', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  });
}

export function BlogManager({ items }: { items: BlogRow[] }) {
  const [query, setQuery] = useState('');
  const [category, setCategory] = useState('all');
  const [status, setStatus] = useState<'all' | 'published' | 'draft' | 'archived'>('all');

  const categories = useMemo(() => {
    const set = new Set(items.map((p) => p.category).filter(Boolean));
    return ['all', ...Array.from(set).sort()];
  }, [items]);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return items.filter((p) => {
      const postStatus = p.status || 'published';
      if (category !== 'all' && p.category !== category) return false;
      if (status !== 'all' && postStatus !== status) return false;
      if (!q) return true;
      return (
        p.title.toLowerCase().includes(q) ||
        p.author.toLowerCase().includes(q) ||
        p.category.toLowerCase().includes(q) ||
        p.slug.toLowerCase().includes(q) ||
        (p.excerpt || '').toLowerCase().includes(q)
      );
    });
  }, [items, query, category, status]);

  const counts = useMemo(() => {
    const published = items.filter((p) => (p.status || 'published') === 'published').length;
    const drafts = items.filter((p) => p.status === 'draft').length;
    return {
      all: items.length,
      published,
      draft: drafts,
      archived: items.filter((p) => p.status === 'archived').length,
    };
  }, [items]);

  return (
    <div className="space-y-5">
      <div className="grid gap-4 sm:grid-cols-3">
        {[
          { label: 'Articles', value: counts.all, hint: 'Total in library' },
          { label: 'Published', value: counts.published, hint: 'Live on the site' },
          { label: 'Drafts', value: counts.draft, hint: 'Awaiting review' },
        ].map((stat) => (
          <div key={stat.label} className="admin-kpi p-4">
            <p className="text-[11px] font-semibold tracking-[0.16em] text-[var(--admin-muted)] uppercase">
              {stat.label}
            </p>
            <p className="admin-display mt-2 text-3xl text-[var(--admin-text)]">{stat.value}</p>
            <p className="mt-1 text-xs text-[var(--admin-muted)]">{stat.hint}</p>
          </div>
        ))}
      </div>

      <div className="admin-panel p-4 md:p-5">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
          <div className="flex flex-wrap gap-2">
            {(
              [
                { id: 'all' as const, label: 'All', count: counts.all },
                { id: 'published' as const, label: 'Published', count: counts.published },
                { id: 'draft' as const, label: 'Drafts', count: counts.draft },
              ] as const
            ).map((tab) => (
              <button
                key={tab.id}
                type="button"
                onClick={() => setStatus(tab.id)}
                className={cn(
                  'border px-3 py-2 text-[12px] tracking-wide transition',
                  status === tab.id
                    ? 'border-[#c5a059] bg-[#c5a059]/12 text-[#8f7132]'
                    : 'border-[var(--admin-border)] bg-white text-[var(--admin-muted)] hover:border-[#c5a059]/40',
                )}
              >
                {tab.label}
                <span className="ml-2 text-[11px] opacity-70">{tab.count}</span>
              </button>
            ))}

            <select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="h-[38px] border border-[var(--admin-border)] bg-white px-3 text-[12px] text-[var(--admin-text)] outline-none focus:border-[#c5a059]/55"
            >
              {categories.map((c) => (
                <option key={c} value={c}>
                  {c === 'all' ? 'All categories' : c}
                </option>
              ))}
            </select>
          </div>

          <div className="relative w-full max-w-sm">
            <Search className="pointer-events-none absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 text-[var(--admin-muted)]" />
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search title, author, category…"
              className="h-10 w-full border border-[var(--admin-border)] bg-white pr-3 pl-9 text-sm outline-none focus:border-[#c5a059]/55"
            />
          </div>
        </div>
        <p className="mt-4 text-xs text-[var(--admin-muted)]">
          Editorial library · Showing{' '}
          <span className="font-medium text-[var(--admin-text)]">{filtered.length}</span> of{' '}
          {items.length}
        </p>
      </div>

      <div className="admin-panel overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[920px] text-left text-sm">
            <thead>
              <tr className="border-b border-[var(--admin-border)] bg-[linear-gradient(180deg,#faf6ef,#f3eee4)]">
                {['Article', 'Category', 'Author', 'Published', 'Status', 'Actions'].map((col) => (
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
                    No articles match your filters.
                  </td>
                </tr>
              ) : (
                filtered.map((p) => (
                  <tr
                    key={p.id}
                    className="border-b border-[var(--admin-border)]/80 transition last:border-0 hover:bg-[#c5a059]/[0.04]"
                  >
                    <td className="px-4 py-3.5">
                      <div className="flex items-start gap-3">
                        <div className="relative h-14 w-[4.5rem] shrink-0 overflow-hidden border border-[var(--admin-border)] bg-[#f3eee4]">
                          {p.image ? (
                            <Image
                              src={p.image}
                              alt=""
                              fill
                              className="object-cover"
                              sizes="72px"
                            />
                          ) : null}
                        </div>
                        <div className="min-w-0 pt-0.5">
                          <p className="font-medium text-[var(--admin-text)]">{p.title}</p>
                          {p.excerpt ? (
                            <p className="mt-1 line-clamp-1 text-xs text-[var(--admin-muted)]">
                              {p.excerpt}
                            </p>
                          ) : (
                            <p className="mt-1 text-xs text-[var(--admin-muted)]">/{p.slug}</p>
                          )}
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-3.5">
                      <span className="border border-[var(--admin-border)] bg-[#f7f3eb] px-2 py-1 text-[10px] tracking-[0.12em] text-[var(--admin-muted)] uppercase">
                        {p.category || 'Uncategorised'}
                      </span>
                    </td>
                    <td className="px-4 py-3.5">
                      <span className="inline-flex items-center gap-1.5 text-[var(--admin-text)]">
                        <UserRound className="h-3.5 w-3.5 text-[#c5a059]" strokeWidth={1.6} />
                        {p.author || '—'}
                      </span>
                    </td>
                    <td className="px-4 py-3.5">
                      <span className="inline-flex items-center gap-1.5 text-[var(--admin-muted)]">
                        <CalendarDays className="h-3.5 w-3.5 text-[#c5a059]" strokeWidth={1.6} />
                        {formatDate(p.publishedAt)}
                      </span>
                    </td>
                    <td className="px-4 py-3.5">
                      <StatusBadge status={p.status || 'published'} />
                    </td>
                    <td className="px-4 py-3.5">
                      <div className="flex items-center gap-3">
                        <Link
                          href={`/admin/blog/${p.id}`}
                          className="text-[12px] font-semibold tracking-wide text-[#a8863f] uppercase hover:underline"
                        >
                          Edit
                        </Link>
                        <Link
                          href={`/en/blog/${p.slug}`}
                          target="_blank"
                          className="text-[12px] tracking-wide text-[var(--admin-muted)] uppercase hover:text-[var(--admin-text)]"
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
