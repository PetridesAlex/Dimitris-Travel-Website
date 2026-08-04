/* eslint-disable @typescript-eslint/no-explicit-any */
import { AdminPageHeader, DataTable } from '@/components/admin/page-header';
import { CmsForm, TextInput, Select } from '@/components/admin/cms-form';
import {
  deleteRedirectAction,
  saveRedirectAction,
  saveSeoDefaultsAction,
} from '@/features/cms/actions';
import { createServiceClient } from '@/lib/supabase/server';

export default async function AdminSeoPage() {
  const db = createServiceClient();
  let titleTemplate = '%s | Uncharted Journeys';
  let description = 'Tailor-made luxury journeys around the world.';
  let redirects: { id: string; from_path: string; to_path: string; status_code: number }[] =
    [];

  if (db) {
    const { data: seo } = await (db as any)
      .from('seo_defaults')
      .select('title_template, default_meta_description')
      .eq('locale', 'en')
      .maybeSingle();
    if (seo) {
      titleTemplate = seo.title_template || titleTemplate;
      description = seo.default_meta_description || description;
    }
    const { data: rows } = await (db as any)
      .from('redirects')
      .select('id, from_path, to_path, status_code')
      .order('from_path');
    redirects = rows || [];
  }

  return (
    <div>
      <AdminPageHeader
        title="SEO"
        description="Defaults, redirects, and templates. Per-entity SEO lives on translation forms."
      />
      <div className="mb-8 grid gap-6 lg:grid-cols-2">
        <div className="rounded-lg border border-[var(--admin-border)] bg-white p-6">
          <h2 className="mb-4 text-base font-semibold">SEO defaults</h2>
          <CmsForm action={saveSeoDefaultsAction} submitLabel="Save defaults">
            <TextInput name="titleTemplate" label="Title template" defaultValue={titleTemplate} />
            <TextInput name="description" label="Default meta description" defaultValue={description} />
          </CmsForm>
        </div>
        <div className="rounded-lg border border-[var(--admin-border)] bg-white p-6">
          <h2 className="mb-4 text-base font-semibold">Add redirect</h2>
          <CmsForm action={saveRedirectAction} submitLabel="Add redirect">
            <TextInput name="from" label="From path" placeholder="/old-path" required />
            <TextInput name="to" label="To path" placeholder="/en/destinations/asia" required />
            <Select
              name="code"
              label="Status code"
              defaultValue="301"
              options={[
                { value: '301', label: '301' },
                { value: '302', label: '302' },
              ]}
            />
          </CmsForm>
        </div>
      </div>

      <h2 className="mb-4 text-lg font-semibold">Redirects</h2>
      {redirects.length === 0 ? (
        <p className="text-sm text-[var(--admin-muted)]">No redirects yet.</p>
      ) : (
        <DataTable
          columns={['From', 'To', 'Code', '']}
          rows={redirects.map((r) => [
            r.from_path,
            r.to_path,
            String(r.status_code),
            <CmsForm
              key={r.id}
              action={deleteRedirectAction}
              submitLabel="Delete"
              className="!space-y-0"
            >
              <input type="hidden" name="id" value={r.id} />
            </CmsForm>,
          ])}
        />
      )}
    </div>
  );
}
