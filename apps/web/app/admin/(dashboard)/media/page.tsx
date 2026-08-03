import Image from 'next/image';
import { AdminPageHeader } from '@/components/admin/page-header';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { mediaQueries } from '@/features/catalog/queries';

export default function AdminMediaPage() {
  const folders = mediaQueries.getFolders();
  const assets = mediaQueries.getAssets();
  return (
    <div>
      <AdminPageHeader
        title="Media Library"
        description="Folders, upload, replace, search, and alt text — powered by Supabase Storage in production."
        action={{ label: 'Upload', href: '#' }}
      />
      <div className="mb-6 flex flex-wrap gap-2">
        {folders.map((f) => (
          <Badge key={f.id}>{f.name}</Badge>
        ))}
      </div>
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {assets.map((a) => (
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
      <div className="mt-6">
        <Button variant="adminOutline">Create folder</Button>
      </div>
    </div>
  );
}
