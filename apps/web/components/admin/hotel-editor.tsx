import { AdminPageHeader } from '@/components/admin/page-header';
import {
  CmsForm,
  Select,
  STATUS_OPTIONS,
  TextArea,
  TextInput,
} from '@/components/admin/cms-form';
import { deleteHotel, saveHotel } from '@/features/cms/actions';
import { destinationQueries } from '@/features/catalog/queries';
import type { DemoHotel } from '@/data/demo';

export async function HotelEditor({
  item,
}: {
  item?: DemoHotel & { status?: string };
}) {
  const destinations = await destinationQueries.getAll();

  return (
    <div className="max-w-2xl">
      <AdminPageHeader
        title={item ? `Edit ${item.name}` : 'New hotel'}
        description="Luxury stay linked to a destination."
      />
      <div className="rounded-lg border border-[var(--admin-border)] bg-white p-6">
        <CmsForm
          action={saveHotel}
          dangerAction={item ? deleteHotel : undefined}
          dangerRedirect="/admin/hotels"
          submitLabel={item ? 'Update hotel' : 'Create hotel'}
        >
          {item ? <input type="hidden" name="id" value={item.id} /> : null}
          <TextInput name="name" label="Name" defaultValue={item?.name} required />
          <TextInput name="slug" label="Slug" defaultValue={item?.slug} />
          <TextInput name="locationLabel" label="Location label" defaultValue={item?.locationLabel} />
          <TextArea name="description" label="Description" defaultValue={item?.description} rows={5} />
          <TextInput name="image" label="Image URL" defaultValue={item?.image} />
          <div className="grid gap-4 sm:grid-cols-2">
            <TextInput
              name="starRating"
              label="Star rating"
              type="number"
              defaultValue={item?.starRating ?? 5}
            />
            <Select
              name="destinationId"
              label="Destination"
              defaultValue={item?.destinationId || ''}
              options={[
                { value: '', label: '— None —' },
                ...destinations.map((d) => ({ value: d.id, label: d.name })),
              ]}
            />
          </div>
          <TextArea
            name="amenities"
            label="Amenities"
            defaultValue={item?.amenities?.join('\n')}
            hint="One per line"
          />
          <Select name="status" label="Status" defaultValue={item?.status || 'draft'} options={STATUS_OPTIONS} />
        </CmsForm>
      </div>
    </div>
  );
}
