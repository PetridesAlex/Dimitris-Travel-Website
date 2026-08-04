'use client';

import { useEffect, useMemo, useState } from 'react';
import { motion, useReducedMotion } from 'framer-motion';
import {
  Compass,
  KeyRound,
  Sparkles,
  ShieldCheck,
  Star,
  ThumbsUp,
  BadgeCheck,
  ChevronLeft,
  ChevronRight,
} from 'lucide-react';
import { SectionHeading } from '@/components/marketing/sections';
import { FadeIn, Stagger } from '@/components/motion/fade-in';
import { cn } from '@/lib/utils';

const pillars = [
  {
    icon: Compass,
    title: 'Bespoke by design',
    description:
      'Every itinerary begins with you — pace, passions, and the places that matter most.',
  },
  {
    icon: KeyRound,
    title: 'Insider access',
    description:
      'Private openings, after-hours museums, and tables that are otherwise impossible.',
  },
  {
    icon: Sparkles,
    title: 'Cinematic flow',
    description:
      'Days sequenced like a film — arrival, tension, release — never a checklist.',
  },
  {
    icon: ShieldCheck,
    title: 'Quiet concierge',
    description:
      'Calm, 24/7 support from the first conversation through the journey home.',
  },
] as const;

type Testimonial = {
  id: string;
  authorName: string;
  authorLocation: string;
  quote: string;
  tripLabel: string;
  rating: number;
};

const REVIEW_META: Record<
  string,
  { when: string; helpful: number; avatar: string }
> = {
  t1: { when: '2 months ago', helpful: 24, avatar: 'CM' },
  t2: { when: '5 weeks ago', helpful: 18, avatar: 'AH' },
  t3: { when: '3 months ago', helpful: 31, avatar: 'PF' },
  t4: { when: '1 month ago', helpful: 12, avatar: 'JR' },
  t5: { when: '4 weeks ago', helpful: 21, avatar: 'SL' },
  t6: { when: '6 days ago', helpful: 9, avatar: 'EV' },
};

const AVATAR_TONES = [
  'from-[#c5a059] to-[#a8843f]',
  'from-[#8b7355] to-[#c5a059]',
  'from-[#6b5a3e] to-[#d4b56a]',
  'from-[#9a7b4f] to-[#c5a059]',
  'from-[#7a6540] to-[#b8954a]',
  'from-[#a89060] to-[#c5a059]',
];

