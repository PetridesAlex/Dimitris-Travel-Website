'use client';

import type { ReactNode } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { ArrowRight, ChevronRight } from 'lucide-react';
import { motion, useReducedMotion } from 'framer-motion';
import { FadeIn, RevealImage, Stagger } from '@/components/motion/fade-in';
import { cn, formatCurrency } from '@/lib/utils';

export function SectionHeading({
  eyebrow,
  title,
  description,
  light = false,
  align = 'center',
}: {
  eyebrow?: string;
  title: string;
  description?: string;
  light?: boolean;
  align?: 'center' | 'left';
}) {
  return (
    <FadeIn
      className={`mb-12 ${align === 'center' ? 'mx-auto max-w-2xl text-center' : 'max-w-2xl text-left'}`}
      direction="up"
      distance={32}
      blur
      duration={0.85}
    >
      {eyebrow ? (
        <p className="mb-3 text-xs tracking-[0.25em] text-[var(--color-gold)] uppercase">
          {eyebrow}
        </p>
      ) : null}
      <h2
        className={`font-[family-name:var(--font-display)] text-4xl md:text-5xl ${
          light ? 'text-white' : 'text-[var(--color-ink)]'
        }`}
      >
        {title}
      </h2>
      {description ? (
        <p
          className={`mt-4 text-base leading-relaxed ${
            light ? 'text-white/70' : 'text-[var(--color-muted)]'
          }`}
        >
          {description}
        </p>
      ) : null}
    </FadeIn>
  );
}

export function ExperienceCard({
  href,
  name,
  tagline,
  image,
  index = 0,
  size = 'default',
  eyebrow = 'Experience',
  className,
}: {
  href: string;
  name: string;
  tagline: string;
  image: string;
  index?: number;
  size?: 'default' | 'large';
  eyebrow?: string;
  className?: string;
}) {
  const large = size === 'large';

  return (
    <FadeIn
      className={cn(
        'group relative overflow-hidden',
        large
          ? 'min-h-[400px] md:min-h-[480px] lg:min-h-[520px]'
          : 'min-h-[300px] md:min-h-[360px]',
        className,
      )}
      direction="up"
      distance={40}
      blur
      duration={0.85}
      delay={0.05 * index}
    >
      <Link href={href} className="absolute inset-0 block">
        <RevealImage className="absolute inset-0">
          <Image
            src={image}
            alt={name}
            fill
            loading="lazy"
            className="object-cover transition duration-700 group-hover:scale-105"
            sizes={
              large
                ? '(max-width:768px) 100vw, 50vw'
                : '(max-width:768px) 100vw, 33vw'
            }
          />
        </RevealImage>
        <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/35 to-black/10 transition duration-700 group-hover:via-black/45" />
        <div className="pointer-events-none absolute inset-0 opacity-0 transition duration-700 group-hover:opacity-100 bg-[radial-gradient(ellipse_at_30%_80%,rgba(197,160,89,0.2),transparent_55%)]" />
        <div
          className={cn(
            'absolute inset-x-0 bottom-0',
            large ? 'p-7 md:p-9' : 'p-5 md:p-6',
          )}
        >
          <p className="mb-2 text-[10px] font-semibold tracking-[0.26em] text-[#c5a059] uppercase">
            {eyebrow} {String(index + 1).padStart(2, '0')}
          </p>
          <h3
            className={cn(
              'font-[family-name:var(--font-display)] leading-[1.05] text-white',
              large ? 'text-3xl md:text-4xl lg:text-5xl' : 'text-2xl md:text-3xl',
            )}
          >
            {name}
          </h3>
          <p
            className={cn(
              'mt-2 text-white/70',
              large ? 'max-w-md text-sm md:text-base' : 'text-sm',
            )}
          >
            {tagline}
          </p>
          <span className="mt-4 inline-flex items-center gap-2 text-[11px] font-semibold tracking-[0.2em] text-[#c5a059] uppercase opacity-80 transition group-hover:opacity-100">
            Discover
            <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-1" strokeWidth={1.75} />
          </span>
        </div>
      </Link>
    </FadeIn>
  );
}

