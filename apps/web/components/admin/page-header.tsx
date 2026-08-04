import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';

export function AdminPageHeader({
  title,
  description,
  action,
  actions,
  eyebrow,
}: {
  title: string;
  description?: string;
  eyebrow?: string;
  action?: { label: string; href: string };
  actions?: React.ReactNode;
}) {
  return (
    <div className="mb-8 flex flex-col justify-between gap-5 sm:flex-row sm:items-end">
      <div>
        {eyebrow ? (
          <p className="mb-2 text-[11px] font-semibold tracking-[0.22em] text-[#c5a059] uppercase">
            {eyebrow}
          </p>
        ) : null}
        <h1 className="admin-display text-3xl text-[var(--admin-text)] md:text-4xl">{title}</h1>
        {description ? (
          <p className="mt-2 max-w-2xl text-sm leading-relaxed text-[var(--admin-muted)]">
            {description}
          </p>
        ) : null}
      </div>
      <div className="flex flex-wrap items-center gap-2">
        {actions}
        {action ? (
          <Button asChild variant="admin" className="h-11 px-5 tracking-[0.08em] uppercase">
            <Link href={action.href}>{action.label}</Link>
          </Button>
        ) : null}
      </div>
    </div>
  );
}

export function StatusBadge({ status }: { status: string }) {
  const color =
    status === 'published' || status === 'won' || status === 'qualified'
      ? 'border-emerald-200 bg-emerald-50 text-emerald-800'
      : status === 'draft' || status === 'new'
        ? 'border-amber-200 bg-amber-50 text-amber-800'
        : status === 'archived' || status === 'lost'
          ? 'border-rose-200 bg-rose-50 text-rose-800'
          : 'border-[var(--admin-border)] bg-[#f7f3eb] text-[var(--admin-muted)]';

  return (
    <Badge className={cn('rounded-none px-2 py-0.5 text-[10px] tracking-[0.14em] uppercase', color)}>
      {status}
    </Badge>
  );
}

export function DataTable({
  columns,
  rows,
  emptyMessage = 'No records yet.',
}: {
  columns: string[];
  rows: React.ReactNode[][];
  emptyMessage?: string;
}) {
  return (
    <div className="admin-panel overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full min-w-[720px] text-left text-sm">
          <thead>
            <tr className="border-b border-[var(--admin-border)] bg-[linear-gradient(180deg,#faf6ef,#f3eee4)]">
              {columns.map((col) => (
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
            {rows.length === 0 ? (
              <tr>
                <td
                  colSpan={columns.length}
                  className="px-4 py-12 text-center text-sm text-[var(--admin-muted)]"
                >
                  {emptyMessage}
                </td>
              </tr>
            ) : (
              rows.map((row, i) => (
                <tr
                  key={i}
                  className="border-b border-[var(--admin-border)]/80 transition last:border-0 hover:bg-[#c5a059]/[0.04]"
                >
                  {row.map((cell, j) => (
                    <td key={j} className="px-4 py-3.5 align-middle">
                      {cell}
                    </td>
                  ))}
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export function AdminStatCards({
  stats,
}: {
  stats: { label: string; value: string; hint?: string }[];
}) {
  return (
    <div className="mb-8 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
      {stats.map((stat) => (
        <div key={stat.label} className="admin-kpi p-5">
          <p className="text-[11px] font-semibold tracking-[0.16em] text-[var(--admin-muted)] uppercase">
            {stat.label}
          </p>
          <p className="admin-display mt-3 text-4xl text-[var(--admin-text)]">{stat.value}</p>
          {stat.hint ? (
            <p className="mt-2 text-xs text-[var(--admin-muted)]">{stat.hint}</p>
          ) : null}
        </div>
      ))}
    </div>
  );
}
