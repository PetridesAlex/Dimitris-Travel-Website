'use client';

import { useState } from 'react';
import { CmsForm } from '@/components/admin/cms-form';
import { saveNavigationItemsAction } from '@/features/cms/actions';
import { Button } from '@/components/ui/button';

type NavItem = { id?: string; href: string; label: string; sortOrder: number };

export function NavigationEditor({ initial }: { initial: NavItem[] }) {
  const [items, setItems] = useState<NavItem[]>(
    initial.length
      ? initial
      : [{ href: '/', label: 'Home', sortOrder: 1 }],
  );

  function update(i: number, patch: Partial<NavItem>) {
    setItems((prev) => prev.map((item, idx) => (idx === i ? { ...item, ...patch } : item)));
  }

  return (
    <div className="space-y-4">
      {items.map((item, i) => (
        <div
          key={item.id || i}
          className="grid gap-3 rounded-lg border border-[var(--admin-border)] bg-white p-4 sm:grid-cols-4"
        >
          <label className="space-y-1 text-sm">
            <span className="text-[var(--admin-muted)]">Order</span>
            <input
              type="number"
              className="flex h-11 w-full rounded-md border border-[var(--admin-border)] px-3 text-sm"
              value={item.sortOrder}
              onChange={(e) => update(i, { sortOrder: Number(e.target.value) || 0 })}
            />
          </label>
          <label className="space-y-1 text-sm sm:col-span-1">
            <span className="text-[var(--admin-muted)]">Label</span>
            <input
              className="flex h-11 w-full rounded-md border border-[var(--admin-border)] px-3 text-sm"
              value={item.label}
              onChange={(e) => update(i, { label: e.target.value })}
            />
          </label>
          <label className="space-y-1 text-sm sm:col-span-1">
            <span className="text-[var(--admin-muted)]">Href</span>
            <input
              className="flex h-11 w-full rounded-md border border-[var(--admin-border)] px-3 text-sm"
              value={item.href}
              onChange={(e) => update(i, { href: e.target.value })}
            />
          </label>
          <div className="flex items-end">
            <Button
              type="button"
              variant="adminOutline"
              className="h-11"
              onClick={() => setItems((prev) => prev.filter((_, idx) => idx !== i))}
            >
              Remove
            </Button>
          </div>
        </div>
      ))}
      <Button
        type="button"
        variant="adminOutline"
        onClick={() =>
          setItems((prev) => [
            ...prev,
            { href: '/', label: 'New item', sortOrder: prev.length + 1 },
          ])
        }
      >
        Add item
      </Button>

      <CmsForm action={saveNavigationItemsAction} submitLabel="Save navigation">
        <input type="hidden" name="items" value={JSON.stringify(items)} />
      </CmsForm>
    </div>
  );
}
