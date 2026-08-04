import { notFound } from 'next/navigation';
import { HotelEditor } from '@/components/admin/hotel-editor';
import { hotelQueries } from '@/features/catalog/queries';

export default async function EditHotelPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const items = await hotelQueries.adminGetAll();
  const item = items.find((h) => h.id === id);
  if (!item) notFound();
  return <HotelEditor item={item} />;
}
