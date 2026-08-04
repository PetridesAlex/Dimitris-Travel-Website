import { AdminPageHeader } from '@/components/admin/page-header';
import {
  CmsForm,
  Select,
  STATUS_OPTIONS,
  TextArea,
  TextInput,
} from '@/components/admin/cms-form';
import { deleteTestimonial, saveTestimonial } from '@/features/cms/actions';
import type { DemoTestimonial } from '@/data/demo';

export function TestimonialEditor({
  item,
}: {
  item?: DemoTestimonial & { status?: string };
}) {
  return (
    <div className="max-w-2xl">
      <AdminPageHeader
        title={item ? `Edit ${item.authorName}` : 'New testimonial'}
        description="Guest quote and trip label."
      />
      <div className="rounded-lg border border-[var(--admin-border)] bg-white p-6">
        <CmsForm
          action={saveTestimonial}
          dangerAction={item ? deleteTestimonial : undefined}
          dangerRedirect="/admin/testimonials"
          submitLabel={item ? 'Update testimonial' : 'Create testimonial'}
        >
          {item ? <input type="hidden" name="id" value={item.id} /> : null}
          <TextInput name="authorName" label="Author name" defaultValue={item?.authorName} required />
          <TextInput name="authorLocation" label="Author location" defaultValue={item?.authorLocation} />
          <TextInput name="tripLabel" label="Trip label" defaultValue={item?.tripLabel} />
          <TextArea name="quote" label="Quote" defaultValue={item?.quote} rows={4} required />
          <TextInput name="rating" label="Rating" type="number" defaultValue={item?.rating ?? 5} />
          <Select
            name="status"
            label="Status"
            defaultValue={item?.status || 'published'}
            options={STATUS_OPTIONS}
          />
        </CmsForm>
      </div>
    </div>
  );
}
