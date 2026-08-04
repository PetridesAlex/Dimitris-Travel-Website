/* eslint-disable @typescript-eslint/no-explicit-any */
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { AdminPageHeader, StatusBadge } from '@/components/admin/page-header';
import { EnquiryNoteForm, EnquiryStatusForm } from '@/components/admin/enquiry-forms';
import { enquiryQueries } from '@/features/catalog/queries';
import { createServiceClient } from '@/lib/supabase/server';

export default async function EnquiryDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const enquiry = await enquiryQueries.getById(id);
  if (!enquiry) notFound();

  const db = createServiceClient();
  let notes: { id: string; body: string; created_at: string }[] = [];
  if (db) {
    const { data } = await (db as any)
      .from('enquiry_notes')
      .select('id, body, created_at')
      .eq('enquiry_id', id)
      .order('created_at', { ascending: false });
    notes = data || [];
  }

  return (
    <div className="max-w-3xl">
      <AdminPageHeader
        title={enquiry.fullName}
        description={`${enquiry.email}${enquiry.phone ? ` · ${enquiry.phone}` : ''}`}
      />
      <p className="mb-6">
        <Link href="/admin/enquiries" className="text-sm text-[var(--color-gold-dark)]">
          ← Back to enquiries
        </Link>
      </p>

      <div className="mb-8 grid gap-6 lg:grid-cols-2">
        <div className="rounded-lg border border-[var(--admin-border)] bg-white p-6 space-y-3 text-sm">
          <div className="flex items-center justify-between">
            <span className="text-[var(--admin-muted)]">Status</span>
            <StatusBadge status={enquiry.status} />
          </div>
          <div>
            <span className="text-[var(--admin-muted)]">Destination</span>
            <p className="font-medium">{enquiry.destination || '—'}</p>
          </div>
          <div>
            <span className="text-[var(--admin-muted)]">Travel date</span>
            <p className="font-medium">{enquiry.travelDate || '—'}</p>
          </div>
          <div>
            <span className="text-[var(--admin-muted)]">Party</span>
            <p className="font-medium">
              {enquiry.adults} adults
              {enquiry.children ? `, ${enquiry.children} children` : ''}
            </p>
          </div>
          <div>
            <span className="text-[var(--admin-muted)]">Budget</span>
            <p className="font-medium">{enquiry.budget || '—'}</p>
          </div>
          <div>
            <span className="text-[var(--admin-muted)]">Travel style</span>
            <p className="font-medium">{enquiry.travelStyle || '—'}</p>
          </div>
          <div>
            <span className="text-[var(--admin-muted)]">Notes from guest</span>
            <p className="mt-1 whitespace-pre-wrap">{enquiry.notes || '—'}</p>
          </div>
          <div>
            <span className="text-[var(--admin-muted)]">Received</span>
            <p className="font-medium">{new Date(enquiry.createdAt).toLocaleString()}</p>
          </div>
        </div>

        <div className="space-y-6">
          <div className="rounded-lg border border-[var(--admin-border)] bg-white p-6">
            <h2 className="mb-4 text-base font-semibold">Update status</h2>
            <EnquiryStatusForm id={enquiry.id} status={enquiry.status} />
          </div>
          <div className="rounded-lg border border-[var(--admin-border)] bg-white p-6">
            <h2 className="mb-4 text-base font-semibold">Add note</h2>
            <EnquiryNoteForm id={enquiry.id} />
          </div>
        </div>
      </div>

      <h2 className="mb-3 text-lg font-semibold">Internal notes</h2>
      {notes.length === 0 ? (
        <p className="text-sm text-[var(--admin-muted)]">No notes yet.</p>
      ) : (
        <ul className="space-y-3">
          {notes.map((n) => (
            <li
              key={n.id}
              className="rounded-lg border border-[var(--admin-border)] bg-white p-4 text-sm"
            >
              <p className="whitespace-pre-wrap">{n.body}</p>
              <p className="mt-2 text-xs text-[var(--admin-muted)]">
                {new Date(n.created_at).toLocaleString()}
              </p>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
