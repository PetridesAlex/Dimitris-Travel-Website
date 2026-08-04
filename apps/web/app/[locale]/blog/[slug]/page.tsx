import { notFound } from 'next/navigation';
import Image from 'next/image';
import { Breadcrumbs } from '@/components/marketing/sections';
import { FadeIn, RevealImage } from '@/components/motion/fade-in';
import { blogQueries } from '@/features/catalog/queries';

type Props = { params: Promise<{ locale: string; slug: string }> };

export async function generateStaticParams() {
  const all = await blogQueries.getAll();
  return all.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({ params }: Props) {
  const { slug } = await params;
  const post = await blogQueries.getBySlug(slug);
  if (!post) return {};
  return { title: post.title, description: post.excerpt };
}

export default async function BlogPostPage({ params }: Props) {
  const { locale, slug } = await params;
  const post = await blogQueries.getBySlug(slug);
  if (!post) notFound();

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: post.title,
    datePublished: post.publishedAt,
    author: { '@type': 'Person', name: post.author },
    image: post.image,
  };

  return (
    <article className="bg-[var(--color-ink)] pt-28">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <Breadcrumbs
        items={[
          { label: 'Home', href: `/${locale}` },
          { label: 'Blog', href: `/${locale}/blog` },
          { label: post.title },
        ]}
      />
      <div className="mx-auto max-w-3xl px-6 py-16 lg:px-8">
        <FadeIn direction="up" blur delay={0.05}>
          <p className="text-xs tracking-widest text-[var(--color-gold)] uppercase">
            {post.category} · {post.publishedAt}
          </p>
          <h1 className="mt-4 font-[family-name:var(--font-display)] text-5xl text-white">
            {post.title}
          </h1>
          <p className="mt-4 text-white/60">By {post.author}</p>
        </FadeIn>
        <RevealImage className="relative mt-10 aspect-[16/9] rounded-xl">
          <Image
            src={post.image}
            alt={post.title}
            fill
            loading="lazy"
            className="object-cover"
            sizes="800px"
          />
        </RevealImage>
        <FadeIn className="prose prose-invert mt-10 max-w-none" delay={0.15} blur>
          <p className="text-lg leading-relaxed text-white/75">{post.excerpt}</p>
          <p className="mt-6 leading-relaxed text-white/70">{post.body}</p>
        </FadeIn>
      </div>
    </article>
  );
}
