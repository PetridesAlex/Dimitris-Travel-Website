/* eslint-disable @typescript-eslint/no-explicit-any */
import { notFound } from 'next/navigation';
import { FaqEditor } from '@/components/admin/faq-editor';
import { faqQueries } from '@/features/catalog/queries';

export default async function EditFaqPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const items = await faqQueries.adminGetAll();
  const item = items.find((f: any) => f.id === id);
  if (!item) notFound();
  return <FaqEditor item={item} />;
}
