import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';

export function AdminPageHeader({
  title,
  description,
  action,
}: {
  title: string;
  description?: string;
  action?: { label: string; href: string };
}) {
  return (
    <div className="mb-8 flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight text-[var(--admin-text)]">
          {title}
        </h1>
        {description ? (
          <p className="mt-1 text-sm text-[var(--admin-muted)]">{description}</p>
        ) : null}
      </div>
      {action ? (
        <Button asChild variant="admin">
          <Link href={action.href}>{action.label}</Link>
        </Button>
      ) : null}
    </div>
  );
}

export function StatusBadge({ status }: { status: string }) {
  const color =
    status === 'published' || status === 'won'
      ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
      : status === 'draft' || status === 'new'
        ? 'bg-amber-50 text-amber-700 border-amber-200'
        : 'bg-zinc-50 text-zinc-600 border-zinc-200';

  return <Badge className={color}>{status}</Badge>;
}

export function DataTable({
  columns,
  rows,
}: {
  columns: string[];
  rows: React.ReactNode[][];
}) {
  return (
    <div className="overflow-hidden rounded-lg border border-[var(--admin-border)] bg-white">
      <table className="w-full text-left text-sm">
        <thead className="border-b border-[var(--admin-border)] bg-[var(--admin-bg)]">
          <tr>
            {columns.map((col) => (
              <th key={col} className="px-4 py-3 font-medium text-[var(--admin-muted)]">
                {col}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((row, i) => (
            <tr key={i} className="border-b border-[var(--admin-border)] last:border-0">
              {row.map((cell, j) => (
                <td key={j} className="px-4 py-3 align-middle">
                  {cell}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
