import { AdminPageHeader } from '@/components/admin/page-header';
import {
  Checkbox,
  CmsForm,
  Select,
  STATUS_OPTIONS,
  TextArea,
  TextInput,
} from '@/components/admin/cms-form';
import { deleteDestination, saveDestination } from '@/features/cms/actions';
import { destinationQueries } from '@/features/catalog/queries';
import type { DemoDestination } from '@/data/demo';

const TYPE_OPTIONS = [
  { value: 'continent', label: 'Continent' },
  { value: 'country', label: 'Country' },
  { value: 'city', label: 'City' },
];

export async function DestinationEditor({
  item,
}: {
  item?: DemoDestination & { status?: string };
}) {
  const all = await destinationQueries.getAll();
  const parents = all.filter((d) => d.id !== item?.id);

  return (
    <div className="max-w-2xl">
      <AdminPageHeader
        title={item ? `Edit ${item.name}` : 'New destination'}
        description="Hierarchy, slug path, and English translation fields."
      />
      <div className="rounded-lg border border-[var(--admin-border)] bg-white p-6">
        <CmsForm
          action={saveDestination}
          dangerAction={item ? deleteDestination : undefined}
          dangerRedirect="/admin/destinations"
          submitLabel={item ? 'Update destination' : 'Create destination'}
        >
          {item ? <input type="hidden" name="id" value={item.id} /> : null}
          <TextInput name="name" label="Name" defaultValue={item?.name} required />
          <div className="grid gap-4 sm:grid-cols-2">
            <Select name="type" label="Type" defaultValue={item?.type || 'country'} options={TYPE_OPTIONS} />
            <Select
              name="parentId"
              label="Parent"
              defaultValue={item?.parentId || ''}
              options={[
                { value: '', label: '— None —' },
                ...parents.map((p) => ({
                  value: p.id,
                  label: `${p.name} (${p.type})`,
                })),
              ]}
            />
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            <TextInput name="slug" label="Slug" defaultValue={item?.slug} hint="URL segment" />
            <TextInput
              name="slugPath"
              label="Slug path"
              defaultValue={item?.slugPath}
              hint="e.g. asia/japan/tokyo"
            />
          </div>
          <TextInput name="tagline" label="Tagline" defaultValue={item?.tagline} />
          <TextArea name="overview" label="Overview" defaultValue={item?.overview} rows={5} />
          <TextInput name="image" label="Image URL" defaultValue={item?.image} />
          <TextArea
            name="highlights"
            label="Highlights"
            defaultValue={item?.highlights?.join('\n')}
            hint="One per line or comma-separated"
          />
          <div className="grid gap-4 sm:grid-cols-2">
            <TextInput name="bestTimeToVisit" label="Best time to visit" defaultValue={item?.bestTimeToVisit} />
            <TextInput name="currency" label="Currency" defaultValue={item?.currency} />
            <TextInput name="languages" label="Languages" defaultValue={item?.languages} />
            <TextInput name="timezone" label="Timezone" defaultValue={item?.timezone} />
          </div>
          <TextArea name="visaInfo" label="Visa info" defaultValue={item?.visaInfo} />
          <TextArea name="weather" label="Weather" defaultValue={item?.weather} />
          <Select name="status" label="Status" defaultValue={item?.status || 'draft'} options={STATUS_OPTIONS} />
          <Checkbox name="featured" label="Featured" defaultChecked={item?.featured} />
        </CmsForm>
      </div>
    </div>
  );
}
