'use client';

import { CmsForm, Select, TextArea } from '@/components/admin/cms-form';
import {
  addEnquiryNoteAction,
  updateEnquiryStatusAction,
} from '@/features/cms/actions';

const STATUS = [
  { value: 'new', label: 'New' },
  { value: 'contacted', label: 'Contacted' },
  { value: 'qualified', label: 'Qualified' },
  { value: 'won', label: 'Won' },
  { value: 'lost', label: 'Lost' },
];

export function EnquiryStatusForm({
  id,
  status,
}: {
  id: string;
  status: string;
}) {
  return (
    <CmsForm action={updateEnquiryStatusAction} submitLabel="Update status">
      <input type="hidden" name="id" value={id} />
      <Select name="status" label="Status" defaultValue={status} options={STATUS} />
    </CmsForm>
  );
}

export function EnquiryNoteForm({ id }: { id: string }) {
  return (
    <CmsForm action={addEnquiryNoteAction} submitLabel="Add note">
      <input type="hidden" name="id" value={id} />
      <TextArea name="body" label="Internal note" rows={3} required />
    </CmsForm>
  );
}
