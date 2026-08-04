import { notFound } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import { ArrowLeft, ArrowRight } from 'lucide-react';
import { FadeIn, RevealImage, LazySection } from '@/components/motion/fade-in';
import { BlogCard, CtaBand } from '@/components/marketing/sections';
import { blogQueries } from '@/features/catalog/queries';
import {
  estimateReadingMinutes,
  formatBlogDate,
  resolveBlogBody,
  splitBlogParagraphs,
} from '@/data/blog-articles';

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

  const body = resolveBlogBody(post.slug, post.body);
  const paragraphs = splitBlogParagraphs(body);
  const beforeQuote = paragraphs.slice(0, 2);
  const afterQuote = paragraphs.slice(2);
  const pullQuote = post.excerpt;
  const readingMinutes = estimateReadingMinutes(body);
  const publishedLabel = formatBlogDate(post.publishedAt);

  const related = (await blogQueries.getAll())
    .filter((p) => p.slug !== post.slug)
    .slice(0, 2);

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: post.title,
    datePublished: post.publishedAt,
    author: { '@type': 'Person', name: post.author },
    image: post.image,
    description: post.excerpt,
  };

  return (
    <article className="bg-[var(--color-ink)]">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      {/* Full-bleed editorial hero */}
      <header className="relative isolate min-h-[78vh] overflow-hidden pt-28">
        <Image
          src={post.image}
          alt={post.title}
          fill
          priority
          className="object-cover"
          sizes="100vw"
        />
        <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(12,12,12,0.55)_0%,rgba(12,12,12,0.35)_40%,rgba(12,12,12,0.92)_100%)]" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_20%,rgba(12,12,12,0.45)_100%)]" />

        <div className="relative z-10 mx-auto flex min-h-[calc(78vh-7rem)] max-w-5xl flex-col justify-end px-6 pb-16 pt-20 lg:px-8 lg:pb-20">
          <FadeIn direction="up" blur>
            <Link
              href={`/${locale}/blog`}
              className="inline-flex items-center gap-2 text-xs tracking-[0.22em] text-white/70 uppercase transition hover:text-[var(--color-gold)]"
            >
              <ArrowLeft className="h-3.5 w-3.5" />
              Journal
            </Link>
          </FadeIn>

          <FadeIn direction="up" blur delay={0.08} className="mt-8 max-w-3xl">
            <p className="text-xs tracking-[0.28em] text-[var(--color-gold)] uppercase">
              {post.category}
            </p>
            <h1 className="mt-5 font-[family-name:var(--font-display)] text-[2.6rem] leading-[1.08] text-white sm:text-5xl lg:text-6xl">
              {post.title}
            </h1>
            <p className="mt-6 max-w-2xl text-lg leading-relaxed text-white/75">
              {post.excerpt}
            </p>
          </FadeIn>

          <FadeIn
            direction="up"
            blur
            delay={0.16}
            className="mt-10 flex flex-wrap items-center gap-x-6 gap-y-2 border-t border-white/15 pt-6 text-sm text-white/55"
          >
            <span>
              By <span className="text-white/85">{post.author}</span>
            </span>
            <span className="hidden h-3 w-px bg-white/20 sm:block" aria-hidden />
            <time dateTime={post.publishedAt}>{publishedLabel}</time>
            <span className="hidden h-3 w-px bg-white/20 sm:block" aria-hidden />
            <span>{readingMinutes} min read</span>
          </FadeIn>
        </div>
      </header>

      {/* Cream reading surface */}
      <div className="relative bg-[var(--color-cream)]">
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_top,rgba(197,160,89,0.08),transparent_45%)]" />

        <div className="relative mx-auto max-w-3xl px-6 py-16 lg:px-8 lg:py-24">
          <div className="space-y-7">
            {beforeQuote.map((paragraph, index) => (
              <FadeIn key={`pre-${index}`} direction="up" blur delay={0.05 * index}>
                <p
                  className={`text-[1.05rem] leading-[1.85] text-[var(--color-ink)]/75 ${
                    index === 0
                      ? 'first-letter:float-left first-letter:mr-3 first-letter:mt-1 first-letter:font-[family-name:var(--font-display)] first-letter:text-5xl first-letter:leading-none first-letter:text-[var(--color-gold)]'
                      : ''
                  }`}
                >
                  {paragraph}
                </p>
              </FadeIn>
            ))}
          </div>

          {afterQuote.length > 0 && pullQuote ? (
            <FadeIn direction="up" blur delay={0.12} className="my-14">
              <blockquote className="border-l-2 border-[var(--color-gold)] pl-6 sm:pl-8">
                <p className="font-[family-name:var(--font-display)] text-2xl leading-snug text-[var(--color-ink)] sm:text-3xl">
                  {pullQuote}
                </p>
              </blockquote>
            </FadeIn>
          ) : null}

          <div className="space-y-7">
            {afterQuote.map((paragraph, index) => (
              <FadeIn key={`post-${index}`} direction="up" blur delay={0.04 * index}>
                <p className="text-[1.05rem] leading-[1.85] text-[var(--color-ink)]/75">
                  {paragraph}
                </p>
              </FadeIn>
            ))}
          </div>

          {/* Secondary image break */}
          <FadeIn direction="up" blur className="mt-16">
            <RevealImage className="relative aspect-[16/10] overflow-hidden">
              <Image
                src={post.image}
                alt=""
                fill
                loading="lazy"
                className="object-cover"
                sizes="(max-width: 768px) 100vw, 768px"
              />
            </RevealImage>
            <p className="mt-4 text-center text-xs tracking-[0.2em] text-[var(--color-ink)]/40 uppercase">
              {post.category} · Uncharted Journeys
            </p>
          </FadeIn>

          <FadeIn direction="up" blur className="mt-16 border-t border-[var(--color-ink)]/10 pt-10">
            <div className="flex flex-col gap-6 sm:flex-row sm:items-end sm:justify-between">
              <div>
                <p className="text-xs tracking-[0.22em] text-[var(--color-gold)] uppercase">
                  Written by
                </p>
                <p className="mt-2 font-[family-name:var(--font-display)] text-2xl text-[var(--color-ink)]">
                  {post.author}
                </p>
                <p className="mt-1 text-sm text-[var(--color-ink)]/55">{publishedLabel}</p>
              </div>
              <Link
                href={`/${locale}/plan-your-journey`}
                className="inline-flex items-center gap-2 text-sm tracking-wide text-[var(--color-ink)] transition hover:text-[var(--color-gold)]"
              >
                Plan a journey inspired by this story
                <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
          </FadeIn>
        </div>
      </div>

      {related.length > 0 ? (
        <LazySection className="mx-auto max-w-7xl px-6 py-20 lg:px-8 lg:py-24">
          <div className="mb-10 flex items-end justify-between gap-6">
            <div>
              <p className="text-xs tracking-[0.28em] text-[var(--color-gold)] uppercase">
                Continue reading
              </p>
              <h2 className="mt-3 font-[family-name:var(--font-display)] text-3xl text-white sm:text-4xl">
                More from the journal
              </h2>
            </div>
            <Link
              href={`/${locale}/blog`}
              className="hidden text-sm text-white/55 transition hover:text-[var(--color-gold)] sm:inline-flex sm:items-center sm:gap-2"
            >
              View all
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
          <div className="grid gap-10 md:grid-cols-2">
            {related.map((p) => (
              <BlogCard
                key={p.id}
                href={`/${locale}/blog/${p.slug}`}
                title={p.title}
                excerpt={p.excerpt}
                image={p.image}
                category={p.category}
                date={formatBlogDate(p.publishedAt)}
              />
            ))}
          </div>
        </LazySection>
      ) : null}

      <CtaBand title="Ready to travel differently?" locale={locale} />
    </article>
  );
}
