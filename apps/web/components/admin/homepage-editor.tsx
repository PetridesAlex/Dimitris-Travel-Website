'use client';

import { useState } from 'react';
import { Badge } from '@/components/ui/badge';
import { CmsForm } from '@/components/admin/cms-form';
import { saveHomepageSectionsAction } from '@/features/cms/actions';

export type HomeSection = {
  id: string;
  type: string;
  label: string;
  enabled: boolean;
};

export function HomepageSectionsEditor({ initial }: { initial: HomeSection[] }) {
  const [sections, setSections] = useState(initial);

  return (
    <div className="space-y-3">
      {sections.map((s, idx) => (
        <div
          key={s.id}
          className="flex flex-wrap items-center justify-between gap-3 rounded-lg border border-[var(--admin-border)] bg-white px-4 py-4"
        >
          <div className="flex items-center gap-3">
            <span className="text-xs text-[var(--admin-muted)]">#{idx + 1}</span>
            <span className="text-base font-semibold">{s.label}</span>
            <Badge>{s.type}</Badge>
          </div>
          <label className="flex items-center gap-2 text-sm">
            <input
              type="checkbox"
              checked={s.enabled}
              onChange={(e) =>
                setSections((prev) =>
                  prev.map((row) =>
                    row.id === s.id ? { ...row, enabled: e.target.checked } : row,
                  ),
                )
              }
              className="h-4 w-4 rounded border-[var(--admin-border)]"
            />
            Enabled
          </label>
        </div>
      ))}
      <CmsForm action={saveHomepageSectionsAction} submitLabel="Save homepage sections">
        <input
          type="hidden"
          name="sections"
          value={JSON.stringify(
            sections.map(({ id, type, enabled }) => ({ id, type, enabled })),
          )}
        />
      </CmsForm>
    </div>
  );
}
