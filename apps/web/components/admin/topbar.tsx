'use client';

import Link from 'next/link';
import { Search } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';

export function AdminTopbar() {
  return (
    <header className="flex h-16 items-center justify-between border-b border-[var(--admin-border)] bg-white px-6">
      <div className="relative w-full max-w-md">
        <Search className="pointer-events-none absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 text-[var(--admin-muted)]" />
        <Input
          placeholder="Search destinations, hotels, media…"
          className="pl-9"
        />
      </div>
      <div className="flex items-center gap-3">
        <Badge>Demo Mode</Badge>
        <Link
          href="/en"
          className="text-sm text-[var(--admin-muted)] hover:text-[var(--admin-text)]"
        >
          View site
        </Link>
        <div className="flex h-9 w-9 items-center justify-center rounded-full bg-[var(--color-gold)] text-sm font-semibold text-[var(--color-ink)]">
          SA
        </div>
      </div>
    </header>
  );
}
