import Link from 'next/link';
import { AdminPageHeader } from '@/components/admin/page-header';
import { BlogManager } from '@/components/admin/blog-manager';
import { blogQueries } from '@/features/catalog/queries';

export default async function AdminBlogPage() {
  const items = await blogQueries.adminGetAll();

  return (
    <div>
      <AdminPageHeader
        eyebrow="Publish"
        title="Blog"
        description="Inspiration articles with SEO fields — shape the editorial voice of Uncharted Journeys."
        action={{ label: 'New post', href: '/admin/blog/new' }}
        actions={
          <Link
            href="/en/blog"
            target="_blank"
            className="inline-flex h-11 items-center border border-[var(--admin-border)] bg-white px-4 text-[11px] font-semibold tracking-[0.14em] text-[var(--admin-muted)] uppercase transition hover:border-[#c5a059]/50 hover:text-[#a8863f]"
          >
            Preview public
          </Link>
        }
      />
      <BlogManager
        items={items.map((p) => ({
          id: p.id,
          slug: p.slug,
          title: p.title,
          excerpt: p.excerpt,
          category: p.category,
          author: p.author,
          publishedAt: p.publishedAt,
          image: p.image,
          status: (p as { status?: string }).status || 'published',
        }))}
      />
    </div>
  );
}