export function HotelCard({
  href,
  name,
  locationLabel,
  image,
  starRating,
}: {
  href: string;
  name: string;
  locationLabel: string;
  image: string;
  starRating: number;
}) {
  return (
    <FadeIn direction="up" distance={40} blur duration={0.85}>
      <Link href={href} className="group block">
        <RevealImage className="relative mb-4 aspect-[4/3] rounded-xl">
          <Image
            src={image}
            alt={name}
            fill
            loading="lazy"
            className="object-cover transition duration-700 group-hover:scale-105"
            sizes="(max-width:768px) 100vw, 33vw"
          />
        </RevealImage>
        <p className="text-xs tracking-widest text-[var(--color-gold)] uppercase">
          {starRating}★ Luxury
        </p>
        <h3 className="mt-1 font-[family-name:var(--font-display)] text-2xl text-white">
          {name}
        </h3>
        <p className="text-sm text-white/60">{locationLabel}</p>
      </Link>
    </FadeIn>
  );
}

export function ItineraryCard({
  href,
  title,
  citiesLabel,
  durationDays,
  priceFrom,
  currency,
  image,
  summary,
}: {
  href: string;
  title: string;
  citiesLabel: string;
  durationDays: number;
  priceFrom: number;
  currency: string;
  image: string;
  summary: string;
}) {
  return (
    <FadeIn
      className="group relative min-h-[420px] overflow-hidden rounded-xl"
      direction="up"
      distance={44}
      blur
      duration={0.9}
    >
      <Link href={href} className="absolute inset-0">
        <Image
          src={image}
          alt={title}
          fill
          loading="lazy"
          className="object-cover transition duration-700 group-hover:scale-105"
          sizes="(max-width:768px) 100vw, 33vw"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-black/20" />
        <span className="absolute top-4 left-4 rounded-full bg-white px-3 py-1 text-xs font-semibold tracking-wider text-[var(--color-ink)] uppercase">
          {durationDays} Days
        </span>
        <div className="absolute inset-x-0 bottom-0 p-6">
          <h3 className="font-[family-name:var(--font-display)] text-3xl text-white">
            {title}
          </h3>
          <p className="mt-2 text-sm text-white/70">{citiesLabel}</p>
          <p className="mt-3 line-clamp-2 text-sm text-white/60">{summary}</p>
          <p className="mt-4 text-sm text-[var(--color-gold)]">
            From {formatCurrency(priceFrom, currency)} / per person
          </p>
        </div>
      </Link>
    </FadeIn>
  );
}

export function BlogCard({
  href,
  title,
  excerpt,
  image,
  category,
  date,
}: {
  href: string;
  title: string;
  excerpt: string;
  image: string;
  category: string;
  date: string;
}) {
  return (
    <FadeIn direction="up" distance={40} blur duration={0.85}>
      <Link href={href} className="group block">
        <RevealImage className="relative mb-4 aspect-[16/10] rounded-xl">
          <Image
            src={image}
            alt={title}
            fill
            loading="lazy"
            className="object-cover transition duration-700 group-hover:scale-105"
            sizes="(max-width:768px) 100vw, 33vw"
          />
        </RevealImage>
        <p className="text-xs tracking-widest text-[var(--color-gold)] uppercase">
          {category} · {date}
        </p>
        <h3 className="mt-2 font-[family-name:var(--font-display)] text-2xl text-white group-hover:text-[var(--color-gold)]">
          {title}
        </h3>
        <p className="mt-2 line-clamp-2 text-sm text-white/60">{excerpt}</p>
      </Link>
    </FadeIn>
  );
}

