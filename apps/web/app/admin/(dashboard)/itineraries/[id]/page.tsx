import { notFound } from 'next/navigation';
import { ItineraryEditor } from '@/components/admin/itinerary-editor';
import { itineraryQueries } from '@/features/catalog/queries';

export default async function EditItineraryPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const items = await itineraryQueries.adminGetAll();
  const item = items.find((i) => i.id === id);
  if (!item) notFound();
  return <ItineraryEditor item={item} />;
}
