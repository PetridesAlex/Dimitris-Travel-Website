import { notFound } from 'next/navigation';
import { BlogEditor } from '@/components/admin/blog-editor';
import { blogQueries } from '@/features/catalog/queries';

export default async function EditBlogPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const items = await blogQueries.getAll();
  const item = items.find((p) => p.id === id);
  if (!item) notFound();
  return <BlogEditor item={item} />;
}