function PillarCard({
  icon: Icon,
  title,
  description,
  index,
}: {
  icon: (typeof pillars)[number]['icon'];
  title: string;
  description: string;
  index: number;
}) {
  const reduce = useReducedMotion();

  return (
    <div className="group relative h-full text-center lg:text-left">
      <div className="relative mx-auto mb-6 flex h-16 w-16 items-center justify-center lg:mx-0">
        <motion.span
          aria-hidden
          className="absolute inset-0 rounded-full border border-[#c5a059]/25"
          initial={reduce ? false : { scale: 0.85, opacity: 0 }}
          whileInView={{ scale: 1, opacity: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.1 * index, duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
        />
        <motion.span
          aria-hidden
          className="absolute -inset-1 rounded-full border border-[#c5a059]/10"
          animate={
            reduce
              ? undefined
              : {
                  scale: [1, 1.08, 1],
                  opacity: [0.35, 0.7, 0.35],
                }
          }
          transition={{ duration: 4.5, repeat: Infinity, ease: 'easeInOut', delay: index * 0.4 }}
        />
        <motion.div
          className="relative flex h-12 w-12 items-center justify-center rounded-full bg-[#c5a059]/10 text-[#c5a059] transition duration-500 group-hover:bg-[#c5a059] group-hover:text-[#0c0c0c]"
          whileHover={reduce ? undefined : { rotate: -6, scale: 1.05 }}
          transition={{ type: 'spring', stiffness: 260, damping: 18 }}
        >
          <Icon className="h-5 w-5" strokeWidth={1.2} />
        </motion.div>
      </div>

      <p className="mb-2 font-[family-name:var(--font-display)] text-[11px] tracking-[0.28em] text-[#c5a059]/70">
        {String(index + 1).padStart(2, '0')}
      </p>
      <h3 className="font-[family-name:var(--font-display)] text-xl text-white md:text-2xl">
        {title}
      </h3>
      <p className="mt-3 text-sm leading-relaxed text-white/55">{description}</p>
    </div>
  );
}

function Stars({ rating, size = 'sm' }: { rating: number; size?: 'sm' | 'md' | 'lg' }) {
  const cls =
    size === 'lg' ? 'h-5 w-5' : size === 'md' ? 'h-4 w-4' : 'h-3.5 w-3.5';
  return (
    <div className="flex gap-0.5" aria-label={`${rating} out of 5 stars`}>
      {Array.from({ length: 5 }).map((_, i) => (
        <Star
          key={i}
          className={cn(
            cls,
            i < rating ? 'fill-[#c5a059] text-[#c5a059]' : 'fill-white/10 text-white/10',
          )}
        />
      ))}
    </div>
  );
}

function RatingSummary({ items }: { items: Testimonial[] }) {
  const reduce = useReducedMotion();
  const average =
    items.reduce((sum, t) => sum + t.rating, 0) / Math.max(items.length, 1);
  const [displayAvg, setDisplayAvg] = useState(0);
  const [displayCount, setDisplayCount] = useState(0);

  useEffect(() => {
    if (reduce) {
      setDisplayAvg(average);
      setDisplayCount(items.length);
      return;
    }
    const start = performance.now();
    const duration = 1100;
    let frame = 0;
    const tick = (now: number) => {
      const t = Math.min(1, (now - start) / duration);
      const eased = 1 - Math.pow(1 - t, 3);
      setDisplayAvg(average * eased);
      setDisplayCount(Math.round(items.length * eased));
      if (t < 1) frame = requestAnimationFrame(tick);
    };
    frame = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frame);
  }, [average, items.length, reduce]);

  const distribution = [5, 4, 3, 2, 1].map((star) => {
    const count = items.filter((t) => t.rating === star).length;
    return { star, count, pct: (count / Math.max(items.length, 1)) * 100 };
  });

  return (
    <div className="flex flex-col gap-8 border border-white/10 bg-white/[0.03] p-6 md:flex-row md:items-center md:gap-12 md:p-8">
      <div className="shrink-0 text-center md:text-left">
        <p className="font-[family-name:var(--font-display)] text-5xl text-white md:text-6xl">
          {displayAvg.toFixed(1)}
        </p>
        <div className="mt-2 flex justify-center md:justify-start">
          <Stars rating={5} size="md" />
        </div>
        <p className="mt-3 text-[11px] tracking-[0.18em] text-white/45 uppercase">
          Based on {displayCount} guest reviews
        </p>
      </div>

      <div className="min-w-0 flex-1 space-y-2">
        {distribution.map((row) => (
          <div key={row.star} className="flex items-center gap-3">
            <span className="w-8 text-right text-[11px] tracking-wide text-white/50">
              {row.star}
            </span>
            <div className="h-1.5 flex-1 overflow-hidden bg-white/10">
              <motion.div
                className="h-full bg-[#c5a059]"
                initial={reduce ? false : { width: 0 }}
                whileInView={{ width: `${row.pct}%` }}
                viewport={{ once: true }}
                transition={{ duration: 0.9, delay: (5 - row.star) * 0.08, ease: [0.22, 1, 0.36, 1] }}
              />
            </div>
            <span className="w-6 text-[11px] text-white/35">{row.count}</span>
          </div>
        ))}
      </div>

      <div className="hidden shrink-0 border-l border-white/10 pl-8 lg:block">
        <p className="text-[10px] tracking-[0.28em] text-[#c5a059] uppercase">Guest score</p>
        <p className="mt-2 font-[family-name:var(--font-display)] text-2xl text-white">
          Exceptional
        </p>
        <p className="mt-1 max-w-[10rem] text-xs leading-relaxed text-white/40">
          Verified travellers across signature journeys
        </p>
      </div>
    </div>
  );
}

function ReviewCard({
  item,
  index,
}: {
  item: Testimonial;
  index: number;
}) {
  const reduce = useReducedMotion();
  const meta = REVIEW_META[item.id] ?? {
    when: 'Recently',
    helpful: 4,
    avatar: item.authorName.slice(0, 2).toUpperCase(),
  };
  const [helpful, setHelpful] = useState(false);
  const [helpfulCount, setHelpfulCount] = useState(meta.helpful);
  const [expanded, setExpanded] = useState(false);
  const long = item.quote.length > 120;
  const body =
    !expanded && long ? `${item.quote.slice(0, 118).trimEnd()}…` : item.quote;

  return (
    <motion.article
      className="flex h-full flex-col border border-white/10 bg-white/[0.035] p-5 transition duration-500 hover:border-[#c5a059]/35 hover:bg-white/[0.055] md:p-6"
      initial={reduce ? false : { opacity: 0, y: 28 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.2 }}
      transition={{ duration: 0.55, delay: index * 0.08, ease: [0.22, 1, 0.36, 1] }}
      whileHover={reduce ? undefined : { y: -4 }}
    >
      <div className="flex items-start gap-3">
        <div
          className={cn(
            'flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-gradient-to-br text-sm font-semibold text-[#0c0c0c]',
            AVATAR_TONES[index % AVATAR_TONES.length],
          )}
        >
          {meta.avatar}
        </div>
        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-center gap-2">
            <p className="truncate text-sm font-semibold text-white">{item.authorName}</p>
            <span className="inline-flex items-center gap-1 text-[10px] tracking-[0.12em] text-[#c5a059]/80 uppercase">
              <BadgeCheck className="h-3 w-3" strokeWidth={2} />
              Verified
            </span>
          </div>
          <p className="mt-0.5 text-xs text-white/40">
            {item.authorLocation}
            <span className="mx-1.5 text-white/20">·</span>
            {meta.when}
          </p>
        </div>
      </div>

      <div className="mt-4 flex items-center gap-3">
        <Stars rating={item.rating} />
        <span className="rounded-sm bg-[#c5a059]/12 px-2 py-0.5 text-[10px] tracking-[0.14em] text-[#c5a059] uppercase">
          {item.tripLabel}
        </span>
      </div>

      <p className="mt-4 flex-1 text-[15px] leading-relaxed text-white/75">{body}</p>

      {long ? (
        <button
          type="button"
          onClick={() => setExpanded((v) => !v)}
          className="mt-2 self-start text-[12px] font-medium tracking-wide text-[#c5a059] hover:underline"
        >
          {expanded ? 'Show less' : 'Read more'}
        </button>
      ) : null}

      <div className="mt-5 flex items-center justify-between border-t border-white/10 pt-4">
        <button
          type="button"
          onClick={() => {
            setHelpful((v) => {
              setHelpfulCount((c) => (v ? c - 1 : c + 1));
              return !v;
            });
          }}
          className={cn(
            'inline-flex items-center gap-2 text-[12px] transition',
            helpful ? 'text-[#c5a059]' : 'text-white/45 hover:text-white',
          )}
        >
          <ThumbsUp
            className={cn('h-3.5 w-3.5', helpful && 'fill-[#c5a059]')}
            strokeWidth={1.75}
          />
          Helpful
          <span className="text-white/30">({helpfulCount})</span>
        </button>
        <p className="text-[10px] tracking-[0.16em] text-white/25 uppercase">Guest review</p>
      </div>
    </motion.article>
  );
}

function ReviewsPanel({ items }: { items: Testimonial[] }) {
  const reduce = useReducedMotion();
  const [page, setPage] = useState(0);
  const perPage = 3;
  const pages = Math.max(1, Math.ceil(items.length / perPage));

  useEffect(() => {
    if (reduce || pages <= 1) return;
    const id = setInterval(() => {
      setPage((p) => (p + 1) % pages);
    }, 6500);
    return () => clearInterval(id);
  }, [pages, reduce]);

  const visible = useMemo(() => {
    const start = page * perPage;
    return items.slice(start, start + perPage);
  }, [items, page]);

  return (
    <div>
      <RatingSummary items={items} />

      <div className="mt-8 flex items-end justify-between gap-4">
        <div>
          <p className="text-[10px] font-semibold tracking-[0.35em] text-[#c5a059] uppercase">
            Recent reviews
          </p>
          <p className="mt-1 text-sm text-white/45">
            Real journeys. Verified guests.
          </p>
        </div>
        <div className="flex gap-2">
          <button
            type="button"
            aria-label="Previous reviews"
            onClick={() => setPage((p) => (p - 1 + pages) % pages)}
            className="flex h-10 w-10 items-center justify-center border border-white/15 text-white transition hover:border-[#c5a059]/60 hover:text-[#c5a059]"
          >
            <ChevronLeft className="h-4 w-4" strokeWidth={1.5} />
          </button>
          <button
            type="button"
            aria-label="Next reviews"
            onClick={() => setPage((p) => (p + 1) % pages)}
            className="flex h-10 w-10 items-center justify-center border border-white/15 text-white transition hover:border-[#c5a059]/60 hover:text-[#c5a059]"
          >
            <ChevronRight className="h-4 w-4" strokeWidth={1.5} />
          </button>
        </div>
      </div>

      <div className="mt-6 grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {visible.map((item, index) => (
          <ReviewCard key={`${item.id}-${page}`} item={item} index={index} />
        ))}
      </div>

      <div className="mt-6 flex justify-center gap-2">
        {Array.from({ length: pages }).map((_, i) => (
          <button
            key={i}
            type="button"
            aria-label={`Reviews page ${i + 1}`}
            onClick={() => setPage(i)}
            className={cn(
              'h-1.5 transition-all duration-500',
              i === page ? 'w-8 bg-[#c5a059]' : 'w-1.5 bg-white/20 hover:bg-white/40',
            )}
          />
        ))}
      </div>
    </div>
  );
}

