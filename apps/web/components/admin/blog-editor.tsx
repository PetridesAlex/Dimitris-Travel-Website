import { AdminPageHeader } from '@/components/admin/page-header';
import {
  CmsForm,
  Select,
  STATUS_OPTIONS,
  TextArea,
  TextInput,
} from '@/components/admin/cms-form';
import { deleteBlogPost, saveBlogPost } from '@/features/cms/actions';
import type { DemoBlogPost } from '@/data/demo';

export function BlogEditor({
  item,
}: {
  item?: DemoBlogPost & { status?: string };
}) {
  return (
    <div className="max-w-2xl">
      <AdminPageHeader
        title={item ? `Edit ${item.title}` : 'New blog post'}
        description="Title, excerpt, body (paragraphs separated by blank lines)."
      />
      <div className="rounded-lg border border-[var(--admin-border)] bg-white p-6">
        <CmsForm
          action={saveBlogPost}
          dangerAction={item ? deleteBlogPost : undefined}
          dangerRedirect="/admin/blog"
          submitLabel={item ? 'Update post' : 'Create post'}
        >
          {item ? <input type="hidden" name="id" value={item.id} /> : null}
          <TextInput name="title" label="Title" defaultValue={item?.title} required />
          <TextInput name="slug" label="Slug" defaultValue={item?.slug} />
          <TextArea name="excerpt" label="Excerpt" defaultValue={item?.excerpt} rows={2} />
          <TextArea
            name="body"
            label="Body"
            defaultValue={item?.body}
            rows={10}
            hint="Separate paragraphs with a blank line"
          />
          <TextInput name="image" label="Cover image URL" defaultValue={item?.image} />
          <TextInput name="publishedAt" label="Published at" defaultValue={item?.publishedAt} hint="ISO date" />
          <Select name="status" label="Status" defaultValue={item?.status || 'draft'} options={STATUS_OPTIONS} />
        </CmsForm>
      </div>
    </div>
  );
}
