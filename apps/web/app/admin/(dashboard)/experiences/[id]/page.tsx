import { notFound } from 'next/navigation';
import { ExperienceEditor } from '@/components/admin/experience-editor';
import { experienceQueries } from '@/features/catalog/queries';

export default async function EditExperiencePage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const items = await experienceQueries.getAll();
  const item = items.find((e) => e.id === id);
  if (!item) notFound();
  return <ExperienceEditor item={item} />;
}
