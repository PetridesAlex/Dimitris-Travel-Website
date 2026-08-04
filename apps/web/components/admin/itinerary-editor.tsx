import { AdminPageHeader } from '@/components/admin/page-header';
import {
  CmsForm,
  Select,
  STATUS_OPTIONS,
  TextArea,
  TextInput,
} from '@/components/admin/cms-form';
import { deleteItinerary, saveItinerary } from '@/features/cms/actions';
import type { DemoItinerary } from '@/data/demo';

export function ItineraryEditor({
  item,
}: {
  item?: DemoItinerary & { status?: string };
}) {
  return (
    <div className="max-w-2xl">
      <AdminPageHeader
        title={item ? `Edit ${item.title}` : 'New itinerary'}
        description="Core journey fields. Complex places/glanceStops/extensions as JSON."
      />
      <div className="rounded-lg border border-[var(--admin-border)] bg-white p-6">
        <CmsForm
          action={saveItinerary}
          dangerAction={item ? deleteItinerary : undefined}
          dangerRedirect="/admin/itineraries"
          createRedirect="/admin/itineraries"
          submitLabel={item ? 'Update itinerary' : 'Create itinerary'}
        >
          {item ? <input type="hidden" name="id" value={item.id} /> : null}
          <TextInput name="title" label="Title" defaultValue={item?.title} required />
          <TextInput name="slug" label="Slug" defaultValue={item?.slug} />
          <TextArea name="summary" label="Summary" defaultValue={item?.summary} rows={3} />
          <TextInput name="image" label="Image URL" defaultValue={item?.image} />
          <div className="grid gap-4 sm:grid-cols-3">
            <TextInput
              name="durationDays"
              label="Duration (days)"
              type="number"
              defaultValue={item?.durationDays ?? 7}
            />
            <TextInput
              name="priceFrom"
              label="Price from"
              type="number"
              defaultValue={item?.priceFrom ?? 0}
            />
            <TextInput name="currency" label="Currency" defaultValue={item?.currency || 'EUR'} />
          </div>
          <TextInput name="citiesLabel" label="Cities label" defaultValue={item?.citiesLabel} />
          <TextInput name="countryName" label="Country name" defaultValue={item?.countryName} />
          <TextInput name="placesLabel" label="Places label" defaultValue={item?.placesLabel || 'Places'} />
          <TextArea
            name="included"
            label="Included"
            defaultValue={Array.isArray(item?.included) ? item.included.join('\n') : ''}
            hint="One per line"
          />
          <TextArea
            name="excluded"
            label="Excluded"
            defaultValue={item?.excluded?.join('\n')}
            hint="One per line"
          />
          <TextArea
            name="flights"
            label="Flights"
            defaultValue={item?.flights?.join('\n')}
            hint="One note per line"
          />
          <TextArea
            name="departureDates"
            label="Departure dates"
            defaultValue={item?.departureDates?.join('\n')}
            hint="One window or date note per line"
          />
          <TextArea
            name="terms"
            label="Terms & conditions"
            defaultValue={item?.terms?.join('\n')}
            hint="One bullet per line"
          />
          <TextArea
            name="days"
            label="Program days (JSON)"
            defaultValue={item?.days?.length ? JSON.stringify(item.days, null, 2) : ''}
            rows={6}
            hint='[{ "day": 1, "title": "...", "body": "..." }]'
          />
          <TextArea
            name="places"
            label="Places (JSON)"
            defaultValue={item?.places?.length ? JSON.stringify(item.places, null, 2) : ''}
            rows={4}
            hint="Optional JSON array"
          />
          <TextArea
            name="glanceStops"
            label="Glance stops (JSON)"
            defaultValue={
              item?.glanceStops?.length ? JSON.stringify(item.glanceStops, null, 2) : ''
            }
            rows={3}
          />
          <TextArea
            name="extensions"
            label="Extensions (JSON)"
            defaultValue={
              item?.extensions?.length ? JSON.stringify(item.extensions, null, 2) : ''
            }
            rows={3}
          />
          <Select name="status" label="Status" defaultValue={item?.status || 'draft'} options={STATUS_OPTIONS} />
        </CmsForm>
      </div>
    </div>
  );
}