export function CtaBand({
  title,
  locale = 'en',
}: {
  title: string;
  locale?: string;
}) {
  const reduce = useReducedMotion();

  return (
    <section className="relative overflow-hidden border-t border-[#c5a059]/15 bg-[#f7f3eb]">
      <div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-[#c5a059]/50 to-transparent" />
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_90%_50%,rgba(197,160,89,0.1),transparent_55%)]" />

      {/* Soft loading sweep across the band */}
      {!reduce ? (
        <motion.div
          aria-hidden
          className="pointer-events-none absolute inset-y-0 w-1/3 bg-gradient-to-r from-transparent via-white/40 to-transparent"
          animate={{ x: ['-40%', '340%'] }}
          transition={{ duration: 4.5, repeat: Infinity, ease: 'linear', repeatDelay: 1.2 }}
        />
      ) : null}

      <div className="relative mx-auto flex max-w-7xl flex-col items-start justify-between gap-8 px-6 py-12 md:flex-row md:items-center lg:px-8 lg:py-14">
        <FadeIn direction="up" distance={28} blur className="flex items-start gap-4 md:gap-5">
          <motion.div
            className="relative mt-1 flex h-11 w-11 shrink-0 items-center justify-center rounded-full border border-[#c5a059]/45 text-[#c5a059]"
            animate={
              reduce
                ? undefined
                : {
                    boxShadow: [
                      '0 0 0 0 rgba(197,160,89,0.35)',
                      '0 0 0 10px rgba(197,160,89,0)',
                      '0 0 0 0 rgba(197,160,89,0)',
                    ],
                  }
            }
            transition={{ duration: 2.4, repeat: Infinity, ease: 'easeOut' }}
          >
            <motion.span
              animate={reduce ? undefined : { rotate: [0, 90, 180, 270, 360] }}
              transition={{ duration: 12, repeat: Infinity, ease: 'linear' }}
              className="text-lg leading-none"
            >
              ✦
            </motion.span>
          </motion.div>

          <div>
            <p className="mb-2 text-[10px] font-semibold tracking-[0.3em] text-[#c5a059] uppercase">
              Begin your journey
            </p>
            <p className="max-w-xl font-[family-name:var(--font-display)] text-2xl leading-snug text-[#0c0c0c] md:text-3xl">
              {title}
            </p>
          </div>
        </FadeIn>

        <FadeIn direction="up" distance={24} delay={0.15}>
          <Link
            href={`/${locale}/plan-your-journey`}
            className="group relative inline-flex h-12 min-w-[220px] items-center justify-center overflow-hidden px-7 text-[12px] font-semibold tracking-[0.2em] text-[#0c0c0c] uppercase shadow-[0_14px_40px_-18px_rgba(197,160,89,0.9)]"
          >
            {/* Base rich gold fill */}
            <span
              aria-hidden
              className="absolute inset-0 bg-gradient-to-r from-[#a8863f] via-[#c5a059] to-[#d4b56e]"
            />

            {/* Loading-style fill that sweeps continuously */}
            {!reduce ? (
              <motion.span
                aria-hidden
                className="absolute inset-y-0 left-0 w-full bg-gradient-to-r from-transparent via-white/35 to-transparent"
                animate={{ x: ['-100%', '100%'] }}
                transition={{
                  duration: 1.8,
                  repeat: Infinity,
                  ease: 'easeInOut',
                  repeatDelay: 0.6,
                }}
              />
            ) : null}

            {/* Hover fill deepen */}
            <span
              aria-hidden
              className="absolute inset-0 origin-left scale-x-0 bg-gradient-to-r from-[#8f7132] via-[#b8923f] to-[#c5a059] transition-transform duration-500 ease-out group-hover:scale-x-100"
            />

            <span className="relative z-10 inline-flex items-center gap-2.5">
              Plan Your Journey
              <ArrowRight
                className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1"
                strokeWidth={1.75}
              />
            </span>
          </Link>
        </FadeIn>
      </div>
    </section>
  );
}

