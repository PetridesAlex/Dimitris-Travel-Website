import { AdminPageHeader } from '@/components/admin/page-header';
import {
  CmsForm,
  Select,
  STATUS_OPTIONS,
  TextArea,
  TextInput,
} from '@/components/admin/cms-form';
import { deleteExperience, saveExperience } from '@/features/cms/actions';
import type { DemoExperience } from '@/data/demo';

const CATEGORY_OPTIONS = [
  'safari',
  'luxury_cruises',
  'private_villas',
  'private_jet',
  'luxury_train',
  'honeymoon',
  'adventure',
  'wellness',
  'family',
  'golf',
  'food_wine',
  'culture',
  'photography',
  'diving',
  'yachting',
  'luxury_escapes',
].map((c) => ({ value: c, label: c.replace(/_/g, ' ') }));

export function ExperienceEditor({
  item,
}: {
  item?: DemoExperience & { status?: string };
}) {
  return (
    <div className="max-w-2xl">
      <AdminPageHeader
        title={item ? `Edit ${item.name}` : 'New experience'}
        description="Category, copy, and hero image."
      />
      <div className="rounded-lg border border-[var(--admin-border)] bg-white p-6">
        <CmsForm
          action={saveExperience}
          dangerAction={item ? deleteExperience : undefined}
          dangerRedirect="/admin/experiences"
          submitLabel={item ? 'Update experience' : 'Create experience'}
        >
          {item ? <input type="hidden" name="id" value={item.id} /> : null}
          <TextInput name="name" label="Name" defaultValue={item?.name} required />
          <TextInput name="slug" label="Slug" defaultValue={item?.slug} />
          <Select
            name="category"
            label="Category"
            defaultValue={item?.category || 'culture'}
            options={CATEGORY_OPTIONS}
          />
          <TextInput name="tagline" label="Tagline" defaultValue={item?.tagline} />
          <TextArea name="description" label="Description" defaultValue={item?.description} rows={5} />
          <TextInput name="image" label="Image URL" defaultValue={item?.image} />
          <Select name="status" label="Status" defaultValue={item?.status || 'draft'} options={STATUS_OPTIONS} />
        </CmsForm>
      </div>
    </div>
  );
}
