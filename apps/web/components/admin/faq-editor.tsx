import { AdminPageHeader } from '@/components/admin/page-header';
import {
  CmsForm,
  Select,
  STATUS_OPTIONS,
  TextArea,
  TextInput,
} from '@/components/admin/cms-form';
import { deleteFaq, saveFaq } from '@/features/cms/actions';

export function FaqEditor({
  item,
}: {
  item?: { id: string; question: string; answer: string; status?: string };
}) {
  return (
    <div className="max-w-2xl">
      <AdminPageHeader
        title={item ? 'Edit FAQ' : 'New FAQ'}
        description="Global frequently asked question."
      />
      <div className="rounded-lg border border-[var(--admin-border)] bg-white p-6">
        <CmsForm
          action={saveFaq}
          dangerAction={item ? deleteFaq : undefined}
          dangerRedirect="/admin/faqs"
          submitLabel={item ? 'Update FAQ' : 'Create FAQ'}
        >
          {item ? <input type="hidden" name="id" value={item.id} /> : null}
          <TextInput name="question" label="Question" defaultValue={item?.question} required />
          <TextArea name="answer" label="Answer" defaultValue={item?.answer} rows={5} required />
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