export function Breadcrumbs({
  items,
}: {
  items: { label: string; href?: string }[];
}) {
  return (
    <nav aria-label="Breadcrumb" className="relative bg-[#0c0c0c]">
      <div className="pointer-events-none absolute inset-x-0 bottom-0 h-px bg-gradient-to-r from-transparent via-[#c5a059]/25 to-transparent" />
      <FadeIn
        className="mx-auto max-w-7xl px-6 py-5 lg:px-8"
        direction="none"
        duration={0.55}
      >
        <ol className="flex flex-wrap items-center gap-x-1 gap-y-2">
          {items.map((item, i) => {
            const isLast = i === items.length - 1;

            return (
              <li key={`${item.label}-${i}`} className="flex min-w-0 items-center gap-1">
                {i > 0 ? (
                  <ChevronRight
                    className="mx-1 h-3 w-3 shrink-0 text-[#c5a059]/45"
                    strokeWidth={1.5}
                    aria-hidden
                  />
                ) : null}

                {item.href && !isLast ? (
                  <Link
                    href={item.href}
                    className={cn(
                      'group relative text-[10px] font-semibold tracking-[0.22em] text-white/45 uppercase',
                      'transition-colors duration-300 hover:text-[#c5a059]',
                    )}
                  >
                    {item.label}
                    <span className="absolute -bottom-0.5 left-0 h-px w-0 bg-[#c5a059] transition-all duration-500 group-hover:w-full" />
                  </Link>
                ) : (
                  <span
                    aria-current={isLast ? 'page' : undefined}
                    className={cn(
                      'min-w-0 truncate text-[10px] font-medium tracking-[0.14em]',
                      isLast
                        ? 'max-w-[min(100%,28rem)] text-[#c5a059]/90 normal-case tracking-[0.04em] md:tracking-[0.06em]'
                        : 'text-white/45 uppercase',
                    )}
                    title={item.label}
                  >
                    {item.label}
                  </span>
                )}
              </li>
            );
          })}
        </ol>
      </FadeIn>
    </nav>
  );
}

export function DestinationSubnav({
  items,
}: {
  items: { id: string; label: string; icon?: ReactNode }[];
}) {
  return (
    <div className="sticky top-0 z-40 border-b border-white/10 bg-[var(--color-ink)]/95 backdrop-blur">
      <Stagger
        className="mx-auto flex max-w-7xl gap-6 overflow-x-auto px-6 py-4 lg:px-8"
        stagger={0.05}
        direction="up"
      >
        {items.map((item, index) => (
          <a
            key={item.id}
            href={`#${item.id}`}
            className={`shrink-0 border-b-2 pb-1 text-xs tracking-[0.18em] uppercase transition ${
              index === 0
                ? 'border-[var(--color-gold)] text-[var(--color-gold)]'
                : 'border-transparent text-white/60 hover:text-white'
            }`}
          >
            {item.label}
          </a>
        ))}
      </Stagger>
    </div>
  );
}

export function FactsGrid({
  facts,
  dark = false,
}: {
  facts: { label: string; value: string }[];
  dark?: boolean;
}) {
  return (
    <Stagger className="mt-8 grid gap-4 sm:grid-cols-2" stagger={0.08} direction="up">
      {facts.map((fact) => (
        <div
          key={fact.label}
          className={`border-l-2 border-[var(--color-gold)] pl-4 ${
            dark ? 'text-white' : 'text-[var(--color-ink)]'
          }`}
        >
          <p className="text-xs tracking-widest text-[var(--color-gold)] uppercase">
            {fact.label}
          </p>
          <p
            className={`mt-1 text-sm ${dark ? 'text-white/80' : 'text-[var(--color-muted)]'}`}
          >
            {fact.value}
          </p>
        </div>
      ))}
    </Stagger>
  );
}
