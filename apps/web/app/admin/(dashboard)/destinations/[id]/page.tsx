import { notFound } from 'next/navigation';
import { DestinationEditor } from '@/components/admin/destination-editor';
import { destinationQueries } from '@/features/catalog/queries';

export default async function EditDestinationPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const items = await destinationQueries.getAll();
  const item = items.find((d) => d.id === id);
  if (!item) notFound();
  return <DestinationEditor item={item} />;
}
