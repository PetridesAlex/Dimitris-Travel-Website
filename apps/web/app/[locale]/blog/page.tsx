import { SectionHeading, BlogCard } from '@/components/marketing/sections';
import { LazySection } from '@/components/motion/fade-in';
import { blogQueries } from '@/features/catalog/queries';
export const metadata = { title: 'Inspiration' };
export default async function BlogPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  const posts = await blogQueries.getAll();
  return (
    <div className="bg-[var(--color-ink)] pt-28">
      <LazySection className="mx-auto max-w-7xl px-6 py-16 lg:px-8">
        <SectionHeading eyebrow="Inspiration" title="Stories from the road" light align="left" />
        <div className="grid gap-8 md:grid-cols-3">
          {posts.map((p) => (
            <BlogCard key={p.id} href={`/${locale}/blog/${p.slug}`} title={p.title} excerpt={p.excerpt} image={p.image} category={p.category} date={p.publishedAt} />
          ))}
        </div>
      </LazySection>
    </div>
  );
}
