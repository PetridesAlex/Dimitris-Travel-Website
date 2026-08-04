/* eslint-disable @typescript-eslint/no-explicit-any */
import Image from 'next/image';
import { AdminPageHeader } from '@/components/admin/page-header';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { CmsForm, TextInput } from '@/components/admin/cms-form';
import { uploadMediaAsset } from '@/features/cms/actions';
import { mediaQueries } from '@/features/catalog/queries';

export default async function AdminMediaPage() {
  const [folders, assets] = await Promise.all([
    mediaQueries.getFolders(),
    mediaQueries.getAssets(),
  ]);

  return (
    <div>
      <AdminPageHeader
        title="Media Library"
        description="Upload a file to Supabase Storage or register a remote URL."
      />

      <div className="mb-8 max-w-xl rounded-lg border border-[var(--admin-border)] bg-white p-6">
        <h2 className="mb-4 text-base font-semibold">Add media</h2>
        <CmsForm action={uploadMediaAsset} submitLabel="Upload / save">
          <TextInput name="title" label="Title" />
          <TextInput name="alt" label="Alt text" />
          <TextInput name="url" label="Remote URL" hint="Optional if uploading a file" />
          <div className="space-y-2">
            <label htmlFor="file" className="text-sm font-medium">
              File upload
            </label>
            <input
              id="file"
              name="file"
              type="file"
              accept="image/*"
              className="block w-full text-sm text-[var(--admin-muted)] file:mr-3 file:rounded-md file:border-0 file:bg-[var(--color-gold)] file:px-3 file:py-2 file:text-sm file:text-[var(--color-ink)]"
            />
          </div>
        </CmsForm>
      </div>

      <div className="mb-6 flex flex-wrap gap-2">
        {folders.map((f: any) => (
          <Badge key={f.id}>{f.name}</Badge>
        ))}
      </div>
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {assets.map((a: any) => (
          <Card key={a.id} className="overflow-hidden">
            <div className="relative aspect-[4/3]">
              <Image src={a.url} alt={a.alt} fill className="object-cover" sizes="300px" />
            </div>
            <CardContent className="space-y-1 p-4">
              <p className="truncate text-sm font-medium">{a.title}</p>
              <p className="truncate text-xs text-[var(--admin-muted)]">{a.alt}</p>
              <p className="text-xs text-[var(--admin-muted)]">{a.mimeType}</p>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
