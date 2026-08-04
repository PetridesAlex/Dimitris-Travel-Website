import { AdminPageHeader } from '@/components/admin/page-header';
import {
  CmsForm,
  Select,
  STATUS_OPTIONS,
  TextArea,
  TextInput,
} from '@/components/admin/cms-form';
import { deleteCollection, saveCollection } from '@/features/cms/actions';
import type { DemoCollection } from '@/data/demo';

export function CollectionEditor({
  item,
}: {
  item?: DemoCollection & { status?: string };
}) {
  return (
    <div className="max-w-2xl">
      <AdminPageHeader
        title={item ? `Edit ${item.name}` : 'New collection'}
        description="Curated grouping with hero image."
      />
      <div className="rounded-lg border border-[var(--admin-border)] bg-white p-6">
        <CmsForm
          action={saveCollection}
          dangerAction={item ? deleteCollection : undefined}
          dangerRedirect="/admin/collections"
          submitLabel={item ? 'Update collection' : 'Create collection'}
        >
          {item ? <input type="hidden" name="id" value={item.id} /> : null}
          <TextInput name="name" label="Name" defaultValue={item?.name} required />
          <TextInput name="slug" label="Slug" defaultValue={item?.slug} />
          <TextInput name="tagline" label="Tagline" defaultValue={item?.tagline} />
          <TextArea name="description" label="Description" defaultValue={item?.description} rows={5} />
          <TextInput name="image" label="Image URL" defaultValue={item?.image} />
          <Select name="status" label="Status" defaultValue={item?.status || 'draft'} options={STATUS_OPTIONS} />
        </CmsForm>
      </div>
    </div>
  );
}
