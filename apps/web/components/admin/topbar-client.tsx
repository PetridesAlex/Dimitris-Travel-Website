'use client';

import { useMemo, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Search, LogOut, Command, Bell, ArrowUpRight } from 'lucide-react';
import { cn } from '@/lib/utils';
import { logoutAction } from '@/features/cms/auth-actions';

const JUMP_LINKS = [
  { href: '/admin/destinations', label: 'Destinations', hint: 'Catalogue' },
  { href: '/admin/hotels', label: 'Hotels', hint: 'Catalogue' },
  { href: '/admin/experiences', label: 'Experiences', hint: 'Catalogue' },
  { href: '/admin/itineraries', label: 'Itineraries', hint: 'Catalogue' },
  { href: '/admin/enquiries', label: 'Enquiries', hint: 'CRM' },
  { href: '/admin/media', label: 'Media Library', hint: 'Assets' },
  { href: '/admin/blog', label: 'Blog', hint: 'Publish' },
  { href: '/admin/settings', label: 'Settings', hint: 'System' },
  { href: '/admin/seo', label: 'SEO', hint: 'System' },
  { href: '/admin/users', label: 'Users', hint: 'System' },
];

export function AdminTopbarClient({
  email,
  name,
  initials,
  role,
  demo,
  enquiryCount,
}: {
  email: string;
  name: string;
  initials: string;
  role: string;
  demo: boolean;
  enquiryCount: number;
}) {
  const router = useRouter();
  const [query, setQuery] = useState('');
  const [open, setOpen] = useState(false);

  const results = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return JUMP_LINKS.slice(0, 6);
    return JUMP_LINKS.filter(
      (item) =>
        item.label.toLowerCase().includes(q) ||
        item.hint.toLowerCase().includes(q),
    ).slice(0, 8);
  }, [query]);

  return (
    <header className="sticky top-0 z-30 flex h-[68px] items-center justify-between gap-4 border-b border-[var(--admin-border)] bg-[color-mix(in_srgb,var(--admin-surface)_88%,transparent)] px-5 backdrop-blur-md lg:px-8">
      <div className="relative w-full max-w-xl">
        <Search className="pointer-events-none absolute top-1/2 left-3.5 h-4 w-4 -translate-y-1/2 text-[var(--admin-muted)]" />
        <input
          value={query}
          onChange={(e) => {
            setQuery(e.target.value);
            setOpen(true);
          }}
          onFocus={() => setOpen(true)}
          onBlur={() => setTimeout(() => setOpen(false), 150)}
          onKeyDown={(e) => {
            if (e.key === 'Enter' && results[0]) {
              router.push(results[0].href);
              setOpen(false);
              setQuery('');
            }
            if (e.key === 'Escape') setOpen(false);
          }}
          placeholder="Jump to destinations, enquiries, settings…"
          className="h-11 w-full border border-[var(--admin-border)] bg-white/80 pr-16 pl-10 text-sm text-[var(--admin-text)] outline-none transition placeholder:text-[var(--admin-muted)] focus:border-[#c5a059]/55 focus:bg-white"
        />
        <span className="pointer-events-none absolute top-1/2 right-3 flex -translate-y-1/2 items-center gap-1 border border-[var(--admin-border)] px-1.5 py-0.5 text-[10px] tracking-wide text-[var(--admin-muted)] uppercase">
          <Command className="h-3 w-3" strokeWidth={1.75} />
          K
        </span>

        {open ? (
          <div className="admin-panel absolute inset-x-0 top-[calc(100%+8px)] z-40 overflow-hidden py-2">
            <p className="px-4 pb-2 text-[10px] font-semibold tracking-[0.18em] text-[var(--admin-muted)] uppercase">
              Quick jump
            </p>
            {results.length === 0 ? (
              <p className="px-4 py-3 text-sm text-[var(--admin-muted)]">No matches</p>
            ) : (
              results.map((item) => (
                <button
                  key={item.href}
                  type="button"
                  className="flex w-full items-center justify-between px-4 py-2.5 text-left text-sm transition hover:bg-[#c5a059]/10"
                  onMouseDown={(e) => e.preventDefault()}
                  onClick={() => {
                    router.push(item.href);
                    setOpen(false);
                    setQuery('');
                  }}
                >
                  <span className="font-medium text-[var(--admin-text)]">{item.label}</span>
                  <span className="text-[11px] tracking-wide text-[var(--admin-muted)] uppercase">
                    {item.hint}
                  </span>
                </button>
              ))
            )}
          </div>
        ) : null}
      </div>

      <div className="flex shrink-0 items-center gap-2 sm:gap-3">
        <span
          className={cn(
            'hidden items-center gap-1.5 border px-2.5 py-1 text-[10px] font-semibold tracking-[0.16em] uppercase sm:inline-flex',
            demo
              ? 'border-amber-300 bg-amber-50 text-amber-800'
              : 'border-emerald-300/80 bg-emerald-50 text-emerald-800',
          )}
        >
          <span
            className={cn(
              'h-1.5 w-1.5 rounded-full',
              demo ? 'bg-amber-500' : 'bg-emerald-500',
            )}
          />
          {demo ? 'Demo' : 'Live'}
        </span>

        <Link
          href="/admin/enquiries"
          className="relative flex h-10 w-10 items-center justify-center border border-[var(--admin-border)] bg-white text-[var(--admin-muted)] transition hover:border-[#c5a059]/50 hover:text-[#c5a059]"
          aria-label="Enquiries"
        >
          <Bell className="h-4 w-4" strokeWidth={1.6} />
          {enquiryCount > 0 ? (
            <span className="absolute -top-1.5 -right-1.5 flex h-4 min-w-4 items-center justify-center bg-[#c5a059] px-1 text-[10px] font-bold text-[#0c0c0c]">
              {enquiryCount > 9 ? '9+' : enquiryCount}
            </span>
          ) : null}
        </Link>

        <Link
          href="/en"
          target="_blank"
          className="hidden h-10 items-center gap-1.5 border border-[var(--admin-border)] bg-white px-3 text-[12px] font-medium text-[var(--admin-text)] transition hover:border-[#c5a059]/50 hover:text-[#c5a059] md:inline-flex"
        >
          View site
          <ArrowUpRight className="h-3.5 w-3.5" strokeWidth={1.7} />
        </Link>

        <div className="hidden h-10 items-center gap-3 border border-[var(--admin-border)] bg-white pl-3 pr-1.5 lg:flex">
          <div className="min-w-0">
            <p className="truncate text-[12px] font-medium text-[var(--admin-text)]">
              {name || email}
            </p>
            <p className="truncate text-[10px] tracking-wide text-[var(--admin-muted)] uppercase">
              {role.replaceAll('_', ' ')}
            </p>
          </div>
          <div className="flex h-7 w-7 items-center justify-center bg-[linear-gradient(135deg,#a8863f,#c5a059,#d4b56e)] text-[11px] font-bold text-[#0c0c0c]">
            {initials}
          </div>
        </div>

        <form action={logoutAction}>
          <button
            type="submit"
            className="flex h-10 items-center gap-1.5 border border-[var(--admin-border)] bg-white px-3 text-[12px] text-[var(--admin-muted)] transition hover:border-[#c5a059]/45 hover:text-[#c5a059]"
          >
            <LogOut className="h-3.5 w-3.5" strokeWidth={1.7} />
            <span className="hidden sm:inline">Sign out</span>
          </button>
        </form>
      </div>
    </header>
  );
}
