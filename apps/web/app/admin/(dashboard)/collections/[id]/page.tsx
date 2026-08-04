import { notFound } from 'next/navigation';
import { CollectionEditor } from '@/components/admin/collection-editor';
import { collectionQueries } from '@/features/catalog/queries';

export default async function EditCollectionPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const items = await collectionQueries.getAll();
  const item = items.find((c) => c.id === id);
  if (!item) notFound();
  return <CollectionEditor item={item} />;
}