export function WhyChooseUs({ testimonials }: { testimonials: Testimonial[] }) {
  return (
    <section className="relative overflow-hidden bg-[#161616] px-6 py-24 lg:px-8 lg:py-28">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_20%_0%,rgba(197,160,89,0.09),transparent_50%)]" />
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_90%_100%,rgba(197,160,89,0.05),transparent_45%)]" />
      <div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-[#c5a059]/40 to-transparent" />

      <div className="relative mx-auto max-w-7xl">
        <SectionHeading
          eyebrow="Why choose us"
          title="Travel, elevated"
          description="Cinematic planning, insider access, and calm support from the first conversation to the journey home."
          light
        />

        <Stagger
          className="grid gap-10 sm:grid-cols-2 lg:grid-cols-4 lg:gap-8"
          stagger={0.1}
          direction="up"
        >
          {pillars.map((pillar, index) => (
            <PillarCard key={pillar.title} {...pillar} index={index} />
          ))}
        </Stagger>

        <FadeIn className="my-16 md:my-20" delay={0.15}>
          <div className="h-px w-full bg-gradient-to-r from-transparent via-[#c5a059]/35 to-transparent" />
        </FadeIn>

        <FadeIn delay={0.1} blur>
          <ReviewsPanel items={testimonials} />
        </FadeIn>
      </div>
    </section>
  );
}
