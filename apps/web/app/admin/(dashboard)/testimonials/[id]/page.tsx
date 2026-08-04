import { notFound } from 'next/navigation';
import { TestimonialEditor } from '@/components/admin/testimonial-editor';
import { testimonialQueries } from '@/features/catalog/queries';

export default async function EditTestimonialPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const items = await testimonialQueries.adminGetAll();
  const item = items.find((t) => t.id === id);
  if (!item) notFound();
  return <TestimonialEditor item={item} />;
}
